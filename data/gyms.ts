import { cities } from "./cities";

export interface ClassSlot {
  id: string;
  discipline_slug: string;
  title_he: string;
  title_en: string;
  age_group:
    | "kids-3-6"
    | "kids-7-12"
    | "teens"
    | "adults"
    | "seniors"
    | "all-ages"
    | "women-only";
  level: "beginner" | "intermediate" | "advanced" | "all-levels";
  day: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday (Israeli week)
  start: string; // "HH:MM"
  end: string;
  trial_available: boolean;
}

export interface Instructor {
  slug: string;
  name_he: string;
  name_en: string;
  rank: string;
  years: number;
  photo: string;
  bio_he?: string;
  bio_en?: string;
}

export interface Review {
  id: string;
  author: string;
  rating: 1 | 2 | 3 | 4 | 5;
  ratings: {
    instructor: number;
    facilities: number;
    value: number;
    atmosphere: number;
    beginner_friendly: number;
  };
  title_he: string;
  body_he: string;
  title_en: string;
  body_en: string;
  date: string;
  verified: boolean;
}

export interface Gym {
  slug: string;
  name_he: string;
  name_en: string;
  description_he: string;
  description_en: string;
  city_slug: string;
  neighborhood_he: string;
  neighborhood_en: string;
  address: string;
  // [lng, lat]
  location: [number, number];
  phone: string;
  whatsapp?: string;
  website?: string;
  cover_image: string;
  gallery: string[];
  amenities: string[];
  price_min: number;
  price_max: number;
  trial_class_available: boolean;
  trial_class_price: number;
  discipline_slugs: string[];
  classes: ClassSlot[];
  instructors: Instructor[];
  reviews: Review[];
  rating: number; // 0..5
  review_count: number;
  claimed: boolean;
  premium: boolean;
}

const baseInstructor = (
  slug: string,
  name_he: string,
  name_en: string,
  rank: string,
  years: number,
  photoSeed: number,
): Instructor => ({
  slug,
  name_he,
  name_en,
  rank,
  years,
  photo: `https://i.pravatar.cc/300?img=${photoSeed}`,
});

const COVERS = [
  "https://images.unsplash.com/photo-1517438476312-10d79c5f25af?w=1400&q=70&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=1400&q=70&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=1400&q=70&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1400&q=70&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=1400&q=70&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=1400&q=70&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=1400&q=70&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=1400&q=70&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1521804906057-1df8fdb718b7?w=1400&q=70&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1591117207239-788bf8de6c3b?w=1400&q=70&auto=format&fit=crop",
];

const GALLERY = [
  "https://images.unsplash.com/photo-1517438476312-10d79c5f25af?w=900&q=70&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&q=70&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1581009137042-c552e485697a?w=900&q=70&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=900&q=70&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=900&q=70&auto=format&fit=crop",
];

// Build classes deterministically per gym
function buildClasses(gymId: string, disciplineSlugs: string[]): ClassSlot[] {
  const slots: ClassSlot[] = [];
  const days: (0 | 1 | 2 | 3 | 4)[] = [0, 1, 2, 3, 4]; // Sun-Thu — Israeli week
  let seed = 0;
  for (const ds of disciplineSlugs) {
    for (const d of days) {
      const hour = 17 + (seed % 4);
      const isKids = hour < 18;
      const ageGroup = isKids
        ? ((seed % 2 === 0 ? "kids-7-12" : "teens") as ClassSlot["age_group"])
        : "adults";
      const level: ClassSlot["level"] =
        seed % 3 === 0 ? "beginner" : seed % 3 === 1 ? "intermediate" : "all-levels";
      slots.push({
        id: `${gymId}-${ds}-${d}-${hour}`,
        discipline_slug: ds,
        title_he: hour < 18 ? "ילדים ונוער" : level === "beginner" ? "מתחילים" : "כללי",
        title_en: hour < 18 ? "Kids & Teens" : level === "beginner" ? "Beginners" : "General",
        age_group: ageGroup,
        level,
        day: d,
        start: `${hour}:00`,
        end: `${hour + 1}:30`,
        trial_available: seed % 2 === 0,
      });
      seed++;
    }
  }
  return slots;
}

