import { useState, useEffect } from "react";
import { 
  Users, 
  FileText, 
  Globe, 
  Plus, 
  ArrowUpRight, 
  ArrowDownRight,
  TrendingUp,
  Image as ImageIcon,
  Loader2,
  Activity,
  Layers,
  Sparkles,
  ArrowRight,
  Calendar,
  Compass,
  Settings,
  FolderHeart,
  CheckCircle2,
  Clock
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Link } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { useWebsite } from "../hooks/useWebsite";
import { supabase } from "../lib/supabase";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";

// Helper for relative time formatting
function getRelativeTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  return `${diffDays}d ago`;
}

interface StatsData {
  totalPages: number;
  publishedPages: number;
  draftPages: number;
  scheduledPages: number;
  programmaticCount: number;
  mediaCount: number;
  usersCount: number;
}

interface ActivityItem {
  id: string;
  title: string;
  slug: string;
  status: string;
  updated_at: string;
}

interface ChartDay {
  dateLabel: string;
  count: number;
}

export default function DashboardHome() {
  const { profile, user } = useAuth();
  const { website, loading: websiteLoading } = useWebsite();

  const [loadingData, setLoadingData] = useState(true);
  const [stats, setStats] = useState<StatsData>({
    totalPages: 0,
    publishedPages: 0,
    draftPages: 0,
    scheduledPages: 0,
    programmaticCount: 0,
    mediaCount: 0,
    usersCount: 0
  });
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [chartData, setChartData] = useState<ChartDay[]>([]);
  const [growthPercentage, setGrowthPercentage] = useState("+0%");

  useEffect(() => {
    async function fetchDashboardData() {
      if (!website?.id) return;
      setLoadingData(true);

      try {
        // 1. Fetch counts and aggregates in parallel to optimize latency
        const [
          pagesRes,
          citiesRes,
          servicesRes,
          mediaRes,
          usersRes,
          recentActivityRes
        ] = await Promise.all([
          // Pages count & status grouping
          supabase
            .from('pages')
            .select('status, created_at')
            .eq('website_id', website.id),
          
          // Programmatic: Cities
          supabase
            .from('cities')
            .select('id', { count: 'exact', head: true })
            .eq('website_id', website.id)
            .is('deleted_at', null),

          // Programmatic: Services
          supabase
            .from('services')
            .select('id', { count: 'exact', head: true })
            .eq('website_id', website.id)
            .is('deleted_at', null),

          // Media Items
          supabase
            .from('media')
            .select('id', { count: 'exact', head: true })
            .eq('website_id', website.id),

          // Users (fall back to 1 if RLS block occurs)
          supabase
            .from('profiles')
            .select('id', { count: 'exact', head: true }),

          // Recent Activity: Last 5 updated pages
          supabase
            .from('pages')
            .select('id, title, slug, status, updated_at')
            .eq('website_id', website.id)
            .order('updated_at', { ascending: false })
            .limit(5)
        ]);

        // Process Pages
        const allPages = (pagesRes.data as any[]) || [];
        const totalPages = allPages.length;
        const publishedPages = allPages.filter(p => p.status === 'published').length;
        const draftPages = allPages.filter(p => p.status === 'draft').length;
        const scheduledPages = allPages.filter(p => p.status === 'scheduled').length;

        // Process Programmatic
        const programmaticCount = (citiesRes.count || 0) + (servicesRes.count || 0);

        // Process Media
        const mediaCount = mediaRes.count || 0;

        // Process Users (Graceful fallback if users count is locked/blocked)
        const usersCount = usersRes.count || 1;

        setStats({
          totalPages,
          publishedPages,
          draftPages,
          scheduledPages,
          programmaticCount,
          mediaCount,
          usersCount
        });

        // Set Recent Activity
        setRecentActivity((recentActivityRes.data as any[]) || []);

        // 2. Build 7-day timeline for Page Generation
        const days = Array.from({ length: 7 }).map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - i);
          return {
            dateLabel: d.toLocaleDateString('en-US', { weekday: 'short' }),
            fullDateString: d.toISOString().split('T')[0],
            count: 0
          };
        }).reverse();

        allPages.forEach(p => {
          if (p.created_at) {
            const dateStr = p.created_at.split('T')[0];
            const matchingDay = days.find(d => d.fullDateString === dateStr);
            if (matchingDay) {
              matchingDay.count += 1;
            }
          }
        });

        setChartData(days.map(d => ({ dateLabel: d.dateLabel, count: d.count })));

        // Calculate growth percentage based on last 7 days creations vs overall
        const pagesCreatedLast7Days = days.reduce((acc, curr) => acc + curr.count, 0);
        if (totalPages > 0 && pagesCreatedLast7Days > 0) {
          const growth = ((pagesCreatedLast7Days / (totalPages - pagesCreatedLast7Days || 1)) * 100).toFixed(1);
          setGrowthPercentage(`+${growth}%`);
        } else if (totalPages > 0) {
          setGrowthPercentage("+0.0%");
        } else {
          setGrowthPercentage("Verified");
        }

      } catch (err) {
        console.error("Dashboard home query error:", err);
      } finally {
        setLoadingData(false);
      }
    }

    if (website?.id) {
      fetchDashboardData();
    }
  }, [website]);

  // SKELETON LOADER
  if (websiteLoading || loadingData) {
    return (
      <div className="space-y-8 animate-pulse">
        {/* Welcome Section Skeleton */}
        <div className="flex justify-between items-center">
          <div className="space-y-3">
            <div className="h-8 bg-slate-200 rounded-lg w-64"></div>
            <div className="h-4 bg-slate-200 rounded-lg w-96"></div>
          </div>
          <div className="h-10 bg-slate-200 rounded-xl w-32"></div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white border border-slate-100 rounded-2xl p-6 h-32 space-y-4">
              <div className="flex justify-between items-center">
                <div className="w-10 h-10 bg-slate-200 rounded-lg"></div>
                <div className="w-12 h-6 bg-slate-200 rounded-full"></div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-slate-200 rounded w-16"></div>
                <div className="h-5 bg-slate-200 rounded w-24"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Two Column Layout Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl p-6 h-96 space-y-4">
            <div className="h-6 bg-slate-200 rounded w-48"></div>
            <div className="h-64 bg-slate-100 rounded-xl"></div>
          </div>
          <div className="bg-white border border-slate-100 rounded-2xl p-6 h-96 space-y-4">
            <div className="h-6 bg-slate-200 rounded w-36"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // EMPTY STATE (Setup Guide if website is missing or has no configurations)
  if (!website) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-8 bg-white border border-dashed border-slate-200 rounded-3xl">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
          <Globe className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">No Connected Website Found</h2>
        <p className="text-slate-500 mt-2 max-w-md">
          Connect your first website domain to launch programmatic content generation, tracking, and deep SEO management.
        </p>
        <Link to="/admin/settings" className="mt-6">
          <Button className="bg-[#155dfc] hover:bg-[#155dfc]/90 px-6 gap-2">
            Set Up Website
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    );
  }

  // Stats definition for easy mapping
  const statsConfig = [
    { 
      label: "Total Pages", 
      value: stats.totalPages.toLocaleString(), 
      badge: growthPercentage, 
      trend: "up" as const, 
      icon: FileText,
      color: "text-blue-600 bg-blue-50/50 hover:bg-blue-50" 
    },
    { 
      label: "Connected Domain", 
      value: website.name || website.domain, 
      badge: "Active", 
      trend: "up" as const, 
      icon: Globe,
      color: "text-emerald-600 bg-emerald-50/50 hover:bg-emerald-50" 
    },
    { 
      label: "Programmatic SEO", 
      value: stats.programmaticCount.toLocaleString(), 
      badge: "Live Ready", 
      trend: "up" as const, 
      icon: Layers,
      color: "text-indigo-600 bg-indigo-50/50 hover:bg-indigo-50" 
    },
    { 
      label: "Media Files", 
      value: stats.mediaCount.toLocaleString(), 
      badge: `${stats.mediaCount > 0 ? "Synced" : "Empty"}`, 
      trend: "up" as const, 
      icon: ImageIcon,
      color: "text-amber-600 bg-amber-50/50 hover:bg-amber-50" 
    },
  ];

  // SVG Area Chart calculations
  const maxChartCount = Math.max(...chartData.map(d => d.count), 5);
  const chartHeight = 160;
  const chartWidth = 500;
  const paddingX = 40;
  const paddingY = 20;

  const points = chartData.map((d, index) => {
    const x = paddingX + (index / (chartData.length - 1)) * (chartWidth - paddingX * 2);
    const y = chartHeight - paddingY - (d.count / maxChartCount) * (chartHeight - paddingY * 2);
    return { x, y };
  });

  const pathD = points.length > 0 
    ? `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')
    : '';

  const areaD = points.length > 0
    ? `${pathD} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z`
    : '';

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            Welcome back, {profile?.full_name || "Admin"}
            <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500 animate-pulse" />
          </h2>
          <p className="text-slate-500 mt-1">Here is a real-time summary of your connected SEO platform.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/admin/seo">
            <Button className="gap-2 bg-[#155dfc] hover:bg-[#155dfc]/90 shadow-lg shadow-blue-200">
              <Plus className="w-4 h-4" />
              SEO Engine
            </Button>
          </Link>
        </div>
      </div>

      {/* Grid: 4 Core Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsConfig.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
          >
            <Card className="hover:shadow-xl hover:shadow-slate-200/50 transition-all border-slate-100/80 overflow-hidden relative group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-2xl transition-all ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <Badge variant={idx === 1 ? "success" : "outline"} className="gap-1 px-2.5 py-1">
                    {idx === 0 && <ArrowUpRight className="w-3 h-3 text-emerald-500" />}
                    {stat.badge}
                  </Badge>
                </div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
                <h3 className="text-2xl font-black mt-1 text-slate-800 tracking-tight truncate">
                  {stat.value}
                </h3>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Two Column Layout: Charts & Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Analytics Chart & Status breakdown */}
        <Card className="lg:col-span-2 border-slate-100/80 flex flex-col justify-between">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-black tracking-tight text-slate-800 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Page Creation History
                </CardTitle>
                <p className="text-xs text-slate-400">Total volume generated during the past 7 days</p>
              </div>
              <Badge className="bg-blue-50 text-blue-600 hover:bg-blue-50 border-0 font-bold px-2 py-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Past 7 Days
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col justify-between pt-4">
            {/* SVG Interactive Area Chart */}
            <div className="w-full">
              {stats.totalPages === 0 ? (
                <div className="h-[160px] flex items-center justify-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-slate-400 text-sm italic">No page generation data recorded yet.</p>
                </div>
              ) : (
                <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-[180px] overflow-visible">
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#155dfc" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#155dfc" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Grid Lines */}
                  {[0, 1, 2, 3].map((g) => {
                    const lineY = paddingY + (g / 3) * (chartHeight - paddingY * 2);
                    return (
                      <line 
                        key={g}
                        x1={paddingX} 
                        y1={lineY} 
                        x2={chartWidth - paddingX} 
                        y2={lineY} 
                        stroke="#e2e8f0" 
                        strokeWidth="1" 
                        strokeDasharray="4 4"
                      />
                    );
                  })}

                  {/* Area */}
                  {areaD && <path d={areaD} fill="url(#chartGrad)" />}

                  {/* Line */}
                  {pathD && (
                    <path 
                      d={pathD} 
                      fill="none" 
                      stroke="#155dfc" 
                      strokeWidth="3" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                    />
                  )}

                  {/* Intersecting Dots */}
                  {points.map((p, idx) => (
                    <g key={idx} className="group/dot cursor-pointer">
                      <circle 
                        cx={p.x} 
                        cy={p.y} 
                        r="5" 
                        fill="#155dfc" 
                        stroke="#ffffff" 
                        strokeWidth="2" 
                        className="transition-transform group-hover/dot:scale-150"
                      />
                      <rect 
                        x={p.x - 20} 
                        y={p.y - 28} 
                        width="40" 
                        height="20" 
                        rx="4" 
                        fill="#0f172a" 
                        className="opacity-0 group-hover/dot:opacity-100 transition-opacity pointer-events-none"
                      />
                      <text 
                        x={p.x} 
                        y={p.y - 14} 
                        fill="#ffffff" 
                        fontSize="9" 
                        fontWeight="bold" 
                        textAnchor="middle" 
                        className="opacity-0 group-hover/dot:opacity-100 transition-opacity pointer-events-none"
                      >
                        {chartData[idx].count}
                      </text>
                    </g>
                  ))}

                  {/* X Labels */}
                  {chartData.map((d, index) => {
                    const x = paddingX + (index / (chartData.length - 1)) * (chartWidth - paddingX * 2);
                    return (
                      <text 
                        key={index}
                        x={x} 
                        y={chartHeight - 4} 
                        fill="#94a3b8" 
                        fontSize="9" 
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {d.dateLabel}
                      </text>
                    );
                  })}
                </svg>
              )}
            </div>

            {/* Status Breakdown Grid */}
            <div className="grid grid-cols-3 gap-4 border-t pt-4 mt-4">
              <div className="text-center p-3 bg-emerald-50/20 rounded-2xl border border-emerald-50/50">
                <p className="text-[10px] font-black uppercase text-emerald-600 tracking-wider">Published</p>
                <p className="text-xl font-black text-slate-800 mt-1">{stats.publishedPages}</p>
              </div>
              <div className="text-center p-3 bg-amber-50/20 rounded-2xl border border-amber-50/50">
                <p className="text-[10px] font-black uppercase text-amber-600 tracking-wider">Drafts</p>
                <p className="text-xl font-black text-slate-800 mt-1">{stats.draftPages}</p>
              </div>
              <div className="text-center p-3 bg-blue-50/20 rounded-2xl border border-blue-50/50">
                <p className="text-[10px] font-black uppercase text-blue-600 tracking-wider">Scheduled</p>
                <p className="text-xl font-black text-slate-800 mt-1">{stats.scheduledPages}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Recent Activity Logs */}
        <Card className="border-slate-100/80 flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-lg font-black tracking-tight text-slate-800 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-600" />
              Recent SEO Activity
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col justify-between">
            {recentActivity.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                <CheckCircle2 className="w-10 h-10 text-slate-200 mb-2" />
                <p className="text-slate-400 text-sm font-medium">No recent activity detected.</p>
                <p className="text-[11px] text-slate-400 max-w-xs mt-1">
                  Use the SEO Engine or programmatic tools to build and publish your first landing pages.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivity.map((activity, idx) => (
                  <motion.div 
                    key={activity.id} 
                    className="flex gap-4 p-3 hover:bg-slate-50 rounded-2xl transition-colors group cursor-pointer border border-transparent hover:border-slate-100"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: idx * 0.05 }}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center shrink-0 border",
                      activity.status === 'published' 
                        ? 'bg-emerald-50 border-emerald-100 text-emerald-600'
                        : activity.status === 'draft'
                        ? 'bg-amber-50 border-amber-100 text-amber-600'
                        : 'bg-blue-50 border-blue-100 text-blue-600'
                    )}>
                      {activity.status === 'published' ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-800 truncate leading-none group-hover:text-blue-600 transition-colors">
                        {activity.title}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1.5 flex items-center gap-1 font-medium">
                        slug: <span className="bg-slate-100 text-slate-600 px-1 rounded truncate max-w-[100px]">{activity.slug}</span>
                        • {getRelativeTime(activity.updated_at)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
            
            <Link to="/admin/pages" className="mt-4 block">
              <Button variant="ghost" className="w-full text-xs font-black uppercase tracking-wider text-slate-500 hover:text-slate-800 hover:bg-slate-50 flex items-center justify-center gap-2 py-5 rounded-2xl">
                View All Pages
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Quick Action Dashboard Panel */}
      <Card className="border-slate-100/80">
        <CardHeader className="pb-3">
          <CardTitle className="text-md font-black tracking-tight text-slate-800 flex items-center gap-2">
            <Compass className="w-5 h-5 text-indigo-600" />
            Quick Action Panel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "SEO Generator", desc: "Bulk generate from templates", link: "/admin/seo", icon: Sparkles, color: "text-blue-600 bg-blue-50 border-blue-100 hover:bg-blue-100/50" },
              { label: "Connected Settings", desc: "Manage site domain rules", link: "/admin/settings", icon: Settings, color: "text-indigo-600 bg-indigo-50 border-indigo-100 hover:bg-indigo-100/50" },
              { label: "Media Library", desc: "Upload and optimize images", link: "/admin/media", icon: ImageIcon, color: "text-amber-600 bg-amber-50 border-amber-100 hover:bg-amber-100/50" },
              { label: "Categories", desc: "Edit tag & category taxonomies", link: "/admin/taxonomies", icon: FolderHeart, color: "text-rose-600 bg-rose-50 border-rose-100 hover:bg-rose-100/50" },
            ].map(act => (
              <Link key={act.label} to={act.link}>
                <div className={`p-4 rounded-2xl border transition-all cursor-pointer group flex flex-col h-full justify-between gap-3 ${act.color}`}>
                  <act.icon className="w-6 h-6 transition-transform group-hover:scale-115" />
                  <div>
                    <p className="text-xs font-black tracking-tight text-slate-800">{act.label}</p>
                    <p className="text-[10px] text-slate-400 mt-1 font-medium leading-tight">{act.desc}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
