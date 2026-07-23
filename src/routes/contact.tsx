import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone, MessageCircle, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Layout } from "@/components/site/Layout";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { supabase } from "@/integrations/supabase/client";
import { CONTACT_PHONE, CONTACT_PHONE_DISPLAY, CONTACT_WHATSAPP_URL } from "@/components/site/WhatsAppFab";
import img from "@/assets/community.jpg";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact — 54 Global Afrikan & Halel School Nairobi" },
      { name: "description", content: "Reach Praise Church International, Halel School Nairobi and the 54 Global Afrikan team. Call +254 715 297 696." },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
});

const SCHOOL_MAP_EMBED =
  "https://www.google.com/maps?q=Second+Avenue+Buruburu+Farm+Nairobi&output=embed";
const SCHOOL_MAP_LINK = "https://maps.app.goo.gl/ZDNMiqDn8jG8jEiY8";

function ContactPage() {
  const [status, setStatus] = useState<"idle" | "saving" | "ok" | "error">("idle");
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      phone: String(fd.get("phone") || "").trim() || null,
      subject: String(fd.get("subject") || "General inquiry"),
      category: String(fd.get("subject") || "General inquiry"),
      message: String(fd.get("message") || "").trim(),
    };
    if (!payload.name || !payload.email || !payload.message) {
      setErr("Please fill in your name, email and message.");
      return;
    }
    setStatus("saving");
    const { error } = await supabase.from("inquiries").insert(payload);
    if (error) { setStatus("error"); setErr(error.message); return; }
    setStatus("ok");
    (e.target as HTMLFormElement).reset();
  }

  return (
    <Layout>
      <PageHero
        eyebrow="Contact & Partnership"
        title="Let's build the future"
        accent="together."
        subtitle="Reach out for inquiries, partnerships, prayer requests or school admissions — we'd love to hear from you."
        image={img}
      />
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-[1.2fr,1fr] gap-6">
          <Reveal>
            <form onSubmit={onSubmit} className="rounded-3xl glass p-8 grid sm:grid-cols-2 gap-3">
              <input name="name" required className="rounded-xl bg-input/60 border border-border px-4 py-3 text-sm outline-none focus:ring-2 ring-primary/40" placeholder="Full name" />
              <input name="email" required type="email" className="rounded-xl bg-input/60 border border-border px-4 py-3 text-sm outline-none focus:ring-2 ring-primary/40" placeholder="Email" />
              <input name="phone" className="rounded-xl bg-input/60 border border-border px-4 py-3 text-sm outline-none focus:ring-2 ring-primary/40 sm:col-span-2" placeholder="Phone (optional)" />
              <select name="subject" defaultValue="General inquiry" className="rounded-xl bg-input/60 border border-border px-4 py-3 text-sm outline-none sm:col-span-2">
                <option>General inquiry</option>
                <option>Partner with the ministry</option>
                <option>Enquire about Halel School admissions</option>
                <option>Submit a prayer request</option>
                <option>Join a community program</option>
              </select>
              <textarea name="message" required rows={5} className="rounded-xl bg-input/60 border border-border px-4 py-3 text-sm outline-none sm:col-span-2" placeholder="Your message" />
              {err && <p className="sm:col-span-2 text-sm text-destructive">{err}</p>}
              {status === "ok" && <p className="sm:col-span-2 text-sm text-primary">Thanks — your message has been received. We'll reply within 24 hours.</p>}
              <button disabled={status === "saving"} className="sm:col-span-2 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground glow-gold disabled:opacity-60">
                {status === "saving" ? "Sending…" : "Send message"}
              </button>
              <div className="sm:col-span-2 mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>We typically reply within 24 hours.</span>
                <Link to="/auth" className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 hover:bg-muted">
                  <ShieldCheck className="h-3.5 w-3.5" /> Staff login
                </Link>
              </div>
            </form>
          </Reveal>

          <Reveal delay={120}>
            <div className="space-y-4">
              <a href={`tel:${CONTACT_PHONE}`} className="block glass rounded-2xl p-5 flex items-center gap-4 hover:bg-muted/40">
                <div className="h-11 w-11 grid place-items-center rounded-xl bg-primary/10 text-primary">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">Call — tap to dial</div>
                  <div className="font-semibold">{CONTACT_PHONE_DISPLAY}</div>
                </div>
              </a>
              <a href={CONTACT_WHATSAPP_URL} target="_blank" rel="noreferrer" className="block glass rounded-2xl p-5 flex items-center gap-4 hover:bg-muted/40">
                <div className="h-11 w-11 grid place-items-center rounded-xl bg-green-500/15 text-green-600">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">WhatsApp</div>
                  <div className="font-semibold">{CONTACT_PHONE_DISPLAY}</div>
                </div>
              </a>
              <div className="glass rounded-2xl p-5 flex items-center gap-4">
                <div className="h-11 w-11 grid place-items-center rounded-xl bg-primary/10 text-primary">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">Email</div>
                  <div className="font-semibold">hello@54globalafrikan.org</div>
                </div>
              </div>
              <a href={SCHOOL_MAP_LINK} target="_blank" rel="noreferrer" className="block glass rounded-2xl p-5 flex items-center gap-4 hover:bg-muted/40">
                <div className="h-11 w-11 grid place-items-center rounded-xl bg-primary/10 text-primary">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">Halel School · Visit</div>
                  <div className="font-semibold">Second Avenue, Buruburu Farm, Nairobi</div>
                  <div className="text-xs text-muted-foreground">Mon – Sat · Open on Google Maps →</div>
                </div>
              </a>
              <div className="rounded-2xl overflow-hidden glass">
                <iframe
                  title="Halel School Nairobi — Map"
                  src={SCHOOL_MAP_EMBED}
                  className="w-full h-72 border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </Layout>
  );
}
