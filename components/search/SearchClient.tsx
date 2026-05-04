"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useTranslations, useLocale } from "next-intl";
import { Filter, X, Map as MapIcon, List, Sparkles, ChevronDown } from "lucide-react";
import { gyms as ALL_GYMS, type Gym } from "@/data/gyms";
import { disciplines } from "@/data/disciplines";
import { GymCard } from "@/components/ui/GymCard";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const SearchMap = dynamic(
  () => import("./SearchMap").then((m) => m.SearchMap),
  { ssr: false, loading: () => <MapSkeleton /> },
);

interface FilterState {
  disciplines: string[];
  age: "any" | "kids" | "teens" | "adults" | "women-only";
  level: "any" | "beginner" | "intermediate" | "advanced";
  trial: boolean;
  sort: "rating" | "distance" | "price";
}

const DEFAULT_FILTERS: FilterState = {
  disciplines: [],
  age: "any",
  level: "any",
  trial: false,
  sort: "rating",
};

export function SearchClient() {
  const t = useTranslations("search");
  const locale = useLocale() as "he" | "en";
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [hovered, setHovered] = useState<string | null>(null);
  const [view, setView] = useState<"list" | "map">("list");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = [...ALL_GYMS];
    if (filters.disciplines.length > 0) {
      list = list.filter((g) =>
        filters.disciplines.some((d) => g.discipline_slugs.includes(d)),
      );
    }
    if (filters.age !== "any") {
      list = list.filter((g) =>
        g.classes.some((c) =>
          filters.age === "kids"
            ? c.age_group.startsWith("kids")
            : filters.age === "teens"
              ? c.age_group === "teens"
              : filters.age === "adults"
                ? c.age_group === "adults"
                : c.age_group === "women-only",
        ),
      );
    }
    if (filters.level !== "any") {
      list = list.filter((g) =>
        g.classes.some(
          (c) => c.level === filters.level || c.level === "all-levels",
        ),
      );
    }
    if (filters.trial) {
      list = list.filter((g) => g.trial_class_available);
    }
    if (filters.sort === "rating") {
      list.sort((a, b) => b.rating - a.rating);
    } else if (filters.sort === "price") {
      list.sort((a, b) => a.price_min - b.price_min);
    }
    return list;
  }, [filters]);

  const activeFilterCount =
    filters.disciplines.length +
    (filters.age !== "any" ? 1 : 0) +
    (filters.level !== "any" ? 1 : 0) +
    (filters.trial ? 1 : 0);

  return (
    <>
      {/* Desktop top filter bar */}
      <div className="hidden lg:block border-b border-border bg-bg/95 backdrop-blur sticky top-16 z-30">
        <div className="max-w-[1600px] mx-auto px-6 py-3 flex items-center gap-3 overflow-x-auto no-scrollbar">
          <DisciplineFilter
            value={filters.disciplines}
            onChange={(disciplines) => setFilters({ ...filters, disciplines })}
          />
          <SelectChip
            label={t("filter_age")}
            value={filters.age}
            options={[
              ["any", t("filter_age")],
              ["kids", t("filter_age_options.kids")],
              ["teens", t("filter_age_options.teens")],
              ["adults", t("filter_age_options.adults")],
              ["women-only", t("filter_age_options.women-only")],
            ]}
            onChange={(v) => setFilters({ ...filters, age: v as FilterState["age"] })}
          />
          <SelectChip
            label={t("filter_level")}
            value={filters.level}
            options={[
              ["any", t("filter_level")],
              ["beginner", t("filter_level_options.beginner")],
              ["intermediate", t("filter_level_options.intermediate")],
              ["advanced", t("filter_level_options.advanced")],
            ]}
            onChange={(v) =>
              setFilters({ ...filters, level: v as FilterState["level"] })
            }
          />
          <ToggleChip
            label={t("filter_trial")}
            active={filters.trial}
            onClick={() => setFilters({ ...filters, trial: !filters.trial })}
          />
          {activeFilterCount > 0 && (
            <button
              onClick={() => setFilters(DEFAULT_FILTERS)}
              className="text-sm font-semibold text-ink-muted hover:text-ink ms-2 inline-flex items-center gap-1"
            >
              <X className="size-3.5" />
              {t("clear")}
            </button>
          )}
          <div className="ms-auto flex items-center gap-3 shrink-0">
            <SelectChip
              label={t("sort_by")}
              value={filters.sort}
              options={[
                ["rating", t("sort_options.rating")],
                ["distance", t("sort_options.distance")],
                ["price", t("sort_options.price")],
              ]}
              onChange={(v) =>
                setFilters({ ...filters, sort: v as FilterState["sort"] })
              }
            />
            <span className="text-sm text-ink-muted">
              {t("results_count", { count: filtered.length })}
            </span>
          </div>
        </div>
      </div>

      {/* Mobile filter & view bar */}
      <div className="lg:hidden border-b border-border sticky top-16 z-30 bg-bg/95 backdrop-blur">
        <div className="px-4 py-3 flex items-center gap-2">
          <button
            onClick={() => setFiltersOpen(true)}
            className="inline-flex items-center gap-2 h-10 px-3 rounded-full border border-border bg-surface text-sm font-medium"
          >
            <Filter className="size-4" />
            {t("show_filters")}
            {activeFilterCount > 0 && (
              <span className="size-5 rounded-full bg-accent text-white text-[10px] grid place-items-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
          <span className="text-xs text-ink-muted ms-auto">
            {t("results_count", { count: filtered.length })}
          </span>
          <div className="bg-surface rounded-full border border-border p-0.5 flex shrink-0">
            <button
              onClick={() => setView("list")}
              className={cn(
                "h-8 px-3 rounded-full inline-flex items-center gap-1 text-xs font-semibold",
                view === "list" ? "bg-ink text-white" : "text-ink-muted",
              )}
            >
              <List className="size-3.5" />
              {t("list")}
            </button>
            <button
              onClick={() => setView("map")}
              className={cn(
                "h-8 px-3 rounded-full inline-flex items-center gap-1 text-xs font-semibold",
                view === "map" ? "bg-ink text-white" : "text-ink-muted",
              )}
            >
              <MapIcon className="size-3.5" />
              {t("map")}
            </button>
          </div>
        </div>
      </div>

      {filtersOpen && (
        <MobileFilterDrawer
          filters={filters}
          onChange={setFilters}
          onClose={() => setFiltersOpen(false)}
          activeCount={activeFilterCount}
        />
      )}

      {/* Layout */}
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] xl:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-0">
        {/* Results list */}
        <section
          className={cn(
            "lg:max-h-[calc(100vh-128px)] lg:overflow-y-auto",
            view === "map" && "hidden lg:block",
          )}
        >
          <div className="max-w-[1000px] mx-auto px-4 lg:px-6 py-5 lg:py-7">
            {filtered.length === 0 ? (
              <EmptyState onClear={() => setFilters(DEFAULT_FILTERS)} />
            ) : (
              <ul className="space-y-3">
                {filtered.map((g) => (
                  <li
                    key={g.slug}
                    onMouseEnter={() => setHovered(g.slug)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <GymCard gym={g} variant="list" />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* Map */}
        <section
          className={cn(
            "lg:sticky lg:top-32 lg:h-[calc(100vh-128px)]",
            view === "list" && "hidden lg:block",
            "h-[calc(100vh-160px)]",
          )}
        >
          <SearchMap
            gyms={filtered}
            hoveredSlug={hovered}
            locale={locale}
            className="w-full h-full lg:rounded-tl-2xl"
          />
        </section>
      </div>
    </>
  );
}

function EmptyState({ onClear }: { onClear: () => void }) {
  const t = useTranslations("search");
  return (
    <div className="text-center py-16">
      <div className="size-16 mx-auto rounded-full bg-surface-2 grid place-items-center mb-4">
        <Sparkles className="size-7 text-ink-subtle" />
      </div>
      <h2 className="display text-2xl font-bold mb-2">{t("no_results_title")}</h2>
      <p className="text-ink-muted max-w-sm mx-auto mb-6">
        {t("no_results_subtitle")}
      </p>
      <Button onClick={onClear} variant="ink">
        {t("clear")}
      </Button>
    </div>
  );
}

function DisciplineFilter({
  value,
  onChange,
}: {
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("search");
  const locale = useLocale() as "he" | "en";

  const toggle = (slug: string) => {
    if (value.includes(slug)) onChange(value.filter((s) => s !== slug));
    else onChange([...value, slug]);
  };

  return (
    <div className="relative shrink-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "h-10 px-3.5 rounded-full text-sm font-medium border inline-flex items-center gap-2 transition-colors",
          value.length > 0
            ? "bg-ink text-white border-ink"
            : "bg-surface border-border hover:border-ink-muted",
        )}
      >
        {t("filter_disciplines")}
        {value.length > 0 && (
          <span className="bg-white/20 text-white text-[11px] font-bold size-5 rounded-full grid place-items-center">
            {value.length}
          </span>
        )}
        <ChevronDown className="size-3.5" />
      </button>
      {open && (
        <div className="absolute top-12 start-0 z-30 w-72 max-h-96 overflow-y-auto bg-surface border border-border rounded-2xl shadow-lg p-2">
          {disciplines.slice(0, 12).map((d) => {
            const active = value.includes(d.slug);
            return (
              <button
                key={d.slug}
                onClick={() => toggle(d.slug)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-start text-sm hover:bg-surface-2",
                  active && "bg-surface-2 font-semibold",
                )}
              >
                <span
                  className="size-2.5 rounded-full"
                  style={{ background: d.pin_color }}
                />
                <span className="flex-1">
                  {locale === "he" ? d.name_he : d.name_en}
                </span>
                {active && (
                  <span className="text-brand text-xs font-bold">✓</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SelectChip<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: [T, string][];
  onChange: (v: T) => void;
}) {
  return (
    <label className="relative shrink-0">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="h-10 ps-3.5 pe-9 appearance-none rounded-full border border-border bg-surface text-sm font-medium hover:border-ink-muted cursor-pointer transition-colors"
      >
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {v === "any" ? label : l}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute end-3 top-1/2 -translate-y-1/2 size-3.5 pointer-events-none" />
    </label>
  );
}

function ToggleChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "h-10 px-4 rounded-full text-sm font-medium border transition-colors shrink-0",
        active
          ? "bg-ink text-white border-ink"
          : "bg-surface border-border hover:border-ink-muted",
      )}
    >
      {label}
    </button>
  );
}

function MobileFilterDrawer({
  filters,
  onChange,
  onClose,
  activeCount,
}: {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  onClose: () => void;
  activeCount: number;
}) {
  const t = useTranslations("search");
  const locale = useLocale() as "he" | "en";

  return (
    <div className="lg:hidden fixed inset-0 z-50 flex flex-col bg-bg">
      <header className="flex items-center justify-between px-4 h-14 border-b border-border">
        <button onClick={onClose} className="-ms-2 p-2">
          <X className="size-5" />
        </button>
        <h2 className="font-semibold">{t("show_filters")}</h2>
        <button
          onClick={() => onChange(DEFAULT_FILTERS)}
          className="text-sm font-semibold text-ink-muted"
        >
          {t("clear")}
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-7">
        <div>
          <h3 className="font-semibold mb-3">{t("filter_disciplines")}</h3>
          <div className="flex flex-wrap gap-2">
            {disciplines.slice(0, 12).map((d) => {
              const active = filters.disciplines.includes(d.slug);
              return (
                <button
                  key={d.slug}
                  onClick={() =>
                    onChange({
                      ...filters,
                      disciplines: active
                        ? filters.disciplines.filter((s) => s !== d.slug)
                        : [...filters.disciplines, d.slug],
                    })
                  }
                  className={cn(
                    "h-9 px-3.5 rounded-full text-sm font-medium border transition-colors inline-flex items-center gap-2",
                    active
                      ? "bg-ink text-white border-ink"
                      : "bg-surface border-border",
                  )}
                >
                  <span
                    className="size-2 rounded-full"
                    style={{ background: d.pin_color }}
                  />
                  {locale === "he" ? d.name_he : d.name_en}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3">{t("filter_age")}</h3>
          <div className="grid grid-cols-2 gap-2">
            {(["any", "kids", "teens", "adults", "women-only"] as const).map((v) => (
              <button
                key={v}
                onClick={() => onChange({ ...filters, age: v })}
                className={cn(
                  "h-11 rounded-xl border text-sm font-medium",
                  filters.age === v
                    ? "bg-ink text-white border-ink"
                    : "bg-surface border-border",
                )}
              >
                {v === "any"
                  ? locale === "he"
                    ? "כל הגילאים"
                    : "Any age"
                  : t(`filter_age_options.${v}`)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3">{t("filter_level")}</h3>
          <div className="grid grid-cols-2 gap-2">
            {(["any", "beginner", "intermediate", "advanced"] as const).map((v) => (
              <button
                key={v}
                onClick={() => onChange({ ...filters, level: v })}
                className={cn(
                  "h-11 rounded-xl border text-sm font-medium",
                  filters.level === v
                    ? "bg-ink text-white border-ink"
                    : "bg-surface border-border",
                )}
              >
                {v === "any"
                  ? locale === "he"
                    ? "כל הרמות"
                    : "Any level"
                  : t(`filter_level_options.${v}`)}
              </button>
            ))}
          </div>
        </div>

        <label className="flex items-center justify-between p-4 rounded-xl border border-border bg-surface">
          <span className="font-medium">{t("filter_trial")}</span>
          <input
            type="checkbox"
            checked={filters.trial}
            onChange={(e) => onChange({ ...filters, trial: e.target.checked })}
            className="size-5 accent-brand"
          />
        </label>
      </div>

      <footer className="border-t border-border p-4">
        <Button onClick={onClose} variant="ink" size="lg" className="w-full">
          {t("results_count", { count: 0 }).replace("0", "")}
          {locale === "he" ? "הצג תוצאות" : "Show results"}
          {activeCount > 0 && ` (${activeCount})`}
        </Button>
      </footer>
    </div>
  );
}

function MapSkeleton() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-surface-2 to-bg grid place-items-center">
      <div className="text-ink-subtle text-sm">Loading map…</div>
    </div>
  );
}