interface Spec {
  slug: string;
  name_he: string;
  name_en: string;
  city: string;
  neighborhood_he: string;
  neighborhood_en: string;
  address: string;
  jitter: [number, number]; // offset from city center
  disciplines: string[];
  rating: number;
  reviews: number;
  premium?: boolean;
  description_he: string;
  description_en: string;
  amenities: string[];
}

const SPECS: Spec[] = [
  // Tel Aviv (8)
  {
    slug: "iron-dojo-tel-aviv",
    name_he: "איירון דוג'ו תל אביב",
    name_en: "Iron Dojo Tel Aviv",
    city: "tel-aviv",
    neighborhood_he: "פלורנטין",
    neighborhood_en: "Florentin",
    address: "רחוב פלורנטין 30, תל אביב",
    jitter: [-0.012, -0.008],
    disciplines: ["bjj", "muay-thai", "mma"],
    rating: 4.8,
    reviews: 187,
    premium: true,
    description_he:
      "מועדון לחימה מודרני בלב פלורנטין. דגש על ג'יו ג'יטסו ברזילאי תחת שושלת Alliance, ועל מואי תאי קלאסי. אווירה רצינית אבל פתוחה.",
    description_en:
      "A modern combat gym in the heart of Florentin. Alliance lineage BJJ and authentic Muay Thai. Serious vibe, beginner-friendly culture.",
    amenities: ["מקלחות", "חניה ברחוב", "שטיח BJJ", "שקי איגרוף", "אופציה לנשים בלבד"],
  },
  {
    slug: "krav-maga-rothschild",
    name_he: "מכון קרב מגע רוטשילד",
    name_en: "Krav Maga Rothschild",
    city: "tel-aviv",
    neighborhood_he: "רוטשילד",
    neighborhood_en: "Rothschild",
    address: "שדרות רוטשילד 71, תל אביב",
    jitter: [0.004, 0.001],
    disciplines: ["krav-maga", "boxing"],
    rating: 4.6,
    reviews: 142,
    description_he:
      "מכון קרב מגע ותיק על רוטשילד עם דגש על נשים, מבוגרים, ועל תרחישים מציאותיים מהרחוב הישראלי.",
    description_en:
      "Established Krav Maga school on Rothschild, focused on women, adult learners, and real-world Israeli street scenarios.",
    amenities: ["מקלחות", "נשים בלבד", "שיעורי בוקר", "חניה ברחוב"],
  },
  {
    slug: "tlv-mma",
    name_he: "TLV MMA",
    name_en: "TLV MMA",
    city: "tel-aviv",
    neighborhood_he: "צפון ישן",
    neighborhood_en: "Old North",
    address: "רחוב דיזנגוף 220, תל אביב",
    jitter: [0.005, 0.011],
    disciplines: ["mma", "bjj", "muay-thai", "boxing"],
    rating: 4.7,
    reviews: 98,
    premium: true,
    description_he:
      "אחד ממועדוני ה-MMA המלאים היחידים במרכז תל אביב. צוות מאמנים מקצועי, מתחרים פעילים ב-Bellator וב-One.",
    description_en:
      "One of the only true full-spectrum MMA gyms in central Tel Aviv. Pro coaching team, active competitors in Bellator and ONE.",
    amenities: ["שטיח MMA", "כלוב אימונים", "ציוד טוב", "חניה"],
  },
  {
    slug: "judo-haetzel",
    name_he: "מועדון ג'ודו האצ\"ל",
    name_en: "Haetzel Judo Club",
    city: "tel-aviv",
    neighborhood_he: "צהלה",
    neighborhood_en: "Tzahala",
    address: "האצ\"ל 28, תל אביב",
    jitter: [0.018, 0.025],
    disciplines: ["judo"],
    rating: 4.9,
    reviews: 76,
    description_he:
      "מועדון ג'ודו אולימפי. בית של נבחרת ישראל הצעירה. מקבלים ילדים מגיל 5.",
    description_en:
      "Olympic-level Judo club. Home to several Israeli youth team members. Kids welcomed from age 5.",
    amenities: ["שטיח טאטאמי", "מתאים לילדים", "אווירה תחרותית"],
  },
  // Jerusalem (4)
  {
    slug: "jerusalem-bjj-academy",
    name_he: "אקדמיית BJJ ירושלים",
    name_en: "Jerusalem BJJ Academy",
    city: "jerusalem",
    neighborhood_he: "המושבה הגרמנית",
    neighborhood_en: "German Colony",
    address: "עמק רפאים 35, ירושלים",
    jitter: [-0.006, -0.012],
    disciplines: ["bjj", "boxing"],
    rating: 4.7,
    reviews: 89,
    description_he:
      "אקדמיה ירושלמית של ג'יו ג'יטסו ברזילאי תחת Atos. דגש על תחרויות ומבוגרים מתחילים. שמור שבת.",
    description_en:
      "Jerusalem BJJ academy under Atos lineage. Strong on competition and adult beginners. Sabbath-observant schedule.",
    amenities: ["מקלחות", "חניה", "שמירת שבת"],
  },
  {
    slug: "jerusalem-krav-academy",
    name_he: "אקדמיית קרב מגע ירושלים",
    name_en: "Jerusalem Krav Academy",
    city: "jerusalem",
    neighborhood_he: "תלפיות",
    neighborhood_en: "Talpiot",
    address: "התעשייה 14, ירושלים",
    jitter: [0.014, -0.018],
    disciplines: ["krav-maga"],
    rating: 4.5,
    reviews: 64,
    description_he:
      "אקדמיית קרב מגע באזור תלפיות. הצוות הוקם על ידי בוגרי שייטת 13. שיעורים בעברית ובאנגלית.",
    description_en:
      "Krav Maga academy in Talpiot. Founded by Shayetet 13 alumni. Classes in Hebrew and English.",
    amenities: ["שיעורים באנגלית", "שיעורי VIP", "חניה"],
  },
  // Haifa (3)
  {
    slug: "haifa-fight-club",
    name_he: "Haifa Fight Club",
    name_en: "Haifa Fight Club",
    city: "haifa",
    neighborhood_he: "כרמל",
    neighborhood_en: "Carmel",
    address: "שדרות הנשיא 124, חיפה",
    jitter: [-0.004, 0.011],
    disciplines: ["mma", "muay-thai", "bjj"],
    rating: 4.6,
    reviews: 102,
    description_he:
      "מועדון לחימה מקצועי על הכרמל. אימונים אינטנסיביים בקבוצות קטנות. מתחרים פעילים ב-Bellator Europe.",
    description_en:
      "Pro combat gym on the Carmel. Intense small-group training. Active Bellator Europe competitors.",
    amenities: ["מקלחות", "סאונה", "מתחרים פעילים"],
  },
  {
    slug: "haifa-judo-center",
    name_he: "מרכז ג'ודו חיפה",
    name_en: "Haifa Judo Center",
    city: "haifa",
    neighborhood_he: "נווה שאנן",
    neighborhood_en: "Neve Shaanan",
    address: "טרומפלדור 28, חיפה",
    jitter: [0.011, -0.005],
    disciplines: ["judo", "karate"],
    rating: 4.8,
    reviews: 56,
    description_he:
      "מרכז ג'ודו לכל המשפחה — מגיל 4 ועד מבוגרים. מאמנים מהליגה הלאומית. שיעורי הורים וילדים.",
    description_en:
      "Family Judo center — ages 4 to adults. National-league coaches. Parent-and-child classes available.",
    amenities: ["מתאים לכל המשפחה", "שיעורי הורים-ילדים", "חניה"],
  },
  // Beer Sheva (2)
  {
    slug: "negev-mma",
    name_he: "Negev MMA",
    name_en: "Negev MMA",
    city: "beer-sheva",
    neighborhood_he: "רמות",
    neighborhood_en: "Ramot",
    address: "שדרות רגר 11, באר שבע",
    jitter: [0.009, 0.005],
    disciplines: ["mma", "boxing", "bjj"],
    rating: 4.5,
    reviews: 43,
    description_he:
      "מועדון ה-MMA המוביל בנגב. חוגי ילדים, נוער ומבוגרים, וכן צוות תחרותי.",
    description_en:
      "The Negev's leading MMA gym. Kids, teens, adults, and an active competition team.",
    amenities: ["חניה", "ציוד מלא", "שיעורי ילדים"],
  },
  {
    slug: "beer-sheva-krav",
    name_he: "קרב מגע באר שבע",
    name_en: "Beer Sheva Krav Maga",
    city: "beer-sheva",
    neighborhood_he: "מרכז העיר",
    neighborhood_en: "City Center",
    address: "הדסה 32, באר שבע",
    jitter: [-0.007, -0.003],
    disciplines: ["krav-maga", "kickboxing"],
    rating: 4.4,
    reviews: 38,
    description_he:
      "אקדמיית קרב מגע במרכז העיר. שיעורים אינטנסיביים, אחרי-הצהריים, ובסופי שבוע.",
    description_en:
      "Krav Maga academy in the city center. Intense after-work and weekend classes.",
    amenities: ["שיעורי ערב", "סופי שבוע", "חניה ברחוב"],
  },
  // Rishon LeZion (2)
  {
    slug: "rishon-bjj",
    name_he: "אקדמיית BJJ ראשון",
    name_en: "Rishon BJJ Academy",
    city: "rishon-lezion",
    neighborhood_he: "נחלת יהודה",
    neighborhood_en: "Nahalat Yehuda",
    address: "מבצע סיני 12, ראשון לציון",
    jitter: [0.006, 0.009],
    disciplines: ["bjj", "judo"],
    rating: 4.6,
    reviews: 51,
    description_he:
      "BJJ ו-Judo מתחת לקורת גג אחת. שטיח גדול, שיעורים מ-7 בבוקר עד 22:00.",
    description_en:
      "BJJ and Judo under one roof. Spacious mats, classes 7 AM to 10 PM.",
    amenities: ["מקלחות", "חניה", "שיעורי בוקר"],
  },
  // Petah Tikva
  {
    slug: "ptk-fight-academy",
    name_he: "Fight Academy פתח תקווה",
    name_en: "Fight Academy Petah Tikva",
    city: "petah-tikva",
    neighborhood_he: "מרכז העיר",
    neighborhood_en: "City Center",
    address: "מוטה גור 8, פתח תקווה",
    jitter: [-0.005, -0.002],
    disciplines: ["muay-thai", "boxing", "kickboxing"],
    rating: 4.7,
    reviews: 87,
    description_he:
      "מועדון אגרוף ומואי תאי בפתח תקווה. דגש על שיעורי כושר-לחימה לאוכלוסייה רחבה.",
    description_en:
      "Boxing and Muay Thai in Petah Tikva. Strong focus on fitness-oriented combat classes.",
    amenities: ["מקלחות", "שיעורי בוקר", "חניה", "שיעורי נשים"],
  },
];

