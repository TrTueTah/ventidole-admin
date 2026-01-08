import { useQuery } from '@tanstack/react-query';
import { BaseResponse } from '@/types/response.type';
import { PostDetailDto } from '@/types/post/post.dto';
import { getPostByIdAPI } from '@/api/post.api';

export const POST_QUERY_KEY = 'post';

export const usePostQuery = (id: string) => {
  return useQuery<BaseResponse<PostDetailDto>>({
    queryKey: [POST_QUERY_KEY, id],
    queryFn: () => getPostByIdAPI(id),
    enabled: !!id,
  });
};
