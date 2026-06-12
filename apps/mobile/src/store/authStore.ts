import { create } from 'zustand';
import type { User, UserProfile } from '@ailearningapp/types';

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  onboardingComplete: boolean;
  token: string | null;
  setUser: (user: User, profile?: UserProfile, token?: string) => void;
  setProfile: (profile: UserProfile) => void;
  setOnboardingComplete: (complete: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  isAuthenticated: false,
  onboardingComplete: false,
  token: null,

  setUser: (user, profile, token) =>
    set({
      user,
      profile: profile ?? null,
      isAuthenticated: true,
      token: token ?? null,
    }),

  setProfile: (profile) => set({ profile }),

  setOnboardingComplete: (complete) => set({ onboardingComplete: complete }),

  logout: () =>
    set({
      user: null,
      profile: null,
      isAuthenticated: false,
      onboardingComplete: false,
      token: null,
    }),
}));
