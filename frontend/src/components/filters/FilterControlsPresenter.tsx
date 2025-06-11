import React from 'react';
import { memo } from 'react';
import SelectFilter from './SelectFilter';
import InputFilter from './InputFilter';
import ButtonFilter from './ButtonFilter';
import { type FilterOption } from '../../interfaces/filters';

interface FilterControlsPresenterProps {
  genderFilter: string;
  onGenderChange: (value: string) => void;
  genderOptions: FilterOption[];

  companyFilter: string;
  onCompanyChange: (value: string) => void;

  manufacturerFilter: string;
  onManufacturerChange: (value: string) => void;

  sortBy: string;
  onSortByChange: (value: string) => void;
  sortOptions: FilterOption[];

  order: 'asc' | 'desc';
  onOrderChange: (value: 'asc' | 'desc') => void;
  orderOptions: FilterOption[];

  manufacturerId: string;
  onManufacturerIdChange: (value: string) => void;

  limit: number;
  onLimitChange: (value: number) => void;
  limitOptions: FilterOption[];

  onAddToManufacturer: () => void;
}

const FilterControlsPresenter: React.FC<FilterControlsPresenterProps> = ({
  genderFilter,
  onGenderChange,
  genderOptions,

  companyFilter,
  onCompanyChange,

  manufacturerFilter,
  onManufacturerChange,

  sortBy,
  onSortByChange,
  sortOptions,

  order,
  onOrderChange,
  orderOptions,

  manufacturerId,
  onManufacturerIdChange,

  limit,
  onLimitChange,
  limitOptions,

  onAddToManufacturer,
}) => {
  return (
    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-8">
      <SelectFilter
        value={genderFilter}
        onChange={onGenderChange}
        options={genderOptions}
        placeholder="Filter by gender"
      />

      <InputFilter value={companyFilter} onChange={onCompanyChange} placeholder="Company" />

      <InputFilter value={manufacturerFilter} onChange={onManufacturerChange} placeholder="Filter by Manufacturer" />

      <SelectFilter value={sortBy} onChange={onSortByChange} options={sortOptions} placeholder="Sort by" />

      <SelectFilter
        value={order}
        onChange={(value) => onOrderChange(value as 'asc' | 'desc')}
        options={orderOptions}
        placeholder="Order"
      />

      <SelectFilter
        value={String(limit)}
        onChange={(value) => onLimitChange(Number(value))}
        options={limitOptions}
        placeholder="Items per page"
      />

      <InputFilter value={manufacturerId} onChange={onManufacturerIdChange} placeholder="New Manufacturer ID" />

      <ButtonFilter onClick={onAddToManufacturer}>Add to Manufacturer</ButtonFilter>
    </div>
  );
};

export default memo(FilterControlsPresenter);
