import { cn } from "@/lib/utils";

type SectionBackground = "default" | "paper" | "paper-2" | "ink";
type SectionPadding    = "sm" | "default" | "lg" | "none";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  as?: "section" | "div" | "article";
  /** Border on bottom edge */
  bordered?: boolean;
  /** Background variant */
  background?: SectionBackground;
  /** Vertical padding variant */
  padding?: SectionPadding;
  /** Horizontal page gutters — default true */
  gutter?: boolean;
  id?: string;
}

/**
 * Section — universal page section wrapper.
 * Variants:
 *  - default / paper  → bg-paper  (FAF8F4, warm white)
 *  - paper-2          → bg-paper-2 (F3F0E9, warm tint)
 *  - ink              → bg-ink text-white (dark section)
 *
 * Padding:
 *  - sm      → py-16 lg:py-[100px]
 *  - default → py-16 lg:py-[100px]  (same as sm, use className for overrides)
 *  - lg      → py-[100px] lg:py-[120px]
 *  - none    → no padding
 */
export function Section({
  children,
  className,
  as: Tag = "section",
  bordered = false,
  background = "default",
  padding = "default",
  gutter = true,
  id,
}: SectionProps) {
  return (
    <Tag
      id={id}
      className={cn(
        // Horizontal gutters
        gutter && "px-5 lg:px-14",
        // Vertical padding
        padding === "sm"      && "py-12 lg:py-16",
        padding === "default" && "py-16 lg:py-[100px]",
        padding === "lg"      && "py-[100px] lg:py-[120px]",
        padding === "none"    && "",
        // Background
        background === "default"  && "bg-paper",
        background === "paper"    && "bg-paper",
        background === "paper-2"  && "bg-paper-2",
        background === "ink"      && "bg-ink text-white",
        // Border
        bordered && (
          background === "ink"
            ? "border-b border-white/10"
            : "border-b border-line"
        ),
        // Backward-compat: legacy bg-bg-soft used by old code
        className
      )}
    >
      {children}
    </Tag>
  );
}
