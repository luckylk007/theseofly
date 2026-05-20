export type ContentType = "page" | "post";

export type PostType =
  | "page"
  | "post"
  | "blog"
  | "news"
  | "newsletter"
  | "case-study";

export interface TaxonomyAssignment {
  id: string;
  website_id: string;
  name: string;
  slug: string;
  type: "category" | "tag";
  description?: string | null;
}

export interface CMSPage {
  id: string;
  website_id: string;
  title: string;
  slug: string;
  content?: any;
  status: "draft" | "published" | "scheduled" | "private" | "pending_preview";
  published_at?: string | null;
  is_programmatic?: boolean | null;
  variables?: Record<string, unknown> | null;
  category?: string | null;
  tags?: string[] | null;
  content_type: ContentType;
  post_type: PostType;
  parent_id?: string | null;
  author_id?: string | null;
  allow_comments?: boolean | null;
  featured_image_url?: string | null;
  created_at: string;
  updated_at: string;
  seo_metadata?: any[];
  page_taxonomies?: Array<{
    taxonomy: TaxonomyAssignment | null;
  }>;
  taxonomy_ids: string[];
  categories: TaxonomyAssignment[];
  tag_entities: TaxonomyAssignment[];
}
