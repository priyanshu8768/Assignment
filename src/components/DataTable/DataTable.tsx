import React, { useState } from "react";

export interface Column<T> {
  key: string;
  title: string;
  dataIndex: keyof T;
  sortable?: boolean;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  selectable?: boolean;
  onRowSelect?: (selectedRows: T[]) => void;
}

export function DataTable<T>({ data, columns, loading, selectable, onRowSelect }: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedRows, setSelectedRows] = useState<T[]>([]);

  // Sorting logic
  const sortedData = React.useMemo(() => {
    if (!sortKey) return data;
    const col = columns.find(c => c.key === sortKey);
    if (!col) return data;
    return [...data].sort((a, b) => {
      const aValue = a[col.dataIndex];
      const bValue = b[col.dataIndex];
      if (aValue === bValue) return 0;
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [data, sortKey, sortOrder, columns]);

  // Row selection logic
  const handleRowSelect = (row: T) => {
    let updated: T[] = [];
    if (selectable) {
      if (selectedRows.includes(row)) {
        updated = selectedRows.filter(r => r !== row);
      } else {
        updated = [...selectedRows, row];
      }
      setSelectedRows(updated);
      onRowSelect && onRowSelect(updated);
    }
  };

  const handleSelectAll = () => {
    if (selectedRows.length === data.length) {
      setSelectedRows([]);
      onRowSelect && onRowSelect([]);
    } else {
      setSelectedRows([...data]);
      onRowSelect && onRowSelect([...data]);
    }
  };

  // Render
  return (
    <div className="overflow-x-auto w-full">
  <table className="datatable">
        <thead className="bg-gray-50">
          <tr>
            {selectable && (
              <th>
                <input
                  type="checkbox"
                  aria-label="Select all rows"
                  checked={selectedRows.length === data.length && data.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
            )}
            {columns.map(col => (
              <th
                key={col.key}
                className="text-left font-semibold cursor-pointer select-none"
                onClick={() => {
                  if (col.sortable) {
                    if (sortKey === col.key) {
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    } else {
                      setSortKey(col.key);
                      setSortOrder('asc');
                    }
                  }
                }}
                aria-sort={sortKey === col.key ? (sortOrder === 'asc' ? 'ascending' : 'descending') : undefined}
                tabIndex={col.sortable ? 0 : -1}
              >
                {col.title}
                {col.sortable && (
                  <span className="ml-1 text-xs">
                    {sortKey === col.key ? (sortOrder === 'asc' ? '▲' : '▼') : '↕'}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length + (selectable ? 1 : 0)} className="text-center py-8">
                <span className="animate-pulse text-gray-400">Loading...</span>
              </td>
            </tr>
          ) : sortedData.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (selectable ? 1 : 0)} className="text-center py-8 text-gray-400">
                No data available
              </td>
            </tr>
          ) : (
            sortedData.map((row, rowIdx) => {
              // Use id for comparison if present
              const rowId = (row as any).id ?? rowIdx;
              const isSelected = selectable && selectedRows.some(r => (r as any).id === rowId);
              return (
                <tr
                  key={rowId}
                  className={isSelected ? "selected" : ""}
                  onClick={() => selectable && handleRowSelect(row)}
                  aria-selected={isSelected}
                >
                  {selectable && (
                    <td>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleRowSelect(row)}
                        aria-label={`Select row ${rowIdx + 1}`}
                        onClick={e => e.stopPropagation()}
                      />
                    </td>
                  )}
                  {columns.map(col => (
                    <td key={col.key}>
                      {String(row[col.dataIndex])}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
