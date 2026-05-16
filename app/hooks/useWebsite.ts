import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuthStore } from "../stores/useAuthStore";

export function useWebsite() {
  const [website, setWebsite] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  const fetchWebsite = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('websites')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        setError(error.message);
      } else {
        setWebsite(data || null);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWebsite();
  }, [user]);

  const updateWebsite = async (updates: any) => {
    if (!website) return;
    const { data, error } = await supabase
      .from('websites')
      .update(updates)
      .eq('id', website.id)
      .select()
      .single();

    if (error) throw error;
    setWebsite(data);
    return data;
  };

  return { website, loading, error, fetchWebsite, updateWebsite };
}
