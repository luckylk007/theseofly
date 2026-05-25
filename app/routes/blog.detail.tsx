import { useMemo, useState, useEffect } from "react";
import { Link, useLoaderData } from "react-router";
import { supabase } from "../lib/supabase";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Card } from "../components/ui/Card";
import { TableOfContents } from "../components/ui/TableOfContents";
import { 
  Calendar, 
  Clock, 
  ChevronRight, 
  Share2, 
  Link as LinkIcon, 
  ChevronDown, 
  ArrowRight, 
  MessageSquare,
  Sparkles,
  Send,
  User
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FALLBACK_BLOG_POSTS } from "../data/fallback-blogs";
import type { Route } from "./+types/blog.detail";

// Typings for our comments
interface Comment {
  id: string;
  name: string;
  avatar: string;
  text: string;
  date: string;
}

export async function loader({ params, request }: Route.LoaderArgs) {
  const { slug } = params;
  if (!slug) throw new Response("Slug missing", { status: 404 });

  let post: any = null;
  let relatedPosts: any[] = [];

  try {
    // 1. Fetch exact post from Supabase
    const { data: blogData, error: blogError } = await (supabase as any)
      .from("pages")
      .select(`
        *,
        author:profiles(full_name, avatar_url),
        seo:seo_metadata(*),
        page_taxonomies(
          taxonomy:taxonomies(*)
        )
      `)
      .eq("status", "published")
      .eq("content_type", "post")
      .eq("post_type", "blog")
      .eq("slug", slug)
      .maybeSingle();

    if (blogData && !blogError) {
      const assignments = (blogData.page_taxonomies || [])
        .map((entry: any) => entry.taxonomy)
        .filter(Boolean);
      const postCategories = assignments.filter((item: any) => item.type === "category");
      const postTags = assignments.filter((item: any) => item.type === "tag");

      post = {
        ...blogData,
        categories: postCategories,
        tag_entities: postTags,
        category: blogData.category || postCategories[0]?.name || "Uncategorized",
        tags: blogData.tags || postTags.map((item: any) => item.name),
        read_time: "5 min read",
        author: blogData.author || {
          full_name: "Theseofly Expert",
          avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Theseofly"
        }
      };

      // Query related posts in the same category
      const { data: relatedData } = await (supabase as any)
        .from("pages")
        .select(`
          *,
          author:profiles(full_name, avatar_url)
        `)
        .eq("status", "published")
        .eq("content_type", "post")
        .eq("post_type", "blog")
        .eq("category", post.category)
        .neq("id", post.id)
        .limit(3);

      if (relatedData) {
        relatedPosts = relatedData;
      }
    }
  } catch (err) {
    console.error("Supabase load failed in blog detail. Using offline fallbacks:", err);
  }

  // 2. Try loading matching fallback mock post if database record was not found
  if (!post) {
    const fallback = FALLBACK_BLOG_POSTS.find((p) => p.slug === slug);
    if (!fallback) {
      throw new Response(`[404_BLOG_NOT_FOUND] The article with slug "${slug}" was not found.`, { status: 404 });
    }
    post = fallback;

    // Fetch related fallback posts in the same category
    relatedPosts = FALLBACK_BLOG_POSTS.filter((p) => p.category === post.category && p.slug !== post.slug).slice(0, 3);
  }

  const url = new URL(request.url);

  return {
    post,
    relatedPosts,
    origin: url.origin,
    pathname: url.pathname
  };
}

export function meta({ data }: Route.MetaArgs) {
  if (!data || !data.post) return [{ title: "Blog Post Not Found" }];
  
  const { post, origin, pathname } = data;
  const seo = post.seo?.[0] || post.seo_metadata?.[0] || {};
  
  const title = seo.title || `${post.title} | Theseofly Blog`;
  const description = seo.description || post.excerpt || "Expert digital marketing strategies and programmatic SEO insights.";
  const ogImage = seo.og_image || post.featured_image_url || `${origin}/og-image-default.png`;
  const canonicalUrl = seo.canonical_url || `${origin}${pathname}`;

  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: ogImage },
    { property: "og:type", content: "article" },
    { property: "article:published_time", content: post.published_at || post.created_at },
    { rel: "canonical", href: canonicalUrl }
  ];
}

