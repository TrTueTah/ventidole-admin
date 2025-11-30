import { CreateIdolREQ, IdolListREQ, UpdateIdolREQ } from '@/types/idol/idol.req';
import { api } from './api-client';
import { ENDPOINTS } from '@/constants/api.constant';
import { CreateIdolRESP, IdolListRESP } from '@/types/idol/idol.res';
import { BaseResponse, PagingBaseRESP } from '@/types/response.type';
import { IdolDto } from '@/types/idol/idol.dto';

export const getIdolsAPI = async (
  data: IdolListREQ
): Promise<PagingBaseRESP<IdolListRESP[]>> => {
  return await api.get(
    `${process.env.NEXT_PUBLIC_API_URL}${ENDPOINTS.IDOL.get()}`,
    { params: data }
  );
};

export const getIdolByIdAPI = async (
  id: string
): Promise<BaseResponse<IdolDto>> => {
  return await api.get(
    `${process.env.NEXT_PUBLIC_API_URL}${ENDPOINTS.IDOL.get(id)}`
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

export const updateIdolAPI = async (
  id: string,
  data: UpdateIdolREQ
): Promise<BaseResponse<IdolDto>> => {
  return await api.patch(
    `${process.env.NEXT_PUBLIC_API_URL}${ENDPOINTS.IDOL.get(id)}`,
    data
  );
};
