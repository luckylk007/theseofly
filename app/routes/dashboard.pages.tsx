import { 
  Plus, 
  Search, 
  FileText, 
  Settings, 
  Eye, 
  MoreVertical, 
  CheckCircle2,
  Clock,
  ArrowRight,
  Loader2,
  AlertCircle,
  Trash2,
  ExternalLink,
  Filter,
  ChevronDown,
  ArrowUpDown,
  User,
  Tag as TagIcon,
  FolderTree,
  MessageSquare,
  Zap,
  X,
  Image as ImageIcon
} from "lucide-react";
import { usePages } from "../hooks/usePages";
import { useWebsite } from "../hooks/useWebsite";
import { useTaxonomies } from "../hooks/useTaxonomies";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import type { ContentType, PostType } from "../types/cms";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { Card } from "../components/ui/Card";
import { MediaPicker } from "../components/MediaPicker";
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
  DropdownMenuLabel,
} from "../components/ui/DropdownMenu";
import { cn } from "../lib/utils";

export default function PagesManagement() {
  const navigate = useNavigate();
  const { website, loading: websiteLoading } = useWebsite();
  const { 
    pages, loading, error, 
    addPage, updatePage, deletePage, 
    bulkUpdatePages, bulkDeletePages 
  } = usePages(website?.id);
  const { taxonomies: allTaxonomies } = useTaxonomies(website?.id);
  
  const categories = useMemo(() => allTaxonomies.filter(t => t.type === 'category'), [allTaxonomies]);
  const availableTags = useMemo(() => allTaxonomies.filter(t => t.type === 'tag'), [allTaxonomies]);

  const [activeTab, setActiveTab] = useState<'pages' | 'blogs' | 'programmatic'>('pages');
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' }>({ key: 'updated_at', direction: 'desc' });
  
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  useEffect(() => {
    setSelectedIds([]);
  }, [activeTab]);

  const counts = useMemo(() => {
    let pagesCount = 0;
    let blogsCount = 0;
    let programmaticCount = 0;
    pages.forEach(page => {
      if (page.is_programmatic) {
        programmaticCount++;
      } else if (page.content_type === 'post') {
        blogsCount++;
      } else {
        pagesCount++;
      }
    });
    return { pages: pagesCount, blogs: blogsCount, programmatic: programmaticCount };
  }, [pages]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState<any>(null);
  
  const [formData, setFormData] = useState({ 
    title: "", 
    slug: "", 
    website_id: "", 
    status: "draft" as any,
    is_programmatic: false,
    content_type: "page" as ContentType,
    post_type: "page" as PostType,
    category_id: "",
    tag_ids: [] as string[],
    parent_id: null as string | null,
    allow_comments: false,
    featured_image_url: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (website) {
      setFormData(prev => ({ ...prev, website_id: website.id }));
    }
  }, [website]);

  const filteredAndSortedPages = useMemo(() => {
    return pages
      .filter(page => {
        const matchesSearch = page.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             page.slug.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || page.status === statusFilter;
        const matchesCategory =
          categoryFilter === "all" ||
          page.categories.some((category) => category.id === categoryFilter || category.name === categoryFilter);
        
        const matchesTab = activeTab === 'programmatic' 
          ? !!page.is_programmatic 
          : activeTab === 'blogs'
          ? (!page.is_programmatic && page.content_type === 'post')
          : (!page.is_programmatic && page.content_type === 'page');

        return matchesSearch && matchesStatus && matchesCategory && matchesTab;
      })
      .sort((a, b) => {
        const aRecord = a as Record<string, any>;
        const bRecord = b as Record<string, any>;
        let aVal = aRecord[sortConfig.key];
        let bVal = bRecord[sortConfig.key];
        
        if (sortConfig.key === 'title') {
          aVal = aVal.toLowerCase();
          bVal = bVal.toLowerCase();
        }

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
  }, [pages, searchTerm, statusFilter, categoryFilter, sortConfig, activeTab]);

  const categoryFilterLabel = useMemo(() => {
    if (categoryFilter === "all") {
      return "all";
    }

    return categories.find((category) => category.id === categoryFilter)?.name || "all";
  }, [categories, categoryFilter]);

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredAndSortedPages.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredAndSortedPages.map(p => p.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleCreatePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!website?.id) return;
    setIsSubmitting(true);
    setLocalError(null);
    try {
      await addPage({ 
        ...formData, 
        website_id: website.id,
        content: { sections: [] } 
      });
      setIsCreateModalOpen(false);
      setFormData({ 
        title: "", 
        slug: "", 
        website_id: website.id, 
        status: "draft",
        is_programmatic: false,
        content_type: "page",
        post_type: "page",
        category_id: "",
        tag_ids: [],
        parent_id: null,
        allow_comments: false,
        featured_image_url: ""
      });
    } catch (err: any) {
      console.error("Failed to create page:", err);
      setLocalError(err.message || "Failed to create page");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdatePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPage) return;
    setIsSubmitting(true);
    setLocalError(null);
    try {
      const selectedCategory = categories.find((category) => category.id === formData.category_id);
      const selectedTags = availableTags.filter((tag) => formData.tag_ids.includes(tag.id));
      await updatePage(selectedPage.id, {
        title: formData.title,
        slug: formData.slug,
        status: formData.status,
        is_programmatic: formData.is_programmatic,
        content_type: formData.content_type,
        post_type: formData.post_type,
        category: selectedCategory?.name || "",
        tags: selectedTags.map((tag) => tag.name),
        taxonomy_ids: [
          ...(formData.category_id ? [formData.category_id] : []),
          ...formData.tag_ids,
        ],
        allow_comments: formData.allow_comments,
        featured_image_url: formData.featured_image_url
      });
      setIsEditModalOpen(false);
      setSelectedPage(null);
    } catch (err: any) {
      console.error(err);
      setLocalError(err.message || "Failed to update page");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBulkStatusChange = async (newStatus: string) => {
    setIsSubmitting(true);
    setLocalError(null);
    try {
      await bulkUpdatePages(selectedIds, { status: newStatus });
      setSelectedIds([]);
    } catch (err: any) {
      console.error(err);
      setLocalError(err.message || "Failed to update pages status");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBulkDelete = async () => {
    setIsSubmitting(true);
    setLocalError(null);
    try {
      await bulkDeletePages(selectedIds);
      setSelectedIds([]);
      setIsBulkDeleteModalOpen(false);
    } catch (err: any) {
      console.error(err);
      setLocalError(err.message || "Failed to delete pages");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePage = async () => {
    if (!selectedPage) return;
    setIsSubmitting(true);
    setLocalError(null);
    try {
      await deletePage(selectedPage.id);
      setIsDeleteModalOpen(false);
      setSelectedPage(null);
    } catch (err: any) {
      console.error(err);
      setLocalError(err.message || "Failed to delete page");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTag = (tagId: string) => {
    setFormData(prev => {
      const tag_ids = prev.tag_ids.includes(tagId)
        ? prev.tag_ids.filter(t => t !== tagId)
        : [...prev.tag_ids, tagId];
      return { ...prev, tag_ids };
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-[#155dfc] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 relative">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black tracking-tight">
            {activeTab === 'pages' ? 'Website Static Pages' : activeTab === 'blogs' ? 'Blog Articles' : 'Programmatic Pages'}
          </h2>
          <p className="text-slate-500 text-sm">
            {activeTab === 'pages' 
              ? `Manage ${website?.name || 'your'} website's primary static pages (Home, About, Contact, etc.).`
              : activeTab === 'blogs'
              ? `Manage ${website?.name || 'your'} website's rich dynamic blog posts, articles, and insights.`
              : `Manage ${website?.name || 'your'} website's bulk-generated programmatic service-location pages.`}
          </p>
        </div>
        <Button className="gap-2 bg-[#155dfc] hover:bg-[#155dfc]/90 rounded-full cursor-pointer" onClick={() => {
          setFormData({ 
            title: "", 
            slug: "", 
            website_id: website?.id || "", 
            status: "draft",
            is_programmatic: activeTab === 'programmatic',
            content_type: activeTab === 'blogs' ? "post" : "page",
            post_type: activeTab === 'blogs' ? "blog" : "page",
            category_id: "",
            tag_ids: [],
            parent_id: null,
            allow_comments: false,
            featured_image_url: ""
          });
          setIsCreateModalOpen(true);
        }}>
          <Plus className="w-4 h-4" />
          Create Page
        </Button>
      </div>

      {/* Dynamic Tab Bar Navigation */}
      <div className="flex border-b border-slate-200 bg-white/40 p-1.5 rounded-2xl border backdrop-blur-sm self-start">
        <button
          onClick={() => setActiveTab('pages')}
          className={cn(
            "py-2.5 px-6 font-bold text-sm rounded-xl transition-all relative flex items-center gap-2",
            activeTab === 'pages'
              ? "bg-[#155dfc] text-white shadow-lg shadow-blue-200"
              : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
          )}
        >
          <span>Static Pages</span>
          <span className={cn(
            "px-2 py-0.5 text-[10px] font-black rounded-full border shrink-0",
            activeTab === 'pages' 
              ? "bg-white/20 text-white border-white/20" 
              : "bg-slate-100 text-slate-500 border-slate-200"
          )}>
            {counts.pages}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('blogs')}
          className={cn(
            "py-2.5 px-6 font-bold text-sm rounded-xl transition-all relative flex items-center gap-2",
            activeTab === 'blogs'
              ? "bg-[#155dfc] text-white shadow-lg shadow-blue-200"
              : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
          )}
        >
          <span>Blog Articles</span>
          <span className={cn(
            "px-2 py-0.5 text-[10px] font-black rounded-full border shrink-0",
            activeTab === 'blogs' 
              ? "bg-white/20 text-white border-white/20" 
              : "bg-slate-100 text-slate-500 border-slate-200"
          )}>
            {counts.blogs}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('programmatic')}
          className={cn(
            "py-2.5 px-6 font-bold text-sm rounded-xl transition-all relative flex items-center gap-2",
            activeTab === 'programmatic'
              ? "bg-[#155dfc] text-white shadow-lg shadow-blue-200"
              : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
          )}
        >
          <span>Programmatic Pages</span>
          <span className={cn(
            "px-2 py-0.5 text-[10px] font-black rounded-full border shrink-0",
            activeTab === 'programmatic' 
              ? "bg-white/20 text-white border-white/20" 
              : "bg-slate-100 text-slate-500 border-slate-200"
          )}>
            {counts.programmatic}
          </span>
        </button>
      </div>

      {activeTab === 'programmatic' && (
        <div className="p-4 bg-blue-50/40 border border-blue-100/50 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-blue-100 shadow-sm shrink-0">
              <Zap className="w-5 h-5 text-blue-600 animate-pulse" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">Need to create programmatic pages in bulk?</p>
              <p className="text-xs text-slate-500 font-medium">Use our SEO Engine to import CSV/JSON and automatically generate thousands of location & service landing pages.</p>
            </div>
          </div>
          <Button 
            onClick={() => navigate("/admin/seo")}
            size="sm" 
            className="bg-blue-600 hover:bg-blue-700 text-white shrink-0 shadow-md shadow-blue-200 rounded-full"
          >
            Launch SEO Engine <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl flex gap-3 items-center text-sm font-medium border border-red-100">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {localError && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl flex gap-3 items-center justify-between text-sm font-medium border border-red-100 animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5" />
            {localError}
          </div>
          <button onClick={() => setLocalError(null)} className="text-red-400 hover:text-red-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter Toolbar */}
      <Card className="p-4 border-slate-100">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[300px]">
            <Input 
              type="text" 
              placeholder="Search by title or slug..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4" />}
              className="h-10 bg-blue-50/30"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-10 gap-2 border-slate-200">
                  <Filter className="w-4 h-4 text-slate-400" />
                  Status: <span className="capitalize">{statusFilter}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => setStatusFilter("all")}>All Statuses</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setStatusFilter("published")}>Published</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("draft")}>Draft</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("private")}>Private</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("pending_preview")}>Pending Preview</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-10 gap-2 border-slate-200">
                  <FolderTree className="w-4 h-4 text-slate-400" />
                  Category: <span className="capitalize">{categoryFilterLabel}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </Button>
              </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => setCategoryFilter("all")}>All Categories</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {categories.map(cat => (
                  <DropdownMenuItem key={cat.id} onClick={() => setCategoryFilter(cat.id)}>{cat.name}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button 
              variant="ghost" 
              size="sm" 
              className="h-10 text-slate-500 hover:text-slate-900"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setCategoryFilter("all");
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      </Card>

      {/* Pages Table */}
      <Card className="border-slate-100 overflow-hidden relative">
        {/* Bulk Action Bar */}
        {selectedIds.length > 0 && (
          <div className="absolute top-0 left-0 right-0 z-20 bg-[#155dfc] text-white px-6 py-3 flex items-center justify-between animate-in slide-in-from-top duration-300">
            <div className="flex items-center gap-4">
              <span className="font-bold text-sm">{selectedIds.length} pages selected</span>
              <div className="h-4 w-px bg-white/20" />
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-white hover:bg-white/10 h-8 text-xs font-bold gap-1.5"
                  onClick={() => handleBulkStatusChange('published')}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Publish
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-white hover:bg-white/10 h-8 text-xs font-bold gap-1.5"
                  onClick={() => handleBulkStatusChange('draft')}
                >
                  <Clock className="w-3.5 h-3.5" /> Set Draft
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-white hover:bg-white/10 h-8 text-xs font-bold gap-1.5"
                  onClick={() => setIsBulkDeleteModalOpen(true)}
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </Button>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:bg-white/10 h-8"
              onClick={() => setSelectedIds([])}
            >
              Cancel
            </Button>
          </div>
        )}

        {filteredAndSortedPages.length === 0 ? (
          <div className="p-16 text-center space-y-4">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto border border-slate-100 animate-pulse">
              <FileText className="w-8 h-8 text-slate-300" />
            </div>
            <div className="space-y-1">
              <p className="font-bold text-slate-900">
                {activeTab === 'pages' 
                  ? 'No website static pages found' 
                  : activeTab === 'blogs'
                  ? 'No blog articles found'
                  : 'No programmatic pages found'}
              </p>
              <p className="text-slate-500 text-sm font-medium">
                {activeTab === 'pages' 
                  ? 'Start by creating your first static landing page.'
                  : activeTab === 'blogs'
                  ? 'Start by writing and publishing your first dynamic blog post.'
                  : 'Bulk generate pages with the SEO Engine or add one manually.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-slate-500 text-[11px] font-black uppercase tracking-wider border-b">
                  <th className="px-6 py-4 w-10">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-slate-300 text-[#155dfc] focus:ring-[#155dfc]/20"
                      checked={selectedIds.length === filteredAndSortedPages.length && filteredAndSortedPages.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="px-4 py-4 cursor-pointer hover:text-slate-900" onClick={() => setSortConfig({ key: 'title', direction: sortConfig.direction === 'asc' ? 'desc' : 'asc' })}>
                    <div className="flex items-center gap-2">
                      Title <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-6 py-4 cursor-pointer hover:text-slate-900" onClick={() => setSortConfig({ key: 'category', direction: sortConfig.direction === 'asc' ? 'desc' : 'asc' })}>
                    <div className="flex items-center gap-2">
                      Category <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 cursor-pointer hover:text-slate-900" onClick={() => setSortConfig({ key: 'updated_at', direction: sortConfig.direction === 'asc' ? 'desc' : 'asc' })}>
                    <div className="flex items-center gap-2">
                      Last Modified <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAndSortedPages.map((page) => (
                  <tr 
                    key={page.id} 
                    className={cn(
                      "hover:bg-slate-50/30 transition-colors group",
                      selectedIds.includes(page.id) ? "bg-blue-50/30" : ""
                    )}
                  >
                    <td className="px-6 py-4">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-slate-300 text-[#155dfc] focus:ring-[#155dfc]/20"
                        checked={selectedIds.includes(page.id)}
                        onChange={() => toggleSelectRow(page.id)}
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-[#155dfc] group-hover:border-blue-100 transition-colors shrink-0 overflow-hidden">
                          {page.featured_image_url ? (
                            <img src={page.featured_image_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <FileText className="w-5 h-5" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-sm text-slate-900 truncate">{page.title}</p>
                          <p className="text-[11px] text-slate-400 flex items-center gap-1 truncate font-medium">
                            /{page.slug}
                            <ArrowRight className="w-3 h-3" />
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {page.category ? (
                        <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 font-bold uppercase tracking-tighter text-[10px]">
                          {page.categories[0]?.name || page.category}
                        </Badge>
                      ) : (
                        <span className="text-[11px] text-slate-300 italic font-medium">Uncategorized</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {page.status === 'published' ? (
                          <Badge variant="success" className="gap-1.5 px-2 py-1 bg-green-50 text-green-600 border-green-100">
                            <CheckCircle2 className="w-3 h-3" />
                            Published
                          </Badge>
                        ) : page.status === 'draft' ? (
                          <Badge variant="warning" className="gap-1.5 px-2 py-1 bg-amber-50 text-amber-600 border-amber-100">
                            <Clock className="w-3 h-3" />
                            Draft
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="gap-1.5 px-2 py-1 bg-slate-50 text-slate-500 border-slate-200 capitalize">
                            {page.status?.replace('_', ' ')}
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-500">
                      {new Date(page.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          title="View Live Page"
                          onClick={() => {
                            const url = page.status === 'published' ? `/${page.slug}` : `/${page.slug}?preview=${page.id}`;
                            console.log(`[Dashboard] Opening URL: ${url}`);
                            window.open(url, '_blank');
                          }}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-[#1F2937] hover:bg-slate-100 transition-all duration-200">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-slate-400">Manage Page</DropdownMenuLabel>
                            <DropdownMenuItem 
                              className="gap-2"
                              onClick={() => {
                                const url = page.status === 'published' ? `/${page.slug}` : `/${page.slug}?preview=${page.id}`;
                                window.open(url, '_blank');
                              }}
                            >
                              <Eye className="w-4 h-4" /> View Page
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="gap-2"
                              onClick={() => {
                                setSelectedPage(page);
                                setFormData({
                                  title: page.title,
                                  slug: page.slug,
                                  website_id: page.website_id,
                                  status: page.status,
                                  is_programmatic: !!page.is_programmatic,
                                  content_type: page.content_type || "page",
                                  post_type: page.post_type || "page",
                                  category_id: page.categories[0]?.id || "",
                                  tag_ids: page.tag_entities?.map((tag) => tag.id) || [],
                                  parent_id: page.parent_id || null,
                                  allow_comments: !!page.allow_comments,
                                  featured_image_url: page.featured_image_url || ""
                                });
                                setIsEditModalOpen(true);
                              }}
                            >
                              <Settings className="w-4 h-4" /> Page Settings
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="gap-2 text-red-600 hover:bg-red-50 focus:text-red-600 focus:bg-red-50"
                              onClick={() => {
                                setSelectedPage(page);
                                setIsDeleteModalOpen(true);
                              }}
                            >
                              <Trash2 className="w-4 h-4" /> Delete Permanently
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Create Page Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Create New Page</DialogTitle>
            <DialogDescription>
              Add a new static or programmatic page to your website.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreatePage} className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Page Title</label>
                <Input 
                  required 
                  placeholder="e.g. Services" 
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Slug</label>
                <Input 
                  required 
                  placeholder="e.g. services" 
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Content Type</label>
                <select
                  className="w-full h-11 px-3 bg-blue-50/30 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#155dfc]/20 outline-none font-bold text-slate-900"
                  value={formData.content_type}
                  onChange={(e) => {
                    const contentType = e.target.value as ContentType;
                    setFormData({
                      ...formData,
                      content_type: contentType,
                      post_type: contentType === "page" ? "page" : formData.post_type === "page" ? "post" : formData.post_type,
                    });
                  }}
                >
                  <option value="page">Page</option>
                  <option value="post">Post</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Post Type</label>
                <select
                  className="w-full h-11 px-3 bg-blue-50/30 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#155dfc]/20 outline-none font-bold text-slate-900"
                  value={formData.post_type}
                  onChange={(e) => setFormData({ ...formData, post_type: e.target.value as PostType })}
                >
                  {formData.content_type === "page" ? (
                    <option value="page">Page</option>
                  ) : (
                    <>
                      <option value="post">Standard Post</option>
                      <option value="blog">Blog</option>
                      <option value="news">News</option>
                      <option value="newsletter">Newsletter</option>
                      <option value="case-study">Case Study</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Category</label>
                <select 
                  className="w-full h-11 px-3 bg-blue-50/30 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#155dfc]/20 outline-none font-bold text-slate-900"
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Parent Page</label>
                <select 
                  className="w-full h-11 px-3 bg-blue-50/30 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#155dfc]/20 outline-none font-bold text-slate-900"
                  value={formData.parent_id || ""}
                  onChange={(e) => setFormData({ ...formData, parent_id: e.target.value || null })}
                >
                  <option value="">No Parent</option>
                  {pages.filter(p => p.id !== selectedPage?.id).map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Multi-Tag Select */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700">Assign Tags</label>
              <div className="flex flex-wrap gap-2 p-4 bg-blue-50/30 border border-slate-200 rounded-2xl min-h-[56px]">
                {formData.tag_ids.length === 0 && <span className="text-xs text-slate-400 font-medium">No tags selected</span>}
                {formData.tag_ids.map(tagId => {
                  const tag = availableTags.find((item) => item.id === tagId);
                  if (!tag) return null;
                  return (
                  <Badge key={tagId} className="bg-[#155dfc] text-white gap-1 pr-1.5 h-7">
                    {tag.name}
                    <button type="button" onClick={() => toggleTag(tagId)} className="hover:bg-white/20 rounded-full p-0.5 transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )})}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {availableTags.map(tag => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border",
                      formData.tag_ids.includes(tag.id)
                        ? "bg-[#155dfc] text-white border-[#155dfc] shadow-lg shadow-blue-200 scale-105"
                        : "bg-white text-slate-500 border-slate-200 hover:border-blue-200 hover:text-[#155dfc]"
                    )}
                  >
                    {tag.name}
                  </button>
                ))}
                {availableTags.length === 0 && <p className="text-[10px] text-slate-400 italic">No tags created yet. Go to Taxonomies to add some.</p>}
              </div>
            </div>

            {/* Featured Image */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Featured Image</label>
              <div className="flex gap-2">
                <Input 
                  placeholder="https://example.com/image.jpg" 
                  value={formData.featured_image_url || ""}
                  onChange={(e) => setFormData({ ...formData, featured_image_url: e.target.value })}
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  className="shrink-0 gap-2 border-slate-200"
                  onClick={() => setIsMediaPickerOpen(true)}
                >
                  <ImageIcon className="w-4 h-4" />
                  Media
                </Button>
              </div>
              {formData.featured_image_url && (
                <div className="mt-2 relative group w-full aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                  <img 
                    src={formData.featured_image_url} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://placehold.co/600x400?text=Invalid+Image+URL";
                    }}
                  />
                  <button 
                    type="button"
                    onClick={() => setFormData({ ...formData, featured_image_url: "" })}
                    className="absolute top-2 right-2 p-1 bg-white/80 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4 text-slate-600" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm border">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Programmatic Mode</p>
                  <p className="text-[11px] text-slate-500 font-medium">Generate pages from variables.</p>
                </div>
              </div>
              <input 
                type="checkbox" 
                className="w-5 h-5 text-[#155dfc] rounded-lg"
                checked={formData.is_programmatic}
                onChange={(e) => setFormData({ ...formData, is_programmatic: e.target.checked })}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" isLoading={isSubmitting} className="bg-[#155dfc] hover:bg-[#155dfc]/90 min-w-[140px]">
                Create Page
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Page Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit Page Settings</DialogTitle>
            <DialogDescription>
              Update configuration and meta data for this page.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdatePage} className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Page Title</label>
                <Input 
                  required 
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Status</label>
                <select 
                  required
                  className="w-full h-11 px-3 bg-blue-50/30 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#155dfc]/20 focus:border-[#155dfc] outline-none font-bold text-slate-900"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="private">Private</option>
                  <option value="pending_preview">Pending Preview</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Content Type</label>
                <select
                  className="w-full h-11 px-3 bg-blue-50/30 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#155dfc]/20 outline-none font-bold text-slate-900"
                  value={formData.content_type}
                  onChange={(e) => {
                    const contentType = e.target.value as ContentType;
                    setFormData({
                      ...formData,
                      content_type: contentType,
                      post_type: contentType === "page" ? "page" : formData.post_type === "page" ? "post" : formData.post_type,
                    });
                  }}
                >
                  <option value="page">Page</option>
                  <option value="post">Post</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Post Type</label>
                <select
                  className="w-full h-11 px-3 bg-blue-50/30 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#155dfc]/20 outline-none font-bold text-slate-900"
                  value={formData.post_type}
                  onChange={(e) => setFormData({ ...formData, post_type: e.target.value as PostType })}
                >
                  {formData.content_type === "page" ? (
                    <option value="page">Page</option>
                  ) : (
                    <>
                      <option value="post">Standard Post</option>
                      <option value="blog">Blog</option>
                      <option value="news">News</option>
                      <option value="newsletter">Newsletter</option>
                      <option value="case-study">Case Study</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Category</label>
                <select 
                  className="w-full h-11 px-3 bg-blue-50/30 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#155dfc]/20 outline-none font-bold text-slate-900"
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Parent Page</label>
                <select 
                  className="w-full h-11 px-3 bg-blue-50/30 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#155dfc]/20 outline-none font-bold text-slate-900"
                  value={formData.parent_id || ""}
                  onChange={(e) => setFormData({ ...formData, parent_id: e.target.value || null })}
                >
                  <option value="">No Parent</option>
                  {pages.filter(p => p.id !== selectedPage?.id).map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Multi-Tag Select */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700">Assign Tags</label>
              <div className="flex flex-wrap gap-2 p-4 bg-blue-50/30 border border-slate-200 rounded-2xl min-h-[56px]">
                {formData.tag_ids.length === 0 && <span className="text-xs text-slate-400 font-medium">No tags selected</span>}
                {formData.tag_ids.map(tagId => {
                  const tag = availableTags.find((item) => item.id === tagId);
                  if (!tag) return null;
                  return (
                  <Badge key={tagId} className="bg-[#155dfc] text-white gap-1 pr-1.5 h-7">
                    {tag.name}
                    <button type="button" onClick={() => toggleTag(tagId)} className="hover:bg-white/20 rounded-full p-0.5 transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )})}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {availableTags.map(tag => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border",
                      formData.tag_ids.includes(tag.id)
                        ? "bg-[#155dfc] text-white border-[#155dfc] shadow-lg shadow-blue-200 scale-105"
                        : "bg-white text-slate-500 border-slate-200 hover:border-blue-200 hover:text-[#155dfc]"
                    )}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Featured Image */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Featured Image</label>
              <div className="flex gap-2">
                <Input 
                  placeholder="https://example.com/image.jpg" 
                  value={formData.featured_image_url || ""}
                  onChange={(e) => setFormData({ ...formData, featured_image_url: e.target.value })}
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  className="shrink-0 gap-2 border-slate-200"
                  onClick={() => setIsMediaPickerOpen(true)}
                >
                  <ImageIcon className="w-4 h-4" />
                  Media
                </Button>
              </div>
              {formData.featured_image_url && (
                <div className="mt-2 relative group w-full aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                  <img 
                    src={formData.featured_image_url} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://placehold.co/600x400?text=Invalid+Image+URL";
                    }}
                  />
                  <button 
                    type="button"
                    onClick={() => setFormData({ ...formData, featured_image_url: "" })}
                    className="absolute top-2 right-2 p-1 bg-white/80 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4 text-slate-600" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm border">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Allow Comments</p>
                  <p className="text-[11px] text-slate-500 font-medium">Enable visitor discussions on this page.</p>
                </div>
              </div>
              <input 
                type="checkbox" 
                className="w-5 h-5 text-[#155dfc] rounded-lg"
                checked={formData.allow_comments}
                onChange={(e) => setFormData({ ...formData, allow_comments: e.target.checked })}
              />
            </div>

            <DialogFooter className="gap-2">
              <Button 
                type="button" 
                variant="outline" 
                className="gap-2 text-blue-600 border-blue-100 hover:bg-blue-50"
                onClick={() => {
                  if (formData.slug) {
                    const url = formData.status === 'published' ? `/${formData.slug}` : `/${formData.slug}?preview=${selectedPage.id}`;
                    window.open(url, '_blank');
                  }
                }}
              >
                <ExternalLink className="w-4 h-4" />
                View Live
              </Button>
              <div className="flex-1" />
              <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" isLoading={isSubmitting} className="bg-[#155dfc] hover:bg-[#155dfc]/90 min-w-[140px]">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Page Permanently</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <span className="font-bold text-slate-900">{selectedPage?.title}</span>? This action is irreversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-4">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" isLoading={isSubmitting} onClick={handleDeletePage}>
              Delete Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Delete Confirmation Modal */}
      <Dialog open={isBulkDeleteModalOpen} onOpenChange={setIsBulkDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {selectedIds.length} Pages</DialogTitle>
            <DialogDescription>
              You are about to permanently delete <span className="font-bold text-slate-900">{selectedIds.length}</span> pages. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-4">
            <Button variant="outline" onClick={() => setIsBulkDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" isLoading={isSubmitting} onClick={handleBulkDelete}>
              Delete Pages
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <MediaPicker 
        open={isMediaPickerOpen}
        onOpenChange={setIsMediaPickerOpen}
        onSelect={(url) => setFormData({ ...formData, featured_image_url: url })}
        title="Select Featured Image"
      />
    </div>
  );
}
