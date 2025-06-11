import { describe, it, expect } from 'vitest';
import { render, screen } from '../../test/utils/test-utils';
import { EngagementBadge } from '../EngagementBadge';

describe('EngagementBadge', () => {
  it('should render with the correct text', () => {
    render(<EngagementBadge level="Highly Engaged" count={5} />);
    expect(screen.getByText('Highly Engaged: 5')).toBeInTheDocument();
  });

  it('should apply green color class for Highly Engaged level', () => {
    const { container } = render(<EngagementBadge level="Highly Engaged" count={5} />);
    const badge = container.querySelector('span');
    expect(badge).toHaveClass('bg-green-600');
    expect(badge).toHaveClass('text-white');
  });

  it('should apply yellow color class for Moderately Engaged level', () => {
    const { container } = render(<EngagementBadge level="Moderately Engaged" count={3} />);
    const badge = container.querySelector('span');
    expect(badge).toHaveClass('bg-yellow-600');
    expect(badge).toHaveClass('text-white');
  });

  it('should apply red color class for other engagement levels', () => {
    const { container } = render(<EngagementBadge level="Low Engagement" count={1} />);
    const badge = container.querySelector('span');
    expect(badge).toHaveClass('bg-red-600');
    expect(badge).toHaveClass('text-white');
  });
});
