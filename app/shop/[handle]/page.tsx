import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getProduct, getProducts } from "@/lib/mock/products";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductInfo } from "@/components/product/ProductInfo";
import { CONTENT } from "@/lib/content/pl";
import { cn } from "@/lib/utils";

const { pdp: c, product: pc, meta } = CONTENT;

interface Props {
  params: Promise<{ handle: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const product = getProduct(handle);
  if (!product) return {};
  return {
    title: `${product.shortName} — ${meta.siteTitle}`,
    description: `${product.notes.join(", ")} · ${product.origin}`,
  };
}

export default async function ProductPage({ params }: Props) {
  const { handle } = await params;
  const product = getProduct(handle);
  if (!product) notFound();

  const similar = getProducts()
    .filter((p) => p.handle !== handle)
    .slice(0, 3);

  const specRows: [string, string][] = [
    [c.specTable.country, product.origin],
    ...(product.producer ? [[c.specTable.producer, product.producer] as [string, string]] : []),
    ...(product.altitude ? [[c.specTable.altitude, product.altitude] as [string, string]] : []),
    ...(product.process ? [[c.specTable.process, product.process] as [string, string]] : []),
    ...(product.varietal ? [[c.specTable.varietal, product.varietal] as [string, string]] : []),
    [c.specTable.roast, product.roastLevel],
  ];

  return (
    <div>
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="px-5 lg:px-14 py-5 border-b border-line">
        <ol className="flex items-center gap-2 text-meta text-mute-2">
          <li>
            <Link
              href="/"
              className="hover:text-ink-hi transition-colors duration-[120ms]"
            >
              {c.breadcrumb.home}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link
              href="/shop"
              className="hover:text-ink-hi transition-colors duration-[120ms]"
            >
              {c.breadcrumb.shop}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-ink-hi">{product.shortName}</li>
        </ol>
      </nav>

      {/* Hero: gallery (left) + product info (right) */}
      <section className="border-b border-line lg:grid lg:grid-cols-[1.05fr_1fr]">
        {/* Gallery */}
        <div className="lg:border-r lg:border-line">
          {/* Mobile: full-bleed placeholder + dot pager */}
          <div className="relative h-[460px] bg-bg-soft overflow-hidden lg:hidden" aria-hidden="true">
            <div className="absolute inset-0 bg-bg-soft" />
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className={cn("h-0.5", i === 0 ? "w-5 bg-ink-hi" : "w-1.5 bg-line-2")}
                />
              ))}
            </div>
          </div>

          {/* Desktop: thumb rail + main image */}
          <div className="hidden lg:block p-12 pl-14 h-full" aria-hidden="true">
            <div className="grid grid-cols-[80px_1fr] gap-4 h-[720px]">
              <div className="flex flex-col gap-2">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-20 bg-bg-soft overflow-hidden cursor-pointer",
                      i === 0 ? "border border-ink-hi" : "border border-transparent"
                    )}
                  />
                ))}
              </div>
              <div className="relative bg-bg-soft overflow-hidden">
                <div className="absolute top-5 left-5 px-2.5 py-[5px] bg-bg text-[10px] font-medium uppercase tracking-[0.1em]">
                  {pc.lotPrefix} {product.lotCode}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product info — client component handles interactivity */}
        <ProductInfo product={product} />
      </section>

      {/* Profile + Brewing */}
      <section className="border-b border-line px-5 lg:px-14 py-16 lg:py-24 lg:grid lg:grid-cols-[1.2fr_1fr] lg:gap-20">
        {/* Profile / spec table */}
        <div>
          <p className="text-eyebrow mb-4">— {c.profileHeading}</p>
          <h2 className="text-h1 lg:text-h1-lg mb-6 lg:mb-8">{product.title}</h2>
          <dl>
            {specRows.map(([k, v]) => (
              <div
                key={k}
                className="grid grid-cols-[110px_1fr] lg:grid-cols-[180px_1fr] py-3.5 border-t border-line items-baseline"
              >
                <dt className="text-meta text-mute-2">{k}</dt>
                <dd className="text-[13.5px] lg:text-[14px] text-ink-hi">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Brewing cards + freshness promise */}
        <div className="mt-12 lg:mt-0">
          <p className="text-eyebrow mb-4">{c.brewingHeading}</p>
          <h2 className="text-h1 lg:text-h1-lg mb-7">{c.brewingSubheading}</h2>

          {product.brewing && product.brewing.length > 0 && (
            <div className="grid grid-cols-2 gap-3">
              {product.brewing.map((b) => (
                <div key={b.method} className="border border-line p-5 lg:p-[22px]">
                  <p className="text-h3 lg:text-h3-lg mb-2">{b.method}</p>
                  <p className="text-[12.5px] text-mute-2 tabular-nums leading-[1.5]">
                    {b.recipe}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 border border-ink-hi p-6">
            <p className="text-eyebrow mb-2.5">{c.freshnessLabel}</p>
            <p className="text-[14.5px] text-ink leading-[1.55]">{c.freshnessBody}</p>
          </div>
        </div>
      </section>

      {/* Similar coffees — extra bottom padding on mobile for sticky bar */}
      {similar.length > 0 && (
        <section className="px-5 lg:px-14 pt-12 lg:pt-16 pb-[120px] lg:pb-32">
          <div className="mb-8 lg:mb-10">
            <p className="text-eyebrow mb-3">{c.similarEyebrow(product.shortName)}</p>
            <h2 className="text-h2 lg:text-h2-lg">{c.similarHeading}</h2>
          </div>
          <ProductGrid products={similar} />
        </section>
      )}
    </div>
  );
}
