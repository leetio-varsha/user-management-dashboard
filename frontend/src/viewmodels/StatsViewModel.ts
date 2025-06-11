import { useEffect, useCallback } from 'react';
import { type StatGroup } from '../interfaces/stats';
import defaultApiService, { type ApiService } from '../services/apiService';
import { useBaseViewModel } from '../hooks/useBaseViewModel.ts';

export function useStatsViewModel(apiService: ApiService = defaultApiService) {
  const fetchStats = useCallback(() => {
    return apiService.fetchStats();
  }, [apiService]);

  const { viewModel, data: stats = [], isLoading, error } = useBaseViewModel<StatGroup[]>(fetchStats);

  const loadStats = useCallback(() => {
    viewModel.fetchData();
  }, [viewModel]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return {
    stats,
    isLoading,
    error,
    isEmpty: !stats || stats.length === 0,
    loadStats,
  };
}
