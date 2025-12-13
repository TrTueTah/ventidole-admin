import { BaseResponse, PagingBaseRESP } from '@/types/response.type';
import { ShopDto } from '@/types/shop/shop.dto';
import {
  CreateShopREQ,
  GetShopsREQ,
  UpdateShopREQ,
} from '@/types/shop/shop.req';
import { api } from './api-client';
import { ENDPOINTS } from '@/constants/api.constant';

export const getShopsAPI = async (
  data: GetShopsREQ
): Promise<PagingBaseRESP<ShopDto[]>> => {
  return await api.get(
    `${process.env.NEXT_PUBLIC_API_URL}${ENDPOINTS.SHOP.get()}`,
    { params: data }
  );
};

export const getShopByIdAPI = async (
  id: string
): Promise<BaseResponse<ShopDto>> => {
  return await api.get(
    `${process.env.NEXT_PUBLIC_API_URL}${ENDPOINTS.SHOP.get(id)}`
  );
};

export const createShopAPI = async (
  data: CreateShopREQ
): Promise<BaseResponse<ShopDto>> => {
  return await api.post(
    `${process.env.NEXT_PUBLIC_API_URL}${ENDPOINTS.SHOP.get()}`,
    data
  );
};

export const updateShopAPI = async (
  id: string,
  data: UpdateShopREQ
): Promise<BaseResponse<ShopDto>> => {
  return await api.patch(
    `${process.env.NEXT_PUBLIC_API_URL}${ENDPOINTS.SHOP.get(id)}`,
    data
  );
};
