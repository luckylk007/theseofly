import { useState } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, 
  Mail, 
  Phone, 
  Clock, 
  CheckCircle2, 
  Loader2, 
  ChevronRight, 
  ArrowRight, 
  Sparkles,
  HelpCircle,
  MessageSquare,
  Building,
  Plus,
  Minus
} from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/Button";
import type { Route } from "./+types/content-page";

export function meta() {
  return [
    { title: "Contact Us | Get in Touch with Growth Specialists | Theseofly" },
    { name: "description", content: "Ready to scale your search visibility? Get in touch with Theseofly's growth specialists. We provide personalized performance projections and AI programmatic SEO advice." },
    { property: "og:title", content: "Contact Us | Get in Touch with Growth Specialists | Theseofly" },
    { property: "og:description", content: "Ready to scale your search visibility? Get in touch with Theseofly's growth specialists. We provide personalized performance projections and AI programmatic SEO advice." },
    { property: "og:image", content: "https://theseofly.vercel.app/og-image-default.png" },
    { rel: "canonical", href: "https://theseofly.vercel.app/contact-us" }
  ];
}

export default function ContactUs() {
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Active accordion state
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  // Contact Info Data
  const infoCards = [
    {
      title: "Office Headquarters",
      icon: MapPin,
      details: ["100 Pine Street, Suite 1250", "San Francisco, CA 94111"],
      actionLabel: "Get Directions",
      actionUrl: "https://maps.google.com/?q=100+Pine+St,+San+Francisco,+CA+94111",
      color: "from-[#155dfc] to-indigo-600"
    },
    {
      title: "Email Channels",
      icon: Mail,
      details: ["growth@theseofly.com", "partners@theseofly.com"],
      actionLabel: "Send Email",
      actionUrl: "mailto:growth@theseofly.com",
      color: "from-[#155dfc] to-indigo-500"
    },
    {
      title: "Call Direct",
      icon: Phone,
      details: ["+1 (888) 555-0199", "Mon - Fri, 9am - 6pm PST"],
      actionLabel: "Call Now",
      actionUrl: "tel:+18885550199",
      color: "from-violet-500 to-purple-600"
    },
    {
      title: "Operations Hours",
      icon: Clock,
      details: ["Support: 24/7 Available", "Sales: Mon - Fri (Global PST)"],
      actionLabel: "Client Portal",
      actionUrl: "/login",
      color: "from-amber-500 to-orange-600"
    }
  ];

  // FAQ Data
  const faqs = [
    {
      question: "What exactly is Programmatic SEO, and how does it benefit my business?",
      answer: "Programmatic SEO involves generating thousands of high-quality, structured, search-optimized landing pages automatically to capture long-tail search queries. Instead of hand-crafting individual posts, our system builds dynamic location and vertical hubs, helping your business capture massive organic search volume in weeks rather than years."
    },
    {
      question: "How fast will we start seeing search rankings and traffic scale up?",
      answer: "While traditional SEO takes 6 to 12 months, our programmatic platforms often produce indexed pages within days. Many clients observe double-digit organic traffic growth within 4 to 8 weeks, as search crawlers discover and index the structured local business schemas and semantic templates we deploy."
    },
    {
      question: "Do you supply the custom content and keyword variations yourself?",
      answer: "Yes, fully. We specialize in mapping out complex keyword patterns, building vertical taxonomy variables, and writing professional semantic outline templates. Every single page generated contains contextual, high-fidelity AI-assisted text tailored to answer distinct search intents."
    },
    {
      question: "What budget plans or tier packages do you offer for scaling agencies?",
      answer: "We offer plans suited to every growth stage—ranging from local city expansions to global corporate enterprise frameworks. Head over to our plans page to review our pre-structured pricing tiers, or request a custom proposal directly in the form above."
    },
    {
      question: "Is there a setup or platform configuration fee required?",
      answer: "No, we believe in transparent, value-driven pricing. All structural setup, database onboarding, custom schema generation, and initial keyword mapping are fully integrated into our standard tier services, ensuring your budget directly supports your scaling objectives."
    }
  ];

  // Validation
  const validateForm = () => {
    const tempErrors: Record<string, string> = {};
    if (!formData.name.trim()) tempErrors.name = "Full Name is required";
    
    if (!formData.email.trim()) {
      tempErrors.email = "Email Address is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Please enter a valid email address";
    }
    
    if (!formData.subject.trim()) tempErrors.subject = "Subject is required";
    if (!formData.message.trim()) tempErrors.message = "Message cannot be empty";
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    // Simulate API Submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });
    }, 1800);
  };

  // Input change handler
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-[#155dfc]/20 selection:text-slate-900 pt-20">
      <Header />

      {/* 1. HERO SECTION */}
      <section className="relative py-24 lg:py-32 overflow-hidden border-b border-slate-900 bg-slate-950">
        {/* Background Image with Cover */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('/assets/blue_crystal_bg.png')` }}
        />
        
        {/* Premium Dark Glassmorphism Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/75 via-slate-950/85 to-slate-950/95 backdrop-blur-[3px] z-0" />

        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center relative z-10">
          {/* Breadcrumb Navigation */}
          <div className="flex justify-center items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-300 mb-8">
            <Link to="/" className="hover:text-[#155dfc] transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-[#155dfc] font-bold">Contact Us</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#155dfc]/10 border border-[#155dfc]/20 text-blue-200 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-[#155dfc] animate-pulse" />
              Scale Your Organic Growth
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-tight">
              Let's Start a <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300 drop-shadow-sm">Conversation</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium">
              Have questions about programmatic scaling, automated indexing, or custom SEO funnels? Our digital strategists are standing by to engineer your growth blueprint.
            </p>
            <div className="pt-4 flex justify-center">
              <a href="#contact-form-section">
                <Button size="lg" className="h-14 px-8 rounded-full bg-[#155dfc] hover:bg-[#155dfc]/90 text-white font-bold shadow-lg shadow-[#155dfc]/20 hover:shadow-[#155dfc]/40 group transition-all cursor-pointer border border-[#155dfc]/30">
                  Request a Free Audit <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. CONTACT INFO CARDS SECTION */}
      <section className="py-20 max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {infoCards.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-white p-8 rounded-3xl border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Background micro hover circle */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full translate-x-8 -translate-y-8 group-hover:bg-[#155dfc]/5 transition-colors duration-300" />
                
                <div className="space-y-6 relative z-10">
                  {/* Icon with custom gradient backdrop */}
                  <div className={`w-14 h-14 bg-gradient-to-tr ${card.color} text-white rounded-2xl flex items-center justify-center shadow-lg shadow-[#155dfc]/15`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                                    <div className="space-y-3">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#155dfc] transition-colors">{card.title}</h3>
                    <div className="space-y-1">
                      {card.details.map((detail, dIdx) => (
                        <p key={dIdx} className="text-slate-500 text-sm font-semibold">{detail}</p>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-8 relative z-10">
                  {card.actionUrl.startsWith("http") ? (
                    <a 
                      href={card.actionUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-1 text-xs font-black uppercase tracking-wider text-[#155dfc] hover:text-[#155dfc]/80 transition-colors"
                    >
                      {card.actionLabel} <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </a>
                  ) : (
                    <Link 
                      to={card.actionUrl} 
                      className="inline-flex items-center gap-1 text-xs font-black uppercase tracking-wider text-[#155dfc] hover:text-[#155dfc]/80 transition-colors"
                    >
                      {card.actionLabel} <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 3. CONTACT FORM SECTION */}
      <section id="contact-form-section" className="py-20 bg-white border-t border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Column: Context Card */}
          <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-32">
            <div className="space-y-4">
              <span className="text-xs font-black uppercase tracking-widest text-[#155dfc] bg-[#155dfc]/10 px-3.5 py-1.5 rounded-full border border-[#155dfc]/20">Get Direct Access</span>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Let's Construct Your Custom Search Engine
              </h2>
              <p className="text-base text-slate-500 font-medium leading-relaxed">
                Traditional agencies focus on keywords. We build dynamic search distribution architectures that guarantee local market visibility. Give us details about your project, and we will formulate a personalized scaling report.
              </p>
            </div>

            {/* Quick highlights block */}
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 space-y-6">
              <h4 className="text-md font-bold text-slate-800 uppercase tracking-wider">What happens next?</h4>
              <ul className="space-y-4">
                {[
                  { title: "Direct Human Response", desc: "A senior programmatic growth strategist will email you within 2 hours." },
                  { title: "Personalized SEO Audit", desc: "We map your industry taxonomy variables to locate untapped local keywords." },
                  { title: "Strategy Alignment Call", desc: "A live 30-minute overview dissecting performance and sitemap parameters." }
                ].map((item, index) => (
                  <li key={index} className="flex gap-4 items-start">
                    <div className="w-6 h-6 rounded-full bg-[#155dfc]/10 border border-[#155dfc]/25 flex items-center justify-center text-[#155dfc] font-black text-xs shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-800 text-sm">{item.title}</h5>
                      <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Micro stats banner */}
            <div className="grid grid-cols-2 gap-6 bg-gradient-to-br from-[#155dfc] via-[#0d47a1] to-[#0a2e5c] p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/glass.png')] opacity-10 mix-blend-overlay" />
              <div className="space-y-1 relative z-10">
                <p className="text-3xl font-black">10x</p>
                <p className="text-[10px] text-blue-100 font-extrabold uppercase tracking-widest">Indexing Speed</p>
              </div>
              <div className="space-y-1 relative z-10 border-l border-white/10 pl-6">
                <p className="text-3xl font-black">25M+</p>
                <p className="text-[10px] text-blue-100 font-extrabold uppercase tracking-widest">Pages Managed</p>
              </div>
            </div>
          </div>

          {/* Right Column: Premium Interactive Form */}
          <div className="lg:col-span-7 bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] p-8 md:p-12 relative overflow-hidden">
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#155dfc] via-blue-500 to-indigo-500" />

            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.form 
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-slate-900">Send an Inquiry</h3>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Strategic Response Guaranteed Within 2 Hours</p>
                  </div>

                  {/* Dual Grid Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="space-y-2">
                      <label className="text-xs font-extrabold text-slate-500 uppercase tracking-widest">Full Name *</label>
                      <input 
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className={`w-full h-12 px-5 bg-slate-50 border ${errors.name ? 'border-red-400 focus:border-red-400' : 'border-slate-100 focus:border-[#155dfc]'} rounded-2xl text-slate-800 text-sm font-bold focus:bg-white focus:outline-none transition-all`}
                        placeholder="John Doe"
                      />
                      {errors.name && <p className="text-xs text-red-500 font-semibold">{errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label className="text-xs font-extrabold text-slate-500 uppercase tracking-widest">Email Address *</label>
                      <input 
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className={`w-full h-12 px-5 bg-slate-50 border ${errors.email ? 'border-red-400 focus:border-red-400' : 'border-slate-100 focus:border-[#155dfc]'} rounded-2xl text-slate-800 text-sm font-bold focus:bg-white focus:outline-none transition-all`}
                        placeholder="john@example.com"
                      />
                      {errors.email && <p className="text-xs text-red-500 font-semibold">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Phone (Optional) */}
                    <div className="space-y-2">
                      <label className="text-xs font-extrabold text-slate-500 uppercase tracking-widest">Phone Number (Optional)</label>
                      <input 
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="w-full h-12 px-5 bg-slate-50 border border-slate-100 focus:border-[#155dfc] rounded-2xl text-slate-800 text-sm font-bold focus:bg-white focus:outline-none transition-all"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>

                    {/* Subject */}
                    <div className="space-y-2">
                      <label className="text-xs font-extrabold text-slate-500 uppercase tracking-widest">Inquiry Subject *</label>
                      <input 
                        type="text"
                        value={formData.subject}
                        onChange={(e) => handleInputChange("subject", e.target.value)}
                        className={`w-full h-12 px-5 bg-slate-50 border ${errors.subject ? 'border-red-400 focus:border-red-400' : 'border-slate-100 focus:border-[#155dfc]'} rounded-2xl text-slate-800 text-sm font-bold focus:bg-white focus:outline-none transition-all`}
                        placeholder="e.g., Programmatic SaaS Growth"
                      />
                      {errors.subject && <p className="text-xs text-red-500 font-semibold">{errors.subject}</p>}
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <label className="text-xs font-extrabold text-slate-500 uppercase tracking-widest">Your Message *</label>
                    <textarea 
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      rows={5}
                      className={`w-full p-5 bg-slate-50 border ${errors.message ? 'border-red-400 focus:border-red-400' : 'border-slate-100 focus:border-[#155dfc]'} rounded-2xl text-slate-800 text-sm font-bold focus:bg-white focus:outline-none transition-all resize-none`}
                      placeholder="Describe your market, current keywords, or custom project outline..."
                    />
                    {errors.message && <p className="text-xs text-red-500 font-semibold">{errors.message}</p>}
                  </div>

                  {/* Form Submission Buttons */}
                  <div className="pt-2">
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full h-14 rounded-2xl bg-[#155dfc] hover:bg-[#155dfc]/90 text-white font-black text-md shadow-xl shadow-[#155dfc]/15 hover:shadow-[#155dfc]/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Engineering Proposal...
                        </>
                      ) : (
                        <>
                          Transmit Secure Request <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </Button>
                  </div>
                </motion.form>
              ) : (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 text-center space-y-6"
                >
                  <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-600">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-3xl font-black text-slate-900">Request Received!</h3>
                    <p className="text-slate-500 font-medium max-w-md mx-auto leading-relaxed">
                      Thank you for contacting Theseofly! Your project details have been safely queued. A senior programmatic growth architect is compiling your SEO audit now and will email you back within 2 hours.
                    </p>
                  </div>
                  
                  <div className="pt-6">
                    <Button 
                      variant="outline"
                      onClick={() => setIsSubmitted(false)}
                      className="px-6 h-12 rounded-xl font-bold border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
                    >
                      Submit Another Inquiry
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* 4. EMBEDDED MAP SECTION */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-4">
            <span className="text-xs font-black uppercase tracking-widest text-[#155dfc]">Global Hub</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900">San Francisco Headquarters</h2>
            <p className="text-slate-500 text-sm font-semibold">Join us at our creative workspace in the heart of San Francisco's Financial District.</p>
          </div>

          <div className="relative rounded-[2.5rem] overflow-hidden border-8 border-white shadow-2xl aspect-[21/9] min-h-[350px]">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3152.9786444877717!2d-122.40191992358327!3d37.792887611429285!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085806283ff1cbf%3A0xb3debb73d6d0285a!2s100%20Pine%20St%2C%20San%20Francisco%2C%20CA%2094111!5e0!3m2!1sen!2sus!4v1716336000000!5m2!1sen!2sus" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true}
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 filter grayscale contrast-125 opacity-90"
            />
          </div>
        </div>
      </section>

      {/* 5. FAQ SECTION */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Left Column Description */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-36">
            <span className="text-xs font-black uppercase tracking-widest text-[#155dfc] bg-[#155dfc]/10 px-3.5 py-1.5 rounded-full border border-[#155dfc]/20">Search Architecture FAQ</span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Answering Your Scaling Questions
            </h2>
            <p className="text-base text-slate-500 font-medium leading-relaxed">
              Programmatic SEO differs substantially from conventional static publishing. Here is an overview answering our most commonly asked structural and integration queries.
            </p>
            <div className="pt-4">
              <a href="mailto:growth@theseofly.com" className="inline-flex items-center gap-2.5 p-5 bg-slate-50 hover:bg-[#155dfc]/5 border border-slate-100 hover:border-[#155dfc]/20 rounded-2xl transition-all group font-bold text-slate-700 hover:text-[#155dfc] text-sm">
                <HelpCircle className="w-5 h-5 text-slate-400 group-hover:text-[#155dfc]" />
                Still have questions? Let's discuss
              </a>
            </div>
          </div>

          {/* Right Column Accordion */}
          <div className="lg:col-span-7 space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div 
                  key={index}
                  className={`border rounded-2xl transition-all duration-300 ${isOpen ? 'bg-slate-50/50 border-[#155dfc]/30 shadow-sm' : 'bg-white border-slate-100 hover:border-slate-200'}`}
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none cursor-pointer"
                  >
                    <span className="font-bold text-slate-900 text-base md:text-lg pr-4">{faq.question}</span>
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isOpen ? 'bg-[#155dfc] text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100'}`}>
                      {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 text-sm md:text-base text-slate-500 font-semibold leading-relaxed border-t border-slate-100/50 pt-4">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. CTA BANNER SECTION */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="relative bg-gradient-to-br from-[#155dfc] via-[#0d47a1] to-[#0a2e5c] rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl overflow-hidden p-8 md:p-16 text-center space-y-8">
            {/* Background elements */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/glass.png')] opacity-10 mix-blend-overlay" />
            <div className="absolute top-[-30%] right-[-10%] w-[60%] h-[100%] bg-white/5 blur-[120px] rounded-full" />
            
            <div className="max-w-2xl mx-auto space-y-6 relative z-10">
              <span className="text-xs font-extrabold uppercase tracking-widest text-blue-200 border border-white/20 bg-white/10 px-4.5 py-1.5 rounded-full">Unlock Domination</span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
                Ready to dominate search engine results?
              </h2>
              <p className="text-lg text-blue-100 max-w-lg mx-auto leading-relaxed">
                Connect with our strategists, check our scaling packages, or read standard algorithmic strategies.
              </p>
              
              <div className="pt-4 flex flex-wrap gap-4 justify-center">
                <Link to="/plans">
                  <Button size="lg" className="h-14 px-8 rounded-full bg-white text-[#155dfc] hover:bg-slate-50 font-black shadow-xl cursor-pointer">
                    Explore Packages
                  </Button>
                </Link>
                <Link to="/services">
                  <Button size="lg" variant="outline" className="h-14 px-8 rounded-full border-white/30 text-white hover:bg-white/10 font-bold cursor-pointer">
                    Our Services
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
