import { useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  ChevronsLeftRightEllipsis,
  Download,
  FileJson,
  Globe,
  Loader2,
  Plus,
  Search,
  Settings2,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useWebsite } from "../hooks/useWebsite";
import { useMedia } from "../hooks/useMedia";
import { useProgrammaticSEO } from "../hooks/useProgrammaticSEO";
import { parseCSV, buildImportPreview, downloadTextFile } from "../lib/csv";
import { slugify } from "../lib/slug";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/Dialog";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { cn } from "../lib/utils";
import type {
  CityEntity,
  CountryEntity,
  ImportPreviewRow,
  ProgrammaticEntityStatus,
  ProgrammaticEntityType,
  ServiceEntity,
} from "../types/programmatic-seo";

type ModuleTab = "countries" | "cities" | "services";

type SortDirection = "asc" | "desc";

const STATUS_OPTIONS: Array<{ value: ProgrammaticEntityStatus | "all"; label: string }> = [
  { value: "all", label: "All Statuses" },
  { value: "draft", label: "Draft" },
  { value: "public", label: "Public" },
  { value: "private", label: "Private" },
  { value: "pending_review", label: "Pending Review" },
];

const PER_PAGE_OPTIONS = [10, 25, 50, 100];
const ICON_OPTIONS = ["Search", "Globe", "MapPin", "Sparkles", "Wand2", "Settings2"];

export default function ProgrammaticSEOPage() {
  const { website, loading: websiteLoading } = useWebsite();
  const { media, uploadFile } = useMedia();
  const countriesApi = useProgrammaticSEO("countries", website?.id);
  const citiesApi = useProgrammaticSEO("cities", website?.id);
  const servicesApi = useProgrammaticSEO("services", website?.id);

  const [activeTab, setActiveTab] = useState<ModuleTab>("countries");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isEntityModalOpen, setIsEntityModalOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [entityMode, setEntityMode] = useState<"create" | "edit">("create");
  const [createAnother, setCreateAnother] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const currentApi = activeTab === "countries" ? countriesApi : activeTab === "cities" ? citiesApi : servicesApi;

  const allCountries = countriesApi.result.items as CountryEntity[];

  useEffect(() => {
    setSelectedIds([]);
  }, [activeTab, currentApi.result.page, currentApi.result.perPage, currentApi.params.search, currentApi.params.status]);

  if (websiteLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#155dfc]" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-tight">Programmatic SEO Management</h2>
          <p className="text-slate-500 max-w-3xl">
            Manage countries, cities, and services, then combine them into scalable SEO landing pages.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" className="rounded-full" onClick={() => setIsImportOpen(true)}>
            <Upload className="w-4 h-4" />
            Import Data
          </Button>
          <Button
            className="rounded-full bg-[#155dfc] hover:bg-[#155dfc]/90"
            onClick={() => {
              setEntityMode("create");
              setEditingRecord(null);
              setCreateAnother(false);
              setIsEntityModalOpen(true);
            }}
          >
            <Plus className="w-4 h-4" />
            Add {getModuleLabel(activeTab).slice(0, -1)}
          </Button>
        </div>
      </div>

      {notification && (
        <div className="rounded-2xl border border-green-100 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          {notification}
        </div>
      )}

      <div className="space-y-6">
        <Card className="border-slate-100">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              {(["countries", "cities", "services"] as ModuleTab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-4 py-2.5 rounded-2xl text-sm font-black transition-all",
                    activeTab === tab ? "bg-[#155dfc] text-white shadow-lg shadow-blue-200" : "bg-slate-100 text-slate-500 hover:text-slate-900"
                  )}
                >
                  {getModuleLabel(tab)}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <EntityModuleTable
          module={activeTab}
          api={currentApi}
          countries={allCountries}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          onEdit={(record) => {
            setEditingRecord(record);
            setEntityMode("edit");
            setIsEntityModalOpen(true);
          }}
          onOpenImport={() => setIsImportOpen(true)}
        />
      </div>

      <EntityFormDialog
        isOpen={isEntityModalOpen}
        onClose={() => {
          setIsEntityModalOpen(false);
          setEditingRecord(null);
        }}
        mode={entityMode}
        module={activeTab}
        websiteId={website?.id}
        countries={allCountries}
        media={media}
        uploadFile={uploadFile}
        record={editingRecord}
        onSubmit={async (payload, createNext) => {
          if (entityMode === "edit" && editingRecord) {
            await currentApi.updateItem(editingRecord.id, payload as any);
            setNotification(`${getModuleLabel(activeTab).slice(0, -1)} updated successfully.`);
          } else {
            await currentApi.createItem(payload as any);
            setNotification(`${getModuleLabel(activeTab).slice(0, -1)} created successfully.`);
          }

          if (createNext) {
            setEditingRecord(null);
            setEntityMode("create");
            return;
          }

          setIsEntityModalOpen(false);
          setEditingRecord(null);
        }}
      />

      <ImportDialog
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        module={activeTab}
        websiteId={website?.id}
        countries={allCountries}
        existingItems={currentApi.result.items as any[]}
        onImport={async (rows, onProgress) => {
          const payloads = convertImportRowsToPayload({
            module: activeTab,
            websiteId: website?.id || "",
            countries: allCountries,
            rows,
          });

          const total = payloads.length;
          const batchSize = 100;
          for (let index = 0; index < total; index += batchSize) {
            const batch = payloads.slice(index, index + batchSize);
            await currentApi.bulkInsert(batch as any[]);
            onProgress(Math.round(((index + batch.length) / total) * 100));
          }

          setNotification(`Imported ${payloads.length} ${getModuleLabel(activeTab).toLowerCase()}.`);
          setIsImportOpen(false);
        }}
      />
    </div>
  );
}

