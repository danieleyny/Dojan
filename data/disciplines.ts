export type DisciplineFamily =
  | "israeli"
  | "japanese"
  | "chinese"
  | "korean"
  | "thai"
  | "brazilian"
  | "western"
  | "mixed"
  | "filipino"
  | "russian";

export type GoodFor =
  | "kids"
  | "self-defense"
  | "fitness"
  | "competition"
  | "discipline"
  | "weight-loss"
  | "stress-relief";

export interface Discipline {
  slug: string;
  name_he: string;
  name_en: string;
  family: DisciplineFamily;
  origin_he: string;
  origin_en: string;
  founded_year: number | null;
  short_he: string;
  short_en: string;
  // Long-form encyclopedia content (markdown-ish, plain string).
  body_he?: string;
  body_en?: string;
  hero_image: string;
  pin_color: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  contact_level: 0 | 1 | 2 | 3 | 4 | 5;
  good_for: GoodFor[];
  related: string[]; // slugs
  history_he?: string;
  history_en?: string;
  philosophy_he?: string;
  philosophy_en?: string;
  techniques?: { name_he: string; name_en: string; description_he: string; description_en: string }[];
  famous_practitioners?: { name: string; achievement_he: string; achievement_en: string }[];
  benefits_he?: string[];
  benefits_en?: string[];
  who_for_he?: string;
  who_for_en?: string;
  faq?: { q_he: string; a_he: string; q_en: string; a_en: string }[];
}

