import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";
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
        "inline-flex items-center justify-center gap-2.5",
        "font-sans font-medium whitespace-nowrap cursor-pointer",
        "rounded-none border-0",
        "transition-[background-color,color,border-color] duration-[120ms] ease-out",
        "focus-visible:outline-2 focus-visible:outline-ink-hi focus-visible:outline-offset-2",
        "disabled:cursor-not-allowed",
        // sizes
        size === "sm" && "text-[12.5px] leading-[1.55] px-3.5 py-2.5 min-h-9",
        size === "default" && "text-[14px] leading-[1.55] px-[22px] py-4 min-h-12",
        size === "lg" && "text-[15px] leading-[1.6] px-7 py-5 min-h-[60px]",
        // variants
        variant === "primary" && "bg-ink-hi text-ink-inv hover:bg-black active:translate-y-px disabled:bg-line-2 disabled:text-bg",
        variant === "secondary" && "bg-bg text-ink-hi border border-ink-hi hover:bg-ink-hi hover:text-ink-inv active:translate-y-px disabled:text-mute disabled:border-line-2",
        variant === "ghost" && "bg-transparent text-ink-hi border border-line hover:border-ink-hi active:translate-y-px disabled:text-mute",
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
        "bg-transparent border-0 cursor-pointer text-ink-hi",
        "transition-colors duration-[120ms]",
        "hover:text-black",
        "focus-visible:outline-2 focus-visible:outline-ink-hi focus-visible:outline-offset-2",
        className
      )}
      style={{ width: size, height: size }}
      {...props}
    >
      {children}
    </button>
  );
}