export default function BlogDetail() {
  const { post, relatedPosts, origin, pathname } = useLoaderData<typeof loader>();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Local comments engine mockup
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "comment-1",
      name: "Alex Mercer",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      text: "This architecture layout is incredibly clean! The Hub-and-Spoke bi-directional maps solved our crawl indexing issues within 6 days. Highly recommended playbook.",
      date: "3 days ago"
    },
    {
      id: "comment-2",
      name: "Brooke Sterling",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Brooke",
      text: "Question: When combining AI generations inside local city widgets, does search engines penalize the speed at which pages are updated? Or should we throttle API rates?",
      date: "1 day ago"
    }
  ]);
  const [newCommentName, setNewCommentName] = useState("");
  const [newCommentText, setNewCommentText] = useState("");

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentName.trim() || !newCommentText.trim()) return;

    const added: Comment = {
      id: `comment-${Date.now()}`,
      name: newCommentName,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(newCommentName)}`,
      text: newCommentText,
      date: "Just now"
    };

    setComments((prev) => [added, ...prev]);
    setNewCommentName("");
    setNewCommentText("");
  };

  // Scroll Progress Listener
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      
      const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
      setScrollProgress(Math.min(100, Math.max(0, scrollPercent)));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Copy Link Alert Action
  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${origin}${pathname}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Extract headings from sections or html text
  const headings = useMemo(() => {
    const list: Array<{ text: string; id: string; level: number }> = [];
    
    // Support sections structure
    if (post.content?.sections) {
      post.content.sections.forEach((sec: any, idx: number) => {
        if (sec.heading) {
          const id = sec.heading.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || `sec-${idx}`;
          list.push({
            text: sec.heading,
            id,
            level: 2
          });
        }
      });
    } 
    // Support standard raw HTML string structure
    else if (typeof post.content === "string") {
      const regex = /<h([23])[^>]*>(.*?)<\/h\1>/gi;
      let match;
      let idx = 0;
      while ((match = regex.exec(post.content)) !== null) {
        const level = parseInt(match[1]);
        const text = match[2].replace(/<[^>]*>/g, "");
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || `heading-${idx}`;
        list.push({ text, id, level });
        idx++;
      }
    }

    return list;
  }, [post]);

  // Inject unique IDs to raw HTML headings if needed
  const processedHtmlContent = useMemo(() => {
    if (typeof post.content === "string") {
      let idx = 0;
      return post.content.replace(/<h([23])([^>]*)>(.*?)<\/h\1>/gi, (match: string, level: string, attrs: string, text: string) => {
        if (attrs.includes("id=")) return match;
        const id = text.replace(/<[^>]*>/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || `heading-${idx}`;
        idx++;
        return `<h${level} id="${id}"${attrs}>${text}</h${level}>`;
      });
    }
    return "";
  }, [post]);

  // JSON-LD dynamic Schema.org markups
  const schemaMarkup = useMemo(() => {
    const absoluteUrl = `${origin}${pathname}`;
    const datePub = post.published_at || post.created_at;
    const dateMod = post.updated_at || post.created_at;

    const baseSchema: any = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt || "",
      "image": post.featured_image_url || "https://theseofly.vercel.app/og-image-default.png",
      "datePublished": datePub,
      "dateModified": dateMod,
      "author": {
        "@type": "Person",
        "name": post.author?.full_name || "Theseofly Expert",
        "image": post.author?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=Theseofly"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Theseofly",
        "logo": {
          "@type": "ImageObject",
          "url": `${origin}/logo.png`
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": absoluteUrl
      }
    };

    // Integrate dynamic FAQ structured data if available
    if (post.content?.faq && post.content.faq.length > 0) {
      return [
        baseSchema,
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": post.content.faq.map((item: any) => ({
            "@type": "Question",
            "name": item.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": item.answer
            }
          }))
        }
      ];
    }

    return baseSchema;
  }, [post, origin, pathname]);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 pt-20">
      <Header />

      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />

      {/* Reading Progress Bar */}
      <div className="fixed top-20 left-0 right-0 z-40 h-1 bg-slate-100">
        <motion.div
          className="h-full bg-gradient-to-r from-[#155dfc] to-indigo-500"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Breadcrumbs Banner */}
      <section className="bg-slate-50 border-b border-slate-100 py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-400">
          <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/blog" className="hover:text-blue-600 transition-colors">Insights Blog</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#155dfc] uppercase tracking-wider">{post.category}</span>
          <ChevronRight className="w-3.5 h-3.5 hidden sm:inline" />
          <span className="text-slate-700 truncate max-w-xs font-bold hidden sm:inline">{post.title}</span>
        </div>
      </section>

      {/* Hero Detail Section */}
      <section className="relative py-16 md:py-24 px-6 bg-white overflow-hidden border-b border-slate-100">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[40%] h-[35%] bg-blue-50/40 blur-[120px] rounded-full opacity-60" />
        </div>

        <div className="max-w-4xl mx-auto text-center space-y-6">
          <Badge className="bg-blue-50 text-[#155dfc] border-blue-100 text-[10px] font-black tracking-widest uppercase h-8 px-4 rounded-full">
            {post.category}
          </Badge>
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight">
            {post.title}
          </h1>
          
          <p className="text-slate-500 text-base md:text-lg leading-relaxed max-w-3xl mx-auto font-medium">
            {post.excerpt}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-bold text-slate-400 border-t border-slate-50 mt-6 max-w-xl mx-auto">
            {/* Author card */}
            <div className="flex items-center gap-2">
              <img
                src={post.author?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=Theseofly"}
                alt={post.author?.full_name}
                className="w-9 h-9 rounded-full border shadow-sm"
              />
              <div className="text-left">
                <p className="text-slate-800 font-extrabold leading-none">{post.author?.full_name}</p>
                <p className="text-[9px] uppercase tracking-wider text-slate-400 mt-0.5">{post.author?.role || "Staff Author"}</p>
              </div>
            </div>

            <div className="h-6 w-px bg-slate-200" />
            
            <span className="flex items-center gap-1"><Calendar className="w-4 h-4 text-slate-300" /> {new Date(post.published_at || post.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
            <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-slate-300" /> {post.read_time || "5 min read"}</span>
          </div>
        </div>
      </section>

      {/* Large Featured Image */}
      <section className="max-w-5xl mx-auto px-6 -mt-10 relative z-10">
        <div className="aspect-[21/10] bg-slate-100 rounded-[32px] md:rounded-[40px] border-8 border-white shadow-[0_30px_70px_-15px_rgba(21,93,252,0.15)] overflow-hidden group">
          <img
            src={post.featured_image_url || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800"}
            alt={post.title}
            className="w-full h-full object-cover transform group-hover:scale-101 transition-transform duration-700"
          />
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-16 items-start">
          
          {/* Left Column: Sticky Share panel */}
          <div className="lg:col-span-1 lg:sticky lg:top-32 flex lg:flex-col items-center justify-center gap-4 bg-slate-50 border border-slate-100 p-4 rounded-3xl lg:w-16 w-full shadow-sm">
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 lg:block hidden border-b pb-2 mb-1 w-full text-center">Share</span>
            <a 
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(`${origin}${pathname}`)}&text=${encodeURIComponent(post.title)}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 bg-white hover:bg-sky-50 text-slate-500 hover:text-sky-500 rounded-xl flex items-center justify-center shadow-sm border border-slate-100 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a 
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${origin}${pathname}`)}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 bg-white hover:bg-blue-50 text-slate-500 hover:text-[#0a66c2] rounded-xl flex items-center justify-center shadow-sm border border-slate-100 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
            <a 
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${origin}${pathname}`)}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 bg-white hover:bg-indigo-50 text-slate-500 hover:text-indigo-600 rounded-xl flex items-center justify-center shadow-sm border border-slate-100 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fillRule="evenodd" />
              </svg>
            </a>
            <div className="h-4 w-px lg:h-px lg:w-full bg-slate-200" />
            <button
              onClick={handleCopyLink}
              className="w-10 h-10 bg-white hover:bg-blue-50 text-slate-500 hover:text-blue-600 rounded-xl flex items-center justify-center shadow-sm border border-slate-100 transition-all relative group"
            >
              <LinkIcon className="w-4 h-4" />
              {copiedLink && (
                <span className="absolute bottom-full lg:bottom-auto lg:left-full ml-2 px-2 py-1 bg-slate-900 text-white text-[10px] font-black rounded-lg shadow-md whitespace-nowrap z-50 animate-in fade-in zoom-in-50 duration-100">
                  Copied!
                </span>
              )}
            </button>
          </div>

          {/* Middle Column: Typography Content */}
          <main className="lg:col-span-8 space-y-12">
            <article className="prose prose-slate lg:prose-xl max-w-none text-slate-700 leading-relaxed font-medium bg-white rounded-3xl border border-slate-100 p-8 md:p-12 shadow-sm">
              {/* Supporting HTML structured bodies */}
              {processedHtmlContent ? (
                <div 
                  className="space-y-8 prose-h2:text-3xl prose-h2:font-black prose-h2:text-slate-900 prose-h2:tracking-tight prose-h2:mt-12 prose-h2:mb-6 prose-p:text-slate-600 prose-p:leading-relaxed prose-li:text-slate-600 prose-ul:list-disc prose-ul:pl-6"
                  dangerouslySetInnerHTML={{ __html: processedHtmlContent }} 
                />
              ) : (
                /* Supporting standard structured section arrays */
                <div className="space-y-12">
                  {post.content?.sections?.map((section: any, idx: number) => {
                    const id = section.heading?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || `sec-${idx}`;
                    return (
                      <section key={idx} className="space-y-4">
                        {section.heading && (
                          <h2 id={id} className="text-3xl font-black text-slate-900 tracking-tight mt-8 border-b border-slate-50 pb-2">
                            {section.heading}
                          </h2>
                        )}
                        {section.text && (
                          <div
                            className="text-slate-600 space-y-4 text-base md:text-lg leading-relaxed prose-p:text-slate-600 prose-li:text-slate-600 prose-ul:list-disc prose-ul:pl-6 prose-strong:font-black"
                            dangerouslySetInnerHTML={{ __html: section.text }}
                          />
                        )}
                      </section>
                    );
                  })}
                </div>
              )}
            </article>

            {/* Accordion FAQ Section */}
            {post.content?.faq && post.content.faq.length > 0 && (
              <section className="bg-slate-50/50 border border-slate-100 p-8 md:p-12 rounded-[32px] space-y-6">
                <div className="space-y-2">
                  <Badge variant="outline" className="border-blue-200 text-[#155dfc] font-black text-[9px] tracking-wider uppercase bg-white">FAQ</Badge>
                  <h3 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">Frequently Asked Questions</h3>
                  <p className="text-slate-500 text-sm">Quick reference guide addressing common queries relating to the topic.</p>
                </div>
                
                <div className="space-y-3">
                  {post.content.faq.map((faq: any, idx: number) => {
                    const isOpen = openFaqIndex === idx;
                    return (
                      <div 
                        key={idx} 
                        className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                      >
                        <button
                          onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                          className="w-full flex items-center justify-between p-5 text-left font-black text-slate-800 text-base focus:outline-none transition-colors hover:text-[#155dfc]"
                        >
                          <span>{faq.question}</span>
                          <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180 text-[#155dfc]" : ""}`} />
                        </button>
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: "auto" }}
                              exit={{ height: 0 }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                              className="overflow-hidden border-t border-slate-50"
                            >
                              <div className="p-5 text-slate-600 text-sm md:text-base leading-relaxed bg-slate-50/20">
                                {faq.answer}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Related Tags row */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-4">
                {post.tags.map((tag: string, idx: number) => (
                  <span key={idx} className="bg-slate-50 text-slate-500 border border-slate-100 rounded-full px-3.5 py-1.5 text-[10px] font-black uppercase tracking-wider">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Premium Comments area */}
            {post.allow_comments !== false && (
              <section className="bg-white border border-slate-100 rounded-[32px] p-8 md:p-12 space-y-8 shadow-sm">
                <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                  <div className="w-10 h-10 bg-blue-50 text-[#155dfc] rounded-xl flex items-center justify-center">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-black text-slate-900">Discussion Forum ({comments.length})</h3>
                    <p className="text-xs text-slate-400">Share your perspectives, questions, or ideas.</p>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handlePostComment} className="space-y-4 bg-slate-50/40 p-6 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-[#155dfc]" /> Post your reply</span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <input 
                        type="text"
                        placeholder="Your full name..."
                        required
                        value={newCommentName}
                        onChange={(e) => setNewCommentName(e.target.value)}
                        className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 outline-none font-bold text-slate-900 placeholder-slate-400"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <textarea 
                      placeholder="Type your comment content..."
                      required
                      rows={3}
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      className="w-full p-4 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 outline-none font-bold text-slate-900 placeholder-slate-400 resize-y"
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit" size="md" className="rounded-xl font-black gap-1.5 shadow-md">
                      Submit Comment <Send className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </form>

                {/* List */}
                <div className="space-y-6 divide-y divide-slate-100">
                  {comments.map((comment) => (
                    <div key={comment.id} className="pt-6 first:pt-0 flex gap-4 items-start">
                      <img 
                        src={comment.avatar} 
                        alt={comment.name}
                        className="w-10 h-10 rounded-full border border-slate-100 shrink-0" 
                      />
                      <div className="space-y-1.5 flex-1 text-left">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900 text-sm">{comment.name}</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase">{comment.date}</span>
                        </div>
                        <p className="text-slate-600 text-sm md:text-base leading-relaxed font-medium">
                          {comment.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Related Posts panel */}
            {relatedPosts.length > 0 && (
              <section className="space-y-6 pt-10">
                <h3 className="text-2xl font-black tracking-tight text-slate-900 border-b border-slate-50 pb-4">
                  Recommended for You
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {relatedPosts.map((rPost) => (
                    <Card key={rPost.id} className="border-slate-100 hover:border-blue-200 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                      <div className="aspect-[16/10] overflow-hidden bg-slate-50 relative">
                        <img 
                          src={rPost.featured_image_url || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800"} 
                          alt={rPost.title} 
                          className="w-full h-full object-cover transform group-hover:scale-102 transition-transform duration-500"
                        />
                      </div>
                      
                      <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                        <div className="space-y-1">
                          <p className="text-[9px] font-black uppercase text-[#155dfc] tracking-widest">{rPost.category || post.category}</p>
                          <Link to={`/blog/${rPost.slug}`}>
                            <h4 className="text-base font-black text-slate-900 hover:text-[#155dfc] transition-colors leading-[1.2] tracking-tight line-clamp-2">
                              {rPost.title}
                            </h4>
                          </Link>
                        </div>
                        
                        <div className="flex items-center justify-between pt-3 border-t border-slate-50 mt-3">
                          <span className="text-[10px] text-slate-400 font-bold uppercase">{rPost.read_time || "5 min read"}</span>
                          <Link to={`/blog/${rPost.slug}`} className="text-xs font-black text-[#155dfc] hover:text-blue-700 flex items-center gap-1 group-hover:gap-1.5 transition-all">
                            Read Post <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </section>
            )}
          </main>

          {/* Right Column: Sticky ToC */}
          <div className="lg:col-span-3 lg:sticky lg:top-32 space-y-6">
            <TableOfContents headings={headings} />
            
            {/* Newsletter Subscription block */}
            <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white rounded-3xl p-6 shadow-xl border border-white/5 space-y-4">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/glass.png')] opacity-10 mix-blend-overlay" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#155dfc]/25 rounded-full blur-2xl" />
              
              <div className="relative z-10 space-y-2">
                <Badge className="bg-white/10 text-white border-white/10 text-[9px] font-black uppercase tracking-wider h-6 rounded-full">Newsletter</Badge>
                <h4 className="text-lg font-black tracking-tight leading-none pt-1">Get SEO Tactics</h4>
                <p className="text-slate-300 text-xs font-semibold leading-relaxed">
                  Join 1,500+ managers reading our scaling playbooks weekly.
                </p>
              </div>

              <div className="relative z-10 space-y-2.5">
                <input 
                  type="email"
                  placeholder="Enter email address..."
                  required
                  className="w-full h-10 px-3 bg-white/10 border border-white/20 rounded-xl text-xs outline-none text-white font-bold placeholder-slate-400 focus:ring-2 focus:ring-blue-500/50" 
                />
                <Button size="sm" className="w-full rounded-xl bg-white text-[#155dfc] hover:bg-slate-50 font-black h-10 text-xs shadow-md">
                  Subscribe Free
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-slate-50 py-16 border-t border-slate-100">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-6">
          <h2 className="text-2xl md:text-4xl font-black tracking-tight text-slate-900">
             Dominate Keywords At Mass Scale
          </h2>
          <p className="text-slate-500 text-sm max-w-xl mx-auto font-semibold">
            Deploy dynamic directories and programmatic content landing pages that convert traffic into revenue effortlessly.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/plans">
              <Button size="md" className="rounded-xl font-black px-8">
                Explore Scale Solutions
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
