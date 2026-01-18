import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Next.js Basic Table | Ventidole - Next.js Dashboard Template',
  description:
    'This is Next.js Basic Table  page for Ventidole  Tailwind CSS Admin Dashboard Template',
  // other metadata
};

export default function BasicTables() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Basic Table" />
      <div className="space-y-6">
        <ComponentCard title="Basic Table 1">
          <div></div>
        </ComponentCard>
      </div>
    </div>
  );
}
