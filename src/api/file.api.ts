import { ENDPOINTS } from '@/constants/api.constant';
import { BaseResponse } from '@/types/response.type';
import { api } from './api-client';
import { UploadFileRESP } from '@/types/file/file.res';

export const uploadFileAPI = async (
  data: FormData
): Promise<BaseResponse<UploadFileRESP>> => {
  return await api.post(
    `${process.env.NEXT_PUBLIC_API_URL}${ENDPOINTS.FILE.get('UPLOAD')}`,
    data,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    }
  );
};
