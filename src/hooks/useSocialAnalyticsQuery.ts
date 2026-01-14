import { useQuery } from '@tanstack/react-query';
import { BaseResponse } from '@/types/response.type';
import { AnalyticsFilterREQ } from '@/types/analytics/analytics.req';
import { SocialAnalyticsDto } from '@/types/analytics/analytics.dto';
import { getSocialAnalyticsAPI } from '@/api/analytics.api';

export const SOCIAL_ANALYTICS_QUERY_KEY = 'social-analytics';

export const useSocialAnalyticsQuery = (params: AnalyticsFilterREQ) => {
  return useQuery<BaseResponse<SocialAnalyticsDto>>({
    queryKey: [SOCIAL_ANALYTICS_QUERY_KEY, params],
    queryFn: () => getSocialAnalyticsAPI(params),
  });
};
