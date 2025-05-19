import { UnauthorizedError } from "../utils/errors";
import { ApiResponse } from "../utils/responseHandler";
import { Request, Response, NextFunction } from "express";
import { ICartController } from "./interfaces/ICartController";
import { ICartService } from "../services/interfaces/ICartService";

export class CartController implements ICartController {
  constructor(private cartService: ICartService) {
    this.cartService = cartService;
  }

  async getCart(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new UnauthorizedError();
      }

      const cart = await this.cartService.getCart(req.user.id);
      ApiResponse.success(res, cart);
    } catch (error) {
      next(error);
    }
  }

  async addToCart(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new UnauthorizedError();
      }

      const cart = await this.cartService.addToCart(
        req.user.id,
        req.body.productId,
        req.body.quantity || 1
      );
      ApiResponse.success(res, cart);
    } catch (error) {
      next(error);
    }
  }

  async updateCartItem(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new UnauthorizedError();
      }

      const cart = await this.cartService.updateCartItem(
        req.user.id,
        req.params.productId,
        req.body.quantity
      );
      ApiResponse.success(res, cart);
    } catch (error) {
      next(error);
    }
  }

  async removeFromCart(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new UnauthorizedError();
      }

      const cart = await this.cartService.removeFromCart(
        req.user.id,
        req.params.productId
      );
      ApiResponse.success(res, cart);
    } catch (error) {
      next(error);
    }
  }

  async clearCart(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new UnauthorizedError();
      }

      await this.cartService.clearCart(req.user.id);
      ApiResponse.success(res, null, "Cart cleared successfully");
    } catch (error) {
      next(error);
    }
  }
}
