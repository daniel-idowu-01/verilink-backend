import { AuthService } from "./AuthService";
import repositories from "../repositories/index";
import { ProductService } from "./ProductService";

export default {
  productService: new ProductService(repositories.productRepository),
  authService: new AuthService(
    repositories.userRepository,
    repositories.userRepository
  ),
};
