import jwt from "jsonwebtoken";
import config from "../config.js";
import Logger from "../utils/logger.js";

/**
 * Middleware to authenticate JWT tokens
 * Verifies the token and attaches user data to the request object
 */
export const authenticate = (req, res, next) => {
  try {
    // Get token from Authorization header
    // Format: "Bearer <token>"
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      Logger.warn(["auth.js"], "Authentication attempt without valid token");
      return res.status(401).json({
        success: false,
        message: "No token provided or invalid format",
      });
    }

    // Extract token from header
    const token = authHeader.substring(7); // Remove "Bearer " prefix

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    // Verify and decode token
    try {
      const decoded = jwt.verify(token, config.jwtSecret);

      // Attach user data to request object
      // This makes user data available in subsequent route handlers
      req.user = {
        id: decoded.id,
        name: decoded.name,
        role: decoded.role,
        courses: decoded.courses,
      };

      Logger.info(["auth.js"], `Authenticated user: ${decoded.name}`);
      next(); // Continue to next middleware/route handler
    } catch (jwtError) {
      // Token is invalid or expired
      Logger.warn(["auth.js"], `Invalid or expired token: ${jwtError.message}`);
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }
  } catch (error) {
    Logger.error(["auth.js"], `Authentication error: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Authentication error",
    });
  }
};

