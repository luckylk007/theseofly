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

      {/* 2. Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 -z-10 w-[50%] h-[50%] bg-blue-50/50 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 -z-10 w-[30%] h-[30%] bg-indigo-50/50 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2" />

        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-sm font-bold border border-blue-100/50">
              <Sparkles className="w-4 h-4" />
              <span>Next-Gen Programmatic SEO</span>
            </div>
            
            <h1 className="text-5xl md:text-[80px] font-black tracking-tight text-slate-900 leading-[0.95]">
              Transform Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Search Traffic</span>
            </h1>

            <div className="flex items-center gap-4 pt-2">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+10}`} alt="User" />
                  </div>
                ))}
              </div>
              <p className="text-sm font-bold text-slate-500">
                <span className="text-slate-900">1,500+</span> Trusted SEO Teams
              </p>
            </div>

            <p className="text-xl text-slate-500 max-w-xl leading-relaxed">
              Generate thousands of high-converting landing pages in minutes. Dominate every search keyword with our AI-powered programmatic engine.
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-4">
              <Button size="lg" className="h-14 px-10 text-lg font-bold shadow-xl shadow-blue-200 gap-2 rounded-2xl group">
                Build My Site <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <div className="flex items-center gap-4">
                <div className="flex gap-2">
                  <a href="#" className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-600 transition-all">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-1.015-2.174-1.648-3.594-1.648-2.718 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.732-.672 1.583-.672 2.488 0 1.708.87 3.214 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63.961-.689 1.8-1.56 2.46-2.548l-.047-.02z"/></svg>
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-600 transition-all">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-5.838 2.435-5.838 5.838 0 3.403 2.435 5.838 5.838 5.838 3.403 0 5.838-2.435 5.838-5.838 0-3.403-2.435-5.838-5.838-5.838zm0 9.512c-2.029 0-3.674-1.645-3.674-3.674 0-2.029 1.645-3.674 3.674-3.674 2.029 0 3.674 1.645 3.674 3.674 0 2.029-1.645 3.674-3.674 3.674zm6.062-11.052c.731 0 1.323-.592 1.323-1.323 0-.731-.592-1.323-1.323-1.323-.731 0-1.323.592-1.323 1.323 0 .731.592 1.323 1.323 1.323z"/></svg>
                  </a>
                </div>
                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Connect</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Abstract Dashboard UI */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative bg-white rounded-3xl border border-slate-100 shadow-2xl overflow-hidden p-6 md:p-10">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Total Traffic</p>
                    <h3 className="text-2xl font-black text-slate-900">12.4M <span className="text-green-500 text-sm font-bold">+84%</span></h3>
                  </div>
                </div>
                <div className="flex -space-x-2">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100" />
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                {[
                  { label: "On-Page SEO", val: 92, color: "bg-blue-500" },
                  { label: "Content Marketing", val: 78, color: "bg-green-500" },
                  { label: "Keyword Density", val: 88, color: "bg-purple-500" },
                ].map((item) => (
                  <div key={item.label} className="space-y-2">
                    <div className="flex justify-between text-sm font-bold">
                      <span>{item.label}</span>
                      <span>{item.val}%</span>
                    </div>
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${item.val}%` }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                        className={cn("h-full rounded-full", item.color)} 
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Overlaid Badges */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-20 -right-8 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Indexing</p>
                  <p className="text-xs font-black text-slate-900">100% Success</p>
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-10 -left-12 bg-white p-5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4"
              >
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                  <Plus className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400">Pages Generated</p>
                  <p className="text-lg font-black text-slate-900">+50,000</p>
                </div>
              </motion.div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-10 -right-10 -z-10 w-40 h-40 bg-blue-100/50 rounded-full blur-2xl" />
            <div className="absolute -bottom-10 -left-10 -z-10 w-60 h-60 bg-indigo-100/30 rounded-full blur-3xl" />
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
                "Custom Dynamic Templates",
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
              desc: "Upload CSVs or connect directly to your database to feed your programmatic templates with live data.",
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
              title: "Dynamic Templates", 
              desc: "Build once, deploy everywhere. Our visual builder creates pixel-perfect templates for mass generation.",
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

      {/* 7. Process Section */}
      <section id="process" className="py-24 md:py-32 bg-slate-900 text-white rounded-[60px] mx-6 md:mx-12 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full translate-x-1/4 -translate-y-1/4" />
        
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-12">
            <div className="space-y-4">
              <p className="text-sm font-black text-blue-400 uppercase tracking-[0.3em]">Work Process</p>
              <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
                How We Scale Your SEO <br />
                <span className="text-blue-500">In 3 Simple Steps</span>
              </h2>
            </div>
            
            <div className="space-y-8">
              {[
                { step: "01", title: "Upload Your Dataset", desc: "Import your keywords, locations, and custom variables via CSV or API." },
                { step: "02", title: "Design Your Template", desc: "Use our visual builder to create high-converting layouts that adapt to your data." },
                { step: "03", title: "Generate & Index", desc: "Launch thousands of pages instantly and push them directly to search engines." },
              ].map((item) => (
                <div key={item.step} className="flex gap-8 group">
                  <div className="text-5xl font-black text-white/10 group-hover:text-blue-500 transition-colors duration-500">
                    {item.step}
                  </div>
                  <div className="space-y-2 pt-2">
                    <h4 className="text-xl font-black">{item.title}</h4>
                    <p className="text-slate-400 font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/5] rounded-[40px] bg-white/5 border border-white/10 overflow-hidden p-3 backdrop-blur-sm">
              <div className="w-full h-full rounded-[30px] overflow-hidden relative">
                <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000" alt="SEO Process" className="w-full h-full object-cover opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                
                {/* Floating Badge */}
                <div className="absolute bottom-10 left-10 right-10 bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white">
                      <Play className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Watch Platform Demo</p>
                      <p className="text-xs text-slate-400">See how it works in 2 mins</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
