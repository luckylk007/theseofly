import { Outlet, Link, useLocation, useNavigate } from "react-router";
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
import { useWebsiteStore } from "../stores/useWebsiteStore";

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
  const { user, profile, loading: authLoading, initialized } = useAuth();
  const { website, loading: websiteLoading, fetchWebsite, reset } = useWebsiteStore();
  const { signOut } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // 1. Auth Guard
  useEffect(() => {
    if (initialized && !authLoading && !user) {
      reset();
      navigate("/login");
    }
  }, [user, authLoading, initialized, navigate, reset]);

  // 2. Initial Data Fetch
  useEffect(() => {
    if (user) {
      fetchWebsite(user);
    } else if (initialized) {
      reset();
    }
  }, [user, fetchWebsite, initialized, reset]);

  // 3. Main Loading State
  if (!initialized || authLoading || (user && websiteLoading && !website)) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest animate-pulse">Initializing Platform...</p>
        </div>
      </div>
    );
  }

  const activeUser = user || { email: 'admin@theseofly.com' };
  const activeProfile = profile || { full_name: 'Admin', role: 'admin' };

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
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200">T</div>
          {isSidebarOpen && <span className="font-bold text-xl tracking-tight">Theseofly</span>}
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group",
                location.pathname === item.href 
                  ? "bg-blue-50 text-blue-600" 
                  : "text-slate-500 hover:bg-slate-50"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 transition-colors",
                location.pathname === item.href ? "text-blue-600" : "text-slate-400 group-hover:text-blue-600"
              )} />
              {isSidebarOpen && <span className="text-sm font-bold">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={() => signOut()}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-red-50 text-red-600 transition-colors group font-bold"
          >
            <LogOut className="w-5 h-5" />
            {isSidebarOpen && <span className="text-sm">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b bg-white flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm shadow-slate-100">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-50 rounded-xl hidden md:block transition-colors"
            >
              <Menu className="w-5 h-5 text-slate-400" />
            </button>
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 hover:bg-slate-50 rounded-xl md:hidden transition-colors"
            >
              <Menu className="w-5 h-5 text-slate-400" />
            </button>
            <h1 className="font-bold text-lg hidden sm:block text-slate-900">Dashboard</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm w-64 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
              />
            </div>
            <button className="p-2 hover:bg-slate-50 rounded-full relative transition-colors border border-transparent hover:border-slate-100">
              <Bell className="w-5 h-5 text-slate-400" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-100 ml-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black leading-none text-slate-900">{activeProfile?.full_name || activeUser.email}</p>
                <p className="text-[10px] font-black text-slate-400 mt-1 capitalize tracking-widest">{activeProfile?.role || "Editor"}</p>
              </div>
              <div className="w-10 h-10 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
                <img 
                  src={activeProfile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${activeUser.email}`} 
                  alt="Avatar" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-[#f8fafc]">
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
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-white z-50 md:hidden flex flex-col shadow-2xl"
            >
              <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">T</div>
                  <span className="font-bold text-xl tracking-tight">Theseofly</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-slate-50 rounded-xl">
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>
              <nav className="flex-1 px-4 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all font-bold",
                      location.pathname === item.href 
                        ? "bg-blue-50 text-blue-600" 
                        : "text-slate-500 hover:bg-slate-50"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="text-sm">{item.label}</span>
                  </Link>
                ))}
              </nav>
              <div className="p-6 border-t border-slate-50">
                <button 
                  onClick={() => signOut()}
                  className="flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl bg-red-50 text-red-600 font-black text-sm uppercase tracking-widest transition-all"
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
