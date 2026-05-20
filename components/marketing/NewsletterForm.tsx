"use client";

import { cn } from "@/lib/utils";
import { CONTENT } from "@/lib/content/pl";

const { newsletter: nl } = CONTENT.homepage;

/**
 * NewsletterForm — Client Component.
 * UI shell only; no backend connected (Phase 1 placeholder).
 * [shopify-ready]: wire up Klaviyo / Shopify marketing in Phase 2.
 */
export function NewsletterForm() {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="flex flex-col sm:flex-row gap-3 max-w-[480px]"
    >
      <input
        type="email"
        placeholder={nl.placeholder}
        aria-label="Adres e-mail"
        className={cn(
          "flex-1 min-w-0 h-12 px-5",
          "bg-white/15 text-white placeholder:text-white/50",
          "border border-white/30 rounded-pill",
          "text-[14px] outline-none",
          "focus:border-white focus:bg-white/20",
          "transition-colors duration-[120ms]"
        )}
      />
      <button
        type="submit"
        className={cn(
          "h-12 px-6 shrink-0",
          "bg-ink text-white rounded-pill border border-ink",
          "text-[14px] font-semibold",
          "hover:bg-ink/80 hover:border-ink/80",
          "transition-colors duration-[150ms] cursor-pointer",
          "focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2",
          "whitespace-nowrap"
        )}
      >
        {nl.cta}
      </button>
    </form>
  );
}
