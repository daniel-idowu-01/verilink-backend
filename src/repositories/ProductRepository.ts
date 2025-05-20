import { Model } from "mongoose";
import { IProduct } from "../models/interfaces/IProduct";
import { IProductRepository } from "./interfaces/IProductRepository";

export class ProductRepository implements IProductRepository {
  constructor(private model: Model<IProduct>) {}

  async create(productData: Partial<IProduct>): Promise<IProduct> {
    return this.model.create(productData);
  }

  async findById(id: string): Promise<IProduct | null> {
    return this.model.findById(id).exec();
  }

  async findByBarcode(barcode: string): Promise<IProduct | null> {
    return this.model.findOne({ barcode }).exec();
  }

  async findByVendor(
    vendorId: string,
    query: any = {},
    page: number = 1,
    limit: number = 10
  ): Promise<IProduct[]> {
    const skip = (page - 1) * limit;
    return this.model
      .find({ vendorId, ...query })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  async update(
    id: string,
    productData: Partial<IProduct>
  ): Promise<IProduct | null> {
    return this.model.findByIdAndUpdate(id, productData, { new: true }).exec();
  }

  async delete(id: string): Promise<void> {
    await this.model.findByIdAndDelete(id).exec();
  }

  async checkStock(productId: string, quantity: number): Promise<boolean> {
    const product = await this.model.findById(productId).exec();
    return product ? product.stockQuantity >= quantity : false;
  }

  async updateStock(
    productId: string,
    quantityChange: number
  ): Promise<IProduct | null> {
    return this.model
      .findByIdAndUpdate(
        productId,
        { $inc: { stockQuantity: quantityChange } },
        { new: true }
      )
      .exec();
  }

  async countDocuments(filter: any): Promise<number> {
    return this.model.countDocuments(filter).exec();
  }
}
