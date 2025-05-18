import repositories from "../repositories/index";
import { ProductService } from "./ProductService";

export default {
  productService: new ProductService(repositories.productRepository),
};
