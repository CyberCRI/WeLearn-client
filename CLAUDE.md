# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What WeLearn Is

WeLearn is a Vue 3 SPA built for university teachers to integrate Sustainable Development Goals (SDGs) into course content. It connects to a REST API (WeLearn-api) that handles LLM interactions and a Qdrant vector database. The app is bilingual (EN/FR) with locale set via `?lang=` query param (defaults to `fr`).

## Commands

```bash
yarn dev          # dev server at http://localhost:5173 (uses --mode dev)
yarn build        # type-check + production build
yarn build-dev    # vite build in dev mode
yarn test:unit    # vitest (jsdom, mode=test)
yarn test:e2e     # playwright
yarn lint         # eslint --fix
yarn format       # prettier --write src/
```

Run a single unit test file:
```bash
yarn test:unit src/components/__tests__/ChatInput.spec.ts
```

## Environment Variables

Copy `.env.test` to `.env.local` and fill in values:
- `VITE_API_BASE` — backend URL (e.g. `http://localhost:8000`)
- `VITE_API_VERSION` — defaults to `/api/v1`
- `VITE_WL_API_KEY` — API key sent as `X-API-Key` header on every request
- `VITE_ENVIRONMENT` — set to a string containing `dev` to enable dev-only features

## Architecture

**Stack:** Vue 3 (Composition API, `<script setup>`), Vite, TypeScript, Pinia, vue-router 4, vue-i18n 9, Axios.

**`@` alias** resolves to `src/`.

### Routes → Views

| Path | View | Notes |
|------|------|-------|
| `/q-and-a` (default) | `QandA.vue` | Chat interface |
| `/search` | `SearchSDG.vue` | Semantic search |
| `/bookmarks` | `BookmarkdSources.vue` | Saved docs |
| `/tutor` | `TutorPage.vue` | Syllabus generator (multi-step) |
| `/microlearning` | `MicroLearning.vue` | Dev-only (gated by `VITE_ENVIRONMENT`) |
| `/about`, `/terms` | lazy-loaded | Static pages |

Router persists query params across navigation — if `to` has no params but `from` does, params are forwarded. This is how `lang=` and `score=` survive page changes.

### Pinia Stores

| Store | File | Responsibility |
|-------|------|----------------|
| `search` | `stores/search.ts` | Semantic search state, SDG detection, result list |
| `chat` | `stores/chat.ts` | Q&A chat lifecycle (`CHAT_STATUS` FSM), thread/message persistence |
| `tutor` | `stores/tutor.ts` | Multi-step syllabus flow (file upload → extracts → search → syllabus) |
| `bookmarks` | `stores/bookmarks.ts` | Add/remove/fetch user bookmarks |
| `filters` | `stores/filters.ts` | SDG, language, corpus filters shared across search & chat |
| `sources` | `stores/sources.ts` | Corpus list + per-corpus doc counts (fetched once on mount) |
| `user` | `stores/user.ts` | Onboarding state, institution/role data collection |
| `featureFlip` | `stores/featureFlip.ts` | Feature flags; `microlearning` gated on `isDevEnvironment` |
| `metrics` | `stores/metrics.ts` | Usage tracking |

### API Layer (`src/utils/fetch.ts`)

All API calls use `baseGetAxios`, `basePostAxios`, or `baseDeleteAxios`. Every request includes:
- `withCredentials: true` (cookie-based session)
- `X-API-Key` header from `VITE_WL_API_KEY`
- `X-Session-Id` header read from `localStorage.sessionId`

`fetchStream` uses the native `fetch` API for streaming responses (used in chat).

Session is established on app boot via `getUserAndSession()` (`POST /user/user_and_session`), which also writes `sessionId` to localStorage.

SDG classification for search queries uses an external Aurora SDG classifier at `aurora-sdg.labs.vu.nl` (called directly from the frontend, not through the WeLearn API).

### App Boot Sequence (`App.vue`)

On `onMounted`, three calls run in parallel:
1. `getInfoPerCorpus()` — fetches doc counts per corpus
2. `getSourcesList()` — fetches available corpora grouped by category
3. `getUserAndSession()` — establishes session, stores sessionId

If any fails, an `<ErrorComponent>` is shown instead of the app.

### i18n

Default locale is `fr`. Locale is read from the `?lang=` query param at startup. All translation keys live in `src/localisation/en.ts` and `fr.ts`, composed in `messages.ts`. Use `$t('key')` in templates.

### Tutor Feature (multi-step flow)

`TutorPage` is driven by `useTutorStore`. The `step` ref controls which UI step is shown. The flow:
1. Upload files → `POST /tutor/files/content` → extracts + summaries
2. Search for related docs → `POST /tutor/search_extracts`
3. Select sources, fill course metadata
4. Generate syllabus → `POST /tutor/syllabus`
5. Iterate with feedback → `POST /tutor/syllabus/feedback`
6. Download as `.docx` (via `src/utils/md-to-docx/`)

### Chat Status FSM

`CHAT_STATUS` in `stores/chat.ts` controls UI states: `EMPTY → REFORMULATING → REFORMULATED → SEARCHING → SEARCHED → FORMULATING_ANSWER → FORMULATED_ANSWER → DONE` (or `ERROR` / `NO_RESULTS`). Components check this to show loaders, error states, and results.

### Local Storage Keys

`sessionId`, `chatThreadId`, `chatMessageId`, `chat`, `chatSources`, `questionQueues`, `reformulatedQuery`, `chatSubject`, `onboardingState`, `userMetricsData`, `searchMessageId`.

### Feature Flags

`useFeatureFlipStore` exposes `isFeatureEnabled(name)`. The `microlearning` feature and the `/microlearning` route are only registered when `VITE_ENVIRONMENT` contains `dev`.
