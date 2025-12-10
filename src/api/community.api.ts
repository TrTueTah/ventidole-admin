import { CommunityDto } from '@/types/community/community.dto';
import { GetCommunitiesREQ } from '@/types/community/community.req';
import { PagingBaseRESP } from '@/types/response.type';
import { api } from './api-client';
import { ENDPOINTS } from '@/constants/api.constant';

export const getCommunitiesAPI = async (
  data: GetCommunitiesREQ
): Promise<PagingBaseRESP<CommunityDto[]>> => {
  return await api.get(
    `${process.env.NEXT_PUBLIC_API_URL}${ENDPOINTS.COMMUNITY.get()}`,
    { params: data }
  );
};
