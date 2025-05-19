import { body } from "express-validator";
import { cartRoutes } from "./CartRoutes";
import controllers from "../../controllers";
import constants from "../../config/constants";
import { productRoutes } from "./ProductRoutes";
import { Router, RequestHandler } from "express";
import { transactionRoutes } from "./TransactionRoutes";
import { authValidationSchemas } from "../../validations";
import { authMiddleware } from "../../middlewares/authMiddleware";

const router = Router();

// Auth routes
router.post(
  "/auth/register",
  authValidationSchemas.registerUser,
  controllers.auth.registerUser
);

router.post(
  "/auth/register-vendor",
  authValidationSchemas.registerVendor,
  controllers.auth.registerVendor
);

router.post(
  "/auth/login",
  authValidationSchemas.login,
  controllers.auth.login
);

// Product routes (protected)
router.use("/products", productRoutes());

// Transaction routes (protected)
router.use("/transactions", transactionRoutes());

// Cart routes (protected)
router.use("/cart", cartRoutes());

export default router;
