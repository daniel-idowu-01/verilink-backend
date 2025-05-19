import { ICart, ICartItem } from "../../models/interfaces/ICart";

export interface ICartRepository {
  findByUserId(userId: string): Promise<ICart | null>;
  addItem(
    userId: string,
    productId: string,
    quantity: number,
    price: number
  ): Promise<ICart | null>;
  updateItem(
    userId: string,
    productId: string,
    quantity: number
  ): Promise<ICart | null>;
  removeItem(userId: string, productId: string): Promise<ICart | null>;
  clearCart(userId: string): Promise<ICart | null>;
}
