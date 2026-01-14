'use client';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { ChevronUpIcon, ChevronDownIcon } from '@/icons';

// Column definition type
export interface Column<T> {
  key: string;
  title: string | ReactNode;
  dataIndex?: keyof T;
  render?: (value: any, record: T, index: number) => ReactNode;
  sorter?: boolean | ((a: T, b: T) => number);
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

// Props for DataTable (Advanced Table similar to Ant Design)
export interface DataTableProps<T> {
  columns: Column<T>[];
  data?: T[];
  loading?: boolean;
  title?: string | ReactNode;
  headerButton?: {
    text: string;
    icon?: ReactNode;
    onClick: () => void;
  };
  showHeader?: boolean;
  expandable?: {
    expandedRowRender?: (record: T) => ReactNode;
    rowExpandable?: (record: T) => boolean;
  };
  rowSelection?: {
    selectedRowKeys?: (string | number)[];
    onChange?: (
      selectedRowKeys: (string | number)[],
      selectedRows: T[]
    ) => void;
  };
  scroll?: {
    x?: number | string;
    y?: number | string;
  } | null;
  changeHorizontalScrollToOpposite?: boolean;
  pagination?:
    | boolean
    | {
        current: number;
        pageSize: number;
        total: number;
        totalPages?: number;
        onChange?: (page: number) => void;
        showSizeChanger?: boolean;
        onPageSizeChange?: (pageSize: number) => void;
      };
  pageSize?: number;
  emptyText?: string | ReactNode;
  rowKey?: keyof T | ((record: T) => string | number);
  onRow?: (
    record: T,
    index: number
  ) => {
    onClick?: () => void;
    className?: string;
  };
  onSortChange?: (key: string, direction: 'asc' | 'desc') => void;
  sortConfig?: {
    key: string;
    direction: 'asc' | 'desc';
  } | null;
  className?: string;
}

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-12">
    <div className="border-t-brand-500 h-8 w-8 animate-spin rounded-full border-4 border-gray-200"></div>
  </div>
);

// Empty State Component
const EmptyState = ({ text }: { text?: string | ReactNode }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <svg
      className="mb-4 h-16 w-16 text-gray-300"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
      />
    </svg>
    <p className="text-sm text-gray-500 dark:text-gray-400">
      {text || 'No data available'}
    </p>
  </div>
);

