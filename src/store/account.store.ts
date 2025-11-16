import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type AccountInfo = {
  userId: string;
  name: string;
  email: string;
};

export type AccountState = {
  accountInfo: AccountInfo;
  setAccountInfo: (accountInfo: AccountInfo) => void;
  isLoggedIn?: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
};

export const useAccountStore = create(
  persist(
    (set) => ({
      accountInfo: {} as AccountInfo,
      setAccountInfo: (accountInfo: AccountInfo) => set({ accountInfo }),
      isLoggedIn: undefined,
      setIsLoggedIn: (isLoggedIn: boolean) => set({ isLoggedIn }),
    }),
    {
      name: 'account-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
