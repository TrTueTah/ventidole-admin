import { useQuery } from '@tanstack/react-query';
import { BaseResponse } from '@/types/response.type';
import { CommunityDto } from '@/types/community/community.dto';
import { getCommunityByIdAPI } from '@/api/community.api';

export const COMMUNITY_QUERY_KEY = 'community';

export const useCommunityQuery = (id: string, enabled: boolean = true) => {
  return useQuery<BaseResponse<CommunityDto>>({
    queryKey: [COMMUNITY_QUERY_KEY, id],
    queryFn: () => getCommunityByIdAPI(id),
    enabled: enabled && !!id,
  });
};
