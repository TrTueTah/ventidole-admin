import { PostDto, PostDetailDto, ReportedPostDto } from '@/types/post/post.dto';
import {
  GetPostsREQ,
  GetReportedPostsREQ,
  CreatePostREQ,
  UpdatePostREQ,
} from '@/types/post/post.req';
import { PagingBaseRESP, BaseResponse } from '@/types/response.type';
import { api } from './api-client';
import { ENDPOINTS } from '@/constants/api.constant';

export const getPostsAPI = async (
  data: GetPostsREQ
): Promise<PagingBaseRESP<PostDto[]>> => {
  return await api.get(
    `${process.env.NEXT_PUBLIC_API_URL}${ENDPOINTS.POST.get()}`,
    { params: data }
  );
};

export const getReportedPostsAPI = async (
  data: GetReportedPostsREQ
): Promise<PagingBaseRESP<ReportedPostDto[]>> => {
  return await api.get(
    `${process.env.NEXT_PUBLIC_API_URL}${ENDPOINTS.POST.get(undefined, 'reported')}`,
    { params: data }
  );
};

export const getPostByIdAPI = async (
  id: string
): Promise<BaseResponse<PostDetailDto>> => {
  return await api.get(
    `${process.env.NEXT_PUBLIC_API_URL}${ENDPOINTS.POST.get(id)}`
  );
};

export const createPostAPI = async (
  data: CreatePostREQ
): Promise<BaseResponse<PostDto>> => {
  return await api.post(
    `${process.env.NEXT_PUBLIC_API_URL}${ENDPOINTS.POST.get()}`,
    data
  );
};

export const updatePostAPI = async (
  id: string,
  data: UpdatePostREQ
): Promise<BaseResponse<PostDto>> => {
  return await api.patch(
    `${process.env.NEXT_PUBLIC_API_URL}${ENDPOINTS.POST.get(id)}`,
    data
  );
};

export const banPostAPI = async (
  id: string
): Promise<BaseResponse<PostDto>> => {
  return await api.patch(
    `${process.env.NEXT_PUBLIC_API_URL}${ENDPOINTS.POST.get(id, 'ban')}`
  );
};

export const deletePostAPI = async (
  id: string
): Promise<BaseResponse<void>> => {
  return await api.delete(
    `${process.env.NEXT_PUBLIC_API_URL}${ENDPOINTS.POST.get(id)}`
  );
};
