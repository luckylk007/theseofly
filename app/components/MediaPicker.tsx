import { useState } from "react";
import { 
  Search, 
  Grid, 
  List as ListIcon, 
  Loader2,
  FileIcon,
  Image as ImageIcon,
  Check
} from "lucide-react";
import { useMedia } from "../hooks/useMedia";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "./ui/Dialog";
import { cn } from "../lib/utils";

interface MediaPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (url: string) => void;
  title?: string;
}

export function MediaPicker({ open, onOpenChange, onSelect, title = "Select Image" }: MediaPickerProps) {
  const { media, loading, error } = useMedia();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);

  const filteredMedia = media.filter(item => 
    item.file_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    item.file_type.startsWith('image/')
  );

  const handleConfirm = () => {
    if (selectedUrl) {
      onSelect(selectedUrl);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-6 border-b">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="p-4 border-b flex items-center justify-between gap-4 bg-slate-50/50">
          <div className="flex-1 max-w-md">
            <Input 
              type="text" 
              placeholder="Search images..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4" />}
              className="h-10 bg-white"
            />
          </div>
          <div className="flex items-center border border-slate-200 rounded-xl bg-white overflow-hidden p-1">
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

        <div className="flex-1 overflow-y-auto p-6 min-h-[400px]">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          ) : filteredMedia.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
              <ImageIcon className="w-12 h-12 opacity-20" />
              <p>No images found in media library.</p>
            </div>
          ) : view === "grid" ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredMedia.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => setSelectedUrl(item.file_path)}
                  className={cn(
                    "group cursor-pointer relative aspect-square bg-slate-50 rounded-xl overflow-hidden border-2 transition-all",
                    selectedUrl === item.file_path ? "border-blue-600 ring-2 ring-blue-100" : "border-slate-100 hover:border-blue-300"
                  )}
                >
                  <img src={item.file_path} alt={item.file_name} className="w-full h-full object-cover" />
                  {selectedUrl === item.file_path && (
                    <div className="absolute inset-0 bg-blue-600/10 flex items-center justify-center">
                      <div className="bg-blue-600 text-white rounded-full p-1 shadow-lg">
                        <Check className="w-4 h-4" />
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-1.5 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-[10px] text-white truncate text-center font-medium">{item.file_name}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <tbody className="divide-y divide-slate-100">
                  {filteredMedia.map((item) => (
                    <tr 
                      key={item.id} 
                      className={cn(
                        "hover:bg-slate-50 transition-colors cursor-pointer",
                        selectedUrl === item.file_path ? "bg-blue-50/50" : ""
                      )}
                      onClick={() => setSelectedUrl(item.file_path)}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center">
                            <img src={item.file_path} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{item.file_name}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{(item.file_size / 1024).toFixed(1)} KB</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {selectedUrl === item.file_path && <Check className="w-5 h-5 text-blue-600 ml-auto" />}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <DialogFooter className="p-6 border-t bg-slate-50/50">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleConfirm} disabled={!selectedUrl} className="min-w-[120px]">
            Select Image
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
