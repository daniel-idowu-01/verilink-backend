import services from "../services/index";
import { ProductController } from "./ProductController";

export default { products: new ProductController(services.productService) };
