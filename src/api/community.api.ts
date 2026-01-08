import { CommunityDto } from '@/types/community/community.dto';
import {
  GetCommunitiesREQ,
  CreateCommunityREQ,
  UpdateCommunityREQ,
} from '@/types/community/community.req';
import { PagingBaseRESP, BaseResponse } from '@/types/response.type';
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

export const getCommunityByIdAPI = async (
  id: string
): Promise<BaseResponse<CommunityDto>> => {
  return await api.get(
    `${process.env.NEXT_PUBLIC_API_URL}${ENDPOINTS.COMMUNITY.get(id)}`
  );
};

export const createCommunityAPI = async (
  data: CreateCommunityREQ
): Promise<BaseResponse<CommunityDto>> => {
  return await api.post(
    `${process.env.NEXT_PUBLIC_API_URL}${ENDPOINTS.COMMUNITY.get()}`,
    data
  );
};

export const updateCommunityAPI = async (
  id: string,
  data: UpdateCommunityREQ
): Promise<BaseResponse<CommunityDto>> => {
  return await api.patch(
    `${process.env.NEXT_PUBLIC_API_URL}${ENDPOINTS.COMMUNITY.get(id)}`,
    data
  );
};
