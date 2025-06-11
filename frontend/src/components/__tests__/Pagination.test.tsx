import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../test/utils/test-utils';
import { Pagination } from '../Pagination';

describe('Pagination', () => {
  it('should render with the correct page number', () => {
    render(<Pagination currentPage={3} onPageChange={() => {}} />);
    expect(screen.getByText('Page 3')).toBeInTheDocument();
  });

  it('should disable the Prev button when on page 1', () => {
    render(<Pagination currentPage={1} onPageChange={() => {}} />);
    const prevButton = screen.getByText('Prev');
    expect(prevButton).toBeDisabled();
  });

  it('should enable the Prev button when not on page 1', () => {
    render(<Pagination currentPage={2} onPageChange={() => {}} />);
    const prevButton = screen.getByText('Prev');
    expect(prevButton).not.toBeDisabled();
  });

  it('should disable the Next button when disableNext is true', () => {
    render(<Pagination currentPage={3} onPageChange={() => {}} disableNext={true} />);
    const nextButton = screen.getByText('Next');
    expect(nextButton).toBeDisabled();
  });

  it('should enable the Next button when disableNext is false', () => {
    render(<Pagination currentPage={3} onPageChange={() => {}} disableNext={false} />);
    const nextButton = screen.getByText('Next');
    expect(nextButton).not.toBeDisabled();
  });

  it('should call onPageChange with previous page when Prev button is clicked', () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={3} onPageChange={onPageChange} />);

    const prevButton = screen.getByText('Prev');
    fireEvent.click(prevButton);

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('should call onPageChange with next page when Next button is clicked', () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={3} onPageChange={onPageChange} />);

    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);

    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it('should respect explicit disablePrevious prop', () => {
    render(<Pagination currentPage={3} onPageChange={() => {}} disablePrevious={true} />);
    const prevButton = screen.getByText('Prev');
    expect(prevButton).toBeDisabled();
  });
});
