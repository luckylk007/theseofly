import { useMemo, useState } from "react";
import { Link, useLoaderData } from "react-router";
import { supabase } from "../lib/supabase";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { Card } from "../components/ui/Card";
import { Search, Calendar, Clock, User, ArrowRight, Sparkles, Filter, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FALLBACK_BLOG_POSTS, type FallbackPost } from "../data/fallback-blogs";
import type { Route } from "./+types/blog.index";

export async function loader({ request }: Route.LoaderArgs) {
  let posts: any[] = [];
  let categories: any[] = [];
  let tags: any[] = [];

  try {
    // 1. Fetch published blog posts from Supabase
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
      .order("published_at", { ascending: false });

    if (blogData && !blogError) {
      posts = blogData.map((post: any) => {
        const assignments = (post.page_taxonomies || [])
          .map((entry: any) => entry.taxonomy)
          .filter(Boolean);
        const postCategories = assignments.filter((item: any) => item.type === "category");
        const postTags = assignments.filter((item: any) => item.type === "tag");

        return {
          ...post,
          categories: postCategories,
          tag_entities: postTags,
          category: post.category || postCategories[0]?.name || "Uncategorized",
          tags: post.tags || postTags.map((item: any) => item.name),
          read_time: "5 min read", // Inferred fallback
          author: post.author || {
            full_name: "Theseofly Expert",
            avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Theseofly"
          }
        };
      });
    }

    // 2. Fetch Taxonomies
    const { data: taxData } = await (supabase as any)
      .from("taxonomies")
      .select("*");

    if (taxData) {
      categories = taxData.filter((t: any) => t.type === "category");
      tags = taxData.filter((t: any) => t.type === "tag");
    }
  } catch (err) {
    console.error("Supabase load failed in blog index. Using offline fallbacks:", err);
  }

  // 3. Fallback to stunning offline datasets if empty
  const activePosts = posts.length > 0 ? posts : FALLBACK_BLOG_POSTS;

  if (categories.length === 0) {
    // Dynamically derive distinct categories from active dataset
    const distinctCategories = Array.from(new Set(activePosts.map((p) => p.category)));
    categories = distinctCategories.map((name, idx) => ({
      id: `cat-fallback-${idx}`,
      name,
      slug: String(name).toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      type: "category"
    }));
  }

  if (tags.length === 0) {
    // Dynamically derive distinct tags
    const allTags = activePosts.flatMap((p) => p.tags || []);
    const distinctTags = Array.from(new Set(allTags));
    tags = distinctTags.map((name, idx) => ({
      id: `tag-fallback-${idx}`,
      name,
      slug: String(name).toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      type: "tag"
    }));
  }

  const url = new URL(request.url);

  return {
    posts: activePosts,
    categories,
    tags,
    origin: url.origin,
    pathname: url.pathname
  };
}

