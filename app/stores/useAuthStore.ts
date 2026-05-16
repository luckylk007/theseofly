import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  profile: any | null;
  loading: boolean;
  initialized: boolean;
  setUser: (user: User | null) => void;
  setProfile: (profile: any | null) => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  loading: true,
  initialized: false,
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile, loading: false }),
  setLoading: (loading) => set({ loading }),
  setInitialized: (initialized) => set({ initialized }),
  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, profile: null, loading: false, initialized: true });
  },
}));
