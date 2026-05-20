"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { Filter, Mail, Phone, Search, ShieldAlert, X } from "lucide-react";
import { findGym } from "@/data/gyms";
import { findCoach } from "@/data/coaches";
import { cn } from "@/lib/utils";

interface Lead {
  id: string;
  inquiry_type: string;
  gym_slug?: string;
  coach_slug?: string;
  discipline_slug?: string;
  city_slug?: string;
  participant_name?: string;
  participant_phone?: string;
  participant_email?: string;
  notes?: string;
  preferred_date?: string;
  source_locale?: string;
  source_url?: string;
  source_referrer?: string;
  created_at: string;
  status: "requested" | "confirmed" | "completed" | "lost";
  lead_score?: number;
  follow_ups?: { at: string; note: string }[];
}

const INQUIRY_LABELS_HE: Record<string, string> = {
  trial: "ניסיון", package: "חבילה", private: "פרטי",
  corporate: "ארגוני", tourism: "תיירות", women_only: "נשים בלבד", general: "כללי",
};
const INQUIRY_LABELS_EN: Record<string, string> = {
  trial: "Trial", package: "Package", private: "Private",
  corporate: "Corporate", tourism: "Tourism", women_only: "Women-only", general: "General",
};

export function LeadInboxClient() {
  const locale = useLocale() as "he" | "en" | "ar" | "es" | "fr";
  const isHe = locale === "he";
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selected, setSelected] = useState<Lead | null>(null);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("dojan_leads") ?? "[]");
      // If empty, seed a few mock leads so the inbox isn't empty on first visit
      if (stored.length === 0) {
        const mock = MOCK_LEADS();
        localStorage.setItem("dojan_leads", JSON.stringify(mock));
        setLeads(mock);
      } else {
        setLeads(stored);
      }
    } catch {
      setLeads([]);
    }
  }, []);

  const filtered = useMemo(
    () =>
      leads.filter((l) => {
        if (filterType !== "all" && l.inquiry_type !== filterType) return false;
        if (filterStatus !== "all" && l.status !== filterStatus) return false;
        if (search) {
          const q = search.toLowerCase();
          return (
            l.participant_name?.toLowerCase().includes(q) ||
            l.participant_email?.toLowerCase().includes(q) ||
            l.gym_slug?.toLowerCase().includes(q) ||
            l.notes?.toLowerCase().includes(q)
          );
        }
        return true;
      }),
    [leads, filterType, filterStatus, search],
  );

  const types = Array.from(new Set(leads.map((l) => l.inquiry_type)));
  const labels = isHe ? INQUIRY_LABELS_HE : INQUIRY_LABELS_EN;

  const newCount = leads.filter((l) => l.status === "requested").length;

  return (
    <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-8">
      <header className="flex items-end justify-between gap-4 mb-6">
        <div>
          <p className="text-[12px] uppercase tracking-[0.18em] font-semibold text-accent inline-flex items-center gap-1.5">
            <ShieldAlert className="size-3.5" />
            {isHe ? "ניהול בלבד" : "Admin only"}
          </p>
          <h1 className="display text-3xl md:text-4xl font-extrabold leading-tight mt-1">
            {isHe ? "תיבת לידים" : "Lead Inbox"}
          </h1>
          <p className="text-ink-muted mt-1">
            {leads.length} {isHe ? "סה\"כ" : "total"} · {newCount}{" "}
            <span className="text-accent font-semibold">{isHe ? "חדשים" : "new"}</span>
          </p>
        </div>
        <span className="text-[11px] uppercase tracking-wider bg-accent/10 text-accent rounded-full px-2.5 py-1 font-bold">
          {isHe ? "תצוגה" : "Demo"}
        </span>
      </header>

      {/* Filter bar */}
      <div className="rounded-2xl border border-border bg-surface p-3 mb-4 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-ink-subtle" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={isHe ? "חפש לפי שם, אימייל, מועדון" : "Search by name, email, gym"}
            className="w-full h-9 ps-9 pe-3 rounded-lg border border-border bg-bg text-sm focus:border-ink-muted outline-none"
          />
        </div>
        <Pill label={isHe ? "כל הסוגים" : "All types"} active={filterType === "all"} onClick={() => setFilterType("all")} />
        {types.map((t) => (
          <Pill key={t} label={labels[t] ?? t} active={filterType === t} onClick={() => setFilterType(t)} />
        ))}
        <span className="mx-1 w-px h-5 bg-border" />
        {(["all", "requested", "confirmed", "completed", "lost"] as const).map((s) => (
          <Pill
            key={s}
            label={s === "all" ? (isHe ? "כל הסטטוסים" : "All status") : statusLabel(s, isHe)}
            active={filterStatus === s}
            onClick={() => setFilterStatus(s)}
            color={s === "requested" ? "accent" : s === "confirmed" ? "brand" : s === "completed" ? "success" : undefined}
          />
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_400px] gap-5">
        {/* Lead list */}
        <div className="rounded-2xl border border-border bg-surface overflow-hidden">
          <div className="hidden md:grid grid-cols-[1.2fr_1fr_0.8fr_0.7fr_0.5fr] gap-3 px-5 py-2.5 border-b border-border bg-surface-2 text-[11px] uppercase tracking-wider font-bold text-ink-subtle">
            <span>{isHe ? "שולח/ת" : "Lead"}</span>
            <span>{isHe ? "מטרה / יעד" : "Target"}</span>
            <span>{isHe ? "סוג" : "Type"}</span>
            <span>{isHe ? "סטטוס" : "Status"}</span>
            <span className="text-end">{isHe ? "ציון" : "Score"}</span>
          </div>
          <ul className="divide-y divide-border">
            {filtered.length === 0 && (
              <li className="px-6 py-10 text-center text-ink-muted">
                {isHe ? "אין לידים תואמים" : "No matching leads"}
              </li>
            )}
            {filtered.map((l) => {
              const gym = l.gym_slug ? findGym(l.gym_slug) : null;
              const coach = l.coach_slug ? findCoach(l.coach_slug) : null;
              const targetName = gym
                ? (isHe ? gym.name_he : gym.name_en)
                : coach
                  ? (isHe ? coach.name_he : coach.name_en)
                  : l.city_slug
                    ? l.city_slug
                    : "—";
              const score = l.lead_score ?? 50;
              return (
                <li key={l.id}>
                  <button
                    onClick={() => setSelected(l)}
                    className={cn(
                      "w-full text-start grid md:grid-cols-[1.2fr_1fr_0.8fr_0.7fr_0.5fr] gap-3 px-5 py-3.5 hover:bg-surface-2 transition-colors items-center",
                      selected?.id === l.id && "bg-surface-2",
                    )}
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-[14px] truncate">
                        {l.participant_name ?? "Anonymous"}
                      </p>
                      <p className="text-[12px] text-ink-muted truncate">
                        {l.participant_email}
                      </p>
                    </div>
                    <p className="text-[13px] truncate text-ink-muted">{targetName}</p>
                    <span className="text-[12px] font-semibold inline-flex w-fit rounded-full bg-surface-2 px-2 py-0.5">
                      {labels[l.inquiry_type] ?? l.inquiry_type}
                    </span>
                    <span
                      className={cn(
                        "text-[11px] font-bold uppercase inline-flex w-fit rounded-full px-2 py-0.5",
                        l.status === "requested" && "bg-accent/10 text-accent",
                        l.status === "confirmed" && "bg-brand/10 text-brand",
                        l.status === "completed" && "bg-success/10 text-success",
                        l.status === "lost" && "bg-danger/10 text-danger",
                      )}
                    >
                      {statusLabel(l.status, isHe)}
                    </span>
                    <span className="text-end">
                      <ScoreBadge score={score} />
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Side panel */}
        <aside className="lg:sticky lg:top-24 self-start">
          {!selected ? (
            <div className="rounded-2xl border border-dashed border-border bg-surface p-8 text-center text-ink-muted h-[400px] grid place-items-center">
              <div>
                <Filter className="size-7 mx-auto mb-2" />
                <p className="text-sm">
                  {isHe ? "בחר/י ליד לצפייה בפרטים" : "Select a lead to view details"}
                </p>
              </div>
            </div>
          ) : (
            <LeadDetail
              lead={selected}
              onClose={() => setSelected(null)}
              onUpdate={(updated) => {
                const next = leads.map((l) => (l.id === updated.id ? updated : l));
                setLeads(next);
                localStorage.setItem("dojan_leads", JSON.stringify(next));
                setSelected(updated);
              }}
              isHe={isHe}
            />
          )}
        </aside>
      </div>
    </div>
  );
}

function LeadDetail({
  lead,
  onClose,
  onUpdate,
  isHe,
}: {
  lead: Lead;
  onClose: () => void;
  onUpdate: (l: Lead) => void;
  isHe: boolean;
}) {
  const gym = lead.gym_slug ? findGym(lead.gym_slug) : null;
  const coach = lead.coach_slug ? findCoach(lead.coach_slug) : null;
  const labels = isHe ? INQUIRY_LABELS_HE : INQUIRY_LABELS_EN;
  return (
    <div className="rounded-2xl border border-border bg-surface overflow-hidden">
      <header className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-ink-subtle font-bold">
            {labels[lead.inquiry_type] ?? lead.inquiry_type}
          </p>
          <h2 className="font-bold text-lg leading-tight">
            {lead.participant_name ?? "Anonymous"}
          </h2>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-surface-2 rounded-lg">
          <X className="size-4" />
        </button>
      </header>
      <div className="p-5 space-y-4 text-sm">
        <Row k={isHe ? "אימייל" : "Email"} v={lead.participant_email} icon={<Mail className="size-3.5" />} />
        <Row k={isHe ? "טלפון" : "Phone"} v={lead.participant_phone} icon={<Phone className="size-3.5" />} />
        {gym && <Row k={isHe ? "מועדון" : "Gym"} v={isHe ? gym.name_he : gym.name_en} />}
        {coach && <Row k={isHe ? "מאמן" : "Coach"} v={isHe ? coach.name_he : coach.name_en} />}
        {lead.preferred_date && <Row k={isHe ? "תאריך מועדף" : "Preferred date"} v={lead.preferred_date} />}
        {lead.notes && <Row k={isHe ? "הערות" : "Notes"} v={lead.notes} block />}
        <Row k={isHe ? "שפה" : "Source locale"} v={lead.source_locale} />
        <Row k={isHe ? "מקור" : "Source"} v={lead.source_referrer || "(direct)"} />
        <Row k={isHe ? "התקבל" : "Received"} v={new Date(lead.created_at).toLocaleString()} />
      </div>
      <div className="border-t border-border p-4 space-y-2 bg-surface-2">
        <p className="text-[11px] uppercase tracking-wider font-bold text-ink-subtle">
          {isHe ? "פעולות" : "Actions"}
        </p>
        <div className="grid grid-cols-2 gap-2">
          <ActionButton
            label={isHe ? "אשר" : "Confirm"}
            color="brand"
            disabled={lead.status === "confirmed"}
            onClick={() => onUpdate({ ...lead, status: "confirmed" })}
          />
          <ActionButton
            label={isHe ? "סמן כהגיע/ה" : "Mark completed"}
            color="success"
            disabled={lead.status === "completed"}
            onClick={() => onUpdate({ ...lead, status: "completed" })}
          />
          <ActionButton
            label={isHe ? "אבד" : "Lost"}
            color="danger"
            disabled={lead.status === "lost"}
            onClick={() => onUpdate({ ...lead, status: "lost" })}
          />
          <ActionButton
            label={isHe ? "החזר לחדש" : "Re-open"}
            disabled={lead.status === "requested"}
            onClick={() => onUpdate({ ...lead, status: "requested" })}
          />
        </div>
      </div>
    </div>
  );
}

function Row({ k, v, icon, block }: { k: string; v?: string; icon?: React.ReactNode; block?: boolean }) {
  if (!v) return null;
  return (
    <div className={cn("flex gap-2", block ? "flex-col" : "items-baseline justify-between")}>
      <span className="text-[12px] font-semibold uppercase tracking-wider text-ink-subtle inline-flex items-center gap-1.5">
        {icon}
        {k}
      </span>
      <span className={cn("text-ink", block && "text-[13px] leading-relaxed bg-surface-2 rounded-md p-2.5")}>
        {v}
      </span>
    </div>
  );
}

function Pill({ label, active, onClick, color }: { label: string; active: boolean; onClick: () => void; color?: "accent" | "brand" | "success" }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "h-8 px-3 rounded-full text-xs font-semibold transition-colors",
        active
          ? color === "accent" ? "bg-accent text-white"
            : color === "brand" ? "bg-brand text-white"
            : color === "success" ? "bg-success text-white"
            : "bg-ink text-white"
          : "bg-surface-2 text-ink-muted hover:bg-border",
      )}
    >
      {label}
    </button>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const tone =
    score >= 80 ? "bg-success/15 text-success"
    : score >= 60 ? "bg-warning/15 text-warning"
    : "bg-ink-subtle/15 text-ink-subtle";
  return (
    <span className={`inline-flex items-center justify-center rounded-full px-2 py-0.5 text-[11px] font-bold ${tone}`}>
      {score}
    </span>
  );
}

function ActionButton({ label, color, disabled, onClick }: { label: string; color?: "brand" | "success" | "danger"; disabled?: boolean; onClick: () => void }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "h-9 rounded-lg text-xs font-semibold transition-colors",
        disabled && "opacity-40 cursor-not-allowed",
        !disabled && color === "brand" && "bg-brand text-white hover:bg-brand-700",
        !disabled && color === "success" && "bg-success text-white hover:bg-success/85",
        !disabled && color === "danger" && "bg-danger text-white hover:bg-danger/85",
        !disabled && !color && "border border-border bg-surface hover:bg-surface-2",
      )}
    >
      {label}
    </button>
  );
}

