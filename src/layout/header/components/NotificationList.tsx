// import Icon from '@/components/ui/Icon';
// import { ICONS } from '@/config/icons';
// import { Button, Modal } from 'antd';
// import { useState } from 'react';
// import NotificationModal from './NotificationModal';
// import { PopoverOpen } from '../Header';
// import { NotificationAdminDTO } from '@/services/notifications/notification.dto';
// import clsx from 'clsx';
// import { getNotificationAdminDetailAPI } from '@/apis/notification.api';
// import useInvalidate from '@/hooks/useInvalidate';

// type NotificationListProps = {
//   data: NotificationAdminDTO[];
//   setOpenPopover: (popover: PopoverOpen) => void;
// };

// export default function NotificationList({ data, setOpenPopover }: NotificationListProps) {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const invalidate = useInvalidate();

//   return (
//     <div className='flex flex-col w-[346px] justify-center py-2'>
//       <div className='flex justify-between'>
//         <div className='flex gap-2 px-5 my-[7px]'>
//           <img src={ICONS.BellSimple} alt='icon' className='my-auto w-4 h-4' />
//           <span className='text-sm font-medium'>알림</span> {/* Notification */}
//         </div>

//         <Button
//           type='link'
//           onClick={() => {
//             setIsModalOpen(true);
//             setOpenPopover('');
//           }}
//           className='flex items-center'>
//           <span className='text-xs text-ventidole-neutral-60'>전체보기</span>
//           {/* View all */}
//           <Icon icon='CaretRight' className='items-center flex !w-[14px] !h-[14px]' />
//         </Button>
//       </div>

//       <div className='border-0 border-t border-solid border-ventidole-neutral-30 mx-5 mt-3 mb-[6px]' />
//       {data.length === 0 ? (
//         <div className='px-5 py-3'>
//           <span className='text-sm text-ventidole-neutral-100'>알림이 없습니다.</span>
//         </div>
//       ) : (
//         <div className='flex flex-col max-h-[300px] overflow-y-scroll'>
//           {data.map((item) =>
//             item.type === 'MARKETING' ? (
//               <a
//                 key={item.id}
//                 href={item.link} // hoặc trích riêng phần link trong content nếu cần
//                 target='_blank'
//                 rel='noopener noreferrer'
//                 className={clsx('flex flex-col gap-1 px-5 py-3 hover:bg-ventidole-secondary-700 hover:cursor-pointer', {
//                   'bg-ventidole-secondary-700': !item.read,
//                   'bg-white': item.read,
//                 })}
//                 onClick={() => {
//                   getNotificationAdminDetailAPI(item.id).then(() => {
//                     invalidate({ queryKey: ['NOTIFICATION_LIST_ALL'] });
//                     invalidate({ queryKey: ['NOTIFICATION_COUNT'] });
//                     invalidate({ queryKey: ['NOTIFICATION_LIST'] });
//                   });
//                 }}>
//                 <span className='text-sm font-medium text-ventidole-neutral-100'>{item.title}</span>
//                 <span className='text-xs text-ventidole-neutral-60'>{item.createAt}</span>
//               </a>
//             ) : (
//               <div
//                 key={item.id}
//                 className={clsx('flex flex-col gap-1 px-5 py-3 hover:bg-ventidole-secondary-700 hover:cursor-pointer', {
//                   'bg-ventidole-secondary-700': !item.read,
//                   'bg-white': item.read,
//                 })}
//                 onClick={() => {
//                   setIsModalOpen(true);
//                   setOpenPopover('');
//                   getNotificationAdminDetailAPI(item.id).then((res) => {
//                     invalidate({
//                       queryKey: ['NOTIFICATION_LIST_ALL'],
//                     });
//                     invalidate({
//                       queryKey: ['NOTIFICATION_COUNT'],
//                     });
//                     invalidate({
//                       queryKey: ['NOTIFICATION_LIST'],
//                     });
//                   });
//                 }}>
//                 <span className='text-sm font-medium text-ventidole-neutral-100'>{item.title}</span>
//                 <span className='text-xs text-ventidole-neutral-60'>{item.createAt}</span>
//               </div>
//             ),
//           )}
//         </div>
//       )}

//       <Modal open={isModalOpen} footer={null} className='w-full md:!w-[980px]' onCancel={() => setIsModalOpen(false)}>
//         <NotificationModal />
//       </Modal>
//     </div>
//   );
// }
