'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import Button from '@/components/ui/button/Button';
import Badge from '@/components/ui/badge/Badge';
import { useCommunityQuery } from '@/hooks/useCommunityQuery';
import { CommunityDto } from '@/types/community/community.dto';

export default function CommunityDetailPage() {
  const params = useParams();
  const communityId = params.id as string;

  // Fetch community data
  const { data, isLoading, isError } = useCommunityQuery(communityId);

  const community: CommunityDto | undefined = data?.data;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-gray-600 dark:text-gray-400">
          Loading community details...
        </p>
      </div>
    );
  }

  if (isError || !community) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white/90">
          Community Not Found
        </h2>
        <Link href="/community">
          <Button variant="primary">Back to Community List</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
          Community Details
        </h2>
        <div className="flex gap-3">
          <Link href="/community">
            <Button variant="outline">Back to List</Button>
          </Link>
          <Link href={`/community/form/${community.id}`}>
            <Button variant="primary">Edit Community</Button>
          </Link>
        </div>
      </div>

      <div className="space-y-6">
        {/* Community Profile Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 lg:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          {/* Background Image */}
          {community.backgroundUrl && (
            <div className="relative -m-5 -mt-5 mb-6 h-48 overflow-hidden rounded-t-2xl lg:-m-6 lg:-mt-6 lg:mb-6">
              <Image
                fill
                src={community.backgroundUrl}
                alt={community.name}
                className="object-cover"
              />
            </div>
          )}

          <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
            <div className="h-24 w-24 overflow-hidden rounded-full">
              <Image
                width={96}
                height={96}
                src={community.avatarUrl || '/images/user/user-01.png'}
                alt={community.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                  {community.name}
                </h3>
                <Badge
                  size="sm"
                  color={community.isActive ? 'success' : 'error'}
                >
                  {community.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              {community.description && (
                <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                  {community.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Community Information */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 lg:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <h4 className="mb-5 text-lg font-semibold text-gray-800 lg:mb-7 dark:text-white/90">
            Community Information
          </h4>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-x-16 lg:gap-y-7">
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Community Name
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {community.name}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Status
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {community.isActive ? 'Active' : 'Inactive'}
              </p>
            </div>
            <div className="lg:col-span-2">
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Description
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {community.description || 'No description provided'}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Created At
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {new Date(community.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Last Updated
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {new Date(community.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Images Section */}
        {(community.avatarUrl || community.backgroundUrl) && (
          <div className="rounded-2xl border border-gray-200 bg-white p-5 lg:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <h4 className="mb-5 text-lg font-semibold text-gray-800 lg:mb-7 dark:text-white/90">
              Images
            </h4>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {community.avatarUrl && (
                <div>
                  <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
                    Avatar
                  </p>
                  <div className="relative h-48 overflow-hidden rounded-lg">
                    <Image
                      fill
                      src={community.avatarUrl}
                      alt="Community Avatar"
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
              {community.backgroundUrl && (
                <div>
                  <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
                    Background
                  </p>
                  <div className="relative h-48 overflow-hidden rounded-lg">
                    <Image
                      fill
                      src={community.backgroundUrl}
                      alt="Community Background"
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
