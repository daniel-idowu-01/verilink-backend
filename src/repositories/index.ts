import models from "../models/index"
import { UserRepository } from "./UserRepository";
import { ProductRepository } from "./ProductRepository";

export default {
  productRepository: new ProductRepository(models.Product),
  userRepository: new UserRepository(models.User)
};
