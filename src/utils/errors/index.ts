import { AppError } from "./appError";

export class BadRequestError extends AppError {
  statusCode = 400;
  isOperational = true;

  constructor(public message: string, public code?: string) {
    super(message);
  }

  serializeErrors() {
    return [{ message: this.message, code: this.code }];
  }
}

export class UnauthorizedError extends AppError {
  statusCode = 401;
  isOperational = true;

  constructor(public message: string = "Unauthorized") {
    super(message);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}

export class ForbiddenError extends AppError {
  statusCode = 403;
  isOperational = true;

  constructor(public message: string = "Forbidden") {
    super(message);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}

export class NotFoundError extends AppError {
  statusCode = 404;
  isOperational = true;

  constructor(public message: string = "Not found") {
    super(message);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}

export class ConflictError extends AppError {
  statusCode = 409;
  isOperational = true;

  constructor(public message: string = "Conflict") {
    super(message);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}

export class ValidationError extends AppError {
  statusCode = 422;
  isOperational = true;

  constructor(public errors: { message: string; field?: string }[]) {
    super("Validation failed");
  }

  serializeErrors() {
    return this.errors.map((error) => ({
      message: error.message,
      field: error.field,
    }));
  }
}

export class InternalServerError extends AppError {
  statusCode = 500;
  isOperational = false;

  constructor(public message: string = "Internal server error") {
    super(message);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
