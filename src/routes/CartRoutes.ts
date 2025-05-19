import controllers from "../controllers/index";
import { Router, RequestHandler } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { rolesMiddleware } from "../middlewares/rolesMiddleware";
import { body, param } from "express-validator";
// import { validateRequest } from "../middlewares/validateRequest";

export const cartRoutes = (): Router => {
  const router = Router();
  const cartController = controllers.cart;

  router.use(authMiddleware as RequestHandler);
  router.use(rolesMiddleware(["customer"]) as RequestHandler);

  router.get("/", cartController.getCart);
  router.post("/add", cartController.addToCart);
  router.put("/update/:productId", cartController.updateCartItem);
  router.delete("/remove/:productId", cartController.removeFromCart);
  router.delete("/clear", cartController.clearCart);

  return router;
};
