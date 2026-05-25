import { supabase } from "../lib/supabase";
import type { Route } from "./+types/sitemap-blogs.xml";

export async function loader({ request }: Route.LoaderArgs) {
  // 1. Fetch published blog posts from Supabase
  const { data: blogData } = await supabase
    .from("pages")
    .select("slug, updated_at")
    .eq("status", "published")
    .eq("content_type", "post")
    .eq("post_type", "blog");

  // 2. Fetch website config for base URL
  const { data: websiteData } = await supabase
    .from("websites")
    .select("domain")
    .single();

  const website = websiteData as { domain?: string } | null;
  const baseUrl = website?.domain ? `https://${website.domain}` : new URL(request.url).origin;

  const blogs = (blogData as any[]) || [];
  
  // 3. Fallback demo blog URLs if database holds no records
  const demoSlugs = [
    { slug: "what-is-programmatic-seo-complete-guide", updated_at: new Date().toISOString() },
    { slug: "10-strategies-to-scale-page-indexing", updated_at: new Date().toISOString() },
    { slug: "mastering-internal-linking-architectures", updated_at: new Date().toISOString() },
    { slug: "ai-content-vs-programmatic-landing-pages", updated_at: new Date().toISOString() }
  ];

  const activeBlogs = blogs.length > 0 ? blogs : demoSlugs;

  // 4. Generate XML content
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${activeBlogs.map((post) => `
  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${new Date(post.updated_at).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join("")}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=18000",
    },
  });
}
