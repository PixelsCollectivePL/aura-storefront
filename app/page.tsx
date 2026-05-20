import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { ProductCard } from "@/components/product/ProductCard";
import { CONTENT } from "@/lib/content/pl";
import { cn } from "@/lib/utils";
import { MOCK_PRODUCTS } from "@/lib/mock/products";

const { homepage: hp } = CONTENT;
const { hero: h, shelf, howItWorks: hiw, promise: pr, reviews: rv, ctaBanner: cta } = hp;

const FEATURED = MOCK_PRODUCTS.slice(0, 3);

export default function HomePage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="border-b border-line">
        <div className="grid lg:grid-cols-2 min-h-[560px] lg:min-h-[720px]">
          {/* Text — second on mobile (below image), first on desktop */}
          <div className={cn(
            "px-5 py-12 lg:px-20 lg:py-[120px]",
            "flex flex-col justify-center",
            "order-2 lg:order-1"
          )}>
            <p className="text-eyebrow mb-5 lg:mb-7">{h.eyebrow}</p>
            <h1 className={cn("text-display lg:text-display-lg", "mb-5 lg:mb-7")}>
              {h.headingL1}<br />{h.headingL2}<br />{h.headingL3}
            </h1>
            <p className="text-[14.5px] lg:text-body-lg text-mute-2 leading-[1.6] max-w-[320px] lg:max-w-[440px] mb-7 lg:mb-11">
              {h.subheading}
            </p>
            <div className="flex gap-2.5 lg:gap-3">
              <Button
                variant="primary"
                size="lg"
                className="flex-1 lg:flex-none"
                aria-label={h.ctaPrimary}
              >
                {h.ctaPrimary}
                <Icon.arrow size={18} />
              </Button>
              <Button variant="ghost" size="lg" className="hidden lg:inline-flex">
                {h.ctaSecondary}
              </Button>
            </div>
          </div>

          {/* Hero image — full bleed, first on mobile */}
          <div className={cn(
            "bg-bg-soft relative overflow-hidden",
            "h-[320px] lg:h-auto",
            "order-1 lg:order-2"
          )}>
            {/* Image placeholder — replaced with next/image in Phase 2 */}
            <div className="absolute inset-0 bg-bg-soft-2" />
            <div className="absolute inset-0 flex items-end p-6 lg:p-10">
              <p className="text-[11px] tracking-[0.12em] uppercase text-mute">
                {h.imageCaption}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured shelf ── */}
      <section className="px-5 lg:px-14 pt-[72px] lg:pt-[120px] pb-0">
        <div className="flex items-baseline justify-between mb-6 lg:mb-3">
          <div>
            <p className="text-eyebrow mb-2.5 lg:mb-3">{shelf.eyebrow}</p>
            <h2 className="text-h2 lg:text-h2-lg">{shelf.heading}</h2>
          </div>
          <Link
            href="/shop"
            className="text-[11.5px] text-mute-2 underline underline-offset-4 hover:text-ink-hi transition-colors duration-[120ms] focus-visible:outline-2 focus-visible:outline-ink-hi focus-visible:outline-offset-2"
          >
            <span className="hidden sm:inline">{shelf.viewAll}</span>
            <span className="sm:hidden">{shelf.viewAllMobile}</span>
          </Link>
        </div>
        <p className="hidden lg:block text-mute-2 text-body max-w-xl mb-[56px]">
          {shelf.description}
        </p>
      </section>

      <section className="px-5 lg:px-14 pt-8 lg:pt-0 pb-[80px] lg:pb-[120px]">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-9 lg:gap-x-8 lg:gap-y-[60px]">
          {FEATURED.map((product) => (
            <ProductCard key={product.handle} product={product} />
          ))}
          {/* 4th card on mobile only */}
          <div className="lg:hidden">
            <ProductCard product={MOCK_PRODUCTS[3]} />
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="border-t border-line px-5 lg:px-14 py-16 lg:py-[120px] bg-bg-soft">
        <p className="text-eyebrow mb-3 lg:mb-4">{hiw.eyebrow}</p>
        <h2 className="text-h2 lg:text-h2-lg mb-10 lg:mb-16 max-w-lg">{hiw.heading}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-10 gap-x-8 lg:gap-x-16">
          {hiw.steps.map((step) => (
            <div key={step.n}>
              <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-mute mb-4 lg:mb-5">
                {step.n}
              </p>
              <h3 className={cn(
                "font-medium leading-[1.2] tracking-[-0.014em] text-ink-hi mb-3",
                "text-[17px] lg:text-[20px]"
              )}>
                {step.title}
              </h3>
              <p className="text-body text-mute-2 leading-[1.6]">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Promise (dark panel) ── */}
      <section className="bg-ink-hi text-ink-inv px-5 lg:px-14 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          <div>
            <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-ink-inv/50 mb-4">
              {pr.eyebrow}
            </p>
            <h2 className={cn(
              "font-medium leading-[1.05] tracking-[-0.022em] text-ink-inv",
              "text-[28px] lg:text-[44px]",
              "mb-5 lg:mb-7 max-w-lg"
            )}>
              {pr.headingL1}<br />{pr.headingL2}
            </h2>
            <p className="text-[14.5px] lg:text-body-lg text-ink-inv/70 leading-[1.6] max-w-md">
              {pr.body}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-px bg-ink-inv/10">
            {hp.trustItems.map((item) => (
              <div key={item.label} className="bg-ink-hi px-6 py-7 lg:px-8 lg:py-9">
                <p className={cn(
                  "font-medium text-ink-inv mb-1.5",
                  "text-[15px] lg:text-[17px] leading-[1.2] tracking-[-0.014em]"
                )}>
                  {item.label}
                </p>
                <p className="text-[12.5px] text-ink-inv/60 leading-[1.5]">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Reviews ── */}
      <section className="border-t border-line px-5 lg:px-14 py-16 lg:py-24">
        <p className="text-eyebrow mb-3">{rv.eyebrow}</p>
        <h2 className="text-h2 lg:text-h2-lg mb-10 lg:mb-14">{rv.heading}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-line">
          {rv.items.map((review) => (
            <div key={review.name} className="bg-bg px-6 py-7 lg:px-8 lg:py-9 flex flex-col gap-4">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className="text-ink-hi text-[13px]">★</span>
                ))}
              </div>
              <p className="text-body text-ink leading-[1.6] flex-1">&ldquo;{review.text}&rdquo;</p>
              <div>
                <p className="text-[13px] font-medium text-ink-hi">{review.name}</p>
                <p className="text-[11.5px] text-mute-2">{review.location}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA banner ── */}
      <section className="border-t border-line px-5 lg:px-14 py-16 lg:py-24 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div>
          <p className="text-eyebrow mb-3">{cta.eyebrow}</p>
          <h2 className="text-h2 lg:text-h2-lg max-w-sm">{cta.heading}</h2>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/shop"
            className={cn(
              "inline-flex items-center justify-center gap-2.5",
              "font-sans font-medium text-[15px] leading-[1.6] whitespace-nowrap",
              "px-7 py-5 min-h-[60px]",
              "bg-ink-hi text-ink-inv",
              "hover:bg-black transition-colors duration-[120ms]",
              "focus-visible:outline-2 focus-visible:outline-ink-hi focus-visible:outline-offset-2"
            )}
          >
            {cta.ctaPrimary}
          </Link>
          <Link
            href="/about"
            className={cn(
              "inline-flex items-center justify-center gap-2.5",
              "font-sans font-medium text-[15px] leading-[1.6] whitespace-nowrap",
              "px-7 py-5 min-h-[60px]",
              "bg-transparent text-ink-hi border border-line",
              "hover:border-ink-hi transition-colors duration-[120ms]",
              "focus-visible:outline-2 focus-visible:outline-ink-hi focus-visible:outline-offset-2"
            )}
          >
            {cta.ctaSecondary}
          </Link>
        </div>
      </section>
    </>
  );
}
