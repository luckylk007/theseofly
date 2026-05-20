
-- Loosen RLS policies to allow any authenticated user to manage pages and taxonomies
-- This resolves issues where owner_id mismatches prevent management in development/shared environments

-- 1. Pages table
DROP POLICY IF EXISTS "Users can manage pages of their websites" ON pages;
CREATE POLICY "Authenticated users can manage pages" ON pages FOR ALL 
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- 2. Taxonomies table
DROP POLICY IF EXISTS "Users can manage taxonomies of their websites" ON taxonomies;
CREATE POLICY "Authenticated users can manage taxonomies" ON taxonomies FOR ALL 
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- 3. Websites table
-- Ensure authenticated users can at least see and update websites (to manage their own)
DROP POLICY IF EXISTS "Users can see websites they own" ON websites;
CREATE POLICY "Authenticated users can manage websites" ON websites FOR ALL 
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- 4. Page Taxonomies
DROP POLICY IF EXISTS "Users can manage page taxonomies of their websites" ON page_taxonomies;
CREATE POLICY "Authenticated users can manage page taxonomies" ON page_taxonomies FOR ALL 
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- 5. SEO Metadata
DROP POLICY IF EXISTS "Users can manage seo metadata of their websites" ON seo_metadata;
CREATE POLICY "Authenticated users can manage seo metadata" ON seo_metadata FOR ALL 
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');
