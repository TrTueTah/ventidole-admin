import { useQuery } from '@tanstack/react-query';
import { PagingBaseRESP } from '@/types/response.type';
import { GetBannersREQ } from '@/types/banner/banner.req';
import { BannerDto } from '@/types/banner/banner.dto';
import { getBannersAPI } from '@/api/banner.api';

export const BANNERS_QUERY_KEY = 'banners';

export const useBannersQuery = (params: GetBannersREQ) => {
  return useQuery<PagingBaseRESP<BannerDto[]>>({
    queryKey: [BANNERS_QUERY_KEY, params],
    queryFn: () => getBannersAPI(params),
  });
};
