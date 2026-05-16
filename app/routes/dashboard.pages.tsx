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
  ExternalLink
} from "lucide-react";
import { usePages } from "../hooks/usePages";
import { useWebsite } from "../hooks/useWebsite";
import { useState, useEffect } from "react";
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
} from "../components/ui/DropdownMenu";

export default function PagesManagement() {
  const { website, loading: websiteLoading } = useWebsite();
  const { pages, loading, error, addPage, updatePage, deletePage } = usePages(website?.id);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState<any>(null);
  const [formData, setFormData] = useState({ 
    title: "", 
    slug: "", 
    website_id: "", 
    status: "draft" as "draft" | "published" | "scheduled",
    is_programmatic: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (website) {
      setFormData(prev => ({ ...prev, website_id: website.id }));
    }
  }, [website]);

  const filteredPages = pages.filter(page => 
    page.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    page.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreatePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!website?.id) return;
    setIsSubmitting(true);
    try {
      await addPage({ ...formData, website_id: website.id });
      setIsCreateModalOpen(false);
      setFormData({ 
        title: "", 
        slug: "", 
        website_id: website.id, 
        status: "draft",
        is_programmatic: false 
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdatePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPage) return;
    setIsSubmitting(true);
    try {
      await updatePage(selectedPage.id, {
        title: formData.title,
        slug: formData.slug,
        status: formData.status,
        is_programmatic: formData.is_programmatic
      });
      setIsEditModalOpen(false);
      setSelectedPage(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePage = async () => {
    if (!selectedPage) return;
    setIsSubmitting(true);
    try {
      await deletePage(selectedPage.id);
      setIsDeleteModalOpen(false);
      setSelectedPage(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || websiteLoading) {
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
          <h2 className="text-2xl font-bold tracking-tight">Pages</h2>
          <p className="text-slate-500">Manage {website?.name || 'your'} website's static and programmatic pages.</p>
        </div>
        <Button className="gap-2" onClick={() => {
          setFormData(prev => ({ ...prev, website_id: website?.id }));
          setIsCreateModalOpen(true);
        }}>
          <Plus className="w-4 h-4" />
          Create Page
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl flex gap-3 items-center text-sm font-medium border border-red-100">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      <div className="flex items-center gap-4">
        <div className="flex-1 max-w-md">
          <Input 
            type="text" 
            placeholder="Filter pages..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search className="w-4 h-4" />}
            className="h-10"
          />
        </div>
      </div>

      <Card className="border-slate-100 overflow-hidden">
        {filteredPages.length === 0 ? (
          <div className="p-16 text-center space-y-4">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto border border-slate-100">
              <FileText className="w-8 h-8 text-slate-300" />
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-slate-900">No pages found</p>
              <p className="text-slate-500 text-sm">Start by creating your first landing page.</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-slate-500 text-xs font-bold uppercase tracking-wider border-b">
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Last Modified</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPages.map((page) => (
                  <tr key={page.id} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-100 transition-colors">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-slate-900">{page.title}</p>
                          <p className="text-xs text-slate-400 flex items-center gap-1">
                            {page.slug}
                            <ArrowRight className="w-3 h-3" />
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className={`font-bold uppercase tracking-tighter ${
                        page.is_programmatic ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-slate-50 text-slate-600'
                      }`}>
                        {page.is_programmatic ? 'programmatic' : 'static'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {page.status === 'published' ? (
                          <Badge variant="success" className="gap-1.5 px-2 py-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Published
                          </Badge>
                        ) : (
                          <Badge variant="warning" className="gap-1.5 px-2 py-1">
                            <Clock className="w-3 h-3" />
                            Draft
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(page.updated_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            className="gap-2"
                            onClick={() => {
                              if (website) {
                                window.open(`https://${website.domain}/${page.slug}`, '_blank');
                              }
                            }}
                          >
                            <Eye className="w-4 h-4" /> View
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
                                is_programmatic: !!page.is_programmatic
                              });
                              setIsEditModalOpen(true);
                            }}
                          >
                            <Settings className="w-4 h-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="gap-2 text-red-600 focus:text-red-600 focus:bg-red-50"
                            onClick={() => {
                              setSelectedPage(page);
                              setIsDeleteModalOpen(true);
                            }}
                          >
                            <Trash2 className="w-4 h-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Page</DialogTitle>
            <DialogDescription>
              Add a new static or programmatic page to your website.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreatePage} className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Page Title</label>
              <Input 
                required 
                placeholder="Our Services" 
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Slug</label>
              <Input 
                required 
                placeholder="our-services" 
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-2 pt-2">
              <input 
                type="checkbox" 
                id="is_programmatic"
                className="w-4 h-4 text-blue-600 rounded"
                checked={formData.is_programmatic}
                onChange={(e) => setFormData({ ...formData, is_programmatic: e.target.checked })}
              />
              <label htmlFor="is_programmatic" className="text-sm font-medium">Is this a programmatic page?</label>
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" isLoading={isSubmitting}>
                Create Page
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Page Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Page</DialogTitle>
            <DialogDescription>
              Update page details and configuration.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdatePage} className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Page Title</label>
              <Input 
                required 
                placeholder="Our Services" 
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Slug</label>
              <Input 
                required 
                placeholder="our-services" 
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <select 
                required
                className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <input 
                type="checkbox" 
                id="edit_is_programmatic"
                className="w-4 h-4 text-blue-600 rounded"
                checked={formData.is_programmatic}
                onChange={(e) => setFormData({ ...formData, is_programmatic: e.target.checked })}
              />
              <label htmlFor="edit_is_programmatic" className="text-sm font-medium">Is this a programmatic page?</label>
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" isLoading={isSubmitting}>
                Update Page
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Page</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <span className="font-bold text-slate-900">{selectedPage?.title}</span>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-4">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" isLoading={isSubmitting} onClick={handleDeletePage}>
              Delete Page
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

