import { BaseResponse, PagingBaseRESP } from '@/types/response.type';
import { BannerDto, BannerDetailDto } from '@/types/banner/banner.dto';
import {
  CreateBannerREQ,
  GetBannersREQ,
  UpdateBannerREQ,
} from '@/types/banner/banner.req';
import { api } from './api-client';
import { ENDPOINTS } from '@/constants/api.constant';

export const getBannersAPI = async (
  data: GetBannersREQ
): Promise<PagingBaseRESP<BannerDto[]>> => {
  return await api.get(
    `${process.env.NEXT_PUBLIC_API_URL}${ENDPOINTS.BANNER.get()}`,
    { params: data }
  );
};

export const getBannerByIdAPI = async (
  id: string
): Promise<BaseResponse<BannerDetailDto>> => {
  return await api.get(
    `${process.env.NEXT_PUBLIC_API_URL}${ENDPOINTS.BANNER.get(id)}`
  );
};

export const createBannerAPI = async (
  data: CreateBannerREQ
): Promise<BaseResponse<BannerDto>> => {
  return await api.post(
    `${process.env.NEXT_PUBLIC_API_URL}${ENDPOINTS.BANNER.get()}`,
    data
  );
};

export const updateBannerAPI = async (
  id: string,
  data: UpdateBannerREQ
): Promise<BaseResponse<BannerDto>> => {
  return await api.patch(
    `${process.env.NEXT_PUBLIC_API_URL}${ENDPOINTS.BANNER.get(id)}`,
    data
  );
};

export const deleteBannerAPI = async (
  id: string
): Promise<BaseResponse<null>> => {
  return await api.delete(
    `${process.env.NEXT_PUBLIC_API_URL}${ENDPOINTS.BANNER.get(id)}`
  );
};
