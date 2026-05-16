-- Run this script in your Supabase SQL Editor to fix the missing columns in the 'pages' and 'templates' tables.

-- 1. Fix 'pages' table
ALTER TABLE pages 
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES pages(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES profiles(id),
ADD COLUMN IF NOT EXISTS allow_comments BOOLEAN DEFAULT FALSE;

-- Update pages status constraint
ALTER TABLE pages DROP CONSTRAINT IF EXISTS pages_status_check;
ALTER TABLE pages 
ADD CONSTRAINT pages_status_check 
CHECK (status IN ('draft', 'published', 'scheduled', 'private', 'pending_preview'));

-- 2. Fix 'templates' table
ALTER TABLE templates 
ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'single_page',
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft',
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS priority INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS conditions JSONB DEFAULT '[]';

-- Update templates type and status constraints
ALTER TABLE templates DROP CONSTRAINT IF EXISTS templates_type_check;
ALTER TABLE templates 
ADD CONSTRAINT templates_type_check 
CHECK (type IN (
  'header', 'footer', 'single_post', 'single_page', 'archive', 
  'search_results', 'category_archive', 'tag_archive', 'author_archive',
  'woo_product', 'woo_archive', 'cart', 'checkout', 'error_404', 
  'coming_soon', 'maintenance_mode', 'custom_post_type'
));

ALTER TABLE templates DROP CONSTRAINT IF EXISTS templates_status_check;
ALTER TABLE templates 
ADD CONSTRAINT templates_status_check 
CHECK (status IN ('draft', 'published', 'scheduled'));

-- 3. Create Taxonomies table if missing
CREATE TABLE IF NOT EXISTS taxonomies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  website_id UUID REFERENCES websites(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('category', 'tag')),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(website_id, slug, type)
);

-- Enable RLS for Taxonomies
ALTER TABLE taxonomies ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read access for taxonomies" ON taxonomies;
CREATE POLICY "Public read access for taxonomies" ON taxonomies FOR SELECT USING (true);
DROP POLICY IF EXISTS "Authenticated users can manage taxonomies" ON taxonomies;
CREATE POLICY "Authenticated users can manage taxonomies" ON taxonomies 
FOR ALL USING (auth.role() = 'authenticated');

-- 4. Enable RLS and Add Policies (Fixes the "violates row-level security policy" error)
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE taxonomies ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid "already exists" errors
DROP POLICY IF EXISTS "Users can manage templates of their websites" ON templates;
DROP POLICY IF EXISTS "Users can manage pages of their websites" ON pages;
DROP POLICY IF EXISTS "Users can manage taxonomies of their websites" ON taxonomies;

-- Templates: Based on website ownership
CREATE POLICY "Users can manage templates of their websites" ON templates FOR ALL 
USING (EXISTS (SELECT 1 FROM websites WHERE id = templates.website_id AND owner_id = auth.uid()));

-- Pages: Based on website ownership
CREATE POLICY "Users can manage pages of their websites" ON pages FOR ALL 
USING (EXISTS (SELECT 1 FROM websites WHERE id = pages.website_id AND owner_id = auth.uid()));

-- Taxonomies: Based on website ownership
CREATE POLICY "Users can manage taxonomies of their websites" ON taxonomies FOR ALL 
USING (EXISTS (SELECT 1 FROM websites WHERE id = taxonomies.website_id AND owner_id = auth.uid()));

-- 5. Re-index for performance
CREATE INDEX IF NOT EXISTS idx_pages_category ON pages(category);
CREATE INDEX IF NOT EXISTS idx_pages_tags ON pages USING GIN (tags);
CREATE INDEX IF NOT EXISTS idx_pages_parent_id ON pages(parent_id);
CREATE INDEX IF NOT EXISTS idx_pages_author_id ON pages(author_id);
CREATE INDEX IF NOT EXISTS idx_templates_type_active ON templates(type, is_active);
CREATE INDEX IF NOT EXISTS idx_templates_priority ON templates(priority DESC);
