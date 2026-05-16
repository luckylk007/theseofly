import { Link } from "react-router";
import { 
  ArrowRight, 
  Zap, 
  Search, 
  Globe, 
  ShieldCheck, 
  Sparkles,
  LayoutDashboard
} from "lucide-react";
import { Button } from "../components/ui/Button";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* Navigation */}
      <nav className="h-20 border-b flex items-center justify-between px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200">T</div>
          <span className="font-bold text-2xl tracking-tight">Theseofly</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
          <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
          <a href="#solutions" className="hover:text-blue-600 transition-colors">Solutions</a>
          <a href="#pricing" className="hover:text-blue-600 transition-colors">Pricing</a>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login">
            <Button variant="ghost" className="font-semibold">Login</Button>
          </Link>
          <Button className="font-bold shadow-lg shadow-blue-200">
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="py-20 md:py-32 px-6 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-bold mb-8 animate-fade-in">
          <Sparkles className="w-4 h-4" />
          <span>Next-Gen Programmatic SEO Platform</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 leading-[1.1]">
          Scale Your Search Traffic <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Automatically.</span>
        </h1>
        <p className="text-xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed">
          Generate thousands of high-converting landing pages in minutes. Use our AI-powered engine to dominate every search keyword in your industry.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" className="h-14 px-10 text-lg font-bold shadow-xl shadow-blue-200 gap-2">
            Get Started Free <ArrowRight className="w-5 h-5" />
          </Button>
          <Button size="lg" variant="outline" className="h-14 px-10 text-lg font-bold">
            View Live Demo
          </Button>
        </div>
      </header>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to grow</h2>
            <p className="text-slate-500">Powerful tools designed for modern SEO teams.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">SEO Engine</h3>
              <p className="text-slate-500 leading-relaxed">Bulk generate thousands of pages using dynamic templates and intelligent variable interpolation.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">AI Meta Control</h3>
              <p className="text-slate-500 leading-relaxed">Automatically optimize meta titles and descriptions using our advanced AI assistant.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Single-Site Focus</h3>
              <p className="text-slate-500 leading-relaxed">Deeply integrated management for your primary domain, ensuring maximum authority.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t text-center text-slate-400 text-sm">
        <p>&copy; {new Date().getFullYear()} Theseofly. All rights reserved.</p>
      </footer>
    </div>
  );
}
