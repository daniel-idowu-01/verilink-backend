import { RequestHandler } from "express";

export interface ICartController {
  getCart: RequestHandler;
  addToCart: RequestHandler;
  updateCartItem: RequestHandler;
  removeFromCart: RequestHandler;
  clearCart: RequestHandler;
}
