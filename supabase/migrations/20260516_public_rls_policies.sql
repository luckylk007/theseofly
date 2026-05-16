-- Enable public read access for published pages and programmatic SEO entities

-- 1. Websites table (Public read for domain info)
DROP POLICY IF EXISTS "Public read access for websites" ON websites;
CREATE POLICY "Public read access for websites" ON websites FOR SELECT USING (true);

-- 2. Pages table
DROP POLICY IF EXISTS "Public read access for published pages" ON pages;
CREATE POLICY "Public read access for published pages" ON pages FOR SELECT USING (status = 'published');

-- 3. Countries table
DROP POLICY IF EXISTS "Public read access for public countries" ON countries;
CREATE POLICY "Public read access for public countries" ON countries FOR SELECT USING (status = 'public');

-- 4. Cities table
DROP POLICY IF EXISTS "Public read access for public cities" ON cities;
CREATE POLICY "Public read access for public cities" ON cities FOR SELECT USING (status = 'public');

-- 5. Services table
DROP POLICY IF EXISTS "Public read access for public services" ON services;
CREATE POLICY "Public read access for public services" ON services FOR SELECT USING (status = 'public');

-- 6. SEO Metadata
DROP POLICY IF EXISTS "Public read access for seo metadata" ON seo_metadata;
CREATE POLICY "Public read access for seo metadata" ON seo_metadata FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM pages WHERE pages.id = seo_metadata.page_id AND pages.status = 'published'
  )
);

-- 7. Page Taxonomies
DROP POLICY IF EXISTS "Public read access for page taxonomies" ON page_taxonomies;
CREATE POLICY "Public read access for page taxonomies" ON page_taxonomies FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM pages WHERE pages.id = page_taxonomies.page_id AND pages.status = 'published'
  )
);
