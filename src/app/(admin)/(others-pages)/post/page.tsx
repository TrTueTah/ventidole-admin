'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { DataTable, Column } from '@/components/ui/table';
import Badge from '@/components/ui/badge/Badge';
import Button from '@/components/ui/button/Button';
import { SearchIcon, EyeIcon, CloseLineIcon } from '@/icons';
import Breadcrumb from '@/components/ui/breadcrumb/Breadcrumb';
import { usePostsQuery } from '@/hooks/usePostsQuery';
import { PostDto } from '@/types/post/post.dto';
import { PostSortBy } from '@/types/post/post.req';
import { useBanPost } from '@/hooks/useBanPost';

export default function PostManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);

  // Filter states
  const [isActiveFilter, setIsActiveFilter] = useState<boolean | undefined>();
  const [communityFilter, setCommunityFilter] = useState<string>('');

  const banPost = useBanPost();

  // Debounce search input to avoid excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // Reset to page 1 when search changes
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Map column keys to PostSortBy enum
  const mapColumnKeyToSortBy = (key: string): PostSortBy | undefined => {
    const mapping: Record<string, PostSortBy> = {
      createdAt: PostSortBy.CREATED_AT,
      updatedAt: PostSortBy.UPDATED_AT,
      likeCount: PostSortBy.LIKE_COUNT,
      commentCount: PostSortBy.COMMENT_COUNT,
      viewCount: PostSortBy.VIEW_COUNT,
    };
    return mapping[key];
  };

  // Handle sort change
  const handleSortChange = (key: string, direction: 'asc' | 'desc') => {
    setSortConfig({ key, direction });
    setPage(1); // Reset to page 1 when sort changes
  };

  // Fetch posts data using TanStack Query with debounced search
  const { data, isLoading, isError, error } = usePostsQuery({
    page,
    limit: pageSize,
    search: debouncedSearch,
    sortBy: sortConfig ? mapColumnKeyToSortBy(sortConfig.key) : undefined,
    sortOrder: sortConfig?.direction,
    isActive: isActiveFilter,
    communityId: communityFilter || undefined,
  });

  // Get post data directly from API response
  const postData: PostDto[] = data?.data || [];

  // Handle selection change
  const handleSelectionChange = (
    keys: (string | number)[],
    rows: PostDto[]
  ) => {
    setSelectedRowKeys(keys as string[]);
    console.log('Selected keys:', keys);
    console.log('Selected rows:', rows);
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
  const columns: Column<PostDto>[] = [
    {
      key: 'author',
      title: 'Author',
      width: '18%',
      render: (_: any, record: PostDto) => (
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
      width: '30%',
      render: (_: any, record: PostDto) => (
        <div className="space-y-1">
          <p className="line-clamp-2 text-sm text-gray-800 dark:text-white/90">
            {record.content}
          </p>
          {record.mediaUrls && record.mediaUrls.length > 0 && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              📷 {record.mediaUrls.length} media file(s)
            </p>
          )}
        </div>
      ),
    },
    {
      key: 'community',
      title: 'Community',
      width: '14%',
      render: (_: any, record: PostDto) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {record.communityName || 'N/A'}
        </span>
      ),
    },
    {
      key: 'stats',
      title: 'Stats',
      width: '12%',
      render: (_: any, record: PostDto) => (
        <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
          <p>👁️ {record.viewCount || 0}</p>
          <p>❤️ {record.likeCount || 0}</p>
          <p>💬 {record.commentCount || 0}</p>
        </div>
      ),
    },
    {
      key: 'isActive',
      title: 'Status',
      dataIndex: 'isActive',
      width: '10%',
      render: (value: boolean, record: PostDto) => (
        <div className="space-y-1">
          <Badge size="sm" color={value ? 'success' : 'error'}>
            {value ? 'Active' : 'Banned'}
          </Badge>
          {record.reportCount && record.reportCount > 0 && (
            <Badge size="sm" color="warning">
              {record.reportCount} reports
            </Badge>
          )}
        </div>
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
      width: '6%',
      render: (_: any, record: PostDto) => (
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
          Post Management
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Monitor and manage all posts across communities.
        </p>
      </div>

      {/* Search and Actions Bar */}
      <div className="mb-5 flex items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative max-w-xs flex-1">
          <SearchIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search posts..."
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
          <Link href="/post/reported">
            <Button variant="warning" size="sm">
              View Reported Posts
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-5 flex flex-wrap gap-3">
        {/* Active Status Filter */}
        <select
          value={
            isActiveFilter === undefined
              ? ''
              : isActiveFilter
                ? 'true'
                : 'false'
          }
          onChange={(e) => {
            setIsActiveFilter(
              e.target.value === '' ? undefined : e.target.value === 'true'
            );
            setPage(1);
          }}
          className="focus:border-brand-500 focus:ring-brand-500 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-800 transition focus:ring-1 focus:outline-none dark:border-white/[0.05] dark:bg-white/[0.03] dark:text-white/90"
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Banned</option>
        </select>

        {/* Clear Filters Button */}
        {(isActiveFilter !== undefined || communityFilter) && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setIsActiveFilter(undefined);
              setCommunityFilter('');
              setPage(1);
            }}
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Error State */}
      {isError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-sm text-red-600 dark:text-red-400">
            Error loading posts: {error?.message || 'Unknown error'}
          </p>
        </div>
      )}

      {/* DataTable with Server-side Pagination */}
      <DataTable
        columns={columns}
        data={postData}
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
        emptyText="No posts found. Try adjusting your search criteria."
      />
    </div>
  );
}
