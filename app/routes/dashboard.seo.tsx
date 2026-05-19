import { useState, useEffect } from "react";
import { 
  Search, 
  Zap, 
  ArrowRight,
  Database,
  Type,
  Sparkles,
  Loader2,
  Copy,
  Check,
  AlertCircle,
  Play,
  ExternalLink,
  FileText,
  Settings
} from "lucide-react";
import { useSEOStore } from "../stores/useSEOStore";
import { useWebsite } from "../hooks/useWebsite";
import { usePages } from "../hooks/usePages";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { slugify } from "../lib/slug";

export default function SEOEnginePage() {
  const { interpolate } = useSEOStore();
  const { website, loading: websiteLoading, updateWebsite } = useWebsite();
  const { bulkAddPages } = usePages(website?.id);

  const [patternText, setPatternText] = useState("Best {service} in {city}");
  const [templateContent, setTemplateContent] = useState("");
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiDescription, setAiDescription] = useState("");
  const [copied, setCopied] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const [batchData, setBatchData] = useState("[{\"service\": \"Electrician\", \"city\": \"Mumbai\"}, {\"service\": \"Carpenter\", \"city\": \"Bangalore\"}]");
  const [isBulkGenerating, setIsBulkGenerating] = useState(false);
  const [bulkError, setBulkError] = useState<string | null>(null);
  const [bulkSuccess, setBulkSuccess] = useState<number | null>(null);

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
  const previewContent = interpolate(templateContent, exampleVariables);

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

  const generateAIDescription = async () => {
    setIsGeneratingAI(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    const result = `Looking for the most reliable ${exampleVariables.service} in ${exampleVariables.city}? Our certified experts provide top-rated, affordable, and 24/7 ${exampleVariables.service} services. 100% Satisfaction Guaranteed!`;
    setAiDescription(result);
    setIsGeneratingAI(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          status: 'published',
          is_programmatic: true,
          content: { sections: [] }
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
          <Button variant="outline" className="gap-2">
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
                    className="pr-12"
                  />
                  <button 
                    title="Generate AI Title"
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-blue-600 transition-colors"
                  >
                    <Sparkles className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-slate-400">Use curly braces for variables: {'{city}'}, {'{service}'}</p>
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
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Dynamic Content Template</label>
                <textarea 
                  className="w-full h-64 px-4 py-3 bg-blue-50/30 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#155dfc]/20 focus:border-[#155dfc] outline-none resize-none"
                  value={templateContent}
                  onChange={(e) => setTemplateContent(e.target.value)}
                  placeholder="Enter content with placeholders like {city}, {state}, {service}..."
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
                    {aiDescription || `Looking for the ${preview}? Our expert team provides the highest quality ${exampleVariables.service} services in ${exampleVariables.city}. Book your appointment today!`}
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

          {/* Content Template Preview */}
          <Card className="border-slate-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Content Template Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-50 rounded-xl border border-dashed p-6 min-h-[100px]">
                {previewContent ? (
                  <div className="whitespace-pre-wrap text-sm text-slate-600 leading-relaxed">
                    {previewContent}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic text-center py-4">
                    Enter a content template to see a preview here.
                  </p>
                )}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-slate-100 text-slate-600 border-none font-bold">
                  City: {exampleVariables.city}
                </Badge>
                <Badge variant="outline" className="bg-slate-100 text-slate-600 border-none font-bold">
                  Service: {exampleVariables.service}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-100 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Sparkles className="w-24 h-24" />
            </div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                AI Assistant
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 text-xs border-purple-200 text-purple-600 hover:bg-purple-50"
                onClick={generateAIDescription}
                isLoading={isGeneratingAI}
              >
                {!isGeneratingAI && <Sparkles className="w-3 h-3 mr-1" />}
                Generate
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <textarea 
                  value={aiDescription}
                  onChange={(e) => setAiDescription(e.target.value)}
                  placeholder="AI meta description..."
                  className="w-full h-32 px-4 py-3 bg-blue-50/30 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#155dfc]/20 focus:border-[#155dfc] outline-none resize-none"
                />
                {aiDescription && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute bottom-3 right-3 h-8 w-8 bg-white/80 backdrop-blur-sm border shadow-sm"
                    onClick={() => copyToClipboard(aiDescription)}
                  >
                    {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
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
