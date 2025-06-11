import React from 'react';
import { memo } from 'react';

interface FilterOption {
  value: string | number;
  label: string;
}

interface SelectFilterProps {
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  placeholder?: string;
  className?: string;
}

const SelectFilter: React.FC<SelectFilterProps> = ({
  value,
  onChange,
  options,
  placeholder,
  className = 'bg-gray-800 border border-gray-700 rounded px-3 py-2',
}) => {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className={className} aria-label={placeholder}>
      {options.map((option, index) => (
        <option key={index} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default memo(SelectFilter);
