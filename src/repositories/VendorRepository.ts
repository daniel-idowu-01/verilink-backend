import { Model } from "mongoose";
import { IVendor } from "../models/interfaces/IVendor";

export class VendorRepository {
  constructor(private model: Model<IVendor>) {}
  
  async findByUserId(userId: string) {
    return this.model.findOne({ userId });
  }
  
  async create(vendorData: Partial<IVendor>) {
    return this.model.create(vendorData);
  }
}