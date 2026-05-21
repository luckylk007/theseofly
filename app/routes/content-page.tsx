import { supabase } from "../lib/supabase";
import type { Route } from "./+types/content-page";
import { useMemo } from "react";
import { Link } from "react-router";
import { MapPin, Briefcase, CheckCircle2, ChevronRight, ArrowRight, Sparkles } from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { cn } from "../lib/utils";

export async function loader({ params, request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const previewId = url.searchParams.get("preview");
  
  // 1. Extract and normalize the slug from the URL parameters (supporting both flat catchall and hierarchical URL paths)
  let slug = "";
  if (params.country) {
    const parts = [params.country];
    if (params.city) parts.push(params.city);
    if (params.service) parts.push(params.service);
    slug = parts.join("/");
  } else {
    let rawSlug = params["*"] || "";
    slug = rawSlug.trim().replace(/^\/+|\/+$/g, "");
  }

  console.log(`[ContentPage] DEBUG: Full URL="${request.url}"`);
  console.log(`[ContentPage] DEBUG: Slug="${slug}", PreviewID="${previewId}"`);
  console.log(`[ContentPage] DEBUG: All Params=`, Object.fromEntries(url.searchParams.entries()));

  if (!slug && !previewId) {
    throw new Response(`[404_EMPTY_REQUEST] No slug or ID. URL: ${request.url}`, { status: 404 });
  }

  // 2. Handle Preview Mode via RPC with Fallback
  if (previewId) {
    console.log(`[ContentPage] Attempting preview for ID: ${previewId}`);
    
    // Attempt 1: Optimized RPC
    const { data: pageData, error: previewError } = await supabase.rpc("get_page_preview", { p_id: previewId });
    
    if (pageData && !previewError) {
      return processPage(pageData, true, request);
    }

    // Attempt 2: Direct Query Fallback
    const { data: directData, error: directError } = await supabase
      .from("pages")
      .select(`
        *,
        seo:seo_metadata(*),
        website:websites(global_seo_settings),
        page_taxonomies(
          taxonomy:taxonomies(*)
        )
      `)
      .eq("id", previewId)
      .maybeSingle();

    if (directData) {
      return processPage(directData, true, request);
    }

    const rpcMsg = previewError?.message || "No RPC data";
    const directMsg = directError?.message || "No record found with ID";

    throw new Response(`[404_PREVIEW_FAILED] ID: "${previewId}" | RPC: ${rpcMsg} | DIRECT: ${directMsg} | URL: ${request.url}`, { 
      status: 404,
      statusText: "Preview Not Found"
    });
  }

  // 3. Normal Mode: Query Supabase for the published page
  const slugVariants = [slug, `/${slug}`, `${slug}/`, `/${slug}/`].flatMap(s => [s, s.toLowerCase()]);
  const uniqueVariants = Array.from(new Set(slugVariants));

  const { data: pageData, error } = await supabase
    .from("pages")
    .select(`
      *,
      seo:seo_metadata(*),
      website:websites(global_seo_settings),
      page_taxonomies(
        taxonomy:taxonomies(*)
      )
    `)
    .in("slug", uniqueVariants)
    .maybeSingle();

  // 4. Fallback: Case-insensitive search
  if (!pageData) {
    const { data: fallbackData } = await supabase
      .from("pages")
      .select(`
        *,
        seo:seo_metadata(*),
        website:websites(global_seo_settings),
        page_taxonomies(
          taxonomy:taxonomies(*)
        )
      `)
      .ilike("slug", slug)
      .maybeSingle();

    if (!fallbackData) {
      const { data: slashData } = await supabase
        .from("pages")
        .select(`
          *,
          seo:seo_metadata(*),
          website:websites(global_seo_settings),
          page_taxonomies(
            taxonomy:taxonomies(*)
          )
        `)
        .ilike("slug", `/${slug}`)
        .maybeSingle();

      if (!slashData) {
        throw new Response(`[404_NOT_FOUND] SLUG: "${slug}" | PREVIEW_ID: "${previewId}" | URL: ${request.url}`, { status: 404 });
      }
      return processPage(slashData, false, request);
    }
    return processPage(fallbackData, false, request);
  }

  // Check if it's a draft and we are NOT in preview mode
  if ((pageData as any).status !== "published") {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Response(`[404_AUTH_REQUIRED] Page "${slug}" is ${(pageData as any).status}. PREVIEW_ID: "${previewId}" | URL: ${request.url}`, { status: 404 });
    }
  }

  return processPage(pageData, false, request);
}