function statusLabel(s: string, isHe: boolean): string {
  if (isHe) {
    return { requested: "חדש", confirmed: "אושר", completed: "הושלם", lost: "אבד" }[s] ?? s;
  }
  return { requested: "New", confirmed: "Confirmed", completed: "Completed", lost: "Lost" }[s] ?? s;
}

function MOCK_LEADS(): Lead[] {
  const now = new Date();
  const ago = (h: number) => new Date(now.getTime() - h * 3600 * 1000).toISOString();
  return [
    {
      id: "m1", inquiry_type: "trial", gym_slug: "iron-dojo-tel-aviv",
      participant_name: "מירב כהן", participant_phone: "+972-50-1234567", participant_email: "meirav@example.com",
      notes: "אני מתחילה לחלוטין, אין רקע ספורטיבי. מעוניינת בשיעור BJJ.",
      preferred_date: "2026-05-22", source_locale: "he",
      created_at: ago(2), status: "requested", lead_score: 78,
    },
    {
      id: "m2", inquiry_type: "package", participant_name: "Marie Dubois",
      participant_phone: "+33-6-22-44-55-66", participant_email: "marie.d@example.com",
      notes: "Visiting Tel Aviv for 2 weeks in June, want to train Krav Maga 4×/week.",
      preferred_date: "2026-06-10", source_locale: "fr",
      created_at: ago(8), status: "requested", lead_score: 88,
    },
    {
      id: "m3", inquiry_type: "private", coach_slug: "shira-mizrahi",
      participant_name: "Sarah Levin", participant_phone: "+972-54-9876543", participant_email: "sarah.l@example.com",
      notes: "Looking for 8 1-on-1 sessions over 4 weeks, women-only.",
      source_locale: "en",
      created_at: ago(18), status: "confirmed", lead_score: 92,
    },
    {
      id: "m4", inquiry_type: "corporate", participant_name: "Tomás Pérez",
      participant_phone: "+34-655-12-34-56", participant_email: "tperez@empresa.es",
      notes: "Team retreat for 12 engineers, want 2 Krav Maga sessions during a 3-day Tel Aviv visit.",
      source_locale: "es",
      created_at: ago(36), status: "requested", lead_score: 71,
    },
    {
      id: "m5", inquiry_type: "tourism", participant_name: "أحمد طارق",
      participant_phone: "+971-50-555-1212", participant_email: "ahmed.t@example.ae",
      notes: "حصص MMA لمدة أسبوع، يفضل الإنجليزية.",
      source_locale: "ar",
      created_at: ago(60), status: "completed", lead_score: 65,
    },
    {
      id: "m6", inquiry_type: "trial", gym_slug: "krav-maga-rothschild",
      participant_name: "יואב אזולאי", participant_phone: "+972-54-1112233", participant_email: "yoav.az@example.com",
      source_locale: "he",
      created_at: ago(72), status: "lost", lead_score: 42,
    },
  ];
}
