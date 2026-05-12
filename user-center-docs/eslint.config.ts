import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import markdown from "@eslint/markdown";
import { defineConfig, globalIgnores } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier/flat";

export default defineConfig([
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
        plugins: { js },
        extends: ["js/recommended"],
        languageOptions: { globals: globals.browser },
    },
    tseslint.configs.recommended,
    {
        files: ["**/*.md"],
        plugins: { markdown },
        language: "markdown/gfm",
        extends: ["markdown/recommended"],
    },
    eslintConfigPrettier,
    globalIgnores(["docs/.vitepress/cache/", "docs/.vitepress/dist/"]),
]);
