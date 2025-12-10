'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import Button from '@/components/ui/button/Button';
import Badge from '@/components/ui/badge/Badge';
import { useQuery } from '@tanstack/react-query';
import { getUserByIdAPI } from '@/api/user.api';
import { UserDetailDto } from '@/types/user/user.dto';

export default function UserDetailPage() {
  const params = useParams();
  const userId = params.id as string;

  // Fetch user data
  const { data, isLoading, isError } = useQuery({
    queryKey: ['idol', userId],
    queryFn: () => getUserByIdAPI(userId),
    enabled: !!userId,
  });

  const user: UserDetailDto | undefined = data?.data;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-gray-600 dark:text-gray-400">
          Loading user details...
        </p>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white/90">
          User Not Found
        </h2>
        <Link href="/user-management/user-list">
          <Button variant="primary">Back to User List</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
          User Details
        </h2>
        <div className="flex gap-3">
          <Link href="/user-management">
            <Button variant="outline">Back to List</Button>
          </Link>
          <Link href={`/user-management/form/${user.id}`}>
            <Button variant="primary">Edit User</Button>
          </Link>
        </div>
      </div>

      <div className="space-y-6">
        {/* Idol Profile Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 lg:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
            <div className="h-24 w-24 overflow-hidden rounded-full">
              <Image
                width={96}
                height={96}
                src={user.avatarUrl || '/images/user/user-01.png'}
                alt={user.username}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                  {user.username}
                </h3>
                <Badge size="sm" color={user.isActive ? 'success' : 'error'}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              {user.bio && (
                <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                  {user.bio}
                </p>
              )}
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  {user.email}
                </div>
                {user?.community && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    {user?.community && user.community.name
                      ? user.community.name
                      : 'N/A'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Idol Information */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 lg:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <h4 className="mb-5 text-lg font-semibold text-gray-800 lg:mb-7 dark:text-white/90">
            Idol Information
          </h4>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-x-16 lg:gap-y-7">
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Stage Name
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user.username}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Email Address
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user.email}
              </p>
            </div>
            {user?.community && (
              <div>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                  Community
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {user?.community && user.community.name
                    ? user.community.name
                    : 'N/A'}
                </p>
              </div>
            )}
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Role
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user.role}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Status
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user.isActive ? 'Active' : 'Inactive'}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Account Status
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user.isActive ? 'Active' : 'Inactive'}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Online Status
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user.isOnline ? 'Online' : 'Offline'}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Created At
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Updated At
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {new Date(user.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Background Image */}
        {user.backgroundUrl && (
          <div className="rounded-2xl border border-gray-200 bg-white p-5 lg:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <h4 className="mb-5 text-lg font-semibold text-gray-800 lg:mb-7 dark:text-white/90">
              Background Image
            </h4>
            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
              <Image
                src={user.backgroundUrl}
                alt={`${user.username} background`}
                fill
                className="object-cover"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
