import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Design source material, not application code: standalone HTML/JS
    // mockups that are never imported or built. Linting them buried the
    // ~10 real findings under ~680 irrelevant ones, which made
    // `npm run lint` useless as a gate.
    "design-reference/**",
  ]),
]);

export default eslintConfig;
