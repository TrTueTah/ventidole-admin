import { Pagination } from 'antd';
import { PagingREQ, initialPagingState } from '@/types/paging.type';

type Props = {
  totalItems?: number;
  onPageNumberChange: ({ offset, size }: PagingREQ) => void;
  paging: PagingREQ;
  isShow?: boolean;
};

export default function VentidolePagination({ totalItems = 0, paging, onPageNumberChange, isShow = totalItems > 10 }: Props) {
  const handlePageChange = (offset: number, size: number) => {
    onPageNumberChange && onPageNumberChange({ offset: offset - 1, size });
  };

  return (
    isShow && (
      <Pagination
        showSizeChanger={false}
        defaultCurrent={1}
        total={totalItems}
        className='flex justify-center mt-10 no-print'
        onChange={handlePageChange}
        pageSize={paging.size || initialPagingState.size}
        current={paging.offset + 1 || initialPagingState.offset + 1}
      />
    )
  );
}
