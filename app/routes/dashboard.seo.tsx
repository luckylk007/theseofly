import { useState, useEffect, useRef } from "react";
import { 
  Search, 
  Zap, 
  ArrowRight,
  Database,
  Type,
  Loader2,
  Copy,
  Check,
  AlertCircle,
  Play,
  ExternalLink,
  FileText,
  Settings,
  Image as ImageIcon,
  X
} from "lucide-react";
import { useSEOStore } from "../stores/useSEOStore";
import { useWebsite } from "../hooks/useWebsite";
import { usePages } from "../hooks/usePages";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { slugify } from "../lib/slug";
import TextEditor from "../components/TextEditor";
import { MediaPicker } from "../components/MediaPicker";
import { parseCSV } from "../lib/csv";

export default function SEOEnginePage() {
  const { interpolate } = useSEOStore();
  const { website, loading: websiteLoading, updateWebsite } = useWebsite();
  const { bulkAddPages } = usePages(website?.id);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [patternText, setPatternText] = useState("Best {service} in {city}");
  const [templateContent, setTemplateContent] = useState("");
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const [batchData, setBatchData] = useState("[{\"service\": \"Electrician\", \"city\": \"Mumbai\"}, {\"service\": \"Carpenter\", \"city\": \"Bangalore\"}]");
  const [isBulkGenerating, setIsBulkGenerating] = useState(false);
  const [bulkError, setBulkError] = useState<string | null>(null);
  const [bulkSuccess, setBulkSuccess] = useState<number | null>(null);

  // Batch configuration states
  const [batchFeaturedImage, setBatchFeaturedImage] = useState("");
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [generateAsDraft, setGenerateAsDraft] = useState(true);

  // Initialize from website settings
  useEffect(() => {
    if (website?.global_seo_settings) {
      if (website.global_seo_settings.title_pattern) {
        setPatternText(website.global_seo_settings.title_pattern);
      }
      if (website.global_seo_settings.programmatic_template) {
        setTemplateContent(website.global_seo_settings.programmatic_template);
      }
    }
  }, [website]);

  // Example variables for preview
  const exampleVariables = { service: "Plumber", city: "Delhi", state: "NCR" };
  const preview = interpolate(patternText, exampleVariables);
  const previewSlug = buildPageSlug(exampleVariables, preview);

  const handleSaveSettings = async () => {
    if (!website) return;
    setIsSavingSettings(true);
    try {
      await updateWebsite({
        global_seo_settings: {
          ...(website.global_seo_settings || {}),
          title_pattern: patternText,
          programmatic_template: templateContent,
        }
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to save SEO settings:", err);
    } finally {
      setIsSavingSettings(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      try {
        const { rows } = parseCSV(text);
        setBatchData(JSON.stringify(rows, null, 2));
        setBulkError(null);
      } catch (err) {
        setBulkError("Failed to parse CSV file. Please ensure it is a valid CSV.");
      }
    };
    reader.readAsText(file);
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleBulkGenerate = async () => {
    if (!website?.id) {
      setBulkError("Website configuration not found.");
      return;
    }
    
    setBulkError(null);
    setBulkSuccess(null);
    setIsBulkGenerating(true);
    
    try {
      const data = JSON.parse(batchData);
      if (!Array.isArray(data)) throw new Error("Batch data must be an array of objects.");

      const pagesToCreate = data.map((variables: any, index: number) => {
        if (!variables || typeof variables !== "object" || Array.isArray(variables)) {
          throw new Error(`Row ${index + 1} must be a JSON object.`);
        }

        const title = interpolate(patternText, variables);
        const slug = buildPageSlug(variables, title);

        if (!slug) {
          throw new Error(`Row ${index + 1} produced an empty page URL. Add a title variable or provide "slug", "url", or "path" in the JSON.`);
        }
        
        return {
          website_id: website.id,
          title,
          slug,
          variables,
          status: generateAsDraft ? 'draft' : 'published',
          is_programmatic: true,
          content: { sections: [] },
          featured_image_url: batchFeaturedImage || null
        };
      });

      const duplicateSlugs = findDuplicateSlugs(pagesToCreate.map((page) => page.slug));
      if (duplicateSlugs.length > 0) {
        throw new Error(`Duplicate page URLs found in this batch: ${duplicateSlugs.join(", ")}`);
      }

      const result = await bulkAddPages(pagesToCreate);
      setBulkSuccess(result?.length || 0);
    } catch (err: any) {
      setBulkError(err.message || "Failed to generate pages. Check your JSON format.");
    } finally {
      setIsBulkGenerating(false);
    }
  };

  if (websiteLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Programmatic SEO Engine</h2>
          <p className="text-slate-500">Generate thousands of pages for {website?.name || 'your website'} using dynamic patterns and variables.</p>
        </div>
        <div className="flex items-center gap-3">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImportCSV} 
            accept=".csv" 
            className="hidden" 
          />
          <Button variant="outline" className="gap-2" onClick={() => fileInputRef.current?.click()}>
            <Database className="w-4 h-4" />
            Import CSV
          </Button>
          <Button className="gap-2 shadow-lg shadow-blue-200" onClick={handleBulkGenerate} isLoading={isBulkGenerating}>
            <Zap className="w-4 h-4" />
            Bulk Generate
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Pattern Builder */}
          <Card className="border-slate-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="flex items-center gap-2">
                <Type className="w-5 h-5 text-blue-600" />
                Pattern Builder
              </CardTitle>
              <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-100 uppercase tracking-wider text-[10px]">Draft Mode</Badge>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Page Title Pattern</label>
                <div className="relative">
                  <Input 
                    value={patternText}
                    onChange={(e) => setPatternText(e.target.value)}
                    placeholder="e.g. Best {service} in {city}"
                  />
                </div>
                <p className="text-xs text-slate-400">Use curly braces for variables: {'{city}'}, {'{service}'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Batch Configuration */}
          <Card className="border-slate-100 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <ImageIcon className="w-24 h-24" />
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-600" />
                Batch Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Batch Featured Image</label>
                  <p className="text-xs text-slate-400 mb-2">This image will be assigned to all generated pages.</p>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="https://example.com/image.jpg" 
                      value={batchFeaturedImage}
                      onChange={(e) => setBatchFeaturedImage(e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="shrink-0 gap-2 border-slate-200"
                      onClick={() => setIsMediaPickerOpen(true)}
                    >
                      <ImageIcon className="w-4 h-4" />
                      Media Library
                    </Button>
                  </div>
                  
                  {batchFeaturedImage && (
                    <div className="mt-4 relative group w-full max-w-md aspect-video rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-sm">
                      <img 
                        src={batchFeaturedImage} 
                        alt="Batch Preview" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://placehold.co/600x400?text=Invalid+Image+URL";
                        }}
                      />
                      <button 
                        type="button"
                        onClick={() => setBatchFeaturedImage("")}
                        className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-red-50 hover:text-red-600 transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-100">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">Generate as Draft</p>
                        <p className="text-[11px] text-slate-500 font-medium">Pages will not be public until you publish them.</p>
                      </div>
                    </div>
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 text-[#155dfc] rounded-lg border-slate-300 focus:ring-[#155dfc]/20"
                      checked={generateAsDraft}
                      onChange={(e) => setGenerateAsDraft(e.target.checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Batch Data */}
          <Card className="border-slate-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="w-5 h-5 text-green-600" />
                Batch Data (JSON)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {bulkError && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl flex gap-3 items-center text-sm font-medium border border-red-100">
                  <AlertCircle className="w-5 h-5" />
                  {bulkError}
                </div>
              )}
              {bulkSuccess && (
                <div className="p-4 bg-green-50 text-green-700 rounded-xl flex gap-3 items-center text-sm font-medium border border-green-100">
                  <Check className="w-5 h-5" />
                  Successfully generated {bulkSuccess} pages!
                </div>
              )}
              <textarea 
                className="w-full h-32 px-4 py-3 bg-blue-50/30 border border-slate-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-[#155dfc]/20 focus:border-[#155dfc] outline-none resize-none"
                value={batchData}
                onChange={(e) => setBatchData(e.target.value)}
                placeholder="Paste your JSON array here..."
              />
              <p className="text-[10px] text-slate-400 italic font-mono">
                [{"{ \"service\": \"Value\", \"city\": \"Value\" }"}]
              </p>
            </CardContent>
          </Card>

          {/* Content Template */}
          <Card className="border-slate-100">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Global Page Content Template
              </CardTitle>
              <Button 
                size="sm" 
                className="gap-2 bg-[#155dfc] hover:bg-[#155dfc]/90 rounded-full"
                onClick={handleSaveSettings}
                isLoading={isSavingSettings}
              >
                {saveSuccess ? <Check className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
                {saveSuccess ? "Saved!" : "Save Engine Settings"}
              </Button>
            </CardHeader>
            <CardContent className="p-0 overflow-hidden">
              <div className="p-6 space-y-4">
                <label className="text-sm font-medium text-slate-700">Dynamic Content Template</label>
                <TextEditor 
                  value={templateContent}
                  onEditorChange={(newContent) => setTemplateContent(newContent)}
                  height={500}
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline" className="cursor-pointer" onClick={() => setTemplateContent(prev => prev + "{city}")}>{"{city}"}</Badge>
                  <Badge variant="outline" className="cursor-pointer" onClick={() => setTemplateContent(prev => prev + "{state}")}>{"{state}"}</Badge>
                  <Badge variant="outline" className="cursor-pointer" onClick={() => setTemplateContent(prev => prev + "{service}")}>{"{service}"}</Badge>
                  <Badge variant="outline" className="cursor-pointer" onClick={() => setTemplateContent(prev => prev + "{country}")}>{"{country}"}</Badge>
                </div>
                <p className="text-xs text-slate-400">This content will be automatically appended to all programmatic landing pages.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Preview & AI */}
        <div className="space-y-8">
          <Card className="border-slate-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5 text-green-600" />
                SERP Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-slate-50 rounded-xl border border-dashed p-6 min-h-[200px] flex flex-col justify-center">
                <div className="space-y-2">
                  <p className="text-[#1a0dab] text-xl font-medium hover:underline cursor-pointer break-words">
                    {preview} | Theseofly
                  </p>
                  <p className="text-[#006621] text-sm flex items-center gap-1 truncate">
                    https://{website?.domain || "yourdomain.com"}/{previewSlug}
                    <ArrowRight className="w-3 h-3" />
                  </p>
                  <p className="text-slate-600 text-sm line-clamp-3">
                    Looking for the {preview}? Our expert team provides the highest quality {exampleVariables.service} services in {exampleVariables.city}. Book your appointment today!
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Title Length:</span>
                  <Badge variant={preview.length > 60 ? "error" : "success"}>{preview.length} / 60</Badge>
                </div>
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-400 uppercase">SEO Score</span>
                    <span className="text-xs font-bold text-green-600">92%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-[92%] rounded-full"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <MediaPicker 
        open={isMediaPickerOpen}
        onOpenChange={setIsMediaPickerOpen}
        onSelect={(url) => setBatchFeaturedImage(url)}
        title="Select Batch Featured Image"
      />
    </div>
  );
}

function buildPageSlug(variables: Record<string, unknown>, fallbackTitle: string) {
  const rawSlug = readCustomSlug(variables) || fallbackTitle;

  return String(rawSlug)
    .split("/")
    .map((segment) => slugify(segment))
    .filter(Boolean)
    .join("/");
}

function readCustomSlug(variables: Record<string, unknown>) {
  const candidate = variables.slug || variables.url || variables.path || variables.page_url;

  if (typeof candidate !== "string") {
    return "";
  }

  return candidate
    .trim()
    .replace(/^https?:\/\/[^/]+/i, "")
    .replace(/^\/+|\/+$/g, "");
}

function findDuplicateSlugs(slugs: string[]) {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const slug of slugs) {
    if (seen.has(slug)) {
      duplicates.add(slug);
    } else {
      seen.add(slug);
    }
  }

  return Array.from(duplicates);
}
