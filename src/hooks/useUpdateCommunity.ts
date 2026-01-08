import { useMutation } from '@tanstack/react-query';
import { UpdateCommunityREQ } from '@/types/community/community.req';
import { updateCommunityAPI } from '@/api/community.api';

export const useUpdateCommunity = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCommunityREQ }) =>
      updateCommunityAPI(id, data),
  });
};
