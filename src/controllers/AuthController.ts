import { AuthService } from "../services/AuthService";
import { ApiResponse } from "../utils/responseHandler";
import { Request, Response, NextFunction } from "express";
import { IAuthService } from "../services/interfaces/IAuthService";
import { IAuthController } from "./interfaces/IAuthController";

export class AuthController implements IAuthController {
  constructor(private authService: any) {}

  async registerUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await this.authService.registerUser(email, password);
      ApiResponse.created(res, result);
    } catch (error) {
      next(error);
    }
  }

  async registerVendor(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, ...vendorData } = req.body;
      const result = await this.authService.registerVendor(
        email,
        password,
        vendorData
      );
      ApiResponse.created(res, result);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await this.authService.login(email, password);
      ApiResponse.success(res, result);
    } catch (error) {
      next(error);
    }
  }
}