function EntityModuleTable({
  module,
  api,
  countries,
  selectedIds,
  setSelectedIds,
  onEdit,
  onOpenImport,
}: {
  module: ModuleTab;
  api: ReturnType<typeof useProgrammaticSEO<ModuleTab>>;
  countries: CountryEntity[];
  selectedIds: string[];
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
  onEdit: (record: any) => void;
  onOpenImport: () => void;
}) {
  const [searchDraft, setSearchDraft] = useState(api.params.search);
  useEffect(() => setSearchDraft(api.params.search), [api.params.search, module]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchDraft !== api.params.search) {
        api.setParams((current) => ({ ...current, page: 1, search: searchDraft }));
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchDraft, api]);

  const items = api.result.items as any[];
  const allSelected = items.length > 0 && items.every((item) => selectedIds.includes(item.id));

  return (
    <Card className="border-slate-100 overflow-hidden">
      <CardHeader className="border-b border-slate-100 bg-slate-50/40">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle>{getModuleLabel(module)}</CardTitle>
              <CardDescription>Search, filter, import, and manage your {getModuleLabel(module).toLowerCase()}.</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" className="rounded-full" onClick={onOpenImport}>
                <Upload className="w-4 h-4" />
                CSV / JSON Import
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
            <div className="flex-1">
              <Input
                value={searchDraft}
                onChange={(e) => setSearchDraft(e.target.value)}
                placeholder={`Search ${getModuleLabel(module).toLowerCase()} by name...`}
                icon={<Search className="w-4 h-4" />}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <select
                className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm"
                value={api.params.status}
                onChange={(e) => api.setParams((current) => ({ ...current, page: 1, status: e.target.value as any }))}
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {module === "cities" && (
                <select
                  className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm"
                  value={api.params.countryId || ""}
                  onChange={(e) => api.setParams((current) => ({ ...current, page: 1, countryId: e.target.value || undefined }))}
                >
                  <option value="">All Countries</option>
                  {countries.map((country) => (
                    <option key={country.id} value={country.id}>
                      {country.name}
                    </option>
                  ))}
                </select>
              )}

              <select
                className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm"
                value={api.params.perPage}
                onChange={(e) => api.setParams((current) => ({ ...current, page: 1, perPage: Number(e.target.value) }))}
              >
                {PER_PAGE_OPTIONS.map((value) => (
                  <option key={value} value={value}>
                    {value} / page
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </CardHeader>

      {selectedIds.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-blue-200 bg-blue-50 px-6 py-3">
          <p className="text-sm font-bold text-[#155dfc]">{selectedIds.length} selected</p>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" onClick={() => api.bulkUpdateStatus(selectedIds, "public")}>
              Make Public
            </Button>
            <Button variant="secondary" size="sm" onClick={() => api.bulkUpdateStatus(selectedIds, "draft")}>
              Move to Draft
            </Button>
            <Button variant="danger" size="sm" onClick={() => api.bulkSoftDelete(selectedIds)}>
              <Trash2 className="w-4 h-4" />
              Soft Delete
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setSelectedIds([])}>
              Clear
            </Button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px]">
          <thead className="sticky top-0 z-10 bg-white shadow-sm">
            <tr className="border-b border-slate-100 text-left text-[11px] font-black uppercase tracking-widest text-slate-500">
              <th className="px-6 py-4">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={() => setSelectedIds(allSelected ? [] : items.map((item) => item.id))}
                  className="h-4 w-4 rounded border-slate-300"
                />
              </th>
              <SortableHeader
                label="Name"
                sortKey="name"
                activeKey={api.params.sortKey}
                activeDirection={api.params.sortDirection}
                onSort={(sortKey, sortDirection) => api.setParams((current) => ({ ...current, sortKey, sortDirection }))}
              />
              <SortableHeader
                label="State / Status"
                sortKey="status"
                activeKey={api.params.sortKey}
                activeDirection={api.params.sortDirection}
                onSort={(sortKey, sortDirection) => api.setParams((current) => ({ ...current, sortKey, sortDirection }))}
              />
              <SortableHeader
                label="Created At"
                sortKey="created_at"
                activeKey={api.params.sortKey}
                activeDirection={api.params.sortDirection}
                onSort={(sortKey, sortDirection) => api.setParams((current) => ({ ...current, sortKey, sortDirection }))}
              />
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {api.loading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <tr key={index}>
                  <td colSpan={5} className="px-6 py-4">
                    <div className="h-12 animate-pulse rounded-2xl bg-slate-100" />
                  </td>
                </tr>
              ))
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-slate-100 bg-slate-50">
                    <ChevronsLeftRightEllipsis className="w-8 h-8 text-slate-300" />
                  </div>
                  <p className="mt-4 font-semibold text-slate-900">No {getModuleLabel(module).toLowerCase()} found</p>
                  <p className="mt-1 text-sm text-slate-500">Try adjusting the search, filters, or import your first dataset.</p>
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(item.id)}
                      onChange={() =>
                        setSelectedIds((current) => current.includes(item.id) ? current.filter((value) => value !== item.id) : [...current, item.id])
                      }
                      className="h-4 w-4 rounded border-slate-300"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="font-bold text-slate-900">{item.name}</div>
                      <div className="text-xs text-slate-400">
                        {module === "countries" && item.country_code ? `${item.country_code} · ` : ""}
                        {module === "cities" && item.country?.name ? `${item.country.name} · ` : ""}
                        /{item.slug}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className={getStatusBadgeClass(item.status)}>{formatStatus(item.status)}</Badge>
                      {item.live_page && (
                        <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
                          Live
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{new Date(item.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
                      Edit
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-100 px-6 py-4 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-slate-500">
          Showing {(api.result.page - 1) * api.result.perPage + 1} to {Math.min(api.result.page * api.result.perPage, api.result.total)} of {api.result.total}
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={api.result.page <= 1} onClick={() => api.setParams((current) => ({ ...current, page: current.page - 1 }))}>
            Previous
          </Button>
          <div className="rounded-xl border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600">
            Page {api.result.page} / {api.totalPages}
          </div>
          <Button variant="outline" size="sm" disabled={api.result.page >= api.totalPages} onClick={() => api.setParams((current) => ({ ...current, page: current.page + 1 }))}>
            Next
          </Button>
        </div>
      </div>
    </Card>
  );
}

function SortableHeader({
  label,
  sortKey,
  activeKey,
  activeDirection,
  onSort,
}: {
  label: string;
  sortKey: string;
  activeKey: string;
  activeDirection: SortDirection;
  onSort: (sortKey: string, direction: SortDirection) => void;
}) {
  return (
    <th className="px-6 py-4">
      <button
        className="inline-flex items-center gap-2"
        onClick={() => onSort(sortKey, activeKey === sortKey && activeDirection === "asc" ? "desc" : "asc")}
      >
        {label}
        <span className="text-slate-300">{activeKey === sortKey ? (activeDirection === "asc" ? "↑" : "↓") : "↕"}</span>
      </button>
    </th>
  );
}

function EntityFormDialog({
  isOpen,
  onClose,
  mode,
  module,
  websiteId,
  countries,
  media,
  uploadFile,
  record,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  module: ModuleTab;
  websiteId?: string;
  countries: CountryEntity[];
  media: any[];
  uploadFile: (file: File, websiteId: string) => Promise<any>;
  record: any;
  onSubmit: (payload: Record<string, any>, createAnother: boolean) => Promise<void>;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [createAnother, setCreateAnother] = useState(false);
  const [form, setForm] = useState<Record<string, any>>({});

  useEffect(() => {
    setCreateAnother(false);
    setForm(buildInitialForm(module, record));
  }, [module, record, isOpen]);

  const imageOptions = media.filter((item) => item.file_type?.startsWith("image/"));

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, field: string) => {
    if (!event.target.files?.[0] || !websiteId) {
      return;
    }

    setIsUploading(true);
    try {
      const uploaded = await uploadFile(event.target.files[0], websiteId);
      setForm((current) => ({
        ...current,
        [`${field}_media_id`]: uploaded.id,
        [`${field}_url`]: uploaded.file_path,
      }));
    } finally {
      setIsUploading(false);
    }
  };

  const urlPreview = buildUrlPreview(module, form, countries);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{mode === "edit" ? "Edit" : "Create"} {getModuleLabel(module).slice(0, -1)}</DialogTitle>
          <DialogDescription>Fill out the fields below to manage SEO-ready programmatic entities.</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 max-h-[65vh] overflow-y-auto pr-1">
          <Field label="Name *">
            <Input
              value={form.name || ""}
              onChange={(e) => setForm((current) => ({ ...current, name: e.target.value, slug: slugify(e.target.value) || current.slug }))}
            />
          </Field>

          {module === "countries" ? (
            <Field label="Country Code *">
              <Input
                value={form.country_code || ""}
                onChange={(e) => setForm((current) => ({ ...current, country_code: e.target.value.toUpperCase() }))}
                maxLength={2}
              />
            </Field>
          ) : module === "cities" ? (
            <Field label="Country *">
              <select
                className="h-11 w-full rounded-xl border border-slate-200 bg-blue-50/30 px-3 text-sm"
                value={form.country_id || ""}
                onChange={(e) => setForm((current) => ({ ...current, country_id: e.target.value }))}
              >
                <option value="">Select a country</option>
                {countries.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.name}
                  </option>
                ))}
              </select>
            </Field>
          ) : (
            <Field label="Service Category">
              <Input value={form.service_category || ""} onChange={(e) => setForm((current) => ({ ...current, service_category: e.target.value }))} />
            </Field>
          )}

          <Field label="Slug *">
            <Input value={form.slug || ""} onChange={(e) => setForm((current) => ({ ...current, slug: slugify(e.target.value) }))} />
          </Field>

          <Field label="Status">
            <select
              className="h-11 w-full rounded-xl border border-slate-200 bg-blue-50/30 px-3 text-sm"
              value={form.status || "draft"}
              onChange={(e) => setForm((current) => ({ ...current, status: e.target.value }))}
            >
              {STATUS_OPTIONS.filter((option) => option.value !== "all").map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>

          <div className="md:col-span-2">
            <Field label="Description">
              <textarea
                className="min-h-[100px] w-full rounded-xl border border-slate-200 bg-blue-50/30 px-4 py-3 text-sm outline-none focus:border-[#155dfc] focus:ring-2 focus:ring-[#155dfc]/20"
                value={form.description || ""}
                onChange={(e) => setForm((current) => ({ ...current, description: e.target.value }))}
              />
            </Field>
          </div>

          {module === "services" && (
            <Field label="Icon Picker">
              <select
                className="h-11 w-full rounded-xl border border-slate-200 bg-blue-50/30 px-3 text-sm"
                value={form.icon_name || ""}
                onChange={(e) => setForm((current) => ({ ...current, icon_name: e.target.value }))}
              >
                <option value="">Select an icon</option>
                {ICON_OPTIONS.map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </select>
            </Field>
          )}

          {module !== "services" ? (
            <Field label={module === "countries" ? "Flag / Icon" : "Banner Image"}>
              <MediaSelector
                field={module === "countries" ? "flag" : "banner"}
                form={form}
                imageOptions={imageOptions}
                onChange={setForm}
                onUploadClick={() => fileInputRef.current?.click()}
              />
            </Field>
          ) : (
            <Field label="Icon Image">
              <MediaSelector
                field="icon"
                form={form}
                imageOptions={imageOptions}
                onChange={setForm}
                onUploadClick={() => fileInputRef.current?.click()}
              />
            </Field>
          )}

          <Field label="Meta Title">
            <Input
              value={form.seo?.meta_title || ""}
              onChange={(e) => setForm((current) => ({ ...current, seo: { ...(current.seo || {}), meta_title: e.target.value } }))}
            />
          </Field>
          <Field label="Meta Description">
            <Input
              value={form.seo?.meta_description || ""}
              onChange={(e) => setForm((current) => ({ ...current, seo: { ...(current.seo || {}), meta_description: e.target.value } }))}
            />
          </Field>
          <Field label="OG Image URL">
            <Input
              value={form.seo?.og_image || ""}
              onChange={(e) => setForm((current) => ({ ...current, seo: { ...(current.seo || {}), og_image: e.target.value } }))}
            />
          </Field>
          <Field label="Canonical URL">
            <Input
              value={form.seo?.canonical_url || ""}
              onChange={(e) => setForm((current) => ({ ...current, seo: { ...(current.seo || {}), canonical_url: e.target.value } }))}
            />
          </Field>

          <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">Dynamic URL Preview</p>
            <p className="mt-2 text-sm font-semibold text-slate-800">{urlPreview}</p>
          </div>

          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <ToggleField
              title="Live Page"
              description="Allow this entity to be used for live landing page generation."
              checked={!!form.live_page}
              onChange={(checked) => setForm((current) => ({ ...current, live_page: checked }))}
            />
            {module === "cities" && (
              <ToggleField
                title="Draft Page"
                description="Keep newly generated city pages in draft mode until reviewed."
                checked={!!form.draft_page}
                onChange={(checked) => setForm((current) => ({ ...current, draft_page: checked }))}
              />
            )}
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => handleImageUpload(event, module === "countries" ? "flag" : module === "cities" ? "banner" : "icon")}
        />

        <DialogFooter className="gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="secondary"
            onClick={() => setCreateAnother((value) => !value)}
            className={cn(createAnother && "ring-2 ring-[#155dfc]/20")}
          >
            {createAnother ? <Check className="w-4 h-4" /> : null}
            Create & Create Another
          </Button>
          <Button
            isLoading={isSubmitting || isUploading}
            onClick={async () => {
              if (!websiteId) {
                return;
              }

              setIsSubmitting(true);
              try {
                const payload = sanitizeEntityPayload(module, websiteId, form);
                await onSubmit(payload, createAnother && mode === "create");
                if (createAnother && mode === "create") {
                  setForm(buildInitialForm(module, null));
                }
              } finally {
                setIsSubmitting(false);
              }
            }}
          >
            {mode === "edit" ? "Save Changes" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function MediaSelector({
  field,
  form,
  imageOptions,
  onChange,
  onUploadClick,
}: {
  field: string;
  form: Record<string, any>;
  imageOptions: any[];
  onChange: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  onUploadClick: () => void;
}) {
  return (
    <div className="space-y-2">
      <select
        className="h-11 w-full rounded-xl border border-slate-200 bg-blue-50/30 px-3 text-sm"
        value={form[`${field}_media_id`] || ""}
        onChange={(e) => {
          const selected = imageOptions.find((item) => item.id === e.target.value);
          onChange((current) => ({
            ...current,
            [`${field}_media_id`]: selected?.id || null,
            [`${field}_url`]: selected?.file_path || null,
          }));
        }}
      >
        <option value="">Select from media library</option>
        {imageOptions.map((item) => (
          <option key={item.id} value={item.id}>
            {item.file_name}
          </option>
        ))}
      </select>
      <div className="flex items-center justify-between gap-3">
        <Button variant="outline" size="sm" onClick={onUploadClick}>
          Upload New
        </Button>
        {form[`${field}_url`] && <span className="truncate text-xs text-slate-400">{form[`${field}_url`]}</span>}
      </div>
    </div>
  );
}

function ToggleField({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
      <div>
        <p className="font-bold text-slate-900">{title}</p>
        <p className="text-xs text-slate-500 mt-1">{description}</p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={cn("h-7 w-12 rounded-full transition-colors", checked ? "bg-[#155dfc]" : "bg-slate-300")}
      >
        <span className={cn("block h-5 w-5 rounded-full bg-white transition-transform", checked ? "translate-x-6 ml-1" : "translate-x-1")} />
      </button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-bold text-slate-700">{label}</label>
      {children}
    </div>
  );
}

function ImportDialog({
  isOpen,
  onClose,
  module,
  websiteId,
  countries,
  existingItems,
  onImport,
}: {
  isOpen: boolean;
  onClose: () => void;
  module: ModuleTab;
  websiteId?: string;
  countries: CountryEntity[];
  existingItems: any[];
  onImport: (rows: ImportPreviewRow[], onProgress: (progress: number) => void) => Promise<void>;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [activeSource, setActiveSource] = useState<"csv" | "json">("csv");
  const [jsonInput, setJsonInput] = useState("");
  const [previewRows, setPreviewRows] = useState<ImportPreviewRow[]>([]);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const sampleTemplate = getSampleTemplate(module);

  const validateRows = (rows: Record<string, string>[]) => {
    const preview = buildImportPreview(
      rows,
      (row) => validateImportRow(module, row, countries),
      (row) => slugify(row.slug || row.name || "")
    ).map((row) => ({
      ...row,
      duplicate: row.duplicate || existingItems.some((item) => item.slug === slugify(row.data.slug || row.data.name || "")),
    }));

    setPreviewRows(preview);
  };

  const handleCsvFile = async (file?: File | null) => {
    if (!file) return;
    const text = await file.text();
    const parsed = parseCSV(text);
    validateRows(parsed.rows);
  };

  const handleJsonPreview = () => {
    try {
      const data = JSON.parse(jsonInput);
      if (!Array.isArray(data)) {
        throw new Error("JSON input must be an array.");
      }
      const rows = data.map((item) => Object.fromEntries(Object.entries(item).map(([key, value]) => [key, String(value ?? "")])));
      validateRows(rows);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Invalid JSON.");
    }
  };

  const validRows = previewRows.filter((row) => row.errors.length === 0 && !row.duplicate);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>Import {getModuleLabel(module)}</DialogTitle>
          <DialogDescription>Upload a CSV file or paste JSON batch data, validate it, and import in optimized batches.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2 rounded-2xl bg-slate-100 p-1 w-fit">
            <button onClick={() => setActiveSource("csv")} className={cn("rounded-xl px-4 py-2 text-sm font-black", activeSource === "csv" ? "bg-white text-[#155dfc]" : "text-slate-500")}>CSV Upload</button>
            <button onClick={() => setActiveSource("json")} className={cn("rounded-xl px-4 py-2 text-sm font-black", activeSource === "json" ? "bg-white text-[#155dfc]" : "text-slate-500")}>Batch JSON</button>
          </div>

          {activeSource === "csv" ? (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleCsvFile(e.dataTransfer.files?.[0] || null);
              }}
              onClick={() => fileRef.current?.click()}
              className="rounded-[28px] border-2 border-dashed border-slate-200 bg-slate-50/60 px-6 py-14 text-center cursor-pointer hover:border-[#155dfc] hover:bg-blue-50/40 transition-all"
            >
              <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={(e) => handleCsvFile(e.target.files?.[0] || null)} />
              <Upload className="mx-auto h-10 w-10 text-slate-300" />
              <p className="mt-4 font-bold text-slate-900">Drag & drop CSV here</p>
              <p className="mt-1 text-sm text-slate-500">or click to select a file</p>
            </div>
          ) : (
            <div className="space-y-3">
              <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                className="min-h-[180px] w-full rounded-2xl border border-slate-200 bg-blue-50/30 px-4 py-3 font-mono text-sm outline-none focus:border-[#155dfc] focus:ring-2 focus:ring-[#155dfc]/20"
                placeholder='[{"name":"Delhi","country":"India"}]'
              />
              <Button variant="outline" onClick={handleJsonPreview}>
                <FileJson className="w-4 h-4" />
                Preview JSON
              </Button>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => downloadTextFile(`${module}-sample.csv`, sampleTemplate, "text/csv;charset=utf-8")}>
              <Download className="w-4 h-4" />
              Download Sample CSV
            </Button>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500">
              Valid rows: <span className="font-bold text-slate-900">{validRows.length}</span> / {previewRows.length}
            </div>
          </div>

          {error && <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

          <div className="rounded-2xl border border-slate-100">
            <div className="max-h-[320px] overflow-auto">
              <table className="w-full min-w-[720px]">
                <thead className="sticky top-0 bg-white border-b border-slate-100 text-left text-[11px] font-black uppercase tracking-widest text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Row</th>
                    <th className="px-4 py-3">Preview</th>
                    <th className="px-4 py-3">Validation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {previewRows.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-4 py-12 text-center text-sm text-slate-400">
                        Upload CSV or preview JSON to see import rows here.
                      </td>
                    </tr>
                  ) : (
                    previewRows.map((row) => (
                      <tr key={row.rowNumber} className={cn(row.errors.length > 0 || row.duplicate ? "bg-red-50/50" : "bg-green-50/20")}>
                        <td className="px-4 py-3 text-sm font-bold text-slate-900">#{row.rowNumber}</td>
                        <td className="px-4 py-3 text-xs text-slate-600">
                          {Object.entries(row.data).map(([key, value]) => (
                            <div key={key}>
                              <span className="font-semibold text-slate-900">{key}:</span> {value || "—"}
                            </div>
                          ))}
                        </td>
                        <td className="px-4 py-3 text-xs">
                          {row.duplicate && <div className="text-red-600">Duplicate slug detected.</div>}
                          {row.errors.map((item) => (
                            <div key={item} className="text-red-600">
                              {item}
                            </div>
                          ))}
                          {!row.duplicate && row.errors.length === 0 && <div className="text-green-700">Ready to import.</div>}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {isImporting && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>Importing...</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100">
                <div className="h-2 rounded-full bg-[#155dfc]" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            isLoading={isImporting}
            disabled={!websiteId || validRows.length === 0}
            onClick={async () => {
              setIsImporting(true);
              setProgress(0);
              try {
                await onImport(validRows, setProgress);
              } finally {
                setIsImporting(false);
              }
            }}
          >
            Import Valid Rows
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function buildInitialForm(module: ModuleTab, record: any) {
  if (record) {
    return {
      ...record,
      seo: record.seo || {},
      country_id: record.country_id || record.country?.id || "",
    };
  }

  const common = {
    name: "",
    slug: "",
    description: "",
    status: "draft",
    live_page: false,
    seo: {
      meta_title: "",
      meta_description: "",
      og_image: "",
      canonical_url: "",
    },
  };

  if (module === "countries") {
    return { ...common, country_code: "", flag_media_id: "", flag_url: "" };
  }

  if (module === "cities") {
    return { ...common, country_id: "", banner_media_id: "", banner_url: "", draft_page: true };
  }

  return { ...common, icon_name: "", icon_media_id: "", icon_url: "", service_category: "" };
}

function sanitizeEntityPayload(module: ModuleTab, websiteId: string, form: Record<string, any>) {
  const common = {
    website_id: websiteId,
    name: form.name,
    slug: slugify(form.slug || form.name),
    description: form.description || null,
    status: form.status,
    live_page: !!form.live_page,
    seo: form.seo || {},
  };

  if (module === "countries") {
    return {
      ...common,
      country_code: String(form.country_code || "").toUpperCase(),
      flag_media_id: form.flag_media_id || null,
      flag_url: form.flag_url || null,
    };
  }

  if (module === "cities") {
    return {
      ...common,
      country_id: form.country_id,
      banner_media_id: form.banner_media_id || null,
      banner_url: form.banner_url || null,
      draft_page: !!form.draft_page,
    };
  }

  return {
    ...common,
    icon_name: form.icon_name || null,
    icon_media_id: form.icon_media_id || null,
    icon_url: form.icon_url || null,
    service_category: form.service_category || null,
  };
}

function buildUrlPreview(module: ModuleTab, form: Record<string, any>, countries: CountryEntity[]) {
  if (module === "countries") {
    return `/${form.slug || "country-slug"}`;
  }

  if (module === "cities") {
    const country = countries.find((item) => item.id === form.country_id);
    return `/${country?.slug || "country"}/${form.slug || "city"}/seo-services`;
  }

  return `/services/${form.slug || "service-slug"}`;
}

function getModuleLabel(module: ModuleTab) {
  switch (module) {
    case "countries":
      return "Countries";
    case "cities":
      return "Cities";
    case "services":
      return "Services";
  }
}

function formatStatus(status: ProgrammaticEntityStatus) {
  return status.replace("_", " ");
}

function getStatusBadgeClass(status: ProgrammaticEntityStatus) {
  if (status === "public") return "bg-green-50 text-green-700";
  if (status === "pending_review") return "bg-amber-50 text-amber-700";
  if (status === "private") return "bg-slate-100 text-slate-700";
  return "bg-blue-50 text-blue-700";
}

function getSampleTemplate(module: ModuleTab) {
  if (module === "countries") {
    return "name,country_code,slug,description,status\nIndia,IN,india,Indian market pages,public\nUnited States,US,usa,US service pages,draft";
  }
  if (module === "cities") {
    return "name,country,slug,description,status\nDelhi,India,delhi,Capital city pages,public\nNew York,United States,new-york,NYC pages,draft";
  }
  return "name,slug,description,service_category,status\nSEO,seo,Search engine optimization service,Marketing,public\nWeb Design,web-design,Website design service,Creative,draft";
}

function validateImportRow(module: ModuleTab, row: Record<string, string>, countries: CountryEntity[]) {
  const errors: string[] = [];
  if (!row.name) {
    errors.push("Name is required.");
  }
  if (module === "countries" && !row.country_code) {
    errors.push("Country code is required.");
  }
  if (module === "cities") {
    if (!row.country) {
      errors.push("Country is required.");
    } else if (!countries.some((country) => country.name.toLowerCase() === row.country.toLowerCase() || country.slug === slugify(row.country))) {
      errors.push("Country does not exist.");
    }
  }
  return errors;
}

function convertImportRowsToPayload({
  module,
  websiteId,
  countries,
  rows,
}: {
  module: ModuleTab;
  websiteId: string;
  countries: CountryEntity[];
  rows: ImportPreviewRow[];
}) {
  return rows.map((row) => {
    const data = row.data;
    if (module === "countries") {
      return {
        website_id: websiteId,
        name: data.name,
        country_code: String(data.country_code || "").toUpperCase(),
        slug: slugify(data.slug || data.name),
        description: data.description || null,
        status: (data.status || "draft") as ProgrammaticEntityStatus,
        live_page: String(data.live_page || "").toLowerCase() === "true" || data.status === "public",
        seo: {},
      };
    }

    if (module === "cities") {
      const country = countries.find((item) => item.name.toLowerCase() === data.country?.toLowerCase() || item.slug === slugify(data.country || ""));
      return {
        website_id: websiteId,
        country_id: country?.id,
        name: data.name,
        slug: slugify(data.slug || data.name),
        description: data.description || null,
        status: (data.status || "draft") as ProgrammaticEntityStatus,
        live_page: String(data.live_page || "").toLowerCase() === "true" || data.status === "public",
        draft_page: true,
        seo: {},
      };
    }

    return {
      website_id: websiteId,
      name: data.name,
      slug: slugify(data.slug || data.name),
      description: data.description || null,
      service_category: data.service_category || null,
      status: (data.status || "draft") as ProgrammaticEntityStatus,
      live_page: String(data.live_page || "").toLowerCase() === "true" || data.status === "public",
      seo: {},
    };
  });
}
