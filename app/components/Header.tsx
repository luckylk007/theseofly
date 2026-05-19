import { Link } from "react-router";
import { Button } from "./ui/Button";

export function Header() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200">T</div>
          <span className="font-bold text-2xl tracking-tighter text-slate-900">Theseofly</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-10 text-[15px] font-semibold text-slate-600">
          <Link to="/#features" className="hover:text-blue-600 transition-colors">Features</Link>
          <Link to="/#about" className="hover:text-blue-600 transition-colors">About Us</Link>
          <Link to="/#process" className="hover:text-blue-600 transition-colors">Process</Link>
          <Link to="/#solutions" className="hover:text-blue-600 transition-colors">Solutions</Link>
        </div>

        <div className="flex items-center gap-4">
          <Button className="h-11 px-7 rounded-full font-bold shadow-lg shadow-blue-100 hover:shadow-blue-200 transition-all">
            Get Started
          </Button>
        </div>
      </div>
    </nav>
  );
}
