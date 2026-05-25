import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";
import { List } from "lucide-react";

interface Heading {
  text: string;
  id: string;
  level: number;
}

interface TableOfContentsProps {
  headings: Heading[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find visible headings
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          // Order them by proximity to the top of the viewport
          const sorted = visibleEntries.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          setActiveId(sorted[0].target.id);
        }
      },
      {
        rootMargin: "-100px 0px -70% 0px", // Trigger when heading is near the top header
        threshold: 0,
      }
    );

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    });

    return () => {
      headings.forEach((heading) => {
        const el = document.getElementById(heading.id);
        if (el) observer.unobserve(el);
      });
    };
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <div className="bg-slate-50/50 border border-slate-100 rounded-3xl p-6 space-y-4 shadow-sm backdrop-blur-xl">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <List className="w-4.5 h-4.5 text-[#155dfc]" />
        <h4 className="font-black text-xs uppercase text-slate-900 tracking-wider">Table of Contents</h4>
      </div>
      <nav className="space-y-1.5 max-h-[50vh] overflow-y-auto scrollbar-thin">
        {headings.map((heading) => (
          <a
            key={heading.id}
            href={`#${heading.id}`}
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById(heading.id);
              if (el) {
                const headerOffset = 96; // Offset for sticky navbar
                const elementPosition = el.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                  top: offsetPosition,
                  behavior: "smooth"
                });
                setActiveId(heading.id);
              }
            }}
            className={cn(
              "block text-sm font-bold py-1.5 transition-all outline-none border-l-2 pl-3",
              heading.level === 3 ? "ml-4 text-xs font-semibold" : "",
              activeId === heading.id
                ? "text-[#155dfc] border-[#155dfc] bg-blue-50/30 pl-4"
                : "text-slate-500 border-transparent hover:text-slate-800 hover:border-slate-300"
            )}
          >
            {heading.text}
          </a>
        ))}
      </nav>
    </div>
  );
}