export const disciplines: Discipline[] = [
  {
    slug: "krav-maga",
    name_he: "קרב מגע",
    name_en: "Krav Maga",
    family: "israeli",
    origin_he: "ישראל",
    origin_en: "Israel",
    founded_year: 1948,
    short_he:
      "שיטת ההגנה העצמית הישראלית. פרקטית, יעילה, מתאימה לכל אחד — נבנתה בשטח ולא באולם תחרויות.",
    short_en:
      "Israel's home-grown self-defense system. Practical, efficient, accessible — built on the ground, not in a tournament hall.",
    body_he:
      "קרב מגע אינה אומנות לחימה במובן הקלאסי — היא שיטת הגנה עצמית מודרנית שפותחה כדי להחזיק את התוקף הממוצע מחוץ למרחק הסכנה תוך שניות. אין בה תחרויות, אין בה דרגות מסורתיות, ואין בה טקסים. יש רק מטרה אחת: שתחזרי הביתה.",
    body_en:
      "Krav Maga is not a martial art in the classical sense — it is a modern self-defense system designed to neutralize an average attacker in seconds. No tournaments, no traditional ranks, no rituals. One goal: you walk home.",
    hero_image:
      "https://images.unsplash.com/photo-1555597673-b21d5c935865?w=1800&q=75&auto=format&fit=crop",
    pin_color: "#0F4C5C",
    difficulty: 2,
    contact_level: 4,
    good_for: ["self-defense", "fitness", "stress-relief"],
    related: ["bjj", "boxing", "muay-thai", "mma"],
    history_he:
      "פותחה בידי אִימי ליכטנפלד בסלובקיה של שנות ה-30 כשהגן על קהילתו היהודית מפני פוגרומים, וגובשה לכלל שיטה לאחר עלייתו ארצה והצטרפותו לצה\"ל. בעשורים שאחר כך הותאמה גם לאזרחים, למשטרות, ולגופי ביטחון בעולם — מה-FBI ועד ה-MARSOC.",
    history_en:
      "Developed by Imi Lichtenfeld in 1930s Slovakia while defending his Jewish community from pogroms, and codified into a system after he immigrated to Israel and joined the IDF. Over the decades it was adapted for civilians, police, and security agencies worldwide — from the FBI to MARSOC.",
    philosophy_he:
      "מטרת הלוחם בקרב מגע היא להפסיק את האיום במהירות, לא 'לנצח' בהתמודדות. השיטה בנויה על תגובות אינטואיטיביות, שימוש בכוח של התוקף נגדו, ופגיעה ביעדים אנטומיים זמינים. ההנחה תמיד: התוקף מזוין, גדול ממך, ובא להזיק.",
    philosophy_en:
      "The Krav Maga practitioner's goal is to stop the threat fast — not to 'win' an exchange. The system is built on instinctive reactions, using the attacker's force against them, and striking accessible anatomical targets. Always assume the attacker is armed, larger, and intent on harm.",
    techniques: [
      {
        name_he: "הגנה ישרה",
        name_en: "Inside Defense",
        description_he:
          "הגנה פנימית מפני אגרוף ישר — דחיפה קלה של היד התוקפת מהציר תוך מתקפה נגדית בו זמנית.",
        description_en:
          "Inside defense against a straight punch — small redirection of the attacking arm combined with simultaneous counter-strike.",
      },
      {
        name_he: "שחרור מחניקה מהחזית",
        name_en: "Front Choke Release",
        description_he:
          "פעולה מהירה בשתי ידיים לכיוון אחד, מאזנת את התוקף, ומתאפשרת תקיפה עם ברך או בעיטה.",
        description_en:
          "Fast two-handed motion to one side, breaks the attacker's structure, and opens up a knee or kick.",
      },
      {
        name_he: "הגנה מסכין",
        name_en: "Knife Defense",
        description_he:
          "מודל ההיכרות עם הסכין — מרחק, עיוות זווית, שליטה ביד החמושה, ופגיעה בזמן אמת.",
        description_en:
          "Knife awareness model — distance, angle deflection, control of the armed hand, and real-time strike.",
      },
    ],
    famous_practitioners: [
      {
        name: "Imi Lichtenfeld",
        achievement_he: "מייסד השיטה",
        achievement_en: "Founder of the system",
      },
      {
        name: "Eyal Yanilov",
        achievement_he: "ראש קרב מגע גלובל, תלמידו הישיר של אִימי",
        achievement_en: "Head of Krav Maga Global, direct student of Imi",
      },
    ],
    benefits_he: [
      "כושר אנאירובי גבוה — שיעור ממוצע שורף 600-900 קלוריות",
      "ביטחון אישי בסיטואציות מציאותיות",
      "זמן הסתגלות קצר יחסית — תרגישי שיפור תוך חודש",
      "אין דרישות פיזיות מקדימות",
    ],
    benefits_en: [
      "High anaerobic conditioning — an average class burns 600–900 calories",
      "Real-world situational confidence",
      "Short adaptation curve — you'll feel progress within a month",
      "No prerequisite athleticism",
    ],
    who_for_he:
      "מי שמחפש הגנה עצמית פרקטית בלי להיכנס לעולם של תחרויות. נשים ומבוגרים בני 30+ הם הקהל הגדול בישראל היום, אבל קרב מגע מתאים מגיל 14 ומעלה.",
    who_for_en:
      "Anyone who wants practical self-defense without entering the competitive martial arts world. The largest Israeli demographic is women and adults 30+, but Krav Maga is appropriate from age 14 upwards.",
    faq: [
      {
        q_he: "האם יש דרגות?",
        a_he: "כן — חגורה לבנה, צהובה, כתומה, ירוקה, כחולה, חומה, ושחורה (P1-P5). הקצב משתנה בין ארגונים אבל ממוצע לחגורה שחורה הוא 5-7 שנים.",
        q_en: "Are there belts?",
        a_en: "Yes — white, yellow, orange, green, blue, brown, and black (P1–P5). Pacing varies between organizations, but reaching black belt averages 5–7 years.",
      },
      {
        q_he: "אני בכושר נמוך, מתאים לי?",
        a_he: "לחלוטין. רוב התלמידות והתלמידים החדשים מגיעים בכושר ממוצע ומשפרים אותו בשיעורים. אין סף מינימום.",
        q_en: "I'm not in great shape — is this for me?",
        a_en: "Absolutely. Most new students start at average fitness and build up through class. There is no minimum threshold.",
      },
    ],
  },
  {
    slug: "bjj",
    name_he: "ג'יו ג'יטסו ברזילאי",
    name_en: "Brazilian Jiu-Jitsu",
    family: "brazilian",
    origin_he: "ברזיל",
    origin_en: "Brazil",
    founded_year: 1925,
    short_he:
      "האומנות הקרקעית האולטימטיבית. שחמט בכוח אדם — אפשר לנצח בלי מכה אחת.",
    short_en:
      "The ultimate ground game. Human chess — you can win without throwing a single strike.",
    body_he:
      "ג'יו ג'יטסו ברזילאי בנוי על הוכחה אחת חוזרת ונשנית: לוחם קטן יכול להכניע יריב גדול ממנו אם הוא יודע מה לעשות על הקרקע. זה הופך אותה לאומנות הלחימה הכי לימודית והכי 'לכל גוף' בעולם.",
    body_en:
      "Brazilian Jiu-Jitsu is built around a repeating proof: a smaller fighter can submit a larger opponent if they know what to do on the ground. That makes it the most teachable, most body-agnostic martial art in the world.",
    hero_image:
      "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=1800&q=75&auto=format&fit=crop",
    pin_color: "#1E40AF",
    difficulty: 4,
    contact_level: 4,
    good_for: ["self-defense", "competition", "discipline", "fitness"],
    related: ["judo", "mma", "wrestling", "krav-maga"],
    history_he:
      "מקורה ב-Judo של מאסטר Mitsuyo Maeda, שהיגר לברזיל ב-1914 ולימד את משפחת Gracie. דורות של Gracies — בראשם Helio ואחר כך Royce — שיכללו את השיטה דרך אתגרי 'Vale Tudo' פתוחים. ב-1993 עלה Royce ל-UFC הראשון, וניצח שלושה יריבים גדולים ממנו ברציפות. העולם השתנה.",
    history_en:
      "Originated from the Judo of Mitsuyo Maeda, who emigrated to Brazil in 1914 and taught the Gracie family. Generations of Gracies — Helio first, Royce later — refined the system through open 'Vale Tudo' challenges. In 1993, Royce entered UFC 1 and submitted three larger opponents in a row. The world changed.",
    philosophy_he:
      "טכניקה מנצחת כוח, מנוף מנצח את הכוח, סבלנות מנצחת אגרסיביות. בכל מצב יש תשובה.",
    philosophy_en:
      "Technique beats strength, leverage beats power, patience beats aggression. In every position, there is an answer.",
    techniques: [
      {
        name_he: "Closed Guard",
        name_en: "Closed Guard",
        description_he:
          "התלמיד למטה כשרגליו סוגרות סביב מותני היריב. עמדה דפנסיבית עם אופציות התקפיות עשירות.",
        description_en:
          "Bottom player has both legs locked around the opponent's hips. A defensive position rich with offensive options.",
      },
      {
        name_he: "Triangle Choke",
        name_en: "Triangle Choke",
        description_he:
          "חניקה קלאסית מ-Guard באמצעות הרגליים. אחת הכניעות המוכרות ביותר ברפרטואר.",
        description_en:
          "Classic submission from guard using the legs. One of the most recognized finishes in the sport.",
      },
      {
        name_he: "Arm Bar",
        name_en: "Arm Bar",
        description_he:
          "מנוף ישר על הזרוע, אפשרי כמעט מכל עמדה. הסיבה העיקרית שמתחילים פוחדים מ-BJJ ב-30 השניות הראשונות.",
        description_en:
          "Straight-arm hyperextension lock, available from nearly any position. The reason most beginners tap within their first 30 seconds.",
      },
    ],
    famous_practitioners: [
      {
        name: "Helio Gracie",
        achievement_he: "מאדריכל השיטה המודרנית",
        achievement_en: "Architect of the modern system",
      },
      {
        name: "Marcelo Garcia",
        achievement_he: "5x World Champion (No-Gi)",
        achievement_en: "5x ADCC / IBJJF World Champion (No-Gi)",
      },
    ],
    benefits_he: [
      "בנייה של חוזק פונקציונלי וגמישות",
      "הכרה עמוקה של גבולות הגוף ושל היריב",
      "קהילה עולמית — בכל יעד גלובלי תמצאי דוג'ו לפתוח את היומן",
      "מתאים גם בגיל 50+",
    ],
    benefits_en: [
      "Functional strength and flexibility",
      "Deep awareness of your body and opponent's limits",
      "Global community — every world city has an open mat",
      "Fully accessible at age 50+",
    ],
    who_for_he:
      "תלמיד שאוהב חידות, בעל סבלנות, שאינו פוחד ממגע פיזי קרוב. מתאים מצוין גם לנשים — בלי מכות בראש, ועם הוכחה יומיומית שטכניקה גוברת על גודל.",
    who_for_en:
      "Puzzle-solvers, patient students, comfortable with close physical contact. Excellent for women — no head-strikes and daily proof that technique beats size.",
    faq: [
      {
        q_he: "Gi או No-Gi — מה ההבדל?",
        a_he: "Gi הוא מדים מסורתיים מבד עבה (קימונו), No-Gi הוא בגדי ספורט. הראשון מאט את הקצב ומאפשר אחיזות מורכבות; השני מהיר יותר ויותר רלוונטי ל-MMA.",
        q_en: "Gi vs No-Gi — what's the difference?",
        a_en: "Gi is the traditional kimono uniform that allows complex grips; No-Gi is athletic wear, faster-paced, and more transferable to MMA.",
      },
    ],
  },
  {
    slug: "muay-thai",
    name_he: "מואי תאי",
    name_en: "Muay Thai",
    family: "thai",
    origin_he: "תאילנד",
    origin_en: "Thailand",
    founded_year: 1700,
    short_he:
      "אומנות שמונה הגפיים. אגרופים, ברכיים, מרפקים ובעיטות — תרגול אגרסיבי שיכניס אותך לכושר חיים.",
    short_en:
      "The art of eight limbs. Punches, knees, elbows, and kicks — a brutal training system that will reset what 'in shape' means to you.",
    hero_image:
      "https://images.unsplash.com/photo-1517976547714-720226b864c1?w=1800&q=75&auto=format&fit=crop",
    pin_color: "#D14B4B",
    difficulty: 3,
    contact_level: 5,
    good_for: ["fitness", "competition", "weight-loss", "stress-relief"],
    related: ["boxing", "kickboxing", "mma", "krav-maga"],
    history_he:
      "מואי תאי התפתחה מאומנויות לחימה מסורתיות של תאילנד שמשמשות אלפי שנים בקרבות בין צבאות. המואי תאי המודרני (גרסת הספורט) התגבש בתחילת המאה ה-20 עם כפפות, חוקים, וזירות חבל.",
    history_en:
      "Muay Thai evolved from traditional Thai military arts dating back centuries. Modern sport Muay Thai was codified in the early 20th century with gloves, rules, and roped rings.",
    techniques: [
      {
        name_he: "Teep (בעיטת דחיפה)",
        name_en: "Teep (Push Kick)",
        description_he:
          "בעיטה ישרה לפנים שחוסמת מתקפה ומשמשת ככלי שליטה במרחק. הג'אב של הרגליים.",
        description_en:
          "Straight front kick used to control distance. The 'jab of the legs'.",
      },
      {
        name_he: "Roundhouse Kick",
        name_en: "Roundhouse Kick",
        description_he:
          "בעיטה סיבובית עם השוקת — חזקה במיוחד בזכות סיבוב המותן.",
        description_en:
          "Rotational shin kick — devastating because of full hip torque.",
      },
      {
        name_he: "Clinch (חיבוק עומד)",
        name_en: "Clinch",
        description_he:
          "מצב צמוד שבו תופסים את הראש או הצוואר של היריב — שולטים בתנועה ופותחים ברכיים ומרפקים.",
        description_en:
          "Close-range head/neck control — opens up knees and elbows.",
      },
    ],
    benefits_he: [
      "השריפה הקלורית הגבוהה ביותר מכל אומנות לחימה (שיעור = 1000+ קלוריות)",
      "בנייה של עצמות וגיד שריר באזור הרגליים",
      "תזמון, מרחק, ויכולת לקבל מכה",
    ],
    benefits_en: [
      "Highest calorie burn of any martial art (1,000+ per class)",
      "Bone and shin conditioning",
      "Timing, distance management, ability to take a strike",
    ],
    who_for_he:
      "תלמידים שמחפשים אימון אינטנסיבי שגם בונה כושר רציני. הקהל הקלאסי הוא 18-40, אבל יש שיעורי טכניקה שאפשר להגיע אליהם בכל גיל ובלי מכות.",
    who_for_en:
      "Students wanting an intense workout that also builds serious conditioning. Classical demographic is 18–40, but technique-only classes exist for any age without sparring.",
  },
  {
    slug: "boxing",
    name_he: "אגרוף",
    name_en: "Boxing",
    family: "western",
    origin_he: "אנגליה / יוון העתיקה",
    origin_en: "England / Ancient Greece",
    founded_year: 1867,
    short_he:
      "המתוק שבמדעים. שתי ידיים, רגליים זריזות, וזכות הקדימה. אם תוכלי לאגרף, תוכלי הכל.",
    short_en:
      "The sweet science. Two hands, fast feet, and the right of way. If you can box, you can do anything.",
    hero_image:
      "https://images.unsplash.com/photo-1549824506-a26213aa05a3?w=1800&q=75&auto=format&fit=crop",
    pin_color: "#E0A526",
    difficulty: 3,
    contact_level: 4,
    good_for: ["fitness", "competition", "weight-loss", "discipline"],
    related: ["muay-thai", "kickboxing", "mma", "krav-maga"],
  },
  {
    slug: "mma",
    name_he: "MMA",
    name_en: "Mixed Martial Arts",
    family: "mixed",
    origin_he: "ארה\"ב / ברזיל",
    origin_en: "USA / Brazil",
    founded_year: 1993,
    short_he:
      "אומנות הלחימה השלמה ביותר. אגרוף + ברכיים + ג'יו ג'יטסו — בכלל הסטנדרט החדש של ספורט הלחימה.",
    short_en:
      "The most complete combat sport. Striking + grappling + ground game — the modern standard.",
    hero_image:
      "https://images.unsplash.com/photo-1577998474517-7eeeed4e448a?w=1800&q=75&auto=format&fit=crop",
    pin_color: "#6E2C9C",
    difficulty: 5,
    contact_level: 5,
    good_for: ["competition", "fitness", "self-defense"],
    related: ["bjj", "muay-thai", "boxing", "wrestling"],
  },
  {
    slug: "judo",
    name_he: "ג'ודו",
    name_en: "Judo",
    family: "japanese",
    origin_he: "יפן",
    origin_en: "Japan",
    founded_year: 1882,
    short_he:
      "הדרך הרכה. השלכות, הפלות, וכניעות — האומנות האולימפית של ישראל.",
    short_en:
      "The gentle way. Throws, takedowns, and submissions — Israel's Olympic flagship.",
    hero_image:
      "https://images.unsplash.com/photo-1611031091972-e94d6b6df987?w=1800&q=75&auto=format&fit=crop",
    pin_color: "#2E9E6B",
    difficulty: 4,
    contact_level: 3,
    good_for: ["kids", "competition", "discipline", "fitness"],
    related: ["bjj", "wrestling", "karate", "aikido"],
  },
  {
    slug: "karate",
    name_he: "קראטה",
    name_en: "Karate",
    family: "japanese",
    origin_he: "אוקינאווה / יפן",
    origin_en: "Okinawa / Japan",
    founded_year: 1900,
    short_he:
      "דרך היד הריקה. דיוק, מבנה, וקאטות — אחת הדרכים הטובות ביותר ללמד ילדים משמעת.",
    short_en:
      "The way of the empty hand. Precision, structure, kata — one of the best disciplines for kids.",
    hero_image:
      "https://images.unsplash.com/photo-1555597408-26bc8e548a46?w=1800&q=75&auto=format&fit=crop",
    pin_color: "#0F4C5C",
    difficulty: 3,
    contact_level: 2,
    good_for: ["kids", "discipline", "self-defense", "fitness"],
    related: ["taekwondo", "judo", "kung-fu"],
  },
  {
    slug: "taekwondo",
    name_he: "טאקוונדו",
    name_en: "Taekwondo",
    family: "korean",
    origin_he: "קוריאה",
    origin_en: "Korea",
    founded_year: 1955,
    short_he:
      "אומנות הבעיטות. אקרובטיות מטריפות, ספורט אולימפי, אידיאלית לילדים גמישים.",
    short_en:
      "The art of kicks. Stunning acrobatics, Olympic sport, ideal for flexible kids.",
    hero_image:
      "https://images.unsplash.com/photo-1555597673-b21d5c935865?w=1800&q=75&auto=format&fit=crop",
    pin_color: "#1E7A8C",
    difficulty: 3,
    contact_level: 3,
    good_for: ["kids", "competition", "discipline", "fitness"],
    related: ["karate", "kickboxing", "muay-thai"],
  },
  {
    slug: "capoeira",
    name_he: "קפוארה",
    name_en: "Capoeira",
    family: "brazilian",
    origin_he: "ברזיל",
    origin_en: "Brazil",
    founded_year: 1500,
    short_he:
      "ריקוד-קרב ברזילאי. מוזיקה, אקרובטיקה, ופלואידיות. שונה מכל מה שראית.",
    short_en:
      "The Brazilian dance-fight. Music, acrobatics, fluid motion. Unlike anything else.",
    hero_image:
      "https://images.unsplash.com/photo-1580554530778-ca36943938b2?w=1800&q=75&auto=format&fit=crop",
    pin_color: "#F76B53",
    difficulty: 3,
    contact_level: 1,
    good_for: ["fitness", "stress-relief", "discipline"],
    related: ["dance", "kung-fu"],
  },
  {
    slug: "aikido",
    name_he: "איקידו",
    name_en: "Aikido",
    family: "japanese",
    origin_he: "יפן",
    origin_en: "Japan",
    founded_year: 1942,
    short_he:
      "דרך ההרמוניה. הפניית כוח התוקף נגדו — בלי אגרסיביות, עם פילוסופיה עמוקה.",
    short_en:
      "The way of harmony. Redirecting an attacker's force without aggression — deeply philosophical.",
    hero_image:
      "https://images.unsplash.com/photo-1591025207163-942350e47db2?w=1800&q=75&auto=format&fit=crop",
    pin_color: "#8B5A2B",
    difficulty: 4,
    contact_level: 1,
    good_for: ["discipline", "stress-relief", "self-defense"],
    related: ["judo", "karate", "kung-fu"],
  },
  // Stub entries — title only — for breadth
  ...stubs([
    ["wrestling", "היאבקות", "Wrestling", "western", "#475569", 4, 4, ["competition", "fitness"]],
    ["kickboxing", "קיק בוקסינג", "Kickboxing", "western", "#0F4C5C", 3, 4, ["fitness", "competition"]],
    ["kung-fu", "קונג פו", "Kung Fu", "chinese", "#A33B3B", 4, 2, ["discipline", "fitness"]],
    ["tai-chi", "טאי צ'י", "Tai Chi", "chinese", "#7C9885", 1, 0, ["stress-relief", "fitness"]],
    ["sambo", "סמבו", "Sambo", "russian", "#3B82F6", 4, 4, ["competition", "self-defense"]],
    ["jeet-kune-do", "ג'יט קון דו", "Jeet Kune Do", "mixed", "#0E1116", 4, 4, ["self-defense"]],
    ["wing-chun", "וינג צ'ון", "Wing Chun", "chinese", "#7B1F1F", 3, 3, ["self-defense"]],
    ["krav-panim", "קרב פנים אל פנים", "Combat Hand-to-Hand", "israeli", "#0F4C5C", 3, 4, ["self-defense"]],
    ["fma", "אומנות פיליפינית", "Filipino Martial Arts (Kali/Eskrima)", "filipino", "#E0A526", 4, 3, ["self-defense"]],
    ["savate", "סאוואט", "Savate", "western", "#1E3A8A", 3, 4, ["competition", "fitness"]],
  ]),
];

function stubs(
  rows: [string, string, string, DisciplineFamily, string, 1 | 2 | 3 | 4 | 5, 0 | 1 | 2 | 3 | 4 | 5, GoodFor[]][],
): Discipline[] {
  return rows.map(([slug, name_he, name_en, family, color, diff, contact, good_for]) => ({
    slug,
    name_he,
    name_en,
    family,
    origin_he: "",
    origin_en: "",
    founded_year: null,
    short_he: "מאמר אנציקלופדיה בקרוב.",
    short_en: "Encyclopedia article coming soon.",
    hero_image:
      "https://images.unsplash.com/photo-1555597673-b21d5c935865?w=1200&q=70&auto=format&fit=crop",
    pin_color: color,
    difficulty: diff,
    contact_level: contact,
    good_for,
    related: [],
  }));
}

export function findDiscipline(slug: string) {
  return disciplines.find((d) => d.slug === slug);
}

export const featuredDisciplines = disciplines.slice(0, 12);
