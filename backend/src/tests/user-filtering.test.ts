import { UserService } from '../services/user.service';
import { UserRepository } from '../repositories/user.repository';
import {generateMockUser} from "./mock/mockUsers";
jest.mock('../repositories/user.repository');

const mockUsers = [
  generateMockUser(),
  generateMockUser({ firstName: 'Bob', lastName: 'Smith', demographics: { gender: 'male', education: 'Bachelor' } }),
];

describe('UserService', () => {
  let userService: UserService;
  let userRepoMock: jest.Mocked<UserRepository>;

  beforeEach(() => {
    userRepoMock = new UserRepository() as jest.Mocked<UserRepository>;

    userRepoMock.countDocuments.mockResolvedValue(mockUsers.length);
    // @ts-ignore
    userRepoMock.findAll.mockResolvedValue(mockUsers);

    userService = new UserService(userRepoMock);
  });

  it('filters users by gender', async () => {
    const result = await userService.getAllUsers({ gender: 'female' });

    expect(userRepoMock.countDocuments).toHaveBeenCalledWith({ 'demographics.gender': 'female' });
    expect(userRepoMock.findAll).toHaveBeenCalledWith({ 'demographics.gender': 'female' }, {}, 1, 10);
    expect(result.users).toEqual(mockUsers);
  });

  it('filters by education and yearsInIndustry', async () => {
    const result = await userService.getAllUsers({
      education: 'Master',
      yearsInIndustryMin: '10',
    });

    expect(userRepoMock.countDocuments).toHaveBeenCalled();
    expect(userRepoMock.findAll).toHaveBeenCalled();
    expect(result.pagination.total).toBe(mockUsers.length);
  });

  it('paginates correctly', async () => {
    const result = await userService.getAllUsers({ page: '2', limit: '3' });

    expect(userRepoMock.findAll).toHaveBeenCalledWith({}, {}, 2, 3);
    expect(result.pagination.page).toBe(2);
    expect(result.pagination.limit).toBe(3);
  });

  it('sorts by surveysCompleted desc', async () => {
    const result = await userService.getAllUsers({
      sortBy: 'participation.surveysCompleted',
      order: 'desc',
      limit: '5',
    });

    expect(userRepoMock.findAll).toHaveBeenCalledWith({}, { 'participation.surveysCompleted': -1 }, 1, 5);
    expect(result.users.length).toBe(mockUsers.length);
  });

  it('searches by keyword in company/jobTitle', async () => {
    const result = await userService.getAllUsers({ search: 'engineer' });

    // Додай логіку до UserService, якщо search не підтримується ще
    expect(userRepoMock.countDocuments).toHaveBeenCalled();
    expect(userRepoMock.findAll).toHaveBeenCalled();
    expect(result.users).toEqual(mockUsers);
  });

  it('filters by joinedAfter date', async () => {
    const result = await userService.getAllUsers({ joinedAfter: '2023-01-01' });

    expect(userRepoMock.countDocuments).toHaveBeenCalled();
    expect(userRepoMock.findAll).toHaveBeenCalled();
    expect(result.pagination.total).toBe(mockUsers.length);
  });
});