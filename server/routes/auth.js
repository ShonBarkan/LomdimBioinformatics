import express from "express";
import { login, register, getCurrentUser } from "../controllers/authController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

/**
 * @route POST /auth/register
 * @desc Register a new user and receive JWT token
 * @access Public
 */
router.post("/register", register);

/**
 * @route POST /auth/login
 * @desc Login user and receive JWT token
 * @access Public
 */
router.post("/login", login);

/**
 * @route GET /auth/me
 * @desc Get current authenticated user information
 * @access Private (requires authentication)
 */
router.get("/me", authenticate, getCurrentUser);

export default router;

