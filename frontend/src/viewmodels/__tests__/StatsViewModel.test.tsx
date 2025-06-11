import apiService from '../../services/apiService';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useStatsViewModel } from '../StatsViewModel';
import { mockStats } from '../../test/mocks/mockData';

vi.mock('../../services/apiService');

describe('useStatsViewModel', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    (apiService.fetchStats as any).mockResolvedValue({ data: mockStats });
  });

  it('should fetch stats on mount', async () => {
    const mockApiService = {
      fetchStats: vi.fn().mockResolvedValue({ data: mockStats }),
      fetchUsers: vi.fn(),
      bulkAddUsers: vi.fn(),
    };

    await act(async () => {
      renderHook(() => useStatsViewModel(mockApiService));
    });

    expect(mockApiService.fetchStats).toHaveBeenCalled();
  });

  it('should return stats data when fetch is successful', async () => {
    const mockApiService = {
      fetchStats: vi.fn().mockResolvedValue({ data: mockStats }),
      fetchUsers: vi.fn(),
      bulkAddUsers: vi.fn(),
    };

    let result: any;
    await act(async () => {
      const rendered = renderHook(() => useStatsViewModel(mockApiService));
      result = rendered.result;
    });

    expect(result?.current?.stats).toEqual(mockStats);
    expect(result?.current?.isEmpty).toBe(false);
    expect(result?.current?.error).toBeUndefined();
  });

  it('should handle empty stats', async () => {
    const mockApiService = {
      fetchStats: vi.fn().mockResolvedValue({ data: [] }),
      fetchUsers: vi.fn(),
      bulkAddUsers: vi.fn(),
    };

    let result: any;
    await act(async () => {
      const rendered = renderHook(() => useStatsViewModel(mockApiService));
      result = rendered.result;
    });

    expect(result?.current?.stats).toEqual([]);
    expect(result?.current?.isEmpty).toBe(true);
  });

  it('should allow manual refresh of stats', async () => {
    const mockApiService = {
      fetchStats: vi.fn().mockResolvedValue({ data: mockStats }),
      fetchUsers: vi.fn(),
      bulkAddUsers: vi.fn(),
    };

    let result: any;
    await act(async () => {
      const rendered = renderHook(() => useStatsViewModel(mockApiService));
      result = rendered.result;
    });

    // Clear initial call
    mockApiService.fetchStats.mockClear();

    // Call loadStats manually
    await act(async () => {
      result?.current?.loadStats();
    });

    expect(mockApiService.fetchStats).toHaveBeenCalled();
  });
});
