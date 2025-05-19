import { IProduct } from "../../models/interfaces/IProduct";
import { PaginatedProductsResult } from "../../models/Product";

export interface IProductService {
  createProduct(productData: Partial<IProduct>): Promise<IProduct>;
  getProductById(id: string): Promise<IProduct | null>;
  getProductByBarcode(barcode: string): Promise<IProduct | null>;
  getVendorProducts(
    vendorId: string,
    query: any,
    page: number,
    limit: number
  ): Promise<IProduct[]>;
  getVendorProductsPaginated(
    vendorId: string,
    query: any,
    page: number,
    limit: number
  ): Promise<PaginatedProductsResult>;
  updateProduct(
    id: string,
    updateData: Partial<IProduct>
  ): Promise<IProduct | null>;
  deleteProduct(id: string): Promise<void>;
  checkProductStock(productId: string, quantity: number): Promise<boolean>;
  updateProductStock(
    productId: string,
    quantityChange: number
  ): Promise<IProduct | null>;
}
