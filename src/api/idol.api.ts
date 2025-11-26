import { CreateIdolREQ, IdolListREQ } from '@/types/idol/idol.req';
import { api } from './api-client';
import { ENDPOINTS } from '@/constants/api.constant';
import { CreateIdolRESP, IdolListRESP } from '@/types/idol/idol.res';
import { BaseResponse, PagingBaseRESP } from '@/types/response.type';

export const getIdolsAPI = async (
  data: IdolListREQ
): Promise<PagingBaseRESP<IdolListRESP[]>> => {
  return await api.get(
    `${process.env.NEXT_PUBLIC_API_URL}${ENDPOINTS.IDOL.get()}`,
    { params: data }
  );
};

export const createIdolAPI = async (
  data: CreateIdolREQ
): Promise<BaseResponse<CreateIdolRESP>> => {
  return await api.post(
    `${process.env.NEXT_PUBLIC_API_URL}${ENDPOINTS.IDOL.get()}`,
    data
  );
};
