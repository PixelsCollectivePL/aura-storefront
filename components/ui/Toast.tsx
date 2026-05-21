"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";

/**
 * Listens for `aura:toast` custom events and renders a pill notification.
 * Uses a single CSS animation (aura-toast keyframe) with a 2.8s duration
 * that fades in, holds, then fades out — no timers needed.
 * Place once in the root layout.
 */
export function Toast() {
  const [message, setMessage] = useState<string | null>(null);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    function handler(e: Event) {
      const ce = e as CustomEvent<{ message: string }>;
      setMessage(ce.detail.message);
      // Bump key to re-mount the pill and restart the CSS animation
      setAnimKey((k) => k + 1);
    }
    window.addEventListener("aura:toast", handler);
    return () => window.removeEventListener("aura:toast", handler);
  }, []);

  if (!message) return null;

  return (
    <div
      key={animKey}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      onAnimationEnd={() => setMessage(null)}
      className={cn(
        "fixed left-1/2 z-[60]",
        // sit above mobile ATC bar (56px) + safe area; on desktop: bottom-6
        "bottom-[88px] lg:bottom-6",
        "inline-flex items-center gap-2",
        "pl-4 pr-5 h-11 rounded-pill",
        "bg-ink text-white text-[13px] font-semibold",
        "shadow-panel pointer-events-none select-none",
        "toast-show"
      )}
    >
      <span className="text-brand flex items-center" aria-hidden="true">
        <Icon.check size={14} />
      </span>
      {message}
    </div>
  );
}
