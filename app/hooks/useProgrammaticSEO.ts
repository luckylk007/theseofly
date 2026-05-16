import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuthStore } from "../stores/useAuthStore";
import type {
  PaginatedResult,
  ProgrammaticEntityMap,
  ProgrammaticEntityStatus,
  ProgrammaticEntityType,
  ProgrammaticListParams,
} from "../types/programmatic-seo";

type SortableMap = Record<string, string>;

const SORT_COLUMN_MAP: Record<ProgrammaticEntityType, SortableMap> = {
  countries: {
    name: "name",
    status: "status",
    created_at: "created_at",
  },
  cities: {
    name: "name",
    status: "status",
    created_at: "created_at",
  },
  services: {
    name: "name",
    status: "status",
    created_at: "created_at",
  },
};

const DEFAULT_PARAMS: ProgrammaticListParams = {
  page: 1,
  perPage: 10,
  search: "",
  status: "all",
  sortKey: "created_at",
  sortDirection: "desc",
};

export function useProgrammaticSEO<TType extends ProgrammaticEntityType>(
  entityType: TType,
  websiteId?: string
) {
  const { user } = useAuthStore();
  const [result, setResult] = useState<PaginatedResult<ProgrammaticEntityMap[TType]>>({
    items: [],
    total: 0,
    page: 1,
    perPage: 10,
  });
  const [params, setParams] = useState<ProgrammaticListParams>(DEFAULT_PARAMS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tableName = entityType;

  const fetchItems = useCallback(async () => {
    if (!user || !websiteId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from(tableName)
        .select(entityType === "cities" ? "*, country:countries(id, name, slug, country_code)" : "*", {
          count: "exact",
        })
        .eq("website_id", websiteId)
        .is("deleted_at", null);

      if (params.search.trim()) {
        query = query.ilike("name", `%${params.search.trim()}%`);
      }

      if (params.status !== "all") {
        query = query.eq("status", params.status);
      }

      if (entityType === "cities" && params.countryId) {
        query = query.eq("country_id", params.countryId);
      }

      const sortColumn = SORT_COLUMN_MAP[entityType][params.sortKey] || "created_at";
      query = query.order(sortColumn, { ascending: params.sortDirection === "asc" });

      const from = (params.page - 1) * params.perPage;
      const to = from + params.perPage - 1;

      const { data, count, error: fetchError } = await query.range(from, to);
      if (fetchError) {
        throw fetchError;
      }

      setResult({
        items: ((data as any[]) || []) as ProgrammaticEntityMap[TType][],
        total: count || 0,
        page: params.page,
        perPage: params.perPage,
      });
    } catch (err: any) {
      setError(err.message || "Failed to fetch records.");
    } finally {
      setLoading(false);
    }
  }, [entityType, params, tableName, user, websiteId]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const createItem = async (payload: Partial<ProgrammaticEntityMap[TType]>) => {
    const { data, error: createError } = await supabase.from(tableName).insert([payload as any]).select().single();
    if (createError) throw createError;
    await fetchItems();
    return data as unknown as ProgrammaticEntityMap[TType];
  };

  const updateItem = async (id: string, payload: Partial<ProgrammaticEntityMap[TType]>) => {
    const { data, error: updateError } = await supabase.from(tableName).update(payload as any).eq("id", id).select().single();
    if (updateError) throw updateError;
    await fetchItems();
    return data as unknown as ProgrammaticEntityMap[TType];
  };

  const bulkUpdateStatus = async (ids: string[], status: ProgrammaticEntityStatus) => {
    const { error: updateError } = await supabase.from(tableName).update({ status }).in("id", ids);
    if (updateError) throw updateError;
    await fetchItems();
  };

  const bulkSoftDelete = async (ids: string[]) => {
    const { error: deleteError } = await supabase
      .from(tableName)
      .update({ deleted_at: new Date().toISOString() })
      .in("id", ids);
    if (deleteError) throw deleteError;
    await fetchItems();
  };

  const bulkInsert = async (rows: Partial<ProgrammaticEntityMap[TType]>[]) => {
    const batchSize = 100;
    for (let i = 0; i < rows.length; i += batchSize) {
      const batch = rows.slice(i, i + batchSize);
      const { error: insertError } = await supabase.from(tableName).insert(batch as any[]);
      if (insertError) throw insertError;
    }
    await fetchItems();
  };

  const resetFilters = () => setParams(DEFAULT_PARAMS);

  return {
    result,
    params,
    setParams,
    loading,
    error,
    fetchItems,
    createItem,
    updateItem,
    bulkUpdateStatus,
    bulkSoftDelete,
    bulkInsert,
    resetFilters,
    totalPages: useMemo(() => Math.max(1, Math.ceil(result.total / result.perPage)), [result.total, result.perPage]),
  };
}
