import axios, { type AxiosInstance } from 'axios';
import { type User, type UserFilters } from '../interfaces/user';
import { type StatGroup } from '../interfaces/stats';

export interface FetchUsersResponse {
  pagination: {
    limit: number;
    page: number;
    pages: number;
    total: number;
  };
  users: User[];
}
/**
 * API Service interface for dependency injection
 */
export interface ApiService {
  fetchUsers(params: UserFilters): Promise<{ data: FetchUsersResponse }>;
  fetchStats(): Promise<{ data: StatGroup[] }>;
  bulkAddUsers(users: string[], manufacturerId: string): Promise<any>;
}

/**
 * Implementation of the API Service using axios
 */
export class AxiosApiService implements ApiService {
  private client: AxiosInstance;

  constructor(baseURL: string = 'http://localhost:5050/api') {
    this.client = axios.create({
      baseURL,
    });
  }

  fetchUsers(params: UserFilters): Promise<{ data: FetchUsersResponse }> {
    return this.client.get<FetchUsersResponse>('/users', { params });
  }

  fetchStats(): Promise<{ data: StatGroup[] }> {
    return this.client.get<StatGroup[]>('/users/stats');
  }

  bulkAddUsers(users: string[], manufacturerId: string): Promise<any> {
    return this.client.post('/users/bulk-add', { users, manufacturerId });
  }
}

// Default instance for backward compatibility
const defaultApiService = new AxiosApiService();

export default defaultApiService;
