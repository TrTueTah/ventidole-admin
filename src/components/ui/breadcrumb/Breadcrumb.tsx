'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BreadcrumbIcon } from '@/icons';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
}

// Helper function to generate label from path segment
const generateLabel = (segment: string): string => {
  // Handle special cases
  const specialCases: Record<string, string> = {
    'user-management': 'User Management',
    'product-type': 'Product Types',
    ecommerce: 'E-commerce',
    dashboard: 'Dashboard',
    marketplace: 'Marketplace',
  };

  if (specialCases[segment]) {
    return specialCases[segment];
  }

  // Convert kebab-case or snake_case to Title Case
  return segment
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default function Breadcrumb({ items }: BreadcrumbProps) {
  const pathname = usePathname();

  // If items are provided, use them
  if (items) {
    return (
      <div className="mb-6 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        {items.map((item, index) => (
          <span key={index} className="flex items-center gap-2">
            {index > 0 && <BreadcrumbIcon className="h-3 w-3" />}
            {item.href ? (
              <Link
                href={item.href}
                className="hover:text-gray-700 dark:hover:text-gray-300"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-800 dark:text-white/90">
                {item.label}
              </span>
            )}
          </span>
        ))}
      </div>
    );
  }

  // Auto-generate breadcrumbs from pathname
  const pathSegments = pathname.split('/').filter((segment) => segment !== '');

  // Build breadcrumb items from path
  const breadcrumbItems: BreadcrumbItem[] = [{ label: 'Home', href: '/' }];

  let currentPath = '';
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === pathSegments.length - 1;

    breadcrumbItems.push({
      label: generateLabel(segment),
      href: isLast ? undefined : currentPath,
    });
  });

  // Handle root path
  if (breadcrumbItems.length === 1) {
    return null; // Don't show breadcrumb on home page
  }

  return (
    <div className="mb-6 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
      {breadcrumbItems.map((item, index) => (
        <span key={index} className="flex items-center gap-2">
          {index > 0 && <BreadcrumbIcon className="h-3 w-3" />}
          {item.href ? (
            <Link
              href={item.href}
              className="hover:text-gray-700 dark:hover:text-gray-300"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-800 dark:text-white/90">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </div>
  );
}
