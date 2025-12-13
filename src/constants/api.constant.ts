import {
  AuthenticationEndpoints,
  Endpoint,
  FileEndpoints,
} from '@/enums/api.enum';

const buildEndpoint = (base: string, path?: string | number) => {
  return path ? `/${base}/${path}` : `/${base}`;
};

export const ENDPOINTS = {
  AUTHENTICATION: {
    _: Endpoint.AUTHENTICATION,
    LOGIN: AuthenticationEndpoints.LOGIN,
    SIGN_UP: AuthenticationEndpoints.SIGN_UP,
    get(key: keyof typeof AuthenticationEndpoints) {
      return buildEndpoint(this._, this[key]);
    },
  },
  USER: {
    _: Endpoint.USER,
    get(path?: string | number) {
      return buildEndpoint(this._, path);
    },
  },
  COMMUNITY: {
    _: Endpoint.COMMUNITY,
    get(path?: string | number) {
      return buildEndpoint(this._, path);
    },
  },
  PRODUCT: {
    _: Endpoint.PRODUCT,
    get(path?: string | number) {
      return buildEndpoint(this._, path);
    },
  },
  FILE: {
    _: Endpoint.FILE,
    UPLOAD: FileEndpoints.UPLOAD,
    get(key: keyof typeof FileEndpoints) {
      return buildEndpoint(this._, this[key]);
    },
  },
  SHOP: {
    _: Endpoint.SHOP,
    get(path?: string | number) {
      return buildEndpoint(this._, path);
    },
  },
  ORDER: {
    _: Endpoint.ORDER,
    get(path?: string | number) {
      return buildEndpoint(this._, path);
    },
  },
};
