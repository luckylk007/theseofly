import { useState, useRef, useEffect } from "react";
import { 
  Upload, 
  Search, 
  Grid, 
  List as ListIcon, 
  MoreVertical, 
  Plus,
  Trash2,
  Download,
  Info,
  Loader2,
  AlertCircle,
  FileIcon,
  Check,
  Copy
} from "lucide-react";
import { useMedia } from "../hooks/useMedia";
import { useWebsite } from "../hooks/useWebsite";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/Dialog";
import { cn } from "../lib/utils";

export default function MediaLibraryPage() {
  const { media, loading, error, uploadFile, deleteFile } = useMedia();
  const { website, loading: websiteLoading } = useWebsite();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredMedia = media.filter(item => 
    item.file_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !website?.id) return;

    setIsUploading(true);
    try {
      await uploadFile(files[0], website.id);
      setIsUploadOpen(false);
    } catch (err: any) {
      console.error("Upload failed:", err);
      // We rely on the hook's error state or alert here
      alert(`Upload failed: ${err.message || 'Unknown error'}`);
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async () => {
    if (!selectedItem) return;
    setIsDeleting(true);
    try {
      let storagePath = selectedItem.metadata?.storage_path;
      
      if (!storagePath) {
        // Fallback: Extract storage path from the URL
        const urlParts = selectedItem.file_path.split('/');
        const fileName = urlParts[urlParts.length - 1];
        const userId = urlParts[urlParts.length - 2];
        storagePath = `${userId}/${fileName}`;
      }
      
      console.log(`Deleting file at storage path: ${storagePath}`);
      await deleteFile(selectedItem.id, storagePath);
      setSelectedItem(null);
    } catch (err: any) {
      console.error("Delete failed:", err);
      alert(`Delete failed: ${err.message || 'Unknown error'}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if ((loading && media.length === 0) || websiteLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 h-full flex flex-col">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Media Library</h2>
          <p className="text-slate-500">Manage assets for {website?.name || 'your website'}.</p>
        </div>
        <Button onClick={() => setIsUploadOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Upload Files
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl flex gap-3 items-center text-sm font-medium border border-red-100">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      <Card className="flex-1 min-h-0 border-slate-100 overflow-hidden flex flex-col">
        {/* Controls */}
        <div className="p-4 border-b flex items-center justify-between gap-4 shrink-0 bg-slate-50/30">
          <div className="flex-1 max-w-md">
            <Input 
              type="text" 
              placeholder="Search assets..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4" />}
              className="h-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center border border-slate-200 rounded-xl bg-white overflow-hidden p-1 shadow-sm">
              <button 
                onClick={() => setView("grid")}
                className={cn(
                  "p-1.5 rounded-lg transition-all",
                  view === "grid" ? "bg-slate-100 text-blue-600" : "text-slate-400 hover:text-slate-600"
                )}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setView("list")}
                className={cn(
                  "p-1.5 rounded-lg transition-all",
                  view === "list" ? "bg-slate-100 text-blue-600" : "text-slate-400 hover:text-slate-600"
                )}
              >
                <ListIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Gallery */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredMedia.length === 0 ? (
            <div className="p-16 text-center space-y-4">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto border border-slate-100">
                <Upload className="w-8 h-8 text-slate-300" />
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-slate-900">No assets found</p>
                <p className="text-slate-500 text-sm">Upload your first file to get started.</p>
              </div>
            </div>
          ) : view === "grid" ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {filteredMedia.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="group cursor-pointer space-y-2"
                >
                  <div className="aspect-square bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 relative group-hover:border-blue-400 transition-all shadow-sm">
                    {item.file_type.startsWith('image/') ? (
                      <img src={item.file_path} alt={item.alt_text || item.file_name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                        <FileIcon className="w-10 h-10 mb-1" />
                        <span className="text-[10px] font-bold uppercase">{item.file_type.split('/')[1]}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="p-2 bg-white rounded-full text-slate-900 shadow-lg scale-90 group-hover:scale-100 transition-transform">
                        <Info className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                  <div className="px-1">
                    <p className="text-xs font-semibold truncate text-slate-900">{item.file_name}</p>
                    <p className="text-[10px] text-slate-400">{(item.file_size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-500 text-xs font-bold uppercase tracking-wider border-b">
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Size</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredMedia.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/30 transition-colors cursor-pointer group" onClick={() => setSelectedItem(item)}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center shadow-sm">
                            {item.file_type.startsWith('image/') ? (
                              <img src={item.file_path} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <FileIcon className="w-5 h-5 text-slate-300" />
                            )}
                          </div>
                          <span className="text-sm font-semibold text-slate-900">{item.file_name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500 font-mono uppercase">{item.file_type.split('/')[1]}</td>
                      <td className="px-6 py-4 text-xs text-slate-500">{(item.file_size / 1024).toFixed(1)} KB</td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 group-hover:text-slate-900">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Card>

      {/* Upload Modal */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Assets</DialogTitle>
            <DialogDescription>
              Add new media files to your platform. Max 10MB per file.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div 
              onClick={() => website?.id && fileInputRef.current?.click()}
              className={cn(
                "border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer group",
                website?.id 
                  ? "border-slate-200 hover:border-blue-500 hover:bg-blue-50/30" 
                  : "border-slate-100 bg-slate-50/50 cursor-not-allowed opacity-50"
              )}
            >
              <input type="file" className="hidden" ref={fileInputRef} onChange={handleUpload} />
              <div className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-transform",
                website?.id ? "bg-blue-50 text-blue-600 group-hover:scale-110" : "bg-slate-100 text-slate-300"
              )}>
                {isUploading ? <Loader2 className="w-8 h-8 animate-spin" /> : <Upload className="w-8 h-8" />}
              </div>
              <h4 className="font-bold text-lg">{isUploading ? 'Uploading...' : 'Click to upload'}</h4>
              <p className="text-slate-500 mt-2 text-sm">PNG, JPG, WebP or SVG</p>
            </div>
            {!website?.id && <p className="text-xs text-red-500 text-center">Website configuration not found.</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadOpen(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Asset Details</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
            <div className="space-y-4">
              <div className="aspect-square bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 flex items-center justify-center shadow-inner">
                {selectedItem?.file_type.startsWith('image/') ? (
                  <img src={selectedItem.file_path} alt="" className="w-full h-full object-contain" />
                ) : (
                  <FileIcon className="w-16 h-16 text-slate-200" />
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 gap-2 text-xs" onClick={() => copyUrl(selectedItem.file_path)}>
                  {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  Copy URL
                </Button>
                <a 
                  href={selectedItem?.file_path} 
                  download 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex-1 inline-flex items-center justify-center rounded-xl font-medium transition-colors border border-slate-200 bg-transparent hover:bg-slate-50 text-slate-700 h-8 px-3 text-xs gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </a>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">File Name</label>
                  <p className="text-sm font-bold text-slate-900 truncate mt-1">{selectedItem?.file_name}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Type</label>
                    <p className="text-sm font-semibold text-slate-700 mt-1 uppercase">{selectedItem?.file_type.split('/')[1]}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Size</label>
                    <p className="text-sm font-semibold text-slate-700 mt-1">{(selectedItem?.file_size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <label className="text-sm font-bold text-slate-700">Alt Text (SEO)</label>
                <textarea 
                  defaultValue={selectedItem?.alt_text}
                  placeholder="Describe this asset for SEO..."
                  className="w-full px-4 py-3 bg-blue-50/30 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#155dfc]/20 focus:border-[#155dfc] outline-none h-24 resize-none"
                />
              </div>

              <div className="pt-4 flex justify-between items-center">
                <Button variant="danger" size="icon" className="h-10 w-10 shadow-sm" onClick={handleDelete} isLoading={isDeleting}>
                  <Trash2 className="w-4 h-4" />
                </Button>
                <Button className="px-8 shadow-md shadow-blue-200">Save Changes</Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

