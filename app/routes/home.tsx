import { Link } from "react-router";
import { 
  ArrowRight, 
  Zap, 
  Search, 
  Globe, 
  ShieldCheck, 
  Sparkles,
  LayoutDashboard,
  CheckCircle2,
  BarChart3,
  MousePointerClick,
  Layers,
  Database,
  RefreshCw,
  Plus,
  Play
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* 1. Global Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200">T</div>
            <span className="font-bold text-2xl tracking-tighter text-slate-900">Theseofly</span>
          </div>
          
          <div className="hidden md:flex items-center gap-10 text-[15px] font-semibold text-slate-600">
            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#about" className="hover:text-blue-600 transition-colors">About Us</a>
            <a href="#process" className="hover:text-blue-600 transition-colors">Process</a>
            <a href="#solutions" className="hover:text-blue-600 transition-colors">Solutions</a>
          </div>

          <div className="flex items-center gap-4">
            <Button className="h-11 px-7 rounded-full font-bold shadow-lg shadow-blue-100 hover:shadow-blue-200 transition-all">
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* 2. Modern Premium Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 bg-white overflow-x-clip">
        {/* Futuristic Background Gradients & Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-full h-full max-w-7xl pointer-events-none">
           <div className="absolute top-0 left-1/4 w-[40%] h-[40%] bg-blue-50/60 blur-[120px] rounded-full opacity-50" />
           <div className="absolute top-1/4 right-1/4 w-[30%] h-[50%] bg-[#155dfc]/5 blur-[100px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Centered Headline */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-5xl mx-auto mb-16"
          >
            <h1 className="text-5xl md:text-7xl lg:text-[90px] font-black tracking-tight text-slate-900 leading-[0.9] mb-8">
              Transform Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#155dfc] via-blue-500 to-indigo-500">Online Business</span> <br />
              With Theseofly
            </h1>
          </motion.div>

          {/* Social Proof & Description Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
            {/* Left: Trust block */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center gap-6"
            >
              <div className="flex -space-x-4">
                {[1,2,3,4,5].map(i => (
                  <motion.div 
                    key={i}
                    whileHover={{ y: -5, scale: 1.1 }}
                    className="w-14 h-14 rounded-full border-4 border-white bg-slate-100 overflow-hidden shadow-xl shadow-blue-900/5 relative"
                  >
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+20}`} alt="User" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 rounded-full border border-[#155dfc]/20" />
                  </motion.div>
                ))}
                <div className="w-14 h-14 rounded-full border-4 border-white bg-[#155dfc] flex items-center justify-center text-white text-xs font-black shadow-xl shadow-blue-200">
                  +1.5K
                </div>
              </div>
              <div className="space-y-0.5">
                <p className="text-lg font-black text-slate-900">1,500+ Trusted Clients</p>
                <div className="flex gap-0.5 text-yellow-400">
                  {[1,2,3,4,5].map(i => <Sparkles key={i} className="w-3.5 h-3.5 fill-current" />)}
                </div>
              </div>
            </motion.div>

            {/* Right: Description */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <p className="text-xl text-slate-500 leading-relaxed max-w-lg md:ml-auto md:text-right font-medium">
                The world's most advanced programmatic SEO platform. Scale your search dominance with AI-powered page generation and automated meta optimization.
              </p>
            </motion.div>
          </div>

          {/* Large Hero Banner */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="relative"
          >
            <div className="relative aspect-[16/10] md:aspect-[21/9] bg-gradient-to-br from-[#155dfc] via-[#0d47a1] to-[#0a2e5c] rounded-[40px] md:rounded-[60px] shadow-[0_40px_100px_-20px_rgba(21,93,252,0.4)] overflow-hidden p-8 md:p-16 flex flex-col justify-between">
              {/* Abstract Visuals inside banner */}
              <div className="absolute top-0 right-0 w-full h-full opacity-30 pointer-events-none">
                <svg className="w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="none">
                   <path d="M0,1000 C300,800 400,900 700,600 C900,400 1000,500 1000,0 L1000,0 L0,0 Z" fill="rgba(255,255,255,0.1)" />
                   <circle cx="850" cy="150" r="250" fill="url(#grad1)" />
                   <defs>
                     <radialGradient id="grad1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                       <stop offset="0%" stopColor="rgba(255,255,255,0.25)" />
                       <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                     </radialGradient>
                   </defs>
                </svg>
              </div>
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/glass.png')] opacity-20 mix-blend-overlay" />

              {/* Floating Service Pills */}
              <div className="relative z-20 flex flex-wrap gap-3 max-w-3xl">
                {[
                  "On-Page SEO", "Content Marketing", "Off-Page SEO", 
                  "Social Media Marketing", "Analytics & Reporting", "Influencer Marketing"
                ].map((pill, idx) => (
                  <motion.div 
                    key={pill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + (idx * 0.1) }}
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.25)", borderColor: "rgba(255,255,255,0.4)" }}
                    className="px-6 py-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white text-sm font-black shadow-xl cursor-default transition-colors"
                  >
                    {pill}
                  </motion.div>
                ))}
              </div>

              {/* Bottom Actions inside banner */}
              <div className="relative z-20 flex items-end justify-between mt-auto">
                <Button size="lg" className="h-16 px-10 rounded-full bg-white text-[#155dfc] hover:bg-slate-50 font-black text-lg shadow-2xl shadow-blue-900/40 group">
                  View Portfolio <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>

                <motion.button 
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="relative flex items-center justify-center group"
                >
                  <div className="absolute inset-0 bg-blue-400 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity" />
                  <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-white/10 backdrop-blur-2xl border border-white/30 flex items-center justify-center text-white shadow-2xl relative z-10 transition-transform group-hover:scale-110">
                    <Play className="w-8 h-8 md:w-10 md:h-10 fill-current ml-1" />
                  </div>
                  {/* Rotating Decorative Ring */}
                  <div className="absolute inset-[-12px] border-2 border-dashed border-white/20 rounded-full animate-[spin_15s_linear_infinity]" />
                </motion.button>
              </div>
            </div>

            {/* Floating Decorative Elements */}
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-12 -right-12 w-48 h-48 bg-[#155dfc]/10 rounded-full blur-3xl -z-10" 
            />
            <motion.div 
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-16 -left-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -z-10" 
            />
          </motion.div>
        </div>
      </section>

      {/* 3. Partner Bar */}
      <section className="py-12 border-y border-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12 justify-center opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-700">
          <span className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">Trusted By</span>
          <div className="flex flex-wrap justify-center gap-10 md:gap-16">
            <h4 className="text-2xl font-black tracking-tighter">GITHUB</h4>
            <h4 className="text-2xl font-black tracking-tighter">VERCEL</h4>
            <h4 className="text-2xl font-black tracking-tighter">SUPABASE</h4>
            <h4 className="text-2xl font-black tracking-tighter">STRIPE</h4>
            <h4 className="text-2xl font-black tracking-tighter">POSTHOG</h4>
          </div>
        </div>
      </section>

      {/* 4. About Us Section */}
      <section id="about" className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <div className="aspect-square rounded-[40px] bg-slate-50 border border-slate-100 overflow-hidden shadow-2xl p-4">
              <div className="w-full h-full rounded-[30px] bg-white border border-slate-200/50 p-8 flex flex-col justify-center gap-10">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-slate-900">Traffic Growth</h5>
                    <Badge variant="success">+240%</Badge>
                  </div>
                  <div className="h-32 bg-slate-50 rounded-2xl flex items-end gap-2 p-4">
                    {[40, 60, 45, 90, 65, 80, 100].map((h, i) => (
                      <motion.div 
                        key={i}
                        initial={{ height: 0 }}
                        whileInView={{ height: `${h}%` }}
                        className="flex-1 bg-blue-500 rounded-t-lg" 
                      />
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-5 bg-blue-50 rounded-3xl border border-blue-100">
                    <h6 className="text-3xl font-black text-blue-600">10M+</h6>
                    <p className="text-xs font-bold text-blue-800 uppercase mt-1">Pages Indexed</p>
                  </div>
                  <div className="p-5 bg-indigo-50 rounded-3xl border border-indigo-100">
                    <h6 className="text-3xl font-black text-indigo-600">99%</h6>
                    <p className="text-xs font-bold text-indigo-800 uppercase mt-1">Uptime</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Float Badge */}
            <div className="absolute -top-6 -right-6 bg-white p-6 rounded-3xl shadow-2xl border border-slate-100">
              <div className="text-center">
                <p className="text-4xl font-black text-slate-900 leading-none">4.9</p>
                <div className="flex justify-center gap-0.5 my-2">
                  {[1,2,3,4,5].map(i => <Sparkles key={i} className="w-3 h-3 text-yellow-400 fill-current" />)}
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Trustpilot</p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-sm font-black text-blue-600 uppercase tracking-widest">Strategic SEO Agency</p>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
                Transforming Businesses with Programmatic SEO
              </h2>
            </div>
            <p className="text-lg text-slate-500 leading-relaxed">
              We don't just build pages; we build automated growth machines. Our platform combines deep technical SEO expertise with cutting-edge AI to help you dominate search results at scale.
            </p>
            <div className="space-y-4">
              {[
                "Dynamic Page Generation",
                "Automated Internal Linking",
                "AI Content Generation",
                "Instant Google Indexing API"
              ].map(item => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-slate-700">{item}</span>
                </div>
              ))}
            </div>
            <Button size="lg" className="h-14 px-10 rounded-2xl font-bold">
              Learn More About Us
            </Button>
          </div>
        </div>
      </section>

      {/* 5. Services Section */}
      <section id="features" className="py-24 md:py-32 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center mb-20 space-y-4">
          <p className="text-sm font-black text-blue-600 uppercase tracking-widest">Our Capabilities</p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">
            Comprehensive SEO Solutions
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Scale your digital presence with tools built for speed, accuracy, and mass automation.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              icon: Zap, 
              title: "Programmatic SEO Engine", 
              desc: "Bulk generate thousands of landing pages using our dynamic variable engine. Zero manual coding required.",
              color: "text-blue-600", bg: "bg-blue-50"
            },
            { 
              icon: Search, 
              title: "AI Meta Optimization", 
              desc: "Automatically write and optimize meta titles and descriptions for 100% CTR performance using our AI assistant.",
              color: "text-green-600", bg: "bg-green-50"
            },
            { 
              icon: Database, 
              title: "Dataset Management", 
              desc: "Upload CSVs or connect directly to your database to feed your programmatic landing pages with live data.",
              color: "text-purple-600", bg: "bg-purple-50"
            },
            { 
              icon: RefreshCw, 
              title: "Automated Indexing", 
              desc: "Push new content directly to Google and Bing search consoles the second they are published.",
              color: "text-orange-600", bg: "bg-orange-50"
            },
            { 
              icon: Layers, 
              title: "Dynamic Content Engine", 
              desc: "Build once, deploy everywhere. Our visual engine creates pixel-perfect landing pages for mass generation.",
              color: "text-indigo-600", bg: "bg-indigo-50"
            },
            { 
              icon: ShieldCheck, 
              title: "Single-Site Authority", 
              desc: "Deeply integrated management for your primary domain, ensuring maximum authority and crawling efficiency.",
              color: "text-rose-600", bg: "bg-rose-50"
            },
          ].map((feature, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -10 }}
              className="bg-white p-10 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group text-left flex flex-col gap-6"
            >
              <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", feature.bg, feature.color)}>
                <feature.icon className="w-9 h-9" />
              </div>
              <div className="space-y-3 flex-1">
                <h3 className="text-xl font-black text-slate-900">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm font-medium">{feature.desc}</p>
              </div>
              <a href="#" className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:gap-3 transition-all">
                Learn more <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5.1 Our Services Section (Detailed) */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <p className="text-sm font-black text-blue-600 uppercase tracking-widest">Our Services</p>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
                  Tailored SEO Services <br />
                  For Your Business Growth
                </h2>
              </div>
              <p className="text-lg text-slate-500 leading-relaxed">
                Beyond our platform's automated capabilities, we provide deep-dive strategic services to ensure your programmatic SEO efforts align with your broader business goals.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { title: "SEO Strategy", desc: "Customized roadmaps built on data and market research." },
                  { title: "Technical Audit", desc: "Deep-dive analysis of your site structure and performance." },
                  { title: "Content Marketing", desc: "High-quality, data-driven content that ranks and converts." },
                  { title: "Link Building", desc: "Strategic outreach to build high-authority backlink profiles." }
                ].map((service, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mt-1 shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{service.title}</h4>
                      <p className="text-sm text-slate-500 mt-1">{service.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button size="lg" variant="outline" className="h-14 px-10 rounded-2xl font-bold border-slate-200">
                View All Services
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-6 pt-12">
                <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm mb-6 group-hover:scale-110 transition-transform">
                    <MousePointerClick className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mb-2">CRO Analysis</h3>
                  <p className="text-sm text-slate-500 font-medium">Turn traffic into revenue with conversion testing.</p>
                </div>
                <div className="p-8 bg-blue-600 rounded-[32px] text-white shadow-xl shadow-blue-200 group">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-black mb-2">Data Analytics</h3>
                  <p className="text-sm text-blue-100 font-medium">Real-time tracking of every keyword and click.</p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="p-8 bg-indigo-600 rounded-[32px] text-white shadow-xl shadow-indigo-200 group">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                    <Globe className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-black mb-2">Global Reach</h3>
                  <p className="text-sm text-indigo-100 font-medium">Scale your presence across multiple languages.</p>
                </div>
                <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm mb-6 group-hover:scale-110 transition-transform">
                    <Search className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mb-2">Market Intel</h3>
                  <p className="text-sm text-slate-500 font-medium">Monitor competitors and industry trends.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5.2 CTA Section */}
      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="relative bg-blue-600 rounded-[40px] overflow-hidden p-8 md:p-20 text-center">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[40%] h-full bg-gradient-to-l from-blue-500/50 to-transparent" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="relative z-10 space-y-8"
            >
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight">
                Ready to Dominate <br className="hidden md:block" />
                Your Search Category?
              </h2>
              <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed font-medium">
                Join 1,500+ SEO teams using Theseofly to automate their growth. Start building your programmatic empire today.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
                <Button size="lg" className="h-16 px-12 text-lg font-extrabold bg-white text-blue-600 hover:bg-slate-50 rounded-2xl shadow-2xl shadow-blue-900/20 group">
                  Start Your Journey <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button size="lg" variant="ghost" className="h-16 px-10 text-lg font-bold text-white hover:bg-white/10 rounded-2xl">
                  Contact Strategy Team
                </Button>
              </div>
              <div className="flex items-center justify-center gap-8 pt-8">
                <div className="flex items-center gap-2 text-blue-100 text-sm font-bold uppercase tracking-widest">
                  <CheckCircle2 className="w-4 h-4" /> No Credit Card Required
                </div>
                <div className="flex items-center gap-2 text-blue-100 text-sm font-bold uppercase tracking-widest">
                  <CheckCircle2 className="w-4 h-4" /> 14-Day Free Trial
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5.3 Our Process Section (Agency Style) */}
      <section id="process" className="py-24 md:py-32 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-20 space-y-4">
            <p className="text-sm font-black text-blue-600 uppercase tracking-widest">Our Process</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">
              Step-by-Step to Achieving Your Goals
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              We follow a rigorous, data-driven methodology to ensure every page we generate contributes to your bottom line.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                step: "01", 
                title: "Initial Consultation", 
                desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo." 
              },
              { 
                step: "02", 
                title: "Market Research", 
                desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo." 
              },
              { 
                step: "03", 
                title: "Strategy Development", 
                desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo." 
              }
            ].map((item, idx) => (
              <div key={idx} className="relative group">
                <div className="bg-white p-10 rounded-[32px] border border-slate-200/60 shadow-sm hover:shadow-xl transition-all h-full flex flex-col gap-6 relative z-10">
                  <div className="text-6xl font-black text-slate-50 group-hover:text-blue-50 transition-colors duration-500 absolute top-4 right-8 z-0">
                    {item.step}
                  </div>
                  <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200 relative z-10">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div className="space-y-3 relative z-10 mt-4">
                    <h3 className="text-xl font-black text-slate-900">{item.title}</h3>
                    <p className="text-slate-500 leading-relaxed text-sm font-medium">{item.desc}</p>
                  </div>
                </div>
                {idx < 2 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-px bg-slate-200 z-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5.4 Why Choose Us Section */}
      <section className="py-24 md:py-32 bg-white relative overflow-hidden">
        {/* Background Decorative Shapes */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-emerald-50/50 rounded-full blur-[100px] -z-10" />
        
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="relative rounded-[40px] overflow-hidden border border-slate-100 shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200" 
                alt="Our Team" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
            </div>
            
            {/* Floating Analytics Card */}
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-10 -right-6 md:right-10 bg-white/90 backdrop-blur-xl p-6 rounded-[32px] shadow-2xl border border-blue-100 flex items-center gap-5 z-20"
            >
              <div className="w-14 h-14 bg-[#155dfc] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                <BarChart3 className="w-7 h-7" />
              </div>
              <div>
                <p className="text-[10px] font-black text-[#155dfc] uppercase tracking-widest">Growth Rate</p>
                <p className="text-2xl font-black text-slate-900">+312% <span className="text-xs font-bold text-slate-400">YoY</span></p>
              </div>
            </motion.div>
          </motion.div>

          <div className="space-y-10">
            <div className="space-y-5">
              <p className="text-sm font-black text-[#155dfc] uppercase tracking-widest">Why Choose Us</p>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
                Empowering Your Business <br />
                To Grow Smarter
              </h2>
              <p className="text-lg text-slate-500 leading-relaxed max-w-xl">
                We specialize in scaling digital footprints through a unique blend of programmatic automation, strategic SEO, and data-driven marketing innovation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: "Proven Expertise", icon: ShieldCheck, desc: "Years of experience delivering top-tier SEO results." },
                { title: "Innovative Strategies", icon: Zap, desc: "Cutting-edge techniques that stay ahead of search algorithms." },
                { title: "Result-Driven Approach", icon: MousePointerClick, desc: "Focused on metrics that actually impact your bottom line." },
                { title: "Dedicated Support", icon: RefreshCw, desc: "24/7 strategic guidance for your automation journey." }
              ].map((feature, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ y: -5 }}
                  className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-xl hover:border-[#155dfc]/30 transition-all group"
                >
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#155dfc] mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-lg mb-2">{feature.title}</h4>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5.5 Testimonial Section */}
      <section className="py-24 md:py-32 bg-white relative overflow-hidden">
        {/* Advanced Background Visuals */}
        <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-blue-50/30 blur-[120px] rounded-full translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-blue-50/20 blur-[100px] rounded-full -translate-x-1/4 translate-y-1/4" />

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            <div className="lg:col-span-5 space-y-10">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-[#155dfc] rounded-full text-[11px] font-black uppercase tracking-[0.2em]">
                  <Sparkles className="w-3.5 h-3.5" />
                  Client Reviews
                </div>
                <h2 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 leading-[1.05]">
                  Success Stories <br />
                  From Our Partners
                </h2>
                <p className="text-lg text-slate-500 leading-relaxed max-w-md">
                  We measure our success by the growth of our clients. Join thousands of high-performing teams scaling with Theseofly.
                </p>
              </div>
              
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="p-10 bg-white rounded-[40px] border border-blue-100 shadow-2xl shadow-blue-900/5 flex flex-col gap-6 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-100/50 transition-colors" />
                <div className="flex items-center gap-6 relative z-10">
                  <div className="w-20 h-20 bg-[#155dfc] rounded-[28px] flex items-center justify-center text-white font-black text-3xl shadow-xl shadow-blue-200">
                    99%
                  </div>
                  <div>
                    <p className="font-black text-slate-900 text-xl">Satisfaction</p>
                    <div className="flex gap-1 mt-1">
                      {[1,2,3,4,5].map(i => <Sparkles key={i} className="w-3 h-3 text-yellow-400 fill-current" />)}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                  Based on 2,400+ independent reviews from global enterprises.
                </p>
              </motion.div>

              <div className="flex flex-wrap items-center gap-6">
                <Button size="lg" className="h-16 px-10 rounded-2xl font-black bg-slate-900 hover:bg-[#155dfc] transition-all shadow-xl shadow-slate-200 hover:shadow-blue-200">
                  Scale Your Business Now
                </Button>
                <a href="#" className="text-sm font-black text-slate-400 hover:text-[#155dfc] transition-colors border-b-2 border-transparent hover:border-[#155dfc] pb-1">
                  View Case Studies
                </a>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-8 relative pt-12 lg:pt-0">
              {/* Massive Floating Quote */}
              <div className="absolute -top-10 -left-10 opacity-[0.03] select-none pointer-events-none">
                <svg width="400" height="400" viewBox="0 0 24 24" fill="currentColor" className="text-[#155dfc]">
                  <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H16.017C15.4647 8 15.017 8.44772 15.017 9V12C15.017 12.5523 14.5693 13 14.017 13H11.017V21H14.017ZM3.017 21L3.017 18C3.017 16.8954 3.91239 16 5.017 16H8.017C8.56928 16 9.017 15.5523 9.017 15V9C9.017 8.44772 8.56928 8 8.017 8H5.017C4.46472 8 4.017 8.44772 4.017 9V12C4.017 12.5523 3.56928 13 3.017 13H0.017V21H3.017Z" />
                </svg>
              </div>

              {[
                { 
                  name: "Sarah Johnson", 
                  role: "Head of Growth",
                  company: "TechFlow Inc.",
                  text: "Implementing programmatic SEO with Theseofly was the best decision we made this year. Our organic traffic tripled in 4 months and our lead quality skyrocketed.",
                  img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
                  delay: 0
                },
                { 
                  name: "Marcus Chen", 
                  role: "CEO & Founder",
                  company: "RetailStack",
                  text: "The speed of page generation is incredible. We launched 5,000 keyword-optimized landing pages in a single afternoon. Pure automation magic.",
                  img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
                  delay: 0.2
                },
                { 
                  name: "Elena Rodriguez", 
                  role: "Marketing Director",
                  company: "GlobalVentures",
                  text: "The AI Meta Control feature is a game-changer. Our CTR improved by 45% across all 12,000 programmatic pages within weeks of deployment.",
                  img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
                  delay: 0.1
                },
                { 
                  name: "David Kim", 
                  role: "SEO Strategist",
                  company: "NovaScale",
                  text: "Finally, a platform that understands the complexity of programmatic SEO while keeping the UI clean. It's the most powerful tool in our tech stack.",
                  img: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
                  delay: 0.3
                }
              ].map((review, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: review.delay }}
                  whileHover={{ y: -8, scale: 1.01 }}
                  className={cn(
                    "bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/40 flex flex-col gap-6 relative z-10 hover:border-blue-200 transition-all",
                    i % 2 !== 0 ? "md:mt-12" : ""
                  )}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(s => <Sparkles key={s} className="w-3.5 h-3.5 text-yellow-400 fill-current" />)}
                    </div>
                    <div className="px-2 py-1 bg-green-50 text-green-600 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 border border-green-100">
                      <CheckCircle2 className="w-3 h-3" /> Verified Partner
                    </div>
                  </div>
                  
                  <p className="text-slate-600 font-bold italic leading-[1.6] flex-1 text-[15px]">
                    "{review.text}"
                  </p>
                  
                  <div className="flex items-center gap-4 border-t border-slate-50 pt-6">
                    <div className="relative">
                      <img src={review.img} alt={review.name} className="w-14 h-14 rounded-2xl bg-slate-100 border-2 border-white shadow-md" />
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#155dfc] rounded-full border-2 border-white flex items-center justify-center">
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      </div>
                    </div>
                    <div>
                      <p className="font-black text-slate-900 text-base">{review.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] mt-0.5">
                        {review.role} <span className="text-[#155dfc] mx-1">•</span> {review.company}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Stats Section */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
          {[
            { label: "Pages Generated", value: "25M+" },
            { label: "Active Domains", value: "1,200+" },
            { label: "Indexing Rate", value: "98.4%" },
            { label: "Traffic Boosted", value: "450%" },
          ].map((stat) => (
            <div key={stat.label} className="space-y-2">
              <h4 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter">{stat.value}</h4>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Footer */}
      <footer className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          <div className="space-y-8 lg:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">T</div>
              <span className="font-bold text-2xl tracking-tighter">Theseofly</span>
            </div>
            <p className="text-slate-500 font-medium leading-relaxed">
              Empowering modern teams to scale their search traffic through programmatic automation and AI optimization.
            </p>
            <div className="flex gap-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-600 transition-all cursor-pointer" />
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <h5 className="text-lg font-black tracking-tight">Quick Links</h5>
            <ul className="space-y-4 text-slate-500 font-bold text-sm">
              <li><a href="#" className="hover:text-blue-600 transition-colors">About Company</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Our Services</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Recent Projects</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Latest News</a></li>
            </ul>
          </div>

          <div className="space-y-8">
            <h5 className="text-lg font-black tracking-tight">SEO Services</h5>
            <ul className="space-y-4 text-slate-500 font-bold text-sm">
              <li><a href="#" className="hover:text-blue-600 transition-colors">Programmatic SEO</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">AI Content Writing</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Indexing API</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">Keyword Research</a></li>
            </ul>
          </div>

          <div className="space-y-8">
            <h5 className="text-lg font-black tracking-tight">Contact Us</h5>
            <div className="space-y-4 text-slate-500 font-bold text-sm">
              <p>📍 123 SEO Tower, Digital City</p>
              <p>📧 support@theseofly.com</p>
              <p>📞 +1 (555) 000-0000</p>
              <div className="pt-4">
                <Button variant="outline" className="w-full h-12 rounded-xl font-bold border-slate-200">
                  Request a Quote
                </Button>
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
    </div>
  );
}

function Badge({ children, variant = "primary" }: { children: React.ReactNode, variant?: "primary" | "success" }) {
  return (
    <span className={cn(
      "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
      variant === "primary" ? "bg-blue-50 text-blue-600" : "bg-green-50 text-green-600"
    )}>
      {children}
    </span>
  );
}
