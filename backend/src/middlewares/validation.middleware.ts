import { Request, Response, NextFunction } from 'express';
import { validate, ValidationError as ClassValidationError } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { ValidationError } from '../utils/errors';

/**
 * Middleware for validating request body against a DTO class
 * @param dto The DTO class to validate against
 * @param skipMissingProperties Whether to skip validation of missing properties (default: false)
 */
export function validateBody(dto: any, skipMissingProperties = false) {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Transform plain object to class instance
    const dtoObject = plainToInstance(dto, req.body);

    // Validate
    const errors = await validate(dtoObject as object, {
      skipMissingProperties,
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      const validationErrors = formatValidationErrors(errors);
      return next(new ValidationError(validationErrors));
    }

    // Add validated object to request
    req.body = dtoObject;
    next();
  };
}

/**
 * Middleware for validating request query parameters against a DTO class
 * @param dto The DTO class to validate against
 * @param skipMissingProperties Whether to skip validation of missing properties (default: true)
 */
export function validateQuery(dto: any, skipMissingProperties = true) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dtoObject = plainToInstance(dto, req.query);

    const errors = await validate(dtoObject as object, {
      skipMissingProperties,
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      const validationErrors = formatValidationErrors(errors);
      return next(new ValidationError(validationErrors));
    }

    // Add validated object to request as a custom property
    // We can't directly modify req.query as it's read-only
    (req as any).validatedQuery = dtoObject;
    next();
  };
}

/**
 * Format validation errors into a more readable format
 * @param errors Array of validation errors
 * @returns Object with property names as keys and arrays of error messages as values
 */
function formatValidationErrors(errors: ClassValidationError[]): Record<string, string[]> {
  const formattedErrors: Record<string, string[]> = {};

  for (const error of errors) {
    const property = error.property;
    const constraints = error.constraints;

    if (constraints) {
      formattedErrors[property] = Object.values(constraints);
    }

    // Handle nested validation errors
    if (error.children && error.children.length > 0) {
      const nestedErrors = formatValidationErrors(error.children);

      for (const [nestedProperty, messages] of Object.entries(nestedErrors)) {
        formattedErrors[`${property}.${nestedProperty}`] = messages;
      }
    }
  }

  return formattedErrors;
}
