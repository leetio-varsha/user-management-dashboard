import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../test/utils/test-utils';
import { Table } from '../Table';

interface TestItem {
  id: number;
  name: string;
  age: number;
}

describe('Table', () => {
  const testData: TestItem[] = [
    { id: 1, name: 'John Doe', age: 30 },
    { id: 2, name: 'Jane Smith', age: 25 },
    { id: 3, name: 'Bob Johnson', age: 40 },
  ];

  const columns = [
    { header: 'ID', accessor: 'id' as const },
    { header: 'Name', accessor: 'name' as const },
    { header: 'Age', accessor: 'age' as const },
  ];

  const keyExtractor = (item: TestItem) => item.id;

  it('should render the correct headers', () => {
    render(<Table data={testData} columns={columns} keyExtractor={keyExtractor} />);

    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
  });

  it('should render the correct data in cells', () => {
    render(<Table data={testData} columns={columns} keyExtractor={keyExtractor} />);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();

    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();

    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
    expect(screen.getByText('40')).toBeInTheDocument();
  });

  it('should handle function accessors correctly', () => {
    const columnsWithFunction = [
      { header: 'ID', accessor: 'id' as const },
      { header: 'Name', accessor: 'name' as const },
      {
        header: 'Age Status',
        accessor: (item: TestItem) => (item.age >= 30 ? 'Senior' : 'Junior'),
      },
    ];

    render(<Table data={testData} columns={columnsWithFunction} keyExtractor={keyExtractor} />);

    expect(screen.getAllByText('Senior').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Junior').length).toBeGreaterThan(0);
  });

  it('should call onRowClick when a row is clicked', () => {
    const onRowClick = vi.fn();

    render(<Table data={testData} columns={columns} keyExtractor={keyExtractor} onRowClick={onRowClick} />);

    // Click on the first row (we'll use the first cell's text to find it)
    fireEvent.click(screen.getByText('John Doe'));

    expect(onRowClick).toHaveBeenCalledTimes(1);
    expect(onRowClick).toHaveBeenCalledWith(testData[0]);
  });

  it('should apply custom row class names', () => {
    const rowClassName = (item: TestItem) => (item.age >= 30 ? 'text-green-500' : 'text-red-500');

    const { container } = render(
      <Table data={testData} columns={columns} keyExtractor={keyExtractor} rowClassName={rowClassName} />
    );

    const rows = container.querySelectorAll('tbody tr');
    expect(rows[0]).toHaveClass('text-green-500'); // John Doe, age 30
    expect(rows[1]).toHaveClass('text-red-500'); // Jane Smith, age 25
    expect(rows[2]).toHaveClass('text-green-500'); // Bob Johnson, age 40
  });
});
