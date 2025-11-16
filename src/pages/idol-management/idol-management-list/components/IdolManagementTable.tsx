import FilterTable from "@/components/ui/FilterTable";
import Icon from "@/components/ui/Icon";
import useResize from "@/hooks/useResize";
import { ListREQ } from "@/services/common/common.req";
import { IdolListREQ } from "@/services/idol/idol.req";
import { Button } from "antd";
import clsx from "clsx";
import VentidoleTable from '@/components/ui/Table';
import { columns } from "./columns";
import VentidolePagination from "@/components/ui/Pagination";

type Props = {
  filter: IdolListREQ;
  handleFilterChange: (filter: IdolListREQ) => void;
  handlePageChange: ({ offset, size }: { offset: number; size: number }) => void;
};

function IdolManagementTable({ filter, handleFilterChange, handlePageChange }: Props) {
  const { isMobile } = useResize();

  return (
    <>
      <div className='flex justify-between items-start flex-wrap gap-4'>
        <FilterTable
          totalItem={0}
          onPageSizeChange={handlePageChange}
          paging={{ offset: filter.offset, size: filter.size }}
          onFilterChange={handleFilterChange as any}
          filter={filter as ListREQ}
          showTotalOnStart
        />
        <div className={clsx('flex items-center', isMobile ? 'w-full' : undefined)}>
          {/* <Button
            className='mr-2 h-[34px] border border-solid border-ventidole-secondary-500 text-ventidole-secondary-500 font-medium w-1/2'
            onClick={() => {}}>
            {'Search'}
          </Button> */}
          <Button
            className='ventidole__create-button flex items-center'
            icon={<Icon className='w-4 h-4' icon='WhitePencil' />}
            onClick={() => {}}>
            {'Add Idol'}
          </Button>
        </div>
      </div>

      <VentidoleTable
        data={[]}
        columns={columns()}
        className={clsx('ventidole-table table-community mt-4 table-no-data')}
        tableLayout='fixed'
        loading={false}
        showHeader={false}
      />
      <VentidolePagination
        totalItems={0}
        onPageNumberChange={handlePageChange}
        paging={{
          offset: filter.offset,
          size: filter.size,
        }}
      />
    </>
  );
}

export default IdolManagementTable