-- Migration: Enable full platform access for users with 'editor' or 'admin' profile roles
-- Using short, precise policy names (under 63 bytes) to avoid Postgres truncation errors.

-- 1. Websites table policies
DROP POLICY IF EXISTS "Users can see websites they own" ON websites;
DROP POLICY IF EXISTS "Authenticated users can manage websites" ON websites;
DROP POLICY IF EXISTS "Public read access for websites" ON websites;
DROP POLICY IF EXISTS "manage_websites_policy" ON websites;

CREATE POLICY "Public read access for websites" ON websites FOR SELECT 
USING (true);

CREATE POLICY "manage_websites_policy" ON websites FOR ALL
USING (
  auth.role() = 'authenticated' AND (
    auth.uid() = owner_id OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
  )
)
WITH CHECK (
  auth.role() = 'authenticated' AND (
    auth.uid() = owner_id OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
  )
);

-- 2. Pages table policies
DROP POLICY IF EXISTS "Users can manage pages of their websites" ON pages;
DROP POLICY IF EXISTS "Authenticated users can manage pages" ON pages;
DROP POLICY IF EXISTS "Public read access for published pages" ON pages;
DROP POLICY IF EXISTS "Authenticated users with admin/editor roles or owners can manag" ON pages;
DROP POLICY IF EXISTS "manage_pages_policy" ON pages;

CREATE POLICY "Public read access for published pages" ON pages FOR SELECT 
USING (status = 'published');

CREATE POLICY "manage_pages_policy" ON pages FOR ALL
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

-- 3. Taxonomies table policies
DROP POLICY IF EXISTS "Users can manage taxonomies of their websites" ON taxonomies;
DROP POLICY IF EXISTS "Authenticated users can manage taxonomies" ON taxonomies;
DROP POLICY IF EXISTS "Public read access for taxonomies" ON taxonomies;
DROP POLICY IF EXISTS "Authenticated users with admin/editor roles or owners can manag" ON taxonomies;
DROP POLICY IF EXISTS "manage_taxonomies_policy" ON taxonomies;

CREATE POLICY "Public read access for taxonomies" ON taxonomies FOR SELECT 
USING (true);

CREATE POLICY "manage_taxonomies_policy" ON taxonomies FOR ALL
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

-- 4. Page Taxonomies table policies
DROP POLICY IF EXISTS "Users can manage page taxonomies of their websites" ON page_taxonomies;
DROP POLICY IF EXISTS "Authenticated users can manage page taxonomies" ON page_taxonomies;
DROP POLICY IF EXISTS "Public read access for page taxonomies" ON page_taxonomies;
DROP POLICY IF EXISTS "Authenticated users with admin/editor roles or owners can manag" ON page_taxonomies;
DROP POLICY IF EXISTS "manage_page_tax_policy" ON page_taxonomies;

CREATE POLICY "Public read access for page taxonomies" ON page_taxonomies FOR SELECT 
USING (true);

CREATE POLICY "manage_page_tax_policy" ON page_taxonomies FOR ALL
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

-- 5. SEO Metadata table policies
DROP POLICY IF EXISTS "Users can manage seo metadata of their websites" ON seo_metadata;
DROP POLICY IF EXISTS "Authenticated users can manage seo metadata" ON seo_metadata;
DROP POLICY IF EXISTS "Public read access for seo metadata" ON seo_metadata;
DROP POLICY IF EXISTS "Authenticated users with admin/editor roles or owners can manag" ON seo_metadata;
DROP POLICY IF EXISTS "manage_seo_policy" ON seo_metadata;

CREATE POLICY "Public read access for seo metadata" ON seo_metadata FOR SELECT 
USING (true);

CREATE POLICY "manage_seo_policy" ON seo_metadata FOR ALL
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
