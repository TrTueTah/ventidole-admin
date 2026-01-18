'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { DataTable, Column } from '@/components/ui/table';
import Badge from '@/components/ui/badge/Badge';
import Button from '@/components/ui/button/Button';
import { PencilIcon, SearchIcon, PlusIcon, TrashBinIcon } from '@/icons';
import Breadcrumb from '@/components/ui/breadcrumb/Breadcrumb';
import { useBannersQuery } from '@/hooks/useBannersQuery';
import { useDeleteBanner } from '@/hooks/useDeleteBanner';
import { BannerDto } from '@/types/banner/banner.dto';
import { BannerSortBy } from '@/types/banner/banner.req';
import { toast } from 'react-toastify';

export default function BannerPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);

  const deleteMutation = useDeleteBanner();

  // Debounce search input to avoid excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // Reset to page 1 when search changes
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Map column keys to BannerSortBy enum
  const mapColumnKeyToSortBy = (key: string): BannerSortBy | undefined => {
    const mapping: Record<string, BannerSortBy> = {
      title: BannerSortBy.TITLE,
      startDate: BannerSortBy.START_DATE,
      endDate: BannerSortBy.END_DATE,
      order: BannerSortBy.ORDER,
      createdAt: BannerSortBy.CREATED_AT,
    };
    return mapping[key];
  };

  // Handle sort change
  const handleSortChange = (key: string, direction: 'asc' | 'desc') => {
    setSortConfig({ key, direction });
    setPage(1); // Reset to page 1 when sort changes
  };

  // Fetch banners data using TanStack Query with debounced search
  const { data, isLoading, isError, error } = useBannersQuery({
    page,
    limit: pageSize,
    search: debouncedSearch,
    sortBy: sortConfig ? mapColumnKeyToSortBy(sortConfig.key) : undefined,
    sortOrder: sortConfig?.direction,
  });

  // Get banner data directly from API response
  const bannerData: BannerDto[] = data?.data || [];

  // Handle selection change
  const handleSelectionChange = (
    keys: (string | number)[],
    rows: BannerDto[]
  ) => {
    setSelectedRowKeys(keys as string[]);
  };

  // Handle delete
  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete the banner "${title}"?`)) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(id);
      toast.success('Banner deleted successfully');
    } catch (error) {
      toast.error('Failed to delete banner');
    }
  };

  // Check if banner is currently active based on dates
  const isBannerActive = (banner: BannerDto) => {
    if (!banner.isActive) return false;
    const now = new Date();
    const start = new Date(banner.startDate);
    const end = new Date(banner.endDate);
    return now >= start && now <= end;
  };

  // Define columns for DataTable
  const columns: Column<BannerDto>[] = [
    {
      key: 'title',
      title: 'Banner',
      dataIndex: 'title',
      sorter: true,
      width: '30%',
      render: (value: string, record: BannerDto) => (
        <div className="flex items-center gap-3">
          <div className="h-16 w-28 shrink-0 overflow-hidden rounded-lg">
            <Image
              width={112}
              height={64}
              src={record.imageUrl || '/images/placeholder.png'}
              alt={value}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <Link
              href={`/banner/${record.id}`}
              className="hover:text-brand-500 dark:hover:text-brand-400 truncate font-medium text-gray-800 transition dark:text-white/90"
            >
              {value}
            </Link>
            {record.description && (
              <span className="max-w-xs truncate text-xs text-gray-500 dark:text-gray-400">
                {record.description}
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'startDate',
      title: 'Start Date',
      dataIndex: 'startDate',
      sorter: true,
      width: '12%',
      render: (value: string) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {new Date(value).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'endDate',
      title: 'End Date',
      dataIndex: 'endDate',
      sorter: true,
      width: '12%',
      render: (value: string) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {new Date(value).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'order',
      title: 'Order',
      dataIndex: 'order',
      sorter: true,
      width: '8%',
      render: (value: number) => (
        <span className="text-sm font-medium text-gray-800 dark:text-white/90">
          {value}
        </span>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      width: '10%',
      render: (_: any, record: BannerDto) => {
        const active = isBannerActive(record);
        return (
          <Badge size="sm" color={active ? 'success' : 'error'}>
            {active ? 'Active' : 'Inactive'}
          </Badge>
        );
      },
    },
    {
      key: 'isActive',
      title: 'Enabled',
      dataIndex: 'isActive',
      width: '10%',
      render: (value: boolean) => (
        <Badge size="sm" color={value ? 'success' : 'light'}>
          {value ? 'Yes' : 'No'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      align: 'center',
      width: '18%',
      render: (_: any, record: BannerDto) => (
        <div className="flex items-center justify-center gap-2">
          <Link href={`/banner/${record.id}`}>
            <Button size="sm" variant="outline">
              View
            </Button>
          </Link>
          <Link href={`/banner/form/${record.id}`}>
            <Button size="sm" variant="primary" startIcon={<PencilIcon />}>
              Edit
            </Button>
          </Link>
          <Button
            size="sm"
            variant="error"
            startIcon={<TrashBinIcon />}
            onClick={() => handleDelete(record.id, record.title)}
            disabled={deleteMutation.isPending}
          >
            Delete
          </Button>
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
          Banner Management
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage promotional banners displayed to users.
        </p>
      </div>

      {/* Search and Actions Bar */}
      <div className="mb-5 flex items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative max-w-xs flex-1">
          <SearchIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search banners..."
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
          <Link href="/banner/form/create">
            <Button variant="primary" size="sm" startIcon={<PlusIcon />}>
              Add Banner
            </Button>
          </Link>
        </div>
      </div>

      {/* Error State */}
      {isError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-sm text-red-600 dark:text-red-400">
            Error loading banners: {error?.message || 'Unknown error'}
          </p>
        </div>
      )}

      {/* DataTable with Server-side Pagination */}
      <DataTable
        columns={columns}
        data={bannerData}
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
        emptyText="No banners found. Try adjusting your search criteria."
      />
    </div>
  );
}
