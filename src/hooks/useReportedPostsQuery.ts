import { useQuery } from '@tanstack/react-query';
import { PagingBaseRESP } from '@/types/response.type';
import { GetReportedPostsREQ } from '@/types/post/post.req';
import { ReportedPostDto } from '@/types/post/post.dto';
import { getReportedPostsAPI } from '@/api/post.api';

export const REPORTED_POSTS_QUERY_KEY = 'reported-posts';

export const useReportedPostsQuery = (params: GetReportedPostsREQ) => {
  return useQuery<PagingBaseRESP<ReportedPostDto[]>>({
    queryKey: [REPORTED_POSTS_QUERY_KEY, params],
    queryFn: () => getReportedPostsAPI(params),
  });
};
