export type Nil<T> = T | null | undefined;

export const orUndefined = (value?: any) => value || undefined;
