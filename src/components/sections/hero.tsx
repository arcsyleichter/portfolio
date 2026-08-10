"use client";

import { motion } from "motion/react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { InteractiveSynapseNetwork } from "@/components/ui/interactive-synapse-network";

const titleContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.055, delayChildren: 0.15 } },
};

const titleWord = {
  hidden: { opacity: 0, y: 28, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export function Hero({ locale, dict, override }: { locale: Locale; dict: Dictionary; override?: Dictionary["hero"] }) {
  const h = override ?? dict.hero;

  return (
    <section className="section-dark relative isolate min-h-[560px] overflow-hidden bg-background px-4 pb-20 pt-16 text-foreground sm:min-h-[640px] sm:px-6 sm:pt-24 lg:min-h-[720px] lg:pt-28">
      <InteractiveSynapseNetwork
        className="absolute inset-0 -z-20"
        nodeColor="#d9a521"
        pulseColor="#faf8f5"
        connectionColor="#b8860b"
        backgroundColor="#1a1a1a"
        nodeCount={80}
        connectionRadius={170}
        trailOpacity={0.15}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-background/10 via-background/25 to-background/65"
      />

      <div className="relative mx-auto max-w-4xl text-center">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center rounded-full border border-border bg-card/60 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-sm"
        >
          {h.eyebrow.split(/(\bAI\b)/).map((part, i) =>
            part === "AI" ? (
              <span key={i} className="text-tech-blue-light">
                {part}
              </span>
            ) : (
              <span key={i}>{part}</span>
            ),
          )}
        </motion.span>

        <motion.h1
          initial="hidden"
          animate="show"
          variants={titleContainer}
          className="mt-6 text-4xl font-bold tracking-tight drop-shadow-sm sm:text-5xl lg:text-6xl"
        >
          {h.title1.split(" ").map((word, i) => (
            <motion.span key={`t1-${i}`} variants={titleWord} className="inline-block">
              {word}&nbsp;
            </motion.span>
          ))}
          <br />
          {h.title2.split(" ").map((word, i) => (
            <motion.span
              key={`t2-${i}`}
              variants={titleWord}
              className="inline-block text-gradient-brand"
            >
              {word}&nbsp;
            </motion.span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="mx-auto mt-6 max-w-xl text-base text-muted-foreground sm:text-lg"
        >
          {h.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <a
            href={`/${locale}#contact`}
            className="w-full cursor-pointer rounded-full bg-gradient-brand px-6 py-3 text-center text-sm font-semibold text-ink shadow-lg shadow-gold/25 transition-transform hover:scale-105 sm:w-auto"
          >
            {h.ctaPrimary}
          </a>
          <a
            href={`/${locale}#projects`}
            className="w-full cursor-pointer rounded-full border border-border bg-card/40 px-6 py-3 text-center text-sm font-semibold text-foreground backdrop-blur-sm transition-colors hover:bg-muted sm:w-auto"
          >
            {h.ctaSecondary}
          </a>
        </motion.div>

        <motion.dl
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.85 }}
          className="mx-auto mt-16 grid max-w-2xl grid-cols-3 gap-4 border-t border-border/60 pt-8"
        >
          {h.stats.map((stat) => (
            <div key={stat.label}>
              <dt className="sr-only">{stat.label}</dt>
              <dd className="font-heading text-2xl font-bold text-gradient-brand sm:text-3xl">
                {stat.value}
              </dd>
              <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{stat.label}</p>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
