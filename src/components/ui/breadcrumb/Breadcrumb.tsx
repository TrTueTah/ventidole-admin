import Link from 'next/link';
import { BreadcrumbIcon } from '@/icons';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  // Default items if none provided
  const breadcrumbItems = items || [
    { label: 'Home', href: '/' },
    { label: 'Users' },
  ];

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
