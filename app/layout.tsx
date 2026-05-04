// Root layout exists only so Next.js can render `app/page.tsx` (the meta-refresh
// to /he/). Real layouts live in app/[locale]/layout.tsx.
export const metadata = {
  title: "Dojan",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
