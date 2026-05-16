import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  Layout,
  Settings,
  MoreVertical,
  Trash2,
  Copy,
  X,
  PlusCircle,
  Globe,
  FileText,
  Archive,
  ShoppingCart,
  AlertCircle,
  Loader2,
  ChevronDown,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTemplates } from "../hooks/useTemplates";
import { useWebsite } from "../hooks/useWebsite";
import { usePages } from "../hooks/usePages";
import { useTaxonomies } from "../hooks/useTaxonomies";
import { useProgrammaticSEO } from "../hooks/useProgrammaticSEO";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { Card } from "../components/ui/Card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/Dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../components/ui/DropdownMenu";
import { cn } from "../lib/utils";
import {
  buildTemplateLabelMaps,
  createEmptyTemplateConditions,
  describeTemplateConditions,
  normalizeTemplateConditions,
} from "../lib/templateConditions";
import type { CMSPage } from "../types/cms";
import type {
  ThemeTemplate,
  TemplateType,
  TemplateConditionField,
  TemplateConditionRule,
  TemplateConditions,
} from "../types/theme-builder";
import { TEMPLATE_TYPE_LABELS } from "../types/theme-builder";

const PAGE_TYPE_OPTIONS = [
  { value: "single_page", label: "Single Page" },
  { value: "single_post", label: "Single Post" },
];

const POST_TYPE_OPTIONS = [
  { value: "page", label: "Page" },
  { value: "post", label: "Post" },
  { value: "blog", label: "Blog" },
  { value: "news", label: "News" },
  { value: "newsletter", label: "Newsletter" },
  { value: "case-study", label: "Case Study" },
];

