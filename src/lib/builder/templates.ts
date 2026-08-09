import type {
  Block,
  ButtonBlock,
  ColumnsBlock,
  HeadingBlock,
  ImageBlock,
  RichTextBlock,
  SpacerBlock,
} from "./types";

function uid(): string {
  return crypto.randomUUID();
}

function paragraphDoc(text: string) {
  return {
    type: "doc",
    content: text
      .split("\n\n")
      .filter(Boolean)
      .map((paragraph) => ({ type: "paragraph", content: [{ type: "text", text: paragraph }] })),
  };
}

function heading(
  text: string,
  level: HeadingBlock["content"]["level"] = "h2",
  style: Partial<HeadingBlock["style"]> = {},
): HeadingBlock {
  return {
    id: uid(),
    type: "heading",
    content: { text, level },
    style: { align: "left", gradientText: false, spacing: "md", ...style },
  };
}

function richtext(text: string, style: Partial<RichTextBlock["style"]> = {}): RichTextBlock {
  return {
    id: uid(),
    type: "richtext",
    content: { doc: paragraphDoc(text) },
    style: { maxWidth: "prose", align: "left", ...style },
  };
}

function image(alt: string, style: Partial<ImageBlock["style"]> = {}): ImageBlock {
  return {
    id: uid(),
    type: "image",
    content: { blobKey: "", alt },
    style: { radius: "xl", maxWidth: "content", align: "center", ...style },
  };
}

function button(label: string, href = "#", style: Partial<ButtonBlock["style"]> = {}): ButtonBlock {
  return {
    id: uid(),
    type: "button",
    content: { label, href },
    style: { variant: "primary", align: "left", ...style },
  };
}

function spacer(height: SpacerBlock["style"]["height"] = "md"): SpacerBlock {
  return { id: uid(), type: "spacer", content: {}, style: { height } };
}

function columns(
  ratio: ColumnsBlock["style"]["ratio"],
  cols: Block[][],
  gap: ColumnsBlock["style"]["gap"] = "md",
): ColumnsBlock {
  return { id: uid(), type: "columns", content: { columns: cols }, style: { ratio, gap } };
}

export interface BlogTemplate {
  id: string;
  name: string;
  description: string;
  blocks: () => Block[];
}

