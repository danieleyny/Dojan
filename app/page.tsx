// Root is a static redirect to the Hebrew locale.
// With static export there's no server-side redirect — meta-refresh + canonical
// link is the cleanest option. Pages also picks up the basePath at build time
// via NEXT_PUBLIC_BASE_PATH, ensuring the redirect works at /Dojan/ on GH Pages.

import type { Metadata } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const target = `${basePath}/he/`;

export const metadata: Metadata = {
  title: "Dojan",
  alternates: { canonical: target },
  robots: { index: false },
  other: {
    "http-equiv": "refresh",
  },
};

export default function RootRedirect() {
  return (
    <>
      <meta httpEquiv="refresh" content={`0; url=${target}`} />
      <noscript>
        <a href={target}>Continue to Dojan →</a>
      </noscript>
      <script
        dangerouslySetInnerHTML={{
          __html: `window.location.replace(${JSON.stringify(target)});`,
        }}
      />
    </>
  );
}
