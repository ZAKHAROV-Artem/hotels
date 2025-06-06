import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import unicorn from "eslint-plugin-unicorn";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    plugins: {
      unicorn,
    },
    rules: {
      // Enforce kebab-case for filenames
      "unicorn/filename-case": [
        "warn",
        {
          cases: {
            kebabCase: true,
          },
          ignore: [
            // Ignore Next.js convention files
            "page\\.tsx?$",
            "layout\\.tsx?$",
            "loading\\.tsx?$",
            "error\\.tsx?$",
            "not-found\\.tsx?$",
            "global-error\\.tsx?$",
            "route\\.ts$",
            "middleware\\.ts$",
            "instrumentation\\.ts$",
            "globals\\.css$",
            // Ignore config files
            "next\\.config\\.(js|ts|mjs)$",
            "tailwind\\.config\\.(js|ts|mjs)$",
            "postcss\\.config\\.(js|mjs)$",
            "eslint\\.config\\.(js|mjs)$",
            "tsconfig.*\\.json$",
            "package\\.json$",
            "components\\.json$",
            // Ignore other common files
            "README\\.md$",
            "\\.gitignore$",
            "favicon\\.ico$",
          ],
        },
      ],
    },
    ignores: ["node_modules/**", ".next/**", "out/**", "dist/**"],
  },
];

export default eslintConfig;
