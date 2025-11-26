'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { DataTable, Column } from '@/components/ui/table';
import Badge from '@/components/ui/badge/Badge';
import Button from '@/components/ui/button/Button';
import { PencilIcon, SearchIcon, PlusIcon } from '@/icons';
import Breadcrumb from '@/components/ui/breadcrumb/Breadcrumb';

interface User {
  id: number;
  image: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive' | 'Pending';
  createdAt: string;
}

// Sample data
const userData: User[] = [
  {
    id: 1,
    image: '/images/user/user-17.jpg',
    name: 'Lindsey Curtis',
    email: 'lindsey.curtis@example.com',
    role: 'Admin',
    status: 'Active',
    createdAt: '2024-01-15',
  },
  {
    id: 2,
    image: '/images/user/user-18.jpg',
    name: 'Kaiya George',
    email: 'kaiya.george@example.com',
    role: 'User',
    status: 'Active',
    createdAt: '2024-01-20',
  },
  {
    id: 3,
    image: '/images/user/user-17.jpg',
    name: 'Zain Geidt',
    email: 'zain.geidt@example.com',
    role: 'User',
    status: 'Inactive',
    createdAt: '2024-02-01',
  },
  {
    id: 4,
    image: '/images/user/user-20.jpg',
    name: 'Abram Schleifer',
    email: 'abram.schleifer@example.com',
    role: 'Moderator',
    status: 'Active',
    createdAt: '2024-02-10',
  },
  {
    id: 5,
    image: '/images/user/user-21.jpg',
    name: 'Carla George',
    email: 'carla.george@example.com',
    role: 'User',
    status: 'Pending',
    createdAt: '2024-02-15',
  },
  {
    id: 6,
    image: '/images/user/user-17.jpg',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    role: 'Editor',
    status: 'Active',
    createdAt: '2024-02-20',
  },
  {
    id: 7,
    image: '/images/user/user-18.jpg',
    name: 'Michael Brown',
    email: 'michael.brown@example.com',
    role: 'User',
    status: 'Active',
    createdAt: '2024-02-25',
  },
  {
    id: 8,
    image: '/images/user/user-20.jpg',
    name: 'Emma Wilson',
    email: 'emma.wilson@example.com',
    role: 'Admin',
    status: 'Inactive',
    createdAt: '2024-03-01',
  },
];

export default function UserList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);

  // Filter data based on search term
  const filteredData = userData.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle selection change
  const handleSelectionChange = (keys: (string | number)[], rows: User[]) => {
    setSelectedRowKeys(keys as number[]);
    console.log('Selected keys:', keys);
    console.log('Selected rows:', rows);
  };

  // Define columns for DataTable
  const columns: Column<User>[] = [
    {
      key: 'name',
      title: 'User',
      dataIndex: 'name',
      sorter: true,
      width: '25%',
      render: (value: string, record: User) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full">
            <Image width={40} height={40} src={record.image} alt={value} />
          </div>
          <Link
            href={`/user-management/user-list/${record.id}`}
            className="truncate font-medium text-gray-800 transition hover:text-brand-500 dark:text-white/90 dark:hover:text-brand-400"
          >
            {value}
          </Link>
        </div>
      ),
    },
    {
      key: 'email',
      title: 'Email',
      dataIndex: 'email',
      sorter: true,
      width: '25%',
    },
    {
      key: 'role',
      title: 'Role',
      dataIndex: 'role',
      sorter: true,
      width: '12%',
      render: (value: string) => (
        <Badge
          size="sm"
          color={
            value === 'Admin'
              ? 'primary'
              : value === 'Moderator'
                ? 'warning'
                : 'success'
          }
        >
          {value}
        </Badge>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      dataIndex: 'status',
      sorter: true,
      width: '12%',
      render: (value: User['status']) => (
        <Badge
          size="sm"
          color={
            value === 'Active'
              ? 'success'
              : value === 'Pending'
                ? 'warning'
                : 'error'
          }
        >
          {value}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      title: 'Created At',
      dataIndex: 'createdAt',
      width: '12%',
      sorter: (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'actions',
      title: 'Actions',
      align: 'center',
      width: '14%',
      render: (_: any, record: User) => (
        <div className="flex items-center justify-center gap-2">
          <Link href={`/user-management/user-list/${record.id}`}>
            <Button size="sm" variant="outline">
              View
            </Button>
          </Link>
          <Link href={`/user-management/user-list/form/${record.id}`}>
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
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white py-2 pr-4 pl-10 text-sm text-gray-800 placeholder-gray-400 transition focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-white/[0.05] dark:bg-white/[0.03] dark:text-white/90 dark:placeholder-gray-500"
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
          <Link href="/user-management/user-list/form/create">
            <Button variant="primary" size="sm" startIcon={<PlusIcon />}>
              Add User
            </Button>
          </Link>
        </div>
      </div>

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={filteredData}
        pagination
        pageSize={5}
        rowSelection={{
          selectedRowKeys: selectedRowKeys,
          onChange: handleSelectionChange,
        }}
        emptyText="No users found. Try adjusting your search criteria."
      />
    </div>
  );
}
