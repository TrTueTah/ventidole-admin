import { BaseResponse } from '@/types/response.type';
import {
  EcommerceAnalyticsDto,
  SocialAnalyticsDto,
} from '@/types/analytics/analytics.dto';
import { AnalyticsFilterREQ } from '@/types/analytics/analytics.req';
import { api } from './api-client';
import { ENDPOINTS } from '@/constants/api.constant';

export const getEcommerceAnalyticsAPI = async (
  params: AnalyticsFilterREQ
): Promise<BaseResponse<EcommerceAnalyticsDto>> => {
  return await api.get(
    `${process.env.NEXT_PUBLIC_API_URL}${ENDPOINTS.ANALYTICS.get('ecommerce')}`,
    { params }
  );
};

export const getSocialAnalyticsAPI = async (
  params: AnalyticsFilterREQ
): Promise<BaseResponse<SocialAnalyticsDto>> => {
  return await api.get(
    `${process.env.NEXT_PUBLIC_API_URL}${ENDPOINTS.ANALYTICS.get('social')}`,
    { params }
  );
};
