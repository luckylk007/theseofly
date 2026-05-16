CREATE TABLE IF NOT EXISTS countries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  website_id UUID NOT NULL REFERENCES websites(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  country_code TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  flag_media_id UUID REFERENCES media(id) ON DELETE SET NULL,
  flag_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'public', 'private', 'pending_review')),
  live_page BOOLEAN NOT NULL DEFAULT FALSE,
  seo JSONB NOT NULL DEFAULT '{}',
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_countries_website_slug_unique
ON countries(website_id, slug)
WHERE deleted_at IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_countries_website_code_unique
ON countries(website_id, country_code)
WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_countries_status ON countries(website_id, status);
CREATE INDEX IF NOT EXISTS idx_countries_deleted_at ON countries(deleted_at);

CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  website_id UUID NOT NULL REFERENCES websites(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  icon_name TEXT,
  icon_media_id UUID REFERENCES media(id) ON DELETE SET NULL,
  icon_url TEXT,
  service_category TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'public', 'private', 'pending_review')),
  live_page BOOLEAN NOT NULL DEFAULT FALSE,
  seo JSONB NOT NULL DEFAULT '{}',
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_services_website_slug_unique
ON services(website_id, slug)
WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_services_status ON services(website_id, status);
CREATE INDEX IF NOT EXISTS idx_services_deleted_at ON services(deleted_at);

CREATE TABLE IF NOT EXISTS cities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  website_id UUID NOT NULL REFERENCES websites(id) ON DELETE CASCADE,
  country_id UUID NOT NULL REFERENCES countries(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  banner_media_id UUID REFERENCES media(id) ON DELETE SET NULL,
  banner_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'public', 'private', 'pending_review')),
  live_page BOOLEAN NOT NULL DEFAULT FALSE,
  draft_page BOOLEAN NOT NULL DEFAULT TRUE,
  seo JSONB NOT NULL DEFAULT '{}',
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_cities_country_slug_unique
ON cities(country_id, slug)
WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_cities_country_id ON cities(country_id);
CREATE INDEX IF NOT EXISTS idx_cities_status ON cities(website_id, status);
CREATE INDEX IF NOT EXISTS idx_cities_deleted_at ON cities(deleted_at);

CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS countries_updated_at ON countries;
CREATE TRIGGER countries_updated_at BEFORE UPDATE ON countries FOR EACH ROW EXECUTE PROCEDURE update_timestamp_column();

DROP TRIGGER IF EXISTS services_updated_at ON services;
CREATE TRIGGER services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE PROCEDURE update_timestamp_column();

DROP TRIGGER IF EXISTS cities_updated_at ON cities;
CREATE TRIGGER cities_updated_at BEFORE UPDATE ON cities FOR EACH ROW EXECUTE PROCEDURE update_timestamp_column();

ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage countries of their websites" ON countries;
CREATE POLICY "Users can manage countries of their websites" ON countries
FOR ALL USING (EXISTS (SELECT 1 FROM websites WHERE id = countries.website_id AND owner_id = auth.uid()));

DROP POLICY IF EXISTS "Users can manage services of their websites" ON services;
CREATE POLICY "Users can manage services of their websites" ON services
FOR ALL USING (EXISTS (SELECT 1 FROM websites WHERE id = services.website_id AND owner_id = auth.uid()));

DROP POLICY IF EXISTS "Users can manage cities of their websites" ON cities;
CREATE POLICY "Users can manage cities of their websites" ON cities
FOR ALL USING (EXISTS (SELECT 1 FROM websites WHERE id = cities.website_id AND owner_id = auth.uid()));
