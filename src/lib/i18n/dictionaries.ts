import type { Locale } from "./config";
import hu from "./dictionaries/hu.json";
import en from "./dictionaries/en.json";

const dictionaries = { hu, en } satisfies Record<Locale, typeof hu>;

export type Dictionary = typeof hu;

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries.hu;
}
