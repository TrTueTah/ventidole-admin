import { Path, UserManagementPath } from '@/enums/path.enum';

const buildPath = (base: string, path?: string | number) => {
  return path ? `/${base}/${path}` : `/${base}`;
};

export const PATH = {
  MAIN: Path.MAIN,
  CALENDAR: {
    _: Path.CALENDAR,
  },
  PROFILE: {
    _: Path.PROFILE,
  },
  USER_MANAGEMENT: {
    _: Path.USER_MANAGEMENT,
    ...UserManagementPath,
    get(key?: keyof typeof UserManagementPath) {
      return buildPath(this._, key ? this[key] : '');
    },
  },
};
