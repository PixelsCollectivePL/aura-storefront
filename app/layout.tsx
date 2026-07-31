import type { Metadata } from "next";
import localFont from "next/font/local";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/lib/cart/cart-context";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Toast } from "@/components/ui/Toast";
import { getProducts } from "@/lib/shopify";
import { ROBOTS_METADATA } from "@/lib/seo/indexing";
import { getSiteUrl } from "@/lib/seo/site-url";
import "./globals.css";

// Fractul is the single type family for the whole shop — it covers every role
// the design system used to split across three faces (display / sans / mono).
// Weights mirror the ones those faces provided, so no component needs to change.
const fractul = localFont({
  variable: "--font-fractul",
  display: "swap",
  src: [
    { path: "./fonts/Fractul-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Fractul-Italic.woff2", weight: "400", style: "italic" },
    { path: "./fonts/Fractul-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/Fractul-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "./fonts/Fractul-Bold.woff2", weight: "700", style: "normal" },
    { path: "./fonts/Fractul-ExtraBold.woff2", weight: "800", style: "normal" },
    { path: "./fonts/Fractul-Black.woff2", weight: "900", style: "normal" },
  ],
});

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: "Aura Coffee Roasters",
  description:
    "Kawa speciality palona w małych partiach co środę w Warszawie. Wysyłamy w ciągu 72 godzin od palenia.",
  // Not indexable until `AURA_ALLOW_INDEXING=true`. Inherited by every
  // route, so no page can opt itself in by accident.
  robots: ROBOTS_METADATA,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Search runs client-side inside the (client) Header, so the catalogue
  // is fetched here on the server and handed down. This keeps the private
  // Storefront token out of the browser bundle.
  const products = await getProducts({ first: 50 });

  return (
    <html
      lang="pl"
      className={`${fractul.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">
        <a href="#main-content" className="skip-link">
          Przejdź do treści
        </a>
        <CartProvider>
          <AnnouncementBar />
          <Header products={products} />
          <main id="main-content" className="flex-1" tabIndex={-1}>
            {children}
          </main>
          <Footer />
          <CartDrawer />
          <Toast />
        </CartProvider>
      </body>
    </html>
  );
}
