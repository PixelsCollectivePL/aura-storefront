import { cn } from "@/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  as?: "section" | "div" | "article";
  bordered?: boolean;
  background?: "default" | "soft" | "ink";
}

export function Section({
  children,
  className,
  as: Tag = "section",
  bordered = false,
  background = "default",
}: SectionProps) {
  return (
    <Tag
      className={cn(
        "px-5 lg:px-14",
        "py-16 lg:py-24",
        bordered && "border-b border-line",
        background === "soft" && "bg-bg-soft",
        background === "ink" && "bg-ink-hi text-ink-inv",
        className
      )}
    >
      {children}
    </Tag>
  );
}
