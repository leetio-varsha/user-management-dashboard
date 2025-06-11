import React from 'react';
import { memo } from 'react';

interface ButtonFilterProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

const ButtonFilter: React.FC<ButtonFilterProps> = ({
  onClick,
  children,
  className = 'bg-blue-600 hover:bg-blue-700 transition text-white font-medium rounded px-3 py-2',
  disabled = false,
}) => {
  return (
    <button className={className} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};

export default memo(ButtonFilter);
