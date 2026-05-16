import { useState } from "react";
import { 
  Plus, 
  Search, 
  Tag as TagIcon, 
  FolderTree, 
  MoreVertical, 
  Trash2, 
  Edit,
  Loader2,
  AlertCircle,
  X,
  ChevronRight
} from "lucide-react";
import { useTaxonomies, type TaxonomyType } from "../hooks/useTaxonomies";
import { useWebsite } from "../hooks/useWebsite";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
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
import { cn } from "../lib/utils";

export default function TaxonomiesPage() {
  const { website, loading: websiteLoading } = useWebsite();
  const [activeTab, setActiveTab] = useState<TaxonomyType>('category');
  const { taxonomies, loading, error, addTaxonomy, updateTaxonomy, deleteTaxonomy } = useTaxonomies(website?.id, activeTab);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [formData, setFormData] = useState({ name: "", slug: "", description: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredItems = taxonomies.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (item?: any) => {
    if (item) {
      setSelectedItem(item);
      setFormData({ name: item.name, slug: item.slug, description: item.description || "" });
    } else {
      setSelectedItem(null);
      setFormData({ name: "", slug: "", description: "" });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!website?.id) return;
    setIsSubmitting(true);
    try {
      if (selectedItem) {
        await updateTaxonomy(selectedItem.id, formData);
      } else {
        await addTaxonomy({ ...formData, website_id: website.id, type: activeTab });
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedItem) return;
    setIsSubmitting(true);
    try {
      await deleteTaxonomy(selectedItem.id);
      setIsDeleteModalOpen(false);
      setSelectedItem(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
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
          <h2 className="text-2xl font-black tracking-tight">Categories & Tags</h2>
          <p className="text-slate-500">Organize your content with custom taxonomies.</p>
        </div>
        <Button className="gap-2 bg-[#155dfc] hover:bg-[#155dfc]/90 rounded-full" onClick={() => handleOpenModal()}>
          <Plus className="w-4 h-4" />
          Create {activeTab === 'category' ? 'Category' : 'Tag'}
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl flex gap-3 items-center text-sm font-medium border border-red-100">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl w-fit">
        <button 
          onClick={() => setActiveTab('category')}
          className={cn(
            "px-6 py-2.5 rounded-xl text-sm font-black transition-all",
            activeTab === 'category' ? "bg-white text-[#155dfc] shadow-sm" : "text-slate-500 hover:text-slate-700"
          )}
        >
          Categories
        </button>
        <button 
          onClick={() => setActiveTab('tag')}
          className={cn(
            "px-6 py-2.5 rounded-xl text-sm font-black transition-all",
            activeTab === 'tag' ? "bg-white text-[#155dfc] shadow-sm" : "text-slate-500 hover:text-slate-700"
          )}
        >
          Tags
        </button>
      </div>

      <Card className="border-slate-100 overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between gap-4 bg-slate-50/30">
          <div className="flex-1 max-w-md">
            <Input 
              placeholder={`Search ${activeTab}s...`} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4" />}
              className="h-10 bg-blue-50/30"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 text-[11px] font-black uppercase tracking-wider border-b">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Slug</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400 font-medium">
                    No {activeTab}s found.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#155dfc]">
                          {activeTab === 'category' ? <FolderTree className="w-5 h-5" /> : <TagIcon className="w-5 h-5" />}
                        </div>
                        <span className="font-bold text-sm text-slate-900">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-[11px] bg-slate-100 px-2 py-1 rounded text-slate-600 font-bold">{item.slug}</code>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 max-w-xs truncate">
                      {item.description || '—'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40 p-2 rounded-2xl">
                          <DropdownMenuItem className="gap-2 rounded-xl font-bold" onClick={() => handleOpenModal(item)}>
                            <Edit className="w-4 h-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 rounded-xl font-bold text-red-600 focus:text-red-600 focus:bg-red-50" onClick={() => {
                            setSelectedItem(item);
                            setIsDeleteModalOpen(true);
                          }}>
                            <Trash2 className="w-4 h-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedItem ? 'Edit' : 'Create'} {activeTab === 'category' ? 'Category' : 'Tag'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Name</label>
              <Input 
                required 
                placeholder="e.g. Technology" 
                value={formData.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setFormData({ 
                    ...formData, 
                    name, 
                    slug: selectedItem ? formData.slug : name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') 
                  });
                }}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Slug</label>
              <Input 
                required 
                placeholder="e.g. technology" 
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Description</label>
              <textarea 
                className="w-full px-4 py-3 bg-blue-50/30 border border-slate-200 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-[#155dfc]/20 focus:border-[#155dfc] outline-none h-24 resize-none"
                placeholder="Brief description..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" isLoading={isSubmitting} className="bg-[#155dfc] hover:bg-[#155dfc]/90">
                {selectedItem ? 'Save Changes' : `Create ${activeTab === 'category' ? 'Category' : 'Tag'}`}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <span className="font-bold text-slate-900">{selectedItem?.name}</span>? This will not delete posts assigned to it, but the taxonomy will be removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-4">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
            <Button variant="danger" isLoading={isSubmitting} onClick={handleDelete}>
              Delete Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
