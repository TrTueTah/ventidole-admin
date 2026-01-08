import { useQuery } from '@tanstack/react-query';
import { PagingBaseRESP } from '@/types/response.type';
import { GetPostsREQ } from '@/types/post/post.req';
import { PostDto } from '@/types/post/post.dto';
import { getPostsAPI } from '@/api/post.api';

export const POSTS_QUERY_KEY = 'posts';

export const usePostsQuery = (params: GetPostsREQ) => {
  return useQuery<PagingBaseRESP<PostDto[]>>({
    queryKey: [POSTS_QUERY_KEY, params],
    queryFn: () => getPostsAPI(params),
  });
};
