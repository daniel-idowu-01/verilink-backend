import { Cart } from "../models/Cart";
import { Model, Types } from "mongoose";
import { NotFoundError } from "../utils/errors";
import { ICart } from "../models/interfaces/ICart";
import { ICartRepository } from "./interfaces/ICartRepository";

export class CartRepository implements ICartRepository {

  constructor(private model: Model<ICart>) {
    this.model = model;
  }

  async findByUserId(userId: string) {
    return this.model.findOne({ userId }).populate("items.productId");
  }

  async addItem(
    userId: string,
    productId: string,
    quantity: number,
    price: number
  ) {
    let cart = await this.model.findOne({ userId });

    if (!cart) {
      cart = await this.model.create({ userId, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (existingItemIndex >= 0) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId: new Types.ObjectId(productId), quantity, priceAtAddition: price });
    }

    await cart.save();
    return cart.populate("items.productId");
  }

  async updateItem(userId: string, productId: string, quantity: number) {
    const cart = await this.model.findOne({ userId });
    if (!cart) throw new NotFoundError("Cart not found");

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );
    if (itemIndex === -1) throw new NotFoundError("Item not found in cart");

    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    return cart.populate("items.productId");
  }

  async removeItem(userId: string, productId: string) {
    const cart = await this.model.findOne({ userId });
    if (!cart) throw new NotFoundError("Cart not found");

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );
    await cart.save();
    return cart.populate("items.productId");
  }

  async clearCart(userId: string) {
    return this.model.findOneAndUpdate(
      { userId },
      { items: [] },
      { new: true }
    );
  }
}
