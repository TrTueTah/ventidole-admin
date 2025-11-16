import { Button, Flex, Table, Typography } from 'antd';
import { ColumnsType, TableProps } from 'antd/es/table';
import clsx from 'clsx';
import { memo, useEffect, useRef } from 'react';
import Icon from './Icon';
import NoDataTable from './NoDataTable';

export type VentidoleTableProps<T> = Omit<TableProps<T>, 'scroll'> & {
  columns: ColumnsType<T>;
  data?: T[];
  titleTable?: string | React.ReactNode;
  chartButtonText?: string;
  onOpenChart?: () => void;
  changeHorizontalScrollToOpposite?: boolean;
  scroll?: TableProps<T>['scroll'] | null;
};

function VentidoleTable<T extends object>({
  columns,
  data,
  titleTable = '',
  chartButtonText = '',
  onOpenChart,
  scroll,
  showHeader = true,
  expandable,
  loading,
  className,
  changeHorizontalScrollToOpposite = false,
  ...rest
}: VentidoleTableProps<T>) {
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollToEnd = () => {
      if (tableRef.current && data?.length && changeHorizontalScrollToOpposite) {
        const scrollContainer = tableRef.current.querySelector('.ant-table-content') as HTMLDivElement;
        if (scrollContainer) {
          scrollContainer.scrollLeft = scrollContainer.scrollWidth;
        }
      }
    };

    setTimeout(scrollToEnd, 100);
  }, [data]);

  return (
    <Flex vertical gap={16} className={clsx(className)}>
      <Flex justify='space-between' align='center'>
        {titleTable && <Typography className='title'>{titleTable}</Typography>}
        {chartButtonText && (
          <Button
            onClick={() => onOpenChart && onOpenChart()}
            icon={<Icon className='w-6 h-6 px-[3px] py-[4px]' icon='GraphIcon' />}
            type='link'
            className='ventidole__icon-button !text-ventidole-secondary-950 font-medium'>
            {chartButtonText}
          </Button>
        )}
      </Flex>
      <div ref={tableRef}>
        <Table
          rowKey={(record: T) => (record as T & { id: number }).id}
          dataSource={data}
          columns={columns}
          {...(scroll !== null && { scroll: scroll || { x: 750 } })}
          showHeader={showHeader}
          loading={loading}
          expandable={expandable}
          pagination={false}
          showSorterTooltip={false}
          locale={{
            emptyText: <NoDataTable />,
          }}
          {...rest}
        />
      </div>
    </Flex>
  );
}

export default memo(VentidoleTable) as typeof VentidoleTable;
