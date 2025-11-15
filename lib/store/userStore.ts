import { create } from 'zustand';
import { createSupabaseBrowserClient } from '../supabase/client';

export type Profile = {
  id: string;
  full_name: string;
  email: string;
  image_url?: string;
  level: string;
  score: number;
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

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, image_url, level, score')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      const combinedProfile: Profile = {
        id: user.id,
        full_name: profileData.full_name ?? user.user_metadata.full_name,
        image_url: profileData.image_url ?? user.user_metadata.avatar_url,
        level: profileData.level,
        score: profileData.score,
        email: user.email!,
      };

      set({ profile: combinedProfile, isLoading: false });
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
