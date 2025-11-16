export const removeEmptyParams = <T extends object>(data: T): T => {
  const newData: Partial<T> = {};

  for (const key in data) {
    if ((data[key] && !['null', 'All'].includes(data[key] as string)) || data[key] === 0) {
      newData[key as keyof T] = data[key];
    }
  }

  return newData as T;
};

export const addUndefined = <T extends object>(data: T): T => {
  const newData: Partial<T> = {};

  for (const key in data) {
    newData[key as keyof T] = data[key] === 'All' || data[key] === '' ? undefined : data[key];
  }

  return newData as T;
};
