// TODO: Define IdolDto and CreatedIdolDto types if needed

export type IdolDto = {
  id: string;
  name: string;
};

export type CreatedIdolDto = {
  id: string;
  name: string;
};

export type IdolListRESP = IdolDto;

export type CreateIdolRESP = {
  userId: string;
  email: string;
  role: string;
  idol: CreatedIdolDto;
  accessToken: string;
  refreshToken: string;
};
