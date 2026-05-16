import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuthStore } from "../stores/useAuthStore";

export type TaxonomyType = 'category' | 'tag';

export interface Taxonomy {
  id: string;
  website_id: string;
  name: string;
  slug: string;
  type: TaxonomyType;
  description: string;
  created_at: string;
}

export function useTaxonomies(websiteId?: string, type?: TaxonomyType) {
  const [taxonomies, setTaxonomies] = useState<Taxonomy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  const fetchTaxonomies = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      let query = supabase
        .from('taxonomies')
        .select('*')
        .order('name', { ascending: true });

      if (websiteId) query = query.eq('website_id', websiteId);
      if (type) query = query.eq('type', type);

      const { data, error } = await query;

      if (error) {
        setError(error.message);
      } else {
        setTaxonomies((data as any) || []);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaxonomies();
  }, [user, websiteId, type]);

  const addTaxonomy = async (payload: Partial<Taxonomy>) => {
    const { data, error } = await supabase
      .from('taxonomies')
      .insert([payload])
      .select()
      .single();

    if (error) throw error;
    setTaxonomies([...taxonomies, data as any]);
    return data;
  };

  const updateTaxonomy = async (id: string, updates: Partial<Taxonomy>) => {
    const { data, error } = await supabase
      .from('taxonomies')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    setTaxonomies(taxonomies.map(t => t.id === id ? (data as any) : t));
    return data;
  };

  const deleteTaxonomy = async (id: string) => {
    const { error } = await supabase
      .from('taxonomies')
      .delete()
      .eq('id', id);

    if (error) throw error;
    setTaxonomies(taxonomies.filter(t => t.id !== id));
  };

  return { taxonomies, loading, error, fetchTaxonomies, addTaxonomy, updateTaxonomy, deleteTaxonomy };
}
