import { ITransactionService } from "./interfaces/ITransactionService";
import { PaginationOptions } from "../repositories/interfaces/IRepository";
import { ICartRepository } from "../repositories/interfaces/ICartRepository";
import { IProductRepository } from "../repositories/interfaces/IProductRepository";
import { ITransactionRepository } from "../repositories/interfaces/ITransactionRepository";
import {
  ITransaction,
  PaymentMethod,
  TransactionStatus,
} from "../models/interfaces/ITransaction";
import {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} from "../utils/errors";
import { generateExitToken } from "../utils/tokenGenerator";

interface TransactionItem {
  productId: string | any;
  quantity: number;
  priceAtPurchase: number;
}

export class TransactionService implements ITransactionService {
  constructor(
    private transactionRepository: ITransactionRepository,
    private productRepository: IProductRepository,
    private cartRepository: ICartRepository
  ) {}

  async createTransaction(
    transactionData: Partial<ITransaction>
  ): Promise<ITransaction> {
    // Get and validate cart
    const cart = await this.cartRepository.findByUserId(
      transactionData.customerId!
    );
    if (!cart || cart.items.length === 0) {
      throw new BadRequestError("Cannot create transaction with empty cart");
    }

    // Verify stock and calculate totals
    let subtotal = 0;
    const items = await Promise.all(
      cart.items.map(async (item: TransactionItem) => {
        const product = await this.productRepository.findById(
          item.productId.toString()
        );
        if (!product) {
          throw new NotFoundError(`Product ${item.productId} not found`);
        }
        if (product.stockQuantity < item.quantity) {
          throw new BadRequestError(
            `Insufficient stock for product ${product.name}`
          );
        }

        const itemTotal = product.price * item.quantity;
        subtotal += itemTotal;

        return {
          productId: product._id,
          quantity: item.quantity,
          priceAtPurchase: product.price,
        };
      })
    );

    // Calculate tax and total (simplified)
    const tax = subtotal * 0.1; // 10% tax for example
    const total = subtotal + tax;

    // Generate exit token
    const exitToken = generateExitToken();
    const exitTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiry

    // Create transaction
    const transaction = await this.transactionRepository.create({
      ...transactionData,
      items,
      subtotal,
      tax,
      total,
      paymentStatus: TransactionStatus.COMPLETED,
      exitToken,
      exitTokenExpiry,
    });

    // Update product stock

    await Promise.all<void>(
      items.map((item: TransactionItem) =>
        this.productRepository.updateStock(
          item.productId.toString(),
          -item.quantity
        )
      )
    );

    // Clear cart
    await this.cartRepository.clearCart(transactionData.customerId!);

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
