import { ENDPOINTS } from "@/constants/api.constant";
import { LoginREQ } from "@/services/auth/auth.req";
import { LoginRESP } from "@/services/auth/auth.res";
import { BaseResponse } from "@/types/response.type";
import axios from 'axios';

export const loginAPI = async (data: LoginREQ): Promise<BaseResponse<LoginRESP>> => {
  const response = await axios.post(`${import.meta.env.VITE_API_URL}${ENDPOINTS.AUTHENTICATION.get('LOGIN')}`, data);
  return response.data;
};