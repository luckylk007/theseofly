import { Outlet, Link, useNavigate } from "react-router";
import { 
  LayoutDashboard, 
  FileText, 
  Image as ImageIcon, 
  Settings, 
  LogOut, 
  Search, 
  Users, 
  Globe,
  Bell,
  ChevronRight,
  Menu,
  X,
  Loader2,
  Layout,
  FolderTree
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useAuth } from "../hooks/useAuth";
import { useAuthStore } from "../stores/useAuthStore";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: FileText, label: "Pages", href: "/admin/pages" },
  { icon: FolderTree, label: "Categories & Tags", href: "/admin/taxonomies" },
  { icon: Layout, label: "Theme Builder", href: "/admin/theme-builder" },
  { icon: Search, label: "SEO Engine", href: "/admin/seo" },
  { icon: ImageIcon, label: "Media", href: "/admin/media" },
  { icon: Users, label: "Users", href: "/admin/users" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];



export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, profile, loading } = useAuth();
  const { signOut } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);



  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  const activeUser = user || { email: 'guest@theseofly.com' };
  const activeProfile = profile || { full_name: 'Guest Admin', role: 'admin' };

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-900">
      {/* Sidebar - Desktop */}
      <aside 
        className={cn(
          "hidden md:flex flex-col border-r bg-white transition-all duration-300",
          isSidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">T</div>
          {isSidebarOpen && <span className="font-bold text-xl tracking-tight">Theseofly</span>}
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors group"
            >
              <item.icon className="w-5 h-5 text-slate-500 group-hover:text-blue-600 transition-colors" />
              {isSidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t">
          <button 
            onClick={() => signOut()}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors group"
          >
            <LogOut className="w-5 h-5" />
            {isSidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b bg-white flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-100 rounded-lg hidden md:block"
            >
              <Menu className="w-5 h-5 text-slate-500" />
            </button>
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 hover:bg-slate-100 rounded-lg md:hidden"
            >
              <Menu className="w-5 h-5 text-slate-500" />
            </button>
            <h1 className="font-semibold text-lg hidden sm:block">Dashboard</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm w-64 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              />
            </div>
            <button className="p-2 hover:bg-slate-100 rounded-full relative">
              <Bell className="w-5 h-5 text-slate-500" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l ml-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold leading-none">{activeProfile?.full_name || activeUser.email}</p>
                <p className="text-xs text-slate-400 mt-1 capitalize">{activeProfile?.role || "Editor"}</p>
              </div>
              <div className="w-8 h-8 bg-slate-200 rounded-full overflow-hidden border">
                <img 
                  src={activeProfile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${activeUser.email}`} 
                  alt="Avatar" 
                />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <Outlet />
        </div>
      </main>


      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-white z-50 md:hidden flex flex-col"
            >
              <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">T</div>
                  <span className="font-bold text-xl tracking-tight">Theseofly</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="w-6 h-6 text-slate-500" />
                </button>
              </div>
              <nav className="flex-1 px-4 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 transition-colors"
                  >
                    <item.icon className="w-5 h-5 text-slate-500" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
              </nav>
              <div className="p-6 border-t">
                <button 
                  onClick={() => signOut()}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-red-50 text-red-600 font-medium"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

