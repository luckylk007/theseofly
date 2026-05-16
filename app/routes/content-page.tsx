import { supabase } from "../lib/supabase";
import type { Route } from "./+types/content-page";
import { useMemo } from "react";
import { Link } from "react-router";
import { MapPin, Briefcase, CheckCircle2, ChevronRight, ArrowRight, Sparkles } from "lucide-react";

export async function loader({ params, request }: Route.LoaderArgs) {
  // 1. Extract and normalize the slug from the URL
  // We use params["*"] to capture the entire nested path.
  let rawSlug = params["*"] || "";
  
  // Clean the slug: remove leading/trailing slashes and whitespace
  const slug = rawSlug.trim().replace(/^\/+|\/+$/g, "");

  // Don't try to query empty slugs (handled by index route)
  if (!slug) {
    throw new Response("Page Not Found", { status: 404 });
  }

  // 2. Query Supabase for the page
  // We look for an exact match. RLS policies must allow SELECT for 'published' pages.
  const { data: pageData, error } = await supabase
    .from("pages")
    .select(`
      *,
      seo:seo_metadata(*),
      page_taxonomies(
        taxonomy:taxonomies(*)
      )
    `)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error(`[ContentPage] Database error for slug "${slug}":`, error);
    // If it's a connection error or similar, we might want to return a 500
    throw new Response("Database Error", { status: 500 });
  }

  // 3. Fallback: try with leading slash if not found
  if (!pageData) {
    const { data: slashPageData } = await supabase
      .from("pages")
      .select(`
        *,
        seo:seo_metadata(*),
        page_taxonomies(
          taxonomy:taxonomies(*)
        )
      `)
      .eq("slug", `/${slug}`)
      .maybeSingle();

    if (!slashPageData) {
      console.warn(`[ContentPage] No page found for slug: "${slug}"`);
      throw new Response("Page Not Found", { status: 404 });
    }
    
    return processPage(slashPageData);
  }

  return processPage(pageData);
}

async function processPage(pageData: any) {
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

  return {
    page: {
      ...page,
      categories,
      tag_entities: tags,
    },
    relatedCities,
    relatedServices,
  };
}

export function meta({ data }: Route.MetaArgs) {
  if (!data || !data.page) return [{ title: "Page Not Found" }];

  const { page } = data;
  const seo = page.seo?.[0] || {};

  return [
    { title: seo.title || page.title },
    { name: "description", content: seo.description || "" },
    { property: "og:title", content: seo.title || page.title },
    { property: "og:description", content: seo.description || "" },
    { property: "og:image", content: seo.og_image || "" },
    { rel: "canonical", href: seo.canonical_url || "" },
  ];
}

export default function DynamicPage({ loaderData }: Route.ComponentProps) {
  const { page, relatedCities, relatedServices } = loaderData;

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

  // SEO Template Layout for Programmatic Pages
  if (page.is_programmatic) {
    const serviceName = vars.service_id ? interpolate("{service}", vars) : (vars.service_slug || "Service").replace(/-/g, " ");
    const cityName = vars.city_id ? interpolate("{city}", vars) : (vars.city_slug || "City").replace(/-/g, " ");

    return (
      <div className="min-h-screen bg-slate-50">
        {page.seo?.[0]?.schema_markup && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(page.seo[0].schema_markup) }}
          />
        )}

        {/* Hero Section */}
        <section className="bg-white border-b border-slate-100 py-24 px-6">
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-8 font-medium">
              <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
              <ChevronRight className="w-4 h-4" />
              {vars.country_slug && (
                <>
                  <Link to={`/${vars.country_slug}`} className="hover:text-blue-600 transition-colors capitalize">{vars.country_slug.replace(/-/g, " ")}</Link>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
              {vars.city_slug && (
                <>
                  <span className="capitalize text-slate-900">{vars.city_slug.replace(/-/g, " ")}</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
              <span className="text-blue-600 capitalize">{vars.service_slug ? vars.service_slug.replace(/-/g, " ") : "Service"}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-bold tracking-wide uppercase">
                  <MapPin className="w-4 h-4" />
                  Available in {cityName}
                </div>
                <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-tight tracking-tight">
                  {page.title}
                </h1>
                <p className="text-xl text-slate-600 leading-relaxed max-w-lg">
                  Looking for reliable {serviceName} experts in {cityName}? We provide top-rated, professional services tailored for your needs.
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
              
              <div className="bg-slate-100 rounded-[2.5rem] aspect-square lg:aspect-[4/3] flex items-center justify-center border-8 border-white shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-indigo-50 opacity-50" />
                <div className="relative text-center space-y-4">
                  <Briefcase className="w-24 h-24 mx-auto text-blue-200" />
                  <p className="font-black text-2xl text-blue-900 opacity-20 uppercase tracking-widest">{cityName}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <main className="max-w-7xl mx-auto px-6 py-20 space-y-24">
          
          {/* Benefits Section */}
          <section className="space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <h2 className="text-3xl font-black text-slate-900">Why choose our {serviceName} in {cityName}?</h2>
              <p className="text-slate-500 text-lg">We deliver exceptional results by combining local expertise with industry-leading standards.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: "Local Experts", desc: `Our team knows ${cityName} inside and out.` },
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
                <p className="text-slate-500">We also serve these areas around {cityName}:</p>
                <div className="grid grid-cols-2 gap-4">
                  {relatedCities.map((c) => {
                     const serviceSlug = vars.service_slug || "services";
                     const link = `/${c.country?.slug || 'locations'}/${c.slug}/${serviceSlug}`;
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
                  Other Services in {cityName}
                </h3>
                <p className="text-slate-500">Explore our full range of solutions:</p>
                <div className="flex flex-wrap gap-2">
                  {relatedServices.map((s) => {
                     const countrySlug = vars.country_slug || "locations";
                     const citySlug = vars.city_slug || "city";
                     const link = `/${countrySlug}/${citySlug}/${s.slug}-services`;
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
              <h2 className="text-4xl font-black">Ready to get started in {cityName}?</h2>
              <p className="text-blue-100 text-lg">Contact our {serviceName} experts today for a free consultation and quote.</p>
              <button className="px-10 py-5 bg-white text-blue-600 hover:bg-blue-50 font-black rounded-2xl text-lg transition-all shadow-xl">
                Contact Us Now
              </button>
            </div>
          </section>
        </main>
      </div>
    );
  }

  // Standard Page Layout
  return (
    <div className="min-h-screen bg-white">
      {page.seo?.[0]?.schema_markup && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(page.seo[0].schema_markup) }}
        />
      )}

      <main className="max-w-7xl mx-auto px-6 py-20">
        <h1 className="text-5xl font-black mb-8">{page.title}</h1>

        <div className="space-y-12">
          {renderData.sections?.map((section: any, idx: number) => (
            <section key={idx} className="prose prose-lg max-w-none">
              {section.heading && <h2 className="text-3xl font-bold">{section.heading}</h2>}
              {section.text && <p className="text-slate-600">{section.text}</p>}
            </section>
          ))}

          {(!renderData.sections || renderData.sections.length === 0) && (
            <div className="p-12 border-2 border-dashed border-slate-200 rounded-3xl text-center">
              <p className="text-slate-400 font-medium">This page has no content sections defined yet.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
