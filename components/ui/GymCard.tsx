import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import { MapPin, BadgeCheck, Sparkles } from "lucide-react";
import { Gym } from "@/data/gyms";
import { findCity } from "@/data/cities";
import { findDiscipline } from "@/data/disciplines";
import { DisciplinePill } from "./DisciplinePill";
import { RatingStars } from "./RatingStars";
import { cn } from "@/lib/utils";

interface Props {
  gym: Gym;
  variant?: "grid" | "list";
  distanceKm?: number;
  priority?: boolean;
}

export function GymCard({ gym, variant = "grid", distanceKm, priority }: Props) {
  const t = useTranslations("gym");
  const locale = useLocale() as "he" | "en";
  const isHe = locale === "he";
  const city = findCity(gym.city_slug);

  const name = isHe ? gym.name_he : gym.name_en;
  const neigh = isHe ? gym.neighborhood_he : gym.neighborhood_en;
  const cityName = isHe ? city?.name_he : city?.name_en;

  if (variant === "list") {
    return (
      <Link href={`/gyms/${gym.slug}`} className="group block">
        <article className="flex gap-4 p-3 rounded-xl border border-border bg-surface hover:shadow-md hover:border-border-strong transition-all">
          <div className="relative w-32 h-32 md:w-40 md:h-40 shrink-0 rounded-lg overflow-hidden bg-surface-2">
            <Image
              src={gym.cover_image}
              alt={name}
              fill
              sizes="(max-width: 768px) 128px, 160px"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              priority={priority}
            />
            {gym.premium && (
              <span className="absolute top-2 start-2 inline-flex items-center gap-1 bg-ink/85 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-1 rounded-full">
                <Sparkles className="size-3" />
                {t("premium")}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            <div className="flex items-start gap-2">
              <h3 className="text-[17px] font-bold leading-tight group-hover:text-brand transition-colors flex-1 truncate">
                {name}
              </h3>
              {gym.claimed && (
                <BadgeCheck
                  className="size-4 text-brand shrink-0 mt-0.5"
                  aria-label={t("claimed")}
                />
              )}
            </div>
            <div className="flex items-center gap-1.5 text-[13px] text-ink-muted">
              <MapPin className="size-3.5 shrink-0" />
              <span className="truncate">
                {neigh}, {cityName}
              </span>
              {typeof distanceKm === "number" && (
                <>
                  <span>•</span>
                  <span>{distanceKm.toFixed(1)} km</span>
                </>
              )}
            </div>
            <RatingStars
              value={gym.rating}
              count={gym.review_count}
              size="sm"
            />
            <div className="flex flex-wrap gap-1.5 mt-auto">
              {gym.discipline_slugs.slice(0, 3).map((slug) => {
                const d = findDiscipline(slug);
                if (!d) return null;
                return (
                  <DisciplinePill
                    key={slug}
                    color={d.pin_color}
                    size="sm"
                  >
                    {isHe ? d.name_he : d.name_en}
                  </DisciplinePill>
                );
              })}
              {gym.trial_class_available && (
                <span className="inline-flex items-center text-[11px] font-medium text-success bg-success/10 rounded-full h-6 px-2.5">
                  {gym.trial_class_price === 0
                    ? t("trial_free")
                    : t("trial_priced", { price: gym.trial_class_price })}
                </span>
              )}
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link href={`/gyms/${gym.slug}`} className="group block">
      <article className="flex flex-col gap-3">
        <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-surface-2">
          <Image
            src={gym.cover_image}
            alt={name}
            fill
            sizes="(max-width: 768px) 80vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            priority={priority}
          />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent" />
          {gym.premium && (
            <span className="absolute top-3 start-3 inline-flex items-center gap-1 bg-ink/85 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-1 rounded-full">
              <Sparkles className="size-3" />
              {t("premium")}
            </span>
          )}
          {gym.trial_class_available && gym.trial_class_price === 0 && (
            <span className="absolute top-3 end-3 bg-accent text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">
              {t("trial_free")}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2 px-1">
          <div className="flex items-start gap-2">
            <h3 className="font-bold leading-tight group-hover:text-brand transition-colors flex-1 line-clamp-1">
              {name}
            </h3>
            <RatingStars
              value={gym.rating}
              count={gym.review_count}
              size="sm"
              showValue
            />
          </div>
          <p className="text-[13px] text-ink-muted line-clamp-1 inline-flex items-center gap-1">
            <MapPin className="size-3.5" />
            {neigh}, {cityName}
            {typeof distanceKm === "number" && (
              <span className="ms-auto text-ink-subtle">
                {distanceKm.toFixed(1)} km
              </span>
            )}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {gym.discipline_slugs.slice(0, 3).map((slug) => {
              const d = findDiscipline(slug);
              if (!d) return null;
              return (
                <DisciplinePill
                  key={slug}
                  color={d.pin_color}
                  size="sm"
                >
                  {isHe ? d.name_he : d.name_en}
                </DisciplinePill>
              );
            })}
          </div>
        </div>
      </article>
    </Link>
  );
}

export function GymCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 animate-pulse">
      <div className="aspect-[4/3] rounded-xl bg-surface-2" />
      <div className="h-4 bg-surface-2 rounded w-2/3" />
      <div className="h-3 bg-surface-2 rounded w-1/2" />
      <div className="flex gap-2">
        <div className="h-5 w-14 bg-surface-2 rounded-full" />
        <div className="h-5 w-14 bg-surface-2 rounded-full" />
      </div>
    </div>
  );
}

// Used in non-translated contexts (server components without next-intl messages)
GymCard.displayName = "GymCard";
