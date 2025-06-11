export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  company: string;
  lastActive: string;
  manufacturerId?: string | null;
}

export interface UserFilters {
  gender: string;
  company: string;
  manufacturerId: string;
  sortBy: string;
  order: 'asc' | 'desc';
  page: number;
  limit: number;
}
