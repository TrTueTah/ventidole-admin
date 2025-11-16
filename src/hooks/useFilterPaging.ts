import queryString from 'query-string';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PagingREQ, initialPagingState } from '@/types/paging.type';
import { addUndefined, removeEmptyParams } from '@/utils/params.helper';
import { debounce } from '@/utils/func.helper';

export type PagingFilterType<T> = {
  initialPaging?: PagingREQ;
  initialFilter?: T;
  debounceTime?: number;
  replace?: boolean;
};

export function useFilterPaging<T extends object>({
  initialPaging = initialPagingState,
  initialFilter,
  debounceTime = 0,
  replace = false,
}: PagingFilterType<T>) {
  const [filter, setFilter] = useState<T & PagingREQ>({
    ...initialPaging,
    ...initialFilter,
  } as T & PagingREQ);

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleFilterChange = debounce((filter: T) => {
    setFilter((prev) => {
      const newFilter = { ...prev, ...addUndefined(filter), offset: 0 };
      return newFilter;
    });
  }, debounceTime);

  const handlePageChange = (paging: { offset?: number; size?: number }) => {
    const newParams = { ...filter, ...paging };
    setFilter(newParams);
  };

  const resetFilterPaging = (obj?: T) => {
    setFilter({
      ...initialPaging,
      ...obj,
    } as T & PagingREQ);
  };

  useEffect(() => {
    navigate(
      `${pathname}?${queryString.stringify({
        ...removeEmptyParams<T & PagingREQ>(filter),
      })}`,
      { replace },
    );
  }, [filter]);

  return {
    filter,
    handleFilterChange,
    handlePageChange,
    resetFilterPaging,
  };
}
