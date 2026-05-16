import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuthStore } from "../stores/useAuthStore";

export function useWebsites() {
  const [websites, setWebsites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  const fetchWebsites = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('websites')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setWebsites(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWebsites();
  }, [user]);

  const addWebsite = async (website: { name: string, domain: string, description?: string }) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('websites')
      .insert([{ ...website, owner_id: user.id }])
      .select()
      .single();

    if (error) throw error;
    setWebsites([data, ...websites]);
    return data;
  };

  const deleteWebsite = async (id: string) => {
    const { error } = await supabase
      .from('websites')
      .delete()
      .eq('id', id);

    if (error) throw error;
    setWebsites(websites.filter(w => w.id !== id));
  };

  const updateWebsite = async (id: string, updates: any) => {
    const { data, error } = await supabase
      .from('websites')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    setWebsites(websites.map(w => w.id === id ? data : w));
    return data;
  };

  return { websites, loading, error, fetchWebsites, addWebsite, updateWebsite, deleteWebsite };
}
