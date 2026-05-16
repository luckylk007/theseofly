import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuthStore } from "../stores/useAuthStore";

export function useTemplates(websiteId?: string) {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  const fetchTemplates = async () => {
    if (!user) return;
    
    setLoading(true);
    let query = supabase
      .from('templates')
      .select('*')
      .order('created_at', { ascending: false });

    if (websiteId) {
      query = query.eq('website_id', websiteId);
    }

    const { data, error } = await query;

    if (error) {
      setError(error.message);
    } else {
      setTemplates(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTemplates();
  }, [user, websiteId]);

  const addTemplate = async (template: any) => {
    const { data, error } = await supabase
      .from('templates')
      .insert([template])
      .select()
      .single();

    if (error) throw error;
    setTemplates([data, ...templates]);
    return data;
  };

  const deleteTemplate = async (id: string) => {
    const { error } = await supabase
      .from('templates')
      .delete()
      .eq('id', id);

    if (error) throw error;
    setTemplates(templates.filter(t => t.id !== id));
  };

  return { templates, loading, error, fetchTemplates, addTemplate, deleteTemplate };
}
