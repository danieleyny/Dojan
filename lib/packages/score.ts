import type { Gym, ClassSlot } from "@/data/gyms";
import { gyms, distanceKm } from "@/data/gyms";
import { cities } from "@/data/cities";

export interface PackageConstraints {
  disciplineSlugs: string[];
  citySlugs: string[];
  level: "beginner" | "intermediate" | "advanced" | "any";
  womenOnly: boolean;
  englishSpeaking: boolean;
  budgetNIS: [number, number];
  sessionsPerWeek: number;
  timeOfDay: "morning" | "evening" | "any";
}

export interface ScoredSlot {
  gym: Gym;
  slot: ClassSlot;
  score: number;
  breakdown: { match: number; rating: number; distance: number; schedule: number; price: number };
}

export function buildPackage(constraints: PackageConstraints): ScoredSlot[] {
  const candidates: ScoredSlot[] = [];

  for (const g of gyms) {
    for (const slot of g.classes) {
      if (!constraints.disciplineSlugs.includes(slot.discipline_slug)) continue;
      if (constraints.womenOnly && slot.age_group !== "women-only") continue;
      if (
        constraints.level !== "any" &&
        slot.level !== constraints.level &&
        slot.level !== "all-levels"
      ) {
        continue;
      }

      // 40% match (already filtered above; full points)
      const match = 40;

      // 25% rating
      const rating = (g.rating / 5) * 25;

      // 15% distance — measure to nearest declared city centroid
      let bestKm = Infinity;
      for (const cs of constraints.citySlugs) {
        const c = cities.find((x) => x.slug === cs);
        if (!c) continue;
        const km = distanceKm(g.location, c.center);
        if (km < bestKm) bestKm = km;
      }
      const distance = bestKm === Infinity ? 8 : Math.max(0, 15 - bestKm * 0.6);

      // 10% schedule (morning preference: slot starts before 12; evening: after 17)
      const hour = parseInt(slot.start.split(":")[0] ?? "12", 10);
      const schedule =
        constraints.timeOfDay === "morning" && hour < 12
          ? 10
          : constraints.timeOfDay === "evening" && hour >= 17
            ? 10
            : constraints.timeOfDay === "any"
              ? 7
              : 4;

      // 10% price
      const [pMin, pMax] = constraints.budgetNIS;
      const within = g.price_min <= pMax && g.price_max >= pMin;
      const price = within ? 10 : Math.max(0, 10 - Math.abs(g.price_min - pMax) / 50);

      const total = match + rating + distance + schedule + price;
      candidates.push({
        gym: g,
        slot,
        score: Math.round(total),
        breakdown: { match, rating: Math.round(rating), distance: Math.round(distance), schedule, price: Math.round(price) },
      });
    }
  }

  candidates.sort((a, b) => b.score - a.score);

  // Greedy fill: highest score first, avoiding same-day conflicts on the same gym+slot
  const placed: ScoredSlot[] = [];
  const usedSlotIds = new Set<string>();
  for (const c of candidates) {
    if (placed.length >= constraints.sessionsPerWeek) break;
    if (usedSlotIds.has(c.slot.id)) continue;
    // Avoid 2 sessions same day same gym
    const sameDaySameGym = placed.some(
      (p) => p.slot.day === c.slot.day && p.gym.slug === c.gym.slug,
    );
    if (sameDaySameGym) continue;
    placed.push(c);
    usedSlotIds.add(c.slot.id);
  }
  return placed;
}

export function totalCost(slots: ScoredSlot[]): { min: number; max: number } {
  // Use average monthly price split across the slots, as an estimate
  let min = 0;
  let max = 0;
  for (const s of slots) {
    min += s.gym.price_min;
    max += s.gym.price_max;
  }
  return { min: Math.round(min / 4), max: Math.round(max / 4) };
}
