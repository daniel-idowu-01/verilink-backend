import { body } from "express-validator";
import controllers from "../controllers/index";
import { productRoutes } from "./ProductRoutes";
import { Router, RequestHandler } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

// Auth routes
router.post(
  "/auth/register",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 6 }),
    // validateRequest,
  ],
  controllers.auth.registerUser
);
router.post(
  "/auth/register-vendor",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 6 }),
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
router.use("/products", authMiddleware as RequestHandler, productRoutes());

// Transaction routes (protected)
// router.use('/transactions', authMiddleware as RequestHandler, transactionRoutes(transactionService));

export default router;
