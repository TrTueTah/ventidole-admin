import { Form } from 'antd';
import Icon from './Icon';
import clsx from 'clsx';
import { PagingREQ, initialPagingState } from '@/types/paging.type';
import { debounce } from '@/utils/func.helper';
import { TIME_DELAY_REQUEST } from '@/constants/time.constant';
import { SelectInput } from '../form/SelectInput';
import { TextInput } from '../form/TextInput';
import { useEffect } from 'react';
import { FilterREQ, ListREQ } from '@/services/common/common.req';
import useResize from '@/hooks/useResize';

type FilterTableProps = {
  totalItem?: number;
  className?: string;
  onPageSizeChange: ({ offset, size }: PagingREQ) => void;
  onFilterChange: (filter: FilterREQ) => void;
  paging: PagingREQ;
  filter: ListREQ;
  showTotalOnStart?: boolean;
};

const optionsTotalPerPage = () => [
  { value: 10, label: <>{'10 pages'}</> },
  { value: 20, label: <>{'20 pages'}</> },
  { value: 50, label: <>{'50 pages'}</> },
  { value: 100, label: <>{'100 pages'}</> },
];

export default function FilterTable({
  totalItem = 0,
  paging,
  className,
  onPageSizeChange,
  onFilterChange,
  filter,
  showTotalOnStart = false,
}: FilterTableProps) {

  const { isMobile } = useResize();

  const [form] = Form.useForm();

  const handlePageSizeChange = (value: number) => {
    onPageSizeChange({ offset: 0, size: value });
  };

  const handleFilterChange = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      search: e.target.value,
    } as FilterREQ);
  }, TIME_DELAY_REQUEST);

  useEffect(() => {
    if (filter) {
      form.setFieldsValue({
        search: filter.search,
        size: filter.size,
      });
    }
  }, [filter]);

  return (
    <div className='flex flex-col gap-4 no-print'>
      <Form
        form={form}
        className={clsx('flex items-center h-[34px] w-full', className)}
        initialValues={{
          totalPerPage: paging?.size || initialPagingState.size,
        }}>
        {showTotalOnStart && !isMobile && (
          <span className='text-ventidole-neutral-80 text-sm whitespace-nowrap mr-4'>
            {'Total items: ' + totalItem}
          </span>
        )}
        <SelectInput
          formItemName='totalPerPage'
          classNameInput='!w-[120px] h-[34px] mr-2 md:mr-4'
          value={paging?.size || initialPagingState.size}
          options={optionsTotalPerPage()}
          onChange={handlePageSizeChange}
        />
        <TextInput
          formItemName='search'
          placeholder={'Enter search term'}
          suffix={<Icon icon='Search' className='mt-1' />}
          classNameInput='w-full md:max-w-[246px] ventidole-input-search-filter'
          onChange={handleFilterChange}
        />
      </Form>
      {(!showTotalOnStart || isMobile) && (
        <span className='text-ventidole-neutral-80 text-sm whitespace-nowrap'>
          {'Total items: ' + totalItem}
        </span>
      )}
    </div>
  );
}
