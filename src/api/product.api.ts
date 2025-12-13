import { BaseResponse, PagingBaseRESP } from '@/types/response.type';
import { ProductDto } from '@/types/product/product.dto';
import {
  CreateProductREQ,
  GetProductsREQ,
  UpdateProductREQ,
} from '@/types/product/product.req';
import { api } from './api-client';
import { ENDPOINTS } from '@/constants/api.constant';

export const getProductsAPI = async (
  data: GetProductsREQ
): Promise<PagingBaseRESP<ProductDto[]>> => {
  return await api.get(
    `${process.env.NEXT_PUBLIC_API_URL}${ENDPOINTS.PRODUCT.get()}`,
    { params: data }
  );
};

export const getProductByIdAPI = async (
  id: string
): Promise<BaseResponse<ProductDto>> => {
  return await api.get(
    `${process.env.NEXT_PUBLIC_API_URL}${ENDPOINTS.PRODUCT.get(id)}`
  );
};

export const createProductAPI = async (
  data: CreateProductREQ
): Promise<BaseResponse<ProductDto>> => {
  return await api.post(
    `${process.env.NEXT_PUBLIC_API_URL}${ENDPOINTS.PRODUCT.get()}`,
    data
  );
};

export const updateProductAPI = async (
  id: string,
  data: UpdateProductREQ
): Promise<BaseResponse<ProductDto>> => {
  return await api.patch(
    `${process.env.NEXT_PUBLIC_API_URL}${ENDPOINTS.PRODUCT.get(id)}`,
    data
  );
};
