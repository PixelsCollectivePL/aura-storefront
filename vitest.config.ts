import { defineConfig } from "vitest/config";
import { resolve } from "node:path";

/**
 * Vitest — unit tests for integration logic only.
 *
 * Scope on purpose: the pure, security-relevant pieces (session signing,
 * PKCE, OAuth URL building, discovery parsing, variant resolution). No DOM,
 * no component rendering, no browser driver — those would need a heavier
 * toolchain than this project should carry right now.
 *
 * Nothing here talks to Shopify. Tests must pass with no env vars and no
 * network.
 */
export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
  resolve: {
    alias: { "@": resolve(__dirname, ".") },
  },
});
