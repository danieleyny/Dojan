export interface TechniqueStep {
  position: number;
  title_he: string;
  title_en: string;
  body_he: string;
  body_en: string;
  common_mistake_he?: string;
  common_mistake_en?: string;
}

export interface Technique {
  slug: string;
  discipline_slug: string;
  category: "strike" | "grapple" | "defense" | "combo" | "drill";
  difficulty: 1 | 2 | 3 | 4 | 5;
  name_he: string;
  name_en: string;
  summary_he: string;
  summary_en: string;
  youtube_id?: string;
  has_custom_animation: boolean;
  steps: TechniqueStep[];
  related_slugs: string[];
}

export const techniques: Technique[] = [
  // BJJ — 4
  {
    slug: "triangle-choke",
    discipline_slug: "bjj",
    category: "grapple",
    difficulty: 3,
    name_he: "חניקת משולש (Triangle Choke)",
    name_en: "Triangle Choke",
    summary_he:
      "חניקה קלאסית מ-Closed Guard באמצעות הרגליים. אחת ההכנעות המוכרות והשימושיות בכל ה-BJJ.",
    summary_en:
      "Classic submission from Closed Guard using the legs. One of the most recognized and useful finishes in all of BJJ.",
    youtube_id: "M5RKnGQOoCM",
    has_custom_animation: false,
    steps: [
      {
        position: 1,
        title_he: "פתיחת הגארד",
        title_en: "Open the Guard",
        body_he: "פתח/י את ה-Closed Guard. רגל ימין על המותן השמאלית של היריב, רגל שמאל מאחורי הצוואר שלו.",
        body_en: "Open closed guard. Right leg on opponent's left hip, left leg behind their neck.",
        common_mistake_he: "להסתכל למעלה. תסתכלי אל היד שאת הולכת לעצור.",
        common_mistake_en: "Looking up. Eyes on the arm you're going to isolate.",
      },
      {
        position: 2,
        title_he: "בידוד היד",
        title_en: "Isolate the Arm",
        body_he: "משכי את היד הימנית של היריב על פני הצוואר שלך. היד השנייה חייבת להישאר בפנים.",
        body_en: "Pull the opponent's right arm across your neck. The other arm must stay inside.",
      },
      {
        position: 3,
        title_he: "סגירת המשולש",
        title_en: "Lock the Triangle",
        body_he: "תפסי את הקרסול עם היד השמאלית, סגרי את ברך שמאל מעל קרסול ימין.",
        body_en: "Grip the ankle with your left hand, lock left knee over right ankle.",
        common_mistake_he: "לסגור משולש שטוח. הזווית חייבת להיות 90 מעלות.",
        common_mistake_en: "Locking the triangle flat. The angle must be 90 degrees.",
      },
      {
        position: 4,
        title_he: "סיום הלחץ",
        title_en: "Finish",
        body_he: "משכי את הראש כלפי הברך השמאלית. סיום על ידי לחיצה של הרגליים פנימה.",
        body_en: "Pull the head toward your left knee. Finish by squeezing legs inward.",
      },
    ],
    related_slugs: ["armbar-from-guard", "kimura-from-guard"],
  },
  {
    slug: "armbar-from-guard",
    discipline_slug: "bjj",
    category: "grapple",
    difficulty: 3,
    name_he: "מפתח זרוע מגארד (Armbar)",
    name_en: "Armbar from Guard",
    summary_he: "מנוף ישר על הזרוע מ-Closed Guard. הקריאה הראשונה כמעט בכל בית-ספר BJJ.",
    summary_en: "Straight-arm lock from Closed Guard. The first finish taught in nearly every BJJ school.",
    youtube_id: "5XgKuG6Ldcc",
    has_custom_animation: false,
    steps: [
      { position: 1, title_he: "אחיזת שרוול", title_en: "Sleeve grip", body_he: "תפסי את השרוול של היריב עם היד שלך מנגד.", body_en: "Grip the opponent's sleeve with your opposite hand." },
      { position: 2, title_he: "סיבוב מותן", title_en: "Hip out", body_he: "סובבי את המותן 90 מעלות לכיוון הזרוע שבחרת.", body_en: "Hip out 90° toward the arm you've selected." },
      { position: 3, title_he: "רגל על הראש", title_en: "Leg over head", body_he: "העבירי את הרגל הימנית מעל הראש של היריב.", body_en: "Swing the right leg over the opponent's head." },
      { position: 4, title_he: "סיום", title_en: "Finish", body_he: "סגרי את הברכיים, הרימי את האגן, ותחזיקי את היד.", body_en: "Knees together, hip up, hold the arm — slow and steady." },
    ],
    related_slugs: ["triangle-choke", "omoplata"],
  },
  // Krav Maga
  {
    slug: "front-choke-release",
    discipline_slug: "krav-maga",
    category: "defense",
    difficulty: 2,
    name_he: "שחרור מחניקה חזיתית",
    name_en: "Front Choke Release",
    summary_he: "פעולה אינסטינקטיבית להשתחרר מאחיזה דו-ידיים בצוואר. הטכניקה הראשונה שכל תלמיד/ה לומד.",
    summary_en: "Instinctive response to a two-handed front choke. The first technique every student learns.",
    youtube_id: "wTCfMI5HJaY",
    has_custom_animation: false,
    steps: [
      { position: 1, title_he: "תפיסת אגודלים", title_en: "Grab the thumbs", body_he: "תפסי את שני האגודלים של היריב במהירות. הם החוליה החלשה.", body_en: "Grab both of the attacker's thumbs fast. They're the weak link." },
      { position: 2, title_he: "פתיחת לחץ", title_en: "Pop the grip", body_he: "מסובבי את הידיים בתנועה מהירה החוצה ולמטה.", body_en: "Rotate your hands outward and downward in one fast motion." },
      { position: 3, title_he: "מתקפה נגדית", title_en: "Counter-strike", body_he: "מיד אחרי השחרור — ברך לבטן ואגרוף לסנטר.", body_en: "Immediately after the release — knee to the gut, elbow to the chin." },
      { position: 4, title_he: "פינוי שטח", title_en: "Get distance", body_he: "צעדי לאחור בזווית של 45 מעלות, בידי גוננת.", body_en: "Step back at a 45° angle with hands up in a defensive frame." },
    ],
    related_slugs: ["bear-hug-front-release", "inside-defense"],
  },
  // Muay Thai
  {
    slug: "teep",
    discipline_slug: "muay-thai",
    category: "strike",
    difficulty: 1,
    name_he: "טייפ (בעיטת דחיפה)",
    name_en: "Teep (Push Kick)",
    summary_he: "הג'אב של הרגליים. בעיטה ישרה לפנים שחוסמת מתקפה ושולטת במרחק.",
    summary_en: "The jab of the legs. Straight push kick that breaks momentum and controls distance.",
    youtube_id: "JX8M8d0bV9o",
    has_custom_animation: false,
    steps: [
      { position: 1, title_he: "עמידה", title_en: "Stance", body_he: "עמדי בעמידת מואי תאי, משקל 60% רגל אחורית.", body_en: "Muay Thai stance, 60% weight on the rear leg." },
      { position: 2, title_he: "הרמת ברך", title_en: "Knee up", body_he: "הרימי את הברך הקדמית לגובה הבטן של היריב.", body_en: "Lift the lead knee to the opponent's belly level." },
      { position: 3, title_he: "דחיפה", title_en: "Push", body_he: "פתחי את הירך והדפי דרך כריות כף הרגל.", body_en: "Open the hip and drive through the ball of the foot." },
      { position: 4, title_he: "החזרה", title_en: "Recover", body_he: "החזירי את הרגל מהר לעמידה — אם תאחרי, חוטפת בעיטה.", body_en: "Snap the foot back to stance — slow recovery = you eat a kick." },
    ],
    related_slugs: ["roundhouse-kick", "jab-cross"],
  },
  {
    slug: "roundhouse-kick",
    discipline_slug: "muay-thai",
    category: "strike",
    difficulty: 2,
    name_he: "בעיטה סיבובית (Roundhouse)",
    name_en: "Roundhouse Kick",
    summary_he: "הבעיטה הקלאסית של המואי תאי. מבוצעת עם השוקת, לא עם כף הרגל.",
    summary_en: "Muay Thai's signature kick. Delivered with the shin, not the foot.",
    youtube_id: "0gxBfBOl3LE",
    has_custom_animation: false,
    steps: [
      { position: 1, title_he: "צעד-זווית", title_en: "Angle step", body_he: "צעד קטן עם הרגל הקדמית בזווית 45 מעלות.", body_en: "Small step with the lead foot at a 45° angle." },
      { position: 2, title_he: "סיבוב מותן", title_en: "Hip rotation", body_he: "סובבי את המותניים מלא לכיוון המטרה.", body_en: "Rotate hips fully toward the target." },
      { position: 3, title_he: "פגיעה עם שוקת", title_en: "Shin contact", body_he: "פגעי עם השוקת — 1/3 העליון. לא עם כף הרגל.", body_en: "Strike with the shin — upper third. Never the foot." },
      { position: 4, title_he: "מעקב", title_en: "Follow-through", body_he: "הבעיטה ממשיכה דרך היריב, לא נעצרת עליו.", body_en: "The kick goes through the target, not into it." },
    ],
    related_slugs: ["teep", "jab-cross"],
  },
  // Boxing
  {
    slug: "jab-cross",
    discipline_slug: "boxing",
    category: "combo",
    difficulty: 1,
    name_he: "ג'אב-קרוס (1-2)",
    name_en: "Jab-Cross (1-2)",
    summary_he: "הקומבינציה הבסיסית והשימושית ביותר באגרוף. כל קומבינציה מתחילה ממנה.",
    summary_en: "Boxing's most fundamental and useful combination. Every combo starts here.",
    youtube_id: "QYzcgF0vSn4",
    has_custom_animation: false,
    steps: [
      { position: 1, title_he: "ג'אב", title_en: "Jab", body_he: "אגרוף מהיד הקדמית, סיבוב כתף, החזרה מיידית.", body_en: "Lead-hand punch, shoulder rotates, snap back immediately." },
      { position: 2, title_he: "סיבוב הירך", title_en: "Hip turn", body_he: "תוך כדי שהג'אב חוזר, התחילי לסובב את הירך הימנית.", body_en: "As the jab returns, begin to rotate the right hip." },
      { position: 3, title_he: "קרוס", title_en: "Cross", body_he: "אגרוף מהיד האחורית דרך הקו האמצעי, סיבוב מלא של העקב.", body_en: "Rear-hand punch through center line, full heel rotation." },
      { position: 4, title_he: "החזרה", title_en: "Recover", body_he: "שני האגרופים חוזרים לסנטר. סנטר למטה, ידיים למעלה.", body_en: "Both hands back to chin. Chin tucked, hands up." },
    ],
    related_slugs: ["teep", "front-choke-release"],
  },
];

export function findTechnique(disciplineSlug: string, slug: string) {
  return techniques.find((t) => t.discipline_slug === disciplineSlug && t.slug === slug);
}

export function techniquesByDiscipline(slug: string) {
  return techniques.filter((t) => t.discipline_slug === slug);
}
