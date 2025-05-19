import { ICartService } from "./interfaces/ICartService";
import { NotFoundError, BadRequestError } from "../utils/errors";
import { ICartRepository } from "../repositories/interfaces/ICartRepository";
import { IProductRepository } from "../repositories/interfaces/IProductRepository";

export class CartService implements ICartService {
  constructor(
    private productRepository: IProductRepository,
    private cartRepository: ICartRepository
  ) {
    this.productRepository = productRepository;
    this.cartRepository = cartRepository;
  }

  async getCart(userId: string) {
    return this.cartRepository.findByUserId(userId);
  }

  async addToCart(userId: string, productId: string, quantity: number = 1) {
    const product = await this.productRepository.findById(productId);
    if (!product) throw new NotFoundError("Product not found");
    if (product.stockQuantity < quantity) {
      throw new BadRequestError("Insufficient stock");
    }

    return this.cartRepository.addItem(
      userId,
      productId,
      quantity,
      product.price
    );
  }

  async updateCartItem(userId: string, productId: string, quantity: number) {
    if (quantity < 1) throw new BadRequestError("Quantity must be at least 1");

    const product = await this.productRepository.findById(productId);
    if (!product) throw new NotFoundError("Product not found");
    if (product.stockQuantity < quantity) {
      throw new BadRequestError("Insufficient stock");
    }

    return this.cartRepository.updateItem(userId, productId, quantity);
  }

  async removeFromCart(userId: string, productId: string) {
    return this.cartRepository.removeItem(userId, productId);
  }

  async clearCart(userId: string) {
    return this.cartRepository.clearCart(userId);
  }
}
