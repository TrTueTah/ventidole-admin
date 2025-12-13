'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import Button from '@/components/ui/button/Button';
import Badge from '@/components/ui/badge/Badge';
import { useProductQuery } from '@/hooks/useProductQuery';
import { ProductDto } from '@/types/product/product.dto';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;

  // Fetch product data
  const { data, isLoading, isError } = useProductQuery(productId, !!productId);

  const product: ProductDto | undefined = data?.data;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-gray-600 dark:text-gray-400">
          Loading product details...
        </p>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white/90">
          Product Not Found
        </h2>
        <Link href="/marketplace/product">
          <Button variant="primary">Back to Product List</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
          Product Details
        </h2>
        <div className="flex gap-3">
          <Link href="/marketplace/product">
            <Button variant="outline">Back to List</Button>
          </Link>
          <Link href={`/marketplace/product/form/${product.id}`}>
            <Button variant="primary">Edit Product</Button>
          </Link>
        </div>
      </div>

      <div className="space-y-6">
        {/* Product Profile Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 lg:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
            <div className="h-24 w-24 overflow-hidden rounded-lg">
              <Image
                width={96}
                height={96}
                src={product.mediaUrls?.[0] || '/images/product/product-01.png'}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                  {product.name}
                </h3>
                <Badge size="sm" color={product.isActive ? 'success' : 'error'}>
                  {product.isActive ? 'Active' : 'Inactive'}
                </Badge>
                <Badge
                  size="sm"
                  color={
                    product.stock > 10
                      ? 'success'
                      : product.stock > 0
                        ? 'warning'
                        : 'error'
                  }
                >
                  Stock: {product.stock}
                </Badge>
              </div>
              {product.description && (
                <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                  {product.description}
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
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="font-semibold">
                    ${product.price.toFixed(2)}
                  </span>
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
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  {product.shop.name}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Information */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 lg:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <h4 className="mb-5 text-lg font-semibold text-gray-800 lg:mb-7 dark:text-white/90">
            Product Information
          </h4>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-x-16 lg:gap-y-7">
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Product Name
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {product.name}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Shop
              </p>
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 overflow-hidden rounded-full">
                  <Image
                    width={24}
                    height={24}
                    src={
                      product.shop.avatarUrl || '/images/product/product-01.png'
                    }
                    alt={product.shop.name}
                  />
                </div>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {product.shop.name}
                </p>
              </div>
            </div>
            {product.description && (
              <div className="lg:col-span-2">
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                  Description
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {product.description}
                </p>
              </div>
            )}
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Price
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                ${product.price.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Stock
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {product.stock}
              </p>
            </div>
            {product.type && (
              <div>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                  Product Type
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {product.type.name}
                </p>
              </div>
            )}
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Status
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {product.isActive ? 'Active' : 'Inactive'}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Created At
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {new Date(product.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                Updated At
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {new Date(product.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Product Images */}
        {product.mediaUrls && product.mediaUrls.length > 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-5 lg:p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <h4 className="mb-5 text-lg font-semibold text-gray-800 lg:mb-7 dark:text-white/90">
              Product Images
            </h4>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {product.mediaUrls.map((url, index) => (
                <div
                  key={index}
                  className="relative aspect-square overflow-hidden rounded-lg"
                >
                  <Image
                    src={url}
                    alt={`${product.name} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
