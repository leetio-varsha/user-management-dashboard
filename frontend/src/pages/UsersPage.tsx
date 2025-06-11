import { PageLayout } from '../components/PageLayout';
import { DataStateDisplay } from '../components/DataStateDisplay';
import { Table } from '../components/Table';
import { FilterControls } from '../components/filters/FilterControls';
import { Pagination } from '../components/Pagination';
import { useUsersViewModel } from '../viewmodels/UsersViewModel';
import { type User } from '../interfaces/user';
import { genderOptions, sortOptions, limitOptions, orderOptions } from '../constants/filterOptions';

export default function UsersPage() {
  const {
    users,
    filters,
    updateFilter,
    selectedIds,
    toggleUser,
    manufacturerId,
    setManufacturerId,
    handleAddToManufacturer,
    isLoading,
    error,
    isEmpty,
  } = useUsersViewModel();

  const columns = [
    {
      header: '',
      accessor: (user: User) => (
        <input
          type="checkbox"
          checked={selectedIds.includes(user._id)}
          onChange={() => toggleUser(user._id)}
          className="accent-blue-600"
        />
      ),
    },
    {
      header: 'Name',
      accessor: (user: User) => `${user.firstName} ${user.lastName}`,
    },
    {
      header: 'Email',
      accessor: 'email' as keyof User,
    },
    {
      header: 'Company',
      accessor: 'company' as keyof User,
    },
    {
      header: 'Last Active',
      accessor: (user: User) => new Date(user.lastActive).toLocaleDateString(),
    },
    {
      header: 'Manufacturer',
      accessor: (user: User) => user.manufacturerId || <span className="text-gray-500 italic">—</span>,
    },
  ];

  const getRowClassName = (user: User) => (user.manufacturerId ? 'bg-gray-800/50' : '');

  return (
    <PageLayout title="User Management Dashboard">
      <FilterControls
        genderFilter={filters.gender}
        onGenderChange={(value) => updateFilter('gender', value)}
        genderOptions={genderOptions}
        companyFilter={filters.company}
        onCompanyChange={(value) => updateFilter('company', value)}
        manufacturerFilter={filters.manufacturerId}
        onManufacturerChange={(value) => updateFilter('manufacturerId', value)}
        sortBy={filters.sortBy}
        onSortByChange={(value) => updateFilter('sortBy', value)}
        sortOptions={sortOptions}
        order={filters.order}
        onOrderChange={(value) => updateFilter('order', value)}
        manufacturerId={manufacturerId}
        onManufacturerIdChange={setManufacturerId}
        limit={filters.limit}
        onLimitChange={(value) => updateFilter('limit', value)}
        limitOptions={limitOptions}
        onAddToManufacturer={async () => {
          const result = await handleAddToManufacturer();
          if (result) {
            alert(result.message);
          }
        }}
        orderOptions={orderOptions}
      />

      <div className="mb-4">
        <DataStateDisplay
          isLoading={isLoading}
          error={error}
          isEmpty={isEmpty}
          loadingMessage="Loading users..."
          emptyMessage="No users found"
        >
          <Table data={users} columns={columns} keyExtractor={(user) => user._id} rowClassName={getRowClassName} />
        </DataStateDisplay>
      </div>

      <Pagination
        currentPage={filters.page}
        onPageChange={(value) => updateFilter('page', value)}
        disablePrevious={filters.page === 1}
      />
    </PageLayout>
  );
}