export const gyms: Gym[] = SPECS.map((spec, idx) => {
  const city = cities.find((c) => c.slug === spec.city)!;
  const reviewsArr: Review[] = [];
  for (let i = 0; i < Math.min(3, Math.round(spec.reviews / 25)); i++) {
    reviewsArr.push({
      id: `${spec.slug}-r${i}`,
      author: ["יואב", "שירה", "דנה", "אילן", "נועה", "Gabriel", "Sarah"][i + idx % 5] || "אנונימי",
      rating: ([5, 5, 4, 5, 4, 5][i] || 5) as 1 | 2 | 3 | 4 | 5,
      ratings: {
        instructor: 5,
        facilities: 4,
        value: 4,
        atmosphere: 5,
        beginner_friendly: 5,
      },
      title_he: ["מקום מצוין", "מאמנים מהשורה הראשונה", "חוויה אישית מעולה"][i % 3],
      body_he:
        "אווירה מקבלת ומקצועית. הגעתי כמתחילה ולא הרגשתי לרגע אחד מחוץ למקום. המאמנים זמינים, הציוד תקין, והקהילה תומכת.",
      title_en: ["Great place", "Top-tier coaches", "Welcoming experience"][i % 3],
      body_en:
        "Welcoming and professional. I came in as a complete beginner and never felt out of place. Coaches are available, the gear is great, and the community is supportive.",
      date: "2026-04-1" + i,
      verified: i < 2,
    });
  }
  return {
    slug: spec.slug,
    name_he: spec.name_he,
    name_en: spec.name_en,
    description_he: spec.description_he,
    description_en: spec.description_en,
    city_slug: spec.city,
    neighborhood_he: spec.neighborhood_he,
    neighborhood_en: spec.neighborhood_en,
    address: spec.address,
    location: [city.center[0] + spec.jitter[0], city.center[1] + spec.jitter[1]],
    phone: "+972-50-" + (1000000 + idx * 1234).toString().slice(0, 7),
    whatsapp: "https://wa.me/9725012" + (10000 + idx),
    cover_image: COVERS[idx % COVERS.length],
    gallery: GALLERY,
    amenities: spec.amenities,
    price_min: 300 + (idx % 4) * 50,
    price_max: 600 + (idx % 4) * 80,
    trial_class_available: true,
    trial_class_price: idx % 3 === 0 ? 0 : 50,
    discipline_slugs: spec.disciplines,
    classes: buildClasses(spec.slug, spec.disciplines),
    instructors: [
      baseInstructor(
        spec.slug + "-h",
        ["איתי לוי", "רון כהן", "אופיר ברק", "טל נוי", "יואב אזולאי"][idx % 5],
        ["Itay Levi", "Ron Cohen", "Ofir Barak", "Tal Noy", "Yoav Azoulay"][idx % 5],
        ["חגורה שחורה דאן 3", "Black Belt 2nd Dan", "Pro Fighter 18-3", "חגורה חומה BJJ", "כפיצ' מרכזי"][idx % 5],
        8 + (idx % 12),
        idx + 11,
      ),
    ],
    reviews: reviewsArr,
    rating: spec.rating,
    review_count: spec.reviews,
    claimed: idx % 3 !== 2,
    premium: spec.premium ?? false,
  };
});

export function findGym(slug: string) {
  return gyms.find((g) => g.slug === slug);
}

export function gymsByCity(citySlug: string) {
  return gyms.filter((g) => g.city_slug === citySlug);
}

export function gymsByDiscipline(disciplineSlug: string) {
  return gyms.filter((g) => g.discipline_slugs.includes(disciplineSlug));
}

export function gymsByCityDiscipline(citySlug: string, disciplineSlug: string) {
  return gyms.filter(
    (g) => g.city_slug === citySlug && g.discipline_slugs.includes(disciplineSlug),
  );
}

// Haversine: km between two [lng, lat] points
export function distanceKm(a: [number, number], b: [number, number]): number {
  const R = 6371;
  const dLat = ((b[1] - a[1]) * Math.PI) / 180;
  const dLng = ((b[0] - a[0]) * Math.PI) / 180;
  const lat1 = (a[1] * Math.PI) / 180;
  const lat2 = (b[1] * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  return R * c;
}
