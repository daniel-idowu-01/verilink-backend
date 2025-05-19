import { body } from "express-validator";
import { cartRoutes } from "./CartRoutes";
import controllers from "../../controllers";
import constants from "../../config/constants";
import { productRoutes } from "./ProductRoutes";
import { Router, RequestHandler } from "express";
import { transactionRoutes } from "./TransactionRoutes";
import { authMiddleware } from "../../middlewares/authMiddleware";

const router = Router();

// Auth routes
router.post(
  "/auth/register",
  [
    body("email").isEmail().normalizeEmail(),
    body("password")
      .trim()
      .matches(constants.passwordRegex)
      .withMessage(
        "Password must be at least 8 characters, include an uppercase letter, a lowercase letter, a number, and a special character (@$!%*?&)"
      )
      .escape(),
    // validateRequest,
  ],
  controllers.auth.registerUser
);

router.post(
  "/auth/register-vendor",
  [
    body("email").isEmail().normalizeEmail(),
    body("password")
      .trim()
      .matches(constants.passwordRegex)
      .withMessage(
        "Password must be at least 8 characters, include an uppercase letter, a lowercase letter, a number, and a special character (@$!%*?&)"
      )
      .escape(),
    body("businessName").notEmpty(),
    body("businessAddress").notEmpty(),
    // validateRequest,
  ],
  controllers.auth.registerVendor
);

router.post(
  "/auth/login",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").notEmpty(),
    // validateRequest,
  ],
  controllers.auth.login
);

// Product routes (protected)
router.use("/products", productRoutes());

// Transaction routes (protected)
router.use("/transactions", transactionRoutes());

// Cart routes (protected)
router.use("/cart", cartRoutes());

export default router;
