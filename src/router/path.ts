import { Path } from '@/enums/path.enum';

// const buildPath = (base: string, path?: string | number) => {
//   return path ? `/${base}/${path}` : `/${base}`;
// };

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
    get() {
      return `/${this._}`;
    },
  },
};
