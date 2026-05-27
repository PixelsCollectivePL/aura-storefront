"use client";

import { Starburst } from "@/components/brand/Starburst";
import { AcctIcon } from "@/components/account/AccountIcons";
import { cn } from "@/lib/utils";

interface AccountMobileBarProps {
  title: string;
  /** Shows a back arrow on the left instead of the brand mark. */
  back?: boolean;
  onBack?: () => void;
  action?: React.ReactNode;
  className?: string;
}

/**
 * Sticky top bar for mobile account screens. Replaces the project header
 * inside the account panel context (project header still sits above on the
 * page; this is an in-panel section bar).
 */
export function AccountMobileBar({
  title,
  back = false,
  onBack,
  action,
  className,
}: AccountMobileBarProps) {
  return (
    <header
      className={cn(
        "lg:hidden sticky top-14 z-20",
        "flex items-center justify-between gap-3",
        "px-4 h-12 bg-paper border-b border-line",
        className
      )}
    >
      <div className="w-9 flex items-center">
        {back ? (
          <button
            type="button"
            onClick={onBack}
            aria-label="Wróć"
            className="inline-flex items-center justify-center w-9 h-9 -ml-1.5 text-ink hover:text-brand cursor-pointer focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2 rounded-pill"
          >
            <AcctIcon.back size={20} />
          </button>
        ) : (
          <Starburst color="var(--aura-orange)" size={18} points={10} depth={0.28} />
        )}
      </div>

      <div
        className="font-extrabold tracking-[-0.02em] text-ink"
        style={{ fontFamily: "var(--font-display)", fontSize: 16 }}
      >
        {title}
      </div>

      <div className="w-9 flex items-center justify-end">{action}</div>
    </header>
  );
}
