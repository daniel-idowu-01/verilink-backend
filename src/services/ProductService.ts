import { BadRequestError } from "../utils/errors";
import { generateBarcode } from "../utils/barcodeGenerator";
import { IProductService } from "./interfaces/IProductService";
import { IProduct, PaginatedProductsResult } from "../models/Product";
import { IProductRepository } from "../repositories/interfaces/IProductRepository";

export class ProductService implements IProductService {
  constructor(private productRepository: IProductRepository) {}

  async createProduct(productData: Partial<IProduct>): Promise<IProduct> {
    if (!productData.barcode) {
      productData.barcode = await generateBarcode(
        productData.barcodeType || "EAN"
      );
    }
    return this.productRepository.create(productData);
  }

  async getProductById(id: string): Promise<IProduct | null> {
    return this.productRepository.findById(id);
  }

  async getProductByBarcode(barcode: string): Promise<IProduct | null> {
    return this.productRepository.findByBarcode(barcode);
  }

  async getVendorProducts(
    vendorId: string,
    query: any = {},
    page: number = 1,
    limit: number = 10
  ): Promise<IProduct[]> {
    return this.productRepository.findByVendor(vendorId, query, page, limit);
  }

  async getVendorProductsPaginated(
    vendorId: string,
    query: any = {},
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedProductsResult> {
    try {
      // Validate input parameters
      if (page < 1) throw new BadRequestError("Page must be greater than 0");
      if (limit < 1 || limit > 100) {
        throw new BadRequestError("Limit must be between 1 and 100");
      }

      // Build the filter object
      const filter: any = { vendorId };

      // Add optional filters from query
      if (query.category) {
        filter.category = query.category;
      }
      if (query.name) {
        filter.name = { $regex: new RegExp(query.name, "i") }; // Case-insensitive search
      }
      if (query.minPrice || query.maxPrice) {
        filter.price = {};
        if (query.minPrice) filter.price.$gte = Number(query.minPrice);
        if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
      }
      if (query.inStock === "true") {
        filter.stockQuantity = { $gt: 0 };
      } else if (query.inStock === "false") {
        filter.stockQuantity = { $lte: 0 };
      }

      // Get total count of matching products (for pagination metadata)
      const total = await this.productRepository.countDocuments(filter);

      // Calculate skip value
      const skip = (page - 1) * limit;

      // Get paginated products
      const products = await this.productRepository.findByVendor(
        vendorId,
        filter,
        skip,
        limit
      );

      return {
        products,
        total,
      };
    } catch (error) {
      // Handle specific errors or rethrow
      // if (error instanceof BadRequestError) {
      //   throw error;
      // }
      throw new Error("Failed to retrieve vendor products");
    }
  }

  async updateProduct(
    id: string,
    updateData: Partial<IProduct>
  ): Promise<IProduct | null> {
    return this.productRepository.update(id, updateData);
  }

  async deleteProduct(id: string): Promise<void> {
    await this.productRepository.delete(id);
  }

  async checkProductStock(
    productId: string,
    quantity: number
  ): Promise<boolean> {
    return this.productRepository.checkStock(productId, quantity);
  }

  async updateProductStock(
    productId: string,
    quantityChange: number
  ): Promise<IProduct | null> {
    return this.productRepository.updateStock(productId, quantityChange);
  }
}
