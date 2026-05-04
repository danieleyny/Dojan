import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";

interface Props {
  kicker?: string;
  title: string;
  subtitle?: string;
  href?: string;
  cta?: string;
  align?: "start" | "center";
}

export function SectionHeader({ kicker, title, subtitle, href, cta, align = "start" }: Props) {
  const locale = useLocale();
  const Arrow = locale === "he" ? ArrowLeft : ArrowRight;
  return (
    <div
      className={`flex flex-col md:flex-row md:items-end gap-3 ${
        align === "center" ? "text-center md:flex-col md:items-center" : ""
      }`}
    >
      <div className="flex-1">
        {kicker && (
          <p className="text-[12px] uppercase tracking-[0.14em] font-semibold text-brand-500 mb-2">
            {kicker}
          </p>
        )}
        <h2 className="display text-[26px] md:text-[36px] font-extrabold leading-[1.05] text-ink">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 text-ink-muted max-w-xl text-[15px] md:text-base leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {href && cta && (
        <Link
          href={href as never}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:gap-2.5 transition-all"
        >
          {cta}
          <Arrow className="size-4" />
        </Link>
      )}
    </div>
  );
}
