import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBannerAPI, updateBannerAPI } from '@/api/banner.api';
import { CreateBannerREQ, UpdateBannerREQ } from '@/types/banner/banner.req';
import { BANNERS_QUERY_KEY } from './useBannersQuery';
import { BANNER_QUERY_KEY } from './useBannerQuery';

export const useCreateBanner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBannerREQ) => createBannerAPI(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BANNERS_QUERY_KEY] });
    },
  });
};

export const useUpdateBanner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBannerREQ }) =>
      updateBannerAPI(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [BANNERS_QUERY_KEY] });
      queryClient.invalidateQueries({
        queryKey: [BANNER_QUERY_KEY, variables.id],
      });
    },
  });
};
