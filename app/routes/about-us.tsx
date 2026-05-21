import { useState } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronRight, 
  ArrowRight, 
  Sparkles,
  Lightbulb,
  Eye,
  Target,
  Users,
  CheckCircle2,
  Zap,
  BarChart3,
  MousePointerClick,
  Globe,
  RefreshCw,
  Award,
  Search,
  ShieldCheck,
  Send,
  MessageSquare,
  Star,
  Check
} from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/Button";

export function meta() {
  return [
    { title: "About Us | Pioneering Organic Growth Automation | Theseofly" },
    { name: "description", content: "Discover how Theseofly is transforming search engine visibility through programmatic SEO innovation, advanced data taxonomy, and enterprise-grade page generation." },
    { property: "og:title", content: "About Us | Pioneering Organic Growth Automation | Theseofly" },
    { property: "og:description", content: "Discover how Theseofly is transforming search engine visibility through programmatic SEO innovation, advanced data taxonomy, and enterprise-grade page generation." },
    { property: "og:image", content: "https://theseofly.vercel.app/og-image-default.png" },
    { rel: "canonical", href: "https://theseofly.vercel.app/about-us" }
  ];
}

export default function AboutUs() {
  // Testimonial selection state
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [newsletterError, setNewsletterError] = useState("");
  const [newsletterLoading, setNewsletterLoading] = useState(false);

  // Client Logos list
  const clientLogos = [
    { name: "GITHUB", label: "Github" },
    { name: "VERCEL", label: "Vercel" },
    { name: "SUPABASE", label: "Supabase" },
    { name: "STRIPE", label: "Stripe" },
    { name: "POSTHOG", label: "Posthog" }
  ];

  // Core values / Philosophy - Vision - Mission
  const coreValues = [
    {
      title: "Philosophy",
      tagline: "Quality at Scale",
      desc: "We believe automation should never compromise integrity. Our semantic templates maintain the highest fidelity of human editorial standards, ensuring every generated page serves genuine user intent with unique data.",
      icon: Lightbulb,
      color: "from-[#155dfc] to-indigo-500",
      bg: "bg-[#155dfc]/5"
    },
    {
      title: "Vision",
      tagline: "Search Equity",
      desc: "Our vision is to level the organic search playing field. By empowering fast-growing brands with algorithmic page generation, we enable companies to scale keyword visibility in weeks instead of years.",
      icon: Eye,
      color: "from-[#155dfc] to-indigo-600",
      bg: "bg-indigo-50/50"
    },
    {
      title: "Mission",
      tagline: "100x Organic Velocity",
      desc: "We are on a mission to eliminate static publishing bottlenecks. By combining structured dataset onboarding with instant indexing APIs, we deliver high-performing SEO assets that rank and convert continuously.",
      icon: Target,
      color: "from-indigo-600 to-[#155dfc]",
      bg: "bg-[#155dfc]/5"
    }
  ];

  // Stats Counters
  const stats = [
    { value: "8+ Years", label: "Search Innovation", desc: "Refining algorithmic models" },
    { value: "1,500+", label: "Success Stories", desc: "Active scaling clients" },
    { value: "98.5%", label: "Retention Rate", desc: "Long-term client partnerships" },
    { value: "35+", label: "SEO Specialists", desc: "Engineers & taxonomists" }
  ];

  // Team Members
  const team = [
    {
      name: "Alexander Vance",
      role: "Founder & Chief SEO Architect",
      desc: "Former enterprise search consultant with 15+ years of experience scaling data-driven directories.",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600",
      socials: { twitter: "#", linkedin: "#", github: "#" }
    },
    {
      name: "Sophia Sterling",
      role: "Head of Semantic Engineering",
      desc: "Computational linguist specialized in mapping high-intent vertical taxonomies and AI templates.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600",
      socials: { twitter: "#", linkedin: "#", github: "#" }
    },
    {
      name: "Marcus Thorne",
      role: "Lead Platform Engineer",
      desc: "Full-stack developer architecting instant search indexing APIs and database synchronization pipelines.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600",
      socials: { twitter: "#", linkedin: "#", github: "#" }
    },
    {
      name: "Elena Rostova",
      role: "VP of Client Success & CRO",
      desc: "Conversion rate expert aligning massive organic search funnels to guaranteed client revenues.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600",
      socials: { twitter: "#", linkedin: "#", github: "#" }
    }
  ];

  // Why Choose Us features list
  const chooseUsFeatures = [
    {
      title: "Proven Expertise",
      desc: "A decade of building programmatic search catalogs with Google-compliant schema architectures.",
      icon: ShieldCheck
    },
    {
      title: "Pioneering Innovation",
      desc: "Cutting-edge indexing technology that bypasses traditional crawling delays within 24 hours.",
      icon: Zap
    },
    {
      title: "Comprehensive Services",
      desc: "End-to-end dataset creation, visual template design, and automated keyword outline rendering.",
      icon: Globe
    },
    {
      title: "Dedicated Technical Support",
      desc: "Continuous organic health monitoring and strategic SEO audits tailored for high-converting funnels.",
      icon: RefreshCw
    }
  ];

  // Steps / Process Section
  const processSteps = [
    {
      step: "01",
      title: "Initial Consultation",
      desc: "We analyze your digital presence, identify key expansion verticals, and detail local keyword opportunities in a comprehensive overview.",
      icon: MessageSquare
    },
    {
      step: "02",
      title: "Market Research",
      desc: "Our taxonomists map high-fidelity variables, filter long-tail variants, and construct highly structured data schemas tailored to your niche.",
      icon: Search
    },
    {
      step: "03",
      title: "Strategy Development",
      desc: "We design semantic template blocks, configure live database inputs, and execute our bulk indexing strategy to capture immediate ranks.",
      icon: BarChart3
    }
  ];

  // Testimonials list
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Head of Growth",
      company: "TechFlow Inc.",
      text: "Implementing programmatic SEO with Theseofly was the single best decision we made for our customer acquisition. Our organic directory visibility tripled in just 4 months, driving thousands of high-converting leads daily.",
      img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      rating: 5
    },
    {
      name: "Marcus Chen",
      role: "CEO & Founder",
      company: "RetailStack",
      text: "The sheer speed of page generation and instant Google indexing API is pure magic. We mapped and deployed over 5,000 highly targeted local landing pages in a single afternoon. Our conversion rates are up by 32%.",
      img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
      rating: 5
    },
    {
      name: "Elena Rodriguez",
      role: "Marketing Director",
      company: "GlobalVentures",
      text: "Theseofly's custom semantic structures are extraordinary. Every generated page reads with premium human quality, yet benefits from automated technical schemas. Highly recommended for any scaling SaaS.",
      img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
      rating: 5
    }
  ];

  // Newsletter signup handler
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) {
      setNewsletterError("Please enter a valid email address.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(newsletterEmail)) {
      setNewsletterError("Please enter a valid email address.");
      return;
    }

    setNewsletterError("");
    setNewsletterLoading(true);

    setTimeout(() => {
      setNewsletterLoading(false);
      setNewsletterSuccess(true);
      setNewsletterEmail("");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-[#155dfc]/20 selection:text-slate-900 pt-20">
      <Header />

      {/* 1. HERO SECTION */}
      <section id="about-hero" className="relative py-24 md:py-32 bg-slate-50/50 overflow-hidden border-b border-slate-100/70">
        {/* Soft Blue Gradient Ambient Shapes */}
        <div className="absolute inset-0 pointer-events-none -z-10">
          <div className="absolute top-[-10%] left-[20%] w-[45%] h-[45%] bg-[#155dfc]/5 blur-[130px] rounded-full opacity-70" />
          <div className="absolute bottom-[5%] right-[15%] w-[35%] h-[35%] bg-indigo-50/60 blur-[100px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center relative z-10">
          {/* Breadcrumb Navigation */}
          <div className="flex justify-center items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-8">
            <Link to="/" className="hover:text-[#155dfc] transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#155dfc]">About Us</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4.5 py-1.5 rounded-full bg-[#155dfc]/10 text-[#155dfc] text-xs font-black uppercase tracking-widest border border-[#155dfc]/20">
              <Sparkles className="w-4 h-4 text-[#155dfc]" />
              Engineers of Search Equity
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-tight">
              Pioneering the Future of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#155dfc] via-blue-500 to-indigo-500">Organic Visibility</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
              We construct advanced programmatic distribution frameworks, combining structured data with linguistic models to scale search footprints seamlessly.
            </p>
            <div className="pt-4 flex justify-center">
              <a href="#about-company">
                <Button size="lg" className="h-14 px-8 rounded-full bg-[#155dfc] hover:bg-[#155dfc]/90 text-white font-bold shadow-lg shadow-[#155dfc]/15 group transition-all cursor-pointer border border-[#155dfc]/20">
                  Explore Our Blueprint <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. CLIENT LOGOS */}
      <section id="about-logos" className="py-12 border-b border-slate-50 overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-10 md:gap-16 justify-center">
          <span className="text-xs font-extrabold text-slate-400 uppercase tracking-[0.25em] shrink-0">Trusted Worldwide By</span>
          <div className="flex flex-wrap justify-center gap-10 md:gap-16 items-center">
            {clientLogos.map((logo) => (
              <div 
                key={logo.name} 
                className="text-xl font-black tracking-tighter text-slate-300 hover:text-[#155dfc] hover:scale-105 transition-all duration-300 cursor-default"
                title={logo.label}
              >
                {logo.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. ABOUT COMPANY */}
      <section id="about-company" className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          {/* Left: Content */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-4">
              <span className="text-xs font-black uppercase tracking-widest text-[#155dfc] bg-[#155dfc]/10 px-3.5 py-1.5 rounded-full border border-[#155dfc]/20">Strategic SEO Architects</span>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Scaling Digital Footprints Through Precise Automation
              </h2>
            </div>
            
            <p className="text-base md:text-lg text-slate-500 font-medium leading-relaxed">
              At Theseofly, we believe static content engines are obsolete. Modern customer acquisition demands organic reach at scale. We combine advanced database onboarding with dynamic search schemas to engineer high-velocity publishing pipelines.
            </p>
            <p className="text-base text-slate-400 font-medium leading-relaxed">
              Our enterprise-grade platform has generated and indexed millions of structured local landing pages, generating exponential click performance and ranking authority for brands across the globe.
            </p>

            <div className="pt-4 flex flex-wrap gap-4">
              <Link to="/services">
                <Button size="lg" className="h-14 px-8 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-lg shadow-slate-100 cursor-pointer">
                  Our Capabilities
                </Button>
              </Link>
              <a href="#about-why-us">
                <Button size="lg" variant="outline" className="h-14 px-8 rounded-full border-slate-200 text-slate-700 hover:bg-slate-50 font-bold cursor-pointer">
                  Why We Excel
                </Button>
              </a>
            </div>
          </div>

          {/* Right: Premium Image + Floating Card */}
          <div className="lg:col-span-6 relative">
            <div className="aspect-[4/3] rounded-[2.5rem] bg-slate-50 border border-slate-100 overflow-hidden shadow-2xl p-4 relative z-10">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200" 
                alt="Theseofly collaborative workspaces" 
                className="w-full h-full rounded-[1.8rem] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent rounded-[2.5rem]" />
            </div>

            {/* Glowing ambient backing blob */}
            <div className="absolute -top-12 -left-12 w-64 h-64 bg-[#155dfc]/5 rounded-full blur-3xl -z-10" />

            {/* Floating Stats Card (Glassmorphic) */}
            <motion.div 
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-10 -right-4 bg-white/95 backdrop-blur-xl p-6 rounded-[2rem] shadow-[0_20px_50px_rgba(21,93,252,0.12)] border border-[#155dfc]/20 flex items-center gap-5 z-20"
            >
              <div className="w-14 h-14 bg-gradient-to-tr from-[#155dfc] to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#155dfc]/20">
                <BarChart3 className="w-7 h-7" />
              </div>
              <div>
                <p className="text-[10px] font-black text-[#155dfc] uppercase tracking-widest leading-none mb-1">Growth Index</p>
                <p className="text-2xl font-black text-slate-900">+280% <span className="text-xs font-bold text-slate-400">YoY</span></p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. VISION CARDS */}
      <section id="about-values" className="py-24 md:py-32 bg-slate-50 border-t border-b border-slate-100/70 relative">
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-indigo-50/50 rounded-full blur-3xl -z-10" />
        
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Header */}
          <div className="text-center max-w-xl mx-auto mb-20 space-y-4">
            <span className="text-xs font-black uppercase tracking-widest text-[#155dfc] bg-[#155dfc]/10 px-3.5 py-1.5 rounded-full border border-[#155dfc]/20">Our Foundation</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Core Strategic Columns</h2>
            <p className="text-slate-500 text-sm font-semibold">The key philosophies that guide our engineering values and customer alignments daily.</p>
          </div>

          {/* Core values cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {coreValues.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  whileHover={{ y: -8 }}
                  className="bg-white p-8 md:p-10 rounded-[2rem] border border-slate-200/50 hover:border-[#155dfc]/30 shadow-[0_10px_30px_rgba(0,0,0,0.01)] hover:shadow-[0_20px_40px_rgba(21,93,252,0.04)] transition-all flex flex-col justify-between h-full group"
                >
                  <div className="space-y-6">
                    {/* Icon container */}
                    <div className={`w-14 h-14 bg-gradient-to-tr ${value.color} text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100 group-hover:scale-105 transition-transform duration-300`}>
                      <IconComponent className="w-7 h-7" />
                    </div>

                    <div className="space-y-3">
                      <p className="text-[10px] font-black text-[#155dfc] uppercase tracking-widest">{value.tagline}</p>
                      <h3 className="text-2xl font-black text-slate-900 group-hover:text-[#155dfc] transition-colors">{value.title}</h3>
                      <p className="text-slate-500 text-sm font-medium leading-relaxed pt-2">{value.desc}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. STATS SECTION */}
      <section id="about-stats" className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-center lg:text-left">
            {stats.map((stat, i) => (
              <div key={i} className="space-y-3 p-6 bg-slate-50/50 rounded-3xl border border-slate-100 hover:border-[#155dfc]/25 transition-colors group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-[#155dfc] scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top" />
                <h4 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter group-hover:text-[#155dfc] transition-colors">{stat.value}</h4>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-800">{stat.label}</p>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{stat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. TEAM SECTION */}
      <section id="about-team" className="py-24 md:py-32 bg-slate-50 border-t border-b border-slate-100/70">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Header */}
          <div className="text-center max-w-xl mx-auto mb-20 space-y-4">
            <span className="text-xs font-black uppercase tracking-widest text-[#155dfc] bg-[#155dfc]/10 px-3.5 py-1.5 rounded-full border border-[#155dfc]/20">The Innovators</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Our Growth Brain Trust</h2>
            <p className="text-slate-500 text-sm font-semibold">MEET our senior search architects, dataset specialists, and conversion engineers.</p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.01)] flex flex-col h-full group"
              >
                {/* Photo container */}
                <div className="aspect-[4/5] overflow-hidden relative bg-slate-100">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                  {/* Social hover overlay */}
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                    <a href={member.socials.twitter} className="w-10 h-10 bg-white hover:bg-[#155dfc] text-slate-800 hover:text-white rounded-xl flex items-center justify-center shadow-lg transition-colors" aria-label="Twitter">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    </a>
                    <a href={member.socials.linkedin} className="w-10 h-10 bg-white hover:bg-[#155dfc] text-slate-800 hover:text-white rounded-xl flex items-center justify-center shadow-lg transition-colors" aria-label="LinkedIn">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0h.003z"/></svg>
                    </a>
                    <a href={member.socials.github} className="w-10 h-10 bg-white hover:bg-[#155dfc] text-slate-800 hover:text-white rounded-xl flex items-center justify-center shadow-lg transition-colors" aria-label="GitHub">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                    </a>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="font-black text-slate-900 text-lg group-hover:text-[#155dfc] transition-colors">{member.name}</h3>
                    <p className="text-[10px] font-black text-[#155dfc] uppercase tracking-widest">{member.role}</p>
                    <p className="text-slate-400 text-xs font-semibold leading-relaxed pt-2">{member.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. WHY CHOOSE US */}
      <section id="about-why-us" className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          {/* Left Image + Rating Card */}
          <div className="lg:col-span-6 relative order-last lg:order-first">
            <div className="aspect-[4/3] rounded-[2.5rem] bg-slate-50 border border-slate-100 overflow-hidden shadow-2xl p-4 relative z-10">
              <img 
                src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1200" 
                alt="Strategist review outlines" 
                className="w-full h-full rounded-[1.8rem] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent rounded-[2.5rem]" />
            </div>

            {/* Glowing background circle */}
            <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-indigo-50 rounded-full blur-[90px] -z-10" />

            {/* Rating badge */}
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-10 -right-4 bg-white/95 backdrop-blur-xl p-6 rounded-[2rem] shadow-[0_20px_45px_rgba(0,0,0,0.06)] border border-slate-100 flex flex-col items-center justify-center text-center min-w-[130px] z-20"
            >
              <p className="text-3xl font-black text-slate-950">4.9</p>
              <div className="flex gap-0.5 my-1.5 text-yellow-400">
                {[1,2,3,4,5].map(s => <Star key={s} className="w-3.5 h-3.5 fill-current" />)}
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trustpilot Rating</p>
            </motion.div>
          </div>

          {/* Right Heading + Feature List */}
          <div className="lg:col-span-6 space-y-10">
            <div className="space-y-4">
              <span className="text-xs font-black uppercase tracking-widest text-[#155dfc] bg-[#155dfc]/10 px-3.5 py-1.5 rounded-full border border-[#155dfc]/20">The Advantage</span>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Empowering Brands with Structural Search Supremacy
              </h2>
              <p className="text-base text-slate-500 font-medium">
                Traditional agencies write pages. We build systemic catalogs that establish permanent domain authority. Here is why high-performing marketing teams align with us:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {chooseUsFeatures.map((feature, i) => {
                const IconComponent = feature.icon;
                return (
                  <div key={i} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 hover:border-[#155dfc]/20 transition-colors group">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#155dfc] shadow-sm mb-4 group-hover:scale-105 transition-transform duration-300">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <h4 className="font-black text-slate-900 text-lg mb-2">{feature.title}</h4>
                    <p className="text-slate-400 text-xs font-semibold leading-relaxed">{feature.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 8. CTA BANNER */}
      <section id="about-cta" className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="relative bg-gradient-to-br from-[#155dfc] via-[#0d47a1] to-[#0a2e5c] rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl overflow-hidden p-8 md:p-16 text-center space-y-8">
            {/* Background elements */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/glass.png')] opacity-10 mix-blend-overlay" />
            <div className="absolute top-[-30%] right-[-10%] w-[60%] h-[100%] bg-white/5 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[45%] h-[80%] bg-[#155dfc]/10 blur-[90px] rounded-full" />
            
            <div className="max-w-2xl mx-auto space-y-6 relative z-10">
              <span className="text-xs font-extrabold uppercase tracking-widest text-blue-200 border border-white/20 bg-white/10 px-4.5 py-1.5 rounded-full">Elevate Your Indexing</span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
                Ready to dominate organic search results?
              </h2>
              <p className="text-lg text-blue-100 max-w-lg mx-auto leading-relaxed">
                Connect with our semantic engineers, construct your taxonomy outline, and start ranking for thousands of queries.
              </p>
              
              <div className="pt-4 flex flex-wrap gap-4 justify-center">
                <Link to="/contact-us">
                  <Button size="lg" className="h-14 px-8 rounded-full bg-white text-[#155dfc] hover:bg-slate-50 font-black shadow-xl cursor-pointer">
                    Request a Free Audit
                  </Button>
                </Link>
                <Link to="/plans">
                  <Button size="lg" variant="outline" className="h-14 px-8 rounded-full border-white/30 text-white hover:bg-white/10 font-bold cursor-pointer">
                    Review Plan Details
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. PROCESS SECTION */}
      <section id="about-process" className="py-24 md:py-32 bg-slate-50 border-t border-b border-slate-100/70">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Header */}
          <div className="text-center mb-20 space-y-4">
            <span className="text-xs font-black uppercase tracking-widest text-[#155dfc] bg-[#155dfc]/10 px-3.5 py-1.5 rounded-full border border-[#155dfc]/20">The Flow</span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">
              Step-by-Step Towards Scale
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Our structured onboarding guarantees precision taxonomies and absolute indexing speeds.
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {processSteps.map((step, idx) => {
              const IconComponent = step.icon;
              return (
                <div key={idx} className="relative group">
                  <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-200/60 shadow-sm hover:shadow-xl hover:border-[#155dfc]/20 transition-all h-full flex flex-col gap-6 relative z-10">
                    {/* Big fade step number */}
                    <div className="text-6xl font-black text-slate-50 group-hover:text-[#155dfc]/10 transition-colors duration-500 absolute top-4 right-8 z-0 select-none">
                      {step.step}
                    </div>
                    
                    {/* Icon container */}
                    <div className="w-14 h-14 bg-[#155dfc] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#155dfc]/15 relative z-10">
                      <IconComponent className="w-6 h-6" />
                    </div>

                    <div className="space-y-3 relative z-10 mt-2">
                      <h3 className="text-xl font-black text-slate-900 group-hover:text-[#155dfc] transition-colors">{step.title}</h3>
                      <p className="text-slate-500 leading-relaxed text-sm font-semibold">{step.desc}</p>
                    </div>
                  </div>
                  {idx < 2 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-px bg-slate-200 z-0" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 10. TESTIMONIALS */}
      <section id="about-testimonials" className="py-24 md:py-32 bg-white relative overflow-hidden">
        {/* Background ambient light */}
        <div className="absolute top-1/2 left-0 w-80 h-80 bg-[#155dfc]/5 rounded-full blur-[100px] -z-10" />

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
            {/* Left Info Column */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-6">
                <span className="text-xs font-black uppercase tracking-widest text-[#155dfc] bg-[#155dfc]/10 px-3.5 py-1.5 rounded-full border border-[#155dfc]/20">Success Stories</span>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.1]">
                  Grounded in Tangible Organic Revenue
                </h2>
                <p className="text-base text-slate-500 font-medium leading-relaxed">
                  We measure our architecture's effectiveness strictly by the performance parameters of our clients. Review dynamic reviews from high-performing marketing teams.
                </p>
              </div>

              {/* Verified Badge Stack */}
              <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex items-center gap-6 group">
                <div className="w-16 h-16 bg-[#155dfc] rounded-[24px] flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-[#155dfc]/15 group-hover:scale-105 transition-transform duration-300">
                  99%
                </div>
                <div>
                  <p className="font-black text-slate-900 text-lg">Satisfaction</p>
                  <div className="flex gap-0.5 mt-0.5 text-yellow-400">
                    {[1,2,3,4,5].map(s => <Star key={s} className="w-3 h-3 fill-current" />)}
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link to="/contact-us">
                  <Button size="lg" className="h-14 px-8 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-lg shadow-slate-100 cursor-pointer">
                    Join Our Success Stories
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Testimonial Slider Stack */}
            <div className="lg:col-span-7 space-y-6">
              <div className="relative bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-200/60 shadow-[0_15px_45px_rgba(0,0,0,0.02)] min-h-[300px] flex flex-col justify-between overflow-hidden">
                {/* Accent quote SVG mark */}
                <div className="absolute top-8 right-8 opacity-[0.03] select-none pointer-events-none">
                  <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor" className="text-[#155dfc]">
                    <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H16.017C15.4647 8 15.017 8.44772 15.017 9V12C15.017 12.5523 14.5693 13 14.017 13H11.017V21H14.017ZM3.017 21L3.017 18C3.017 16.8954 3.91239 16 5.017 16H8.017C8.56928 16 9.017 15.5523 9.017 15V9C9.017 8.44772 8.56928 8 8.017 8H5.017C4.46472 8 4.017 8.44772 4.017 9V12C4.017 12.5523 3.56928 13 3.017 13H0.017V21H3.017Z" />
                  </svg>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTestimonial}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-8 flex-1 flex flex-col justify-between relative z-10"
                  >
                    <div className="space-y-4">
                      <div className="flex gap-0.5 text-yellow-400">
                        {Array.from({ length: testimonials[activeTestimonial].rating }).map((_, s) => (
                          <Star key={s} className="w-4.5 h-4.5 fill-current" />
                        ))}
                      </div>
                      <p className="text-slate-700 text-lg md:text-xl font-bold italic leading-relaxed">
                        "{testimonials[activeTestimonial].text}"
                      </p>
                    </div>

                    <div className="flex items-center gap-4 pt-6 border-t border-slate-50">
                      <img 
                        src={testimonials[activeTestimonial].img} 
                        alt={testimonials[activeTestimonial].name} 
                        className="w-14 h-14 rounded-2xl bg-slate-100 border-2 border-white shadow-md shrink-0" 
                      />
                      <div>
                        <p className="font-black text-slate-900 text-base">{testimonials[activeTestimonial].name}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
                          {testimonials[activeTestimonial].role} <span className="text-[#155dfc] mx-1">•</span> {testimonials[activeTestimonial].company}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Selector dots */}
              <div className="flex justify-center items-center gap-3">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTestimonial(idx)}
                    className={`h-3 rounded-full transition-all duration-300 focus:outline-none cursor-pointer ${activeTestimonial === idx ? 'w-8 bg-[#155dfc]' : 'w-3 bg-slate-200 hover:bg-slate-300'}`}
                    aria-label={`Show testimonial ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11. NEWSLETTER */}
      <section id="about-newsletter" className="py-20 md:py-28 bg-slate-50 border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-6">
          <div className="relative bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-10 md:p-14 border border-[#155dfc]/20 shadow-[0_20px_50px_-20px_rgba(21,93,252,0.08)] overflow-hidden">
            {/* ambient ambient light blob inside container */}
            <div className="absolute top-[-30%] right-[-10%] w-72 h-72 bg-[#155dfc]/5 rounded-full blur-[80px]" />
            <div className="absolute bottom-[-30%] left-[-10%] w-64 h-64 bg-indigo-500/5 rounded-full blur-[70px]" />

            <div className="relative z-10 text-center space-y-8 max-w-2xl mx-auto">
              <div className="space-y-4">
                <span className="text-xs font-black uppercase tracking-widest text-[#155dfc] bg-[#155dfc]/10 px-3.5 py-1.5 rounded-full border border-[#155dfc]/20">Algorithmic Updates</span>
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Stay Ahead of Google Changes</h2>
                <p className="text-slate-500 text-sm font-semibold leading-relaxed">
                  Join 5,000+ organic growth hackers receiving our bi-weekly breakdown of algorithmic indices, taxonomies, and CTR optimization parameters.
                </p>
              </div>

              <AnimatePresence mode="wait">
                {!newsletterSuccess ? (
                  <motion.form 
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleNewsletterSubmit}
                    className="space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                      <div className="flex-1 relative">
                        <input 
                          type="email"
                          value={newsletterEmail}
                          onChange={(e) => {
                            setNewsletterEmail(e.target.value);
                            if (newsletterError) setNewsletterError("");
                          }}
                          placeholder="your@email.com"
                          className={`w-full h-12 px-5 bg-slate-50 border ${newsletterError ? 'border-red-400 focus:border-red-400' : 'border-slate-100 focus:border-[#155dfc]'} rounded-2xl text-slate-800 text-sm font-bold focus:bg-white focus:outline-none transition-all`}
                        />
                      </div>
                      <Button 
                        type="submit" 
                        disabled={newsletterLoading}
                        className="h-12 px-8 rounded-2xl bg-[#155dfc] hover:bg-[#155dfc]/90 text-white font-black text-sm shadow-lg shadow-[#155dfc]/15 cursor-pointer shrink-0"
                      >
                        {newsletterLoading ? "Analyzing Request..." : "Subscribe"}
                      </Button>
                    </div>
                    {newsletterError && <p className="text-xs text-red-500 font-semibold">{newsletterError}</p>}
                  </motion.form>
                ) : (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-4 text-center space-y-4"
                  >
                    <div className="w-12 h-12 bg-[#155dfc]/10 rounded-full flex items-center justify-center mx-auto text-[#155dfc]">
                      <Check className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xl font-black text-slate-900">Successfully Subscribed!</h3>
                      <p className="text-slate-500 text-xs font-semibold">
                        Your growth roadmap outlines have been safely queued. We will email you shortly.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
