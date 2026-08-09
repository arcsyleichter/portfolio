export const locales = ["hu", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "hu";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
