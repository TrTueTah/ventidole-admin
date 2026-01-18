import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AccountRole } from '@/enums/role.enum';

export interface AccountState {
  id: string | null;
  name: string | null;
  email: string | null;
  role: AccountRole | null;
  isLoggedIn: boolean;
  setAccount: (
    id: string,
    name: string,
    email: string,
    role: AccountRole
  ) => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  clearAccount: () => void;
}

export const useAccountStore = create<AccountState>()(
  persist(
    (set) => ({
      id: null,
      name: null,
      email: null,
      role: null,
      isLoggedIn: false,
      setAccount: (
        id: string,
        name: string,
        email: string,
        role: AccountRole
      ) => set({ id, name, email, role, isLoggedIn: true }),
      setIsLoggedIn: (isLoggedIn: boolean) => set({ isLoggedIn }),
      clearAccount: () =>
        set({
          id: null,
          name: null,
          email: null,
          role: null,
          isLoggedIn: false,
        }),
    }),
    {
      name: 'account-storage',
    }
  )
);