async function processPage(pageData: any, isPreview: boolean, request: Request) {
  const page = pageData as any;
  let relatedCities: any[] = [];
  let relatedServices: any[] = [];
  
  // Internal linking logic for programmatic SEO
  if (page.is_programmatic && page.variables) {
    const { country_id } = page.variables;

    if (country_id) {
      const { data: cities } = await supabase
        .from("cities")
        .select("id, name, slug, country:countries(slug)")
        .eq("country_id", country_id)
        .eq("status", "public")
        .limit(10);
      if (cities) relatedCities = cities;
    }

    const { data: services } = await supabase
      .from("services")
      .select("id, name, slug")
      .eq("status", "public")
      .limit(10);
    if (services) relatedServices = services;
  }

  const assignments = (page.page_taxonomies || [])
    .map((entry: any) => entry.taxonomy)
    .filter(Boolean);
  const categories = assignments.filter((item: any) => item.type === "category");
  const tags = assignments.filter((item: any) => item.type === "tag");

  const url = new URL(request.url);

  return {
    page: {
      ...page,
      categories,
      tag_entities: tags,
    },
    relatedCities,
    relatedServices,
    isPreview: isPreview || page.status !== "published",
    pathname: url.pathname,
    origin: url.origin
  };
}

export function meta({ data }: Route.MetaArgs) {
  if (!data || !data.page) return [{ title: "Page Not Found" }];

  const { page, isPreview, pathname, origin } = data;
  const seo = page.seo?.[0] || {};
  const vars = page.variables || {};

  const country = vars.country || vars.country_slug || "";
  const city = vars.city || vars.city_slug || "";
  const service = vars.service || vars.service_slug || "";

  const cityName = city ? String(city).replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()) : "";
  const serviceName = service ? String(service).replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()) : "";
  const countryName = country ? (String(country).toLowerCase() === "usa" ? "USA" : String(country).replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())) : "";

  // 1. Dynamic Local Title Generation
  const defaultTitle = page.is_programmatic && cityName && serviceName 
    ? `Best ${serviceName} in ${cityName}${countryName ? ', ' + countryName : ''} | Expert Local Services`
    : page.title;
  const title = isPreview ? `[PREVIEW] ${seo.title || defaultTitle}` : (seo.title || defaultTitle);

  // 2. Dynamic Local Meta Description Generation
  const defaultDesc = page.is_programmatic && cityName && serviceName 
    ? `Looking for top-rated ${serviceName} in ${cityName}, ${countryName || 'USA'}? We provide premier, high-quality local professional services. Contact us today for a free quote!`
    : (page.description || `Expert professional services in your area.`);
  const metaDesc = seo.description || defaultDesc;

  // 3. Dynamic Canonical URL Generation
  const baseUrl = origin || "https://theseofly.vercel.app";
  const canonicalUrl = seo.canonical_url || `${baseUrl}${pathname || ''}`;

  return [
    { title },
    { name: "description", content: metaDesc },
    { property: "og:title", content: title },
    { property: "og:description", content: metaDesc },
    { property: "og:image", content: seo.og_image || page.featured_image_url || `${baseUrl}/og-image-default.png` },
    { rel: "canonical", href: canonicalUrl },
    ...(isPreview ? [{ name: "robots", content: "noindex, nofollow" }] : [])
  ];
}

