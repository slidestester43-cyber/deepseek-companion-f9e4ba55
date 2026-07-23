import { useEffect, useState } from "react";
import { Reveal } from "./Reveal";

export function PageHero({
  eyebrow, title, accent, subtitle, image, images, rotateMs = 4000, logo, logoLabel, logoAlt,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  subtitle: string;
  image: string;
  /** Optional list of images to rotate through as the hero visual. When provided, images cycle every `rotateMs`. */
  images?: string[];
  rotateMs?: number;
  /** Optional logo (URL). Rendered as a labeled badge next to the title. */
  logo?: string;
  /** Small label shown above/next to the logo (e.g. "School Logo"). */
  logoLabel?: string;
  logoAlt?: string;
}) {
  const pool = (images && images.length > 0) ? images : [image];
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (pool.length < 2) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % pool.length), rotateMs);
    return () => clearInterval(t);
  }, [pool.length, rotateMs]);
  const current = pool[idx] ?? image;
  return (
    <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-24 overflow-hidden">
      {/* Ambient background glow, no full-bleed photo */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-primary/20 blur-3xl animate-pulse-glow" />
        <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-accent/20 blur-3xl animate-pulse-glow" />
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 grid gap-10 lg:gap-14 items-center lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <Reveal>
          <div className="min-w-0">
            <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-primary font-bold">{eyebrow}</p>
            <h1 className="mt-4 font-display text-4xl sm:text-6xl lg:text-7xl font-black leading-[1.02] tracking-tight break-words">
              {title} {accent && <span className="text-gradient-gold block sm:inline">{accent}</span>}
            </h1>
            {logo && (
              <div className="mt-6 inline-flex items-center gap-3 rounded-2xl glass px-4 py-3">
                <img src={logo} alt={logoAlt ?? logoLabel ?? "Logo"} className="h-14 w-14 sm:h-16 sm:w-16 object-contain shrink-0" loading="lazy" />
                {logoLabel && (
                  <span className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-muted-foreground font-semibold">
                    {logoLabel}
                  </span>
                )}
              </div>
            )}
            <p className="mt-6 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">{subtitle}</p>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div className="relative">
            <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-tr from-primary/30 via-accent/25 to-cross/20 blur-2xl opacity-70" />
            <div className="relative w-full aspect-[4/3] rounded-3xl border border-border shadow-2xl overflow-hidden">
              {pool.map((src, i) => (
                <img
                  key={src + i}
                  src={src}
                  alt=""
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${i === idx ? "opacity-100" : "opacity-0"}`}
                  fetchPriority={i === 0 ? "high" : "low"}
                  loading={i === 0 ? "eager" : "lazy"}
                />
              ))}
              {/* Fallback for SSR or when pool empty */}
              {pool.length === 0 && (
                <img src={current} alt="" className="w-full h-full object-cover" />
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
