import { ColumnsType } from 'antd/es/table';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { IdolDTO } from '@/services/idol/idol.dto';

export const columns = (): ColumnsType<IdolDTO> => [
  {
    title: '',
    key: '',
    dataIndex: '',
    width: 80,
    render: (record) => {
      return <img src={record.avatarUrl} alt={record.stageName} className='w-12 h-12 rounded-full object-cover' />;
    },
  },
  {
    title: '',
    key: 'title',
    dataIndex: 'title',
    ellipsis: true,
    render: (title: string) => {
      return (
        <Link to={''} className='text-[#30283e]'>
          <div className='flex items-center'>
            <span>{title}</span>
          </div>
        </Link>
      );
    },
  },
  {
    title: 'Stage Name',
    dataIndex: 'username',
    key: 'username',
    width: 100,
    render: (username: string) => {
      return <span>{username}</span>;
    },
  },
  {
    title: '',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
    width: 130,
    render: (updatedAt: number) => {
      const formattedDate = dayjs(updatedAt * 1000).format('YYYY.MM.DD');
      return <span>{formattedDate}</span>;
    },
  },
  {
    title: '',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
    width: 130,
    render: (updatedAt: number) => {
      const formattedDate = dayjs(updatedAt * 1000).format('YYYY.MM.DD');
      return <span>{formattedDate}</span>;
    },
  },
];
