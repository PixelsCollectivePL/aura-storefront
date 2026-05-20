import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "ink" | "ghost";
type ButtonSize = "sm" | "default" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function Button({
  variant = "primary",
  size = "default",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        // Base
        "inline-flex items-center justify-center gap-2",
        "font-sans font-semibold whitespace-nowrap cursor-pointer",
        "rounded-pill border",
        "transition-[background-color,color,border-color,transform] duration-[150ms] ease-out",
        "focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "active:translate-y-px",
        // Sizes
        size === "sm"      && "text-[13px] leading-[1.4] px-[14px] h-9",
        size === "default" && "text-[14px] leading-[1.4] px-5 h-12",
        size === "lg"      && "text-[15px] leading-[1.4] px-7 h-[52px]",
        // Variants
        variant === "primary" && "bg-brand text-white border-brand hover:bg-brand-deep hover:border-brand-deep",
        variant === "ink"     && "bg-ink text-white border-ink hover:bg-ink-2 hover:border-ink-2",
        variant === "ghost"   && "bg-transparent text-ink border-ink hover:bg-ink hover:text-white",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: number;
}

export function IconButton({ size = 40, className, children, ...props }: IconButtonProps) {
  return (
    <button
      className={cn(
        "flex items-center justify-center",
        "bg-transparent border-0 cursor-pointer text-ink",
        "transition-colors duration-[120ms]",
        "hover:text-brand",
        "focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2",
        "rounded-sm",
        className
      )}
      style={{ width: size, height: size }}
      {...props}
    >
      {children}
    </button>
  );
}
