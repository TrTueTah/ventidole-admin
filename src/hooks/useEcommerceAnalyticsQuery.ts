import { useQuery } from '@tanstack/react-query';
import { BaseResponse } from '@/types/response.type';
import { AnalyticsFilterREQ } from '@/types/analytics/analytics.req';
import { EcommerceAnalyticsDto } from '@/types/analytics/analytics.dto';
import { getEcommerceAnalyticsAPI } from '@/api/analytics.api';

export const ECOMMERCE_ANALYTICS_QUERY_KEY = 'ecommerce-analytics';

export const useEcommerceAnalyticsQuery = (params: AnalyticsFilterREQ) => {
  return useQuery<BaseResponse<EcommerceAnalyticsDto>>({
    queryKey: [ECOMMERCE_ANALYTICS_QUERY_KEY, params],
    queryFn: () => getEcommerceAnalyticsAPI(params),
  });
};
