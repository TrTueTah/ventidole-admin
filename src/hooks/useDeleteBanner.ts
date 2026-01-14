import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteBannerAPI } from '@/api/banner.api';
import { BANNERS_QUERY_KEY } from './useBannersQuery';

export const useDeleteBanner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteBannerAPI(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BANNERS_QUERY_KEY] });
    },
  });
};
