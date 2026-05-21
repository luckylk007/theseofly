
-- Fix ambiguity in get_page_preview function
-- Drop existing versions to ensure we have a clean state
DROP FUNCTION IF EXISTS get_page_preview(TEXT);
DROP FUNCTION IF EXISTS get_page_preview(UUID);

-- Re-create the function with TEXT parameter
CREATE OR REPLACE FUNCTION get_page_preview(p_id TEXT)
RETURNS JSONB AS $$
DECLARE
  v_page JSONB;
  v_uuid UUID;
BEGIN
  -- Safely try to cast to UUID
  BEGIN
    v_uuid := p_id::UUID;
  EXCEPTION WHEN others THEN
    RETURN NULL;
  END;

  SELECT 
    jsonb_build_object(
      'id', p.id,
      'title', p.title,
      'slug', p.slug,
      'content', p.content,
      'status', p.status,
      'is_programmatic', p.is_programmatic,
      'variables', p.variables,
      'featured_image_url', p.featured_image_url,
      'website_id', p.website_id,
      'created_at', p.created_at,
      'updated_at', p.updated_at,
      'seo', (
        SELECT COALESCE(jsonb_agg(s.*), '[]'::jsonb)
        FROM seo_metadata s 
        WHERE s.page_id = p.id
      ),
      'website', (
        SELECT jsonb_build_object('global_seo_settings', w.global_seo_settings)
        FROM websites w
        WHERE w.id = p.website_id
      ),
      'page_taxonomies', (
        SELECT COALESCE(jsonb_agg(jsonb_build_object('taxonomy', t.*)), '[]'::jsonb)
        FROM page_taxonomies pt
        JOIN taxonomies t ON t.id = pt.taxonomy_id
        WHERE pt.page_id = p.id
      )
    ) INTO v_page
  FROM pages p
  WHERE p.id = v_uuid;
  
  RETURN v_page;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-grant permissions
GRANT EXECUTE ON FUNCTION get_page_preview(TEXT) TO anon, authenticated, service_role;
