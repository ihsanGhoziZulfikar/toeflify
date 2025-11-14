import { create } from 'zustand';
import { createSupabaseBrowserClient } from '../supabase/client';

export type Profile = {
  id: string;
  full_name: string;
  email: string;
};

interface UserState {
  profile: Profile | null;
  isLoading: boolean;
  fetchProfile: () => Promise<void>;
  setProfile: (profile: Profile) => void;
  clearProfile: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  isLoading: true,

  fetchProfile: async () => {
    set({ isLoading: true });
    const supabase = createSupabaseBrowserClient();
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError || !user) {
        throw authError || new Error('No user found');
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      set({ profile: data, isLoading: false });
    } catch (error) {
      console.log(error);

      set({ profile: null, isLoading: false });
    }
  },

  setProfile: (profile: Profile) => {
    set({ profile: profile, isLoading: false });
  },

  clearProfile: () => {
    set({ profile: null, isLoading: false });
  },
}));
