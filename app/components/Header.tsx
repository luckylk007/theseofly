import { useState } from "react";
import { Link } from "react-router";
import { Button } from "./ui/Button";
import { ChevronDown, Menu, X, ArrowRight, Sparkles, MapPin, BookOpen, Layers } from "lucide-react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-100/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200 group-hover:scale-105 transition-transform duration-300">T</div>
          <span className="font-bold text-2xl tracking-tighter text-slate-900 group-hover:text-blue-600 transition-colors">Theseofly</span>
        </Link>
        
        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-[15px] font-bold text-slate-600">
          <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <Link to="/services" className="hover:text-blue-600 transition-colors">Services</Link>
          <Link to="/industries" className="hover:text-blue-600 transition-colors">Industries</Link>
          
          {/* Locations Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setActiveDropdown('locations')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button className="flex items-center gap-1 hover:text-blue-600 transition-colors focus:outline-none py-2 cursor-pointer">
              <span>Locations</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === 'locations' ? 'rotate-180 text-blue-600' : ''}`} />
            </button>
            {activeDropdown === 'locations' && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-64 bg-white border border-slate-100 rounded-2xl shadow-xl p-4 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="space-y-1">
                  <Link to="/countries" className="flex items-center gap-3 p-3 hover:bg-blue-50/50 rounded-xl transition-colors group">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">🌐</div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 group-hover:text-blue-600">Countries We Serve</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Multi-Region Hubs</p>
                    </div>
                  </Link>
                  <Link to="/cities" className="flex items-center gap-3 p-3 hover:bg-blue-50/50 rounded-xl transition-colors group">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">📍</div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 group-hover:text-blue-600">Cities We Serve</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Localized SEO Scaling</p>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Resources Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setActiveDropdown('resources')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button className="flex items-center gap-1 hover:text-blue-600 transition-colors focus:outline-none py-2 cursor-pointer">
              <span>Company</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === 'resources' ? 'rotate-180 text-blue-600' : ''}`} />
            </button>
            {activeDropdown === 'resources' && (
              <div className="absolute top-full right-0 w-72 bg-white border border-slate-100 rounded-2xl shadow-xl p-4 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="space-y-1">
                  <Link to="/plans" className="flex items-center gap-3 p-3 hover:bg-blue-50/50 rounded-xl transition-colors group">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">💳</div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 group-hover:text-blue-600">Pricing Plans</p>
                      <p className="text-[10px] text-slate-400 font-bold">Standard & Scale Packages</p>
                    </div>
                  </Link>
                  <Link to="/blog" className="flex items-center gap-3 p-3 hover:bg-blue-50/50 rounded-xl transition-colors group">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">📝</div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 group-hover:text-blue-600">Insights Blog</p>
                      <p className="text-[10px] text-slate-400">SEO tactics & Case studies</p>
                    </div>
                  </Link>
                  <Link to="/about-us" className="flex items-center gap-3 p-3 hover:bg-blue-50/50 rounded-xl transition-colors group">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">⚡</div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 group-hover:text-blue-600">About Us</p>
                      <p className="text-[10px] text-slate-400">Our vision & pillars</p>
                    </div>
                  </Link>
                  <Link to="/contact-us" className="flex items-center gap-3 p-3 hover:bg-blue-50/50 rounded-xl transition-colors group">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">📞</div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 group-hover:text-blue-600">Contact Us</p>
                      <p className="text-[10px] text-slate-400">Get in touch with specialists</p>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Button & Mobile Trigger */}
        <div className="flex items-center gap-4">
          <Link to="/plans" className="hidden sm:block">
            <Button className="h-11 px-7 rounded-full font-bold shadow-lg shadow-blue-100 hover:shadow-blue-200 transition-all cursor-pointer">
              Get Started
            </Button>
          </Link>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-500 hover:text-slate-900 focus:outline-none cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white absolute top-20 left-0 right-0 p-6 shadow-xl space-y-6 animate-in slide-in-from-top duration-300">
          <div className="flex flex-col gap-4 text-base font-bold text-slate-700">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="hover:text-blue-600 transition-colors py-2">Home</Link>
            <Link to="/services" onClick={() => setMobileMenuOpen(false)} className="hover:text-blue-600 transition-colors py-2">Services</Link>
            <Link to="/industries" onClick={() => setMobileMenuOpen(false)} className="hover:text-blue-600 transition-colors py-2">Industries</Link>
            
            <div className="border-t border-slate-50 my-2 pt-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Locations</p>
              <div className="grid grid-cols-2 gap-4">
                <Link to="/countries" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 hover:text-blue-600 py-1 text-sm font-semibold">🌐 Countries</Link>
                <Link to="/cities" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 hover:text-blue-600 py-1 text-sm font-semibold">📍 Cities</Link>
              </div>
            </div>
            
            <div className="border-t border-slate-50 my-2 pt-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Company</p>
              <div className="grid grid-cols-2 gap-4">
                <Link to="/plans" onClick={() => setMobileMenuOpen(false)} className="hover:text-blue-600 py-1 text-sm font-semibold">💳 Pricing</Link>
                <Link to="/blog" onClick={() => setMobileMenuOpen(false)} className="hover:text-blue-600 py-1 text-sm font-semibold">📝 Blog</Link>
                <Link to="/about-us" onClick={() => setMobileMenuOpen(false)} className="hover:text-blue-600 py-1 text-sm font-semibold">⚡ About Us</Link>
                <Link to="/contact-us" onClick={() => setMobileMenuOpen(false)} className="hover:text-blue-600 py-1 text-sm font-semibold">📞 Contact</Link>
              </div>
            </div>
          </div>
          
          <Link to="/plans" onClick={() => setMobileMenuOpen(false)} className="block w-full">
            <Button className="w-full h-12 rounded-xl font-bold">
              Get Started <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
        </div>
      )}
    </nav>
  );
}