export function meta() {
  return [
    { title: "Insights Blog | Expert SEO & Programmatic Scaling | Theseofly" },
    { name: "description", content: "Explore the latest insights, expert guides, case studies, and advanced strategies on programmatic SEO, site architecture, and search engines optimization." },
    { property: "og:title", content: "Insights Blog | Theseofly" },
    { property: "og:description", content: "Advanced strategies on programmatic SEO, site architecture, and indexing to dominate search." },
    { property: "og:image", content: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800" },
    { rel: "canonical", href: "https://theseofly.vercel.app/blog" }
  ];
}

export default function BlogIndex() {
  const { posts, categories, tags } = useLoaderData<typeof loader>();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleTagToggle = (tagName: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagName) ? prev.filter((t) => t !== tagName) : [...prev, tagName]
    );
  };

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory =
        selectedCategory === "all" ||
        post.category === selectedCategory ||
        post.categories?.some((c: any) => c.name === selectedCategory);

      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((t) => post.tags?.includes(t));

      return matchesSearch && matchesCategory && matchesTags;
    });
  }, [posts, searchTerm, selectedCategory, selectedTags]);

  const featuredPost = useMemo(() => {
    // The latest post in the active category (or overall latest if 'all' is active) is highlighted
    return filteredPosts[0] || null;
  }, [filteredPosts]);

  const gridPosts = useMemo(() => {
    // Remaining posts in grid
    return featuredPost ? filteredPosts.slice(1) : [];
  }, [filteredPosts, featuredPost]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: posts.length };
    posts.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [posts]);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 pt-20">
      <Header />

      {/* Hero Header */}
      <section className="relative py-24 md:py-32 bg-white overflow-hidden border-b border-slate-50">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[45%] h-[40%] bg-blue-50/60 blur-[130px] rounded-full opacity-60" />
          <div className="absolute top-1/4 right-1/4 w-[35%] h-[45%] bg-[#155dfc]/5 blur-[110px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-[#155dfc] rounded-full text-xs font-black uppercase tracking-[0.2em] shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Theseofly Insights Hub
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 leading-none"
          >
            Scale Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#155dfc] via-blue-500 to-indigo-500">Search Knowledge</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-500 text-base md:text-lg max-w-2xl mx-auto font-medium"
          >
            Expert strategies, engineering guides, internal linking architectures, and programmatic frameworks to achieve complete search engine dominance.
          </motion.p>

          {/* Search Inputs */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-xl mx-auto pt-6"
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-[#155dfc]/5 rounded-2xl blur-xl group-hover:bg-[#155dfc]/10 transition-colors" />
              <Input
                placeholder="Search articles by keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />}
                className="h-14 bg-white border border-slate-200 shadow-xl shadow-blue-900/5 hover:border-blue-300 focus:border-[#155dfc] focus:ring-4 focus:ring-blue-100 rounded-2xl pl-12 pr-6 font-bold text-slate-800 placeholder-slate-400 outline-none transition-all relative z-10"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filtering Section */}
      <section className="border-b border-slate-100 bg-slate-50/50 py-8 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-6">
          {/* Categories Horizontal Tabs */}
          <div className="flex flex-col gap-4">
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-blue-500" />
              Filter by Category
            </span>
            <div className="flex flex-wrap gap-2.5">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-5 py-2.5 rounded-full text-xs font-black tracking-wide transition-all border ${
                  selectedCategory === "all"
                    ? "bg-[#155dfc] text-white border-[#155dfc] shadow-lg shadow-blue-200 scale-105"
                    : "bg-white text-slate-600 border-slate-200 hover:border-blue-200 hover:text-[#155dfc]"
                }`}
              >
                All Articles <span className={`ml-1 text-[10px] font-bold ${selectedCategory === "all" ? "text-blue-200" : "text-slate-400"}`}>({categoryCounts.all})</span>
              </button>
              {categories.map((cat) => {
                const count = categoryCounts[cat.name] || 0;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`px-5 py-2.5 rounded-full text-xs font-black tracking-wide transition-all border ${
                      selectedCategory === cat.name
                        ? "bg-[#155dfc] text-white border-[#155dfc] shadow-lg shadow-blue-200 scale-105"
                        : "bg-white text-slate-600 border-slate-200 hover:border-blue-200 hover:text-[#155dfc]"
                    }`}
                  >
                    {cat.name} <span className={`ml-1 text-[10px] font-bold ${selectedCategory === cat.name ? "text-blue-200" : "text-slate-400"}`}>({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tags Cloud */}
          {tags.length > 0 && (
            <div className="flex flex-col gap-3 pt-3 border-t border-slate-100">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Organize by Tags</span>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => {
                  const isSelected = selectedTags.includes(tag.name);
                  return (
                    <button
                      key={tag.id}
                      onClick={() => handleTagToggle(tag.name)}
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${
                        isSelected
                          ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                          : "bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700"
                      }`}
                    >
                      {tag.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Dynamic Articles Content */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 py-20">
        <AnimatePresence mode="wait">
          {filteredPosts.length === 0 ? (
            /* Beautiful empty state */
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="py-20 text-center max-w-md mx-auto space-y-6"
            >
              <div className="w-20 h-20 bg-blue-50 text-[#155dfc] rounded-[24px] flex items-center justify-center mx-auto shadow-sm">
                <Search className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900">No Articles Found</h3>
                <p className="text-slate-500 text-sm font-medium">
                  We couldn't find any match for your search criteria. Try adjusting your tags, categories, or keywords.
                </p>
              </div>
              <Button
                variant="outline"
                className="rounded-xl border-slate-200"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                  setSelectedTags([]);
                }}
              >
                Reset All Filters
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-20"
            >
              {/* Featured Post Card */}
              {featuredPost && (
                <div className="relative group">
                  <div className="absolute inset-0 bg-blue-500/5 rounded-[40px] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Card className="border-slate-100 hover:border-blue-200 transition-all rounded-[32px] md:rounded-[40px] overflow-hidden shadow-xl shadow-slate-100/50 hover:shadow-2xl">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                      {/* Featured Image */}
                      <div className="lg:col-span-7 aspect-[16/10] md:aspect-[21/11] lg:aspect-auto overflow-hidden bg-slate-50 relative group/img h-full min-h-[300px]">
                        <img
                          src={featuredPost.featured_image_url || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800"}
                          alt={featuredPost.title}
                          className="w-full h-full object-cover transform group-hover/img:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 to-transparent" />
                        <div className="absolute top-6 left-6">
                          <Badge variant="success" className="bg-white/90 backdrop-blur-md text-[#155dfc] font-black h-8 px-4 border-none text-[10px] tracking-wider uppercase rounded-full shadow-md">
                            Featured Post
                          </Badge>
                        </div>
                      </div>

                      {/* Featured Details */}
                      <div className="lg:col-span-5 p-8 md:p-12 flex flex-col justify-between gap-8 bg-white h-full">
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#155dfc] bg-blue-50 px-3 py-1 rounded-full">{featuredPost.category}</span>
                            <span className="text-slate-300">•</span>
                            <span className="text-xs text-slate-400 font-semibold flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {featuredPost.read_time || "5 min read"}</span>
                          </div>
                          
                          <Link to={`/blog/${featuredPost.slug}`}>
                            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 hover:text-[#155dfc] transition-colors leading-[1.1] tracking-tight">
                              {featuredPost.title}
                            </h2>
                          </Link>
                          
                          <p className="text-slate-500 text-sm md:text-base leading-relaxed font-medium">
                            {featuredPost.excerpt}
                          </p>
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-50 pt-6">
                          {/* Author info */}
                          <div className="flex items-center gap-3">
                            <img
                              src={featuredPost.author?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=Theseofly"}
                              alt={featuredPost.author?.full_name}
                              className="w-10 h-10 rounded-full border border-slate-100 shadow-sm"
                            />
                            <div>
                              <p className="font-bold text-slate-900 text-sm leading-none">{featuredPost.author?.full_name}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                                {new Date(featuredPost.published_at || featuredPost.created_at).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric"
                                })}
                              </p>
                            </div>
                          </div>

                          <Link to={`/blog/${featuredPost.slug}`}>
                            <Button size="lg" className="rounded-2xl gap-2 font-black group h-12 shadow-lg hover:shadow-blue-200">
                              Read Post <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* Standard Articles Grid */}
              {gridPosts.length > 0 && (
                <div className="space-y-10">
                  <h3 className="text-2xl font-black tracking-tight text-slate-900 border-b border-slate-100 pb-4">
                    Latest Publications
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {gridPosts.map((post, idx) => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: idx * 0.05 }}
                        whileHover={{ y: -8 }}
                        className="flex h-full"
                      >
                        <Card className="border-slate-100 hover:border-blue-200/60 shadow-sm hover:shadow-xl transition-all rounded-[28px] bg-white flex flex-col justify-between overflow-hidden group">
                          {/* Image */}
                          <div className="aspect-[16/10] overflow-hidden bg-slate-50 relative">
                            <img
                              src={post.featured_image_url || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800"}
                              alt={post.title}
                              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute top-4 left-4">
                              <Badge className="bg-white/95 text-slate-800 backdrop-blur-md shadow-sm text-[9px] font-black uppercase tracking-wider h-7 px-3 border-none rounded-full">
                                {post.category}
                              </Badge>
                            </div>
                          </div>

                          {/* Body */}
                          <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-[10px] text-slate-400 font-black tracking-wider uppercase">
                                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(post.published_at || post.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.read_time || "5 min read"}</span>
                              </div>
                              
                              <Link to={`/blog/${post.slug}`}>
                                <h4 className="text-lg font-black text-slate-900 hover:text-[#155dfc] transition-colors leading-[1.2] tracking-tight line-clamp-2">
                                  {post.title}
                                </h4>
                              </Link>
                              
                              <p className="text-slate-500 text-xs md:text-sm font-medium leading-relaxed line-clamp-3">
                                {post.excerpt}
                              </p>
                            </div>

                            {/* Footer author */}
                            <div className="flex items-center justify-between border-t border-slate-50 pt-4 mt-4">
                              <div className="flex items-center gap-2">
                                <img
                                  src={post.author?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=Theseofly"}
                                  alt={post.author?.full_name}
                                  className="w-8 h-8 rounded-full border border-slate-100"
                                />
                                <span className="font-bold text-xs text-slate-700 leading-none truncate max-w-[120px]">{post.author?.full_name}</span>
                              </div>

                              <Link to={`/blog/${post.slug}`} className="text-xs font-black text-[#155dfc] hover:text-blue-700 flex items-center gap-1 group-hover:gap-2 transition-all">
                                Read More <ArrowRight className="w-3.5 h-3.5" />
                              </Link>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Premium CTA Panel */}
      <section className="bg-slate-50/50 py-20 border-t border-slate-100 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -z-10 w-96 h-96 bg-blue-50 rounded-full blur-[100px]" />
        
        <div className="max-w-5xl mx-auto px-6 text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900">
            Dominate Search Results <br />
            With Modern Programmatic SEO
          </h2>
          <p className="text-slate-500 text-base max-w-2xl mx-auto font-medium">
            Learn and implement automated growth workflows. Register to Theseofly scale platforms and dominate keywords while reducing production spends.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/plans">
              <Button size="lg" className="rounded-2xl shadow-xl font-black px-10">
                View scale plans
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
