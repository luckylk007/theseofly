import { supabase } from "../lib/supabase";
import type { Route } from "./+types/sitemap-cities.xml";

export async function loader({ request }: Route.LoaderArgs) {
  // We fetch pages where it's a programmatic city page (i.e. has a city_id but no service_id? Wait, programmatic pages generated are usually "country/city/service-services".)
  // Actually, let's fetch all programmatic pages and filter them. Or just query the `pages` table for `is_programmatic=true` and `status=published`.
  // If we just want a subset, we can split by ID or by checking variables.
  
  const { data: pageData } = await supabase
    .from("pages")
    .select("slug, updated_at, variables")
    .eq("status", "published")
    .eq("is_programmatic", true)
    .not("variables->>city_id", "is", null);

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
