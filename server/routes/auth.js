import express from "express";
import { login, register, getCurrentUser, markSubjectDone, unmarkSubjectDone } from "../controllers/authController.js";
import { authenticate } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/role.js";

const router = express.Router();

/**
 * @route POST /auth/register
 * @desc Register a new user (admin only)
 * @access Private (admin only)
 */
router.post("/register", authenticate, requireAdmin, register);

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

/**
 * @route POST /auth/mark-subject-done
 * @desc Mark a subject as learned by adding it to user's learnedSubjects array
 * @access Private (requires authentication)
 */
router.post("/mark-subject-done", authenticate, markSubjectDone);

/**
 * @route POST /auth/unmark-subject-done
 * @desc Unmark a subject as learned by removing it from user's learnedSubjects array
 * @access Private (requires authentication)
 */
router.post("/unmark-subject-done", authenticate, unmarkSubjectDone);

export default router;

