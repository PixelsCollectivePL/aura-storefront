import { cn } from "@/lib/utils";

interface AccordionItemProps {
  question: string;
  answer: string;
  defaultOpen?: boolean;
  className?: string;
}

export function AccordionItem({
  question,
  answer,
  defaultOpen,
  className,
}: AccordionItemProps) {
  return (
    <details
      {...(defaultOpen ? { open: true } : {})}
      className={cn("group border-t border-line", className)}
    >
      <summary className={cn(
        "list-none flex items-start justify-between gap-6",
        "py-5 lg:py-[26px] cursor-pointer",
        "focus-visible:outline-2 focus-visible:outline-ink-hi focus-visible:outline-offset-[-2px]",
        "[&::-webkit-details-marker]:hidden"
      )}>
        <span className="text-[16px] lg:text-[17px] font-medium text-ink-hi leading-[1.4] flex-1 max-w-[720px]">
          {question}
        </span>
        {/* +/− icon: horizontal bar always, vertical bar only when closed */}
        <span className="relative w-4 h-4 shrink-0 mt-[3px]" aria-hidden="true">
          <span className="absolute top-[7px] inset-x-0 h-px bg-ink-hi" />
          <span className="absolute left-[7px] inset-y-0 w-px bg-ink-hi group-open:hidden" />
        </span>
      </summary>
      <p className="text-[15px] lg:text-[16px] text-mute-2 leading-[1.7] pb-6 lg:pb-7 max-w-[760px]">
        {answer}
      </p>
    </details>
  );
}
