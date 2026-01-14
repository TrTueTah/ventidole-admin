'use client';

import { useState, useMemo } from 'react';
import Breadcrumb from '@/components/ui/breadcrumb/Breadcrumb';
import DatePicker from '@/components/ui/datepicker/DatePicker';
import AnalyticsAreaChart from '@/components/charts/analytics/AnalyticsAreaChart';
import { useEcommerceAnalyticsQuery } from '@/hooks/useEcommerceAnalyticsQuery';
import { TimeRange } from '@/types/analytics/analytics.req';
import { TrendType } from '@/types/analytics/analytics.dto';
import { DataTable, Column } from '@/components/ui/table';

// Helper function to get default dates (last 30 days)
const getDefaultDates = () => {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 30);

  return {
    startDate: start.toISOString().split('T')[0],
    endDate: end.toISOString().split('T')[0],
  };
};

export default function EcommerceAnalyticsPage() {
  const defaultDates = useMemo(() => getDefaultDates(), []);
  const [startDate, setStartDate] = useState(defaultDates.startDate);
  const [endDate, setEndDate] = useState(defaultDates.endDate);
  const [timeRange, setTimeRange] = useState<TimeRange>(TimeRange.MONTHLY);

  const { data, isLoading, isError } = useEcommerceAnalyticsQuery({
    startDate,
    endDate,
    timeRange,
  });

  const analyticsData = data?.data;

  // Helper function to get trend icon and color
  const getTrendStyles = (trend: TrendType) => {
    switch (trend) {
      case 'increase':
        return {
          icon: '↑',
          colorClass: 'text-green-600 dark:text-green-400',
          bgClass: 'bg-green-50 dark:bg-green-500/10',
        };
      case 'decrease':
        return {
          icon: '↓',
          colorClass: 'text-red-600 dark:text-red-400',
          bgClass: 'bg-red-50 dark:bg-red-500/10',
        };
      case 'stable':
        return {
          icon: '→',
          colorClass: 'text-gray-600 dark:text-gray-400',
          bgClass: 'bg-gray-50 dark:bg-gray-500/10',
        };
    }
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  // Format number
  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  // Table columns for top products
  const productColumns: Column<any>[] = [
    {
      key: 'name',
      title: 'Product Name',
      dataIndex: 'name',
    },
    {
      key: 'revenue',
      title: 'Revenue',
      dataIndex: 'revenue',
      render: (value) => formatCurrency(value),
      align: 'right',
    },
    {
      key: 'orders',
      title: 'Orders',
      dataIndex: 'orders',
      render: (value) => formatNumber(value),
      align: 'right',
    },
  ];

  // Table columns for top categories
  const categoryColumns: Column<any>[] = [
    {
      key: 'name',
      title: 'Category Name',
      dataIndex: 'name',
    },
    {
      key: 'revenue',
      title: 'Revenue',
      dataIndex: 'revenue',
      render: (value) => formatCurrency(value),
      align: 'right',
    },
    {
      key: 'orders',
      title: 'Orders',
      dataIndex: 'orders',
      render: (value) => formatNumber(value),
      align: 'right',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Dashboard', href: '/' },
          { label: 'Ecommerce Analytics' },
        ]}
      />

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
          Ecommerce Analytics
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Track your ecommerce performance metrics and insights
        </p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        <DatePicker
          label="Start Date"
          value={startDate}
          onChange={setStartDate}
          max={endDate}
        />
        <DatePicker
          label="End Date"
          value={endDate}
          onChange={setEndDate}
          min={startDate}
        />
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Time Range
          </label>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as TimeRange)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          >
            <option value={TimeRange.DAILY}>Daily</option>
            <option value={TimeRange.WEEKLY}>Weekly</option>
            <option value={TimeRange.MONTHLY}>Monthly</option>
            <option value={TimeRange.YEARLY}>Yearly</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-brand-500"></div>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/10">
          <p className="text-sm text-red-600 dark:text-red-400">
            Failed to load analytics data. Please try again.
          </p>
        </div>
      )}

      {/* Analytics Content */}
      {!isLoading && !isError && analyticsData && (
        <>
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {analyticsData.metrics.map((metric) => {
              const styles = getTrendStyles(metric.trend);
              return (
                <div
                  key={metric.label}
                  className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
                >
                  <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                    {metric.label}
                  </p>
                  <div className="mb-2 flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {metric.label.toLowerCase().includes('revenue') ||
                      metric.label.toLowerCase().includes('value')
                        ? formatCurrency(metric.value)
                        : formatNumber(metric.value)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${styles.bgClass} ${styles.colorClass}`}
                    >
                      <span>{styles.icon}</span>
                      <span>{Math.abs(metric.percentageChange).toFixed(2)}%</span>
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      vs previous period
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Charts */}
          {analyticsData.charts.map((chart) => (
            <div
              key={chart.title}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
            >
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                {chart.title}
              </h3>
              <AnalyticsAreaChart
                title={chart.title}
                data={chart.data}
                color="#465FFF"
                height={310}
                valueFormatter={(value) =>
                  chart.title.toLowerCase().includes('revenue') ||
                  chart.title.toLowerCase().includes('sales')
                    ? formatCurrency(value)
                    : formatNumber(value)
                }
              />
            </div>
          ))}

          {/* Tables */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Top Products Table */}
            <DataTable
              title="Top Products"
              columns={productColumns}
              data={analyticsData.tables.topProducts}
              showHeader={true}
              pagination={false}
              emptyText="No product data available"
            />

            {/* Top Categories Table */}
            <DataTable
              title="Top Categories"
              columns={categoryColumns}
              data={analyticsData.tables.topCategories}
              showHeader={true}
              pagination={false}
              emptyText="No category data available"
            />
          </div>
        </>
      )}
    </div>
  );
}
