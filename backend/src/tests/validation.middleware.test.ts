import 'reflect-metadata';
import { Request, Response, NextFunction } from 'express';
import { validateBody, validateQuery } from '../middlewares/validation.middleware';
import { BulkAddUsersDto, GetUsersQueryDto } from '../dtos/user.dto';
import { ValidationError } from '../utils/errors';

describe('Validation Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    mockRequest = {
      body: {},
      query: {},
    };
    mockResponse = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  describe('validateBody', () => {
    it('should pass validation with valid data', async () => {
      // Arrange
      mockRequest.body = {
        users: [{ _id: '1' }, { _id: '2' }],
        manufacturerId: 'manu123',
      };

      const middleware = validateBody(BulkAddUsersDto);

      // Act
      await middleware(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockNext).toHaveBeenCalledWith();
      expect(mockRequest.body).toBeInstanceOf(BulkAddUsersDto);
    });

    it('should fail validation with missing required fields', async () => {
      // Arrange
      mockRequest.body = {
        users: [], // Empty array, missing manufacturerId
      };

      const middleware = validateBody(BulkAddUsersDto);

      // Act
      await middleware(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockNext.mock.calls[0][0]).toBeInstanceOf(ValidationError);

      const error = mockNext.mock.calls[0][0] as unknown as ValidationError;
      expect(error.errors).toHaveProperty('users');
      expect(error.errors).toHaveProperty('manufacturerId');
    });

    it('should fail validation with invalid user data', async () => {
      // Arrange
      mockRequest.body = {
        users: [
          {
            /* missing _id */
          },
        ],
        manufacturerId: 'manu123',
      };

      const middleware = validateBody(BulkAddUsersDto);

      // Act
      await middleware(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockNext.mock.calls[0][0]).toBeInstanceOf(ValidationError);

      const error = mockNext.mock.calls[0][0] as unknown as ValidationError;
      // Check if the error contains validation errors for the missing _id
      expect(Object.keys(error.errors)).toContain('users.0._id');
    });
  });

  describe('validateQuery', () => {
    it('should pass validation with valid query parameters', async () => {
      // Arrange
      mockRequest.query = {
        page: '1',
        limit: '10',
        sortBy: 'firstName',
        order: 'asc',
      };

      const middleware = validateQuery(GetUsersQueryDto);

      // Act
      await middleware(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockNext).toHaveBeenCalledWith();
      expect((mockRequest as any).validatedQuery).toBeInstanceOf(GetUsersQueryDto);
      expect((mockRequest as any).validatedQuery.page).toBe(1); // Should be converted to number
    });

    it('should pass validation with empty query parameters', async () => {
      // Arrange
      mockRequest.query = {};

      const middleware = validateQuery(GetUsersQueryDto);

      // Act
      await middleware(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockNext).toHaveBeenCalledWith();
      expect((mockRequest as any).validatedQuery).toBeInstanceOf(GetUsersQueryDto);
    });

    it('should fail validation with invalid query parameters', async () => {
      // Arrange
      mockRequest.query = {
        page: 'invalid', // Should be a number
        limit: '1000', // Exceeds max value
        order: 'invalid', // Should be 'asc' or 'desc'
      };

      const middleware = validateQuery(GetUsersQueryDto);

      await middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledTimes(1);
      expect(mockNext.mock.calls[0][0]).toBeInstanceOf(ValidationError);

      const error = mockNext.mock.calls[0][0] as unknown as ValidationError;
      expect(Object.keys(error.errors)).toContain('page');
      expect(Object.keys(error.errors)).toContain('limit');
      expect(Object.keys(error.errors)).toContain('order');
    });
  });
});