export const BLOG_TEMPLATES: BlogTemplate[] = [
  {
    id: "blank",
    name: "Üres bejegyzés",
    description: "Tiszta lap — minden blokkot magad építesz fel.",
    blocks: () => [],
  },
  {
    id: "simple-article",
    name: "Egyszerű cikk",
    description: "Cím, bevezető és folyó szöveg — a legtöbb bejegyzéshez ez elég.",
    blocks: () => [
      heading("A cikk címe", "h1"),
      richtext(
        "Ez a bevezető bekezdés. Foglald össze pár mondatban, miről szól a cikk, hogy az olvasó eldönthesse, folytatja-e.",
      ),
      richtext("Itt folytatódik a cikk fő szövege — cseréld ki a saját tartalmadra."),
    ],
  },
  {
    id: "case-study",
    name: "Esettanulmány / Projekt bemutató",
    description: "Hero cím, borítókép, majd a kihívás és a megoldás egymás mellett, záró CTA-val.",
    blocks: () => [
      heading("Projekt neve", "h1"),
      richtext("Rövid egy mondatos összefoglaló arról, mit oldott meg ez a projekt az ügyfélnek."),
      image("Projekt borítóképe"),
      columns("50/50", [
        [heading("A kihívás", "h3"), richtext("Mi volt a probléma, amivel az ügyfél hozzánk fordult?")],
        [heading("A megoldás", "h3"), richtext("Hogyan oldottuk meg — milyen eszközökkel, milyen megközelítéssel?")],
      ]),
      button("Élő oldal megtekintése", "#"),
    ],
  },
  {
    id: "tutorial-steps",
    name: "Lépésről lépésre útmutató",
    description: "Bevezető, majd négy számozott lépés, mindegyik saját címmel és leírással.",
    blocks: () => [
      heading("Útmutató címe", "h1"),
      richtext("Mit fog megtanulni az olvasó, és mennyi idő alatt éri el az eredményt?"),
      heading("1. lépés — a lépés neve", "h3"),
      richtext("Írd le részletesen, mit kell csinálni ebben a lépésben."),
      heading("2. lépés — a lépés neve", "h3"),
      richtext("Írd le részletesen, mit kell csinálni ebben a lépésben."),
      heading("3. lépés — a lépés neve", "h3"),
      richtext("Írd le részletesen, mit kell csinálni ebben a lépésben."),
      heading("4. lépés — a lépés neve", "h3"),
      richtext("Írd le részletesen, mit kell csinálni ebben a lépésben."),
    ],
  },
  {
    id: "comparison",
    name: "Összehasonlítás",
    description: "Két opció egymás mellett — jó döntési útmutatókhoz vagy termékösszevetéshez.",
    blocks: () => [
      heading("Melyiket válaszd?", "h1"),
      richtext("Röviden vezesd fel, mi a két opció, és miért érdemes összehasonlítani őket."),
      columns("50/50", [
        [heading("A opció", "h3"), richtext("Az A opció előnyei és mikor érdemes ezt választani.")],
        [heading("B opció", "h3"), richtext("A B opció előnyei és mikor érdemes ezt választani.")],
      ]),
      richtext("Összegzés: melyik opciót ajánljuk, és miért."),
    ],
  },
  {
    id: "interview-qa",
    name: "Interjú / Kérdés-válasz",
    description: "Bevezető, majd ismétlődő kérdés–válasz párok.",
    blocks: () => [
      heading("Interjú címe", "h1"),
      richtext("Kivel készült az interjú, és miről szól röviden?"),
      heading("Első kérdés?", "h4"),
      richtext("A válasz szövege ide kerül."),
      heading("Második kérdés?", "h4"),
      richtext("A válasz szövege ide kerül."),
      heading("Harmadik kérdés?", "h4"),
      richtext("A válasz szövege ide kerül."),
    ],
  },
  {
    id: "product-showcase",
    name: "Termék / szolgáltatás bemutató",
    description: "Borítókép, majd három funkciót bemutató oszlop.",
    blocks: () => [
      heading("Termék vagy szolgáltatás neve", "h1"),
      richtext("Egy-két mondatos összefoglaló arról, mit kínál és kinek szól."),
      image("Termékfotó vagy képernyőkép"),
      columns("33/33/33", [
        [heading("Funkció 1", "h4"), richtext("Rövid leírás.")],
        [heading("Funkció 2", "h4"), richtext("Rövid leírás.")],
        [heading("Funkció 3", "h4"), richtext("Rövid leírás.")],
      ]),
      button("Kipróbálom", "#"),
    ],
  },
  {
    id: "top-list",
    name: "Top lista",
    description: "Bevezető, majd öt számozott listaelem címmel és magyarázattal.",
    blocks: () => [
      heading("Top 5 — a lista címe", "h1"),
      richtext("Miért pont ez az öt, és kinek szól ez a lista?"),
      heading("1. tétel neve", "h3"),
      richtext("Miért került fel a listára, és mit érdemes tudni róla."),
      heading("2. tétel neve", "h3"),
      richtext("Miért került fel a listára, és mit érdemes tudni róla."),
      heading("3. tétel neve", "h3"),
      richtext("Miért került fel a listára, és mit érdemes tudni róla."),
      heading("4. tétel neve", "h3"),
      richtext("Miért került fel a listára, és mit érdemes tudni róla."),
      heading("5. tétel neve", "h3"),
      richtext("Miért került fel a listára, és mit érdemes tudni róla."),
    ],
  },
  {
    id: "announcement",
    name: "Bejelentés / Hír",
    description: "Rövid, ütős bejelentés egy záró cselekvésre hívó gombbal.",
    blocks: () => [
      heading("A bejelentés címe", "h1"),
      richtext("Mi történt, mikortól érvényes, és mit jelent ez az olvasónak?"),
      button("Tudj meg többet", "#"),
    ],
  },
  {
    id: "quote-highlight",
    name: "Idézet kiemelő",
    description: "Egy nagy, kiemelt idézet a forrás megjelölésével.",
    blocks: () => [
      heading("„Ide kerül a kiemelt idézet szövege.”", "h2", { align: "center", gradientText: true }),
      richtext("— az idézet forrása, beosztása", { align: "center" }),
    ],
  },
  {
    id: "gallery",
    name: "Galéria bemutató",
    description: "Több kép egymás alatt, mindegyik saját rövid leírással.",
    blocks: () => [
      heading("Galéria címe", "h1"),
      richtext("Röviden vezesd fel, mit mutat ez a galéria."),
      image("Első kép leírása"),
      richtext("Rövid magyarázat az első képhez."),
      spacer("sm"),
      image("Második kép leírása"),
      richtext("Rövid magyarázat a második képhez."),
      spacer("sm"),
      image("Harmadik kép leírása"),
      richtext("Rövid magyarázat a harmadik képhez."),
    ],
  },
  {
    id: "faq",
    name: "Gyakori kérdések",
    description: "Négy kérdés-válasz pár — jó egy termék vagy szolgáltatás aljára.",
    blocks: () => [
      heading("Gyakori kérdések", "h1"),
      heading("Első gyakori kérdés?", "h4"),
      richtext("A válasz szövege."),
      heading("Második gyakori kérdés?", "h4"),
      richtext("A válasz szövege."),
      heading("Harmadik gyakori kérdés?", "h4"),
      richtext("A válasz szövege."),
      heading("Negyedik gyakori kérdés?", "h4"),
      richtext("A válasz szövege."),
    ],
  },
  {
    id: "stats-highlight",
    name: "Számok / statisztika sáv",
    description: "Három kiemelt szám egymás mellett, rövid címkével.",
    blocks: () => [
      heading("Számokban", "h1"),
      columns("33/33/33", [
        [heading("100+", "h2", { align: "center", gradientText: true }), richtext("elkészült projekt", { align: "center" })],
        [heading("15", "h2", { align: "center", gradientText: true }), richtext("év tapasztalat", { align: "center" })],
        [heading("98%", "h2", { align: "center", gradientText: true }), richtext("elégedett ügyfél", { align: "center" })],
      ]),
    ],
  },
  {
    id: "before-after",
    name: "Előtte / Utána",
    description: "Két oszlop kép + szöveg — jó redesign vagy fejlesztés bemutatásához.",
    blocks: () => [
      heading("Előtte és utána", "h1"),
      columns("50/50", [
        [heading("Előtte", "h3"), image("Az eredeti állapot"), richtext("Mi volt a helyzet korábban?")],
        [heading("Utána", "h3"), image("Az új állapot"), richtext("Mi változott, és milyen eredményt hozott?")],
      ]),
    ],
  },
  {
    id: "cta-landing",
    name: "CTA-fókuszú bejegyzés",
    description: "Minimál, egyetlen cselekvésre hívó gombra kihegyezett elrendezés.",
    blocks: () => [
      heading("A fő üzenet, amit el akarsz mondani", "h1", { align: "center" }),
      richtext("Egy rövid, meggyőző alcím-mondat, ami alátámasztja a fenti címet.", { align: "center" }),
      button("Cselekvésre hívás", "#", { align: "center" }),
    ],
  },
  {
    id: "team-about",
    name: "Csapat / Bemutatkozás",
    description: "Portré vagy csapatkép a bemutatkozó szöveg mellett.",
    blocks: () => [
      heading("Ismerd meg...", "h1"),
      columns("50/50", [
        [image("Portré vagy csapatkép")],
        [richtext("A bemutatkozó szöveg — ki ő, mivel foglalkozik, és miért érdemes olvasni tőle.")],
      ]),
    ],
  },
  {
    id: "technical-deepdive",
    name: "Technikai mélymerülés",
    description: "Hosszabb, alcímekkel tagolt technikai cikk.",
    blocks: () => [
      heading("A technikai cikk címe", "h1"),
      richtext("Mi a probléma vagy téma, amit ez a cikk körüljár, és kinek szól?"),
      heading("A háttér", "h3"),
      richtext("Milyen kontextus kell a megértéshez?"),
      heading("A megközelítés", "h3"),
      richtext("Hogyan álltunk neki, milyen alternatívákat mérlegeltünk?"),
      heading("Az eredmény", "h3"),
      richtext("Mire jutottunk, és mit érdemes ebből másoknak is elvinni?"),
    ],
  },
  {
    id: "checklist",
    name: "Ellenőrzőlista",
    description: "Bevezető, majd rövid, pipálható tételek egymás alatt.",
    blocks: () => [
      heading("Ellenőrzőlista címe", "h1"),
      richtext("Mire való ez a lista, és mikor érdemes végigmenni rajta?"),
      richtext("✓ Első tétel — rövid magyarázat."),
      richtext("✓ Második tétel — rövid magyarázat."),
      richtext("✓ Harmadik tétel — rövid magyarázat."),
      richtext("✓ Negyedik tétel — rövid magyarázat."),
      richtext("✓ Ötödik tétel — rövid magyarázat."),
    ],
  },
  {
    id: "client-story",
    name: "Ügyféltörténet",
    description: "Kiemelt idézet, kép és mérhető eredmény egymás mellett.",
    blocks: () => [
      heading("Ügyfél neve — az eredmény röviden", "h1"),
      columns("60/40", [
        [
          heading("„Ide kerül az ügyfél idézete a tapasztalatáról.”", "h3"),
          richtext("— az ügyfél neve, cég/beosztás"),
        ],
        [image("Az ügyfél vagy a cég logója"), richtext("Fő mérhető eredmény, egy mondatban.")],
      ]),
    ],
  },
  {
    id: "event-recap",
    name: "Esemény összefoglaló",
    description: "Dátum, helyszín, borítókép és utólagos összefoglaló.",
    blocks: () => [
      heading("Az esemény neve", "h1"),
      richtext("Dátum, helyszín — röviden."),
      image("Kép az eseményről"),
      richtext("Mi történt az eseményen, és mi volt a legfontosabb tanulság vagy pillanat?"),
    ],
  },
  {
    id: "minimal-personal",
    name: "Minimalista, személyes bejegyzés",
    description: "Csak cím és hosszú szöveg — semmi extra, a szövegre helyezi a hangsúlyt.",
    blocks: () => [heading("A bejegyzés címe", "h1"), richtext("Itt kezdődik a szöveg — írj bátran, ahogy esik.")],
  },
];
