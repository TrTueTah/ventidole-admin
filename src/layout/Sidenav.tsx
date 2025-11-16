import { Menu } from 'antd';
import clsx from 'clsx';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getMenuList } from './menu-items';
import { useSidebarStore } from '@/store/sidebar.store';
import { AccountState, useAccountStore } from '@/store/account.store';
import useResize from '@/hooks/useResize';

export default function SiderMenu() {
  const [openKeys, setOpenKeys] = useState<string>('');
  const navigate = useNavigate();
  const { collapsed, setCollapsed } = useSidebarStore();
  const { pathname } = useLocation();
  const { accountInfo } = useAccountStore() as AccountState;
  const menuRef = useRef<HTMLDivElement | null>(null);

  const { isMobile, isTablet } = useResize();

  const selectedKeys = useMemo(() => {
    const array = pathname.split('/');
    if (array.length > 2) {
      return array[2];
    } else {
      return array[array.length - 1];
    }
  }, [pathname]);

  const menuList = useMemo(() => {
    return getMenuList({ navigate, selectedKeys, accountInfo });
  }, [selectedKeys, accountInfo, navigate]);

  useEffect(() => {
    let clickTimeout: number;

    const handleClickOutside = (event: MouseEvent) => {
      if (clickTimeout) {
        clearTimeout(clickTimeout);
      }

      clickTimeout = setTimeout(() => {
        if (
          menuRef.current &&
          !menuRef.current.contains(event.target as Node) &&
          !(event.target as Element).closest('#menu-toggle-btn')
        ) {
          setCollapsed(true);
        }
      }, 0);
    };

    if ((isMobile && !collapsed) || (isTablet && !collapsed)) {
      document.addEventListener('mousedown', handleClickOutside);

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        if (clickTimeout) {
          clearTimeout(clickTimeout);
        }
      };
    }
  }, [isMobile, isTablet, collapsed, setCollapsed]);

  return (
    <div className={clsx('side-bar-menu h-[calc(100vh-80px)] overflow-y-auto', collapsed && 'hidden-title')} ref={menuRef}>
      <Menu
        mode='inline'
        className='h-full bg-ventidole-main-color !border-none'
        openKeys={[openKeys]}
        selectedKeys={[selectedKeys]}
        items={menuList}
        onOpenChange={(keys) => setOpenKeys(keys.at(-1) as string)}
      />
    </div>
  );
}
