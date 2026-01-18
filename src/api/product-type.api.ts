import { BaseResponse, PagingBaseRESP } from '@/types/response.type';
import { ProductTypeDto } from '@/types/product-type/product-type.dto';
import {
  CreateProductTypeREQ,
  GetProductTypesREQ,
  UpdateProductTypeREQ,
} from '@/types/product-type/product-type.req';
import { api } from './api-client';
import { ENDPOINTS } from '@/constants/api.constant';

export const getProductTypesAPI = async (
  data: GetProductTypesREQ
): Promise<PagingBaseRESP<ProductTypeDto[]>> => {
  return await api.get(
    `${process.env.NEXT_PUBLIC_API_URL}${ENDPOINTS.PRODUCT_TYPE.get()}`,
    { params: data }
  );
};

export const getProductTypeByIdAPI = async (
  id: string
): Promise<BaseResponse<ProductTypeDto>> => {
  return await api.get(
    `${process.env.NEXT_PUBLIC_API_URL}${ENDPOINTS.PRODUCT_TYPE.get(id)}`
  );
};

export const createProductTypeAPI = async (
  data: CreateProductTypeREQ
): Promise<BaseResponse<ProductTypeDto>> => {
  return await api.post(
    `${process.env.NEXT_PUBLIC_API_URL}${ENDPOINTS.PRODUCT_TYPE.get()}`,
    data
  );
};

export const updateProductTypeAPI = async (
  id: string,
  data: UpdateProductTypeREQ
): Promise<BaseResponse<ProductTypeDto>> => {
  return await api.patch(
    `${process.env.NEXT_PUBLIC_API_URL}${ENDPOINTS.PRODUCT_TYPE.get(id)}`,
    data
  );
};

export const deleteProductTypeAPI = async (
  id: string
): Promise<BaseResponse<void>> => {
  return await api.delete(
    `${process.env.NEXT_PUBLIC_API_URL}${ENDPOINTS.PRODUCT_TYPE.get(id)}`
  );
};
