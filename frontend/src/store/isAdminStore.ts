import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface IsAdmin {
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
  logout: () => void;
}

export const isAdminStore = create(
  persist<IsAdmin>(
    (set) => ({
      isAdmin: false,
      setIsAdmin: (isAdmin) => set({ isAdmin }),
      logout: () => set({ isAdmin: false }),
    }),
    {
      name: 'admin-storage',
    }
  )
);