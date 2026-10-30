# CLAUDE.md

# Project: WeLearn client

WeLearn client: a Vue 3 + TypeScript SPA that helps university teachers bring sustainability / SDG content into their courses. It is only a frontend. All data and LLM calls go through the [WeLearn API](https://github.com/CyberCRI/WeLearn-api), so most features do nothing useful unless an API is reachable at `VITE_API_BASE`.

## Agent rules

These rules are strict and apply to every agent and subagent working in this repo.

- **Never install, add, remove or upgrade a package without the human confirming it first.** This covers `yarn add`, `yarn remove`, `yarn upgrade`, `npm install <pkg>`, `npx playwright install`, and editing dependency versions in `package.json` or `yarn.lock`. Say which package and version you want and why, then wait for a yes. Running `yarn install` to restore the existing lockfile is fine.
- **Never commit to `main`, and never push to it.** Work on a feature branch; if you are on `main`, create a branch before your first commit. Changes reach `main` only through a PR.

## Commands

Use **yarn**, not npm (`yarn.lock` is the lockfile).

```bash
yarn dev            # vite --mode dev  → http://localhost:5173 (reads .env.local / .env.dev)
yarn test:unit      # vitest (jsdom), watch mode; add `--run` for a single pass
yarn test:unit --run src/utils/__tests__/progress.spec.ts   # one file
yarn test:coverage  # single pass + v8 coverage, fails under the floors in vitest.config.ts (html report in coverage/)
yarn test:e2e       # playwright; starts `vite --mode test` itself, API calls are mocked
yarn lint           # eslint --fix
yarn format         # prettier --write src/
yarn type-check     # vue-tsc
yarn gen:api        # regenerate src/types/generated from WeLearn-api's openapi.json
yarn build          # type-check + vite build
```

CI (`.github/workflows/ci.yml`) runs `yarn lint:check`, `yarn format:check`, `yarn type-check`, `yarn test:coverage`, Playwright and the API contract check, all in the `lint-and-test` job. The `.githooks/pre-push` hook runs the same checks except Playwright before every push (enabled by `yarn install` through the `prepare` script; skip once with `git push --no-verify`). Before you say a change is done, run lint, `format:check` and `test:coverage`. If you add tests, raise the coverage floors in `vitest.config.ts` to just under the new values.

## Stack

- Vue 3 `<script setup lang="ts">` everywhere. No Options API.
- Pinia **setup stores** (`defineStore('name', () => { ... return {...} })`).
- vue-router 4, vue-i18n 9 (`legacy: false`), axios, keycloak-js.
- Styling: **Bulma 1.0 from the CDN** (`index.html`) plus design tokens in `src/assets/base.css` (`--neutral-*`, `--lpi-*`, `--primary-*`). Use Bulma classes and those CSS variables. Don't add hard-coded colors or a new CSS framework. Component styles are `<style scoped>`.
- Path alias: `@/` → `src/`.
- Prettier: 2 spaces, single quotes, `printWidth: 100`, no trailing commas.

## Layout

```
src/
  main.ts            # creates the app, then waits for authStore.init() (Keycloak) before mounting
  App.vue            # layout + boot calls: sources, corpus info, user/session, bookmarks
  router/index.ts    # routes + auth guard + query-param carry-over
  views/             # one per route
  components/        # shared UI; feature subfolders: tutor/, microlearning/, MAS_tutor/, nav/, dropdowns/, icons/, modals/
  stores/            # one Pinia store per feature (chat, search, tutor, bookmarks, sources, filters, user, auth, metrics, featureFlip)
  composables/       # useAuth, useMicrolearning (screen state machine), useGoTo
  utils/             # api.ts (axios instance), fetch.ts (API helpers), storage.ts, md-to-docx/, ...
  localisation/      # en.ts / fr.ts (+ authentication/, microLearning/ sub-namespaces)
  types/             # shared types; microlearning/ has its own
e2e/                 # Playwright specs; e2e/base.ts mocks every API route
tests/unit.setup.ts  # global $t mock → returns the key
```

## User flow

1. **Boot:** `main.ts` → `authStore.init()` (Keycloak `check-sso`) → mount. `App.vue` then calls `/user/user_and_session` (it stores `sessionId` in localStorage, and that value is sent as the `X-Session-Id` header), loads the source/corpus lists and loads bookmarks.
2. **Auth:** a route with `meta.requiresAuth` sends the user to the Keycloak login. **Auth is only enforced where the `auth` feature flip is on, today `dev` and `staging`** (`FEATURE_ENVIRONMENTS.auth` → `authStore.shouldAuthenticate`). In other environments the guard lets everything through.
3. `/` redirects to **`/q-and-a` (Chat)**. The user asks a question with optional SDG/corpus filters (`filters` store). The answer is streamed from `/qna/chat/agent_stream` through `fetchStream`, and `chatStatus` moves through the `CHAT_STATUS` states. Cited sources can be bookmarked.
4. **`/tutor` (Syllabus):** a 4-step wizard driven by `tutor` store `step`:

   1. upload files (max 3, 5 MB each; pdf/txt/docx)
   2. summaries
   3. pick resources
   4. edit the syllabus, give feedback, download it as .docx (`utils/md-to-docx`)

   `TutorPage.vue` maps each step to a store action (`stepToAction`). Only one request runs at a time (`AbortController` in `startRequest`). Finished steps fold into a recap.

5. **`/microlearning`:** a screen state machine in `useMicrolearning` (welcome → briefing → self-eval before → trail of steps → self-eval after → complete). The content lives in the static `stores/microlearning/data.ts`, keyed by language and then discipline. Answers are kept in memory only.
6. **`/search`:** document similarity search (the query needs >5 words or >50 chars) plus SDG detection from an external classifier.
7. **`/bookmarks`:** the saved documents, with a bibliography export.
8. `/tutor_test` (TestMAS) is a hidden experimental page. Don't remove it or `SecondStep.vue`, which it depends on.

The nav entries and routes are gated by `featureFlip` store flags (see Conventions).

## Conventions

- **API calls:** always go through `@/utils/fetch` (`baseGetAxios`, `basePostAxios`, `baseDeleteAxios`) or the `http` axios instance in `utils/api.ts`. These already add the `X-API-Key`, `X-Session-Id` and Bearer token, refresh the token and log out on 401. Use `fetchStream` only for streaming endpoints. Don't call `fetch`/`axios` directly for the WeLearn API.
- **Store pattern:** async actions live in the store. Track state with `isLoading`, error flags such as `hasXError` / `shouldRetryAction` and an `errorCode` from `error.response.data.detail.code`. Stores expose `$reset()` when they persist state.
- **Persistence:** use `saveToStorage` / `getFromStorage` / `clearFromStorage` from `utils/storage.ts`, which handle JSON for you. Stores that survive a reload initialize from storage (`ref(getFromStorage('chat') || [])`).
- **Feature flips:** `FEATURE_ENVIRONMENTS` in `stores/featureFlip.ts` lists the environments where each feature is on. It is resolved at runtime from `ENVIRONMENT_NAME` (`utils/env.ts`), because one Docker image serves every environment. A new page gets an entry there and `meta.feature` on its route; the router guard then redirects it away where it is off. Remove the entry once the feature is on everywhere.
- **i18n:** every user-facing string goes in **both** `localisation/en.ts` and `localisation/fr.ts`. A unit test (`localisation/__tests__/langs.spec.ts`) fails if their top-level keys differ. In templates use `$t('key')`. In TS use `i18n.global.t`. French is the default locale (`?lang=` or localStorage `language` overrides it).
- **Comments:** comments are short, lowercase and explain _why_. A `// ponytail:` comment marks a deliberate shortcut or trade-off (for example "kept for a future rewrite" or "native checkbox for the visual only"). Read it before "fixing" that code, and use the same tag when you knowingly take a shortcut.
- **Components:** use PascalCase file names. Many shared ones end in `Component.vue` (`ButtonComponent`, `ModalComponent`). Icons are SVG components in `components/icons/`.
- **Reuse existing components:**
  - Before you write any UI, check `src/components/` (including the `icons/`, `dropdowns/`, `modals/` and `nav/` subfolders) for an existing component. Use it rather than creating a new one or writing raw HTML for it in a view.
  - Common ones to reach for:
    - Buttons: `ButtonComponent`, `DeleteButton`
    - Modals: `ModalWrapper`, `ModalComponent`
    - Pills and tags: `PillComponent`, `GenericPillComponent`
    - Form inputs: `CheckboxCompnent`, `TextAreaComponent`
    - Dropdowns: `BaseDropdown`, `DropDownMenu`
    - Cards: `CardComponent`, `CardSimpleComponent`
    - Feedback: `TooltipComponent`, `ToasterComponent`
    - Loading and errors: `LoadingComponent`, `LoadingOverlay`, `ErrorComponent`
    - Layout: `ColumnTemplate`, `FullpageTemplate`
    - Progress: `ProgressBar`
    - Icons: anything in `icons/`
  - If an existing component is close but not quite right, extend it with a prop or slot without breaking current usages. Don't fork it. If you really must fork, add a `// ponytail:` comment explaining why.
  - Views in `src/views/` should mostly compose components and wire stores. Don't hand-code buttons, modals, inputs or inline SVGs in a page.
  - When a piece of markup is needed in more than one place, or a page section grows large, extract it into a component in `components/` (or a feature subfolder such as `components/tutor/`).
- **Naming:**
  - **PascalCase:** `.vue` files and component imports (`ChatInput.vue`, `import ChatInput from ...`). Also types, interfaces and enums (`ChatMessage`, `TutorSyllabus`, `ScreensEnum`). Use PascalCase tags in templates (`<ChatInput />`).
  - **camelCase:** variables, functions, refs/computeds, store actions, props, emitted events (`selectAll`, `update:courseTitle`), i18n keys (`chatInputPlaceholder`), localStorage keys (`chatThreadId`), Pinia store ids (`'featureFlip'`), and `.ts` files (`chatProcessing.ts`, `urlsUtils.ts`).
  - **Prefixes:** composables are `useXxx` in `composables/useXxx.ts`. Stores are `useXxxStore`. Booleans start with `is` / `has` / `should` (`isLoading`, `hasSearchError`, `shouldRetryAction`). Event handlers are `handleXxx`.
  - **UPPER_SNAKE_CASE:** module-level constants and constant maps (`MAX_FILES`, `RELEVANCE_FACTOR`, `CHAT_STATUS`).
  - **snake_case:** only for API payload/response fields, so they match the backend (`thread_id`, `sdg_filter`, `document_id`). Don't carry it into local variable names.
  - **Legacy names:** some existing names don't follow these rules (`mas_tutor.ts`, `MAS_tutor/`, `userInputMas.vue`, `current_disc`, `CheckboxCompnent.vue`). Don't copy them, and don't rename them unless the user asks, because renaming touches imports and snapshots.
- **Typing:** shared domain types (`Document`, `ChatMessage`, `TutorSyllabus`, ...) live in `src/types/index.ts`. Add new ones there. `@typescript-eslint/no-unused-vars` is set to error.
- **API types come from the API contract:**
  - The source of truth is `openapi.json` in WeLearn-api. `yarn gen:api` turns it into `src/types/generated/openapi.ts` (reads `openapi.json` from WeLearn-api `main` on GitHub; set `OPENAPI_SCHEMA=<path or url>` to use a local file or another branch). **Never edit `src/types/generated/`**; regenerate it and commit the result.
  - Never hand-write the shape of an API payload or response. Use the helpers in `src/types/api.ts`: `ApiResponse<'/user/bookmarks'>`, `ApiResponse<'/search/by_document', 'post'>`, `ApiRequestBody<'/bibliography/export_bibliography'>`, `ApiSchema<'CorpusRead'>`. Endpoints are written without the `/api/v1` prefix, as the axios helpers take them.
  - Pass the type to the helper: `baseGetAxios<ApiResponse<'/search/collections'>>('/search/collections')`. Domain types in `src/types/index.ts` alias the generated schemas; refine them only where the API is looser (`// ponytail:`), like `Document.payload.document_details`.
  - The `lint-and-test` CI job regenerates the types from WeLearn-api `main` and fails if they differ, which also blocks the deploy. When the API changes, run `yarn gen:api`, then `yarn type-check` and fix what broke.

## Tests

- Unit tests sit in `__tests__/` next to the code (`*.spec.ts` or `*.test.ts`). Component tests mount with `@vue/test-utils`, call `setActivePinia(createPinia())` in `beforeEach`, and often use snapshots. Update snapshots on purpose (`-u`) and never blindly.
- `$t` is mocked globally and returns the key, so assertions compare against i18n keys, not text.
- Pure logic in `utils/` and exported helpers (for example `cleanSyllabus` in `stores/tutor.ts`) should get plain unit tests.
- E2E: extend `test` from `e2e/base.ts`, which mocks the `/user`, `/search`, ... routes. Add mocks there for new endpoints.

## Environment and deploy

- `.env.local` holds `VITE_API_BASE`, `VITE_API_VERSION`, `VITE_WL_API_KEY`, `VITE_ENVIRONMENT`, `VITE_MIXPANEL_TOKEN`, `VITE_KEYCLOAK_URL/REALM/CLIENT_ID`. **Never commit or print its values.** `.env.test` has dummy values.
- Docker builds with `$DOCKER_INJECT_*` placeholders. `interpolate-variables.sh` swaps them into the built JS when nginx starts. A new `VITE_*` var therefore has to be added to the `Dockerfile` ARGs **and** to the `ci.yml` build-args.
- `devops-toolbox/` is a git submodule (sops secrets). Don't edit it.
- The project does not accept outside contributions. PRs follow `.github/PULL_REQUEST_TEMPLATE.md` (Description / Why / How / type of change).
- Branches are `<type>/<short-kebab-description>` (`feat/bookmark-collections`). Commit messages and PR titles are Conventional Commits, `<type>(<scope>): <summary>` with type `feat`, `fix`, `docs`, `test`, `refactor`, `chore`, `build` or `ci` and an optional scope (`chat`, `tutor`, `ui`, ...). PRs are squash-merged, so the PR title becomes the commit on `main`.

## Gotchas

- `stores/microlearning/data.ts` is about 4k lines of static FR/EN content. Never edit this file.
- `RegisterPage.vue` / `authStore.register` is a stub (it only shows an alert). Registration is not implemented yet.
- Mixpanel init in `main.ts` is commented out on purpose.
