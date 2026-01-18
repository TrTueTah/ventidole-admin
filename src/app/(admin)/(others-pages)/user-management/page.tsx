'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { DataTable, Column } from '@/components/ui/table';
import Badge from '@/components/ui/badge/Badge';
import Button from '@/components/ui/button/Button';
import { PencilIcon, SearchIcon, PlusIcon } from '@/icons';
import Breadcrumb from '@/components/ui/breadcrumb/Breadcrumb';
import { useUsersQuery } from '@/hooks/useUsersQuery';
import { UserDto } from '@/types/user/user.dto';
import { UserSortBy } from '@/types/user/user.req';
import { toast } from 'react-toastify';
import { renderRoleBadge } from '@/helper/badge.helper';

export default function UserManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);

  // Debounce search input to avoid excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // Reset to page 1 when search changes
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Map column keys to UserSortBy enum
  const mapColumnKeyToSortBy = (key: string): UserSortBy | undefined => {
    const mapping: Record<string, UserSortBy> = {
      username: UserSortBy.USERNAME,
      email: UserSortBy.EMAIL,
      role: UserSortBy.ROLE,
      createdAt: UserSortBy.CREATED_AT,
    };
    return mapping[key];
  };

  // Handle sort change
  const handleSortChange = (key: string, direction: 'asc' | 'desc') => {
    setSortConfig({ key, direction });
    setPage(1); // Reset to page 1 when sort changes
  };

  // Fetch idols data using TanStack Query with debounced search
  const { data, isLoading, isError, error } = useUsersQuery({
    page,
    limit: pageSize,
    search: debouncedSearch,
    sortBy: sortConfig ? mapColumnKeyToSortBy(sortConfig.key) : undefined,
    sortOrder: sortConfig?.direction,
  });

  // Get idol data directly from API response (no client-side filtering)
  const idolData: UserDto[] = data?.data || [];

  // Handle selection change
  const handleSelectionChange = (
    keys: (string | number)[],
    rows: UserDto[]
  ) => {
    setSelectedRowKeys(keys as string[]);
    console.log('Selected keys:', keys);
    console.log('Selected rows:', rows);
  };

  // Define columns for DataTable
  const columns: Column<UserDto>[] = [
    {
      key: 'username',
      title: 'User',
      dataIndex: 'username',
      sorter: true,
      width: '25%',
      render: (value: string, record: UserDto) => {
        const firstChar = record.username?.charAt(0).toUpperCase();

        return (
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="bg-brand-500 flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full font-semibold text-white">
              {record.avatarUrl ? (
                <Image
                  width={40}
                  height={40}
                  src={record.avatarUrl}
                  alt={record.username}
                />
              ) : (
                <span>{firstChar}</span>
              )}
            </div>

            {/* Username */}
            <Link
              href={`/user-management/${record.id}`}
              className="hover:text-brand-500 dark:hover:text-brand-400 truncate font-medium text-gray-800 transition dark:text-white/90"
            >
              {value}
            </Link>
          </div>
        );
      },
    },
    {
      key: 'email',
      title: 'Email',
      sorter: true,
      width: '25%',
      render: (_: any, record: UserDto) => record?.email ?? '',
    },
    {
      key: 'role',
      title: 'Role',
      sorter: true,
      width: '12%',
      render: (_: any, record: UserDto) => renderRoleBadge(record.role),
    },
    {
      key: 'isActive',
      title: 'Status',
      dataIndex: 'isActive',
      width: '12%',
      render: (value: boolean) => (
        <Badge size="sm" color={value ? 'success' : 'error'}>
          {value ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      title: 'Joined At',
      dataIndex: 'createdAt',
      sorter: true,
      width: '12%',
      render: (value: Date) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'actions',
      title: 'Actions',
      align: 'center',
      width: '14%',
      render: (_: unknown, record: UserDto) => (
        <div className="flex items-center justify-center gap-2">
          <Link href={`/user-management/${record.id}`}>
            <Button size="sm" variant="outline">
              View
            </Button>
          </Link>
          <Link href={`/user-management/form/${record.id}`}>
            <Button size="sm" variant="primary" startIcon={<PencilIcon />}>
              Edit
            </Button>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* Breadcrumb Navigation */}
      <Breadcrumb />

      {/* Page Title and Description */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
          User Management
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Track and manage all users in your system.
        </p>
      </div>

      {/* Search and Actions Bar */}
      <div className="mb-5 flex items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative max-w-xs flex-1">
          <SearchIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search idols..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="focus:border-brand-500 focus:ring-brand-500 w-full rounded-lg border border-gray-200 bg-white py-2 pr-4 pl-10 text-sm text-gray-800 placeholder-gray-400 transition focus:ring-1 focus:outline-none dark:border-white/[0.05] dark:bg-white/[0.03] dark:text-white/90 dark:placeholder-gray-500"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {selectedRowKeys.length > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {selectedRowKeys.length} selected
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedRowKeys([])}
              >
                Clear Selection
              </Button>
            </div>
          )}
          <Link href="/user-management/form/create">
            <Button variant="primary" size="sm" startIcon={<PlusIcon />}>
              Add User
            </Button>
          </Link>
        </div>
      </div>

      {/* Error State */}
      {isError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-sm text-red-600 dark:text-red-400">
            Error loading idols: {error?.message || 'Unknown error'}
          </p>
        </div>
      )}

      {/* DataTable with Server-side Pagination */}
      <DataTable
        columns={columns}
        data={idolData}
        loading={isLoading}
        pagination={
          data?.paging
            ? {
                current: page,
                pageSize: pageSize,
                total: data.paging.total,
                totalPages: data.paging.totalPages,
                onChange: setPage,
              }
            : false
        }
        rowSelection={{
          selectedRowKeys: selectedRowKeys,
          onChange: handleSelectionChange,
        }}
        sortConfig={sortConfig}
        onSortChange={handleSortChange}
        emptyText="No idols found. Try adjusting your search criteria."
      />
    </div>
  );
}
