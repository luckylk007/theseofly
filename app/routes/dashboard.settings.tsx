import { useState, useEffect } from "react";
import { 
  Globe, 
  Settings as SettingsIcon, 
  Shield, 
  Cpu, 
  Save,
  CheckCircle2,
  RefreshCw,
  Layout,
  Loader2,
  Check,
  AlertCircle
} from "lucide-react";
import { useWebsite } from "../hooks/useWebsite";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/Card";
import { cn } from "../lib/utils";
import { useAuth } from "../hooks/useAuth";

export default function SettingsPage() {
  const { website, loading, updateWebsite } = useWebsite();
  const { profile } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    domain: "",
    description: "",
  });

  useEffect(() => {
    if (website) {
      setFormData({
        name: website.name || "",
        domain: website.domain || "",
        description: website.description || "",
      });
    }
  }, [website]);

  const tabs = [
    { id: "general", label: "General", icon: Layout },
    { id: "seo", label: "Global SEO", icon: SettingsIcon },
    { id: "automation", label: "Automation", icon: Cpu },
    { id: "security", label: "Security", icon: Shield },
  ];

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    setError(null);

    try {
      await updateWebsite(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to update settings.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
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
          <h2 className="text-2xl font-bold tracking-tight">Platform Settings</h2>
          <p className="text-slate-500">Configure your global SEO rules, automation, and security.</p>
        </div>
        <Button 
          onClick={handleSave}
          isLoading={isSaving}
          className="gap-2 shadow-lg shadow-blue-200"
        >
          {saveSuccess ? <Check className="w-4 h-4" /> : !isSaving && <Save className="w-4 h-4" />}
          {saveSuccess ? "Saved!" : "Save Settings"}
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl flex gap-3 items-center text-sm font-medium border border-red-100">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Tabs */}
        <div className="space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                activeTab === tab.id 
                  ? "bg-white text-blue-600 shadow-sm border border-slate-200" 
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-8">
          {activeTab === "general" && (
            <Card className="border-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layout className="w-5 h-5 text-blue-600" />
                  General Configuration
                </CardTitle>
                <CardDescription>Update your primary website details.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Site Name</label>
                    <Input 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="My Portfolio"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Primary Domain</label>
                    <Input 
                      value={formData.domain}
                      onChange={(e) => setFormData({...formData, domain: e.target.value})}
                      placeholder="example.com"
                    />
                  </div>
                </div>
                <div className="space-y-2 pt-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Site Description</label>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none h-32 resize-none"
                    placeholder="Describe your site for search engines..."
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "automation" && (
            <div className="space-y-6">
              <Card className="border-slate-100">
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-blue-600" />
                    SEO Automation Jobs
                  </CardTitle>
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-full uppercase tracking-wider">
                    <CheckCircle2 className="w-3 h-3" />
                    System Active
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  {[
                    { title: "Auto Sitemap Generation", desc: "Update XML sitemaps every 24 hours.", enabled: true },
                    { title: "Instant Indexing (Google API)", desc: "Ping Google Search Console when new pages are published.", enabled: true },
                    { title: "Broken Link Monitor", desc: "Scan websites weekly for 404 errors.", enabled: false },
                    { title: "AI Content Refresh", desc: "Periodically rewrite low-performing meta descriptions.", enabled: false },
                  ].map((job) => (
                    <div key={job.title} className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl hover:bg-slate-50/50 transition-colors group">
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition-colors">
                          <Cpu className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{job.title}</p>
                          <p className="text-xs text-slate-500">{job.desc}</p>
                        </div>
                      </div>
                      <div className={cn(
                        "w-12 h-6 rounded-full p-1 cursor-pointer transition-all",
                        job.enabled ? "bg-blue-600" : "bg-slate-200"
                      )}>
                        <div className={cn(
                          "w-4 h-4 bg-white rounded-full shadow-sm transition-transform",
                          job.enabled ? "translate-x-6" : ""
                        )} />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "seo" && (
            <Card className="border-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SettingsIcon className="w-5 h-5 text-blue-600" />
                  Global SEO Rules
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-2">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Default Title Suffix</label>
                  <Input defaultValue="| Theseofly Platform" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Default OG Image Template</label>
                  <Input defaultValue="https://cdn.theseofly.com/templates/og-default.png" />
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <input type="checkbox" id="noindex_all" className="w-4 h-4 text-blue-600 rounded" />
                  <label htmlFor="noindex_all" className="text-sm font-medium text-slate-700">Apply 'noindex' to all draft pages</label>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="border-slate-100">
            <CardHeader>
              <CardTitle>Platform Role</CardTitle>
              <CardDescription>Your current access level and permissions.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                    {profile?.role?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold capitalize">{profile?.role || 'User'}</p>
                    <p className="text-xs text-slate-500">Full access to manage the platform</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" disabled>Manage Access</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
