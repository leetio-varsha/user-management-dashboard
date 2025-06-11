import { UserService } from '../services/user.service';
import { UserRepository } from '../repositories/user.repository';

// Mock the UserRepository
jest.mock('../repositories/user.repository');

describe('UserService', () => {
  let userService: UserService;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Create a mocked instance of UserRepository
    userRepository = new UserRepository() as jest.Mocked<UserRepository>;

    // Create an instance of UserService with the mocked repository
    userService = new UserService(userRepository);
  });

  describe('getAllUsers', () => {
    it('should return users with pagination info', async () => {
      // Arrange
      const mockUsers = [
        { _id: '1', firstName: 'John', lastName: 'Doe' },
        { _id: '2', firstName: 'Jane', lastName: 'Smith' },
      ];
      const mockTotal = 2;
      const mockQuery = { page: '1', limit: '10' };

      // Setup mocks
      userRepository.findAll = jest.fn().mockResolvedValue(mockUsers);
      userRepository.countDocuments = jest.fn().mockResolvedValue(mockTotal);

      // Act
      const result = await userService.getAllUsers(mockQuery);

      // Assert
      expect(userRepository.findAll).toHaveBeenCalledWith({}, {}, 1, 10);
      expect(userRepository.countDocuments).toHaveBeenCalledWith({});
      expect(result).toEqual({
        users: mockUsers,
        pagination: {
          total: mockTotal,
          page: 1,
          limit: 10,
          pages: 1,
        },
      });
    });

    it('should apply filters correctly', async () => {
      // Arrange
      const mockUsers = [{ _id: '1', firstName: 'Jane', lastName: 'Smith' }];
      const mockTotal = 1;
      const mockQuery = {
        gender: 'female',
        company: 'Tech',
        manufacturerId: 'manu123',
        page: '1',
        limit: '10',
      };

      // Expected filters
      const expectedFilters = {
        'demographics.gender': 'female',
        company: { $regex: 'Tech', $options: 'i' },
        manufacturerId: { $regex: 'manu123', $options: 'i' },
      };

      // Setup mocks
      userRepository.findAll = jest.fn().mockResolvedValue(mockUsers);
      userRepository.countDocuments = jest.fn().mockResolvedValue(mockTotal);

      // Act
      const result = await userService.getAllUsers(mockQuery);

      // Assert
      expect(userRepository.findAll).toHaveBeenCalledWith(expectedFilters, {}, 1, 10);
      expect(userRepository.countDocuments).toHaveBeenCalledWith(expectedFilters);
      expect(result.users).toEqual(mockUsers);
      expect(result.pagination.total).toBe(mockTotal);
    });

    it('should apply sorting correctly', async () => {
      // Arrange
      const mockUsers = [
        { _id: '1', firstName: 'John', lastName: 'Doe' },
        { _id: '2', firstName: 'Jane', lastName: 'Smith' },
      ];
      const mockTotal = 2;
      const mockQuery = {
        sortBy: 'firstName',
        order: 'desc',
        page: '1',
        limit: '10',
      };

      // Expected sort
      const expectedSort = { firstName: -1 };

      // Setup mocks
      userRepository.findAll = jest.fn().mockResolvedValue(mockUsers);
      userRepository.countDocuments = jest.fn().mockResolvedValue(mockTotal);

      // Act
      const result = await userService.getAllUsers(mockQuery);

      // Assert
      expect(userRepository.findAll).toHaveBeenCalledWith({}, expectedSort, 1, 10);
      expect(result.users).toEqual(mockUsers);
    });
  });

  describe('addUsersToManufacturer', () => {
    it('should call repository to assign manufacturer to users', async () => {
      // Arrange
      const mockUsers = [
        { _id: '1', firstName: 'John', lastName: 'Doe' },
        { _id: '2', firstName: 'Jane', lastName: 'Smith' },
      ];
      const manufacturerId = 'manu123';
      const mockResult = { modifiedCount: 2 };

      // Setup mocks
      userRepository.assignManufacturer = jest.fn().mockResolvedValue(mockResult);

      // Act
      const result = await userService.addUsersToManufacturer(mockUsers, manufacturerId);

      // Assert
      expect(userRepository.assignManufacturer).toHaveBeenCalledWith(['1', '2'], manufacturerId);
      expect(result).toEqual(mockResult);
    });
  });

  describe('getUserStats', () => {
    it('should call repository to get aggregated stats', async () => {
      // Arrange
      const mockStats = [{ _id: 'stats', count: 10 }];

      // Setup mocks
      userRepository.aggregateStats = jest.fn().mockResolvedValue(mockStats);

      // Act
      const result = await userService.getUserStats();

      // Assert
      expect(userRepository.aggregateStats).toHaveBeenCalled();
      expect(result).toEqual(mockStats);
    });
  });
});
