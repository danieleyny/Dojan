import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  const locale = useLocale() as "he" | "en";
  const isHe = locale === "he";
  return (
    <section className="min-h-[60vh] grid place-items-center text-center px-4">
      <div>
        <p className="display text-[120px] font-extrabold leading-none text-brand/20">
          404
        </p>
        <h1 className="display text-3xl md:text-4xl font-extrabold mt-2">
          {isHe ? "הדף לא נמצא" : "Page not found"}
        </h1>
        <p className="text-ink-muted mt-3 max-w-md">
          {isHe
            ? "הקישור שעקבת אחריו לא קיים. אולי תרצי לחזור הביתה ולחפש מחדש."
            : "The link you followed doesn't exist. Try heading home and searching again."}
        </p>
        <Link href="/">
          <Button variant="ink" className="mt-6">
            {isHe ? "חזרי לדף הבית" : "Back home"}
          </Button>
        </Link>
      </div>
    </section>
  );
}
