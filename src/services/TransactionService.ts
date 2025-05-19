import { CartRepository } from "../repositories/CartRepository";
import { ITransaction } from "../models/interfaces/ITransaction";
import { NotFoundError, BadRequestError } from "../utils/errors";
import { ProductRepository } from "../repositories/ProductRepository";
import { TransactionRepository } from "../repositories/TransactionRepository";

export class TransactionService {
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
      transactionData.userId!
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
      status: "completed",
    });

    // Update product stock
    for (const item of cart.items) {
      await this.productRepository.updateStock(item.productId, -item.quantity);
    }

    // Clear cart
    await this.cartRepository.clearCart(transactionData.userId!);

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
    if (transaction.userId.toString() !== userId) {
      throw new BadRequestError("Unauthorized access to transaction");
    }
    return transaction;
  }
}
