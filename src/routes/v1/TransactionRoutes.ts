import { param } from "express-validator";
import { Router, RequestHandler } from "express";
import { rolesMiddleware } from "../middlewares/rolesMiddleware";
import controllers from "../controllers/index";
// import { validateRequest } from "../middlewares/validateRequest";

export const transactionRoutes = (): Router => {
  const router = Router();
  const transactionController = controllers.transactions;

  // Customer checkout
  router.post(
    "/checkout",
    rolesMiddleware(["customer"]) as RequestHandler,
    transactionController.createTransaction
  );

  // Transaction history
  router.get(
    "/",
    rolesMiddleware(["customer", "vendor", "admin"]) as RequestHandler,
    transactionController.getUserTransactions
  );

  // Transaction details
  router.get(
    "/:id",
    [
      param("id").isMongoId(),
      // validateRequest,
      rolesMiddleware(["customer", "vendor", "admin"]) as RequestHandler,
    ],
    transactionController.getTransaction
  );

  return router;
};
