import Logger from "../utils/logger.js";

/**
 * Middleware to check if user has required role(s)
 * Must be used after authenticate middleware
 * @param {string|string[]} allowedRoles - Single role or array of allowed roles
 * @returns {Function} - Express middleware function
 */
export const requireRole = (allowedRoles) => {
  // Convert single role to array for consistent handling
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  return (req, res, next) => {
    try {
      // Check if user is authenticated (should be set by auth middleware)
      if (!req.user) {
        Logger.warn(["role.js"], "Role check attempted without authentication");
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      // Check if user's role is in the allowed roles list
      if (!roles.includes(req.user.role)) {
        Logger.warn(
          ["role.js"],
          `User ${req.user.name} (${req.user.role}) attempted to access ${roles.join(" or ")} only route`
        );
        return res.status(403).json({
          success: false,
          message: "Insufficient permissions. Access denied.",
        });
      }

      // User has required role, continue
      Logger.info(["role.js"], `User ${req.user.name} (${req.user.role}) authorized`);
      next();
    } catch (error) {
      Logger.error(["role.js"], `Role check error: ${error.message}`);
      return res.status(500).json({
        success: false,
        message: "Authorization error",
      });
    }
  };
};

// Convenience middleware for common role checks
export const requireAdmin = requireRole("admin");
export const requireTeacher = requireRole(["teacher", "admin"]);
export const requireStudent = requireRole(["student", "teacher", "admin"]);

