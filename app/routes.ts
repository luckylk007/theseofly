import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  route("login", "routes/login.tsx"),
  
  layout("layouts/DashboardLayout.tsx", [
    index("routes/dashboard.home.tsx"),
    route("pages", "routes/dashboard.pages.tsx"),
    route("seo", "routes/dashboard.seo.tsx"),
    route("media", "routes/dashboard.media.tsx"),
    route("users", "routes/dashboard.users.tsx"),
    route("settings", "routes/dashboard.settings.tsx"),
  ]),
] satisfies RouteConfig;
