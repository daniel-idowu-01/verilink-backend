import { UnauthorizedError } from "../utils/errors";
import { ApiResponse } from "../utils/responseHandler";
import { Request, Response, NextFunction } from "express";
import { TransactionService } from "../services/TransactionService";

export class TransactionController {
  constructor(private transactionService: TransactionService) {
    this.transactionService = transactionService;
  }

  async createTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new UnauthorizedError();
      }

      const transaction = await this.transactionService.createTransaction({
        ...req.body,
        userId: req.user.id,
      });
      ApiResponse.created(res, transaction);
    } catch (error) {
      next(error);
    }
  }

  async getUserTransactions(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10 } = req.query;

      if (!req.user) {
        throw new UnauthorizedError();
      }

      const transactions = await this.transactionService.getUserTransactions(
        req.user.id,
        parseInt(page as string),
        parseInt(limit as string)
      );
      ApiResponse.success(res, transactions);
    } catch (error) {
      next(error);
    }
  }

  async getTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new UnauthorizedError();
      }

      const transaction = await this.transactionService.getTransaction(
        req.params.id,
        req.user.id
      );
      ApiResponse.success(res, transaction);
    } catch (error) {
      next(error);
    }
  }
}
