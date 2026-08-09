"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setError(res.status === 401 ? "Hibás jelszó." : "Hiba történt — próbáld újra.");
        setSubmitting(false);
        return;
      }
      router.push("/admin/posts");
      router.refresh();
    } catch {
      setError("Hiba történt — próbáld újra.");
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-border bg-card/60 p-8 shadow-md shadow-black/10"
      >
        <h1 className="font-heading text-xl font-semibold">Admin belépés</h1>
        <p className="mt-1 text-sm text-muted-foreground">Arcsy Design Studio — blog-szerkesztő</p>

        <label htmlFor="password" className="mt-6 block text-sm font-medium">
          Jelszó
        </label>
        <input
          id="password"
          type="password"
          autoFocus
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-border bg-card/60 px-3.5 py-2.5 text-sm outline-none focus:border-gold"
        />

        {error && (
          <p className="mt-3 text-sm text-destructive" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-6 w-full cursor-pointer rounded-full bg-gradient-brand px-6 py-3 text-sm font-semibold text-ink shadow-lg shadow-gold/20 transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Belépés..." : "Belépés"}
        </button>
      </form>
    </div>
  );
}
