ALTER TABLE templates
ALTER COLUMN conditions SET DEFAULT '{"match":"all","rules":[]}'::jsonb;

UPDATE templates
SET conditions = '{"match":"all","rules":[]}'::jsonb
WHERE conditions IS NULL
   OR jsonb_typeof(conditions) <> 'object';

CREATE INDEX IF NOT EXISTS idx_templates_conditions_gin
ON templates
USING GIN (conditions jsonb_path_ops);

ALTER TABLE pages
ADD COLUMN IF NOT EXISTS content_type TEXT DEFAULT 'page',
ADD COLUMN IF NOT EXISTS post_type TEXT DEFAULT 'page';

ALTER TABLE pages DROP CONSTRAINT IF EXISTS pages_content_type_check;
ALTER TABLE pages DROP CONSTRAINT IF EXISTS pages_post_type_check;

ALTER TABLE pages
ADD CONSTRAINT pages_content_type_check
CHECK (content_type IN ('page', 'post'));

ALTER TABLE pages
ADD CONSTRAINT pages_post_type_check
CHECK (post_type IN ('page', 'post', 'blog', 'news', 'newsletter', 'case-study'));

UPDATE pages
SET content_type = CASE
  WHEN COALESCE(category, '') <> '' OR COALESCE(array_length(tags, 1), 0) > 0 THEN 'post'
  ELSE 'page'
END
WHERE content_type IS NULL;

UPDATE pages
SET post_type = CASE
  WHEN content_type = 'post' THEN 'post'
  ELSE 'page'
END
WHERE post_type IS NULL;

CREATE INDEX IF NOT EXISTS idx_pages_content_type ON pages(content_type);
CREATE INDEX IF NOT EXISTS idx_pages_post_type ON pages(post_type);

CREATE TABLE IF NOT EXISTS page_taxonomies (
  page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  taxonomy_id UUID NOT NULL REFERENCES taxonomies(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (page_id, taxonomy_id)
);

CREATE INDEX IF NOT EXISTS idx_page_taxonomies_taxonomy_id
ON page_taxonomies(taxonomy_id);

CREATE INDEX IF NOT EXISTS idx_page_taxonomies_page_id
ON page_taxonomies(page_id);

ALTER TABLE page_taxonomies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage page taxonomies of their websites" ON page_taxonomies;
CREATE POLICY "Users can manage page taxonomies of their websites" ON page_taxonomies
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM pages
    JOIN websites ON websites.id = pages.website_id
    WHERE pages.id = page_taxonomies.page_id
      AND websites.owner_id = auth.uid()
  )
);
