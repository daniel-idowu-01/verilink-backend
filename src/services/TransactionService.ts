import { CartRepository } from "../repositories/CartRepository";
import { ProductRepository } from "../repositories/ProductRepository";
import { ITransactionService } from "./interfaces/ITransactionService";
import { PaginationOptions } from "../repositories/interfaces/IRepository";
import { TransactionRepository } from "../repositories/TransactionRepository";
import {
  NotFoundError,
  BadRequestError,
  ForbiddenError,
} from "../utils/errors";
import {
  ITransaction,
  TransactionStatus,
} from "../models/interfaces/ITransaction";

export class TransactionService implements ITransactionService {
  constructor(
    private transactionRepository: TransactionRepository,
    private productRepository: ProductRepository,
    private cartRepository: CartRepository
  ) {
    this.transactionRepository = transactionRepository;
    this.productRepository = productRepository;
    this.cartRepository = cartRepository;
  }

  async createTransaction(transactionData: Partial<ITransaction>) {
    // Get user's cart
    const cart = await this.cartRepository.findByUserId(
      transactionData.customerId!
    );
    if (!cart || cart.items.length === 0) {
      throw new BadRequestError("Cart is empty");
    }

    // Verify stock and calculate total
    let total = 0;
    for (const item of cart.items) {
      const product = await this.productRepository.findById(item.productId);
      if (!product) {
        throw new NotFoundError(`Product ${item.productId} not found`);
      }
      if (product.stockQuantity < item.quantity) {
        throw new BadRequestError(
          `Insufficient stock for product ${product.name}`
        );
      }
      total += product.price * item.quantity;
    }

    // Create transaction
    const transaction = await this.transactionRepository.create({
      ...transactionData,
      items: cart.items,
      total,
      paymentStatus: TransactionStatus.COMPLETED,
    });

    // Update product stock
    for (const item of cart.items) {
      await this.productRepository.updateStock(item.productId, -item.quantity);
    }

    // Clear cart
    await this.cartRepository.clearCart(transactionData.customerId!);

    return transaction;
  }

  async getUserTransactions(userId: string, page: number, limit: number) {
    return this.transactionRepository.findByUserIdPaginated(
      userId,
      page,
      limit
    );
  }

  async getTransaction(id: string, userId: string) {
    const transaction = await this.transactionRepository.findById(id);
    if (!transaction) throw new NotFoundError("Transaction not found");
    if (transaction.customerId.toString() !== userId) {
      throw new BadRequestError("Unauthorized access to transaction");
    }
    return transaction;
  }

  async getTransactionById(id: string, userId: string): Promise<ITransaction> {
    const transaction = await this.transactionRepository.findById(id);
    if (!transaction) {
      throw new NotFoundError("Transaction not found");
    }

    // Verify ownership
    if (
      transaction.customerId.toString() !== userId &&
      transaction.vendorId.toString() !== userId
    ) {
      throw new ForbiddenError("Unauthorized to access this transaction");
    }

    return transaction;
  }

  async getCustomerTransactions(
    customerId: string,
    options: PaginationOptions = { page: 1, limit: 10 }
  ): Promise<{ transactions: ITransaction[]; total: number }> {
    return this.transactionRepository.findByCustomerId(customerId, options);
  }

  async getVendorTransactions(
    vendorId: string,
    options: PaginationOptions = { page: 1, limit: 10 }
  ): Promise<{ transactions: ITransaction[]; total: number }> {
    return this.transactionRepository.findByVendorId(vendorId, options);
  }

  async verifyExitToken(token: string): Promise<ITransaction> {
    const transaction = await this.transactionRepository.verifyExitToken(token);
    if (!transaction) {
      throw new BadRequestError("Invalid or expired exit token");
    }
    return transaction;
  }
}
