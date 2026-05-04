"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, ArrowRight, Sparkles, Share2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { disciplines } from "@/data/disciplines";
import { cn } from "@/lib/utils";

interface Question {
  q: string;
  options: { label: string; tags: string[] }[];
}

export function QuizClient() {
  const t = useTranslations("quiz");
  const locale = useLocale() as "he" | "en";
  const isHe = locale === "he";
  const Arrow = isHe ? ArrowLeft : ArrowRight;
  const Back = isHe ? ArrowRight : ArrowLeft;
  const questions = t.raw("questions") as Question[];

  const [stage, setStage] = useState<"intro" | "quiz" | "result">("intro");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[][]>(
    questions.map(() => []),
  );

  const totalSteps = questions.length;

  function selectAnswer(tags: string[]) {
    const next = [...answers];
    next[step] = tags;
    setAnswers(next);
    setTimeout(() => {
      if (step + 1 < totalSteps) setStep(step + 1);
      else setStage("result");
    }, 200);
  }

  function recommendations() {
    const allTags = answers.flat();
    const score = (slug: string): number => {
      const d = disciplines.find((x) => x.slug === slug);
      if (!d) return 0;
      let s = 0;
      for (const tag of allTags) {
        if (d.good_for.includes(tag as never)) s += 4;
        if (tag === "high-contact" && d.contact_level >= 4) s += 3;
        if (tag === "low-contact" && d.contact_level <= 1) s += 3;
        if (tag === "medium-contact" && d.contact_level === 3) s += 2;
        if (tag === "ground" && (slug === "bjj" || slug === "judo" || slug === "wrestling")) s += 4;
        if (tag === "standing" && (slug === "boxing" || slug === "muay-thai" || slug === "karate" || slug === "taekwondo")) s += 4;
        if (tag === "competition" && d.good_for.includes("competition")) s += 3;
        if (tag === "joints" && (slug === "tai-chi" || slug === "karate" || slug === "boxing")) s += 2;
        if (tag === "intense" && d.contact_level >= 4) s += 2;
        if (tag === "technical" && (slug === "bjj" || slug === "karate" || slug === "judo" || slug === "aikido")) s += 2;
      }
      return s;
    };

    return disciplines
      .map((d) => ({ d, score: score(d.slug) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }

  if (stage === "intro") {
    return (
      <section className="max-w-3xl mx-auto px-4 md:px-8 py-16 md:py-28 text-center">
        <div className="size-20 mx-auto rounded-3xl bg-accent/15 grid place-items-center mb-6">
          <Sparkles className="size-9 text-accent" />
        </div>
        <h1 className="display text-4xl md:text-6xl font-extrabold leading-[1.05]">
          {t("title")}
        </h1>
        <p className="mt-4 text-ink-muted text-lg max-w-xl mx-auto">
          {t("subtitle")}
        </p>
        <Button
          onClick={() => setStage("quiz")}
          variant="ink"
          size="lg"
          className="mt-9"
        >
          {t("start")}
          <Arrow className="size-4" />
        </Button>
      </section>
    );
  }

  if (stage === "result") {
    const recs = recommendations();
    return (
      <section className="max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-20">
        <div className="text-center">
          <p className="text-[12px] uppercase tracking-[0.2em] font-semibold text-brand mb-3">
            <Sparkles className="inline size-3.5 me-1" />
            {t("result_title")}
          </p>
          <h1 className="display text-4xl md:text-6xl font-extrabold leading-[1.05]">
            {isHe
              ? "אלו המועדפות שלנו עבורך"
              : "These are your top matches"}
          </h1>
          <p className="mt-3 text-ink-muted max-w-xl mx-auto">
            {t("result_subtitle")}
          </p>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-5">
          {recs.map(({ d }, i) => (
            <Link
              key={d.slug}
              href={`/disciplines/${d.slug}`}
              className="group relative aspect-[3/4] rounded-3xl overflow-hidden block"
              style={{
                background: `linear-gradient(135deg, ${d.pin_color}, ${d.pin_color}c0)`,
              }}
            >
              <div className="absolute inset-0 grain opacity-50" />
              <div className="absolute inset-0 p-6 flex flex-col text-white">
                <span className="display text-7xl font-extrabold leading-none opacity-30">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="mt-auto">
                  <p className="text-[11px] uppercase tracking-widest opacity-80">
                    {isHe ? "התאמה גבוהה" : "Top match"}
                  </p>
                  <h3 className="display text-3xl md:text-4xl font-extrabold mt-2">
                    {isHe ? d.name_he : d.name_en}
                  </h3>
                  <p className="text-sm text-white/80 mt-2 line-clamp-3">
                    {isHe ? d.short_he : d.short_en}
                  </p>
                  <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold group-hover:gap-3 transition-all">
                    {isHe ? "המאמר המלא" : "Read article"}
                    <Arrow className="size-4" />
                  </div>
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link href="/search">
            <Button variant="ink" size="lg">
              {t("find_gyms")}
              <Arrow className="size-4" />
            </Button>
          </Link>
          <Button variant="outline" size="lg">
            <Share2 className="size-4" />
            {t("share")}
          </Button>
          <button
            onClick={() => {
              setStage("intro");
              setStep(0);
              setAnswers(questions.map(() => []));
            }}
            className="text-sm font-semibold text-ink-muted hover:text-ink inline-flex items-center gap-1"
          >
            <RotateCcw className="size-4" />
            {isHe ? "התחילי מחדש" : "Restart"}
          </button>
        </div>
      </section>
    );
  }

  // Quiz stage
  const q = questions[step];
  const progress = ((step + 1) / totalSteps) * 100;
  return (
    <section className="max-w-2xl mx-auto px-4 md:px-8 py-8 md:py-16">
      <div className="flex items-center justify-between text-sm text-ink-muted mb-3">
        <span className="font-semibold">
          {t("progress", { current: step + 1, total: totalSteps })}
        </span>
        {step > 0 && (
          <button
            onClick={() => setStep(step - 1)}
            className="inline-flex items-center gap-1 hover:text-ink"
          >
            <Back className="size-3.5" />
            {t("back")}
          </button>
        )}
      </div>
      <div className="h-1.5 bg-surface-2 rounded-full overflow-hidden">
        <div
          className="h-full bg-accent transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-12">
        <h1 className="display text-3xl md:text-5xl font-extrabold leading-[1.1]">
          {q.q}
        </h1>
        <ul className="mt-8 space-y-3">
          {q.options.map((opt) => {
            const selected = answers[step]?.[0] === opt.tags[0];
            return (
              <li key={opt.label}>
                <button
                  onClick={() => selectAnswer(opt.tags)}
                  className={cn(
                    "w-full text-start p-5 rounded-2xl border-2 transition-all",
                    "hover:border-ink hover:bg-surface-2/60",
                    selected
                      ? "border-ink bg-surface-2"
                      : "border-border bg-surface",
                  )}
                >
                  <span className="font-semibold text-[16px] md:text-lg">
                    {opt.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
