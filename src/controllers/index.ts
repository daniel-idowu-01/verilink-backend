import services from "../services/index";
import { AuthController } from "./AuthController";
import { ProductController } from "./ProductController";

export default {
  products: new ProductController(services.productService),
  auth: new AuthController(services.authService),
};
