import { supabase } from "../lib/supabase";
import type { Route } from "./+types/content-page";
import { useMemo } from "react";

export async function loader({ params }: Route.LoaderArgs) {
  const { slug } = params;

  const { data, error } = await supabase
    .from("pages")
    .select(`
      *,
      seo:seo_metadata(*),
      page_taxonomies(
        taxonomy:taxonomies(*)
      )
    `)
    .eq("slug", slug)
    .single();

  const page = data as any;

  if (error || !page) {
    throw new Response("Page Not Found", { status: 404 });
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
  const page = loaderData.page as any;

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
