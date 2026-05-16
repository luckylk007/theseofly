-- Taxonomies Table
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

-- RLS for Taxonomies
ALTER TABLE taxonomies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access for taxonomies" ON taxonomies FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage taxonomies" ON taxonomies 
FOR ALL USING (auth.role() = 'authenticated');

-- Function to handle updated_at
CREATE OR REPLACE FUNCTION update_taxonomies_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_taxonomies_updated
  BEFORE UPDATE ON taxonomies
  FOR EACH ROW EXECUTE PROCEDURE update_taxonomies_updated_at();
