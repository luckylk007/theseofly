import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuthStore } from "../stores/useAuthStore";

export function usePages(websiteId?: string) {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  const fetchPages = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      let query = supabase
        .from('pages')
        .select('*, seo_metadata(*)')
        .order('updated_at', { ascending: false });

      if (websiteId) {
        query = query.eq('website_id', websiteId);
      }

      const { data, error } = await query;

      if (error) {
        setError(error.message);
      } else {
        setPages(data || []);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, [user, websiteId]);

  const addPage = async (page: any) => {
    const { data, error } = await supabase
      .from('pages')
      .insert([page])
      .select()
      .single();

    if (error) throw error;
    setPages([data, ...pages]);
    return data;
  };

  const updatePage = async (id: string, updates: any) => {
    const { data, error } = await supabase
      .from('pages')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    setPages(pages.map(p => p.id === id ? { ...p, ...(data as any) } : p));
    return data;
  };

  const deletePage = async (id: string) => {
    const { error } = await supabase
      .from('pages')
      .delete()
      .eq('id', id);

    if (error) throw error;
    setPages(pages.filter(p => p.id !== id));
  };

  const bulkUpdatePages = async (ids: string[], updates: any) => {
    const { data, error } = await supabase
      .from('pages')
      .update(updates)
      .in('id', ids)
      .select();

    if (error) throw error;
    setPages(pages.map(p => ids.includes(p.id) ? { ...p, ...updates } : p));
    return data;
  };

  const bulkDeletePages = async (ids: string[]) => {
    const { error } = await supabase
      .from('pages')
      .delete()
      .in('id', ids);

    if (error) throw error;
    setPages(pages.filter(p => !ids.includes(p.id)));
  };

  return { pages, loading, error, fetchPages, addPage, updatePage, deletePage, bulkUpdatePages, bulkDeletePages };
}
