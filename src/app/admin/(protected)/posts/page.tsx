import Link from "next/link";
import { listAllPosts } from "@/lib/builder/store";
import { LogoutButton } from "@/components/admin/logout-button";

export default async function AdminPostsPage() {
  const posts = await listAllPosts();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold">Blogbejegyzések</h1>
          <p className="mt-1 text-sm text-muted-foreground">{posts.length} bejegyzés</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/posts/new"
            className="cursor-pointer rounded-full bg-gradient-brand px-4 py-2 text-sm font-semibold text-ink shadow-lg shadow-gold/20 transition-transform hover:scale-105"
          >
            + Új bejegyzés
          </Link>
          <LogoutButton />
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3">
        {posts.length === 0 && (
          <p className="rounded-2xl border border-border bg-card/60 p-6 text-sm text-muted-foreground">
            Még nincs egy bejegyzés sem — hozz létre egyet a fenti gombbal.
          </p>
        )}
        {posts.map((post) => (
          <Link
            key={`${post.locale}-${post.slug}`}
            href={`/admin/posts/${post.locale}/${post.slug}/edit`}
            className="group flex items-center justify-between gap-4 rounded-2xl border border-border bg-card/60 p-5 shadow-md shadow-black/10 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-lg hover:shadow-black/20"
          >
            <div className="min-w-0">
              <h2 className="truncate font-heading text-base font-semibold">{post.title || "(cím nélkül)"}</h2>
              <p className="mt-1 truncate text-sm text-muted-foreground">
                {post.locale.toUpperCase()} · /{post.slug}
              </p>
            </div>
            <span
              className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium ${
                post.status === "published"
                  ? "border-tech-blue/30 text-tech-blue-light"
                  : "border-border text-muted-foreground"
              }`}
            >
              {post.status === "published" ? "Publikálva" : "Piszkozat"}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
