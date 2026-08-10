"use client";

import { useState } from "react";
import type { FieldDef } from "@/lib/builder/site-content-schema";
import type { SectionSchema } from "@/lib/builder/site-content-schema";

const FIELD_CLASS =
  "w-full rounded-lg border border-border bg-background/40 px-3.5 py-2.5 text-sm outline-none focus:border-gold";

function FieldEditor({
  def,
  value,
  onChange,
}: {
  def: FieldDef;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const { field, label } = def;

  switch (field.kind) {
    case "string":
      return (
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          {label}
          <input
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
            maxLength={field.maxLength}
            className={FIELD_CLASS}
          />
        </label>
      );

    case "text":
      return (
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          {label}
          <textarea
            rows={3}
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
            maxLength={field.maxLength}
            className={FIELD_CLASS}
          />
        </label>
      );

    case "boolean":
      return (
        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => onChange(e.target.checked)}
            className="h-4 w-4 accent-gold"
          />
          {label}
        </label>
      );

    case "select":
      return (
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          {label}
          <select
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
            className={`${FIELD_CLASS} sm:w-48`}
          >
            {field.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      );

    case "readonly":
      return (
        <div className="flex flex-col gap-1.5 text-sm font-medium text-muted-foreground">
          {label}
          <p className="rounded-lg border border-dashed border-border bg-background/20 px-3.5 py-2.5 text-sm">
            {String(value ?? "")}
          </p>
        </div>
      );

    case "stringArray": {
      const arr = Array.isArray(value) ? (value as string[]) : [];
      return (
        <div className="flex flex-col gap-1.5 text-sm font-medium">
          {label}
          <div className="flex flex-col gap-2">
            {arr.map((item, i) => (
              <input
                key={i}
                value={item}
                onChange={(e) => {
                  const next = [...arr];
                  next[i] = e.target.value;
                  onChange(next);
                }}
                maxLength={field.maxLength}
                placeholder={`${field.itemLabel} ${i + 1}`}
                className={FIELD_CLASS}
              />
            ))}
          </div>
        </div>
      );
    }

    case "objectArray": {
      const arr = Array.isArray(value) ? (value as Record<string, unknown>[]) : [];
      return (
        <div className="flex flex-col gap-2 text-sm font-medium">
          {label}
          <div className="flex flex-col gap-3">
            {arr.map((item, i) => (
              <div key={i} className="flex flex-col gap-3 rounded-xl border border-border bg-background/20 p-3">
                <p className="text-xs font-semibold text-muted-foreground">
                  {field.itemLabel} {i + 1}
                </p>
                {field.fields.map((sub) => (
                  <FieldEditor
                    key={sub.key}
                    def={sub}
                    value={item[sub.key]}
                    onChange={(v) => {
                      const next = [...arr];
                      next[i] = { ...next[i], [sub.key]: v };
                      onChange(next);
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      );
    }
  }
}

export function SiteSectionForm({
  schema,
  initialContent,
  onSave,
}: {
  schema: SectionSchema;
  initialContent: Record<string, unknown>;
  onSave: (content: Record<string, unknown>) => Promise<void>;
}) {
  const [content, setContent] = useState(initialContent);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  function setField(key: string, value: unknown) {
    setContent((c) => ({ ...c, [key]: value }));
    setDirty(true);
    setSavedMessage(null);
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      await onSave(content);
      setDirty(false);
      setSavedMessage("Mentve.");
    } catch {
      setError("Mentés sikertelen.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-5">
        {schema.fields.map((f) => (
          <FieldEditor key={f.key} def={f} value={content[f.key]} onChange={(v) => setField(f.key, v)} />
        ))}
      </div>

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
      {savedMessage && !dirty && <p className="text-sm text-tech-blue-light">{savedMessage}</p>}

      <button
        type="button"
        onClick={handleSave}
        disabled={saving || !dirty}
        className="self-start cursor-pointer rounded-full bg-gradient-brand px-6 py-2.5 text-sm font-semibold text-ink shadow-lg shadow-gold/20 transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {saving ? "Mentés…" : "Mentés"}
      </button>
    </div>
  );
}
