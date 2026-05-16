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

export type ConditionTarget = 
  | 'entire_site' 
  | 'singular' 
  | 'archive' 
  | 'woocommerce' 
  | 'other';

export type ConditionSubTarget = 
  | 'all'
  | 'post'
  | 'page'
  | 'category'
  | 'tag'
  | 'author'
  | 'product'
  | 'search'
  | 'error_404'
  | 'specific_id';

export interface DisplayCondition {
  id: string; // Internal UI ID for reordering/keys
  type: ConditionType;
  target: ConditionTarget;
  subTarget: ConditionSubTarget;
  values: string[]; // IDs or slugs for specific targeting
}

export interface ThemeTemplate {
  id: string;
  website_id: string;
  name: string;
  type: TemplateType;
  status: 'draft' | 'published' | 'scheduled';
  is_active: boolean;
  priority: number;
  conditions: DisplayCondition[];
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
