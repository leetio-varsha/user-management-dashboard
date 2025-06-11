import { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError } from '../utils/errors';
import { HttpStatus } from '../types/http-status.enum';
import logger from '../utils/logger';

export function errorHandler(err: any, req: Request, res: Response, _next: NextFunction) {
  // Log the error with additional context
  const errorContext = {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userId: (req as any).user?.id || 'unauthenticated',
    errorName: err.name,
    errorMessage: err.message,
    stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined,
  };

  if (err instanceof AppError && err.isOperational) {
    // Log operational errors as warnings
    logger.warn(`${err.name}: ${err.message}`, { ...errorContext });
  } else {
    // Log programming or other unhandled errors as errors
    logger.error(`Unhandled error: ${err.message || 'Unknown error'}`, { ...errorContext });
  }

  // Handle validation errors from class-validator
  if (err?.name === 'ValidationError' && err?.errors) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      status: 'error',
      message: 'Validation failed',
      errors: err.errors,
    });
  }

  // Handle mongoose validation errors
  if (err?.name === 'ValidationError' && err?.errors && !err.statusCode) {
    const validationErrors: Record<string, string[]> = {};

    for (const field in err.errors) {
      validationErrors[field] = [err.errors[field].message];
    }

    return res.status(HttpStatus.BAD_REQUEST).json({
      status: 'error',
      message: 'Validation failed',
      errors: validationErrors,
    });
  }

  // Handle custom AppError instances
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: err.statusCode < 500 ? 'fail' : 'error',
      message: err.message,
      ...(err instanceof ValidationError && { errors: err.errors }),
    });
  }

  // Handle MongoDB duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(HttpStatus.CONFLICT).json({
      status: 'fail',
      message: `Duplicate value for ${field}. This ${field} is already in use.`,
    });
  }

  // Handle unexpected errors
  const statusCode = err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
  res.status(statusCode).json({
    status: 'error',
    message:
      process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message || 'An unexpected error occurred',
  });
}
