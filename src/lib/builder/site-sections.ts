import type { SectionSchema } from "./site-content-schema";

export const SITE_SECTION_SCHEMAS: SectionSchema[] = [
  {
    key: "hero",
    label: "Hero",
    fields: [
      { key: "eyebrow", label: "Felirat", field: { kind: "string" } },
      { key: "title1", label: "Cím 1. sor", field: { kind: "string" } },
      { key: "title2", label: "Cím 2. sor", field: { kind: "string" } },
      { key: "subtitle", label: "Alcím", field: { kind: "text" } },
      { key: "ctaPrimary", label: "Fő gomb szövege", field: { kind: "string" } },
      { key: "ctaSecondary", label: "Másodlagos gomb szövege", field: { kind: "string" } },
      {
        key: "stats",
        label: "Statisztikák",
        field: {
          kind: "objectArray",
          itemLabel: "Statisztika",
          fields: [
            { key: "value", label: "Érték", field: { kind: "string" } },
            { key: "label", label: "Felirat", field: { kind: "text" } },
          ],
        },
      },
    ],
  },
  {
    key: "about",
    label: "Rólam",
    fields: [
      { key: "eyebrow", label: "Felirat", field: { kind: "string" } },
      { key: "title", label: "Cím", field: { kind: "string" } },
      { key: "paragraphs", label: "Bekezdések", field: { kind: "stringArray", itemLabel: "Bekezdés", maxLength: 500 } },
      { key: "highlights", label: "Kiemelések", field: { kind: "stringArray", itemLabel: "Kiemelés", maxLength: 200 } },
    ],
  },
  {
    key: "services",
    label: "Szolgáltatások",
    fields: [
      { key: "eyebrow", label: "Felirat", field: { kind: "string" } },
      { key: "title", label: "Cím", field: { kind: "string" } },
      { key: "subtitle", label: "Alcím", field: { kind: "text" } },
      {
        key: "items",
        label: "Szolgáltatások",
        field: {
          kind: "objectArray",
          itemLabel: "Szolgáltatás",
          fields: [
            { key: "title", label: "Cím", field: { kind: "string" } },
            { key: "description", label: "Leírás", field: { kind: "text" } },
            { key: "tags", label: "Címkék", field: { kind: "stringArray", itemLabel: "Címke", maxLength: 40 } },
          ],
        },
      },
    ],
  },
  {
    key: "projects",
    label: "Projektek",
    fields: [
      { key: "eyebrow", label: "Felirat", field: { kind: "string" } },
      { key: "title", label: "Cím", field: { kind: "string" } },
      { key: "subtitle", label: "Alcím", field: { kind: "text" } },
      { key: "liveBadge", label: "\"Éles\" jelvény szövege", field: { kind: "string" } },
      { key: "demoBadge", label: "\"Demo\" jelvény szövege", field: { kind: "string" } },
      { key: "demoNote", label: "Demó-megjegyzés", field: { kind: "text" } },
      { key: "cta", label: "Gomb szövege (nem használt)", field: { kind: "string" } },
      {
        key: "items",
        label: "Projektek",
        field: {
          kind: "objectArray",
          itemLabel: "Projekt",
          fields: [
            { key: "id", label: "Azonosító (nem szerkeszthető)", field: { kind: "readonly" } },
            {
              key: "kind",
              label: "Típus",
              field: {
                kind: "select",
                options: [
                  { value: "live", label: "Éles" },
                  { value: "demo", label: "Demo / koncepció" },
                ],
              },
            },
            { key: "title", label: "Cím", field: { kind: "string" } },
            { key: "summary", label: "Összefoglaló", field: { kind: "text" } },
            { key: "tags", label: "Címkék", field: { kind: "stringArray", itemLabel: "Címke", maxLength: 40 } },
          ],
        },
      },
    ],
  },
  {
    key: "styleShowcase",
    label: "Stílusok",
    fields: [
      { key: "eyebrow", label: "Felirat", field: { kind: "string" } },
      { key: "title", label: "Cím", field: { kind: "string" } },
      { key: "subtitle", label: "Alcím", field: { kind: "text" } },
      {
        key: "styles",
        label: "Stílusok",
        field: {
          kind: "objectArray",
          itemLabel: "Stílus",
          fields: [
            { key: "id", label: "Azonosító (nem szerkeszthető)", field: { kind: "readonly" } },
            { key: "name", label: "Név", field: { kind: "string" } },
            { key: "audience", label: "Célközönség", field: { kind: "string" } },
          ],
        },
      },
    ],
  },
  {
    key: "process",
    label: "Munkafolyamat",
    fields: [
      { key: "eyebrow", label: "Felirat", field: { kind: "string" } },
      { key: "title", label: "Cím", field: { kind: "string" } },
      {
        key: "steps",
        label: "Lépések",
        field: {
          kind: "objectArray",
          itemLabel: "Lépés",
          fields: [
            { key: "title", label: "Cím", field: { kind: "string" } },
            { key: "description", label: "Leírás", field: { kind: "text" } },
          ],
        },
      },
    ],
  },
  {
    key: "tech",
    label: "Technológiák",
    fields: [
      { key: "eyebrow", label: "Felirat", field: { kind: "string" } },
      { key: "title", label: "Cím", field: { kind: "string" } },
      {
        key: "categories",
        label: "Kategóriák",
        field: {
          kind: "objectArray",
          itemLabel: "Kategória",
          fields: [
            { key: "name", label: "Név", field: { kind: "string" } },
            { key: "items", label: "Elemek", field: { kind: "stringArray", itemLabel: "Elem", maxLength: 60 } },
          ],
        },
      },
    ],
  },
  {
    key: "testimonials",
    label: "Vélemények",
    fields: [
      { key: "eyebrow", label: "Felirat", field: { kind: "string" } },
      { key: "title", label: "Cím", field: { kind: "string" } },
      { key: "comingSoon", label: "Placeholder szöveg", field: { kind: "text" } },
    ],
  },
  {
    key: "pricing",
    label: "Árazás",
    fields: [
      { key: "eyebrow", label: "Felirat", field: { kind: "string" } },
      { key: "title", label: "Cím", field: { kind: "string" } },
      { key: "subtitle", label: "Alcím", field: { kind: "text" } },
      { key: "cta", label: "Gomb szövege", field: { kind: "string" } },
      { key: "customNote", label: "Záró megjegyzés", field: { kind: "text" } },
      {
        key: "tiers",
        label: "Csomagok",
        field: {
          kind: "objectArray",
          itemLabel: "Csomag",
          fields: [
            { key: "name", label: "Név", field: { kind: "string" } },
            { key: "description", label: "Leírás", field: { kind: "text" } },
            { key: "features", label: "Jellemzők", field: { kind: "stringArray", itemLabel: "Jellemző", maxLength: 100 } },
            { key: "highlighted", label: "Kiemelt csomag", field: { kind: "boolean" } },
          ],
        },
      },
    ],
  },
  {
    key: "contact",
    label: "Kapcsolat",
    fields: [
      { key: "eyebrow", label: "Felirat", field: { kind: "string" } },
      { key: "title", label: "Cím", field: { kind: "string" } },
      { key: "subtitle", label: "Alcím", field: { kind: "text" } },
      { key: "formName", label: "\"Név\" mező címkéje", field: { kind: "string" } },
      { key: "formEmail", label: "\"E-mail\" mező címkéje", field: { kind: "string" } },
      { key: "formCompany", label: "\"Cég\" mező címkéje", field: { kind: "string" } },
      { key: "formMessage", label: "\"Üzenet\" mező címkéje", field: { kind: "string" } },
      { key: "formSubmit", label: "Küldés gomb szövege", field: { kind: "string" } },
      { key: "formSending", label: "Küldés közben szöveg", field: { kind: "string" } },
      { key: "formSuccess", label: "Siker-üzenet", field: { kind: "text" } },
      { key: "formError", label: "Hiba-üzenet", field: { kind: "text" } },
      { key: "directTitle", label: "\"Vagy közvetlenül\" cím", field: { kind: "string" } },
      { key: "emailLabel", label: "E-mail címke (nem használt)", field: { kind: "string" } },
    ],
  },
];

export function getSectionSchema(key: string) {
  return SITE_SECTION_SCHEMAS.find((s) => s.key === key);
}
