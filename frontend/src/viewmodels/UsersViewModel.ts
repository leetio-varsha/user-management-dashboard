import { useState, useEffect, useCallback } from 'react';
import { type UserFilters } from '../interfaces/user';
import defaultApiService, { type ApiService, type FetchUsersResponse } from '../services/apiService';
import { useBaseViewModel } from '../hooks/useBaseViewModel.ts';

export function useUsersViewModel(apiService: ApiService = defaultApiService) {
  const [filters, setFilters] = useState<UserFilters>({
    gender: '',
    company: '',
    manufacturerId: '',
    sortBy: 'lastActive',
    order: 'desc',
    page: 1,
    limit: 10,
  });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [manufacturerId, setManufacturerId] = useState('');

  const fetchWithFilters = useCallback(
    (filters: UserFilters) => {
      return apiService.fetchUsers(filters);
    },
    [apiService]
  );

  const { viewModel, data, isLoading, error } = useBaseViewModel<FetchUsersResponse, [UserFilters]>(fetchWithFilters);

  const users = data?.users || [];

  const loadUsers = useCallback(() => {
    void viewModel.fetchData(filters);
  }, [viewModel, filters]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const updateFilter = (key: keyof UserFilters, value: UserFilters[keyof UserFilters]) => {
    setFilters((prev) => {
      if (key === 'limit') {
        return { ...prev, [key]: Number(value), page: 1 };
      }
      return { ...prev, [key]: value };
    });
  };

  const toggleUser = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleAddToManufacturer = async () => {
    if (!manufacturerId || selectedIds.length === 0) {
      return { success: false, message: 'Fill all fields' };
    }

    try {
      const selectedUsers = users.filter((u) => selectedIds.includes(u._id));
      await apiService.bulkAddUsers(selectedUsers, manufacturerId);
      setSelectedIds([]);
      await loadUsers();
      return { success: true, message: 'Users added!' };
    } catch (err) {
      return { success: false, message: 'Failed to add users' };
    }
  };

  return {
    users,
    filters,
    updateFilter,
    selectedIds,
    toggleUser,
    manufacturerId,
    setManufacturerId,
    handleAddToManufacturer,
    isLoading,
    error,
    isEmpty: !users || users.length === 0,
  };
}
