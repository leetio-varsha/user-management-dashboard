import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useUsersViewModel } from '../UsersViewModel';
import { mockUsers } from '../../test/mocks/mockData';
import apiService from '../../services/apiService.ts';

vi.mock('../../services/apiService');

describe('useUsersViewModel', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    (apiService.fetchUsers as any).mockResolvedValue({ data: mockUsers });
    (apiService.bulkAddUsers as any).mockResolvedValue({ success: true });
    (apiService.fetchStats as any).mockResolvedValue({ data: [] });
  });

  it('should initialize with default filters', async () => {
    let rendered;
    await act(async () => {
      rendered = renderHook(() => useUsersViewModel());
    });

    // @ts-ignore
    const { result } = rendered;

    expect(result.current.filters).toEqual({
      gender: '',
      company: '',
      manufacturerId: '',
      sortBy: 'lastActive',
      order: 'desc',
      page: 1,
      limit: 10,
    });
    expect(result.current.selectedIds).toEqual([]);
    expect(result.current.manufacturerId).toBe('');
  });

  it('should fetch users on mount', async () => {
    const mockApiService = {
      fetchUsers: vi.fn().mockResolvedValue({ data: mockUsers }),
      fetchStats: vi.fn(),
      bulkAddUsers: vi.fn(),
    };

    await act(async () => {
      renderHook(() => useUsersViewModel(mockApiService));
    });

    expect(mockApiService.fetchUsers).toHaveBeenCalledWith({
      gender: '',
      company: '',
      manufacturerId: '',
      sortBy: 'lastActive',
      order: 'desc',
      page: 1,
      limit: 10,
    });
  });

  it('should update filters and refetch users', async () => {
    const mockApiService = {
      fetchUsers: vi.fn().mockResolvedValue({ data: mockUsers }),
      fetchStats: vi.fn(),
      bulkAddUsers: vi.fn(),
    };

    const { result } = renderHook(() => useUsersViewModel(mockApiService));

    mockApiService.fetchUsers.mockClear();

    await act(async () => {
      result.current.updateFilter('gender', 'male');
    });

    expect(result.current.filters.gender).toBe('male');

    expect(mockApiService.fetchUsers).toHaveBeenCalledWith({
      gender: 'male',
      company: '',
      manufacturerId: '',
      sortBy: 'lastActive',
      order: 'desc',
      page: 1,
      limit: 10,
    });
  });

  it('should reset page to 1 when limit is changed', async () => {
    const mockApiService = {
      fetchUsers: vi.fn().mockResolvedValue({ data: mockUsers }),
      fetchStats: vi.fn(),
      bulkAddUsers: vi.fn(),
    };

    const { result } = renderHook(() => useUsersViewModel(mockApiService));

    await act(async () => {
      result.current.updateFilter('page', 2);
    });

    expect(result.current.filters.page).toBe(2);

    mockApiService.fetchUsers.mockClear();

    await act(async () => {
      result.current.updateFilter('limit', 20);
    });

    expect(result.current.filters.page).toBe(1);
    expect(result.current.filters.limit).toBe(20);

    expect(mockApiService.fetchUsers).toHaveBeenCalledWith({
      gender: '',
      company: '',
      manufacturerId: '',
      sortBy: 'lastActive',
      order: 'desc',
      page: 1,
      limit: 20,
    });
  });

  it('should toggle user selection', async () => {
    const { result } = renderHook(() => useUsersViewModel());

    await act(async () => {
      result.current.toggleUser('1');
    });
    expect(result.current.selectedIds).toEqual(['1']);

    await act(async () => {
      result.current.toggleUser('2');
    });
    expect(result.current.selectedIds).toEqual(['1', '2']);

    await act(async () => {
      result.current.toggleUser('1');
    });
    expect(result.current.selectedIds).toEqual(['2']);
  });

  it('should return error when adding users without manufacturerId', async () => {
    const { result } = renderHook(() => useUsersViewModel());

    await act(async () => {
      result.current.toggleUser('1');
    });

    let response;
    await act(async () => {
      response = await result.current.handleAddToManufacturer();
    });

    expect(response).toEqual({ success: false, message: 'Fill all fields' });
  });

  it('should return error when adding users without selecting any', async () => {
    const { result } = renderHook(() => useUsersViewModel());

    await act(async () => {
      result.current.setManufacturerId('manu1');
    });

    let response;
    await act(async () => {
      response = await result.current.handleAddToManufacturer();
    });

    expect(response).toEqual({ success: false, message: 'Fill all fields' });
  });

  it('should handle API errors when adding users', async () => {
    const mockApiService = {
      fetchUsers: vi.fn().mockResolvedValue({ data: mockUsers }),
      fetchStats: vi.fn(),
      bulkAddUsers: vi.fn().mockRejectedValue(new Error('API error')),
    };

    const { result } = renderHook(() => useUsersViewModel(mockApiService));

    await act(async () => {
      result.current.toggleUser('1');
      result.current.setManufacturerId('manu1');
    });

    let response;
    await act(async () => {
      response = await result.current.handleAddToManufacturer();
    });

    expect(response).toEqual({ success: false, message: 'Failed to add users' });
  });
});