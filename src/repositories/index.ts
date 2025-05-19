import models from "../models/index"
import { UserRepository } from "./UserRepository";
import { ProductRepository } from "./ProductRepository";
import { TransactionRepository } from "./TransactionRepository";

export default {
  productRepository: new ProductRepository(models.Product),
  userRepository: new UserRepository(models.User),
  transactionRepository: new TransactionRepository(models.Transaction)
};
