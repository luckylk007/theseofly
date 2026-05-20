
-- Add featured_image_url to pages table
ALTER TABLE pages ADD COLUMN IF NOT EXISTS featured_image_url TEXT;

-- Update RLS policies to include the new column (though FOR ALL usually covers it)
-- This migration ensures the column exists in the database.
