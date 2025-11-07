import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import config from "../config.js";

const { Schema } = mongoose;

/**
 * User Schema
 * Stores user information including authentication and course associations
 */
const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Don't include password in queries by default
    },
    learnedSubjects: [
      {
        type: Schema.Types.ObjectId,
        ref: "Subject", // Reference to courses/subjects collection
      },
    ],
    role: {
      type: String,
      enum: ["student", "teacher", "admin"],
      default: "student",
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

/**
 * Hash password before saving to database
 */
UserSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) {
    return next();
  }

  try {
    // Hash password with bcrypt
    const salt = await bcrypt.genSalt(config.bcryptRounds);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Compare provided password with hashed password
 * @param {string} candidatePassword - Password to compare
 * @returns {Promise<boolean>} - True if passwords match
 */
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

/**
 * Convert user document to JSON, excluding password
 */
UserSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

const User = mongoose.model("User", UserSchema);

export default User;

