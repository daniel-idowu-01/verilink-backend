import { ITransaction } from "../../models/interfaces/ITransaction";
import { PaginationOptions } from "../../repositories/interfaces/IRepository";

export interface ITransactionService {
  createTransaction(
    transactionData: Partial<ITransaction>
  ): Promise<ITransaction>;
  getTransactionById(id: string, userId: string): Promise<ITransaction>;
  getCustomerTransactions(
    customerId: string,
    options?: PaginationOptions
  ): Promise<{ transactions: ITransaction[]; total: number }>;
  getVendorTransactions(
    vendorId: string,
    options?: PaginationOptions
  ): Promise<{ transactions: ITransaction[]; total: number }>;
  verifyExitToken(token: string): Promise<ITransaction>;
}
