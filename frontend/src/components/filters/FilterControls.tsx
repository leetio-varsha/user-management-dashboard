import React, { useCallback } from 'react';
import FilterControlsPresenter from './FilterControlsPresenter';
import { genderOptions, sortOptions, limitOptions, orderOptions } from '../../constants/filterOptions';
import { type FilterOption } from '../../interfaces/filters';

interface FilterControlsProps {
  genderFilter: string;
  onGenderChange: (value: string) => void;

  companyFilter: string;
  onCompanyChange: (value: string) => void;

  manufacturerFilter: string;
  onManufacturerChange: (value: string) => void;

  sortBy: string;
  onSortByChange: (value: string) => void;

  order: 'asc' | 'desc';
  onOrderChange: (value: 'asc' | 'desc') => void;

  manufacturerId: string;
  onManufacturerIdChange: (value: string) => void;

  limit: number;
  onLimitChange: (value: number) => void;

  onAddToManufacturer: () => void;

  // Optional props to override default options
  genderOptions?: FilterOption[];
  sortOptions?: FilterOption[];
  limitOptions?: FilterOption[];
  orderOptions?: FilterOption[];
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  genderFilter,
  onGenderChange,

  companyFilter,
  onCompanyChange,

  manufacturerFilter,
  onManufacturerChange,

  sortBy,
  onSortByChange,

  order,
  onOrderChange,

  manufacturerId,
  onManufacturerIdChange,

  limit,
  onLimitChange,

  onAddToManufacturer,

  genderOptions: customGenderOptions = genderOptions,
  sortOptions: customSortOptions = sortOptions,
  limitOptions: customLimitOptions = limitOptions,
  orderOptions: customOrderOptions = orderOptions,
}) => {

  const handleGenderChange = useCallback(
    (value: string) => {
      onGenderChange(value);
    },
    [onGenderChange]
  );

  const handleCompanyChange = useCallback(
    (value: string) => {
      onCompanyChange(value);
    },
    [onCompanyChange]
  );

  const handleManufacturerChange = useCallback(
    (value: string) => {
      onManufacturerChange(value);
    },
    [onManufacturerChange]
  );

  const handleSortByChange = useCallback(
    (value: string) => {
      onSortByChange(value);
    },
    [onSortByChange]
  );

  const handleOrderChange = useCallback(
    (value: 'asc' | 'desc') => {
      onOrderChange(value);
    },
    [onOrderChange]
  );

  const handleManufacturerIdChange = useCallback(
    (value: string) => {
      onManufacturerIdChange(value);
    },
    [onManufacturerIdChange]
  );

  const handleLimitChange = useCallback(
    (value: number) => {
      onLimitChange(value);
    },
    [onLimitChange]
  );

  const handleAddToManufacturer = useCallback(() => {
    onAddToManufacturer();
  }, [onAddToManufacturer]);

  return (
    <FilterControlsPresenter
      genderFilter={genderFilter}
      onGenderChange={handleGenderChange}
      genderOptions={customGenderOptions}
      companyFilter={companyFilter}
      onCompanyChange={handleCompanyChange}
      manufacturerFilter={manufacturerFilter}
      onManufacturerChange={handleManufacturerChange}
      sortBy={sortBy}
      onSortByChange={handleSortByChange}
      sortOptions={customSortOptions}
      order={order}
      onOrderChange={handleOrderChange}
      orderOptions={customOrderOptions}
      manufacturerId={manufacturerId}
      onManufacturerIdChange={handleManufacturerIdChange}
      limit={limit}
      onLimitChange={handleLimitChange}
      limitOptions={customLimitOptions}
      onAddToManufacturer={handleAddToManufacturer}
    />
  );
};
