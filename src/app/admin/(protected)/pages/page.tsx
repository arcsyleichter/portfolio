import Link from "next/link";
import { listAllCustomPages } from "@/lib/builder/pages-store";
import { LogoutButton } from "@/components/admin/logout-button";
import { PagesList } from "@/components/admin/pages-list";

export default async function AdminPagesPage() {
  const pages = await listAllCustomPages();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold">Egyedi oldalak</h1>
          <p className="mt-1 text-sm text-muted-foreground">{pages.length} oldal</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/posts" className="text-sm text-muted-foreground hover:text-foreground">
            ← Bejegyzésekhez
          </Link>
          <Link href="/admin/site" className="text-sm text-muted-foreground hover:text-foreground">
            Főoldal szerkesztése →
          </Link>
          <Link
            href="/admin/pages/new"
            className="cursor-pointer rounded-full bg-gradient-brand px-4 py-2 text-sm font-semibold text-ink shadow-lg shadow-gold/20 transition-transform hover:scale-105"
          >
            + Új oldal
          </Link>
          <LogoutButton />
        </div>
      </div>

      <PagesList pages={pages} />
    </div>
  );
}
