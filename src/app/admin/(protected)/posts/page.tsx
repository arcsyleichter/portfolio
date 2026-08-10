import Link from "next/link";
import { listAllPosts } from "@/lib/builder/store";
import { LogoutButton } from "@/components/admin/logout-button";
import { PostsList } from "@/components/admin/posts-list";

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
            href="/admin/site"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Főoldal szerkesztése →
          </Link>
          <Link
            href="/admin/posts/new"
            className="cursor-pointer rounded-full bg-gradient-brand px-4 py-2 text-sm font-semibold text-ink shadow-lg shadow-gold/20 transition-transform hover:scale-105"
          >
            + Új bejegyzés
          </Link>
          <LogoutButton />
        </div>
      </div>

      <PostsList posts={posts} />
    </div>
  );
}
