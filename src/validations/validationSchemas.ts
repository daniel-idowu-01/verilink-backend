import { body } from "express-validator";
import { constants } from "../config/constants";

export const authValidationSchemas = {
  registerUser: [
    body().notEmpty().withMessage("Request body cannot be empty"),
    body("email")
      .isEmail()
      .withMessage("Email is not valid")
      .normalizeEmail({ gmail_remove_dots: false }),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .trim()
      .matches(constants.passwordRegex)
      .withMessage(
        "Password must be at least 8 characters, include an uppercase letter, a lowercase letter, a number, and a special character (@$!%*?&)"
      ),
  ],

  registerVendor: [
    body("email").isEmail().normalizeEmail(),
    body("password")
      .trim()
      .matches(constants.passwordRegex)
      .withMessage(
        "Password must be at least 8 characters, include an uppercase letter, a lowercase letter, a number, and a special character (@$!%*?&)"
      )
      .escape(),
    body("businessName").notEmpty().trim().escape(),
    body("businessAddress").notEmpty().trim().escape(),
  ],

  login: [
    body("email").isEmail().normalizeEmail(),
    body("password").notEmpty().trim(),
  ],
};

export const productValidationSchemas = {
  createProduct: [
    body("name").notEmpty().trim().escape(),
    body("description").optional().trim().escape(),
    body("price").isFloat({ min: 0 }),
    body("category").optional().trim().escape(),
    body("stockQuantity").isInt({ min: 0 }),
  ],

  updateProduct: [
    body("name").optional().trim().escape(),
    body("description").optional().trim().escape(),
    body("price").optional().isFloat({ min: 0 }),
    body("category").optional().trim().escape(),
    body("stockQuantity").optional().isInt({ min: 0 }),
  ],
};

export const cartValidationSchemas = {
  addToCart: [
    body("productId").isMongoId(),
    body("quantity").optional().isInt({ min: 1 }),
  ],

  updateCartItem: [body("quantity").isInt({ min: 1 })],
};
