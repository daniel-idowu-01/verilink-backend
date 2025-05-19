import { Model } from "mongoose";
import { Transaction } from "../models/Transaction";
import { PaginationOptions } from "./interfaces/IRepository";
import { ITransaction } from "../models/interfaces/ITransaction";
import { ITransactionRepository } from "./interfaces/ITransactionRepository";

interface PaginatedResult {
  data: any[];
  total: number;
  page: number;
  limit: number;
}

export class TransactionRepository implements ITransactionRepository {
  constructor(private model: Model<ITransaction>) {
    this.model = model;
  }

  async create(transactionData: Partial<ITransaction>) {
    return this.model.create(transactionData);
  }

  async findByUserIdPaginated(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.model.find({ userId }).skip(skip).limit(limit),
      this.model.countDocuments({ userId }),
    ]);

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findById(id: string) {
    return this.model.findById(id);
  }

  async findByCustomerId(
    customerId: string,
    options: PaginationOptions = { page: 1, limit: 10 }
  ): Promise<{ transactions: ITransaction[]; total: number }> {
    const [transactions, total] = await Promise.all([
      Transaction.find({ customerId })
        .skip((options.page - 1) * options.limit)
        .limit(options.limit)
        .sort({ createdAt: -1 })
        .populate("items.productId")
        .exec(),
      Transaction.countDocuments({ customerId }),
    ]);

    return { transactions, total };
  }

  async findByVendorId(
    vendorId: string,
    options: PaginationOptions = { page: 1, limit: 10 }
  ): Promise<{ transactions: ITransaction[]; total: number }> {
    const [transactions, total] = await Promise.all([
      Transaction.find({ vendorId })
        .skip((options.page - 1) * options.limit)
        .limit(options.limit)
        .sort({ createdAt: -1 })
        .populate("customerId")
        .populate("items.productId")
        .exec(),
      Transaction.countDocuments({ vendorId }),
    ]);

    return { transactions, total };
  }

  async update(
    id: string,
    update: Partial<ITransaction>
  ): Promise<ITransaction | null> {
    return Transaction.findByIdAndUpdate(id, update, { new: true })
      .populate("customerId")
      .populate("vendorId")
      .populate("items.productId")
      .exec();
  }

  async verifyExitToken(token: string): Promise<ITransaction | null> {
    return Transaction.findOneAndUpdate(
      {
        exitToken: token,
        exitTokenExpiry: { $gt: new Date() },
        exitVerified: false,
      },
      {
        exitVerified: true,
        verificationMethod: "gate",
      },
      { new: true }
    ).exec();
  }
}
