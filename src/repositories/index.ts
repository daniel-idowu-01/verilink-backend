import models from "../models/index"
import { ProductRepository } from "./ProductRepository";

export default {
  productRepository: new ProductRepository(models.Product),
};
