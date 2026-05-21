import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuthStore } from "../stores/useAuthStore";
import type { CMSPage, ContentType, PostType } from "../types/cms";

export function usePages(websiteId?: string) {
  const [pages, setPages] = useState<CMSPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  const fetchPages = async () => {
    if (!user || !websiteId) {
      setPages([]);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      let query = supabase
        .from('pages')
        .select('*, seo_metadata(*), page_taxonomies(taxonomy:taxonomies(*))')
        .eq('website_id', websiteId)
        .order('updated_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        setError(error.message);
      } else {
        setPages(normalizePages((data as any[]) || []));
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
    const { taxonomy_ids = [], ...pagePayload } = page;
    
    // Ensure website_id is set
    const finalPayload = { ...pagePayload, website_id: websiteId };

    const { data, error } = await supabase
      .from('pages')
      .insert([finalPayload])
      .select()
      .single();

    if (error) throw error;
    const createdPage = data as any;

    if (taxonomy_ids.length > 0) {
      await syncPageTaxonomies(createdPage.id, taxonomy_ids);
    }

    await fetchPages();
    return createdPage;
  };

  const bulkAddPages = async (pagesData: any[]) => {
    const inserts = pagesData.map(({ taxonomy_ids, ...page }) => ({
      ...page,
      website_id: websiteId
    }));
    const { data, error } = await supabase
      .from('pages')
      .insert(inserts)
      .select();

    if (error) throw error;

    if (data) {
      await Promise.all(
        (data as any[]).map((createdPage: any, index) => {
          const taxonomyIds = pagesData[index]?.taxonomy_ids || [];
          if (taxonomyIds.length === 0) {
            return Promise.resolve();
          }

          return syncPageTaxonomies(createdPage.id, taxonomyIds);
        })
      );
    }

    await fetchPages();
    return data;
  };

  const updatePage = async (id: string, updates: any) => {
    const { taxonomy_ids, ...pageUpdates } = updates;
    const { data, error } = await supabase
      .from('pages')
      .update(pageUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    if (Array.isArray(taxonomy_ids)) {
      await syncPageTaxonomies(id, taxonomy_ids);
    }

    await fetchPages();
    return data;
  };

  const deletePage = async (id: string) => {
    const { data, error } = await supabase
      .from('pages')
      .delete()
      .eq('id', id)
      .select();

    if (error) throw error;
    
    if (data && data.length > 0) {
      setPages(pages.filter(p => p.id !== id));
    } else {
      throw new Error("Failed to delete page. You may not have permission or the page may have already been deleted.");
    }
  };

  const bulkUpdatePages = async (ids: string[], updates: any) => {
    const { data, error } = await supabase
      .from('pages')
      .update(updates)
      .in('id', ids)
      .select();

    if (error) throw error;
    // Refresh to get full objects with relationships
    await fetchPages();
    return data;
  };

  const bulkDeletePages = async (ids: string[]) => {
    const { data, error } = await supabase
      .from('pages')
      .delete()
      .in('id', ids)
      .select();

    if (error) throw error;
    
    if (data && data.length > 0) {
      const deletedIds = (data as any[]).map(p => p.id);
      setPages(pages.filter(p => !deletedIds.includes(p.id)));
      
      if (deletedIds.length < ids.length) {
        await fetchPages(); // Some were not deleted
        throw new Error(`Only ${deletedIds.length} of ${ids.length} pages were deleted.`);
      }
    } else {
      await fetchPages();
      throw new Error("Failed to delete pages. You may not have permission.");
    }
  };

  return { 
    pages, 
    loading, 
    error, 
    fetchPages, 
    addPage, 
    bulkAddPages, // Added
    updatePage, 
    deletePage, 
    bulkUpdatePages, 
    bulkDeletePages 
  };

  async function syncPageTaxonomies(pageId: string, taxonomyIds: string[]) {
    await supabase
      .from("page_taxonomies")
      .delete()
      .eq("page_id", pageId);

    if (taxonomyIds.length === 0) {
      return;
    }

    const { error } = await supabase
      .from("page_taxonomies")
      .insert(taxonomyIds.map((taxonomyId) => ({ page_id: pageId, taxonomy_id: taxonomyId })));

    if (error) {
      throw error;
    }
  }
}

function normalizePages(data: any[]): CMSPage[] {
  return data.map((page) => {
    const assignments = (page.page_taxonomies || [])
      .map((entry: any) => entry.taxonomy)
      .filter(Boolean);
    const categories = assignments.filter((item: any) => item.type === "category");
    const tags = assignments.filter((item: any) => item.type === "tag");

    return {
      ...page,
      content_type: (page.content_type || "page") as ContentType,
      post_type: (page.post_type || inferPostType(page)) as PostType,
      taxonomy_ids: assignments.map((item: any) => item.id),
      categories,
      tag_entities: tags,
      category: page.category || categories[0]?.name || "",
      tags: page.tags || tags.map((item: any) => item.name),
    };
  });
}

function inferPostType(page: any): PostType {
  if (page.content_type === "post") {
    return "post";
  }

  return "page";
}
