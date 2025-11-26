import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AccountState {
  id: string | null;
  name: string | null;
  email: string | null;
  isLoggedIn: boolean;
  setAccount: (id: string, name: string, email: string) => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  clearAccount: () => void;
}

export const useAccountStore = create<AccountState>()(
  persist(
    (set) => ({
      id: null,
      name: null,
      email: null,
      isLoggedIn: false,
      setAccount: (id: string, name: string, email: string) =>
        set({ id, name, email, isLoggedIn: true }),
      setIsLoggedIn: (isLoggedIn: boolean) => set({ isLoggedIn }),
      clearAccount: () =>
        set({ id: null, name: null, email: null, isLoggedIn: false }),
    }),
    {
      name: 'account-storage',
    }
  )
);
