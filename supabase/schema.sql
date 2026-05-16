-- Supabase Schema for Theseofly Programmatic SEO Platform

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles (User management)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'editor' CHECK (role IN ('admin', 'editor', 'author')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Websites (Multi-site support)
CREATE TABLE websites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  domain TEXT UNIQUE NOT NULL,
  description TEXT,
  logo_url TEXT,
  favicon_url TEXT,
  global_seo_settings JSONB DEFAULT '{}',
  theme_config JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  owner_id UUID REFERENCES profiles(id)
);

-- 3. Taxonomies (Categories & Tags)
CREATE TABLE taxonomies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  website_id UUID REFERENCES websites(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  type TEXT CHECK (type IN ('category', 'tag')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(website_id, slug, type)
);

-- 4. Pages (Dynamic SEO pages)
CREATE TABLE pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  website_id UUID REFERENCES websites(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  content JSONB DEFAULT '{"sections": []}',
  status TEXT DEFAULT 'draft',
  published_at TIMESTAMP WITH TIME ZONE,
  is_programmatic BOOLEAN DEFAULT FALSE,
  variables JSONB DEFAULT '{}', -- Values for dynamic variables
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  content_type TEXT DEFAULT 'page',
  post_type TEXT DEFAULT 'page',
  parent_id UUID REFERENCES pages(id) ON DELETE SET NULL,
  author_id UUID REFERENCES profiles(id),
  allow_comments BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(website_id, slug),
  CONSTRAINT pages_status_check CHECK (status IN ('draft', 'published', 'scheduled', 'private', 'pending_preview')),
  CONSTRAINT pages_content_type_check CHECK (content_type IN ('page', 'post')),
  CONSTRAINT pages_post_type_check CHECK (post_type IN ('page', 'post', 'blog', 'news', 'newsletter', 'case-study'))
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_pages_category ON pages(category);
CREATE INDEX IF NOT EXISTS idx_pages_tags ON pages USING GIN (tags);
CREATE INDEX IF NOT EXISTS idx_pages_content_type ON pages(content_type);
CREATE INDEX IF NOT EXISTS idx_pages_post_type ON pages(post_type);
CREATE INDEX IF NOT EXISTS idx_pages_parent_id ON pages(parent_id);
CREATE INDEX IF NOT EXISTS idx_pages_author_id ON pages(author_id);

CREATE TABLE page_taxonomies (
  page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  taxonomy_id UUID NOT NULL REFERENCES taxonomies(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (page_id, taxonomy_id)
);

CREATE INDEX IF NOT EXISTS idx_page_taxonomies_taxonomy_id ON page_taxonomies(taxonomy_id);
CREATE INDEX IF NOT EXISTS idx_page_taxonomies_page_id ON page_taxonomies(page_id);

-- 5. SEO Metadata
CREATE TABLE seo_metadata (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
  title TEXT,
  description TEXT,
  og_image TEXT,
  canonical_url TEXT,
  noindex BOOLEAN DEFAULT FALSE,
  schema_markup JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Media Library
CREATE TABLE media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  website_id UUID REFERENCES websites(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  alt_text TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Redirects
CREATE TABLE redirects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  website_id UUID REFERENCES websites(id) ON DELETE CASCADE,
  from_path TEXT NOT NULL,
  to_path TEXT NOT NULL,
  type INTEGER DEFAULT 301,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Forms & Leads
CREATE TABLE forms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  website_id UUID REFERENCES websites(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  config JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  form_id UUID REFERENCES forms(id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Activity Logs
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. AI Generations
CREATE TABLE ai_generations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  prompt TEXT,
  response TEXT,
  type TEXT, -- 'content', 'meta', 'schema'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS POLICIES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE websites ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_taxonomies ENABLE ROW LEVEL SECURITY;
ALTER TABLE taxonomies ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE redirects ENABLE ROW LEVEL SECURITY;
ALTER TABLE forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_generations ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can only read/update their own profile
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Websites: Users can see websites they own
CREATE POLICY "Users can see websites they own" ON websites FOR ALL USING (auth.uid() = owner_id);

-- Pages: Based on website ownership
CREATE POLICY "Users can manage pages of their websites" ON pages FOR ALL 
USING (EXISTS (SELECT 1 FROM websites WHERE id = pages.website_id AND owner_id = auth.uid()));

CREATE POLICY "Users can manage page taxonomies of their websites" ON page_taxonomies FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM pages
    JOIN websites ON websites.id = pages.website_id
    WHERE pages.id = page_taxonomies.page_id
      AND websites.owner_id = auth.uid()
  )
);

-- Taxonomies: Based on website ownership
CREATE POLICY "Users can manage taxonomies of their websites" ON taxonomies FOR ALL 
USING (EXISTS (SELECT 1 FROM websites WHERE id = taxonomies.website_id AND owner_id = auth.uid()));

CREATE TABLE countries (
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

CREATE UNIQUE INDEX IF NOT EXISTS idx_countries_website_slug_unique ON countries(website_id, slug) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_countries_website_code_unique ON countries(website_id, country_code) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_countries_status ON countries(website_id, status);
CREATE INDEX IF NOT EXISTS idx_countries_deleted_at ON countries(deleted_at);

CREATE TABLE services (
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

CREATE UNIQUE INDEX IF NOT EXISTS idx_services_website_slug_unique ON services(website_id, slug) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_services_status ON services(website_id, status);
CREATE INDEX IF NOT EXISTS idx_services_deleted_at ON services(deleted_at);

CREATE TABLE cities (
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

CREATE UNIQUE INDEX IF NOT EXISTS idx_cities_country_slug_unique ON cities(country_id, slug) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_cities_country_id ON cities(country_id);
CREATE INDEX IF NOT EXISTS idx_cities_status ON cities(website_id, status);
CREATE INDEX IF NOT EXISTS idx_cities_deleted_at ON cities(deleted_at);

ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage countries of their websites" ON countries FOR ALL
USING (EXISTS (SELECT 1 FROM websites WHERE id = countries.website_id AND owner_id = auth.uid()));

CREATE POLICY "Users can manage services of their websites" ON services FOR ALL
USING (EXISTS (SELECT 1 FROM websites WHERE id = services.website_id AND owner_id = auth.uid()));

CREATE POLICY "Users can manage cities of their websites" ON cities FOR ALL
USING (EXISTS (SELECT 1 FROM websites WHERE id = cities.website_id AND owner_id = auth.uid()));

-- Functions
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();
- -   E n a b l e   p u b l i c   r e a d   a c c e s s   f o r   p u b l i s h e d   p a g e s   a n d   p r o g r a m m a t i c   S E O   e n t i t i e s  
  
 - -   1 .   P a g e s   t a b l e  
 D R O P   P O L I C Y   I F   E X I S T S   " P u b l i c   r e a d   a c c e s s   f o r   p u b l i s h e d   p a g e s "   O N   p a g e s ;  
 C R E A T E   P O L I C Y   " P u b l i c   r e a d   a c c e s s   f o r   p u b l i s h e d   p a g e s "   O N   p a g e s   F O R   S E L E C T   U S I N G   ( s t a t u s   =   ' p u b l i s h e d ' ) ;  
  
 - -   2 .   C o u n t r i e s   t a b l e  
 D R O P   P O L I C Y   I F   E X I S T S   " P u b l i c   r e a d   a c c e s s   f o r   p u b l i c   c o u n t r i e s "   O N   c o u n t r i e s ;  
 C R E A T E   P O L I C Y   " P u b l i c   r e a d   a c c e s s   f o r   p u b l i c   c o u n t r i e s "   O N   c o u n t r i e s   F O R   S E L E C T   U S I N G   ( s t a t u s   =   ' p u b l i c ' ) ;  
  
 - -   3 .   C i t i e s   t a b l e  
 D R O P   P O L I C Y   I F   E X I S T S   " P u b l i c   r e a d   a c c e s s   f o r   p u b l i c   c i t i e s "   O N   c i t i e s ;  
 C R E A T E   P O L I C Y   " P u b l i c   r e a d   a c c e s s   f o r   p u b l i c   c i t i e s "   O N   c i t i e s   F O R   S E L E C T   U S I N G   ( s t a t u s   =   ' p u b l i c ' ) ;  
  
 - -   4 .   S e r v i c e s   t a b l e  
 D R O P   P O L I C Y   I F   E X I S T S   " P u b l i c   r e a d   a c c e s s   f o r   p u b l i c   s e r v i c e s "   O N   s e r v i c e s ;  
 C R E A T E   P O L I C Y   " P u b l i c   r e a d   a c c e s s   f o r   p u b l i c   s e r v i c e s "   O N   s e r v i c e s   F O R   S E L E C T   U S I N G   ( s t a t u s   =   ' p u b l i c ' ) ;  
  
 - -   5 .   S E O   M e t a d a t a  
 D R O P   P O L I C Y   I F   E X I S T S   " P u b l i c   r e a d   a c c e s s   f o r   s e o   m e t a d a t a "   O N   s e o _ m e t a d a t a ;  
 C R E A T E   P O L I C Y   " P u b l i c   r e a d   a c c e s s   f o r   s e o   m e t a d a t a "   O N   s e o _ m e t a d a t a   F O R   S E L E C T   U S I N G   (  
     E X I S T S   (  
         S E L E C T   1   F R O M   p a g e s   W H E R E   p a g e s . i d   =   s e o _ m e t a d a t a . p a g e _ i d   A N D   p a g e s . s t a t u s   =   ' p u b l i s h e d '  
     )  
 ) ;  
  
 - -   6 .   P a g e   T a x o n o m i e s  
 D R O P   P O L I C Y   I F   E X I S T S   " P u b l i c   r e a d   a c c e s s   f o r   p a g e   t a x o n o m i e s "   O N   p a g e _ t a x o n o m i e s ;  
 C R E A T E   P O L I C Y   " P u b l i c   r e a d   a c c e s s   f o r   p a g e   t a x o n o m i e s "   O N   p a g e _ t a x o n o m i e s   F O R   S E L E C T   U S I N G   (  
     E X I S T S   (  
         S E L E C T   1   F R O M   p a g e s   W H E R E   p a g e s . i d   =   p a g e _ t a x o n o m i e s . p a g e _ i d   A N D   p a g e s . s t a t u s   =   ' p u b l i s h e d '  
     )  
 ) ;  
 - -   E n a b l e   p u b l i c   r e a d   a c c e s s   f o r   p u b l i s h e d   p a g e s   a n d   p r o g r a m m a t i c   S E O   e n t i t i e s  
  
 - -   1 .   W e b s i t e s   t a b l e   ( P u b l i c   r e a d   f o r   d o m a i n   i n f o )  
 D R O P   P O L I C Y   I F   E X I S T S   " P u b l i c   r e a d   a c c e s s   f o r   w e b s i t e s "   O N   w e b s i t e s ;  
 C R E A T E   P O L I C Y   " P u b l i c   r e a d   a c c e s s   f o r   w e b s i t e s "   O N   w e b s i t e s   F O R   S E L E C T   U S I N G   ( t r u e ) ;  
  
 - -   2 .   P a g e s   t a b l e  
 D R O P   P O L I C Y   I F   E X I S T S   " P u b l i c   r e a d   a c c e s s   f o r   p u b l i s h e d   p a g e s "   O N   p a g e s ;  
 C R E A T E   P O L I C Y   " P u b l i c   r e a d   a c c e s s   f o r   p u b l i s h e d   p a g e s "   O N   p a g e s   F O R   S E L E C T   U S I N G   ( s t a t u s   =   ' p u b l i s h e d ' ) ;  
  
 - -   3 .   C o u n t r i e s   t a b l e  
 D R O P   P O L I C Y   I F   E X I S T S   " P u b l i c   r e a d   a c c e s s   f o r   p u b l i c   c o u n t r i e s "   O N   c o u n t r i e s ;  
 C R E A T E   P O L I C Y   " P u b l i c   r e a d   a c c e s s   f o r   p u b l i c   c o u n t r i e s "   O N   c o u n t r i e s   F O R   S E L E C T   U S I N G   ( s t a t u s   =   ' p u b l i c ' ) ;  
  
 - -   4 .   C i t i e s   t a b l e  
 D R O P   P O L I C Y   I F   E X I S T S   " P u b l i c   r e a d   a c c e s s   f o r   p u b l i c   c i t i e s "   O N   c i t i e s ;  
 C R E A T E   P O L I C Y   " P u b l i c   r e a d   a c c e s s   f o r   p u b l i c   c i t i e s "   O N   c i t i e s   F O R   S E L E C T   U S I N G   ( s t a t u s   =   ' p u b l i c ' ) ;  
  
 - -   5 .   S e r v i c e s   t a b l e  
 D R O P   P O L I C Y   I F   E X I S T S   " P u b l i c   r e a d   a c c e s s   f o r   p u b l i c   s e r v i c e s "   O N   s e r v i c e s ;  
 C R E A T E   P O L I C Y   " P u b l i c   r e a d   a c c e s s   f o r   p u b l i c   s e r v i c e s "   O N   s e r v i c e s   F O R   S E L E C T   U S I N G   ( s t a t u s   =   ' p u b l i c ' ) ;  
  
 - -   6 .   S E O   M e t a d a t a  
 D R O P   P O L I C Y   I F   E X I S T S   " P u b l i c   r e a d   a c c e s s   f o r   s e o   m e t a d a t a "   O N   s e o _ m e t a d a t a ;  
 C R E A T E   P O L I C Y   " P u b l i c   r e a d   a c c e s s   f o r   s e o   m e t a d a t a "   O N   s e o _ m e t a d a t a   F O R   S E L E C T   U S I N G   (  
     E X I S T S   (  
         S E L E C T   1   F R O M   p a g e s   W H E R E   p a g e s . i d   =   s e o _ m e t a d a t a . p a g e _ i d   A N D   p a g e s . s t a t u s   =   ' p u b l i s h e d '  
     )  
 ) ;  
  
 - -   7 .   P a g e   T a x o n o m i e s  
 D R O P   P O L I C Y   I F   E X I S T S   " P u b l i c   r e a d   a c c e s s   f o r   p a g e   t a x o n o m i e s "   O N   p a g e _ t a x o n o m i e s ;  
 C R E A T E   P O L I C Y   " P u b l i c   r e a d   a c c e s s   f o r   p a g e   t a x o n o m i e s "   O N   p a g e _ t a x o n o m i e s   F O R   S E L E C T   U S I N G   (  
     E X I S T S   (  
         S E L E C T   1   F R O M   p a g e s   W H E R E   p a g e s . i d   =   p a g e _ t a x o n o m i e s . p a g e _ i d   A N D   p a g e s . s t a t u s   =   ' p u b l i s h e d '  
     )  
 ) ;  
 