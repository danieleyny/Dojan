import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Rubik, Heebo, Inter } from "next/font/google";
import { routing, type Locale } from "@/i18n/routing";
import { TopNav } from "@/components/layout/TopNav";
import { BottomTabBar } from "@/components/layout/BottomTabBar";
import { Footer } from "@/components/layout/Footer";
import "../globals.css";

const rubik = Rubik({
  subsets: ["hebrew", "latin"],
  weight: ["500", "700", "800"],
  variable: "--font-rubik",
  display: "swap",
});

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heebo",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isHe = locale === "he";
  return {
    metadataBase: new URL("https://dojan.co.il"),
    title: {
      default: isHe
        ? "Dojan — אומנויות לחימה וכושר בישראל"
        : "Dojan — Martial Arts & Combat Fitness in Israel",
      template: isHe ? "%s | Dojan" : "%s | Dojan",
    },
    description: isHe
      ? "מצאי את המועדון, את הדיסציפלינה ואת המאמן/ת המתאימים לך. שיעורי ניסיון, ביקורות מאומתות, ומפה אינטראקטיבית."
      : "Find the gym, discipline, and coach that fit you. Trial classes, verified reviews, and an interactive map across Israel.",
    alternates: {
      canonical: locale === "he" ? "/" : `/${locale}`,
      languages: {
        he: "/",
        en: "/en",
        "x-default": "/",
      },
    },
    openGraph: {
      type: "website",
      siteName: "Dojan",
      locale: isHe ? "he_IL" : "en_US",
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const messages = await getMessages();
  const dir = locale === "he" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${rubik.variable} ${heebo.variable} ${inter.variable}`}
    >
      <body className="min-h-dvh bg-bg text-ink antialiased flex flex-col">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:start-3 focus:z-50 focus:bg-ink focus:text-white focus:px-4 focus:py-2 focus:rounded-lg"
          >
            {locale === "he" ? "דלג לתוכן" : "Skip to content"}
          </a>
          <TopNav />
          <main id="main" className="flex-1 pb-20 md:pb-0">
            {children}
          </main>
          <Footer />
          <BottomTabBar />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
