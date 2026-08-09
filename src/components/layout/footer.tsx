import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { GradientBackground } from "@/components/ui/gradient-background";
import { HomeLink } from "./home-link";

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <footer className="section-dark relative isolate border-t border-border/60 bg-background text-foreground">
      <GradientBackground tone="dark" className="absolute inset-0 -z-10" />
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div>
          <HomeLink locale={locale} />
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">{dict.footer.tagline}</p>
        </div>

        <div className="flex flex-col gap-2 text-sm text-muted-foreground md:items-end">
          <span>
            &copy; {new Date().getFullYear()} Áron Leichter — {dict.footer.rights}
          </span>
          <span>{dict.footer.madeWith}</span>
        </div>
      </div>
    </footer>
  );
}
