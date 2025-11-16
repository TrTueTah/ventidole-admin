import { ICONS } from '@/config/icons';

export default function NotificationModal() {
  // const { data: dataNotificationList, isFetching: isFetchingNotiList } = useQuery({
  //   queryKey: ['NOTIFICATION_LIST_ALL'],
  //   refetchOnWindowFocus: false,
  //   queryFn: () =>
  //     getNotificationAdminAPI({
  //       offset: 0,
  //       size: 1000,
  //     }),
  //   select: (response) => response.data.content.map((item) => getNotificationAdminAllToDTO(item)),
  // });

  return (
    <div className='flex flex-col justify-center'>
      <div className='flex gap-2 px-5 my-[7px]'>
        <img src={ICONS.BellSimple} alt='icon' className='my-auto w-5 h-5' />
        <span className='text-lg font-semibold'>알림</span>
      </div>

      <div className='border-0 border-t border-solid border-ventidole-neutral-30 mx-5 mt-3 mb-[6px]' />
      <div className='px-5 py-3'>
        <span className='text-sm text-ventidole-neutral-100'>알림이 없습니다.</span>
      </div>
    </div>
  );
}
