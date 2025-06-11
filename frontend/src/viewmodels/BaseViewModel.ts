import { type DataState } from '../interfaces/dataState';

/**
 * Base class for ViewModels that handles common loading/error states
 */
export class BaseViewModel<T, P extends any[] = []> {
  private fetchFn: (...params: P) => Promise<{ data: T }>;
  private setState: React.Dispatch<React.SetStateAction<DataState<T>>>;

  constructor(
    fetchFn: (...params: P) => Promise<{ data: T }>,
    setState: React.Dispatch<React.SetStateAction<DataState<T>>>
  ) {
    this.fetchFn = fetchFn;
    this.setState = setState;
  }

  fetchData = async (...params: P) => {
    try {
      this.setState({ status: 'loading' });
      const response = await this.fetchFn(...params);
      this.setState({ status: 'success', data: response.data });
      return response.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      this.setState({ status: 'error', error: errorMessage });
      throw error;
    }
  };

  setData = (data: T) => {
    this.setState({ status: 'success', data });
  };

  setError = (error: string) => {
    this.setState({ status: 'error', error });
  };

  reset = () => {
    this.setState({ status: 'idle' });
  };
}
