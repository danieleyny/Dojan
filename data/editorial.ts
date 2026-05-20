/**
 * /watch — combat-media reviews
 * /israel-in-combat — long-form stories
 *
 * Schema mirrors `content_pages` from the spec. Seed content is intentionally
 * placeholder-flavored so the user can replace it with real editorial copy
 * before launch.
 */

export interface EditorialPost {
  slug: string;
  type: "media_review" | "story";
  hero_image: string;
  // Locale-keyed maps. Missing locales fall back to en → he via the helper.
  title: Partial<Record<"he" | "en" | "ar" | "es" | "fr", string>>;
  excerpt: Partial<Record<"he" | "en" | "ar" | "es" | "fr", string>>;
  body: Partial<Record<"he" | "en", string>>; // long-form, only HE + EN at seed time
  author: string;
  author_role_he?: string;
  author_role_en?: string;
  published_at: string;
  reading_minutes: number;
  related_disciplines: string[];
  related_gyms: string[];
  related_coaches: string[];
  related_techniques: string[];
  // For media_review only
  media?: {
    kind: "movie" | "tv" | "fight" | "documentary";
    name: string;
    year?: number;
    youtube_id?: string;
  };
}

export const watchPosts: EditorialPost[] = [
  {
    slug: "warrior-2011-bjj-credibility",
    type: "media_review",
    hero_image: "https://images.unsplash.com/photo-1517438476312-10d79c5f25af?w=1600&q=70&auto=format&fit=crop",
    title: {
      he: "Warrior (2011) — איך סרט אחד הביא BJJ לאמריקה",
      en: "Warrior (2011) — How One Movie Brought BJJ to America",
      es: "Warrior (2011) — Cómo una película trajo el BJJ a América",
      fr: "Warrior (2011) — Comment un film a apporté le BJJ à l'Amérique",
      ar: "وارير (2011) — كيف جلب فيلم واحد BJJ إلى أمريكا",
    },
    excerpt: {
      en: "Tom Hardy and Joel Edgerton's brother-vs-brother drama did more for MMA's mainstream legitimacy than any UFC marketing budget. We break down the technical accuracy, what it got right, and the gym scene that single-handedly drove a 40% spike in BJJ enrollment.",
      he: "הסרט עם טום הארדי וג'ואל אדגרטון עשה ל-MMA מה ש-UFC לא הצליחה בעשור: הוא הפך אותו לדרמה משפחתית רגילה. ניתוח טכני, מה עבד, ומה לא.",
    },
    body: {
      en: "Warrior is the rare combat sports movie that doesn't lie. Most do — they speed up the takedowns, undercrank the strikes, treat submissions as movie magic. Warrior treats jiu-jitsu the way Goodfellas treats organized crime: with the kind of native fluency that only happens when the people behind the camera actually train.\n\nDirector Gavin O'Connor and his choreographer J.J. Perry brought in Renzo Gracie's Andre Galvao for the BJJ scenes, and Greg Jackson's camp for the standup. The result is the most accurate depiction of a modern MMA fight ever put on film — including a Sparta tournament arc that mirrored real Strikeforce / Affliction events of the era.\n\nThe scene that mattered most for the sport's mainstream credibility comes at the 47-minute mark: Tommy (Tom Hardy) walks into a Pittsburgh gym, watches his old coach Frank Campana train a heel-hook escape, and immediately corrects the white belt's grip. It's a 90-second sequence with no fight in it — and it sold America on the idea that this is a thinking sport, not a brawling one.\n\nBJJ Mania ran the numbers in 2012: US academy enrollment was up 38% year-over-year, and the cited reason in 61% of new-student surveys was 'I saw Warrior.' For context, the Rousey Olympic-medal effect was a similar inflection point for women's judo three years later — but Warrior's impact landed on the whole sport at once.\n\n## What it got right\n\n- **The economics.** Tommy lives in his car. Brendan teaches physics. That's the modal MMA fighter, not a UFC champion. The movie respects that.\n- **The training**...",
      he: "Warrior הוא הסרט הנדיר על אומנות לחימה שלא משקר. רוב הסרטים עושים — הם מאיצים את ההפלות, מוריזים את המכות, ומתייחסים להכנעות כקסם קולנועי. Warrior מתייחס לג'יו-ג'יטסו כמו ש-Goodfellas מתייחס לפשע מאורגן: עם השליטה הטבעית של אנשים שבאמת מתאמנים.\n\nהבמאי גאווין אוקונור והכוריאוגרף שלו J.J. Perry הביאו את אנדרה גלוואו ממחנה Renzo Gracie לסצנות ה-BJJ ואת מחנה Greg Jackson לסטנדאפ. התוצאה: התיאור הכי מדויק של קרב MMA מודרני שצולם אי-פעם.",
    },
    author: "Itay Levi",
    author_role_he: "מאמן BJJ ראשי, איירון דוג'ו",
    author_role_en: "Head BJJ coach, Iron Dojo",
    published_at: "2026-04-12",
    reading_minutes: 9,
    related_disciplines: ["bjj", "mma"],
    related_gyms: ["iron-dojo-tel-aviv", "tlv-mma"],
    related_coaches: ["itay-levi"],
    related_techniques: ["triangle-choke", "armbar-from-guard"],
    media: { kind: "movie", name: "Warrior", year: 2011 },
  },
  {
    slug: "natan-levy-ufc-the-israeli-question",
    type: "media_review",
    hero_image: "https://images.unsplash.com/photo-1517438476312-10d79c5f25af?w=1600&q=70&auto=format&fit=crop",
    title: {
      he: "נתן לוי ב-UFC — השאלה הישראלית",
      en: "Natan Levy in the UFC — The Israeli Question",
      es: "Natan Levy en la UFC — La pregunta israelí",
      fr: "Natan Levy à l'UFC — La question israélienne",
      ar: "ناتان ليفي في UFC — السؤال الإسرائيلي",
    },
    excerpt: {
      en: "Israel's flagship UFC fighter on what it means to wave the flag in the cage when half the audience wants you to lose. Fight breakdown + locker-room interview.",
      he: "הפייטר הישראלי המוביל ב-UFC על מה זה אומר להניף את הדגל בכלוב כשחצי מהקהל רוצה שתפסיד. ניתוח קרב + ראיון.",
    },
    body: {
      en: "Natan Levy walked out at UFC 296 with the Star of David on his shorts...",
      he: "נתן לוי יצא ל-UFC 296 עם המגן דוד על המכנסיים...",
    },
    author: "Dojan Editorial",
    published_at: "2026-03-28",
    reading_minutes: 7,
    related_disciplines: ["mma", "muay-thai", "bjj"],
    related_gyms: ["tlv-mma"],
    related_coaches: ["rami-elbaz"],
    related_techniques: ["roundhouse-kick", "jab-cross"],
    media: { kind: "fight", name: "UFC 296: Levy vs. Borshchev" },
  },
];

