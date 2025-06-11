import React from 'react';

interface EngagementBadgeProps {
  level: string;
  count: number;
}

export const EngagementBadge: React.FC<EngagementBadgeProps> = ({ level, count }) => {
  const getBadgeColor = () => {
    switch (level) {
      case 'Highly Engaged':
        return 'bg-green-600 text-white';
      case 'Moderately Engaged':
        return 'bg-yellow-600 text-white';
      default:
        return 'bg-red-600 text-white';
    }
  };

  return (
    <span className={`mr-2 inline-block rounded-full px-2 py-1 text-sm font-medium ${getBadgeColor()}`}>
      {level}: {count}
    </span>
  );
};
