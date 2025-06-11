import React from 'react';

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T, index: number) => string | number;
  onRowClick?: (item: T) => void;
  rowClassName?: (item: T) => string;
}

export function Table<T>({ data, columns, keyExtractor, onRowClick, rowClassName }: TableProps<T>) {
  return (
    <div className="overflow-auto rounded shadow-lg">
      <table className="w-full table-auto border-collapse">
        <thead className="bg-gray-800">
          <tr>
            {columns.map((column, index) => (
              <th key={index} className={`px-4 py-3 text-left ${column.className || ''}`}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={keyExtractor(item, index)}
              className={`border-t border-gray-700 transition hover:bg-gray-800 ${rowClassName ? rowClassName(item) : ''}`}
              onClick={onRowClick ? () => onRowClick(item) : undefined}
              style={onRowClick ? { cursor: 'pointer' } : undefined}
            >
              {columns.map((column, colIndex) => (
                <td key={colIndex} className="px-4 py-2">
                  {typeof column.accessor === 'function'
                    ? column.accessor(item)
                    : (item[column.accessor] as React.ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
