import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("login", "routes/login.tsx"),
  
  layout("layouts/DashboardLayout.tsx", [
    route("admin", "routes/dashboard.home.tsx"),
    route("admin/pages", "routes/dashboard.pages.tsx"),
    route("admin/taxonomies", "routes/dashboard.taxonomies.tsx"),
    route("admin/seo", "routes/dashboard.seo.tsx"),
    route("admin/programmatic-seo", "routes/dashboard.programmatic-seo.tsx"),
    route("admin/media", "routes/dashboard.media.tsx"),
    route("admin/users", "routes/dashboard.users.tsx"),
    route("admin/settings", "routes/dashboard.settings.tsx"),
  ]),
  
  // SEO Endpoints
  route("sitemap.xml", "routes/sitemap.xml.ts"),
  route("sitemap-pages.xml", "routes/sitemap-pages.xml.ts"),
  route("sitemap-cities.xml", "routes/sitemap-cities.xml.ts"),
  route("sitemap-services.xml", "routes/sitemap-services.xml.ts"),
  route("robots.txt", "routes/robots.txt.ts"),

  // Catch-all route for dynamic pages (MUST BE LAST)
  route("*", "routes/content-page.tsx"),
] satisfies RouteConfig;