// DataTable Component (Advanced)
export function DataTable<T extends Record<string, any>>({
  columns,
  data = [],
  loading = false,
  title,
  headerButton,
  showHeader = true,
  expandable,
  rowSelection,
  scroll,
  changeHorizontalScrollToOpposite = false,
  pagination = false,
  pageSize = 10,
  emptyText,
  rowKey = 'id' as keyof T,
  onRow,
  onSortChange,
  sortConfig: externalSortConfig,
  className = '',
}: DataTableProps<T>) {
  const tableRef = useRef<HTMLDivElement>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string | number>>(
    new Set()
  );
  const [internalSortConfig, setInternalSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedKeys, setSelectedKeys] = useState<Set<string | number>>(
    new Set(rowSelection?.selectedRowKeys || [])
  );
  const [pageInputValue, setPageInputValue] = useState('');

  // Use external sort config if provided (server-side), otherwise use internal (client-side)
  const sortConfig =
    externalSortConfig !== undefined ? externalSortConfig : internalSortConfig;

  // Determine if using server-side pagination
  const isServerPagination =
    typeof pagination === 'object' && pagination !== null;
  const paginationConfig = isServerPagination ? pagination : null;

  // Sync selected keys with external prop
  useEffect(() => {
    if (rowSelection?.selectedRowKeys) {
      setSelectedKeys(new Set(rowSelection.selectedRowKeys));
    }
  }, [rowSelection?.selectedRowKeys]);

  // Handle row selection
  const handleRowSelect = (key: string | number, record: T) => {
    const newSelectedKeys = new Set(selectedKeys);
    if (newSelectedKeys.has(key)) {
      newSelectedKeys.delete(key);
    } else {
      newSelectedKeys.add(key);
    }
    setSelectedKeys(newSelectedKeys);

    if (rowSelection?.onChange) {
      const selectedRows = data.filter((item) => {
        const itemKey = getRowKey(item, 0);
        return newSelectedKeys.has(itemKey);
      });
      rowSelection.onChange(Array.from(newSelectedKeys), selectedRows);
    }
  };

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allKeys = new Set(paginatedData.map((item) => getRowKey(item, 0)));
      const newSelectedKeys = new Set([...selectedKeys, ...allKeys]);
      setSelectedKeys(newSelectedKeys);

      if (rowSelection?.onChange) {
        const selectedRows = data.filter((item) => {
          const itemKey = getRowKey(item, 0);
          return newSelectedKeys.has(itemKey);
        });
        rowSelection.onChange(Array.from(newSelectedKeys), selectedRows);
      }
    } else {
      // Deselect all items on current page
      const currentPageKeys = new Set(
        paginatedData.map((item) => getRowKey(item, 0))
      );
      const newSelectedKeys = new Set(
        Array.from(selectedKeys).filter((key) => !currentPageKeys.has(key))
      );
      setSelectedKeys(newSelectedKeys);

      if (rowSelection?.onChange) {
        const selectedRows = data.filter((item) => {
          const itemKey = getRowKey(item, 0);
          return newSelectedKeys.has(itemKey);
        });
        rowSelection.onChange(Array.from(newSelectedKeys), selectedRows);
      }
    }
  };

  // Scroll to end on mount if needed
  useEffect(() => {
    const scrollToEnd = () => {
      if (
        tableRef.current &&
        data?.length &&
        changeHorizontalScrollToOpposite
      ) {
        const scrollContainer = tableRef.current.querySelector(
          '.table-scroll-container'
        ) as HTMLDivElement;
        if (scrollContainer) {
          scrollContainer.scrollLeft = scrollContainer.scrollWidth;
        }
      }
    };

    setTimeout(scrollToEnd, 100);
  }, [data, changeHorizontalScrollToOpposite]);

  // Get row key
  const getRowKey = (record: T, index: number): string | number => {
    if (typeof rowKey === 'function') {
      return rowKey(record);
    }
    return record[rowKey] ?? index;
  };

  // Toggle row expansion
  const toggleRowExpansion = (key: string | number) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(key)) {
      newExpandedRows.delete(key);
    } else {
      newExpandedRows.add(key);
    }
    setExpandedRows(newExpandedRows);
  };

  // Handle sorting
  const handleSort = (column: Column<T>) => {
    if (!column.sorter) return;

    let direction: 'asc' | 'desc' = 'asc';
    if (
      sortConfig &&
      sortConfig.key === column.key &&
      sortConfig.direction === 'asc'
    ) {
      direction = 'desc';
    }

    const newSortConfig = { key: column.key, direction };

    // If onSortChange is provided, use server-side sorting
    if (onSortChange) {
      onSortChange(column.key, direction);
    } else {
      // Otherwise, use client-side sorting
      setInternalSortConfig(newSortConfig);
    }
  };

  // Sort data
  let sortedData = [...data];
  if (sortConfig) {
    const column = columns.find((col) => col.key === sortConfig.key);
    if (column?.sorter) {
      sortedData.sort((a, b) => {
        if (typeof column.sorter === 'function') {
          return sortConfig.direction === 'asc'
            ? column.sorter(a, b)
            : column.sorter(b, a);
        }
        // Default sorting by dataIndex
        const aVal = column.dataIndex ? a[column.dataIndex] : '';
        const bVal = column.dataIndex ? b[column.dataIndex] : '';
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
  }

  // Paginate data (client-side or server-side)
  let totalPages: number;
  let paginatedData: T[];
  let totalRecords: number;

  if (isServerPagination && paginationConfig) {
    // Server-side pagination: use data as-is from server
    paginatedData = sortedData;
    totalPages =
      paginationConfig.totalPages ||
      Math.ceil(paginationConfig.total / paginationConfig.pageSize);
    totalRecords = paginationConfig.total;
  } else {
    // Client-side pagination
    totalPages = Math.ceil(sortedData.length / pageSize);
    totalRecords = sortedData.length;
    paginatedData = pagination
      ? sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
      : sortedData;
  }

  // Generate page numbers to display with ellipsis
  const getPageNumbers = (): (number | string)[] => {
    const current = isServerPagination ? paginationConfig?.current || 1 : currentPage;
    const delta = 1; // Number of pages to show on each side of current page
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      // Show all pages if total is 7 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate range around current page
      const rangeStart = Math.max(2, current - delta);
      const rangeEnd = Math.min(totalPages - 1, current + delta);

      // Add ellipsis after first page if needed
      if (rangeStart > 2) {
        pages.push('...');
      }

      // Add pages around current page
      for (let i = rangeStart; i <= rangeEnd; i++) {
        pages.push(i);
      }

      // Add ellipsis before last page if needed
      if (rangeEnd < totalPages - 1) {
        pages.push('...');
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  // Handle jump to page
  const handleJumpToPage = () => {
    const pageNum = parseInt(pageInputValue, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      if (isServerPagination && paginationConfig?.onChange) {
        paginationConfig.onChange(pageNum);
      } else {
        setCurrentPage(pageNum);
      }
      setPageInputValue('');
    }
  };

  // Handle enter key in page input
  const handlePageInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleJumpToPage();
    }
  };

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* Header */}
      {(title || headerButton) && (
        <div className="flex items-center justify-between">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
          )}
          {headerButton && (
            <button
              onClick={headerButton.onClick}
              className="text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition"
            >
              {headerButton.icon}
              {headerButton.text}
            </button>
          )}
        </div>
      )}

      {/* Table Container */}
      <div
        ref={tableRef}
        className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
      >
        <div
          className={`table-scroll-container custom-scrollbar overflow-x-auto ${
            scroll?.y ? 'overflow-y-auto' : ''
          }`}
          style={{
            maxHeight: scroll?.y ? scroll.y : undefined,
          }}
        >
          <table
            className="w-full divide-y divide-gray-200 dark:divide-gray-800"
            style={{
              minWidth: scroll?.x ? scroll.x : undefined,
              tableLayout: scroll?.x ? 'auto' : 'fixed',
            }}
          >
            {/* Table Header */}
            {showHeader && (
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  {rowSelection && (
                    <th className="w-12 px-6 py-4">
                      <input
                        type="checkbox"
                        checked={
                          paginatedData.length > 0 &&
                          paginatedData.every((item) =>
                            selectedKeys.has(getRowKey(item, 0))
                          )
                        }
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="text-brand-500 focus:ring-brand-500 h-4 w-4 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-800"
                      />
                    </th>
                  )}
                  {expandable && <th className="w-12 px-6 py-4"></th>}
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className={`px-6 py-4 text-xs font-semibold tracking-wide text-gray-700 uppercase dark:text-gray-300 ${
                        column.sorter
                          ? 'cursor-pointer select-none hover:text-gray-900 dark:hover:text-gray-100'
                          : ''
                      } ${column.className || ''}`}
                      style={{
                        width: column.width,
                        textAlign: column.align || 'left',
                      }}
                      onClick={() => handleSort(column)}
                    >
                      <div className="flex h-6 items-center gap-2">
                        <span>{column.title}</span>
                        {column.sorter && (
                          <div className="flex flex-col justify-between">
                            <ChevronUpIcon
                              className={`transition-colors ${
                                sortConfig?.key === column.key &&
                                sortConfig.direction === 'asc'
                                  ? 'text-brand-500'
                                  : 'text-gray-400 opacity-50'
                              }`}
                            />
                            <ChevronDownIcon
                              className={`-mt-2 transition-colors ${
                                sortConfig?.key === column.key &&
                                sortConfig.direction === 'desc'
                                  ? 'text-brand-500'
                                  : 'text-gray-400 opacity-50'
                              }`}
                            />
                          </div>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
            )}

            {/* Table Body */}
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-800 dark:bg-gray-900">
              {loading ? (
                <tr>
                  <td
                    colSpan={
                      columns.length +
                      (expandable ? 1 : 0) +
                      (rowSelection ? 1 : 0)
                    }
                  >
                    <LoadingSpinner />
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={
                      columns.length +
                      (expandable ? 1 : 0) +
                      (rowSelection ? 1 : 0)
                    }
                  >
                    <EmptyState text={emptyText} />
                  </td>
                </tr>
              ) : (
                paginatedData.map((record, index) => {
                  const key = getRowKey(record, index);
                  const isExpanded = expandedRows.has(key);
                  const canExpand = expandable?.rowExpandable?.(record) ?? true;
                  const rowProps = onRow?.(record, index);
                  const isSelected = selectedKeys.has(key);

                  return (
                    <React.Fragment key={key}>
                      <tr
                        className={`transition hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
                          rowProps?.className || ''
                        } ${rowProps?.onClick ? 'cursor-pointer' : ''} ${
                          isSelected ? 'bg-brand-50 dark:bg-brand-500/10' : ''
                        }`}
                        onClick={rowProps?.onClick}
                      >
                        {rowSelection && (
                          <td className="px-6 py-4">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => {
                                e.stopPropagation();
                                handleRowSelect(key, record);
                              }}
                              onClick={(e) => e.stopPropagation()}
                              className="text-brand-500 focus:ring-brand-500 h-4 w-4 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-800"
                            />
                          </td>
                        )}
                        {expandable && (
                          <td className="px-6 py-4">
                            {canExpand && expandable.expandedRowRender && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleRowExpansion(key);
                                }}
                                className="text-gray-400 transition hover:text-gray-600 dark:hover:text-gray-300"
                              >
                                {isExpanded ? (
                                  <ChevronUpIcon className="h-4 w-4" />
                                ) : (
                                  <ChevronDownIcon className="h-4 w-4" />
                                )}
                              </button>
                            )}
                          </td>
                        )}
                        {columns.map((column) => {
                          const value = column.dataIndex
                            ? record[column.dataIndex]
                            : null;
                          const content = column.render
                            ? column.render(value, record, index)
                            : value;

                          return (
                            <td
                              key={column.key}
                              className={`px-6 py-4 text-sm text-gray-900 dark:text-gray-100 ${
                                column.className || ''
                              }`}
                              style={{
                                textAlign: column.align || 'left',
                                width: column.width,
                              }}
                            >
                              {content}
                            </td>
                          );
                        })}
                      </tr>
                      {/* Expanded Row */}
                      {expandable &&
                        isExpanded &&
                        expandable.expandedRowRender && (
                          <tr>
                            <td
                              colSpan={
                                columns.length + 1 + (rowSelection ? 1 : 0)
                              }
                              className="bg-gray-50 px-6 py-4 dark:bg-gray-800/50"
                            >
                              {expandable.expandedRowRender(record)}
                            </td>
                          </tr>
                        )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination && !loading && paginatedData.length > 0 && (
        <div className="flex items-center justify-between px-4">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            {isServerPagination && paginationConfig ? (
              <>
                Showing{' '}
                {(paginationConfig.current - 1) * paginationConfig.pageSize + 1}{' '}
                to{' '}
                {Math.min(
                  paginationConfig.current * paginationConfig.pageSize,
                  totalRecords
                )}{' '}
                of {totalRecords} results
              </>
            ) : (
              <>
                Showing {(currentPage - 1) * pageSize + 1} to{' '}
                {Math.min(currentPage * pageSize, totalRecords)} of{' '}
                {totalRecords} results
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (isServerPagination && paginationConfig?.onChange) {
                  paginationConfig.onChange(
                    Math.max(1, paginationConfig.current - 1)
                  );
                } else {
                  setCurrentPage((p) => Math.max(1, p - 1));
                }
              }}
              disabled={
                isServerPagination
                  ? paginationConfig?.current === 1
                  : currentPage === 1
              }
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Previous
            </button>
            <div className="flex items-center gap-1">
              {getPageNumbers().map((page, idx) => {
                if (page === '...') {
                  return (
                    <span
                      key={`ellipsis-${idx}`}
                      className="flex h-10 w-10 items-center justify-center text-sm text-gray-700 dark:text-gray-300"
                    >
                      {page}
                    </span>
                  );
                }

                return (
                  <button
                    key={page}
                    onClick={() => {
                      if (isServerPagination && paginationConfig?.onChange) {
                        paginationConfig.onChange(page as number);
                      } else {
                        setCurrentPage(page as number);
                      }
                    }}
                    className={`h-10 w-10 rounded-lg text-sm font-medium transition ${
                      (isServerPagination
                        ? paginationConfig?.current
                        : currentPage) === page
                        ? 'bg-brand-500 text-white'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => {
                if (isServerPagination && paginationConfig?.onChange) {
                  paginationConfig.onChange(
                    Math.min(totalPages, paginationConfig.current + 1)
                  );
                } else {
                  setCurrentPage((p) => Math.min(totalPages, p + 1));
                }
              }}
              disabled={
                isServerPagination
                  ? paginationConfig?.current === totalPages
                  : currentPage === totalPages
              }
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Next
            </button>
            <div className="ml-4 flex items-center gap-2">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Go to:
              </span>
              <input
                type="number"
                min="1"
                max={totalPages}
                value={pageInputValue}
                onChange={(e) => setPageInputValue(e.target.value)}
                onKeyDown={handlePageInputKeyDown}
                placeholder="Page"
                className="w-16 rounded-lg border border-gray-300 px-2 py-1 text-sm text-gray-700 transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
              />
              <button
                onClick={handleJumpToPage}
                className="rounded-lg border border-gray-300 px-3 py-1 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Go
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Simple Table Components (keep the original simple table for backward compatibility)
interface TableProps {
  children: ReactNode;
  className?: string;
}

interface TableHeaderProps {
  children: ReactNode;
  className?: string;
}

interface TableBodyProps {
  children: ReactNode;
  className?: string;
}

interface TableRowProps {
  children: ReactNode;
  className?: string;
}

interface TableCellProps {
  children: ReactNode;
  isHeader?: boolean;
  className?: string;
}

const Table: React.FC<TableProps> = ({ children, className }) => {
  return <table className={`min-w-full ${className}`}>{children}</table>;
};

const TableHeader: React.FC<TableHeaderProps> = ({ children, className }) => {
  return <thead className={className}>{children}</thead>;
};

const TableBody: React.FC<TableBodyProps> = ({ children, className }) => {
  return <tbody className={className}>{children}</tbody>;
};

const TableRow: React.FC<TableRowProps> = ({ children, className }) => {
  return <tr className={className}>{children}</tr>;
};

const TableCell: React.FC<TableCellProps> = ({
  children,
  isHeader = false,
  className,
}) => {
  const CellTag = isHeader ? 'th' : 'td';
  return <CellTag className={` ${className}`}>{children}</CellTag>;
};

export { Table, TableHeader, TableBody, TableRow, TableCell };
