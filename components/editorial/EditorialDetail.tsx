import { Link } from "@/i18n/navigation";
import { Film, Clock, User } from "lucide-react";
import type { EditorialPost } from "@/data/editorial";
import { localizedBody, localizedField } from "@/data/editorial";
import { findDiscipline } from "@/data/disciplines";
import { findCoach } from "@/data/coaches";
import { findGym } from "@/data/gyms";
import { techniques as allTechniques } from "@/data/techniques";
import { DisciplinePill } from "@/components/ui/DisciplinePill";
import type { Locale } from "@/i18n/routing";

interface Props {
  post: EditorialPost;
  locale: Locale;
}

export function EditorialDetail({ post, locale }: Props) {
  const isHe = locale === "he";
  const bodyLocale: "he" | "en" = locale === "he" ? "he" : "en";

  const ld =
    post.type === "media_review"
      ? {
          "@context": "https://schema.org",
          "@type": "Review",
          itemReviewed: post.media
            ? { "@type": post.media.kind === "movie" ? "Movie" : "CreativeWork", name: post.media.name }
            : undefined,
          author: { "@type": "Person", name: post.author },
          datePublished: post.published_at,
        }
      : {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: localizedField(post, "title", locale),
          author: { "@type": "Person", name: post.author },
          datePublished: post.published_at,
        };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <header
        className="relative border-b border-border"
        style={{
          background: "linear-gradient(160deg, #0E1116 0%, #0F4C5C 100%)",
        }}
      >
        <div className="max-w-[900px] mx-auto px-4 md:px-8 py-16 md:py-24 text-white">
          {post.type === "media_review" && (
            <p className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] font-bold text-accent bg-accent/15 rounded-full px-3 py-1.5 mb-5">
              <Film className="size-3.5" />
              {post.media?.kind ?? "review"}
              {post.media?.year ? ` · ${post.media.year}` : ""}
            </p>
          )}
          <h1 className="display text-3xl md:text-5xl lg:text-6xl font-extrabold leading-[1.05]">
            {localizedField(post, "title", locale)}
          </h1>
          <p className="mt-4 text-white/80 text-lg max-w-2xl leading-relaxed">
            {localizedField(post, "excerpt", locale)}
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/70">
            <span className="inline-flex items-center gap-1.5"><User className="size-3.5" />{post.author}</span>
            <span className="inline-flex items-center gap-1.5"><Clock className="size-3.5" />{post.reading_minutes} {isHe ? "דק'" : "min"}</span>
            <span>{new Date(post.published_at).toLocaleDateString(isHe ? "he-IL" : "en-US", { year: "numeric", month: "short", day: "numeric" })}</span>
          </div>
        </div>
      </header>

      <article className="max-w-[760px] mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="prose prose-neutral max-w-none [&_p]:text-[17px] [&_p]:leading-[1.85] [&_p]:text-ink-muted [&_h2]:display [&_h2]:text-2xl [&_h2]:font-extrabold [&_h2]:text-ink [&_h2]:mt-12 [&_h2]:mb-4">
          {localizedBody(post, bodyLocale)
            .split("\n\n")
            .map((para, i) => {
              if (para.startsWith("## ")) {
                return <h2 key={i}>{para.slice(3)}</h2>;
              }
              return <p key={i}>{para}</p>;
            })}
        </div>

        {/* Related */}
        <aside className="mt-16 space-y-8 border-t border-border pt-10">
          {post.related_disciplines.length > 0 && (
            <Block title={isHe ? "אומנויות קשורות" : "Related disciplines"}>
              <div className="flex flex-wrap gap-2">
                {post.related_disciplines.map((slug) => {
                  const d = findDiscipline(slug);
                  if (!d) return null;
                  return (
                    <Link key={slug} href={`/disciplines/${slug}`}>
                      <DisciplinePill color={d.pin_color} size="md">
                        {isHe ? d.name_he : d.name_en}
                      </DisciplinePill>
                    </Link>
                  );
                })}
              </div>
            </Block>
          )}

          {post.related_gyms.length > 0 && (
            <Block title={isHe ? "מועדונים בהקשר" : "Gyms in this story"}>
              <ul className="space-y-2">
                {post.related_gyms.map((slug) => {
                  const g = findGym(slug);
                  if (!g) return null;
                  return (
                    <li key={slug}>
                      <Link href={`/gyms/${slug}`} className="text-brand hover:text-brand-700 text-sm font-semibold">
                        → {isHe ? g.name_he : g.name_en}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </Block>
          )}

          {post.related_coaches.length > 0 && (
            <Block title={isHe ? "מאמנים בהקשר" : "Coaches in this story"}>
              <ul className="space-y-2">
                {post.related_coaches.map((slug) => {
                  const c = findCoach(slug);
                  if (!c) return null;
                  return (
                    <li key={slug}>
                      <Link href={`/instructors/${slug}`} className="text-brand hover:text-brand-700 text-sm font-semibold">
                        → {isHe ? c.name_he : c.name_en}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </Block>
          )}

          {post.related_techniques.length > 0 && (
            <Block title={isHe ? "טכניקות שהוזכרו" : "Techniques mentioned"}>
              <ul className="space-y-2">
                {post.related_techniques.map((slug) => {
                  const t = findTechniqueAcross(slug);
                  if (!t) return null;
                  return (
                    <li key={slug}>
                      <Link href={`/techniques/${t.discipline_slug}/${t.slug}`} className="text-brand hover:text-brand-700 text-sm font-semibold">
                        → {isHe ? t.name_he : t.name_en}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </Block>
          )}
        </aside>
      </article>
    </>
  );
}

function findTechniqueAcross(slug: string) {
  return allTechniques.find((t) => t.slug === slug);
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-[11px] uppercase tracking-wider font-bold text-ink-subtle mb-3">{title}</h3>
      {children}
    </div>
  );
}
