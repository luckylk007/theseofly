export type ProgrammaticEntityStatus = "draft" | "public" | "private" | "pending_review";

export type ProgrammaticEntityType = "countries" | "cities" | "services";

export interface ProgrammaticSEOFields {
  meta_title?: string;
  meta_description?: string;
  og_image?: string;
  canonical_url?: string;
}

export interface ProgrammaticBaseEntity {
  id: string;
  website_id: string;
  name: string;
  slug: string;
  description?: string | null;
  status: ProgrammaticEntityStatus;
  live_page: boolean;
  deleted_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CountryEntity extends ProgrammaticBaseEntity {
  country_code: string;
  flag_media_id?: string | null;
  flag_url?: string | null;
  seo?: ProgrammaticSEOFields | null;
}

export interface ServiceEntity extends ProgrammaticBaseEntity {
  icon_name?: string | null;
  icon_media_id?: string | null;
  icon_url?: string | null;
  service_category?: string | null;
  seo?: ProgrammaticSEOFields | null;
}

export interface CityEntity extends ProgrammaticBaseEntity {
  country_id: string;
  country?: Pick<CountryEntity, "id" | "name" | "slug" | "country_code"> | null;
  banner_media_id?: string | null;
  banner_url?: string | null;
  draft_page: boolean;
  seo?: ProgrammaticSEOFields | null;
}

export type ProgrammaticEntityMap = {
  countries: CountryEntity;
  cities: CityEntity;
  services: ServiceEntity;
};

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  perPage: number;
}

export interface ProgrammaticListParams {
  page: number;
  perPage: number;
  search: string;
  status: ProgrammaticEntityStatus | "all";
  sortKey: string;
  sortDirection: "asc" | "desc";
  countryId?: string;
}

export interface ImportPreviewRow {
  rowNumber: number;
  data: Record<string, string>;
  errors: string[];
  duplicate: boolean;
}
