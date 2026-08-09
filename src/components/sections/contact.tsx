"use client";

import { useState, type FormEvent } from "react";
import { Mail } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { siteConfig } from "@/lib/site-config";
import { Reveal } from "@/components/motion/reveal";
import { InteractiveSynapseNetwork } from "@/components/ui/interactive-synapse-network";
import { GradientBackground } from "@/components/ui/gradient-background";

type Status = "idle" | "sending" | "success" | "error";

export function Contact({ dict }: { dict: Dictionary }) {
  const c = dict.contact;
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");

    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("request failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <section
      id="contact"
      className="section-dark relative isolate bg-background px-4 py-20 text-foreground sm:px-6 lg:py-28"
    >
      <GradientBackground tone="dark" className="absolute inset-0 -z-10" />
      <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-5 lg:gap-16">
        <Reveal className="lg:col-span-2">
          <InteractiveSynapseNetwork
            className="h-24 w-24 rounded-full"
            nodeColor="#d9a521"
            pulseColor="#faf8f5"
            connectionColor="#b8860b"
            backgroundColor="#1a1a1a"
            nodeCount={12}
            connectionRadius={40}
            trailOpacity={0.18}
          />
          <span className="text-xs font-semibold uppercase tracking-widest text-accent-text">
            {c.eyebrow}
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{c.title}</h2>
          <p className="mt-4 text-muted-foreground">{c.subtitle}</p>

          <div className="mt-8 rounded-2xl border border-border bg-card/60 p-5 shadow-md shadow-black/10 transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-lg hover:shadow-black/20">
            <h3 className="text-sm font-semibold text-muted-foreground">{c.directTitle}</h3>
            <a
              href={`mailto:${siteConfig.contactEmail}`}
              className="mt-2 flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-accent-text"
            >
              <Mail className="h-4 w-4 text-accent-text" />
              {siteConfig.contactEmail}
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.15} className="lg:col-span-3">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="text-sm font-medium">
                  {c.formName}
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="mt-1.5 w-full rounded-lg border border-border bg-card/60 px-3.5 py-2.5 text-sm outline-none focus:border-gold"
                />
              </div>
              <div>
                <label htmlFor="email" className="text-sm font-medium">
                  {c.formEmail}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="mt-1.5 w-full rounded-lg border border-border bg-card/60 px-3.5 py-2.5 text-sm outline-none focus:border-gold"
                />
              </div>
            </div>

            <div>
              <label htmlFor="company" className="text-sm font-medium">
                {c.formCompany}
              </label>
              <input
                id="company"
                name="company"
                type="text"
                className="mt-1.5 w-full rounded-lg border border-border bg-card/60 px-3.5 py-2.5 text-sm outline-none focus:border-gold"
              />
            </div>

            <div>
              <label htmlFor="message" className="text-sm font-medium">
                {c.formMessage}
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                className="mt-1.5 w-full rounded-lg border border-border bg-card/60 px-3.5 py-2.5 text-sm outline-none focus:border-gold"
              />
            </div>

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full cursor-pointer rounded-full bg-gradient-brand px-6 py-3 text-sm font-semibold text-ink shadow-lg shadow-gold/20 transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {status === "sending" ? c.formSending : c.formSubmit}
            </button>

            {status === "success" && (
              <p className="text-sm text-accent-text" role="status">
                {c.formSuccess}
              </p>
            )}
            {status === "error" && (
              <p className="text-sm text-destructive" role="alert">
                {c.formError}
              </p>
            )}
          </form>
        </Reveal>
      </div>
    </section>
  );
}