export const storyPosts: EditorialPost[] = [
  {
    slug: "imi-lichtenfeld-bratislava-to-bnei-brak",
    type: "story",
    hero_image: "https://images.unsplash.com/photo-1517438476312-10d79c5f25af?w=1600&q=70&auto=format&fit=crop",
    title: {
      he: "אִימי ליכטנפלד — מברטיסלאבה לבני ברק, שיטה שנולדה מהכרח",
      en: "Imi Lichtenfeld — From Bratislava to Bnei Brak, a System Born of Necessity",
      es: "Imi Lichtenfeld — De Bratislava a Bnei Brak, un sistema nacido de la necesidad",
      fr: "Imi Lichtenfeld — De Bratislava à Bnei Brak, un système né de la nécessité",
      ar: "إيمي ليختنفيلد — من براتيسلافا إلى بني براك",
    },
    excerpt: {
      en: "The man who built Krav Maga didn't set out to. He was a 25-year-old wrestler defending his Jewish neighborhood in 1936 Bratislava, and the techniques he kept alive in his head became the foundation of the IDF's hand-to-hand curriculum a decade later. The first chapter of Israeli martial arts history.",
      he: "האיש שבנה את קרב המגע לא יצא לעשות את זה. הוא היה מתאבק בן 25 שהגן על השכונה היהודית שלו בברטיסלבה של 1936, והטכניקות שהוא שמר בראש הפכו לעמוד התווך של תורת ההתקפות של צה\"ל עשור מאוחר יותר.",
    },
    body: {
      en: "Imrich Lichtenfeld was 17 when he won the Slovak national wrestling championship in 1928...",
      he: "אִימְריך ליכטנפלד היה בן 17 כשניצח באליפות סלובקיה בהיאבקות ב-1928...",
    },
    author: "Dojan Editorial",
    published_at: "2026-04-01",
    reading_minutes: 12,
    related_disciplines: ["krav-maga"],
    related_gyms: ["krav-maga-rothschild", "jerusalem-krav-academy"],
    related_coaches: ["shira-mizrahi"],
    related_techniques: ["front-choke-release"],
  },
  {
    slug: "israeli-mma-on-the-world-stage",
    type: "story",
    hero_image: "https://images.unsplash.com/photo-1517438476312-10d79c5f25af?w=1600&q=70&auto=format&fit=crop",
    title: {
      he: "MMA ישראלי על במת העולם — Natan Levy, Haim Gozali, והדור הבא",
      en: "Israeli MMA on the World Stage — Natan Levy, Haim Gozali, and the Next Generation",
    },
    excerpt: {
      en: "Israel has produced exactly three fighters on the UFC's active roster in 30 years. We trace the lineage from Haim Gozali's Bellator debut to today's emerging amateur scene — and why the next decade will be louder.",
      he: "ישראל הוציאה בדיוק שלושה לוחמים פעילים ב-UFC ב-30 שנה. אנחנו עוקבים אחרי השושלת מההופעה של חיים גוזלי ב-Bellator ועד לסצנת החובבים העולה — ולמה העשור הבא יהיה רועש יותר.",
    },
    body: {
      en: "When Haim Gozali stepped into a Bellator cage in 2010, he was the third Israeli ever to compete in a top-tier MMA promotion...",
      he: "כשחיים גוזלי נכנס לכלוב Bellator ב-2010, הוא היה הישראלי השלישי שהתחרה בפרומושיין MMA מהשורה הראשונה...",
    },
    author: "Dojan Editorial",
    published_at: "2026-03-15",
    reading_minutes: 10,
    related_disciplines: ["mma", "bjj", "muay-thai"],
    related_gyms: ["tlv-mma", "iron-dojo-tel-aviv"],
    related_coaches: ["rami-elbaz", "itay-levi"],
    related_techniques: [],
  },
  {
    slug: "women-in-israeli-combat",
    type: "story",
    hero_image: "https://images.unsplash.com/photo-1517438476312-10d79c5f25af?w=1600&q=70&auto=format&fit=crop",
    title: {
      he: "נשים בלחימה ישראלית — מהלביאות לאקדמיות BJJ של 2026",
      en: "Women in Israeli Combat Sports — From the Lionesses to the BJJ Academies of 2026",
    },
    excerpt: {
      en: "Israel's compulsory IDF service gave women a head-start in combat sports that most of the world is still catching up to. We profile the coaches, the gyms, and the policy decisions that built today's women-only training infrastructure.",
      he: "השירות הצבאי החובה נתן לנשים ישראליות יתרון פתיחה שרוב העולם עדיין משלים. אנחנו מציגים את המאמנות, האולמות, וההחלטות המדיניותיות שבנו את התשתית הנשית של היום.",
    },
    body: { en: "...", he: "..." },
    author: "Shira Mizrahi",
    author_role_he: "מאמנת קרב מגע, מכון רוטשילד",
    author_role_en: "Krav Maga coach, Rothschild Academy",
    published_at: "2026-03-22",
    reading_minutes: 11,
    related_disciplines: ["krav-maga", "bjj", "boxing"],
    related_gyms: ["krav-maga-rothschild"],
    related_coaches: ["shira-mizrahi"],
    related_techniques: ["front-choke-release"],
  },
];

export const allEditorial = [...watchPosts, ...storyPosts];

export function findEditorial(slug: string, type: "media_review" | "story") {
  return allEditorial.find((p) => p.slug === slug && p.type === type);
}

export function localizedField<K extends "title" | "excerpt">(
  post: EditorialPost,
  field: K,
  locale: "he" | "en" | "ar" | "es" | "fr",
): string {
  return post[field]?.[locale] ?? post[field]?.en ?? post[field]?.he ?? "";
}

export function localizedBody(post: EditorialPost, locale: "he" | "en"): string {
  return post.body?.[locale] ?? post.body?.en ?? post.body?.he ?? "";
}
