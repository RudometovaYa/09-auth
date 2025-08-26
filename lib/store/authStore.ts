/* import { create } from 'zustand';
import { User } from '../api/api';

type AuthStore = {
  isAuth: boolean;
  user: User | null;
  setAuth: (user: User) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthStore>()((set) => ({
  isAuth: false,
  user: null,
  setAuth: (user: User) => set({ isAuth: true, user }),
  clearAuth: () => set({ isAuth: false, user: null }),
}));
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id?: string;
  username: string;
  email: string;
  avatar: string;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  setIsAuthenticated: () => void;
  clearIsAuthenticated: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      setUser: (user) => set({ user, isAuthenticated: true }),
      setIsAuthenticated: () => set({ isAuthenticated: true }),
      clearIsAuthenticated: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-store',
    },
  ),
);
