import { orUndefined } from '@/utils/type.helper';
import { IdolListREQ } from './idol.req';

export function idolManagementListParamToFilter({ searchParams }: { searchParams: URLSearchParams }): IdolListREQ {
  return {
    search: orUndefined(searchParams.get('search')),
  } as IdolListREQ;
}