import { Request, Response, NextFunction } from 'express';
import { getUsers, bulkAddUsers, getUserStats } from '../controllers/user.controller';
import { UserService } from '../services/user.service';
import { UserRepository } from '../repositories/user.repository';
import { BadRequestError } from '../utils/errors';
import mongoose from 'mongoose';

// Mock the UserService and UserRepository
jest.mock('../services/user.service');
jest.mock('../repositories/user.repository');
jest.mock('../utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

describe('UserController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Setup mock request, response, and next function
    mockRequest = {
      query: {},
      body: {},
    };

    mockResponse = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };

    mockNext = jest.fn();
  });

  describe('getUsers', () => {
    it('should return users when successful', async () => {
      // Arrange
      const mockResult = {
        users: [{ id: '1', name: 'Test User' }],
        pagination: { total: 1, page: 1, limit: 10, pages: 1 },
      };

      // Mock the service method
      jest.spyOn(UserService.prototype, 'getAllUsers').mockResolvedValue(mockResult);

      // Act
      await getUsers(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockResponse.json).toHaveBeenCalledWith(mockResult);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next with error when service throws', async () => {
      // Arrange
      const mockError = new Error('Service error');

      // Mock the service method to throw
      jest.spyOn(UserService.prototype, 'getAllUsers').mockRejectedValue(mockError);

      // Act
      await getUsers(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockResponse.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });

  describe('bulkAddUsers', () => {
    it('should add users to manufacturer when valid data is provided', async () => {
      // Arrange
      const mockUsers = [{ id: '1', name: 'Test User' }];
      const mockManufacturerId = 'manu123';
      // Create a proper mongoose UpdateWriteOpResult
      const mockResult = {
        acknowledged: true,
        matchedCount: 1,
        modifiedCount: 1,
        upsertedCount: 0,
        upsertedId: null,
      };

      mockRequest.body = {
        users: mockUsers,
        manufacturerId: mockManufacturerId,
      };

      // Mock the service method
      jest.spyOn(UserService.prototype, 'addUsersToManufacturer').mockResolvedValue(mockResult);

      // Act
      await bulkAddUsers(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockResponse.json).toHaveBeenCalledWith({ modifiedCount: mockResult.modifiedCount });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should throw BadRequestError when users array is missing', async () => {
      // Arrange
      mockRequest.body = {
        manufacturerId: 'manu123',
      };

      // Act
      await bulkAddUsers(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockResponse.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(expect.any(BadRequestError));
      const error = mockNext.mock.calls[0][0] as unknown as BadRequestError;
      expect(error.message).toContain('Users array is required');
    });

    it('should throw BadRequestError when manufacturerId is missing', async () => {
      // Arrange
      mockRequest.body = {
        users: [{ id: '1', name: 'Test User' }],
      };

      // Act
      await bulkAddUsers(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockResponse.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(expect.any(BadRequestError));
      const error = mockNext.mock.calls[0][0] as unknown as BadRequestError;
      expect(error.message).toContain('Manufacturer ID is required');
    });
  });

  describe('getUserStats', () => {
    it('should return user stats when successful', async () => {
      // Arrange
      const mockStats = [{ _id: 'stats', count: 10 }];

      // Mock the service method
      jest.spyOn(UserService.prototype, 'getUserStats').mockResolvedValue(mockStats);

      // Act
      await getUserStats(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockResponse.json).toHaveBeenCalledWith(mockStats);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next with error when service throws', async () => {
      // Arrange
      const mockError = new Error('Service error');

      // Mock the service method to throw
      jest.spyOn(UserService.prototype, 'getUserStats').mockRejectedValue(mockError);

      // Act
      await getUserStats(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockResponse.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });
});
