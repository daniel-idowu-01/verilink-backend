import { PaginationOptions } from "./IRepository";
import { ITransaction } from "../../models/interfaces/ITransaction";

export interface ITransactionRepository {
  create(transaction: Partial<ITransaction>): Promise<ITransaction>;
  findById(id: string): Promise<ITransaction | null>;
  findByCustomerId(
    customerId: string,
    options?: PaginationOptions
  ): Promise<{
    transactions: ITransaction[];
    total: number;
  }>;
  findByVendorId(
    vendorId: string,
    options?: PaginationOptions
  ): Promise<{
    transactions: ITransaction[];
    total: number;
  }>;
  update(
    id: string,
    update: Partial<ITransaction>
  ): Promise<ITransaction | null>;
  verifyExitToken(token: string): Promise<ITransaction | null>;
}
