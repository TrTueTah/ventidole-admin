import { useMutation } from '@tanstack/react-query';
import { CreateCommunityREQ } from '@/types/community/community.req';
import { createCommunityAPI } from '@/api/community.api';

export const useCreateCommunity = () => {
  return useMutation({
    mutationFn: (data: CreateCommunityREQ) => createCommunityAPI(data),
  });
};
