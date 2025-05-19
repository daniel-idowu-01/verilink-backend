import { AuthService } from "./AuthService";
import { CartService } from "./CartService";
import repositories from "../repositories/index";
import { ProductService } from "./ProductService";
import { TransactionService } from "./TransactionService";

export default {
  productService: new ProductService(repositories.productRepository),
  authService: new AuthService(
    repositories.userRepository,
    repositories.userRepository
  ),
  transactionService: new TransactionService(
    repositories.transactionRepository,
    repositories.productRepository,
    repositories.cartRepository
  ),
  cartService: new CartService(
    repositories.productRepository,
    repositories.cartRepository
  )
};
