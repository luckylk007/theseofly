import { supabase } from "../lib/supabase";
import type { Route } from "./+types/sitemap-services.xml";

export async function loader({ request }: Route.LoaderArgs) {
  // Fetch pages where it's programmatic but does NOT have a city_id (meaning it's just a general service page)
  const { data: pageData } = await supabase
    .from("pages")
    .select("slug, updated_at, variables")
    .eq("status", "published")
    .eq("is_programmatic", true)
    .is("variables->>city_id", null);

  const { data: websiteData } = await supabase
    .from("websites")
    .select("domain")
    .single();

  const pages = (pageData as any[]) || [];
  const website = websiteData as { domain?: string } | null;
  const baseUrl = website?.domain ? `https://${website.domain}` : new URL(request.url).origin;

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages.map((page) => `
  <url>
    <loc>${baseUrl}/${page.slug}</loc>
    <lastmod>${new Date(page.updated_at).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join("")}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=18000",
    },
  });
}
