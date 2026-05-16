-- Update templates table for advanced theme builder
ALTER TABLE templates 
ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'single_page',
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled')),
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS priority INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS conditions JSONB DEFAULT '[]';

-- Add check constraint for template types
-- Drop if exists to avoid error on rerun
ALTER TABLE templates DROP CONSTRAINT IF EXISTS templates_type_check;
ALTER TABLE templates 
ADD CONSTRAINT templates_type_check 
CHECK (type IN (
  'header', 'footer', 'single_post', 'single_page', 'archive', 
  'search_results', 'category_archive', 'tag_archive', 'author_archive',
  'woo_product', 'woo_archive', 'cart', 'checkout', 'error_404', 
  'coming_soon', 'maintenance_mode', 'custom_post_type'
));

-- Add index for condition evaluation
CREATE INDEX IF NOT EXISTS idx_templates_type_active ON templates(type, is_active);
CREATE INDEX IF NOT EXISTS idx_templates_priority ON templates(priority DESC);
