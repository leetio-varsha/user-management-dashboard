import { http, HttpResponse } from 'msw';
import { mockUsers } from './mockData';
import { mockStats } from './mockData';

export const handlers = [
  http.get('http://localhost:5050/api/users', ({ request }) => {
    const url = new URL(request.url);
    const gender = url.searchParams.get('gender');
    const company = url.searchParams.get('company');
    const manufacturerId = url.searchParams.get('manufacturerId');
    const sortBy = url.searchParams.get('sortBy') || 'lastActive';
    const order = url.searchParams.get('order') || 'desc';
    const page = Number(url.searchParams.get('page')) || 1;
    const limit = Number(url.searchParams.get('limit')) || 10;

    // Filter users based on query parameters
    let filteredUsers = [...mockUsers];

    if (gender) {
      filteredUsers = filteredUsers.filter((user) => user.gender === gender);
    }

    if (company) {
      filteredUsers = filteredUsers.filter((user) => user.company.toLowerCase().includes(company.toLowerCase()));
    }

    if (manufacturerId) {
      filteredUsers = filteredUsers.filter((user) => user.manufacturerId === manufacturerId);
    }

    // Sort users
    filteredUsers.sort((a, b) => {
      const aValue = a[sortBy as keyof typeof a];
      const bValue = b[sortBy as keyof typeof b];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return order === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }

      // @ts-ignore
      if (aValue instanceof Date && bValue instanceof Date) {
        return order === 'asc' ? aValue.getTime() - bValue.getTime() : bValue.getTime() - aValue.getTime();
      }

      return 0;
    });

    // Paginate
    const startIndex = (page - 1) * limit;
    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + limit);

    return HttpResponse.json(paginatedUsers);
  }),

  // GET /api/users/stats - Fetch user statistics
  http.get('http://localhost:5050/api/users/stats', () => {
    return HttpResponse.json(mockStats);
  }),

  // POST /api/users/bulk-add - Add users to manufacturer
  http.post('http://localhost:5050/api/users/bulk-add', async ({ request }) => {
     await request.json();
    return HttpResponse.json({ success: true, message: 'Users added successfully' });
  }),
];
