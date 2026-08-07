import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescriptConfig from "eslint-config-next/typescript";

/**
 * Flat config nativo. O eslint-config-next 16 já exporta configs planas, então
 * não passa pelo FlatCompat (que estoura com referência circular ao normalizar
 * o plugin do React).
 */
const config = [
  {
    ignores: [
      ".next/**",
      ".open-next/**",
      ".wrangler/**",
      "next-env.d.ts",
      "cloudflare-env.d.ts",
    ],
  },
  ...coreWebVitals,
  ...typescriptConfig,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
    },
  },
];

export default config;
