'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { DataTable, Column } from '@/components/ui/table';
import Badge from '@/components/ui/badge/Badge';
import Button from '@/components/ui/button/Button';
import { EyeIcon, CloseLineIcon } from '@/icons';
import Breadcrumb from '@/components/ui/breadcrumb/Breadcrumb';
import { useReportedPostsQuery } from '@/hooks/useReportedPostsQuery';
import { ReportedPostDto } from '@/types/post/post.dto';
import { PostSortBy } from '@/types/post/post.req';
import { useBanPost } from '@/hooks/useBanPost';

export default function ReportedPostsPage() {
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);

  const banPost = useBanPost();

  // Map column keys to PostSortBy enum
  const mapColumnKeyToSortBy = (key: string): PostSortBy | undefined => {
    const mapping: Record<string, PostSortBy> = {
      createdAt: PostSortBy.CREATED_AT,
      updatedAt: PostSortBy.UPDATED_AT,
    };
    return mapping[key];
  };

  // Handle sort change
  const handleSortChange = (key: string, direction: 'asc' | 'desc') => {
    setSortConfig({ key, direction });
    setPage(1);
  };

  // Fetch reported posts data
  const { data, isLoading, isError, error } = useReportedPostsQuery({
    page,
    limit: pageSize,
    sortBy: sortConfig ? mapColumnKeyToSortBy(sortConfig.key) : undefined,
    sortOrder: sortConfig?.direction,
  });

  // Get post data directly from API response
  const reportedPosts: ReportedPostDto[] = data?.data || [];

  // Handle selection change
  const handleSelectionChange = (
    keys: (string | number)[],
    rows: ReportedPostDto[]
  ) => {
    setSelectedRowKeys(keys as string[]);
  };

  // Handle ban post
  const handleBanPost = async (id: string) => {
    if (confirm('Are you sure you want to ban this post?')) {
      try {
        await banPost.mutateAsync(id);
        alert('Post banned successfully');
      } catch (error) {
        console.error('Error banning post:', error);
        alert('Failed to ban post');
      }
    }
  };

  // Define columns for DataTable
  const columns: Column<ReportedPostDto>[] = [
    {
      key: 'author',
      title: 'Author',
      width: '15%',
      render: (_: any, record: ReportedPostDto) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full">
            <Image
              width={40}
              height={40}
              src={record.authorAvatarUrl || '/images/user/user-01.png'}
              alt={record.authorName || 'User'}
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-gray-800 dark:text-white/90">
              {record.authorName || 'Unknown User'}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'content',
      title: 'Content',
      width: '25%',
      render: (_: any, record: ReportedPostDto) => (
        <div className="space-y-1">
          <p className="line-clamp-2 text-sm text-gray-800 dark:text-white/90">
            {record.content}
          </p>
        </div>
      ),
    },
    {
      key: 'reports',
      title: 'Reports',
      width: '30%',
      render: (_: any, record: ReportedPostDto) => (
        <div className="space-y-2">
          <div className="mb-2 flex items-center gap-2">
            <Badge size="sm" color="warning">
              {record.reportCount || record.reports.length} reports
            </Badge>
          </div>
          <div className="space-y-1">
            {record.reports.slice(0, 2).map((report) => (
              <div
                key={report.id}
                className="text-xs text-gray-600 dark:text-gray-400"
              >
                <span className="font-medium">{report.reporterName}:</span>{' '}
                {report.reason}
              </div>
            ))}
            {record.reports.length > 2 && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                +{record.reports.length - 2} more reports
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'community',
      title: 'Community',
      width: '12%',
      render: (_: any, record: ReportedPostDto) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {record.communityName || 'N/A'}
        </span>
      ),
    },
    {
      key: 'isActive',
      title: 'Status',
      dataIndex: 'isActive',
      width: '8%',
      render: (value: boolean) => (
        <Badge size="sm" color={value ? 'success' : 'error'}>
          {value ? 'Active' : 'Banned'}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      title: 'Created',
      dataIndex: 'createdAt',
      sorter: true,
      width: '10%',
      render: (value: string) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {new Date(value).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      align: 'center',
      render: (_: any, record: ReportedPostDto) => (
        <div className="flex items-center justify-center gap-2">
          <Link href={`/post/${record.id}`}>
            <Button size="sm" variant="outline" startIcon={<EyeIcon />}>
              View
            </Button>
          </Link>
          {record.isActive && (
            <Button
              size="sm"
              variant="error"
              startIcon={<CloseLineIcon />}
              onClick={() => handleBanPost(record.id)}
              disabled={banPost.isPending}
            >
              Ban
            </Button>
          )}
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
          Reported Posts
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Review and manage posts that have been reported by users.
        </p>
      </div>

      {/* Action Bar */}
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/post">
            <Button variant="outline" size="sm">
              Back to All Posts
            </Button>
          </Link>
        </div>
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
        </div>
      </div>

      {/* Error State */}
      {isError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-sm text-red-600 dark:text-red-400">
            Error loading reported posts: {error?.message || 'Unknown error'}
          </p>
        </div>
      )}

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={reportedPosts}
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
        emptyText="No reported posts found."
      />
    </div>
  );
}
