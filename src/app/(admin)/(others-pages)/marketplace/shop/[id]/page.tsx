'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import Button from '@/components/ui/button/Button';
import Badge from '@/components/ui/badge/Badge';
import { useShopQuery } from '@/hooks/useShopQuery';
import { ShopDto } from '@/types/shop/shop.dto';

export default function ShopDetailPage() {
  const params = useParams();
  const shopId = params.id as string;

  // Fetch shop data
  const { data, isLoading, isError } = useShopQuery(shopId, !!shopId);

  const shop: ShopDto | undefined = data?.data;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-gray-600 dark:text-gray-400">
          Loading shop details...
        </p>
      </div>
    );
  }

  if (isError || !shop) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white/90">
          Shop Not Found
        </h2>
        <Link href="/marketplace/shop">
          <Button variant="primary">Back to Shop List</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
          Shop Details
        </h2>
        <div className="flex gap-3">
          <Link href="/marketplace/shop">
            <Button variant="outline">Back to List</Button>
          </Link>
          <Link href={`/marketplace/shop/form/${shop.id}`}>
            <Button variant="primary">Edit Shop</Button>
          </Link>
        </div>
      </div>

      <div className="space-y-6">
        {/* Shop Profile Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 lg:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
            <div className="h-24 w-24 overflow-hidden rounded-full">
              <Image
                width={96}
                height={96}
                src={shop.avatarUrl || '/images/product/product-01.png'}
                alt={shop.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                  {shop.name}
                </h3>
                <Badge size="sm" color={shop.isActive ? 'success' : 'error'}>
                  {shop.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              {shop.description && (
                <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                  {shop.description}
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
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  {shop.community.name}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Shop Information */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 lg:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <h4 className="mb-5 text-lg font-semibold text-gray-800 lg:mb-7 dark:text-white/90">
            Shop Information
          </h4>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-x-16 lg:gap-y-7">
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Shop Name
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {shop.name}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Community
              </p>
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 overflow-hidden rounded-full">
                  <Image
                    width={24}
                    height={24}
                    src={shop.community.avatarUrl || '/images/user/user-01.png'}
                    alt={shop.community.name}
                  />
                </div>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {shop.community.name}
                </p>
              </div>
            </div>
            {shop.description && (
              <div className="lg:col-span-2">
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                  Description
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {shop.description}
                </p>
              </div>
            )}
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Status
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {shop.isActive ? 'Active' : 'Inactive'}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Community ID
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {shop.community.id}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Created At
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {new Date(shop.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Updated At
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {new Date(shop.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
