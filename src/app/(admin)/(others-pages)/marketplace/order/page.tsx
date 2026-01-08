'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { DataTable, Column } from '@/components/ui/table';
import Badge from '@/components/ui/badge/Badge';
import Button from '@/components/ui/button/Button';
import { SearchIcon } from '@/icons';
import Breadcrumb from '@/components/ui/breadcrumb/Breadcrumb';
import { useOrdersQuery } from '@/hooks/useOrdersQuery';
import { OrderDto, OrderStatus } from '@/types/order/order.dto';
import {
  OrderSortBy,
  PaymentTransactionStatus,
  PaymentMethod,
} from '@/types/order/order.req';

export default function OrderPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);

  // Filter states
  const [orderStatusFilter, setOrderStatusFilter] = useState<
    OrderStatus | undefined
  >();
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<
    PaymentTransactionStatus | undefined
  >();
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<
    PaymentMethod | undefined
  >();
  const [isActiveFilter, setIsActiveFilter] = useState<string | undefined>();

  // Debounce search input to avoid excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // Reset to page 1 when search changes
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Map column keys to OrderSortBy enum
  const mapColumnKeyToSortBy = (key: string): OrderSortBy | undefined => {
    const mapping: Record<string, OrderSortBy> = {
      totalAmount: OrderSortBy.TOTAL_AMOUNT,
      createdAt: OrderSortBy.CREATED_AT,
      paidAt: OrderSortBy.PAID_AT,
    };
    return mapping[key];
  };

  // Handle sort change
  const handleSortChange = (key: string, direction: 'asc' | 'desc') => {
    setSortConfig({ key, direction });
    setPage(1); // Reset to page 1 when sort changes
  };

  // Fetch orders data using TanStack Query with debounced search
  const { data, isLoading, isError, error } = useOrdersQuery({
    page,
    limit: pageSize,
    search: debouncedSearch,
    sortBy: sortConfig ? mapColumnKeyToSortBy(sortConfig.key) : undefined,
    sortOrder: sortConfig?.direction,
    orderStatus: orderStatusFilter,
    paymentStatus: paymentStatusFilter,
    paymentMethod: paymentMethodFilter,
    isActive: isActiveFilter,
  });

  // Get order data directly from API response (no client-side filtering)
  const orderData: OrderDto[] = data?.data || [];

  // Handle selection change
  const handleSelectionChange = (
    keys: (string | number)[],
    rows: OrderDto[]
  ) => {
    setSelectedRowKeys(keys as string[]);
    console.log('Selected keys:', keys);
    console.log('Selected rows:', rows);
  };

  // Get status badge color
  const getStatusColor = (status: OrderStatus) => {
    const colorMap: Record<
      OrderStatus,
      'success' | 'warning' | 'error' | 'dark'
    > = {
      [OrderStatus.PENDING_PAYMENT]: 'warning',
      [OrderStatus.CONFIRMED]: 'dark',
      [OrderStatus.PAID]: 'success',
      [OrderStatus.SHIPPING]: 'dark',
      [OrderStatus.DELIVERED]: 'success',
      [OrderStatus.CANCELED]: 'error',
      [OrderStatus.EXPIRED]: 'error',
    };
    return colorMap[status] || 'dark';
  };

  // Define columns for DataTable
  const columns: Column<OrderDto>[] = [
    {
      key: 'id',
      title: 'Order ID',
      dataIndex: 'id',
      width: '12%',
      render: (value: string, record: OrderDto) => (
        <Link
          href={`/marketplace/order/${record.id}`}
          className="hover:text-brand-500 dark:hover:text-brand-400 truncate font-medium text-gray-800 transition dark:text-white/90"
        >
          #{value.slice(0, 8)}
        </Link>
      ),
    },
    {
      key: 'user',
      title: 'Customer',
      width: '22%',
      render: (_: any, record: OrderDto) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full">
            <Image
              width={32}
              height={32}
              src={record.user.avatarUrl || '/images/user/user-01.png'}
              alt={record.user.username}
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-800 dark:text-white/90">
              {record.user.username}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {record.user.email}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'itemCount',
      title: 'Items',
      dataIndex: 'itemCount',
      width: '8%',
      render: (value: number) => (
        <span className="text-sm text-gray-800 dark:text-white/90">
          {value}
        </span>
      ),
    },
    {
      key: 'totalAmount',
      title: 'Total',
      dataIndex: 'totalAmount',
      sorter: true,
      width: '12%',
      render: (value: number) => (
        <span className="text-sm font-semibold text-gray-800 dark:text-white/90">
          ${value.toFixed(2)}
        </span>
      ),
    },
    {
      key: 'paymentMethod',
      title: 'Payment',
      dataIndex: 'paymentMethod',
      width: '12%',
      render: (value: string) => (
        <span className="text-sm text-gray-600 capitalize dark:text-gray-400">
          {value.replace('_', ' ')}
        </span>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      dataIndex: 'status',
      sorter: true,
      width: '12%',
      render: (value: OrderStatus) => (
        <Badge size="sm" color={getStatusColor(value)}>
          {value.replace(/_/g, ' ')}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      title: 'Order Date',
      dataIndex: 'createdAt',
      sorter: true,
      width: '12%',
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
      width: '10%',
      render: (_: any, record: OrderDto) => (
        <div className="flex items-center justify-center gap-2">
          <Link href={`/marketplace/order/${record.id}`}>
            <Button size="sm" variant="primary">
              View
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
          Order Management
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Track and manage all orders in your marketplace.
        </p>
      </div>

      {/* Search and Actions Bar */}
      <div className="mb-5 flex items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative max-w-xs flex-1">
          <SearchIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search orders..."
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
        </div>
      </div>

      {/* Filters */}
      <div className="mb-5 flex flex-wrap gap-3">
        {/* Order Status Filter */}
        <select
          value={orderStatusFilter || ''}
          onChange={(e) => {
            setOrderStatusFilter(
              e.target.value ? (e.target.value as OrderStatus) : undefined
            );
            setPage(1);
          }}
          className="focus:border-brand-500 focus:ring-brand-500 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-800 transition focus:ring-1 focus:outline-none dark:border-white/[0.05] dark:bg-white/[0.03] dark:text-white/90"
        >
          <option value="">All Order Status</option>
          <option value={OrderStatus.PENDING_PAYMENT}>Pending Payment</option>
          <option value={OrderStatus.CONFIRMED}>Confirmed</option>
          <option value={OrderStatus.PAID}>Paid</option>
          <option value={OrderStatus.SHIPPING}>Shipping</option>
          <option value={OrderStatus.DELIVERED}>Delivered</option>
          <option value={OrderStatus.CANCELED}>Canceled</option>
          <option value={OrderStatus.EXPIRED}>Expired</option>
        </select>

        {/* Payment Status Filter */}
        <select
          value={paymentStatusFilter || ''}
          onChange={(e) => {
            setPaymentStatusFilter(
              e.target.value
                ? (e.target.value as PaymentTransactionStatus)
                : undefined
            );
            setPage(1);
          }}
          className="focus:border-brand-500 focus:ring-brand-500 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-800 transition focus:ring-1 focus:outline-none dark:border-white/[0.05] dark:bg-white/[0.03] dark:text-white/90"
        >
          <option value="">All Payment Status</option>
          <option value={PaymentTransactionStatus.PENDING}>Pending</option>
          <option value={PaymentTransactionStatus.PAID}>Paid</option>
          <option value={PaymentTransactionStatus.FAILED}>Failed</option>
          <option value={PaymentTransactionStatus.REFUNDED}>Refunded</option>
        </select>

        {/* Payment Method Filter */}
        <select
          value={paymentMethodFilter || ''}
          onChange={(e) => {
            setPaymentMethodFilter(
              e.target.value ? (e.target.value as PaymentMethod) : undefined
            );
            setPage(1);
          }}
          className="focus:border-brand-500 focus:ring-brand-500 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-800 transition focus:ring-1 focus:outline-none dark:border-white/[0.05] dark:bg-white/[0.03] dark:text-white/90"
        >
          <option value="">All Payment Methods</option>
          <option value={PaymentMethod.CREDIT}>Credit</option>
          <option value={PaymentMethod.COD}>COD</option>
        </select>

        {/* Active Status Filter */}
        <select
          value={isActiveFilter || ''}
          onChange={(e) => {
            setIsActiveFilter(e.target.value || undefined);
            setPage(1);
          }}
          className="focus:border-brand-500 focus:ring-brand-500 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-800 transition focus:ring-1 focus:outline-none dark:border-white/[0.05] dark:bg-white/[0.03] dark:text-white/90"
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>

        {/* Clear Filters Button */}
        {(orderStatusFilter ||
          paymentStatusFilter ||
          paymentMethodFilter ||
          isActiveFilter) && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setOrderStatusFilter(undefined);
              setPaymentStatusFilter(undefined);
              setPaymentMethodFilter(undefined);
              setIsActiveFilter(undefined);
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
            Error loading orders: {error?.message || 'Unknown error'}
          </p>
        </div>
      )}

      {/* DataTable with Server-side Pagination */}
      <DataTable
        columns={columns}
        data={orderData}
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
        emptyText="No orders found. Try adjusting your search criteria."
      />
    </div>
  );
}