export default function ThemeBuilderDashboard() {
  const { website, loading: websiteLoading } = useWebsite();
  const { pages } = usePages(website?.id);
  const { taxonomies } = useTaxonomies(website?.id);
  const { result: countryResult } = useProgrammaticSEO("countries", website?.id);
  const { result: cityResult } = useProgrammaticSEO("cities", website?.id);
  const { result: serviceResult } = useProgrammaticSEO("services", website?.id);
  const {
    templates,
    loading,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    duplicateTemplate,
    toggleActive,
  } = useTemplates(website?.id);

  const [activeType, setActiveType] = useState<TemplateType | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isConditionsModalOpen, setIsConditionsModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ThemeTemplate | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTemplateData, setNewTemplateData] = useState({
    name: "",
    type: "single_page" as TemplateType,
  });

  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      const matchesType = activeType === "all" || template.type === activeType;
      const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [templates, activeType, searchTerm]);

  const conditionLabels = useMemo(() => {
    const pageLabels = buildTemplateLabelMaps(pages);
    return {
      ...pageLabels,
      category: Object.fromEntries(
        taxonomies
          .filter((taxonomy) => taxonomy.type === "category")
          .flatMap((taxonomy) => [
            [taxonomy.id, taxonomy.name],
            [taxonomy.slug, taxonomy.name],
          ])
      ),
      tag: Object.fromEntries(
        taxonomies
          .filter((taxonomy) => taxonomy.type === "tag")
          .flatMap((taxonomy) => [
            [taxonomy.id, taxonomy.name],
            [taxonomy.slug, taxonomy.name],
          ])
      ),
      country: Object.fromEntries(countryResult.items.flatMap((country: any) => [[country.id, country.name], [country.slug, country.name]])),
      city: Object.fromEntries(cityResult.items.flatMap((city: any) => [[city.id, city.name], [city.slug, city.name]])),
      service: Object.fromEntries(serviceResult.items.flatMap((service: any) => [[service.id, service.name], [service.slug, service.name]])),
    };
  }, [pages, taxonomies, countryResult.items, cityResult.items, serviceResult.items]);

  const typeGroups = [
    { id: "all", label: "All Templates", icon: Layout },
    { id: "header", label: "Headers", icon: Globe },
    { id: "footer", label: "Footers", icon: Globe },
    { id: "single_post", label: "Single Posts", icon: FileText },
    { id: "single_page", label: "Single Pages", icon: FileText },
    { id: "archive", label: "Archives", icon: Archive },
    { id: "woo_product", label: "Products", icon: ShoppingCart },
    { id: "error_404", label: "Error 404", icon: AlertCircle },
  ];

  const handleCreate = async () => {
    if (!website?.id || !newTemplateData.name) {
      return;
    }

    try {
      await addTemplate({
        website_id: website.id,
        name: newTemplateData.name,
        type: newTemplateData.type,
        status: "draft",
        is_active: true,
        priority: 0,
        conditions: createEmptyTemplateConditions(),
        content: { sections: [] },
      });
      setIsCreateModalOpen(false);
      setNewTemplateData({ name: "", type: "single_page" });
    } catch (err: any) {
      console.error("Failed to create template:", err);
      alert("Failed to create template: " + (err.message || "Unknown error"));
    }
  };

  if (loading || websiteLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-[#155dfc] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-tight">Theme Builder</h2>
          <p className="text-slate-500">Manage templates, condition rules, and priority overrides.</p>
        </div>
        <Button
          className="gap-2 bg-[#155dfc] hover:bg-[#155dfc]/90 rounded-full h-11 px-6 shadow-lg shadow-blue-200"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="w-5 h-5" />
          Add New Template
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-1 space-y-1">
          {typeGroups.map((group) => (
            <button
              key={group.id}
              onClick={() => setActiveType(group.id as TemplateType | "all")}
              className={cn(
                "w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all",
                activeType === group.id
                  ? "bg-white text-[#155dfc] shadow-sm border border-slate-200"
                  : "text-slate-500 hover:bg-slate-100"
              )}
            >
              <div className="flex items-center gap-3">
                <group.icon className="w-4 h-4" />
                {group.label}
              </div>
              <span className="text-[10px] bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded-md">
                {group.id === "all" ? templates.length : templates.filter((template) => template.type === group.id).length}
              </span>
            </button>
          ))}
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search className="w-4 h-4" />}
                className="h-11 bg-blue-50/30 border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredTemplates.length === 0 ? (
              <Card className="p-16 text-center border-dashed border-slate-200 bg-slate-50/50">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <Layout className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="font-bold text-slate-900">No templates found</h3>
                <p className="text-sm text-slate-500 mt-1">Start by creating a new template for your site.</p>
                <Button
                  variant="outline"
                  className="mt-6 rounded-full border-slate-200"
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  Create Your First Template
                </Button>
              </Card>
            ) : (
              filteredTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  previewText={describeTemplateConditions(template.conditions, conditionLabels)}
                  onEditConditions={() => {
                    setSelectedTemplate(template);
                    setIsConditionsModalOpen(true);
                  }}
                  onToggleActive={(value) => toggleActive(template.id, value)}
                  onDuplicate={() => duplicateTemplate(template.id)}
                  onDelete={() => deleteTemplate(template.id)}
                />
              ))
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isConditionsModalOpen && selectedTemplate && (
          <ConditionsModal
            template={selectedTemplate}
            pages={pages}
            taxonomies={taxonomies}
            countries={countryResult.items as any[]}
            cities={cityResult.items as any[]}
            services={serviceResult.items as any[]}
            isOpen={isConditionsModalOpen}
            onClose={() => {
              setIsConditionsModalOpen(false);
              setSelectedTemplate(null);
            }}
            onSave={async (payload) => {
              await updateTemplate(selectedTemplate.id, payload);
              setIsConditionsModalOpen(false);
              setSelectedTemplate(null);
            }}
          />
        )}
      </AnimatePresence>

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Theme Template</DialogTitle>
            <DialogDescription>Select the type of template you want to create.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Template Name</label>
              <Input
                value={newTemplateData.name}
                onChange={(e) => setNewTemplateData({ ...newTemplateData, name: e.target.value })}
                placeholder="e.g. Main Header"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Template Type</label>
              <select
                value={newTemplateData.type}
                onChange={(e) => setNewTemplateData({ ...newTemplateData, type: e.target.value as TemplateType })}
                className="w-full h-11 px-3 bg-blue-50/30 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#155dfc]/20 focus:border-[#155dfc]"
              >
                {Object.entries(TEMPLATE_TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} className="bg-[#155dfc] hover:bg-[#155dfc]/90 min-w-[120px]">
              Create Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function TemplateCard({
  template,
  previewText,
  onEditConditions,
  onToggleActive,
  onDuplicate,
  onDelete,
}: {
  template: ThemeTemplate;
  previewText: string;
  onEditConditions: () => void;
  onToggleActive: (value: boolean) => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  return (
    <Card className="p-5 border-slate-100 hover:border-[#155dfc]/30 hover:shadow-xl hover:shadow-blue-900/5 transition-all group">
      <div className="flex items-start justify-between gap-6">
        <div className="flex items-start gap-4 min-w-0">
          <div
            className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors shrink-0",
              template.is_active ? "bg-blue-50 text-[#155dfc]" : "bg-slate-50 text-slate-400"
            )}
          >
            <Layout className="w-6 h-6" />
          </div>
          <div className="min-w-0 space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="font-black text-slate-900 truncate">{template.name}</h3>
              <Badge
                variant="outline"
                className="bg-slate-50 text-slate-500 border-slate-200 text-[10px] font-black uppercase tracking-tighter shrink-0"
              >
                {TEMPLATE_TYPE_LABELS[template.type]}
              </Badge>
              {template.status === "published" ? (
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" title="Published" />
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300" title="Draft" />
              )}
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={onEditConditions}
                className="text-[11px] font-bold text-[#155dfc] hover:underline flex items-center gap-1.5 bg-blue-50/50 px-2 py-0.5 rounded-md"
              >
                <Settings className="w-3 h-3" />
                {template.conditions.rules.length > 0
                  ? `${template.conditions.rules.length} Conditions Assigned`
                  : "Add Display Conditions"}
              </button>
              <div className="h-3 w-px bg-slate-200" />
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Priority: {template.priority}</p>
            </div>
            <p className="text-sm text-slate-500 max-w-3xl">{previewText}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-1">Active</span>
            <button
              onClick={() => onToggleActive(!template.is_active)}
              className={cn(
                "w-10 h-6 rounded-full relative transition-colors duration-300",
                template.is_active ? "bg-[#155dfc]" : "bg-slate-200"
              )}
            >
              <div
                className={cn(
                  "absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 shadow-sm",
                  template.is_active ? "translate-x-4" : ""
                )}
              />
            </button>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-50">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 p-2 rounded-2xl border-slate-100 shadow-2xl">
              <DropdownMenuItem className="rounded-xl gap-3 font-bold text-slate-700 h-10" onClick={onDuplicate}>
                <Copy className="w-4 h-4" /> Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-xl gap-3 font-bold text-slate-700 h-10" onClick={onEditConditions}>
                <Globe className="w-4 h-4" /> Edit Conditions
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-2" />
              <DropdownMenuItem className="rounded-xl gap-3 font-bold text-red-600 focus:text-red-600 focus:bg-red-50 h-10" onClick={onDelete}>
                <Trash2 className="w-4 h-4" /> Delete Template
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  );
}

