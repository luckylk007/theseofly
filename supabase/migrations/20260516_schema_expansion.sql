-- Expand Pages table for advanced CMS features
ALTER TABLE pages 
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES pages(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES profiles(id),
ADD COLUMN IF NOT EXISTS allow_comments BOOLEAN DEFAULT FALSE;

-- Update status check constraint
-- First drop existing constraint if it exists (need to find its name, usually 'pages_status_check')
ALTER TABLE pages DROP CONSTRAINT IF EXISTS pages_status_check;

-- Add new status constraint
ALTER TABLE pages 
ADD CONSTRAINT pages_status_check 
CHECK (status IN ('draft', 'published', 'scheduled', 'private', 'pending_preview'));

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_pages_category ON pages(category);
CREATE INDEX IF NOT EXISTS idx_pages_tags ON pages USING GIN (tags);
CREATE INDEX IF NOT EXISTS idx_pages_parent_id ON pages(parent_id);
CREATE INDEX IF NOT EXISTS idx_pages_author_id ON pages(author_id);
