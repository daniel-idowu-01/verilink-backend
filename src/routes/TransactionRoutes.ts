import { Router } from "express";
import { rolesMiddleware } from "../middlewares/rolesMiddleware";
import { param } from "express-validator";
// import { validateRequest } from "../middlewares/validateRequest";

export const transactionRoutes = (transactionService: any): Router => {
  const router = Router();

  // Customer checkout
  router.post(
    "/checkout",
    rolesMiddleware(["customer"]),
    transactionController.createTransaction
  );

  // Transaction history
  router.get(
    "/",
    rolesMiddleware(["customer", "vendor", "admin"]),
    transactionController.getUserTransactions
  );

  // Transaction details
  router.get(
    "/:id",
    [
      param("id").isMongoId(),
      // validateRequest,
      rolesMiddleware(["customer", "vendor", "admin"]),
    ],
    transactionController.getTransaction
  );

  return router;
};
