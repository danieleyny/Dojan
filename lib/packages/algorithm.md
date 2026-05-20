# Package builder algorithm (per BUILD_PROMPT_EXPANSION §5.2)

For each session slot the builder needs to fill, it scores every matching
`class` row in the catalog and picks the highest-scoring class that doesn't
already conflict with scheduled sessions.

## Score weights

| Weight | Component | Today (mock data) | Future (Supabase) |
|---|---|---|---|
| 40% | Match: discipline + level + age_group + women-only fit | Boolean check | Boolean check |
| 25% | Gym rating (combined platform + GBP) | `gym.rating` | Weighted: `(platform_avg * platform_n + gbp_avg * gbp_n) / (platform_n + gbp_n)` |
| 15% | Distance from declared city(ies) | Haversine to city centroid | PostGIS `ST_Distance` to gym location |
| 10% | Schedule fit (no conflicts, time-of-day pref) | Greedy non-overlap | Same |
| 10% | Price within budget | Linear penalty above budget | Same |

## Greedy fill

1. Order requested sessions by `(discipline_priority, day, time_of_day_pref)`.
2. For each session: pick the best class that does not conflict with already-
   placed sessions.
3. If no match scores above the floor (60/100), surface as "we couldn't fill
   this slot — here are the closest matches" and let the user choose.

## Surfacing the algorithm

Each generated package displays a "Why these gyms?" expander on the result
page, showing the score breakdown per session. This is intentional —
transparency builds trust and lets us iterate on weights with user feedback.
