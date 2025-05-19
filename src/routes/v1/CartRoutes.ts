import { body, param } from "express-validator";
import { Router, RequestHandler } from "express";
import controllers from "../../controllers/index";
import { cartValidationSchemas } from "../../validations";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { rolesMiddleware } from "../../middlewares/rolesMiddleware";

export const cartRoutes = (): Router => {
  const router = Router();
  const cartController = controllers.cart;

  router.use(authMiddleware as RequestHandler);
  router.use(rolesMiddleware(["customer"]) as RequestHandler);

  router.get("/", cartController.getCart);
  router.post(
    "/add",
    cartValidationSchemas.addToCart,
    cartController.addToCart
  );
  router.put(
    "/update/:productId",
    cartValidationSchemas.updateCartItem,
    cartController.updateCartItem
  );
  router.delete("/remove/:productId", cartController.removeFromCart);
  router.delete("/clear", cartController.clearCart);

  return router;
};
