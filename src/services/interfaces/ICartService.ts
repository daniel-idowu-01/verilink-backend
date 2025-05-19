import { ICart } from "../../models/interfaces/ICart";

export interface ICartService {
  getCart(userId: string): Promise<ICart | null>;
  addToCart(
    userId: string,
    productId: string,
    quantity?: number
  ): Promise<ICart | null>;
  updateCartItem(
    userId: string,
    productId: string,
    quantity: number
  ): Promise<ICart | null>;
  removeFromCart(userId: string, productId: string): Promise<ICart | null>;
  clearCart(userId: string): Promise<ICart | null>;
}
