import { useState } from "react";
import { 
  Layout, 
  Settings, 
  Type, 
  Image as ImageIcon, 
  Square, 
  MousePointer2, 
  Eye, 
  Save, 
  ChevronLeft,
  Search,
  Plus,
  Layers,
  Palette,
  Monitor,
  Smartphone,
  Tablet,
  History,
  MoreHorizontal,
  X,
  Play
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card } from "../components/ui/Card";
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function ThemeBuilderPage() {
  const [activeTab, setActiveTab] = useState<"widgets" | "layers" | "settings">("widgets");
  const [viewMode, setViewMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const widgets = [
    { icon: Type, label: "Heading", color: "text-blue-500" },
    { icon: ImageIcon, label: "Image", color: "text-green-500" },
    { icon: Square, label: "Section", color: "text-purple-500" },
    { icon: MousePointer2, label: "Button", color: "text-rose-500" },
    { icon: Play, label: "Video", color: "text-red-500" },
    { icon: Layers, label: "Archive Loop", color: "text-indigo-500" },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#f1f3f6] flex flex-col overflow-hidden">
      {/* Top Header */}
      <header className="h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg" onClick={() => window.history.back()}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="h-6 w-px bg-slate-200" />
          <div>
            <h1 className="text-sm font-black text-slate-900 leading-tight">Theme Builder</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Editing: Single Page Template</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 rounded-lg p-1 mr-4">
            <button 
              onClick={() => setViewMode("desktop")}
              className={cn("p-1.5 rounded-md transition-all", viewMode === "desktop" ? "bg-white shadow-sm text-[#155dfc]" : "text-slate-400")}
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode("tablet")}
              className={cn("p-1.5 rounded-md transition-all", viewMode === "tablet" ? "bg-white shadow-sm text-[#155dfc]" : "text-slate-400")}
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode("mobile")}
              className={cn("p-1.5 rounded-md transition-all", viewMode === "mobile" ? "bg-white shadow-sm text-[#155dfc]" : "text-slate-400")}
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>
          
          <Button variant="outline" size="sm" className="h-9 gap-2 font-bold border-slate-200">
            <Eye className="w-4 h-4" /> Preview
          </Button>
          <Button size="sm" className="h-9 gap-2 font-bold bg-[#155dfc] hover:bg-[#155dfc]/90 px-6">
            <Save className="w-4 h-4" /> Publish
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Elementor Style */}
        <aside className={cn(
          "bg-white border-r border-slate-200 flex flex-col transition-all duration-300 overflow-hidden",
          isSidebarOpen ? "w-[300px]" : "w-0 border-none"
        )}>
          {/* Sidebar Tabs */}
          <div className="flex border-b border-slate-100 px-2 shrink-0">
            <button 
              onClick={() => setActiveTab("widgets")}
              className={cn(
                "flex-1 py-3 text-[11px] font-black uppercase tracking-widest border-b-2 transition-all",
                activeTab === "widgets" ? "border-[#155dfc] text-[#155dfc]" : "border-transparent text-slate-400 hover:text-slate-600"
              )}
            >
              Widgets
            </button>
            <button 
              onClick={() => setActiveTab("settings")}
              className={cn(
                "flex-1 py-3 text-[11px] font-black uppercase tracking-widest border-b-2 transition-all",
                activeTab === "settings" ? "border-[#155dfc] text-[#155dfc]" : "border-transparent text-slate-400 hover:text-slate-600"
              )}
            >
              Settings
            </button>
            <button 
              onClick={() => setActiveTab("layers")}
              className={cn(
                "flex-1 py-3 text-[11px] font-black uppercase tracking-widest border-b-2 transition-all",
                activeTab === "layers" ? "border-[#155dfc] text-[#155dfc]" : "border-transparent text-slate-400 hover:text-slate-600"
              )}
            >
              Layers
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {activeTab === "widgets" && (
              <div className="space-y-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input placeholder="Search widgets..." className="pl-9 h-10 text-xs bg-slate-50 border-none focus:ring-1 focus:ring-blue-500/20" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {widgets.map((w) => (
                    <div 
                      key={w.label}
                      className="bg-white border border-slate-100 p-4 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-[#155dfc] hover:shadow-md hover:shadow-blue-50 transition-all cursor-move group"
                    >
                      <w.icon className={cn("w-6 h-6 transition-transform group-hover:scale-110", w.color)} />
                      <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">{w.label}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Structure</h4>
                  <div className="space-y-2">
                    {[1, 2, 3].map(cols => (
                      <div key={cols} className="flex gap-1 h-12">
                        {Array.from({length: cols}).map((_, i) => (
                          <div key={i} className="flex-1 bg-slate-50 border border-dashed border-slate-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors" />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="space-y-8">
                <section className="space-y-4">
                  <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                    <Palette className="w-3.5 h-3.5 text-[#155dfc]" /> Design Settings
                  </h4>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Primary Accent</label>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#155dfc] border-2 border-white shadow-sm" />
                        <Input value="#155dfc" className="h-9 text-xs font-mono" readOnly />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Body Typography</label>
                      <select className="w-full h-9 px-2 bg-slate-50 border-none rounded-lg text-xs font-bold outline-none">
                        <option>Inter (Default)</option>
                        <option>Plus Jakarta Sans</option>
                        <option>Montserrat</option>
                      </select>
                    </div>
                  </div>
                </section>

                <section className="space-y-4 pt-6 border-t border-slate-100">
                  <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                    <Layout className="w-3.5 h-3.5 text-[#155dfc]" /> Page Layout
                  </h4>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Page Width</label>
                    <Input defaultValue="1200px" className="h-9 text-xs font-bold" />
                  </div>
                </section>
              </div>
            )}
          </div>

          {/* Sidebar Footer */}
          <div className="h-12 border-t border-slate-100 px-4 flex items-center justify-between shrink-0">
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900">
                <History className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-slate-400"
              onClick={() => setIsSidebarOpen(false)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </div>
        </aside>

        {/* Floating Sidebar Toggle when closed */}
        <AnimatePresence>
          {!isSidebarOpen && (
            <motion.button 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              onClick={() => setIsSidebarOpen(true)}
              className="fixed left-0 top-1/2 -translate-y-1/2 z-40 bg-white border border-l-0 border-slate-200 p-2 rounded-r-xl shadow-xl text-[#155dfc]"
            >
              <Plus className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Live Canvas */}
        <main className="flex-1 flex flex-col items-center p-8 overflow-y-auto bg-[#f1f3f6] custom-scrollbar">
          <motion.div 
            animate={{ 
              width: viewMode === "desktop" ? "100%" : viewMode === "tablet" ? "768px" : "375px",
              maxWidth: "100%"
            }}
            className="bg-white min-h-screen shadow-2xl rounded-sm transition-all duration-500 overflow-hidden flex flex-col"
          >
            {/* Template Placeholder UI */}
            <div className="flex-1 p-12 flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-[#155dfc]">
                <Plus className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-slate-900">Drag widgets here</h2>
                <p className="text-slate-500 max-w-sm">Start building your custom template by dragging elements from the sidebar or adding a new section.</p>
              </div>
              <Button className="h-12 px-8 rounded-full font-bold bg-[#155dfc] gap-2">
                <Plus className="w-5 h-5" /> Add New Section
              </Button>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
