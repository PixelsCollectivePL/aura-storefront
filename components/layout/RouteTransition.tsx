"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AuraMark } from "@/components/brand/AuraMark";

type CurtainPhase = "idle" | "covering" | "covered" | "revealing";

const COVER_DURATION = 240;
const REVEAL_DURATION = 360;
const NAVIGATION_TIMEOUT = 5_000;

/**
 * Presentation-only route entrance.
 *
 * The key remounts this wrapper when the pathname changes, replaying the CSS
 * animation without touching the persistent CartProvider, auth cookies or any
 * Shopify data layer living above it in the root layout.
 */
export function RouteTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [phase, setPhaseState] = useState<CurtainPhase>("idle");
  const phaseRef = useRef<CurtainPhase>("idle");
  const pendingPathRef = useRef<string | null>(null);
  const navigationTimerRef = useRef<number | null>(null);
  const fallbackTimerRef = useRef<number | null>(null);
  const revealTimerRef = useRef<number | null>(null);

  const setPhase = useCallback((next: CurtainPhase) => {
    phaseRef.current = next;
    setPhaseState(next);
  }, []);

  const clearTimers = useCallback(() => {
    for (const timer of [
      navigationTimerRef.current,
      fallbackTimerRef.current,
      revealTimerRef.current,
    ]) {
      if (timer !== null) window.clearTimeout(timer);
    }
    navigationTimerRef.current = null;
    fallbackTimerRef.current = null;
    revealTimerRef.current = null;
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  useEffect(() => {
    const handleInternalLink = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        phaseRef.current !== "idle" ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) return;

      // A button can live inside a linked product card. Its own action must win
      // (for example quick-add), even though the nearest ancestor is an anchor.
      if (target.closest("button, input, select, textarea, [role='button']")) return;

      const anchor = target.closest<HTMLAnchorElement>("a[href]");
      if (
        !anchor ||
        anchor.target === "_blank" ||
        anchor.hasAttribute("download") ||
        anchor.dataset.noTransition !== undefined ||
        anchor.getAttribute("aria-disabled") === "true"
      ) {
        return;
      }

      const destination = new URL(anchor.href, window.location.href);
      const current = new URL(window.location.href);
      const isSameDocument =
        destination.pathname === current.pathname &&
        destination.search === current.search;

      if (
        destination.origin !== current.origin ||
        destination.pathname.startsWith("/api/") ||
        isSameDocument
      ) {
        return;
      }

      event.preventDefault();
      clearTimers();
      pendingPathRef.current = destination.pathname;
      setPhase("covering");

      const href = `${destination.pathname}${destination.search}${destination.hash}`;
      navigationTimerRef.current = window.setTimeout(() => {
        setPhase("covered");
        router.push(href);

        // Never strand the visitor behind the curtain if a client navigation
        // fails. The hard navigation is a last-resort recovery path.
        fallbackTimerRef.current = window.setTimeout(() => {
          window.location.assign(href);
        }, NAVIGATION_TIMEOUT);
      }, COVER_DURATION);
    };

    document.addEventListener("click", handleInternalLink, true);
    return () => document.removeEventListener("click", handleInternalLink, true);
  }, [clearTimers, router, setPhase]);

  useEffect(() => {
    if (!pendingPathRef.current || pathname !== pendingPathRef.current) return;

    if (fallbackTimerRef.current !== null) {
      window.clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }

    const frame = window.requestAnimationFrame(() => {
      setPhase("revealing");
      revealTimerRef.current = window.setTimeout(() => {
        pendingPathRef.current = null;
        setPhase("idle");
      }, REVEAL_DURATION);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [pathname, setPhase]);

  return (
    <>
      <div
        className="route-curtain"
        data-phase={phase}
        aria-hidden="true"
      >
        <div className="route-curtain__mark">
          <AuraMark size={44} color="var(--aura-ink)" variant="mono" />
        </div>
      </div>
      <div key={pathname} className="route-transition" data-route={pathname}>
        {children}
      </div>
    </>
  );
}
