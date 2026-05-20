"use client";

import { useState } from "react";
import { CONTENT } from "@/lib/content/pl";
import { cn } from "@/lib/utils";

const f = CONTENT.kontakt.formFields;

/**
 * ContactFormShell — UI placeholder.
 * Renders a contact form that prevents default submission and shows a
 * success message. No data is sent anywhere.
 * [backend-ready]: wire up to your email service (Resend, SendGrid, etc.)
 *   by replacing handleSubmit with a fetch() to /api/contact.
 */
export function ContactFormShell() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
  }

  if (sent) {
    return (
      <div className="py-12 text-center">
        <p className="text-[32px] lg:text-[40px] font-extrabold tracking-[-0.02em] text-ink mb-3"
          style={{ fontFamily: "var(--font-display)" }}>
          {f.successHeading}
        </p>
        <p className="text-[15px] text-muted leading-[1.65] mb-6">{f.successBody}</p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className={cn(
            "text-[13px] text-muted underline underline-offset-4 cursor-pointer",
            "hover:text-ink transition-colors duration-[120ms]",
            "focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
          )}
        >
          Wróć do formularza
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {/* Demo notice */}
      <div className="bg-brand-soft border border-brand/20 rounded-md px-4 py-3">
        <p className="text-[12px] text-ink leading-[1.55]">
          <span className="font-semibold">Demo UI.</span>{" "}
          {f.placeholderNote}
        </p>
      </div>

      {/* Name + Email row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field id="name" label={f.name} type="text" required autoComplete="name" />
        <Field id="email" label={f.email} type="email" required autoComplete="email" />
      </div>

      {/* Subject */}
      <Field id="subject" label={f.subject} type="text" />

      {/* Message */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="message"
          className="text-[11px] tracking-[0.1em] uppercase text-muted"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {f.message}
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          className={cn(
            "w-full bg-paper border border-line rounded-md px-4 py-3",
            "text-[14px] text-ink placeholder:text-muted",
            "resize-none outline-none",
            "focus:border-ink transition-colors duration-[120ms]"
          )}
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        className={cn(
          "self-start h-12 px-8",
          "inline-flex items-center justify-center",
          "rounded-pill bg-brand text-white",
          "text-[14px] font-semibold tracking-[-0.005em]",
          "hover:bg-brand-deep transition-colors duration-[120ms] cursor-pointer",
          "focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
        )}
      >
        {f.submit}
      </button>
    </form>
  );
}

// ── Field sub-component ────────────────────────────────────────────────
function Field({
  id,
  label,
  type,
  required,
  autoComplete,
}: {
  id: string;
  label: string;
  type: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-[11px] tracking-[0.1em] uppercase text-muted"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className={cn(
          "w-full h-11 bg-paper border border-line rounded-md px-4",
          "text-[14px] text-ink placeholder:text-muted",
          "outline-none focus:border-ink transition-colors duration-[120ms]"
        )}
      />
    </div>
  );
}
