import { ICONS } from '@/config/icons';

export type MenuIconType = keyof typeof ICONS;

type MenuIconProps = {
  icon: MenuIconType;
  className?: string;
};

export default function Icon({ icon, className = '' }: MenuIconProps) {
  return (
    <div className={className}>
      <img src={ICONS[icon] as MenuIconType} alt={icon} className='w-full h-full' />
    </div>
  );
}
