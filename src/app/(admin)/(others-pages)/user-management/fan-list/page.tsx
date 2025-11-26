'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { DataTable, Column } from '@/components/ui/table';
import Badge from '@/components/ui/badge/Badge';
import Button from '@/components/ui/button/Button';
import { PencilIcon, SearchIcon, PlusIcon } from '@/icons';
import Breadcrumb from '@/components/ui/breadcrumb/Breadcrumb';
import { useIdolsQuery } from '@/hooks/useIdolsQuery';
import { IdolDto } from '@/types/idol/idol.dto';

export default function FanList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Debounce search input to avoid excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // Reset to page 1 when search changes
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch idols data using TanStack Query with debounced search
  const { data, isLoading, isError, error } = useIdolsQuery({
    page,
    limit: pageSize,
    search: debouncedSearch,
  });

  // Get idol data directly from API response (no client-side filtering)
  const idolData: IdolDto[] = data?.data || [];

  // Handle selection change
  const handleSelectionChange = (
    keys: (string | number)[],
    rows: IdolDto[]
  ) => {
    setSelectedRowKeys(keys as string[]);
    console.log('Selected keys:', keys);
    console.log('Selected rows:', rows);
  };

  // Define columns for DataTable
  const columns: Column<IdolDto>[] = [
    {
      key: 'stageName',
      title: 'Idol',
      dataIndex: 'stageName',
      sorter: true,
      width: '25%',
      render: (value: string, record: IdolDto) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full">
            <Image
              width={40}
              height={40}
              src={record.avatarUrl || '/images/user/user-01.png'}
              alt={value}
            />
          </div>
          <Link
            href={`/user-management/fan-list/${record.id}`}
            className="hover:text-brand-500 dark:hover:text-brand-400 truncate font-medium text-gray-800 transition dark:text-white/90"
          >
            {value}
          </Link>
        </div>
      ),
    },
    {
      key: 'email',
      title: 'Email',
      sorter: true,
      width: '25%',
      render: (_: any, record: IdolDto) => record.user.email,
    },
    {
      key: 'group',
      title: 'Group',
      sorter: true,
      width: '12%',
      render: (_: any, record: IdolDto) => (
        <Badge size="sm" color="dark">
          {record.group.groupName}
        </Badge>
      ),
    },
    {
      key: 'isActive',
      title: 'Status',
      dataIndex: 'isActive',
      sorter: true,
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
      width: '12%',
      sorter: (a: IdolDto, b: IdolDto) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (value: Date) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'actions',
      title: 'Actions',
      align: 'center',
      width: '14%',
      render: (_: any, record: IdolDto) => (
        <div className="flex items-center justify-center gap-2">
          <Link href={`/user-management/fan-list/${record.id}`}>
            <Button size="sm" variant="outline">
              View
            </Button>
          </Link>
          <Link href={`/user-management/fan-list/form/${record.id}`}>
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
          Fan Management
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Track and manage all fans in your system.
        </p>
      </div>

      {/* Search and Actions Bar */}
      <div className="mb-5 flex items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative max-w-xs flex-1">
          <SearchIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search fans..."
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
          <Link href="/user-management/fan-list/form/create">
            <Button variant="primary" size="sm" startIcon={<PlusIcon />}>
              Add Fan
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
        emptyText="No idols found. Try adjusting your search criteria."
      />
    </div>
  );
}
