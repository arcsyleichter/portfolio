"use client";

import { useRef, useState, type ChangeEvent, type DragEvent } from "react";

const ALLOWED_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);

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
  const [dragOver, setDragOver] = useState(false);

  async function uploadFile(file: File) {
    if (!ALLOWED_TYPES.has(file.type)) {
      setError("Nem támogatott képformátum.");
      return;
    }

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

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (file) void uploadFile(file);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragOver(false);
    const file = event.dataTransfer.files?.[0];
    if (file) void uploadFile(file);
  }

  return (
    <div className="flex flex-1 items-center gap-3">
      {blobKey && (
        <div className="relative shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element -- admin thumbnail, dynamic Blobs-backed URL */}
          <img src={`/api/images/${blobKey}`} alt="" className="h-16 w-16 rounded-lg object-cover" />
          <button
            type="button"
            onClick={() => onUploaded("")}
            aria-label="Kép eltávolítása"
            title="Kép eltávolítása"
            className="absolute -top-1.5 -right-1.5 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-destructive text-[10px] leading-none text-white shadow"
          >
            ×
          </button>
        </div>
      )}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`flex-1 cursor-pointer rounded-lg border border-dashed px-3.5 py-2.5 text-center text-xs transition-colors ${
          dragOver ? "border-gold bg-gold/10 text-foreground" : "border-border text-muted-foreground hover:bg-muted"
        }`}
      >
        {uploading ? "Feltöltés…" : blobKey ? "Kép cseréje — kattints vagy húzd ide" : "Kattints vagy húzz ide egy képet"}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
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
