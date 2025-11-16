import { ICONS } from '@/config/icons';

type VentidoleBreadcrumbProps = {
  breadcrumbs?: string[];
};

export default function VentidoleBreadcrumb({ breadcrumbs }: VentidoleBreadcrumbProps) {
  return (
    <div className='flex px-2 h-5 w-full no-print'>
      <img src={ICONS.Home} alt='home' className='w-5 h-5' />
      {breadcrumbs?.map((breadcrumb, index) => (
        <div key={index} className='flex ml-2 gap-2'>
          <img src={ICONS.RightArrow} alt='arrowRight' />
          <span className='text-ventidole-neutral-70 text-sm flex-shrink-0'>{breadcrumb}</span>
        </div>
      ))}
    </div>
  );
}
