import { 
  Users, 
  FileText, 
  Globe, 
  MousePointerClick, 
  ArrowUpRight, 
  ArrowDownRight,
  Plus
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { cn } from "../lib/utils";
import { Link } from "react-router";

const stats = [
  { label: "Total Pages", value: "12,450", change: "+12.5%", trend: "up" as const, icon: FileText },
  { label: "Active Website", value: "1", change: "Verified", trend: "up" as const, icon: Globe },
  { label: "Total Leads", value: "1,204", change: "-3.2%", trend: "down" as const, icon: MousePointerClick },
  { label: "Total Users", value: "24", change: "+5.4%", trend: "up" as const, icon: Users },
];

export default function DashboardHome() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Welcome back, Admin</h2>
          <p className="text-slate-500">Here's what's happening with your SEO platform today.</p>
        </div>
        <Link to="/admin/pages">
          <Button className="gap-2 bg-[#155dfc] hover:bg-[#155dfc]/90">
            <Plus className="w-4 h-4" />
            Quick Action
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="hover:shadow-lg hover:shadow-slate-200/50 transition-all group border-slate-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-blue-50 transition-colors">
                  <stat.icon className="w-5 h-5 text-slate-500 group-hover:text-blue-600 transition-colors" />
                </div>
                <Badge variant={stat.trend === "up" ? "success" : "error"} className="gap-1 px-2 py-1">
                  {stat.trend === "up" ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.change}
                </Badge>
              </div>
              <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold mt-1 tracking-tight">{stat.value}</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-slate-100">
          <CardHeader>
            <CardTitle>Traffic Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <p className="text-slate-400 text-sm italic">Analytics Chart Placeholder</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-slate-100">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-slate-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">New page generated for "Plumber in Noida"</p>
                    <p className="text-xs text-slate-400">2 minutes ago</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
