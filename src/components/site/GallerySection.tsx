import { useEffect, useState } from "react";
import { Loader2, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Reveal } from "./Reveal";

type Item = {
  id: string;
  section: string;
  kind: string;
  url: string;
  title: string | null;
  caption: string | null;
};

export function GallerySection({
  section,
  eyebrow,
  title,
  subtitle,
  limit = 6,
}: {
  section: "school" | "church" | "company";
  eyebrow: string;
  title: string;
  subtitle?: string;
  limit?: number;
}) {
  const [items, setItems] = useState<Item[] | null>(null);
  const [lightbox, setLightbox] = useState<Item | null>(null);

  useEffect(() => {
    (supabase as any)
      .from("gallery_items")
      .select("*")
      .eq("section", section)
      .order("created_at", { ascending: false })
      .limit(limit)
      .then(({ data }: any) => setItems((data ?? []) as Item[]));
  }, [section, limit]);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setLightbox(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.3em] text-primary">{eyebrow}</p>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl font-bold">{title}</h2>
          {subtitle && <p className="mt-4 max-w-2xl text-muted-foreground">{subtitle}</p>}
        </Reveal>

        {items === null ? (
          <div className="text-center py-16"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></div>
        ) : items.length === 0 ? (
          <div className="mt-10 rounded-3xl glass p-12 text-center">
            <ImageIcon className="h-10 w-10 mx-auto text-muted-foreground" />
            <p className="mt-3 font-display text-2xl font-bold">Gallery coming soon</p>
          </div>
        ) : (
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((it) => (
              <figure key={it.id} className="group relative rounded-2xl overflow-hidden glass">
                <button
                  type="button"
                  onClick={() => setLightbox(it)}
                  className="block w-full text-left cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-label={`Open ${it.title ?? "image"} in full view`}
                >
                  <img src={it.url} alt={it.title ?? ""} loading="lazy" className="w-full aspect-[4/3] object-cover transition-transform group-hover:scale-105" />
                </button>
                {(it.title || it.caption) && (
                  <figcaption className="p-4">
                    {it.title && <h3 className="font-semibold">{it.title}</h3>}
                    {it.caption && <p className="text-sm text-muted-foreground mt-1">{it.caption}</p>}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        )}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            className="absolute top-4 right-4 h-11 w-11 rounded-full bg-white/10 hover:bg-white/20 text-white text-2xl flex items-center justify-center"
            onClick={(e) => { e.stopPropagation(); setLightbox(null); }}
            aria-label="Close"
          >
            ×
          </button>
          <img
            src={lightbox.url}
            alt={lightbox.title ?? ""}
            className="max-h-[90vh] max-w-[95vw] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}

export function ImageBesideParagraph({
  eyebrow,
  title,
  paragraphs,
  image,
  alt,
  reverse = false,
}: {
  eyebrow: string;
  title: string;
  paragraphs: string[];
  image: string;
  alt: string;
  reverse?: boolean;
}) {
  return (
    <section className="py-20">
      <div className={`mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-10 items-center ${reverse ? "lg:[&>*:first-child]:order-2" : ""}`}>
        <Reveal>
          <div className="relative">
            <div className="absolute -inset-2 bg-gradient-to-tr from-primary/30 to-accent/30 blur-2xl rounded-3xl" />
            <img src={image} alt={alt} loading="lazy" className="relative rounded-3xl w-full aspect-[4/3] object-cover" />
          </div>
        </Reveal>
        <Reveal delay={100}>
          <p className="text-xs uppercase tracking-[0.3em] text-primary">{eyebrow}</p>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl font-bold">{title}</h2>
          <div className="mt-5 space-y-4 text-muted-foreground leading-relaxed">
            {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </Reveal>
      </div>
    </section>
  );
}