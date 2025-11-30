import { CommunityListREQ } from '@/types/community/community.req';
import { api } from './api-client';
import { ENDPOINTS } from '@/constants/api.constant';
import { CommunityListRESP } from '@/types/community/community.res';
import { PagingBaseRESP } from '@/types/response.type';

export const getCommunitiesAPI = async (
  data: CommunityListREQ
): Promise<PagingBaseRESP<CommunityListRESP[]>> => {
  return await api.get(
    `${process.env.NEXT_PUBLIC_API_URL}${ENDPOINTS.COMMUNITY.get()}`,
    { params: data }
  );
};
