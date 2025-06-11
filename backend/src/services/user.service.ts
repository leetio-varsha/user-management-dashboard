import { UserRepository } from '../repositories/user.repository';
import { UserFilterOptions, SortOptions, PaginationOptions } from '../interfaces/filters.interface';

export interface GetAllUsersResult {
  users: any[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export class UserService {
  private userRepo: UserRepository;

  constructor(userRepo: UserRepository) {
    this.userRepo = userRepo;
  }

  async getAllUsers(query: any): Promise<GetAllUsersResult> {
    const filters: UserFilterOptions = {};
    const sort: SortOptions = {};
    const page = parseInt(query.page as string) || 1;
    const limit = parseInt(query.limit as string) || 10;

    if (query.gender) filters['demographics.gender'] = query.gender;
    if (query.company) filters.company = { $regex: query.company, $options: 'i' };
    if (query.manufacturerId) filters.manufacturerId = { $regex: query.manufacturerId, $options: 'i' };
    if (query.sortBy) sort[query.sortBy] = query.order === 'desc' ? -1 : 1;

    const total = await this.userRepo.countDocuments(filters);
    const users = await this.userRepo.findAll(filters, sort, page, limit);

    return {
      users,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async addUsersToManufacturer(users: any[], manufacturerId: string) {
    const ids = users.map((u) => u._id);
    return this.userRepo.assignManufacturer(ids, manufacturerId);
  }

  async getUserStats() {
    return this.userRepo.aggregateStats();
  }
}
