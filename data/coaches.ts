import { gyms } from "./gyms";

export interface Coach {
  slug: string;
  name_he: string;
  name_en: string;
  headline_he: string;
  headline_en: string;
  rank: string;
  gender: "m" | "f" | "other" | "prefer_not_to_say";
  primary_discipline: string;
  disciplines: string[];
  city_slug: string;
  gym_slug: string;
  languages_spoken: string[];
  photo: string;
  pull_quote_he: string;
  pull_quote_en: string;
  origin_story_he: string;
  origin_story_en: string;
  philosophy_he: string;
  philosophy_en: string;
  lineage_he: string;
  lineage_en: string;
  competition_record: { year: number; event: string; result: string }[];
  media_links: { type: "youtube" | "article" | "podcast"; url: string; title: string }[];
  years_teaching: number;
  rating: number;
  review_count: number;
  faq: { q_he: string; a_he: string; q_en: string; a_en: string }[];
}

export const coaches: Coach[] = [
  {
    slug: "itay-levi",
    name_he: "איתי לוי",
    name_en: "Itay Levi",
    headline_he: "מאמן BJJ ראשי, איירון דוג'ו תל אביב",
    headline_en: "Head BJJ coach, Iron Dojo Tel Aviv",
    rank: "Brown Belt 2nd Degree — Alliance",
    gender: "m",
    primary_discipline: "bjj",
    disciplines: ["bjj", "mma"],
    city_slug: "tel-aviv",
    gym_slug: "iron-dojo-tel-aviv",
    languages_spoken: ["he", "en"],
    photo: "https://i.pravatar.cc/600?img=12",
    pull_quote_he:
      "BJJ זה לא ספורט שאתה רוצה לנצח בו — זה ספורט שאתה רוצה להבין.",
    pull_quote_en:
      "BJJ isn't a sport you want to win — it's a sport you want to understand.",
    origin_story_he:
      "איתי התחיל BJJ ב-2009 אחרי 4 שנים של ג'ודו תחרותי. בגיל 26, אחרי קריירה קצרה ב-MMA חובבני, נסע לסאו פאולו לתקופה של 18 חודשים תחת המאמן Fabio Gurgel. שם הוא ספג את המתודולוגיה של Alliance — הדיוק, הסבלנות, התשומת לב לפרטים שמייחדת את הבית הזה. חזר לישראל ב-2015 וב-2018 פתח את איירון דוג'ו ביחד עם שותפו רון כהן.\n\nתוך 5 שנים האקדמיה הפכה לאחת המובילות במזרח התיכון. מתחרים שלו תפסו מדליות ב-IBJJF פאריס פתוח, ב-No-Gi Worlds, וב-ADCC Trials של אירופה. אבל מה שהכי גאה אותו זה לא הניצחונות התחרותיים — אלא ה-200+ תלמידים המתחילים שעברו דרך הדלת שלו, מתוכם 60+ נשים, רובן ללא רקע ספורטיבי כלשהו, שנשארו ללמוד.",
    origin_story_en:
      "Itay started BJJ in 2009 after four years of competitive Judo. At 26, after a short amateur MMA career, he moved to São Paulo for 18 months under Fabio Gurgel. There he absorbed the Alliance methodology — the precision, patience, and obsessive attention to detail that defines the lineage. He returned to Israel in 2015 and in 2018 opened Iron Dojo with his partner Ron Cohen.\n\nIn five years the academy became one of the Middle East's leading BJJ houses. His competitors have taken medals at the IBJJF Paris Open, the No-Gi Worlds, and the European ADCC Trials. But what makes him proudest isn't the podium count — it's the 200+ beginners who walked through his door, including 60+ women with no athletic background, who stayed.",
    philosophy_he:
      "אני מאמין שטכניקה היא תמיד לפני אגרסיביות. שיעור אצלי מתחיל ב-20 דקות של חימום מבוסס תנועה, עובר ל-30 דקות של דריל טכני סביב פוזיציה אחת ספציפית (closed guard, side control, mount), ומסתיים ב-30 דקות של ספארינג קל. אין 'גלגול חופשי' מהרגע הראשון — תלמיד מקבל את הזכות לגלגל כשהוא יודע מה הוא עושה.\n\nהדבר השני שאני דורש: שיוויון בין החגורות. תלמיד עם חגורה לבנה צריך להרגיש בנוח לגלגל עם חגורה חומה ולנסות לעשות לה submission. אם הוא לא נכשל מספיק, הוא לא לומד.",
    philosophy_en:
      "I believe technique beats aggression every time. My class starts with 20 minutes of movement-based warm-up, moves to 30 minutes of technical drilling around one specific position (closed guard, side control, mount), and finishes with 30 minutes of light sparring. No 'free roll' from minute one — a student earns the right to roll when they know what they're doing.\n\nThe other thing I demand: equality between belts. A white belt should feel comfortable rolling with a brown belt and trying to submit them. If they're not failing enough, they're not learning.",
    lineage_he:
      "Fabio Gurgel (Black Belt 5th Degree, Alliance São Paulo) → איתי לוי (Brown Belt 2nd Degree).",
    lineage_en:
      "Fabio Gurgel (Black Belt 5th Degree, Alliance São Paulo) → Itay Levi (Brown Belt 2nd Degree).",
    competition_record: [
      { year: 2024, event: "IBJJF Paris Open — Brown Adult Heavy", result: "Silver" },
      { year: 2023, event: "ADCC Europe Trials", result: "Bronze" },
      { year: 2022, event: "Mundial No-Gi Brown Heavy", result: "5th" },
      { year: 2019, event: "Pan IBJJF Purple Heavy", result: "Gold" },
    ],
    media_links: [
      { type: "youtube", url: "https://youtube.com/watch?v=xxx", title: "Lasso guard sweep series" },
      { type: "article", url: "#", title: "BJJ Heroes profile" },
    ],
    years_teaching: 9,
    rating: 4.9,
    review_count: 67,
    faq: [
      { q_he: "אני בן 45 — מאוחר מדי?", a_he: "ממש לא. הרבה מהתלמידים החזקים שלי התחילו בגיל 40-50. גוף בוגר לומד טכניקה לאט יותר אבל מבין אותה לעומק.", q_en: "I'm 45 — too late?", a_en: "Not at all. Many of my strongest students started at 40–50. A mature body learns technique slower but understands it more deeply." },
      { q_he: "האם יש קבוצת נשים?", a_he: "כן. יום שלישי 19:00 שיעור נשים בלבד עם המאמנת שירה. גם בכל שיעור רגיל יש לפחות 2-3 נשים.", q_en: "Is there a women's group?", a_en: "Yes. Tuesday 19:00 is women-only with Coach Shira. Every regular class also has at least 2–3 women on the mat." },
    ],
  },
  {
    slug: "shira-mizrahi",
    name_he: "שירה מזרחי",
    name_en: "Shira Mizrahi",
    headline_he: "מאמנת קרב מגע נשים, מכון קרב מגע רוטשילד",
    headline_en: "Women's Krav Maga lead instructor, Krav Maga Rothschild",
    rank: "Krav Maga Global Expert 2 (P2)",
    gender: "f",
    primary_discipline: "krav-maga",
    disciplines: ["krav-maga", "boxing"],
    city_slug: "tel-aviv",
    gym_slug: "krav-maga-rothschild",
    languages_spoken: ["he", "en", "fr"],
    photo: "https://i.pravatar.cc/600?img=47",
    pull_quote_he:
      "אני לא מלמדת אותך להילחם. אני מלמדת אותך לגרום למי שמולך לחשוב פעמיים.",
    pull_quote_en:
      "I don't teach you to fight. I teach you to make the person across from you think twice.",
    origin_story_he:
      "שירה גדלה ברמת השרון, שירתה במשטרה הצבאית והכשרה את עצמה כלוחמת קרב מגע במקביל ללימודי משפטים. ב-2014, אחרי תקרית רחוב בה התמודדה לבדה מול שני תוקפים, החליטה להפסיק עם המשפטים ולפתוח שיעור נשים. ההצלחה הייתה מיידית: תוך חצי שנה הייתה רשימת המתנה, ותוך שלוש שנים פתחה שלוש קבוצות בעיר.\n\nהיום שירה מובילה את אחד התוכניות הנשיות הגדולות במרכז ישראל — מעל 80 נשים פעילות, מגיל 18 עד 67. היא מתמחה בהגנה עצמית מבוססת-תרחישים: לא רק אגרוף וברך, אלא קריאת סיטואציה ברכב, במעלית, במועדון, ובסיטואציות של אלימות במשפחה.",
    origin_story_en:
      "Shira grew up in Ramat HaSharon, served in the Military Police, and trained as a Krav Maga instructor alongside her law studies. In 2014, after a street incident in which she handled two attackers alone, she put law school on hold and opened her first women's class. The response was immediate: within six months she had a waitlist, and within three years three groups across the city.\n\nToday Shira leads one of central Israel's largest women's Krav Maga programs — 80+ active students, aged 18 to 67. She specializes in scenario-based self-defense: not just a punch and a knee, but reading situations in a car, an elevator, a club, and inside the family.",
    philosophy_he:
      "הגנה עצמית לא מתחילה ביד — היא מתחילה במודעות. 80% מהמצבים שאני מלמדת לפתור מתחילים בלהזהות שמשהו לא בסדר 15 שניות לפני שהאלימות מתחילה. רק 20% הם 'הטכניקה.'\n\nמה שאני לא עושה: מקצינה. אני לא רוצה שתלמידה תצא מהשיעור מפוחדת מהעולם. אני רוצה שהיא תצא בטוחה בכך שהיא ערה אליו.",
    philosophy_en:
      "Self-defense doesn't start with the hand — it starts with awareness. 80% of the situations I teach my students to handle begin with recognizing something is wrong 15 seconds before the violence starts. Only 20% is 'the technique.'\n\nWhat I don't do: catastrophize. I don't want a student leaving class afraid of the world. I want her leaving class confident that she's awake to it.",
    lineage_he:
      "Eyal Yanilov (Krav Maga Global, Expert 5) → Tamir Gilad → שירה מזרחי (P2).",
    lineage_en:
      "Eyal Yanilov (Krav Maga Global, Expert 5) → Tamir Gilad → Shira Mizrahi (P2).",
    competition_record: [],
    media_links: [
      { type: "podcast", url: "#", title: "Self-Defense Reframed (Episode 12)" },
    ],
    years_teaching: 11,
    rating: 4.9,
    review_count: 134,
    faq: [
      { q_he: "אני לא בכושר. מותר לי לבוא?", a_he: "כן. אין מבחן כניסה. השיעור הראשון בכוונה רך — תכירי את הקבוצה, את שלוש התנועות הבסיסיות, ואת השאלות שלך.", q_en: "I'm not in shape. May I come?", a_en: "Yes. No entry test. The first class is intentionally light — you'll meet the group, the three foundational movements, and your questions." },
      { q_he: "האם זה רק לנשים?", a_he: "השיעורים שלי בימים שני ורביעי 19:30 וביום שישי 09:00 — נשים בלבד. שאר השיעורים מעורבים.", q_en: "Is it women-only?", a_en: "My Mon & Wed 19:30 and Fri 09:00 classes are women-only. The rest are mixed." },
    ],
  },
  {
    slug: "rami-elbaz",
    name_he: "רמי אלבז",
    name_en: "Rami Elbaz",
    headline_he: "מאמן מואי תאי ופייטר מקצועי, TLV MMA",
    headline_en: "Muay Thai coach & pro fighter, TLV MMA",
    rank: "Pro 14-2, ONE Championship",
    gender: "m",
    primary_discipline: "muay-thai",
    disciplines: ["muay-thai", "mma", "boxing"],
    city_slug: "tel-aviv",
    gym_slug: "tlv-mma",
    languages_spoken: ["he", "en", "th"],
    photo: "https://i.pravatar.cc/600?img=33",
    pull_quote_he:
      "המקלות שאתה נותן באימון הם הבית-ספר. ההכאות שאתה מקבל בקרב — אלה הבחינות.",
    pull_quote_en:
      "The pads you hit in training are the schoolwork. The shots you take in the ring are the exams.",
    origin_story_he:
      "רמי, יליד אשקלון, התחיל מואי תאי בגיל 14 אצל המאמן השוויצרי-ישראלי דניאל מאייר. אחרי שלוש קרבות חובבים נסע לתאילנד בגיל 19, חי במחנה Tiger ב-Phuket שמונה חודשים והתחיל קריירה מקצועית. שלוש שנים מאוחר יותר חתם ב-ONE Championship והוא היום אחד משני הישראלים בלוח שמותיה.",
    origin_story_en:
      "Rami, from Ashkelon, started Muay Thai at 14 under Swiss-Israeli coach Daniel Mayer. After three amateur fights he moved to Thailand at 19, lived in Tiger Camp Phuket for eight months, and turned pro. Three years later he signed with ONE Championship, where he's one of two Israelis on the roster today.",
    philosophy_he:
      "מואי תאי הוא ספורט של דיוק תחת לחץ — לא של אגרסיביות. הקרב שאני מקבל היום הוא ה-X של 1000 דקות פדים שעשיתי השבוע. אני לא מאמין באימון מ-100% כושר ב-100% מהזמן — אני מאמין באימון מ-90% כושר ב-90% מהזמן, ובלהגיע ל-100% בחדר הסעודה.",
    philosophy_en:
      "Muay Thai is a sport of precision under pressure — not aggression. The fight I take today is the X of the 1,000 minutes of pads I did this week. I don't believe in training at 100% intensity 100% of the time — I believe in training at 90% intensity 90% of the time, and showing up at 100% in the locker room.",
    lineage_he:
      "Master Sangtiennoi → Tiger Camp Phuket → רמי אלבז (Pro, ONE).",
    lineage_en:
      "Master Sangtiennoi → Tiger Camp Phuket → Rami Elbaz (Pro, ONE).",
    competition_record: [
      { year: 2024, event: "ONE Fight Night 18", result: "Win, TKO R2" },
      { year: 2024, event: "ONE Friday Fights 65", result: "Win, Decision" },
      { year: 2023, event: "ONE Championship debut", result: "Win, Decision" },
      { year: 2022, event: "WBC Muay Thai EU Title", result: "Win, Decision" },
    ],
    media_links: [
      { type: "youtube", url: "https://youtube.com/watch?v=yyy", title: "Highlight reel 2024" },
    ],
    years_teaching: 6,
    rating: 4.8,
    review_count: 51,
    faq: [
      { q_he: "מתחילים יכולים להתאמן אצלך?", a_he: "כן. שיעור מתחילים בימי שני וחמישי 19:00. אין שום ספארינג עד שיש לך מינימום שלושה חודשים של פדים.", q_en: "Can beginners train with you?", a_en: "Yes. Beginners class is Monday & Thursday 19:00. No sparring until you have a minimum of three months of pads under your belt." },
    ],
  },
];

export function findCoach(slug: string) {
  return coaches.find((c) => c.slug === slug);
}

export function coachesByGym(gymSlug: string) {
  return coaches.filter((c) => c.gym_slug === gymSlug);
}

export function coachesByCity(citySlug: string) {
  return coaches.filter((c) => c.city_slug === citySlug);
}

export function coachesByDiscipline(slug: string) {
  return coaches.filter((c) => c.disciplines.includes(slug));
}

// Sanity check at build time (silent)
void gyms;
