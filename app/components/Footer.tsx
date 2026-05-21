import { Link } from "react-router";
import { Button } from "./ui/Button";

export function Footer() {
  return (
    <footer className="pt-24 pb-12 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
        {/* Identity */}
        <div className="space-y-8 lg:col-span-1">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">T</div>
            <span className="font-bold text-2xl tracking-tighter text-slate-900">Theseofly</span>
          </div>
          <p className="text-slate-500 font-medium leading-relaxed">
            Empowering modern teams to scale their search traffic through programmatic automation and AI optimization.
          </p>
          <div className="flex gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-600 transition-all cursor-pointer" />
            ))}
          </div>
        </div>

        {/* Company Links */}
        <div className="space-y-8">
          <h5 className="text-lg font-black tracking-tight text-slate-900">Company</h5>
          <ul className="space-y-4 text-slate-500 font-bold text-sm">
            <li><Link to="/about-us" className="hover:text-blue-600 transition-colors">About Us</Link></li>
            <li><Link to="/plans" className="hover:text-blue-600 transition-colors">Pricing Plans</Link></li>
            <li><Link to="/blog" className="hover:text-blue-600 transition-colors">Insights Blog</Link></li>
            <li><Link to="/contact-us" className="hover:text-blue-600 transition-colors">Contact Us</Link></li>
          </ul>
        </div>

        {/* SEO Solutions */}
        <div className="space-y-8">
          <h5 className="text-lg font-black tracking-tight text-slate-900">SEO Solutions</h5>
          <ul className="space-y-4 text-slate-500 font-bold text-sm">
            <li><Link to="/services" className="hover:text-blue-600 transition-colors">Our Services</Link></li>
            <li><Link to="/industries" className="hover:text-blue-600 transition-colors">Industries We Serve</Link></li>
            <li><Link to="/countries" className="hover:text-blue-600 transition-colors">Countries Served</Link></li>
            <li><Link to="/cities" className="hover:text-blue-600 transition-colors">Cities Served</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-8">
          <h5 className="text-lg font-black tracking-tight text-slate-900">Contact Us</h5>
          <div className="space-y-4 text-slate-500 font-bold text-sm">
            <p>📍 100 Pine Street, San Francisco, CA 94111</p>
            <p>📧 growth@theseofly.com</p>
            <p>📞 +1 (888) 555-0199</p>
            <div className="pt-4">
              <Link to="/contact-us">
                <Button variant="outline" className="w-full h-12 rounded-xl font-bold border-slate-200 cursor-pointer">
                  Request a Quote
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">&copy; {new Date().getFullYear()} Theseofly Platform. All rights reserved.</p>
        <div className="flex gap-8 text-xs font-bold text-slate-400 uppercase tracking-widest">
          <a href="#" className="hover:text-slate-900 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-slate-900 transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
