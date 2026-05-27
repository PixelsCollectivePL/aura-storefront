"use client";

import Link from "next/link";
import { Starburst } from "@/components/brand/Starburst";
import { AcctIcon } from "@/components/account/AccountIcons";
import { cn } from "@/lib/utils";

interface AccountEmptyStateProps {
  title: string;
  body: string;
  cta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  /** Renders the empty state inside its own bordered card. */
  framed?: boolean;
}

/**
 * Shared empty-state composition used across order/sub/address sections.
 * Star burst + centered copy + 1-2 CTAs. No hardcoded copy — props-driven.
 */
export function AccountEmptyState({
  title,
  body,
  cta,
  secondaryCta,
  framed = true,
}: AccountEmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center text-center gap-5",
        framed
          ? "py-16 px-8 lg:py-20 lg:px-16 bg-paper border border-line rounded-md"
          : "py-8 px-4"
      )}
    >
      <div className="relative grid place-items-center">
        <Starburst color="var(--aura-paper-2)" size={180} points={12} depth={0.22}>
          <span className="text-ink">
            <AcctIcon.box size={48} />
          </span>
        </Starburst>
      </div>

      <div>
        <h2
          className="font-extrabold leading-none tracking-[-0.025em] text-ink mb-3"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(28px, 3.5vw, 40px)",
          }}
        >
          {title}
        </h2>
        <p className="text-[15px] leading-[1.55] text-muted max-w-[420px] mx-auto">
          {body}
        </p>
      </div>

      {(cta || secondaryCta) && (
        <div className="flex gap-2.5 flex-wrap justify-center mt-2">
          {cta && (
            <Link
              href={cta.href}
              className={cn(
                "inline-flex items-center justify-center gap-2 h-12 px-6",
                "bg-brand text-white rounded-pill border border-brand",
                "text-[14px] font-semibold",
                "hover:bg-brand-deep hover:border-brand-deep",
                "transition-colors duration-[150ms]",
                "focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
              )}
            >
              {cta.label}
            </Link>
          )}
          {secondaryCta && (
            <Link
              href={secondaryCta.href}
              className={cn(
                "inline-flex items-center justify-center gap-2 h-12 px-6",
                "bg-paper text-ink rounded-pill border border-line",
                "text-[14px] font-semibold",
                "hover:border-ink",
                "transition-colors duration-[150ms]",
                "focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
              )}
            >
              {secondaryCta.label}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
