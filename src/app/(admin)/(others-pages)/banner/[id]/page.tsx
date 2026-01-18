'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import Button from '@/components/ui/button/Button';
import Badge from '@/components/ui/badge/Badge';
import { useBannerQuery } from '@/hooks/useBannerQuery';
import { BannerDetailDto } from '@/types/banner/banner.dto';

export default function BannerDetailPage() {
  const params = useParams();
  const bannerId = params.id as string;

  // Fetch banner data
  const { data, isLoading, isError } = useBannerQuery(bannerId, !!bannerId);

  const banner: BannerDetailDto | undefined = data?.data;

  // Check if banner is currently active based on dates
  const isBannerActive = (banner: BannerDetailDto) => {
    if (!banner.isActive) return false;
    const now = new Date();
    const start = new Date(banner.startDate);
    const end = new Date(banner.endDate);
    return now >= start && now <= end;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-gray-600 dark:text-gray-400">
          Loading banner details...
        </p>
      </div>
    );
  }

  if (isError || !banner) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white/90">
          Banner Not Found
        </h2>
        <Link href="/banner">
          <Button variant="primary">Back to Banner List</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
          Banner Details
        </h2>
        <div className="flex gap-3">
          <Link href="/banner">
            <Button variant="outline">Back to List</Button>
          </Link>
          <Link href={`/banner/form/${banner.id}`}>
            <Button variant="primary">Edit Banner</Button>
          </Link>
        </div>
      </div>

      <div className="space-y-6">
        {/* Banner Preview Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 lg:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex flex-col gap-6">
            <div className="w-full overflow-hidden rounded-lg">
              <Image
                width={1200}
                height={400}
                src={banner.imageUrl || '/images/placeholder.png'}
                alt={banner.title}
                className="h-auto w-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                  {banner.title}
                </h3>
                <Badge
                  size="sm"
                  color={isBannerActive(banner) ? 'success' : 'error'}
                >
                  {isBannerActive(banner) ? 'Active' : 'Inactive'}
                </Badge>
                <Badge size="sm" color={banner.isActive ? 'success' : 'light'}>
                  {banner.isActive ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
              {banner.description && (
                <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                  {banner.description}
                </p>
              )}
              {banner.link && (
                <div className="flex items-center gap-2 text-sm">
                  <svg
                    className="h-4 w-4 text-gray-600 dark:text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                  <a
                    href={banner.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-brand-500 dark:hover:text-brand-400 truncate text-gray-600 transition dark:text-gray-400"
                  >
                    {banner.link}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Banner Information */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 lg:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <h4 className="mb-5 text-lg font-semibold text-gray-800 lg:mb-7 dark:text-white/90">
            Banner Information
          </h4>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-x-16 lg:gap-y-7">
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Banner Title
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {banner.title}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Display Order
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {banner.order}
              </p>
            </div>
            {banner.description && (
              <div className="lg:col-span-2">
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                  Description
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {banner.description}
                </p>
              </div>
            )}
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Start Date
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {new Date(banner.startDate).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                End Date
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {new Date(banner.endDate).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Image URL
              </p>
              <p className="truncate text-sm font-medium text-gray-800 dark:text-white/90">
                {banner.imageUrl}
              </p>
            </div>
            {banner.link && (
              <div>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                  Click-through Link
                </p>
                <p className="truncate text-sm font-medium text-gray-800 dark:text-white/90">
                  {banner.link}
                </p>
              </div>
            )}
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Status
              </p>
              <Badge
                size="sm"
                color={isBannerActive(banner) ? 'success' : 'error'}
              >
                {isBannerActive(banner) ? 'Currently Active' : 'Not Active'}
              </Badge>
            </div>
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Enabled
              </p>
              <Badge size="sm" color={banner.isActive ? 'success' : 'light'}>
                {banner.isActive ? 'Yes' : 'No'}
              </Badge>
            </div>
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Created At
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {new Date(banner.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Last Updated
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {new Date(banner.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
