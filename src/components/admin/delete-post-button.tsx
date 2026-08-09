"use client";

import { useState, type MouseEvent } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/i18n/config";

export function DeletePostButton({
  locale,
  slug,
  title,
  variant = "icon",
  redirectAfter,
}: {
  locale: Locale;
  slug: string;
  title: string;
  variant?: "icon" | "full";
  redirectAfter?: string;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    const label = title || "(cím nélkül)";
    if (!window.confirm(`Biztosan törlöd a(z) "${label}" bejegyzést? Ez nem vonható vissza.`)) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/posts/${locale}/${slug}`, { method: "DELETE" });
      if (!res.ok) {
        window.alert("Törlés sikertelen.");
        setDeleting(false);
        return;
      }
      if (redirectAfter) {
        router.push(redirectAfter);
      } else {
        router.refresh();
      }
    } catch {
      window.alert("Törlés sikertelen — hálózati hiba.");
      setDeleting(false);
    }
  }

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
        aria-label={`${title || "Bejegyzés"} törlése`}
        title="Törlés"
        className="shrink-0 cursor-pointer rounded-full border border-transparent p-2 text-muted-foreground transition-colors hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive disabled:cursor-not-allowed disabled:opacity-50"
      >
        {deleting ? (
          <span className="block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-4 w-4">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 7h16M9 7V4.8c0-.44.36-.8.8-.8h4.4c.44 0 .8.36.8.8V7m-9 0 .7 12.15A2 2 0 0 0 8.7 21h6.6a2 2 0 0 0 2-1.85L18 7"
            />
          </svg>
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={deleting}
      className="cursor-pointer rounded-full border border-destructive/40 px-4 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {deleting ? "Törlés..." : "Bejegyzés törlése"}
    </button>
  );
}
