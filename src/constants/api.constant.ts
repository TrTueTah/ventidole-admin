import { AuthenticationEndpoints, Endpoint } from "@/enums/api.enum";

const buildEndpoint = (base: string, path?: string | number) => {
  return path ? `/${base}/${path}` : `/${base}`;
};

export const ENDPOINTS = {
  AUTHENTICATION: {
    _: Endpoint.AUTHENTICATION,
    LOGIN: AuthenticationEndpoints.LOGIN,
    get(key: keyof typeof AuthenticationEndpoints) {
      return buildEndpoint(this._, this[key]);
    },
  }
}

