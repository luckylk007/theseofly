import { supabase } from "../lib/supabase";
import type { Route } from "./+types/sitemap.xml";

export async function loader({ request }: Route.LoaderArgs) {
  // 1. Fetch all published pages
  const { data: pages } = await supabase
    .from("pages")
    .select("slug, updated_at")
    .eq("status", "published");

  // 2. Fetch website config for base URL
  const { data: website } = await supabase
    .from("websites")
    .select("domain")
    .single();

  const baseUrl = website?.domain ? `https://${website.domain}` : new URL(request.url).origin;

  // 3. Generate XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  ${(pages || []).map((page) => `
  <url>
    <loc>${baseUrl}/${page.slug}</loc>
    <lastmod>${new Date(page.updated_at).toISOString()}</lastmod>
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
