import services from "../services/index";
import { AuthController } from "./AuthController";
import { ProductController } from "./ProductController";
import { TransactionController } from "./TransactionControllers";

export default {
  products: new ProductController(services.productService),
  auth: new AuthController(services.authService),
  transactions: new TransactionController(services.transactionService)
};
