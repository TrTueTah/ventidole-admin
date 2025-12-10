import { CreatedIdolDto, IdolDto } from './user.dto';

export type IdolListRESP = IdolDto;

export type CreateIdolRESP = {
  userId: string;
  email: string;
  role: string;
  idol: CreatedIdolDto;
  accessToken: string;
  refreshToken: string;
};
