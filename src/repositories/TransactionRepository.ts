import { Model } from "mongoose";
import { Transaction } from "../models/Transaction";
import { ITransaction } from "../models/interfaces/ITransaction";

interface PaginatedResult {
  data: any[];
  total: number;
  page: number;
  limit: number;
}

export class TransactionRepository {
  private model: Model<ITransaction>;

  constructor() {
    this.model = Transaction;
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
}
