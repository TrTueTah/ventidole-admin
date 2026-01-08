import { useMutation, useQueryClient } from '@tanstack/react-query';
import { banPostAPI } from '@/api/post.api';
import { POSTS_QUERY_KEY } from './usePostsQuery';
import { REPORTED_POSTS_QUERY_KEY } from './useReportedPostsQuery';
import { POST_QUERY_KEY } from './usePostQuery';

export const useBanPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => banPostAPI(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [POSTS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [REPORTED_POSTS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [POST_QUERY_KEY] });
    },
  });
};
