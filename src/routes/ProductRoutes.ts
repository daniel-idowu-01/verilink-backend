import { Router, RequestHandler } from "express";
import { param } from "express-validator";
import { authMiddleware } from "../middlewares/authMiddleware";
import { rolesMiddleware } from "../middlewares/rolesMiddleware";
// import { validateRequest } from "../middlewares/validateRequest";
import { ProductController } from "../controllers/ProductController";
import { IProductService } from "../services/interfaces/IProductService";

export const productRoutes = (productService: IProductService): Router => {
  const router = Router();
  const productController = new ProductController(productService);

  // Apply auth middleware to all product routes
  router.use(authMiddleware as RequestHandler);

  // Create product - only owners and managers
  router.post(
    "/",
    rolesMiddleware(["owner", "manager"]) as RequestHandler,
    productController.createProduct
  );

  // Get vendor products - accessible to all vendor roles
  router.get(
    "/",
    rolesMiddleware(["owner", "manager", "sales"]) as RequestHandler,
    productController.getVendorProducts
  );

  // Get single product - accessible to all vendor roles
  router.get(
    "/:id",
    [
      param("id").isMongoId().withMessage("Invalid product ID"),
      // validateRequest,
      rolesMiddleware(["owner", "manager", "sales"]) as RequestHandler,
    ],
    productController.getProduct
  );

  // Get product by barcode - accessible to all vendor roles
  router.get(
    "/barcode/:barcode",
    rolesMiddleware(["owner", "manager", "sales"]) as RequestHandler,
    productController.getProductByBarcode
  );

  // Update product - only owners and managers
  router.put(
    "/:id",
    [
      param("id").isMongoId().withMessage("Invalid product ID"),
      // validateRequest,
      rolesMiddleware(["owner", "manager"]) as RequestHandler,
    ],
    productController.updateProduct
  );

  // Delete product - only owners
  router.delete(
    "/:id",
    [
      param("id").isMongoId().withMessage("Invalid product ID"),
      // validateRequest,
      rolesMiddleware(["owner"]) as RequestHandler, // Only owners can delete
    ],
    productController.deleteProduct
  );

  return router;
};
