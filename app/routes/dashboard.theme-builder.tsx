import { useState, useMemo } from "react";
import { 
  Plus, 
  Search, 
  Layout, 
  Settings, 
  Eye, 
  MoreVertical, 
  CheckCircle2,
  Clock,
  Trash2,
  Copy,
  ChevronDown,
  Filter,
  ArrowUpDown,
  X,
  PlusCircle,
  GripVertical,
  AlertTriangle,
  Globe,
  FileText,
  Archive,
  ShoppingCart,
  Users,
  AlertCircle,
  History,
  ToggleLeft as Toggle,
  Loader2
} from "lucide-react";
import { useTemplates } from "../hooks/useTemplates";
import { useWebsite } from "../hooks/useWebsite";
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
  DropdownMenuLabel,
} from "../components/ui/DropdownMenu";
import { cn } from "../lib/utils";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import type { ThemeTemplate, TemplateType, DisplayCondition, ConditionTarget, ConditionSubTarget } from "../types/theme-builder";
import { TEMPLATE_TYPE_LABELS } from "../types/theme-builder";

export default function ThemeBuilderDashboard() {
  const { website, loading: websiteLoading } = useWebsite();
  const { 
    templates, loading, addTemplate, updateTemplate, 
    deleteTemplate, duplicateTemplate, toggleActive 
  } = useTemplates(website?.id);
  
  const [activeType, setActiveType] = useState<TemplateType | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState("");
  const [isConditionsModalOpen, setIsConditionsModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ThemeTemplate | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTemplateData, setNewTemplateData] = useState({ name: "", type: "single_page" as TemplateType });

  const filteredTemplates = useMemo(() => {
    return templates.filter(t => {
      const matchesType = activeType === 'all' || t.type === activeType;
      const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [templates, activeType, searchTerm]);

  const typeGroups = [
    { id: 'all', label: 'All Templates', icon: Layout },
    { id: 'header', label: 'Headers', icon: Globe },
    { id: 'footer', label: 'Footers', icon: Globe },
    { id: 'single_post', label: 'Single Posts', icon: FileText },
    { id: 'single_page', label: 'Single Pages', icon: FileText },
    { id: 'archive', label: 'Archives', icon: Archive },
    { id: 'woo_product', label: 'Products', icon: ShoppingCart },
    { id: 'error_404', label: 'Error 404', icon: AlertCircle },
  ];

  const handleCreate = async () => {
    if (!website?.id || !newTemplateData.name) return;
    
    try {
      await addTemplate({
        website_id: website.id,
        name: newTemplateData.name,
        type: newTemplateData.type,
        status: 'draft',
        is_active: true,
        priority: 0,
        conditions: [],
        content: { sections: [] } // Added required content field
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
          <p className="text-slate-500">Manage site-wide templates and display conditions.</p>
        </div>
        <Button className="gap-2 bg-[#155dfc] hover:bg-[#155dfc]/90 rounded-full h-11 px-6 shadow-lg shadow-blue-200" onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-5 h-5" />
          Add New Template
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-1">
          {typeGroups.map((group) => (
            <button
              key={group.id}
              onClick={() => setActiveType(group.id as any)}
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
                {group.id === 'all' ? templates.length : templates.filter(t => t.type === group.id).length}
              </span>
            </button>
          ))}
        </div>

        {/* Templates List */}
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
                <Button variant="outline" className="mt-6 rounded-full border-slate-200" onClick={() => setIsCreateModalOpen(true)}>
                  Create Your First Template
                </Button>
              </Card>
            ) : (
              filteredTemplates.map((template) => (
                <TemplateCard 
                  key={template.id} 
                  template={template} 
                  onEditConditions={() => {
                    setSelectedTemplate(template);
                    setIsConditionsModalOpen(true);
                  }}
                  onToggleActive={(val) => toggleActive(template.id, val)}
                  onDuplicate={() => duplicateTemplate(template.id)}
                  onDelete={() => deleteTemplate(template.id)}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Conditions Modal */}
      <AnimatePresence>
        {isConditionsModalOpen && selectedTemplate && (
          <ConditionsModal 
            template={selectedTemplate} 
            isOpen={isConditionsModalOpen} 
            onClose={() => {
              setIsConditionsModalOpen(false);
              setSelectedTemplate(null);
            }}
            onSave={async (conditions) => {
              await updateTemplate(selectedTemplate.id, { conditions });
              setIsConditionsModalOpen(false);
              setSelectedTemplate(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Create Modal */}
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
                {Object.entries(TEMPLATE_TYPE_LABELS).map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} className="bg-[#155dfc] hover:bg-[#155dfc]/90 min-w-[120px]">Create Template</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function TemplateCard({ template, onEditConditions, onToggleActive, onDuplicate, onDelete }: { 
  template: ThemeTemplate, 
  onEditConditions: () => void,
  onToggleActive: (val: boolean) => void,
  onDuplicate: () => void,
  onDelete: () => void
}) {
  return (
    <Card className="p-5 border-slate-100 hover:border-[#155dfc]/30 hover:shadow-xl hover:shadow-blue-900/5 transition-all group">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 min-w-0">
          <div className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
            template.is_active ? "bg-blue-50 text-[#155dfc]" : "bg-slate-50 text-slate-400"
          )}>
            <Layout className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <h3 className="font-black text-slate-900 truncate">{template.name}</h3>
              <Badge variant="outline" className="bg-slate-50 text-slate-500 border-slate-200 text-[10px] font-black uppercase tracking-tighter shrink-0">
                {TEMPLATE_TYPE_LABELS[template.type]}
              </Badge>
              {template.status === 'published' ? (
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" title="Published" />
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300" title="Draft" />
              )}
            </div>
            <div className="flex items-center gap-3 mt-1.5">
              <button 
                onClick={onEditConditions}
                className="text-[11px] font-bold text-[#155dfc] hover:underline flex items-center gap-1.5 bg-blue-50/50 px-2 py-0.5 rounded-md"
              >
                <Settings className="w-3 h-3" />
                {template.conditions?.length > 0 
                  ? `${template.conditions.length} Conditions Assigned` 
                  : "Add Display Conditions"}
              </button>
              <div className="h-3 w-px bg-slate-200" />
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Priority: {template.priority}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-1">Active</span>
            <button 
              onClick={() => onToggleActive(!template.is_active)}
              className={cn(
                "w-10 h-6 rounded-full relative transition-colors duration-300",
                template.is_active ? "bg-[#155dfc]" : "bg-slate-200"
              )}
            >
              <div className={cn(
                "absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 shadow-sm",
                template.is_active ? "translate-x-4" : ""
              )} />
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

function ConditionsModal({ template, isOpen, onClose, onSave }: { 
  template: ThemeTemplate, 
  isOpen: boolean, 
  onClose: () => void,
  onSave: (conditions: DisplayCondition[]) => Promise<void>
}) {
  const [conditions, setConditions] = useState<DisplayCondition[]>(template.conditions || []);
  const [isSaving, setIsSubmitting] = useState(false);

  const addCondition = () => {
    const newCondition: DisplayCondition = {
      id: Math.random().toString(36).substring(7),
      type: 'include',
      target: 'entire_site',
      subTarget: 'all',
      values: []
    };
    setConditions([...conditions, newCondition]);
  };

  const removeCondition = (id: string) => {
    setConditions(conditions.filter(c => c.id !== id));
  };

  const updateCondition = (id: string, updates: Partial<DisplayCondition>) => {
    setConditions(conditions.map(c => c.id === id ? { ...c, ...updates } : c));
  };

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
        className="relative bg-white w-full max-w-3xl rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
      >
        <div className="p-8 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-xl font-black text-slate-900">Display Conditions</h3>
            <p className="text-sm text-slate-500 font-medium mt-1">Template: <span className="font-bold text-[#155dfc]">{template.name}</span></p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {conditions.length === 0 ? (
            <div className="text-center py-12 bg-slate-50/50 rounded-[32px] border-2 border-dashed border-slate-200">
              <Globe className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h4 className="font-bold text-slate-900">No conditions set</h4>
              <p className="text-sm text-slate-500 mt-1">This template will not be displayed anywhere yet.</p>
              <Button 
                variant="outline" 
                className="mt-6 rounded-full border-slate-200 gap-2 font-bold"
                onClick={addCondition}
              >
                <PlusCircle className="w-4 h-4" /> Add Condition
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Reorder.Group axis="y" values={conditions} onReorder={setConditions} className="space-y-3">
                {conditions.map((condition) => (
                  <Reorder.Item 
                    key={condition.id} 
                    value={condition}
                    className="flex items-center gap-3 group"
                  >
                    <div className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500">
                      <GripVertical className="w-5 h-5" />
                    </div>
                    
                    <div className="flex-1 grid grid-cols-12 gap-2 p-4 bg-slate-50 border border-slate-200 rounded-2xl items-center shadow-sm">
                      <div className="col-span-2">
                        <select 
                          className={cn(
                            "w-full h-10 px-2 rounded-xl text-xs font-black uppercase tracking-tight outline-none border-2",
                            condition.type === 'include' ? "bg-green-50 text-green-700 border-green-100" : "bg-red-50 text-red-700 border-red-100"
                          )}
                          value={condition.type}
                          onChange={(e) => updateCondition(condition.id, { type: e.target.value as any })}
                        >
                          <option value="include">Include</option>
                          <option value="exclude">Exclude</option>
                        </select>
                      </div>

                      <div className="col-span-4">
                        <select 
                          className="w-full h-10 px-3 bg-blue-50/30 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#155dfc]/20 focus:border-[#155dfc]"
                          value={condition.target}
                          onChange={(e) => updateCondition(condition.id, { target: e.target.value as any, subTarget: 'all' })}
                        >
                          <option value="entire_site">Entire Site</option>
                          <option value="singular">Singular</option>
                          <option value="archive">Archive</option>
                          <option value="woocommerce">WooCommerce</option>
                        </select>
                      </div>

                      <div className="col-span-5">
                        <ConditionSubSelector 
                          condition={condition} 
                          onChange={(subTarget, values) => updateCondition(condition.id, { subTarget, values })} 
                        />
                      </div>
                      
                      <div className="col-span-1 flex justify-end">
                        <button 
                          onClick={() => removeCondition(condition.id)}
                          className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </Reorder.Item>
                ))}
              </Reorder.Group>

              <button 
                onClick={addCondition}
                className="w-full py-4 border-2 border-dashed border-slate-200 rounded-[32px] text-slate-400 font-bold text-sm hover:border-[#155dfc] hover:text-[#155dfc] hover:bg-blue-50/50 transition-all flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                Add Another Condition
              </button>
            </div>
          )}
        </div>

        <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-xl border border-amber-100">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span className="text-[10px] font-black uppercase tracking-widest">Priority Conflict Check Active</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="font-bold text-slate-500" onClick={onClose}>Cancel</Button>
            <Button 
              className="bg-[#155dfc] hover:bg-[#155dfc]/90 px-10 h-12 rounded-full font-black text-sm shadow-xl shadow-blue-200"
              isLoading={isSaving}
              onClick={() => {
                setIsSubmitting(true);
                onSave(conditions).finally(() => setIsSubmitting(false));
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

function ConditionSubSelector({ condition, onChange }: { 
  condition: DisplayCondition, 
  onChange: (sub: ConditionSubTarget, vals: string[]) => void 
}) {
  if (condition.target === 'entire_site') {
    return (
      <div className="h-10 px-3 flex items-center text-xs font-black text-slate-400 uppercase tracking-widest bg-slate-100/50 rounded-xl border border-slate-200/50">
        All Global Context
      </div>
    );
  }

  const subOptions = {
    singular: [
      { id: 'all', label: 'All Singular' },
      { id: 'post', label: 'Posts' },
      { id: 'page', label: 'Pages' },
      { id: 'specific_id', label: 'Specific ID/Search' }
    ],
    archive: [
      { id: 'all', label: 'All Archives' },
      { id: 'author', label: 'Author Archive' },
      { id: 'category', label: 'Category Archive' },
      { id: 'tag', label: 'Tag Archive' },
      { id: 'search', label: 'Search Results' }
    ],
    woocommerce: [
      { id: 'all', label: 'Shop Entire' },
      { id: 'product', label: 'Single Product' },
      { id: 'cart', label: 'Cart Page' },
      { id: 'checkout', label: 'Checkout Page' }
    ]
  };

  const options = subOptions[condition.target as keyof typeof subOptions] || [];

  return (
    <div className="flex gap-2">
      <select 
        className="flex-1 h-10 px-3 bg-blue-50/30 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#155dfc]/20 focus:border-[#155dfc]"
        value={condition.subTarget}
        onChange={(e) => onChange(e.target.value as any, [])}
      >
        {options.map(opt => (
          <option key={opt.id} value={opt.id}>{opt.label}</option>
        ))}
      </select>
      
      {condition.subTarget === 'specific_id' && (
        <div className="flex-1">
          <Input placeholder="Search ID/Slug..." className="h-10 text-xs font-bold" />
        </div>
      )}
    </div>
  );
}
