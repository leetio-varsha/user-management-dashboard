import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBaseViewModel } from '../useBaseViewModel';

describe('useBaseViewModel', () => {
  // Test data
  type TestData = { value: string };
  const testData: TestData = { value: 'test' };
  const testError = 'Test error';

  // Mock fetch function
  // @ts-ignore
  let fetchFn: vi.Mock;

  beforeEach(() => {
    // Reset mock before each test
    fetchFn = vi.fn().mockResolvedValue({ data: testData });
  });

  it('should initialize with idle state', () => {
    const { result } = renderHook(() => useBaseViewModel<TestData>(fetchFn));

    expect(result.current.state).toEqual({ status: 'idle' });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.error).toBeUndefined();
    expect(result.current.data).toBeUndefined();
  });

  it('should return a viewModel instance', () => {
    const { result } = renderHook(() => useBaseViewModel<TestData>(fetchFn));

    expect(result.current.viewModel).toBeDefined();
    expect(typeof result.current.viewModel.fetchData).toBe('function');
    expect(typeof result.current.viewModel.setData).toBe('function');
    expect(typeof result.current.viewModel.setError).toBe('function');
    expect(typeof result.current.viewModel.reset).toBe('function');
  });

  it('should update state when fetchData is called', async () => {
    const { result } = renderHook(() => useBaseViewModel<TestData>(fetchFn));

    // Call fetchData
    await act(async () => {
      await result.current.viewModel.fetchData();
    });

    // Check that state was updated
    expect(result.current.state).toEqual({ status: 'success', data: testData });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.isSuccess).toBe(true);
    expect(result.current.error).toBeUndefined();
    expect(result.current.data).toEqual(testData);
  });

  it('should update state when fetchData fails', async () => {
    const error = new Error(testError);
    fetchFn.mockRejectedValueOnce(error);

    const { result } = renderHook(() => useBaseViewModel<TestData>(fetchFn));

    // Call fetchData and catch the error
    await act(async () => {
      try {
        await result.current.viewModel.fetchData();
      } catch (e) {
        // Expected error
      }
    });

    // Check that state was updated
    expect(result.current.state).toEqual({ status: 'error', error: testError });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(true);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.error).toBe(testError);
    expect(result.current.data).toBeUndefined();
  });

  it('should update state when setData is called', () => {
    const { result } = renderHook(() => useBaseViewModel<TestData>(fetchFn));

    // Call setData
    act(() => {
      result.current.viewModel.setData(testData);
    });

    // Check that state was updated
    expect(result.current.state).toEqual({ status: 'success', data: testData });
    expect(result.current.isSuccess).toBe(true);
    expect(result.current.data).toEqual(testData);
  });

  it('should update state when setError is called', () => {
    const { result } = renderHook(() => useBaseViewModel<TestData>(fetchFn));

    // Call setError
    act(() => {
      result.current.viewModel.setError(testError);
    });

    // Check that state was updated
    expect(result.current.state).toEqual({ status: 'error', error: testError });
    expect(result.current.isError).toBe(true);
    expect(result.current.error).toBe(testError);
  });

  it('should update state when reset is called', () => {
    const { result } = renderHook(() => useBaseViewModel<TestData>(fetchFn));

    // First set some data
    act(() => {
      result.current.viewModel.setData(testData);
    });

    // Then reset
    act(() => {
      result.current.viewModel.reset();
    });

    // Check that state was reset
    expect(result.current.state).toEqual({ status: 'idle' });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.error).toBeUndefined();
    expect(result.current.data).toBeUndefined();
  });
});
