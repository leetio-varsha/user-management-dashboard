import React, { memo } from 'react';
import { type DataState } from '../interfaces/dataState';

interface LegacyDataStateDisplayProps {
  isLoading: boolean;
  error?: string;
  isEmpty: boolean;
  loadingMessage?: string;
  errorMessage?: string;
  emptyMessage?: string;
  children: React.ReactNode;
}

interface ModernDataStateDisplayProps<T> {
  state: DataState<T>;
  loadingMessage?: string;
  errorMessage?: string;
  emptyMessage?: string;
  children: React.ReactNode;
  isEmpty?: (data: T) => boolean;
}

type DataStateDisplayProps<T = any> = LegacyDataStateDisplayProps | ModernDataStateDisplayProps<T>;

function isModernProps<T>(props: DataStateDisplayProps<T>): props is ModernDataStateDisplayProps<T> {
  return 'state' in props;
}

function DataStateDisplayComponent<T = any>(props: DataStateDisplayProps<T>) {
  if (isModernProps(props)) {
    const {
      state,
      loadingMessage = 'Loading...',
      errorMessage,
      emptyMessage = 'No data available',
      children,
      isEmpty,
    } = props;

    if (state.status === 'loading') {
      return <div className="my-8 text-center text-gray-400">{loadingMessage}</div>;
    }

    if (state.status === 'error') {
      return <div className="my-8 text-center text-red-500">{errorMessage || state.error}</div>;
    }

    if (state.status === 'success' && isEmpty && isEmpty(state.data)) {
      return <div className="my-8 text-center text-gray-500 italic">{emptyMessage}</div>;
    }

    if (state.status === 'success') {
      return <>{children}</>;
    }

    return <div className="my-8 text-center text-gray-400">Ready to load data...</div>;
  }

  const {
    isLoading,
    error,
    isEmpty,
    loadingMessage = 'Loading...',
    errorMessage,
    emptyMessage = 'No data available',
    children,
  } = props;

  if (isLoading) {
    return <div className="my-8 text-center text-gray-400">{loadingMessage}</div>;
  }

  if (error) {
    return <div className="my-8 text-center text-red-500">{errorMessage || error}</div>;
  }

  if (isEmpty) {
    return <div className="my-8 text-center text-gray-500 italic">{emptyMessage}</div>;
  }

  return <>{children}</>;
}

// Use memo to prevent unnecessary re-renders when props haven't changed
export const DataStateDisplay = memo(DataStateDisplayComponent) as typeof DataStateDisplayComponent;
