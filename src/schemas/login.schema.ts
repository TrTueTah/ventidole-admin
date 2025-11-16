import { LoginREQ } from "@/services/auth/auth.req";
import { Rule } from "antd/es/form";

export const getLoginSchema = (): Record<keyof LoginREQ, Rule[]> => {
  return {
    email: [
      { required: true, message: 'Email is required' },
      { type: 'email', message: 'Please enter a valid email address' },
    ],
    password: [
      { required: true, message: 'Password is required' },
      // { min: 6, max: 20, message: tValidate('password_length', { min: 6, max: 20 }) },
    ],
  };
};