import { Plus, Search, Globe, MoreVertical, ExternalLink, Loader2, AlertCircle, Trash2, Edit } from "lucide-react";
import { useWebsites } from "../hooks/useWebsites";
import { useState } from "react";
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

export default function WebsitesPage() {
  const { websites, loading, error, addWebsite, deleteWebsite } = useWebsites();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedWebsite, setSelectedWebsite] = useState<any>(null);
  const [formData, setFormData] = useState({ name: "", domain: "", description: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredWebsites = websites.filter(site => 
    site.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    site.domain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddWebsite = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addWebsite(formData);
      setIsAddModalOpen(false);
      setFormData({ name: "", domain: "", description: "" });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteWebsite = async () => {
    if (!selectedWebsite) return;
    setIsSubmitting(true);
    try {
      await deleteWebsite(selectedWebsite.id);
      setIsDeleteModalOpen(false);
      setSelectedWebsite(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && websites.length === 0) {
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
          <h2 className="text-2xl font-bold tracking-tight">Websites</h2>
          <p className="text-slate-500">Manage your connected domains and their configurations.</p>
        </div>
        <Button className="gap-2" onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-4 h-4" />
          Add Website
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl flex gap-3 items-center text-sm font-medium border border-red-100">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      <Card className="border-slate-100 overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between gap-4 bg-slate-50/30">
          <div className="flex-1 max-w-md">
            <Input 
              type="text" 
              placeholder="Filter websites..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4" />}
              className="h-10"
            />
          </div>
        </div>

        {filteredWebsites.length === 0 ? (
          <div className="p-16 text-center space-y-4">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto border border-slate-100">
              <Globe className="w-8 h-8 text-slate-300" />
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-slate-900">No websites found</p>
              <p className="text-slate-500 text-sm">Click "Add Website" to get started with your first domain.</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-slate-500 text-xs font-bold uppercase tracking-wider border-b">
                  <th className="px-6 py-4">Website</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Created At</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredWebsites.map((site) => (
                  <tr key={site.id} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                          <Globe className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-slate-900">{site.name}</p>
                          <a 
                            href={`https://${site.domain}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-slate-400 flex items-center gap-1 hover:text-blue-600 transition-colors"
                          >
                            {site.domain}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="success" className="gap-1.5 px-2 py-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                        Active
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(site.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="gap-2">
                            <Edit className="w-4 h-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="gap-2 text-red-600 focus:text-red-600 focus:bg-red-50"
                            onClick={() => {
                              setSelectedWebsite(site);
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

      {/* Add Website Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Website</DialogTitle>
            <DialogDescription>
              Connect a new domain to your programmatic SEO platform.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddWebsite} className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Website Name</label>
              <Input 
                required 
                placeholder="My Business" 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Domain</label>
              <Input 
                required 
                placeholder="example.com" 
                value={formData.domain}
                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description (Optional)</label>
              <Input 
                placeholder="Brief description of the site" 
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" isLoading={isSubmitting}>
                Add Website
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Website</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <span className="font-bold text-slate-900">{selectedWebsite?.name}</span>? This action cannot be undone and all associated pages will be lost.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-4">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" isLoading={isSubmitting} onClick={handleDeleteWebsite}>
              Delete Website
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

