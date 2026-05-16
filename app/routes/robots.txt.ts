import { supabase } from "../lib/supabase";
import type { Route } from "./+types/robots.txt";

export async function loader({ request }: Route.LoaderArgs) {
  const { data } = await supabase
    .from("websites")
    .select("domain")
    .single();

  const website = data as { domain?: string } | null;
  const baseUrl = website?.domain ? `https://${website.domain}` : new URL(request.url).origin;

  const robots = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /login

Sitemap: ${baseUrl}/sitemap.xml
`;

  return new Response(robots, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
