import { Document } from "mongoose";
import { IProduct } from "../../models/interfaces/IProduct";

export interface IProductRepository {
  create(productData: Partial<IProduct>): Promise<IProduct>;
  findById(id: string): Promise<IProduct | null>;
  findByBarcode(barcode: string): Promise<IProduct | null>;
  findByVendor(
    vendorId: string,
    query: any,
    page: number,
    limit: number
  ): Promise<IProduct[]>;
  update(id: string, productData: Partial<IProduct>): Promise<IProduct | null>;
  delete(id: string): Promise<void>;
  checkStock(productId: string, quantity: number): Promise<boolean>;
  updateStock(
    productId: string,
    quantityChange: number
  ): Promise<IProduct | null>;
  countDocuments(filter: any): Promise<number>;
}
