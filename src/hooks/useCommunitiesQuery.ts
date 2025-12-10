import { useQuery } from '@tanstack/react-query';
import { PagingBaseRESP } from '@/types/response.type';
import { GetCommunitiesREQ } from '@/types/community/community.req';
import { CommunityDto } from '@/types/community/community.dto';
import { getCommunitiesAPI } from '@/api/community.api';

export const COMMUNITIES_QUERY_KEY = 'communities';

export const useCommunitiesQuery = (params: GetCommunitiesREQ) => {
  return useQuery<PagingBaseRESP<CommunityDto[]>>({
    queryKey: [COMMUNITIES_QUERY_KEY, params],
    queryFn: () => getCommunitiesAPI(params),
  });
};
