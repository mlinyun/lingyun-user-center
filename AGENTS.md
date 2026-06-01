# Repository Guidelines

## Project Structure & Module Organization

This is a full-stack user-center application. `user-center-backend/` contains the Spring Boot API: Java sources in `src/main/java`, mapper XML and profiles in `src/main/resources`, and tests in `src/test/java`. `user-center-vue-frontend/` contains the Vue 3 + Vite app: pages in `src/views`, shared UI in `src/components`, API clients in `src/api`, stores in `src/stores`, and helpers in `src/utils`. `user-center-docs/` is the VitePress site, with pages in `docs/src`. SQL scripts live in `user-center-sql/`, nginx examples in `user-center-nginx/`, and scripts in `scripts/`. Do not edit generated `target/`, `dist/`, or VitePress output.

## Build, Test, and Development Commands

- `cd user-center-backend && ./mvnw spring-boot:run`: run the backend on `http://localhost:8100/api`.
- `cd user-center-backend && ./mvnw test`: run backend tests.
- `cd user-center-backend && ./mvnw clean package`: build the backend jar.
- `pnpm --dir user-center-vue-frontend dev`: run the Vue app, usually on `http://localhost:8082`.
- `pnpm --dir user-center-vue-frontend build`: type-check and build the frontend.
- `pnpm --dir user-center-vue-frontend lint`: run frontend lint fixes.
- `pnpm --dir user-center-docs docs:dev`: run docs locally.
- `pnpm backend:check:full`: run backend Spotless and Checkstyle.

## Coding Style & Naming Conventions

Follow `.editorconfig`: UTF-8, LF endings, final newline, 4-space indentation by default, and 2 spaces for JSON/YAML/HTML/Markdown. Java uses Checkstyle plus Spotless; keep lines under 120 characters. Vue/TypeScript uses ESLint, Oxlint, Oxfmt, and Stylelint. Use kebab-case for Vue component paths such as `reset-password-modal.vue`, PascalCase for Java classes, and lower camelCase for Java/TypeScript members.

## Testing Guidelines

Backend tests use Spring Boot test support and live under `user-center-backend/src/test/java`, mirroring production packages. Name test classes with the `*Tests` suffix. Add focused tests for service, validation, mapper, and controller changes. No frontend test runner is configured; rely on `pnpm --dir user-center-vue-frontend build` and lint checks unless one is added.

## Commit & Pull Request Guidelines

Commits follow Conventional Commits enforced by Commitlint, for example `feat(backend): add email reset flow` or `refactor(frontend): simplify auth redirect`. Allowed scopes include `frontend`, `backend`, `api`, `ui`, `database`, `config`, `deps`, `release`, `docs`, and `tests`. Keep subjects descriptive, at least 6 characters, and under 100 characters. Pull requests should include a summary, linked issue, UI screenshots, database/config notes, and verification commands when applicable.

## Security & Configuration Tips

Do not commit real secrets. Backend profile files use database, Redis, mail, Aliyun SMS, and COS settings; prefer local environment variables or untracked local overrides for credentials. When changing SQL or nginx files, mention deployment impact in the PR.
