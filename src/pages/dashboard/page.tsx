import VentidoleBreadcrumb from '@/components/ui/Breadcrumb';

export default function Dashboard() {
  return (
    <div className='flex flex-col gap-y-4'>
      <VentidoleBreadcrumb />
      <div>
        <p>Dashboard Page</p>
      </div>
    </div>
  );
}
