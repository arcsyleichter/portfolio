"use client";

import { usePathname, useRouter } from "next/navigation";
import type { Locale } from "@/lib/i18n/config";
import { locales } from "@/lib/i18n/config";

function persistLocaleCookie(locale: Locale) {
  document.cookie = `NEXT_LOCALE=${locale};path=/;max-age=31536000`;
}

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const router = useRouter();

  function switchTo(next: Locale) {
    if (next === locale) return;
    const rest = pathname.split("/").slice(2).join("/");
    const nextPath = `/${next}${rest ? `/${rest}` : ""}`;
    persistLocaleCookie(next);
    router.push(nextPath);
  }

  return (
    <div className="flex items-center gap-1 rounded-full border border-border bg-card/60 p-1 text-xs font-medium">
      {locales.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => switchTo(code)}
          className={`cursor-pointer rounded-full px-2.5 py-1 uppercase transition-colors ${
            code === locale
              ? "bg-gradient-brand text-ink"
              : "text-muted-foreground hover:text-foreground"
          }`}
          aria-current={code === locale ? "true" : undefined}
        >
          {code}
        </button>
      ))}
    </div>
  );
}
