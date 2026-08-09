"use client";

import { useRef, useState, type ChangeEvent } from "react";

export function ImageUploadField({
  blobKey,
  onUploaded,
}: {
  blobKey: string;
  onUploaded: (key: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/images", { method: "POST", body: formData });
      if (!res.ok) {
        setError("Feltöltés sikertelen.");
        return;
      }
      const { key } = (await res.json()) as { key: string };
      onUploaded(key);
    } catch {
      setError("Feltöltés sikertelen — hálózati hiba.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      {blobKey && (
        // eslint-disable-next-line @next/next/no-img-element -- admin thumbnail, dynamic Blobs-backed URL
        <img src={`/api/images/${blobKey}`} alt="" className="h-16 w-16 rounded-lg object-cover" />
      )}
      <div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="cursor-pointer rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
        >
          {uploading ? "Feltöltés..." : blobKey ? "Kép cseréje" : "Kép feltöltése"}
        </button>
        {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
