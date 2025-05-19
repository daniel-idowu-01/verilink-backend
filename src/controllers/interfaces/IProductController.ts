import { RequestHandler } from "express";

export interface IProductController {
  createProduct: RequestHandler;
  getProduct: RequestHandler;
  getProductByBarcode: RequestHandler;
  updateProduct: RequestHandler;
  deleteProduct: RequestHandler;
  getVendorProducts: RequestHandler;
}
