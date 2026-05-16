import { supabase } from "../lib/supabase";
import type { Route } from "./+types/sitemap.xml";

export async function loader({ request }: Route.LoaderArgs) {
  // Fetch website config for base URL
  const { data: websiteData } = await supabase
    .from("websites")
    .select("domain")
    .single();

  const website = websiteData as { domain?: string } | null;
  const baseUrl = website?.domain ? `https://${website.domain}` : new URL(request.url).origin;

  // Generate Sitemap Index XML
  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap-pages.xml</loc>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-cities.xml</loc>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-services.xml</loc>
  </sitemap>
</sitemapindex>`;

  return new Response(sitemapIndex, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=18000",
    },
  });
}
