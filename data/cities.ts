export interface City {
  slug: string;
  name_he: string;
  name_en: string;
  district_he: string;
  district_en: string;
  population: number;
  // [lng, lat] for map; matches GeoJSON convention
  center: [number, number];
  is_featured: boolean;
  hero_image: string;
}

export const cities: City[] = [
  {
    slug: "tel-aviv",
    name_he: "תל אביב",
    name_en: "Tel Aviv",
    district_he: "מחוז תל אביב",
    district_en: "Tel Aviv District",
    population: 460613,
    center: [34.7818, 32.0853],
    is_featured: true,
    hero_image:
      "https://images.unsplash.com/photo-1544971587-eaa28dadcaf3?w=1600&q=70&auto=format&fit=crop",
  },
  {
    slug: "jerusalem",
    name_he: "ירושלים",
    name_en: "Jerusalem",
    district_he: "מחוז ירושלים",
    district_en: "Jerusalem District",
    population: 952000,
    center: [35.2137, 31.7683],
    is_featured: true,
    hero_image:
      "https://images.unsplash.com/photo-1544734037-4d245d35a386?w=1600&q=70&auto=format&fit=crop",
  },
  {
    slug: "haifa",
    name_he: "חיפה",
    name_en: "Haifa",
    district_he: "מחוז חיפה",
    district_en: "Haifa District",
    population: 285316,
    center: [34.9896, 32.794],
    is_featured: true,
    hero_image:
      "https://images.unsplash.com/photo-1576176539998-0237d1d65f31?w=1600&q=70&auto=format&fit=crop",
  },
  {
    slug: "beer-sheva",
    name_he: "באר שבע",
    name_en: "Beer Sheva",
    district_he: "מחוז הדרום",
    district_en: "Southern District",
    population: 211100,
    center: [34.7913, 31.2518],
    is_featured: true,
    hero_image:
      "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=1600&q=70&auto=format&fit=crop",
  },
  {
    slug: "rishon-lezion",
    name_he: "ראשון לציון",
    name_en: "Rishon LeZion",
    district_he: "מחוז המרכז",
    district_en: "Central District",
    population: 260680,
    center: [34.8044, 31.9642],
    is_featured: true,
    hero_image:
      "https://images.unsplash.com/photo-1518481612222-68bbe828ecd1?w=1600&q=70&auto=format&fit=crop",
  },
  {
    slug: "petah-tikva",
    name_he: "פתח תקווה",
    name_en: "Petah Tikva",
    district_he: "מחוז המרכז",
    district_en: "Central District",
    population: 247956,
    center: [34.8878, 32.0878],
    is_featured: true,
    hero_image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1600&q=70&auto=format&fit=crop",
  },
  {
    slug: "ashdod",
    name_he: "אשדוד",
    name_en: "Ashdod",
    district_he: "מחוז הדרום",
    district_en: "Southern District",
    population: 226256,
    center: [34.6443, 31.8044],
    is_featured: true,
    hero_image:
      "https://images.unsplash.com/photo-1507608616040-3aebccdcdaa1?w=1600&q=70&auto=format&fit=crop",
  },
  {
    slug: "netanya",
    name_he: "נתניה",
    name_en: "Netanya",
    district_he: "מחוז המרכז",
    district_en: "Central District",
    population: 224491,
    center: [34.8554, 32.3215],
    is_featured: true,
    hero_image:
      "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=1600&q=70&auto=format&fit=crop",
  },
  {
    slug: "holon",
    name_he: "חולון",
    name_en: "Holon",
    district_he: "מחוז תל אביב",
    district_en: "Tel Aviv District",
    population: 196282,
    center: [34.7722, 32.0117],
    is_featured: false,
    hero_image:
      "https://images.unsplash.com/photo-1490078615078-d57b1ddbcde7?w=1600&q=70&auto=format&fit=crop",
  },
  {
    slug: "ramat-gan",
    name_he: "רמת גן",
    name_en: "Ramat Gan",
    district_he: "מחוז תל אביב",
    district_en: "Tel Aviv District",
    population: 168800,
    center: [34.8127, 32.0823],
    is_featured: false,
    hero_image:
      "https://images.unsplash.com/photo-1518306727298-4c17e1bf6947?w=1600&q=70&auto=format&fit=crop",
  },
];

export function findCity(slug: string) {
  return cities.find((c) => c.slug === slug);
}
