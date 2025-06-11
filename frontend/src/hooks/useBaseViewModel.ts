import { useMemo, useState } from 'react';
import type { DataState } from '../interfaces/dataState.ts';
import { BaseViewModel } from '../viewmodels/BaseViewModel.ts';

export function useBaseViewModel<T, P extends any[] = []>(fetchFn: (...params: P) => Promise<{ data: T }>) {
  const [state, setState] = useState<DataState<T>>({ status: 'idle' });
  const viewModel = useMemo(() => new BaseViewModel<T, P>(fetchFn, setState), [fetchFn, setState]);

  return {
    viewModel,
    state,
    isLoading: state.status === 'loading',
    isError: state.status === 'error',
    isSuccess: state.status === 'success',
    error: state.status === 'error' ? state.error : undefined,
    data: state.status === 'success' ? state.data : undefined,
  };
}
