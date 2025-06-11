import { describe, it, expect } from 'vitest';
import { render, screen } from '../../test/utils/test-utils';
import { DataStateDisplay } from '../DataStateDisplay';

describe('DataStateDisplay', () => {
  const childContent = 'Child content';
  const loadingMessage = 'Custom loading message';
  const errorMessage = 'Custom error message';
  const emptyMessage = 'Custom empty message';

  describe('Legacy Props', () => {
    it('should render loading state', () => {
      render(
        <DataStateDisplay isLoading={true} isEmpty={false} loadingMessage={loadingMessage}>
          <div>{childContent}</div>
        </DataStateDisplay>
      );

      expect(screen.getByText(loadingMessage)).toBeInTheDocument();
      expect(screen.queryByText(childContent)).not.toBeInTheDocument();
    });

    it('should render error state', () => {
      const error = 'An error occurred';

      render(
        <DataStateDisplay isLoading={false} isEmpty={false} error={error}>
          <div>{childContent}</div>
        </DataStateDisplay>
      );

      expect(screen.getByText(error)).toBeInTheDocument();
      expect(screen.queryByText(childContent)).not.toBeInTheDocument();
    });

    it('should render custom error message when provided', () => {
      const error = 'An error occurred';

      render(
        <DataStateDisplay isLoading={false} isEmpty={false} error={error} errorMessage={errorMessage}>
          <div>{childContent}</div>
        </DataStateDisplay>
      );

      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(screen.queryByText(error)).not.toBeInTheDocument();
      expect(screen.queryByText(childContent)).not.toBeInTheDocument();
    });

    it('should render empty state', () => {
      render(
        <DataStateDisplay isLoading={false} isEmpty={true} emptyMessage={emptyMessage}>
          <div>{childContent}</div>
        </DataStateDisplay>
      );

      expect(screen.getByText(emptyMessage)).toBeInTheDocument();
      expect(screen.queryByText(childContent)).not.toBeInTheDocument();
    });

    it('should render children when not loading, no error, and not empty', () => {
      render(
        <DataStateDisplay isLoading={false} isEmpty={false}>
          <div>{childContent}</div>
        </DataStateDisplay>
      );

      expect(screen.getByText(childContent)).toBeInTheDocument();
    });
  });

  describe('Modern Props', () => {
    it('should render loading state', () => {
      render(
        <DataStateDisplay state={{ status: 'loading' }} loadingMessage={loadingMessage}>
          <div>{childContent}</div>
        </DataStateDisplay>
      );

      expect(screen.getByText(loadingMessage)).toBeInTheDocument();
      expect(screen.queryByText(childContent)).not.toBeInTheDocument();
    });

    it('should render error state with error from state', () => {
      const error = 'An error occurred';

      render(
        <DataStateDisplay state={{ status: 'error', error }}>
          <div>{childContent}</div>
        </DataStateDisplay>
      );

      expect(screen.getByText(error)).toBeInTheDocument();
      expect(screen.queryByText(childContent)).not.toBeInTheDocument();
    });

    it('should render custom error message when provided', () => {
      const error = 'An error occurred';

      render(
        <DataStateDisplay state={{ status: 'error', error }} errorMessage={errorMessage}>
          <div>{childContent}</div>
        </DataStateDisplay>
      );

      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(screen.queryByText(error)).not.toBeInTheDocument();
      expect(screen.queryByText(childContent)).not.toBeInTheDocument();
    });

    it('should render empty state when isEmpty function returns true', () => {
      const data = [] as string[];

      render(
        <DataStateDisplay
          state={{ status: 'success', data }}
          isEmpty={(data) => data.length === 0}
          emptyMessage={emptyMessage}
        >
          <div>{childContent}</div>
        </DataStateDisplay>
      );

      expect(screen.getByText(emptyMessage)).toBeInTheDocument();
      expect(screen.queryByText(childContent)).not.toBeInTheDocument();
    });

    it('should render children when status is success and not empty', () => {
      const data = ['item1', 'item2'];

      render(
        <DataStateDisplay state={{ status: 'success', data }} isEmpty={(data) => data.length === 0}>
          <div>{childContent}</div>
        </DataStateDisplay>
      );

      expect(screen.getByText(childContent)).toBeInTheDocument();
    });

    it('should render idle state message when status is idle', () => {
      render(
        <DataStateDisplay state={{ status: 'idle' }}>
          <div>{childContent}</div>
        </DataStateDisplay>
      );

      expect(screen.getByText('Ready to load data...')).toBeInTheDocument();
      expect(screen.queryByText(childContent)).not.toBeInTheDocument();
    });
  });
});
