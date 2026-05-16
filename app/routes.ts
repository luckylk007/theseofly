import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("login", "routes/login.tsx"),
  
  layout("layouts/DashboardLayout.tsx", [
    route("admin", "routes/dashboard.home.tsx"),
    route("admin/pages", "routes/dashboard.pages.tsx"),
    route("admin/seo", "routes/dashboard.seo.tsx"),
    route("admin/media", "routes/dashboard.media.tsx"),
    route("admin/users", "routes/dashboard.users.tsx"),
    route("admin/settings", "routes/dashboard.settings.tsx"),
  ]),
] satisfies RouteConfig;
