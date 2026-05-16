import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface WebsiteState {
  website: any | null;
  loading: boolean;
  error: string | null;
  fetchWebsite: (user: any) => Promise<void>;
  updateWebsite: (updates: any) => Promise<any>;
}

export const useWebsiteStore = create<WebsiteState>((set, get) => ({
  website: null,
  loading: true,
  error: null,

  fetchWebsite: async (user) => {
    const { website, loading } = get();
    if (!user) {
      set({ loading: false });
      return;
    }

    // Prevent redundant fetches if already loaded or loading
    if (website || (loading && website === null && get().error === null)) {
      // If we are already in initial loading or have data, don't restart
      if (website) set({ loading: false });
      return;
    }
    
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('websites')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        set({ error: error.message, website: null, loading: false });
      } else {
        set({ website: data || null, loading: false });
      }
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  updateWebsite: async (updates) => {
    const { website } = get();
    if (!website) throw new Error("No website loaded to update.");

    const { data, error } = await supabase
      .from('websites')
      .update(updates)
      .eq('id', website.id)
      .select()
      .single();

    if (error) throw error;
    set({ website: data });
    return data;
  }
}));