function ConditionsModal({
  template,
  pages,
  taxonomies,
  countries,
  cities,
  services,
  isOpen,
  onClose,
  onSave,
}: {
  template: ThemeTemplate;
  pages: CMSPage[];
  taxonomies: Array<{ id: string; name: string; slug: string; type: "category" | "tag" }>;
  countries: Array<{ id: string; name: string; slug: string }>;
  cities: Array<{ id: string; name: string; slug: string }>;
  services: Array<{ id: string; name: string; slug: string }>;
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: Partial<ThemeTemplate>) => Promise<void>;
}) {
  const [conditions, setConditions] = useState<TemplateConditions>(normalizeTemplateConditions(template.conditions));
  const [priority, setPriority] = useState(template.priority);
  const [isSaving, setIsSaving] = useState(false);

  const labelMap = useMemo(() => {
    const pageLabels = buildTemplateLabelMaps(pages);
    return {
      ...pageLabels,
      category: Object.fromEntries(
        taxonomies
          .filter((taxonomy) => taxonomy.type === "category")
          .flatMap((taxonomy) => [
            [taxonomy.id, taxonomy.name],
            [taxonomy.slug, taxonomy.name],
          ])
      ),
      tag: Object.fromEntries(
        taxonomies
          .filter((taxonomy) => taxonomy.type === "tag")
          .flatMap((taxonomy) => [
            [taxonomy.id, taxonomy.name],
            [taxonomy.slug, taxonomy.name],
          ])
      ),
      country: Object.fromEntries(countries.flatMap((country) => [[country.id, country.name], [country.slug, country.name]])),
      city: Object.fromEntries(cities.flatMap((city) => [[city.id, city.name], [city.slug, city.name]])),
      service: Object.fromEntries(services.flatMap((service) => [[service.id, service.name], [service.slug, service.name]])),
    };
  }, [pages, taxonomies, countries, cities, services]);

  const addRule = () => {
    const rule: TemplateConditionRule = {
      id: Math.random().toString(36).slice(2),
      type: "include",
      field: "page_type",
      values: ["single_page"],
    };
    setConditions((current) => ({ ...current, rules: [...current.rules, rule] }));
  };

  const updateRule = (id: string, updates: Partial<TemplateConditionRule>) => {
    setConditions((current) => ({
      ...current,
      rules: current.rules.map((rule) => (rule.id === id ? { ...rule, ...updates } : rule)),
    }));
  };

  const removeRule = (id: string) => {
    setConditions((current) => ({
      ...current,
      rules: current.rules.filter((rule) => rule.id !== id),
    }));
  };

  const livePreview = describeTemplateConditions(conditions, labelMap);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-white w-full max-w-5xl rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-8 border-b border-slate-100 flex items-start justify-between shrink-0 gap-6">
          <div className="space-y-3">
            <div>
              <h3 className="text-xl font-black text-slate-900">Conditions</h3>
              <p className="text-sm text-slate-500 font-medium mt-1">
                Template: <span className="font-bold text-[#155dfc]">{template.name}</span>
              </p>
            </div>
            <div className="rounded-2xl border border-blue-100 bg-blue-50/60 px-4 py-3">
              <p className="text-[11px] font-black uppercase tracking-widest text-[#155dfc]">Live Preview</p>
              <p className="text-sm text-slate-700 mt-1">{livePreview}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Logic</label>
              <select
                value={conditions.match}
                onChange={(e) => setConditions((current) => ({ ...current, match: e.target.value as "all" | "any" }))}
                className="w-full h-11 px-3 bg-blue-50/30 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#155dfc]/20 focus:border-[#155dfc]"
              >
                <option value="all">Match ALL Conditions (AND)</option>
                <option value="any">Match ANY Condition (OR)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Template Priority</label>
              <Input
                type="number"
                value={String(priority)}
                onChange={(e) => setPriority(Number(e.target.value || 0))}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Priority Guide</label>
              <div className="h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center text-sm text-slate-500">
                Specific page rules outrank category and default rules automatically.
              </div>
            </div>
          </div>

          {conditions.rules.length === 0 ? (
            <div className="text-center py-12 bg-slate-50/50 rounded-[32px] border-2 border-dashed border-slate-200">
              <Globe className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h4 className="font-bold text-slate-900">No conditions set</h4>
              <p className="text-sm text-slate-500 mt-1">Add rules for categories, tags, post types, pages, or slugs.</p>
              <Button variant="outline" className="mt-6 rounded-full border-slate-200 gap-2 font-bold" onClick={addRule}>
                <PlusCircle className="w-4 h-4" /> Add Condition
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {conditions.rules.map((rule) => (
                <ConditionRuleEditor
                  key={rule.id}
                  rule={rule}
                  pages={pages}
                  taxonomies={taxonomies}
                  countries={countries}
                  cities={cities}
                  services={services}
                  onChange={(updates) => updateRule(rule.id, updates)}
                  onRemove={() => removeRule(rule.id)}
                />
              ))}

              <button
                onClick={addRule}
                className="w-full py-4 border-2 border-dashed border-slate-200 rounded-[32px] text-slate-400 font-bold text-sm hover:border-[#155dfc] hover:text-[#155dfc] hover:bg-blue-50/50 transition-all flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                Add Another Condition
              </button>
            </div>
          )}
        </div>

        <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between shrink-0">
          <div className="text-sm text-slate-500">
            Default fallback applies automatically when no rule matches.
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="font-bold text-slate-500" onClick={onClose}>
              Cancel
            </Button>
            <Button
              className="bg-[#155dfc] hover:bg-[#155dfc]/90 px-10 h-12 rounded-full font-black text-sm shadow-xl shadow-blue-200"
              isLoading={isSaving}
              onClick={() => {
                setIsSaving(true);
                onSave({ conditions, priority }).finally(() => setIsSaving(false));
              }}
            >
              Save Conditions
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function ConditionRuleEditor({
  rule,
  pages,
  taxonomies,
  countries,
  cities,
  services,
  onChange,
  onRemove,
}: {
  rule: TemplateConditionRule;
  pages: CMSPage[];
  taxonomies: Array<{ id: string; name: string; slug: string; type: "category" | "tag" }>;
  countries: Array<{ id: string; name: string; slug: string }>;
  cities: Array<{ id: string; name: string; slug: string }>;
  services: Array<{ id: string; name: string; slug: string }>;
  onChange: (updates: Partial<TemplateConditionRule>) => void;
  onRemove: () => void;
}) {
  const fieldOptions = getFieldOptions(rule.field, pages, taxonomies, countries, cities, services);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 p-4 bg-slate-50 border border-slate-200 rounded-3xl items-start shadow-sm">
      <div className="lg:col-span-2">
        <select
          className={cn(
            "w-full h-11 px-3 rounded-xl text-xs font-black uppercase tracking-tight outline-none border-2",
            rule.type === "include" ? "bg-green-50 text-green-700 border-green-100" : "bg-red-50 text-red-700 border-red-100"
          )}
          value={rule.type}
          onChange={(e) => onChange({ type: e.target.value as "include" | "exclude" })}
        >
          <option value="include">Include</option>
          <option value="exclude">Exclude</option>
        </select>
      </div>

      <div className="lg:col-span-3">
        <select
          className="w-full h-11 px-3 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#155dfc]/20 focus:border-[#155dfc]"
          value={rule.field}
          onChange={(e) => onChange({ field: e.target.value as TemplateConditionField, values: [] })}
        >
          <option value="page_type">Page Type</option>
          <option value="category">Category</option>
          <option value="tag">Tags</option>
          <option value="country">Country</option>
          <option value="city">City</option>
          <option value="service">Service</option>
          <option value="post_type">Post Type</option>
          <option value="specific_page">Specific Page</option>
          <option value="url_slug">URL Slug</option>
          <option value="url_pattern">URL Pattern</option>
        </select>
      </div>

      <div className="lg:col-span-6">
        <SearchableMultiSelect
          placeholder={`Select ${formatFieldLabel(rule.field)}...`}
          values={rule.values}
          options={fieldOptions}
          onChange={(values) => onChange({ values })}
          allowCustom={rule.field === "url_slug" || rule.field === "url_pattern"}
        />
      </div>

      <div className="lg:col-span-1 flex justify-end">
        <button onClick={onRemove} className="p-3 text-slate-300 hover:text-red-500 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function SearchableMultiSelect({
  placeholder,
  values,
  options,
  onChange,
  allowCustom = false,
}: {
  placeholder: string;
  values: string[];
  options: Array<{ value: string; label: string }>;
  onChange: (values: string[]) => void;
  allowCustom?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filteredOptions = useMemo(() => {
    return options.filter((option) => option.label.toLowerCase().includes(query.toLowerCase()));
  }, [options, query]);

  const selectedLabels = values.map((value) => options.find((option) => option.value === value)?.label || value);

  const toggleValue = (value: string) => {
    onChange(values.includes(value) ? values.filter((item) => item !== value) : [...values, value]);
  };

  const addCustomValue = () => {
    const nextValue = query.trim().replace(/^\//, "");
    if (!nextValue || values.includes(nextValue)) {
      return;
    }

    onChange([...values, nextValue]);
    setQuery("");
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-200 bg-white text-left flex items-center justify-between gap-3"
      >
        <div className="flex flex-wrap gap-2">
          {selectedLabels.length === 0 ? (
            <span className="text-sm text-slate-400">{placeholder}</span>
          ) : (
            selectedLabels.map((label) => (
              <span key={label} className="inline-flex items-center rounded-full bg-blue-50 text-[#155dfc] px-2.5 py-1 text-[11px] font-bold">
                {label}
              </span>
            ))
          )}
        </div>
        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute z-20 mt-2 w-full rounded-2xl border border-slate-200 bg-white shadow-2xl p-3 space-y-3">
          <Input
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-10"
          />
          <div className="max-h-56 overflow-y-auto space-y-1">
            {filteredOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => toggleValue(option.value)}
                className="w-full px-3 py-2 rounded-xl hover:bg-slate-50 flex items-center justify-between text-sm"
              >
                <span>{option.label}</span>
                {values.includes(option.value) && <Check className="w-4 h-4 text-[#155dfc]" />}
              </button>
            ))}
            {filteredOptions.length === 0 && (
              <div className="px-3 py-5 text-center text-sm text-slate-400">
                {allowCustom ? "No matches. Add the slug below." : "No matches found."}
              </div>
            )}
          </div>

          {allowCustom && query.trim() && !options.some((option) => option.value === query.trim().replace(/^\//, "")) && (
            <Button type="button" variant="outline" className="w-full" onClick={addCustomValue}>
              Add "{query.trim().replace(/^\//, "")}"
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

function getFieldOptions(
  field: TemplateConditionField,
  pages: CMSPage[],
  taxonomies: Array<{ id: string; name: string; slug: string; type: "category" | "tag" }>,
  countries: Array<{ id: string; name: string; slug: string }>,
  cities: Array<{ id: string; name: string; slug: string }>,
  services: Array<{ id: string; name: string; slug: string }>
) {
  if (field === "page_type") {
    return PAGE_TYPE_OPTIONS;
  }

  if (field === "post_type") {
    return POST_TYPE_OPTIONS;
  }

  if (field === "specific_page") {
    return pages.map((page) => ({
      value: page.id,
      label: `${page.title} (${page.content_type === "post" ? "Post" : "Page"})`,
    }));
  }

  if (field === "url_slug") {
    return pages.map((page) => ({
      value: page.slug,
      label: `/${page.slug}`,
    }));
  }

  if (field === "url_pattern") {
    return [
      { value: "services/*", label: "/services/*" },
      { value: "*/seo-services", label: "*/seo-services" },
      { value: "*/*/*-services", label: "*/*/*-services" },
    ];
  }

  if (field === "country") {
    return countries.map((country) => ({ value: country.id, label: country.name }));
  }

  if (field === "city") {
    return cities.map((city) => ({ value: city.id, label: city.name }));
  }

  if (field === "service") {
    return services.map((service) => ({ value: service.id, label: service.name }));
  }

  return taxonomies
    .filter((taxonomy) => taxonomy.type === (field === "category" ? "category" : "tag"))
    .map((taxonomy) => ({
      value: taxonomy.id,
      label: taxonomy.name,
    }));
}

function formatFieldLabel(field: TemplateConditionField) {
  switch (field) {
    case "page_type":
      return "page types";
    case "category":
      return "categories";
    case "tag":
      return "tags";
    case "country":
      return "countries";
    case "city":
      return "cities";
    case "service":
      return "services";
    case "post_type":
      return "post types";
    case "specific_page":
      return "pages";
    case "url_slug":
      return "slugs";
    case "url_pattern":
      return "URL patterns";
    default:
      return "items";
  }
}
