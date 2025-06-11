import React from 'react';
import { memo } from 'react';

interface InputFilterProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  type?: string;
}

const InputFilter: React.FC<InputFilterProps> = ({
  value,
  onChange,
  placeholder,
  className = 'bg-gray-800 border border-gray-700 rounded px-3 py-2',
  type = 'text',
}) => {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={className}
    />
  );
};

export default memo(InputFilter);
