import Link from 'next/link';
import { BreadcrumbIcon } from '@/icons';

export default function Breadcrumb() {
  return (
    <div className="mb-6 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
      <Link href="/" className="hover:text-gray-700 dark:hover:text-gray-300">
        Home
      </Link>
      <BreadcrumbIcon className="h-3 w-3" />
      <span className="text-gray-800 dark:text-white/90">Users</span>
    </div>
  );
}
