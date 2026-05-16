import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuthStore } from "../stores/useAuthStore";
import type { ThemeTemplate, DisplayCondition } from "../types/theme-builder";

export function useTemplates(websiteId?: string) {
  const [templates, setTemplates] = useState<ThemeTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  const fetchTemplates = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      let query = supabase
        .from('templates')
        .select('*')
        .order('priority', { ascending: false });

      if (websiteId) {
        query = query.eq('website_id', websiteId);
      }

      const { data, error } = await query;

      if (error) {
        setError(error.message);
      } else {
        setTemplates((data as any) || []);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, [user, websiteId]);

  const addTemplate = async (template: Partial<ThemeTemplate>) => {
    const { data, error } = await supabase
      .from('templates')
      .insert([template])
      .select()
      .single();

    if (error) throw error;
    setTemplates([(data as any), ...templates]);
    return data;
  };

  const updateTemplate = async (id: string, updates: Partial<ThemeTemplate>) => {
    const { data, error } = await supabase
      .from('templates')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    setTemplates(templates.map(t => t.id === id ? { ...t, ...(data as any) } : t));
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

  const duplicateTemplate = async (id: string) => {
    const source = templates.find(t => t.id === id);
    if (!source) return;

    const { id: _, created_at: __, updated_at: ___, ...rest } = source;
    return addTemplate({
      ...rest,
      name: `${source.name} (Copy)`,
      status: 'draft',
      is_active: false
    });
  };

  const updateConditions = async (id: string, conditions: DisplayCondition[]) => {
    return updateTemplate(id, { conditions });
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    return updateTemplate(id, { is_active: isActive });
  };

  return { 
    templates, 
    loading, 
    error, 
    fetchTemplates, 
    addTemplate, 
    updateTemplate, 
    deleteTemplate, 
    duplicateTemplate,
    updateConditions,
    toggleActive
  };
}
