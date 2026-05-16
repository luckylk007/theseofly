export type TemplateType = 
  | 'header' 
  | 'footer' 
  | 'single_post' 
  | 'single_page' 
  | 'archive' 
  | 'search_results' 
  | 'category_archive' 
  | 'tag_archive' 
  | 'author_archive'
  | 'woo_product' 
  | 'woo_archive' 
  | 'cart' 
  | 'checkout' 
  | 'error_404' 
  | 'coming_soon' 
  | 'maintenance_mode' 
  | 'custom_post_type';

export type ConditionType = 'include' | 'exclude';

export type TemplateConditionField =
  | "page_type"
  | "category"
  | "tag"
  | "country"
  | "city"
  | "service"
  | "post_type"
  | "specific_page"
  | "url_slug"
  | "url_pattern";

export interface TemplateConditionRule {
  id: string;
  type: ConditionType;
  field: TemplateConditionField;
  values: string[];
}

export interface TemplateConditions {
  match: "all" | "any";
  rules: TemplateConditionRule[];
}

export interface ThemeTemplate {
  id: string;
  website_id: string;
  name: string;
  type: TemplateType;
  status: 'draft' | 'published' | 'scheduled';
  is_active: boolean;
  priority: number;
  conditions: TemplateConditions;
  content: any;
  created_at: string;
  updated_at: string;
}

export const TEMPLATE_TYPE_LABELS: Record<TemplateType, string> = {
  header: 'Header',
  footer: 'Footer',
  single_post: 'Single Post',
  single_page: 'Single Page',
  archive: 'Archive',
  search_results: 'Search Results',
  category_archive: 'Category Archive',
  tag_archive: 'Tag Archive',
  author_archive: 'Author Archive',
  woo_product: 'Product',
  woo_archive: 'Shop Archive',
  cart: 'Cart',
  checkout: 'Checkout',
  error_404: 'Error 404',
  coming_soon: 'Coming Soon',
  maintenance_mode: 'Maintenance Mode',
  custom_post_type: 'Custom Post Type'
};