export default function DynamicPage({ loaderData }: Route.ComponentProps) {
  const { page, relatedCities, relatedServices, isPreview, pathname, origin } = loaderData;

  const interpolate = (text: string, variables: Record<string, any>) => {
    if (!text || typeof text !== "string") return text;
    return text.replace(/\{(\w+)\}/g, (match, key) => {
      return variables[key] !== undefined ? String(variables[key]) : match;
    });
  };

  const renderData = useMemo(() => {
    const rawContent = page.content || { sections: [] };
    const variables = page.variables || {};

    const processContent = (content: any): any => {
      if (typeof content === "string") return interpolate(content, variables);
      if (Array.isArray(content)) return content.map(processContent);
      if (content && typeof content === "object") {
        const result: any = {};
        for (const key in content) {
          result[key] = processContent(content[key]);
        }
        return result;
      }
      return content;
    };

    return processContent(rawContent);
  }, [page]);

  const vars = page.variables || {};

  const country = vars.country || vars.country_slug || "";
  const city = vars.city || vars.city_slug || "";
  const service = vars.service || vars.service_slug || "";

  const cityName = city ? String(city).replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()) : "";
  const serviceName = service ? String(service).replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()) : "";
  const countryName = country ? (String(country).toLowerCase() === "usa" ? "USA" : String(country).replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())) : "";

  // 1. Auto-generate breadcrumbs based on URL segment hierarchy
  const breadcrumbs = useMemo(() => {
    const segments = (pathname || "").split("/").filter(Boolean);
    const crumbs = [{ label: "Home", link: "/" }];
    
    let currentPath = "";
    segments.forEach((segment, idx) => {
      currentPath += `/${segment}`;
      let label = segment.replace(/-/g, " ");
      
      if (label.toLowerCase() === "usa") {
        label = "USA";
      } else if (label.toLowerCase() === "seo") {
        label = "SEO";
      } else {
        label = label.replace(/\b\w/g, (char) => char.toUpperCase());
      }
      
      crumbs.push({
        label,
        link: idx === segments.length - 1 ? "" : currentPath
      });
    });
    
    return crumbs;
  }, [pathname]);

  // 2. Dynamically build LocalBusiness schema.org JSON-LD
  const schemaMarkup = useMemo(() => {
    if (page.seo?.[0]?.schema_markup) {
      return page.seo[0].schema_markup;
    }

    if (page.is_programmatic) {
      const canonical = `${origin || "https://theseofly.vercel.app"}${pathname || ""}`;
      const desc = page.seo?.[0]?.description || `Professional ${serviceName || "expert"} services in ${cityName || "your local city"}.`;
      
      return {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": page.title,
        "description": desc,
        "url": canonical,
        "image": page.featured_image_url || "https://theseofly.vercel.app/og-image-default.png",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": cityName || "Local Area",
          "addressCountry": countryName || "US"
        },
        "offers": {
          "@type": "Offer",
          "category": serviceName || "Services"
        }
      };
    }

    return null;
  }, [page, pathname, origin, cityName, serviceName, countryName]);

  // SEO Template Layout for Programmatic Pages
  if (page.is_programmatic) {
    return (
      <div className="min-h-screen bg-slate-50 pt-20">
        <Header />

        {isPreview && (
          <div className="fixed top-20 left-0 right-0 z-50 bg-amber-500 text-white px-6 py-3 flex items-center justify-center gap-4 shadow-lg animate-in fade-in slide-in-from-top duration-500">
            <div className="flex items-center gap-2 font-black uppercase tracking-widest text-sm">
              <Sparkles className="w-5 h-5" />
              Preview Mode
            </div>
            <div className="h-4 w-px bg-white/20" />
            <p className="text-sm font-bold">You are viewing a draft version of this page. This content is not public.</p>
          </div>
        )}

        {schemaMarkup && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
          />
        )}

        {/* Hero Section */}
        <section className="bg-white border-b border-slate-100 py-24 px-6">
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumbs */}
            <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 mb-8 font-medium">
              {breadcrumbs.map((crumb, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  {idx > 0 && <ChevronRight className="w-4 h-4 text-slate-300" />}
                  {crumb.link ? (
                    <Link to={crumb.link} className="hover:text-blue-600 transition-colors">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className={cn(idx === breadcrumbs.length - 1 ? "text-blue-600 font-bold" : "text-slate-900")}>
                      {crumb.label}
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-bold tracking-wide uppercase">
                  <MapPin className="w-4 h-4" />
                  Available in {cityName || "Your City"}
                </div>
                <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-tight tracking-tight">
                  {page.title}
                </h1>
                <p className="text-xl text-slate-600 leading-relaxed max-w-lg">
                  Looking for reliable {serviceName || "professional"} experts in {cityName || "your city"}? We provide top-rated, professional services tailored for your needs.
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-200">
                    Get a Free Quote
                  </button>
                  <button className="px-8 py-4 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-bold rounded-2xl transition-all">
                    View Services
                  </button>
                </div>
              </div>
              
              <div className="bg-slate-100 rounded-[2.5rem] aspect-square lg:aspect-[4/3] flex items-center justify-center border-8 border-white shadow-2xl relative overflow-hidden group">
                {page.featured_image_url ? (
                  <img 
                    src={page.featured_image_url} 
                    alt={page.title} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-indigo-50 opacity-50" />
                    <div className="relative text-center space-y-4">
                      <Briefcase className="w-24 h-24 mx-auto text-blue-200" />
                      <p className="font-black text-2xl text-blue-900 opacity-20 uppercase tracking-widest">{cityName || "Local"}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        <main className="max-w-7xl mx-auto px-6 py-20 space-y-24">
          
          {/* Dynamic Content Template */}
          {page.website?.global_seo_settings?.programmatic_template && (
            <section className="bg-white p-12 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div 
                className="prose prose-lg prose-slate max-w-none text-slate-600 leading-relaxed text-lg"
                dangerouslySetInnerHTML={{ 
                  __html: interpolate(page.website.global_seo_settings.programmatic_template, vars) 
                }}
              />
            </section>
          )}

          {/* Benefits Section */}
          <section className="space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <h2 className="text-3xl font-black text-slate-900">Why choose our {serviceName || "expert team"} in {cityName || "your city"}?</h2>
              <p className="text-slate-500 text-lg">We deliver exceptional results by combining local expertise with industry-leading standards.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: "Local Experts", desc: `Our team knows ${cityName || "your area"} inside and out.` },
                { title: "Top Rated", desc: "Award-winning services recognized by industry leaders." },
                { title: "24/7 Support", desc: "We are always here to help you when you need it most." }
              ].map((benefit, i) => (
                <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{benefit.title}</h3>
                  <p className="text-slate-600">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Internal Linking / Hubs */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white p-12 rounded-[2.5rem] border border-slate-100 shadow-sm">
            {relatedCities.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-black flex items-center gap-3">
                  <MapPin className="w-6 h-6 text-blue-600" />
                  Nearby Locations
                </h3>
                <p className="text-slate-500">We also serve these areas around {cityName || "your city"}:</p>
                <div className="grid grid-cols-2 gap-4">
                  {relatedCities.map((c) => {
                     const serviceSlug = vars.service_slug || "services";
                     const link = `/${vars.country_slug || c.country?.slug || 'usa'}/${c.slug}/${serviceSlug}`;
                     return (
                      <Link key={c.id} to={link} className="flex items-center gap-2 p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all font-semibold text-slate-700 hover:text-blue-600">
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                        {c.name}
                      </Link>
                     );
                  })}
                </div>
              </div>
            )}

            {relatedServices.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-black flex items-center gap-3">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                  Other Services in {cityName || "your city"}
                </h3>
                <p className="text-slate-500">Explore our full range of solutions:</p>
                <div className="flex flex-wrap gap-2">
                  {relatedServices.map((s) => {
                     const countrySlug = vars.country_slug || "usa";
                     const citySlug = vars.city_slug || "city";
                     const link = `/${countrySlug}/${citySlug}/${s.slug}`;
                     return (
                      <Link key={s.id} to={link} className="px-4 py-2 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-100 hover:border-blue-100 rounded-xl font-medium transition-colors text-sm">
                        {s.name}
                      </Link>
                     );
                  })}
                </div>
              </div>
            )}
          </section>

          {/* CTA Section */}
          <section className="bg-blue-600 text-white rounded-[2.5rem] p-12 text-center space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-10">
              <Sparkles className="w-64 h-64" />
            </div>
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <h2 className="text-4xl font-black">Ready to get started in {cityName || "your city"}?</h2>
              <p className="text-blue-100 text-lg">Contact our {serviceName || "expert"} team today for a free consultation and quote.</p>
              <button className="px-10 py-5 bg-white text-blue-600 hover:bg-blue-50 font-black rounded-2xl text-lg transition-all shadow-xl">
                Contact Us Now
              </button>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  // Standard Page Layout
  return (
    <div className="min-h-screen bg-white pt-20">
      <Header />
      
      {isPreview && (
        <div className="fixed top-20 left-0 right-0 z-50 bg-amber-500 text-white px-6 py-3 flex items-center justify-center gap-4 shadow-lg animate-in fade-in slide-in-from-top duration-500">
          <div className="flex items-center gap-2 font-black uppercase tracking-widest text-sm">
            <Sparkles className="w-5 h-5" />
            Preview Mode
          </div>
          <div className="h-4 w-px bg-white/20" />
          <p className="text-sm font-bold">You are viewing a draft version of this page. This content is not public.</p>
        </div>
      )}

      {page.seo?.[0]?.schema_markup && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(page.seo[0].schema_markup) }}
        />
      )}

      {/* Hero Section */}
      <section className="bg-slate-50 border-b border-slate-100 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className={cn(
            "grid grid-cols-1 items-center gap-12",
            page.featured_image_url ? "lg:grid-cols-2" : ""
          )}>
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-tight tracking-tight">
                {page.title}
              </h1>
              {page.seo?.[0]?.description && (
                <p className="text-xl text-slate-600 leading-relaxed max-w-lg">
                  {page.seo[0].description}
                </p>
              )}
            </div>
            
            {page.featured_image_url && (
              <div className="bg-white rounded-[2.5rem] aspect-square lg:aspect-[4/3] flex items-center justify-center border-8 border-white shadow-2xl relative overflow-hidden group">
                <img 
                  src={page.featured_image_url} 
                  alt={page.title} 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="space-y-12">
          {renderData.sections?.map((section: any, idx: number) => (
            <section key={idx} className="prose prose-lg max-w-none">
              {section.heading && <h2 className="text-3xl font-black text-slate-900 mb-6">{section.heading}</h2>}
              {section.text && (
                <div 
                  className="text-slate-600 leading-relaxed space-y-6 text-lg"
                  dangerouslySetInnerHTML={{ __html: section.text }}
                />
              )}
            </section>
          ))}

          {(!renderData.sections || renderData.sections.length === 0) && (
            <div className="p-12 border-2 border-dashed border-slate-200 rounded-3xl text-center">
              <p className="text-slate-400 font-medium">This page has no content sections defined yet.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
