import VentidoleBreadcrumb from '@/components/ui/Breadcrumb';
import VentidolePaper from '@/components/ui/Paper';
import { useSearchParams } from 'react-router-dom';
import IdolManagementTable from './components/IdolManagementTable';
import { IdolListREQ } from '@/services/idol/idol.req';
import { useFilterPaging } from '@/hooks/useFilterPaging';
import { useMemo } from 'react';
import { idolManagementListParamToFilter } from '@/services/idol/idol.service';
import { initialPagingState } from '@/types/paging.type';

export default function IdolManagementList() {
  const [searchParams] = useSearchParams();

  const { initialPaging, initialFilter } = useMemo(() => {
    const initialFilter = idolManagementListParamToFilter({
      searchParams,
    });
    const initialPaging = {
      size: +(searchParams.get('size') || initialPagingState.size),
      offset: +(searchParams.get('offset') || initialPagingState.offset),
    };
    return { initialPaging, initialFilter };
  }, [searchParams]);

  const { filter, handlePageChange, handleFilterChange } = useFilterPaging<IdolListREQ>({
    initialPaging,
    initialFilter,
  });
  return (
    <div className='flex flex-col gap-y-4'>
      <VentidoleBreadcrumb breadcrumbs={['Idol Management']} />
      <VentidolePaper>
        <div className='flex flex-col gap-4'>
          <IdolManagementTable
            filter={filter}
            handleFilterChange={handleFilterChange}
            handlePageChange={handlePageChange}
          />
        </div>
      </VentidolePaper>
    </div>
  );
}