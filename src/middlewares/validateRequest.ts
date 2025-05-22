import { Request, Response, NextFunction } from "express";
import { validationResult, ValidationError as ExpressValidationError } from "express-validator";
import { ValidationError } from "../utils/errors"; // Your custom error class

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const rawErrors = errors.array({ onlyFirstError: true }) as ExpressValidationError[];
    const formattedErrors = rawErrors.map((err) => ({
      message: err.msg,
      // field: err.param
    }));
    throw new ValidationError(formattedErrors);
  }
  next();
};
