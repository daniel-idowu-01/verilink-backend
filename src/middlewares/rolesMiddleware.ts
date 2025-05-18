import { Request, Response, NextFunction } from "express";

/**
 * Middleware to check if user has required roles
 */
export function rolesMiddleware(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    // Ensure user is authenticated first
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No user information found",
      });
    }

    // Check if user has any of the allowed roles
    const userRoles = req.user.roles || [];
    const hasPermission = allowedRoles.some((role) => userRoles.includes(role));

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message:
          "Forbidden: You do not have permission to access this resource",
        requiredRoles: allowedRoles,
        yourRoles: userRoles,
      });
    }

    next();
  };
}

/**
 * Middleware to check if user has ALL of the specified roles
 */
export function allRolesMiddleware(requiredRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No user information found",
      });
    }

    const userRoles = req.user.roles || [];
    const hasAllRoles = requiredRoles.every((role) => userRoles.includes(role));

    if (!hasAllRoles) {
      return res.status(403).json({
        success: false,
        message:
          "Forbidden: You do not have all required roles for this resource",
        requiredRoles,
        yourRoles: userRoles,
      });
    }

    next();
  };
}

/**
 * Middleware to check if user has at least one of the specified roles OR is the owner of the resource
 */
export function rolesOrOwnerMiddleware(
  allowedRoles: string[],
  ownerCheckFn?: (req: Request) => Promise<boolean> | boolean
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No user information found",
      });
    }

    // Check if user has any of the allowed roles
    const userRoles = req.user.roles || [];
    const hasPermission = allowedRoles.some((role) => userRoles.includes(role));

    if (hasPermission) {
      return next();
    }

    // If owner check function is provided and user is owner, allow access
    if (ownerCheckFn) {
      try {
        const isOwner = await ownerCheckFn(req);
        if (isOwner) {
          return next();
        }
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: "Error checking resource ownership",
        });
      }
    }

    return res.status(403).json({
      success: false,
      message: "Forbidden: You do not have permission to access this resource",
      requiredRoles: allowedRoles,
      yourRoles: userRoles,
    });
  };
}
