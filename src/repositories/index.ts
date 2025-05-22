import models from "../models/index";
import { CartRepository } from "./CartRepository";
import { UserRepository } from "./UserRepository";
import { ProductRepository } from "./ProductRepository";
import { TransactionRepository } from "./TransactionRepository";
import { VendorRepository } from "./VendorRepository";

export default {
  productRepository: new ProductRepository(models.Product),
  userRepository: new UserRepository(models.User),
  transactionRepository: new TransactionRepository(models.Transaction),
  cartRepository: new CartRepository(models.Cart),
  vendorRepository: new VendorRepository(models.Vendor),
};
