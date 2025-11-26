import { useQuery } from '@tanstack/react-query';
import { getIdolsAPI } from '@/api/idol.api';
import { IdolListREQ } from '@/types/idol/idol.req';
import { IdolListRESP } from '@/types/idol/idol.res';
import { PagingBaseRESP } from '@/types/response.type';

export const IDOLS_QUERY_KEY = 'idols';

export const useIdolsQuery = (params: IdolListREQ) => {
  return useQuery<PagingBaseRESP<IdolListRESP[]>>({
    queryKey: [IDOLS_QUERY_KEY, params],
    queryFn: () => getIdolsAPI(params),
  });
};
