import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Logger from "../utils/logger.js";
import config from "../config.js";

const FILE_NAME = "authController";

/**
 * Generate JWT token with user data (excluding password)
 * @param {Object} user - User object from database
 * @returns {string} - JWT token
 */
const generateToken = (user) => {
  // Create payload with all user data except password
  const payload = {
    id: user._id,
    name: user.name,
    role: user.role,
    courses: user.courses,
  };

  // Sign token with secret and expiration
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
};

/**
 * @route POST /auth/login
 * @desc Login user and return JWT token
 * @body {string} name - Username
 * @body {string} password - User password
 */
export const login = async (req, res) => {
  //#swagger.tags = ['Authentication']
  //#swagger.summary = 'Login user and receive JWT token'

  try {
    const { name, password } = req.body;

    // Validate input
    if (!name || !password) {
      Logger.warn([FILE_NAME], "Login attempt with missing credentials");
      return res.status(400).json({
        success: false,
        message: "Please provide both name and password",
      });
    }

    // Find user by name and include password field (normally excluded)
    const user = await User.findOne({ name }).select("+password");

    if (!user) {
      Logger.warn([FILE_NAME], `Login attempt with invalid name: ${name}`);
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Compare provided password with hashed password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      Logger.warn([FILE_NAME], `Login attempt with invalid password for user: ${name}`);
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate JWT token with user data
    const token = generateToken(user);

    // Convert user to JSON (password will be excluded automatically)
    const userData = user.toJSON();

    Logger.success([FILE_NAME], `User logged in successfully: ${name}`);

    // Return token and user data
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: userData,
    });
  } catch (error) {
    Logger.error([FILE_NAME], `Login error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};

/**
 * @route POST /auth/register
 * @desc Register a new user (admin only - does not return token, admin creates for others)
 * @access Private (admin only)
 * @body {string} name - Username (must be unique)
 * @body {string} password - User password (min 6 characters)
 * @body {string} role - User role (optional, default: "student")
 */
export const register = async (req, res) => {
  //#swagger.tags = ['Authentication']
  //#swagger.summary = 'Register a new user (admin only)'
  //#swagger.security = [{"bearerAuth": []}]

  try {
    const { name, password, role } = req.body;

    // Validate input
    if (!name || !password) {
      Logger.warn([FILE_NAME], "Registration attempt with missing fields");
      return res.status(400).json({
        success: false,
        message: "Please provide both name and password",
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ name });
    if (existingUser) {
      Logger.warn([FILE_NAME], `Registration attempt with existing name: ${name}`);
      return res.status(400).json({
        success: false,
        message: "Username already exists",
      });
    }

    // Validate role if provided
    const validRoles = ["student", "teacher", "admin"];
    const userRole = role && validRoles.includes(role) ? role : "student";

    // Create new user (password will be hashed automatically by pre-save hook)
    const user = new User({
      name: name.trim(),
      password, // Will be hashed by pre-save hook
      role: userRole,
      courses: [],
    });

    // Save user to database
    await user.save();

    // Convert user to JSON (password will be excluded automatically)
    const userData = user.toJSON();

    Logger.success([FILE_NAME], `User ${name} registered successfully by admin ${req.user.name}`);

    // Return user data (no token - admin is creating for someone else)
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: userData,
    });
  } catch (error) {
    Logger.error([FILE_NAME], `Registration error: ${error.message}`);
    
    // Handle validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
};

/**
 * @route GET /auth/me
 * @desc Get current user information from JWT token
 * @access Private (requires authentication)
 */
export const getCurrentUser = async (req, res) => {
  //#swagger.tags = ['Authentication']
  //#swagger.summary = 'Get current authenticated user information'
  //#swagger.security = [{"bearerAuth": []}]

  try {
    // User is attached to request by auth middleware
    const user = await User.findById(req.user.id).populate("learnedSubjects");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    Logger.success([FILE_NAME], `User data retrieved: ${user.name}`);
    res.status(200).json({
      success: true,
      user: user.toJSON(),
    });
  } catch (error) {
    Logger.error([FILE_NAME], `Get current user error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * @route POST /auth/mark-subject-done
 * @desc Mark a subject as learned by adding it to user's learnedSubjects array
 * @access Private (requires authentication)
 * @body {string} subjectId - Subject ID to mark as done
 */
export const markSubjectDone = async (req, res) => {
  //#swagger.tags = ['Authentication']
  //#swagger.summary = 'Mark a subject as learned'
  //#swagger.security = [{"bearerAuth": []}]

  try {
    const { subjectId } = req.body;

    if (!subjectId) {
      return res.status(400).json({
        success: false,
        message: "Subject ID is required",
      });
    }

    // User is attached to request by auth middleware
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if subject is already in learnedSubjects
    if (user.learnedSubjects.includes(subjectId)) {
      return res.status(200).json({
        success: true,
        message: "Subject already marked as done",
        user: user.toJSON(),
      });
    }

    // Add subject to learnedSubjects
    user.learnedSubjects.push(subjectId);
    await user.save();

    Logger.success([FILE_NAME], `Subject ${subjectId} marked as done by ${user.name}`);
    res.status(200).json({
      success: true,
      message: "Subject marked as done",
      user: user.toJSON(),
    });
  } catch (error) {
    Logger.error([FILE_NAME], `Mark subject done error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * @route POST /auth/unmark-subject-done
 * @desc Unmark a subject as learned by removing it from user's learnedSubjects array
 * @access Private (requires authentication)
 * @body {string} subjectId - Subject ID to unmark as done
 */
export const unmarkSubjectDone = async (req, res) => {
  //#swagger.tags = ['Authentication']
  //#swagger.summary = 'Unmark a subject as learned'
  //#swagger.security = [{"bearerAuth": []}]

  try {
    const { subjectId } = req.body;

    if (!subjectId) {
      return res.status(400).json({
        success: false,
        message: "Subject ID is required",
      });
    }

    // User is attached to request by auth middleware
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if subject is in learnedSubjects
    const subjectIndex = user.learnedSubjects.findIndex(
      (id) => id.toString() === subjectId.toString()
    );

    if (subjectIndex === -1) {
      return res.status(200).json({
        success: true,
        message: "Subject was not marked as done",
        user: user.toJSON(),
      });
    }

    // Remove subject from learnedSubjects
    user.learnedSubjects.splice(subjectIndex, 1);
    await user.save();

    Logger.success([FILE_NAME], `Subject ${subjectId} unmarked as done by ${user.name}`);
    res.status(200).json({
      success: true,
      message: "Subject unmarked as done",
      user: user.toJSON(),
    });
  } catch (error) {
    Logger.error([FILE_NAME], `Unmark subject done error: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

