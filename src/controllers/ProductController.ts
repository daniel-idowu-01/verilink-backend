import { BadRequestError } from "../utils/errors";
import { Request, Response, NextFunction } from "express";
import { IProductController } from "./interfaces/IProductController";
import { IProductService } from "../services/interfaces/IProductService";
import { ApiResponse, PaginatedResponse } from "../utils/responseHandler";

export class ProductController implements IProductController {
  constructor(private productService: IProductService) {}

  createProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const product = await this.productService.createProduct({
        ...req.body,
        vendorId: req.user.id,
      });

      ApiResponse.created(res, product, "Product created successfully");
    } catch (error) {
      next(error);
    }
  };

  getProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const product = await this.productService.getProductById(req.params.id);
      if (!product) {
        res.status(404).json({ message: "Product not found" });
        return;
      }

      ApiResponse.success(res, product);
    } catch (error) {
      next(error);
    }
  };

  getProductByBarcode = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const product = await this.productService.getProductByBarcode(
        req.params.barcode
      );
      if (!product) {
        res.status(404).json({ message: "Product not found" });
      }

      ApiResponse.success(res, product);
    } catch (error) {
      next(error);
    }
  };

  updateProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const product = await this.productService.updateProduct(
        req.params.id,
        req.body
      );
      if (!product) {
        res.status(404).json({ message: "Product not found" });
      }
      ApiResponse.success(res, product);
    } catch (error) {
      next(error);
    }
  };

  deleteProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await this.productService.deleteProduct(req.params.id);
      ApiResponse.success(res, null, "Product deleted successfully");
    } catch (error) {
      next(error);
    }
  };

  getVendorProducts = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { page = "1", limit = "10", ...query } = req.query;

      const pageNumber = parseInt(page as string);
      const limitNumber = parseInt(limit as string);

      if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      if (isNaN(pageNumber) || isNaN(limitNumber)) {
        throw new BadRequestError("Invalid pagination parameters");
      }

      const { products, total } =
        await this.productService.getVendorProductsPaginated(
          req.user.id,
          query,
          pageNumber,
          limitNumber
        );

      PaginatedResponse.send(res, products, {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      });
    } catch (error) {
      next(error);
    }
  };
}
