import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BaseViewModel } from '../BaseViewModel';

describe('BaseViewModel', () => {
  type TestData = { value: string };
  const testData: TestData = { value: 'test' };
  const testError = 'Test error';

  // Mock functions
  // @ts-ignore
  let fetchFn: vi.Mock;
  // @ts-ignore
  let setState: vi.Mock;
  type FetchParams = any[];
  let viewModel: BaseViewModel<TestData, FetchParams>;

  beforeEach(() => {
    // Reset mocks before each test
    fetchFn = vi.fn().mockResolvedValue({ data: testData });
    setState = vi.fn();
    viewModel = new BaseViewModel<TestData, [string, number]>(fetchFn, setState);
  });

  describe('fetchData', () => {
    it('should set loading state, call fetchFn, and set success state with data', async () => {
      await viewModel.fetchData();

      // Check that setState was called with loading state
      expect(setState).toHaveBeenCalledWith({ status: 'loading' });

      // Check that fetchFn was called
      expect(fetchFn).toHaveBeenCalled();

      // Check that setState was called with success state and data
      expect(setState).toHaveBeenCalledWith({ status: 'success', data: testData });
    });

    it('should set error state when fetchFn throws an error', async () => {
      const error = new Error(testError);
      fetchFn.mockRejectedValueOnce(error);

      // Call fetchData and expect it to throw
      await expect(viewModel.fetchData()).rejects.toThrow(error);

      // Check that setState was called with loading state
      expect(setState).toHaveBeenCalledWith({ status: 'loading' });

      // Check that setState was called with error state
      expect(setState).toHaveBeenCalledWith({ status: 'error', error: testError });
    });

    it('should handle non-Error objects thrown by fetchFn', async () => {
      fetchFn.mockRejectedValueOnce('string error');

      // Call fetchData and expect it to throw
      await expect(viewModel.fetchData()).rejects.toBe('string error');

      // Check that setState was called with error state and default message
      expect(setState).toHaveBeenCalledWith({ status: 'error', error: 'An unknown error occurred' });
    });

    it('should pass parameters to fetchFn', async () => {
      const param1 = 'param1';
      const param2 = 123;

      await viewModel.fetchData(param1, param2);

      expect(fetchFn).toHaveBeenCalledWith(param1, param2);
    });
  });

  describe('setData', () => {
    it('should set success state with provided data', () => {
      viewModel.setData(testData);

      expect(setState).toHaveBeenCalledWith({ status: 'success', data: testData });
    });
  });

  describe('setError', () => {
    it('should set error state with provided error message', () => {
      viewModel.setError(testError);

      expect(setState).toHaveBeenCalledWith({ status: 'error', error: testError });
    });
  });

  describe('reset', () => {
    it('should set idle state', () => {
      viewModel.reset();

      expect(setState).toHaveBeenCalledWith({ status: 'idle' });
    });
  });
});
