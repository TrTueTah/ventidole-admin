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
  IDOL: {
    _: Endpoint.IDOL,
    get() {
      return buildEndpoint(this._);
    },
  },
  GROUP: {
    _: Endpoint.GROUP,
    get() {
      return buildEndpoint(this._);
    },
  },
  PRODUCT: {
    _: Endpoint.PRODUCT,
    get() {
      return buildEndpoint(this._);
    },
  },
  FILE: {
    _: Endpoint.FILE,
    UPLOAD: FileEndpoints.UPLOAD,
    get(key: keyof typeof FileEndpoints) {
      return buildEndpoint(this._, this[key]);
    },
  },
};
