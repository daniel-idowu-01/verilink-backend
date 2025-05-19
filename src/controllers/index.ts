import services from "../services/index";
import { CartController } from "./CartController";
import { AuthController } from "./AuthController";
import { ProductController } from "./ProductController";
import { TransactionController } from "./TransactionController";

export default {
  products: new ProductController(services.productService),
  auth: new AuthController(services.authService),
  transactions: new TransactionController(services.transactionService),
  cart: new CartController(services.cartService),
};
