-- Migration: Enable page and taxonomy management for users with 'editor' or 'admin' profile roles
-- This solves issues where authenticated editors cannot view, edit, or create blogs/pages due to strict RLS ownership checks.

-- 1. Pages table policies
DROP POLICY IF EXISTS "Users can manage pages of their websites" ON pages;
DROP POLICY IF EXISTS "Authenticated users can manage pages" ON pages;
DROP POLICY IF EXISTS "Public read access for published pages" ON pages;

CREATE POLICY "Public read access for published pages" ON pages FOR SELECT 
USING (status = 'published');

CREATE POLICY "Authenticated users with admin/editor roles or owners can manage pages" ON pages FOR ALL
USING (
  auth.role() = 'authenticated' AND (
    EXISTS (SELECT 1 FROM websites WHERE id = pages.website_id AND owner_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
  )
)
WITH CHECK (
  auth.role() = 'authenticated' AND (
    EXISTS (SELECT 1 FROM websites WHERE id = pages.website_id AND owner_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
  )
);

-- 2. Taxonomies table policies
DROP POLICY IF EXISTS "Users can manage taxonomies of their websites" ON taxonomies;
DROP POLICY IF EXISTS "Authenticated users can manage taxonomies" ON taxonomies;
DROP POLICY IF EXISTS "Public read access for taxonomies" ON taxonomies;

CREATE POLICY "Public read access for taxonomies" ON taxonomies FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users with admin/editor roles or owners can manage taxonomies" ON taxonomies FOR ALL
USING (
  auth.role() = 'authenticated' AND (
    EXISTS (SELECT 1 FROM websites WHERE id = taxonomies.website_id AND owner_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
  )
)
WITH CHECK (
  auth.role() = 'authenticated' AND (
    EXISTS (SELECT 1 FROM websites WHERE id = taxonomies.website_id AND owner_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
  )
);

-- 3. Page Taxonomies table policies
DROP POLICY IF EXISTS "Users can manage page taxonomies of their websites" ON page_taxonomies;
DROP POLICY IF EXISTS "Authenticated users can manage page taxonomies" ON page_taxonomies;
DROP POLICY IF EXISTS "Public read access for page taxonomies" ON page_taxonomies;

CREATE POLICY "Public read access for page taxonomies" ON page_taxonomies FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users with admin/editor roles or owners can manage page taxonomies" ON page_taxonomies FOR ALL
USING (
  auth.role() = 'authenticated' AND (
    EXISTS (
      SELECT 1 FROM pages
      JOIN websites ON websites.id = pages.website_id
      WHERE pages.id = page_taxonomies.page_id AND websites.owner_id = auth.uid()
    ) OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
  )
)
WITH CHECK (
  auth.role() = 'authenticated' AND (
    EXISTS (
      SELECT 1 FROM pages
      JOIN websites ON websites.id = pages.website_id
      WHERE pages.id = page_taxonomies.page_id AND websites.owner_id = auth.uid()
    ) OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
  )
);

-- 4. SEO Metadata table policies
DROP POLICY IF EXISTS "Users can manage seo metadata of their websites" ON seo_metadata;
DROP POLICY IF EXISTS "Authenticated users can manage seo metadata" ON seo_metadata;
DROP POLICY IF EXISTS "Public read access for seo metadata" ON seo_metadata;

CREATE POLICY "Public read access for seo metadata" ON seo_metadata FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users with admin/editor roles or owners can manage seo metadata" ON seo_metadata FOR ALL
USING (
  auth.role() = 'authenticated' AND (
    EXISTS (
      SELECT 1 FROM pages
      JOIN websites ON websites.id = pages.website_id
      WHERE pages.id = seo_metadata.page_id AND websites.owner_id = auth.uid()
    ) OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
  )
)
WITH CHECK (
  auth.role() = 'authenticated' AND (
    EXISTS (
      SELECT 1 FROM pages
      JOIN websites ON websites.id = pages.website_id
      WHERE pages.id = seo_metadata.page_id AND websites.owner_id = auth.uid()
    ) OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
  )
);
