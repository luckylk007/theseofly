import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuthStore } from "../stores/useAuthStore";

export function useUsers() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  const fetchProfiles = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setProfiles(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfiles();
  }, [user]);

  const updateProfile = async (id: string, updates: { full_name?: string, avatar_url?: string, role?: 'admin' | 'editor' | 'author' }) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    setProfiles(profiles.map(p => p.id === id ? data : p));
    return data;
  };

  const updateProfileRole = async (id: string, role: 'admin' | 'editor' | 'author') => {
    return updateProfile(id, { role });
  };

  return { profiles, loading, error, fetchProfiles, updateProfileRole, updateProfile };
}
