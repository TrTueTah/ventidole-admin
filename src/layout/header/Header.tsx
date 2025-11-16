import { Badge, Button } from 'antd';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import ContentPopupChangeInfo from './components/ContentPopupChangeInfo';
import VentidolePopover from '@/components/ui/Popover';
import useResize from '@/hooks/useResize';
// import NotificationList from './components/NotificationList';
import { useSidebarStore } from '@/store/sidebar.store';
import { ICONS } from '@/config/icons';

export type PopoverOpen = 'NOTIFICATION' | 'CHANGE_INFO' | '';
interface IProps {
  isShowSidebar?: boolean;
}
function Header({ isShowSidebar = true }: IProps) {
  const [openPopover, setOpenPopover] = useState<PopoverOpen>('');

  const { isMobile } = useResize();
  const { collapsed, setCollapsed } = useSidebarStore();

  // const { data: dataNotificationCount } = useQuery({
  //   queryKey: ['NOTIFICATION_COUNT'],
  //   refetchOnWindowFocus: false,
  //   queryFn: getNotificationCountAPI,
  //   select: (response) => response.data,
  //   enabled: Boolean(accountInfo && accountInfo.role === RoleAccount.LEDGER),
  // });

  // const { data: dataNotificationList } = useQuery({
  //   queryKey: ['NOTIFICATION_LIST'],
  //   refetchOnWindowFocus: false,
  //   queryFn: () =>
  //     getNotificationAdminLatestAPI({
  //       size: 10,
  //       offset: 0,
  //     }),
  //   select: (response) => response.data.map(getNotificationAdminToDTO),
  //   enabled: Boolean(accountInfo && accountInfo.role === RoleAccount.LEDGER),
  // });

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleOpenPageChange = (open: boolean) => {
    if (!open) {
      setOpenPopover('');
    }
  };

  const handleOpenPopover = (popover: PopoverOpen) => {
    if (openPopover === popover) {
      setOpenPopover('');
    } else {
      setOpenPopover(popover);
    }
  };

  return (
    <div className='flex flex-col justify-center h-full gap-2 md:gap-0 md:flex-row md:justify-between'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3 md:gap-8'>
          {isShowSidebar && (
            <Button
              type='text'
              onClick={toggleCollapsed}
              icon={<img src={ICONS.FoldOut} alt='FoldOut' />}
              className='pt-0.5'
              id='menu-toggle-btn'
            />
          )}

          <Link className='flex flex-col' to='/'>
            <img className='w-[107px] md:w-[141px] h-5 md:h-[25px]' src={ICONS.Logo} alt='logo' />
            {/* <span className='text-[5.365px] leading-[5.365px] text-ventidole-main-color font-medium self-end'>
            병·의원 운영 자문회사 <strong>(주)리젠</strong>
          </span> */}
          </Link>
        </div>
        {/* <div className='flex items-center md:hidden'>
          <RemainingTime />
        </div> */}
      </div>

      <div className='flex justify-between w-full md:w-auto gap-x-4'>
        {/* <div className='items-center hidden md:flex'>
          <RemainingTime />
        </div> */}
        <div className='flex justify-between w-full gap-2 lg:w-auto md:gap-6 lg:justify-start'>
          <VentidolePopover
            contentPopover={/* <NotificationList data={dataNotificationList || []} /> */ <div>Notification List</div>}
            open={openPopover === 'NOTIFICATION'}
            placement='bottomRight'
            onOpenChange={handleOpenPageChange}>
            <Badge count={4} className='self-center ml-2 mr-4 md:ml-4 md:mr-7' offset={[-8, 6]}>
              <Button
                type='text'
                icon={<img src={ICONS.BellSimple} alt='bell-icon' />}
                onClick={() => handleOpenPopover('NOTIFICATION')}
              />
            </Badge>
          </VentidolePopover>

          <VentidolePopover
            contentPopover={<ContentPopupChangeInfo onOpenChange={handleOpenPageChange} />}
            open={openPopover === 'CHANGE_INFO'}
            placement='bottomRight'
            onOpenChange={handleOpenPageChange}>
            {isMobile ? (
              <Button
                type='text'
                icon={<img src={ICONS.User} alt='user' />}
                className='my-auto'
                onClick={() => handleOpenPopover('CHANGE_INFO')}
              />
            ) : (
              <Button
                className='px-4 w-fit max-w-[100px] truncate h-[34px] border border-solid border-ventidole-main-color self-center text-ventidole-main-color font-medium rounded-md'
                onClick={() => handleOpenPopover('CHANGE_INFO')}>
                test
              </Button>
            )}
          </VentidolePopover>
        </div>
      </div>
    </div>
  );
}

export default Header;
