import { RequestHandler } from "express";
import { IProduct } from "../../models/Product";

export interface IProductController {
  createProduct: RequestHandler;
  getProduct: RequestHandler;
  getProductByBarcode: RequestHandler;
  updateProduct: RequestHandler;
  deleteProduct: RequestHandler;
  getVendorProducts: RequestHandler;
}
