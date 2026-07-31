import { afterEach, describe, expect, it } from "vitest";
import { getSiteUrl } from "@/lib/seo/site-url";

const ORIGINAL_ENV = { ...process.env };

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
});

describe("getSiteUrl", () => {
  it("prefers the explicitly configured public app URL", () => {
    process.env.NEXT_PUBLIC_APP_URL = "https://aura.example";
    process.env.VERCEL_URL = "preview.vercel.app";

    expect(getSiteUrl().toString()).toBe("https://aura.example/");
  });

  it("uses the Vercel deployment host when the app URL is absent", () => {
    delete process.env.NEXT_PUBLIC_APP_URL;
    process.env.VERCEL_PROJECT_PRODUCTION_URL = "aura.vercel.app";

    expect(getSiteUrl().toString()).toBe("https://aura.vercel.app/");
  });

  it("falls back to localhost for env-free builds and tests", () => {
    delete process.env.NEXT_PUBLIC_APP_URL;
    delete process.env.VERCEL_PROJECT_PRODUCTION_URL;
    delete process.env.VERCEL_URL;

    expect(getSiteUrl().toString()).toBe("http://localhost:3000/");
  });
});
