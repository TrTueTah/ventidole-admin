'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import Button from '@/components/ui/button/Button';
import Badge from '@/components/ui/badge/Badge';
import { useQuery } from '@tanstack/react-query';
import { getIdolByIdAPI } from '@/api/idol.api';
import { IdolDto } from '@/types/idol/idol.dto';

export default function IdolDetail() {
  const params = useParams();
  const idolId = params.id as string;

  // Fetch idol data
  const { data, isLoading, isError } = useQuery({
    queryKey: ['idol', idolId],
    queryFn: () => getIdolByIdAPI(idolId),
    enabled: !!idolId,
  });

  const idol: IdolDto | undefined = data?.data;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-gray-600 dark:text-gray-400">
          Loading idol details...
        </p>
      </div>
    );
  }

  if (isError || !idol) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white/90">
          Idol Not Found
        </h2>
        <Link href="/user-management/idol-list">
          <Button variant="primary">Back to Idol List</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
          Idol Details
        </h2>
        <div className="flex gap-3">
          <Link href="/user-management/idol-list">
            <Button variant="outline">Back to List</Button>
          </Link>
          <Link href={`/user-management/idol-list/form/${idol.id}`}>
            <Button variant="primary">Edit Idol</Button>
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
                src={idol.avatarUrl || '/images/user/user-01.png'}
                alt={idol.stageName}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                  {idol.stageName}
                </h3>
                <Badge size="sm" color={idol.isActive ? 'success' : 'error'}>
                  {idol.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              {idol.bio && (
                <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                  {idol.bio}
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
                  {idol.user.email}
                </div>
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
                  {idol.community.name}
                </div>
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
                {idol.stageName}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Email Address
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {idol.user.email}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Community
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {idol.community.name}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Role
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {idol.user.role}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Status
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {idol.isActive ? 'Active' : 'Inactive'}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Account Status
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {idol.user.isActive ? 'Active' : 'Inactive'}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Online Status
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {idol.user.isOnline ? 'Online' : 'Offline'}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Created At
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {new Date(idol.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Updated At
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {new Date(idol.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Background Image */}
        {idol.backgroundUrl && (
          <div className="rounded-2xl border border-gray-200 bg-white p-5 lg:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <h4 className="mb-5 text-lg font-semibold text-gray-800 lg:mb-7 dark:text-white/90">
              Background Image
            </h4>
            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
              <Image
                src={idol.backgroundUrl}
                alt={`${idol.stageName} background`}
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
