# CLAUDE.md

# Project: WeLearn client

WeLearn client: a Vue 3 + TypeScript SPA that helps university teachers bring sustainability / SDG content into their courses. It is only a frontend. All data and LLM calls go through the [WeLearn API](https://github.com/CyberCRI/WeLearn-api), so most features do nothing useful unless an API is reachable at `VITE_API_BASE`.

## Agent rules

These rules are strict and apply to every agent and subagent working in this repo.

- **Never install, add, remove or upgrade a package without the human confirming it first.** This covers `yarn add`, `yarn remove`, `yarn upgrade`, `npm install <pkg>`, `npx playwright install`, and editing dependency versions in `package.json` or `yarn.lock`. Say which package and version you want and why, then wait for a yes. Running `yarn install` to restore the existing lockfile is fine.
- **Never change the learn module text without the human confirming it first.** This is `src/localisation/learn/content/` (foundations, frameworks and discipline, in every language): it is written with the researchers. Say which text you want to change and why, then wait for a yes.
- **Never commit to `main`, and never push to it.** Work on a feature branch; if you are on `main`, create a branch before your first commit. Changes reach `main` only through a PR.
- The hooks in `.claude/hooks/` (wired in `.claude/settings.json`, they need `jq`) enforce these rules and the "never edit" ones below. They also run prettier on each file you edit in `src/`. If a hook blocks you, ask the human. Don't work around it.

## Commands

Use **yarn**, not npm (`yarn.lock` is the lockfile).

```bash
yarn dev            # vite --mode dev  → http://localhost:5173 (reads .env.local / .env.dev)
yarn dev:prod-api   # same, but API calls go through the vite proxy to the prod API (needs .env.prodapi.local, see README)
yarn test:unit      # vitest (jsdom), watch mode; add `--run` for a single pass
yarn test:unit --run src/utils/__tests__/progress.spec.ts   # one file
yarn test:coverage  # single pass + v8 coverage, fails under the floors in vitest.config.ts (html report in coverage/)
yarn test:e2e       # playwright; builds once (e2e/build.mjs), copies it to dist/e2e-test and dist/e2e-dev with
                    # their environment filled in, and serves each with `vite preview`. API calls are mocked
                    # (E2E_DEV_SERVER=1 uses the dev server instead, for quick local iterations)
yarn lint           # eslint --fix
yarn format         # prettier --write src/
yarn type-check     # vue-tsc
yarn gen:api        # regenerate src/types/generated from WeLearn-api's openapi.json
yarn docs:features  # write docs/features.md (feature flags by environment) from src/featureEnvironments.json
yarn build          # type-check + vite build
```

CI (`.github/workflows/ci.yml`) runs `yarn lint:check`, `yarn format:check`, `yarn type-check`, `yarn test:coverage`, the API contract check and Playwright, all in the `lint-and-test` job, on the Node version in `.nvmrc` (also used by the `Dockerfile`; change both together). Each check runs even when an earlier one fails. A non-blocking `yarn audit` of the production dependencies runs last. The `build-docker` job builds the image on every push once `lint-and-test` passes, but only pushes it, and `tag-deploy` only creates the `<ref>_deploy` tag, for `main`, tags, manual runs and branches whose open PR has the `preview` label (`.github/workflows/preview.yml` runs the build when the label is added and deletes the deploy tag when it is removed or the PR closes). `.github/workflows/pr-title.yml` fails a PR whose title is not a Conventional Commit. The `.githooks/pre-push` hook runs the same checks except Playwright before every push (enabled by `yarn install` through the `prepare` script; skip once with `git push --no-verify`). It also refuses pushes to `main` and uncommitted or untracked files. Before you say a change is done, run lint, `format:check` and `test:coverage`. If you add tests, raise the coverage floors in `vitest.config.ts` to just under the new values.

## Stack

- Vue 3 `<script setup lang="ts">` everywhere. No Options API.
- Pinia **setup stores** (`defineStore('name', () => { ... return {...} })`).
- vue-router 4, vue-i18n 11 (`legacy: false`), axios, keycloak-js.
- Styling: **Bulma 1.0 from the CDN** (`index.html`) plus design tokens in `src/assets/base.css` (`--neutral-*`, `--lpi-*`, `--primary-*`). Use Bulma classes and those CSS variables. Don't add hard-coded colors or a new CSS framework. Component styles are `<style scoped>`.
- Title/subtitle spacing: one app-wide rule in `src/assets/base.css` spaces a `.title` and the `.subtitle` right under it. Don't add `mt-*`/`mb-*` helpers, `is-spaced` or scoped margins to that pair, and don't put the pair in a container whose `gap` would split it.
- Path alias: `@/` → `src/`.
- Prettier: 2 spaces, single quotes, `printWidth: 100`, no trailing commas.

## Layout

```
src/
  main.ts            # creates the app, then waits for authStore.init() (Keycloak) before mounting
  App.vue            # layout + boot calls: sources, corpus info, user/session (then latest chat thread, guest quota), bookmarks, account access
  router/index.ts    # routes + auth guard + query-param carry-over
  views/             # one per route
  components/        # shared UI; feature subfolders: tutor/ (draft/, review/, updated/, development/), learn/ (steps/, discipline/), MAS_tutor/, nav/, dropdowns/, icons/, modals/
  learn/             # Learn hub: modules list (moduleList.ts), progress, per-module structure (modules/<id>.ts)
  stores/            # one Pinia store per feature: chat, search, tutor (from-scratch syllabus), course, connections, courseDraft,
                     # syllabusEval (syllabus v2), bookmarks, sources, filters, user, auth, accountAccess, guestQuota, metrics,
                     # featureFlip, mas_tutor (/tutor_test)
  composables/       # useAuth, useDisciplineModule (screen state machine), useEvalForms, useGoTo, useOpenAll, useSyllabusExport
  utils/             # api.ts (axios instance), fetch.ts (API helpers), storage.ts, md-to-docx/, ...
  localisation/      # en.ts / fr.ts (+ authentication/, learn/ sub-namespaces); learn/content/ holds the learn module text, outside vue-i18n
  types/             # shared types; learn/ has the learn modules' (discipline.ts, modules.ts)
e2e/                 # Playwright specs; e2e/base.ts mocks every API route
tests/unit.setup.ts  # global $t mock → returns the key
```

## User flow

1. **Boot:** `main.ts` → `authStore.init()` (Keycloak `check-sso`) → mount. `App.vue` then calls `/user/user_and_session` (guests get a session too; it stores `sessionId` in localStorage, and that value is sent as the `X-Session-Id` header), then restores the latest chat thread and the guest quota (`guestQuota` store). It also loads the source/corpus lists, the bookmarks (accounts only) and, for a logged-in user, `/user/access` (`accountAccess` store: a Google or email login is limited in time).
2. **Auth:** a route with `meta.requiresAuth` sends a guest to the Keycloak login, or opens the sign-up prompt when it also has `meta.signupPromptReason` (`/bookmarks`). `/register` is the sign-up form: `authStore.register` posts to `/user/signup` and Keycloak emails a link to set the password. **Auth is only enforced where the `auth` feature flip is on: `dev`, `staging` and `prod`, not the `test` build** (`auth` in `src/featureEnvironments.json` → `authStore.shouldAuthenticate`). In other environments the guard lets everything through.
3. `/` redirects to **`/q-and-a` (Chat)**. The user asks a question with optional SDG/corpus filters (`filters` store). The answer is streamed from `/qna/chat/agent_stream` through `fetchStream`, and `chatStatus` moves through the `CHAT_STATUS` states. Cited sources can be bookmarked.
4. **`/tutor` (Syllabus):** where `syllabusV2` is off (`test`, `prod`), `TutorPage.vue` only shows `ScratchWizard.vue`, a 4-step wizard driven by `tutor` store `step`:

   1. upload files (max 3, 5 MB each; pdf/txt/docx)
   2. summaries
   3. pick resources
   4. edit the syllabus, give feedback, download it as .docx (`utils/md-to-docx`)

   `ScratchWizard.vue` maps each step to a store action (`stepToAction`). Only one request runs at a time (`AbortController` in `startRequest`). Finished steps fold into a recap.

   Where `syllabusV2` is on (`dev`, `staging`), the page first asks a self-evaluation (`syllabusEval` store, first time only), then the path (`PathChoice.vue`): "from scratch" runs the same wizard, "I have a course" runs `ExistingCourseFlow.vue` (one course file → review the course → sustainability additions → updated syllabus; `course` and `connections` stores). A logged-in teacher can keep a draft of that path in the browser (`courseDraft` store).

5. **`/learn` (Learn / Se former):** a hub of short modules listed in `src/learn/moduleList.ts`, each behind its own feature flip (`learnFoundations` and `learnFrameworks` on `dev` and `staging` only, `learnDiscipline` everywhere); the hub lists and numbers only the enabled ones. `foundations` and `frameworks` run in `LearnModule.vue` from typed steps, with progress through `src/learn/progress.ts`. Module content stays in the front, in two parts: the structure (`src/learn/modules/<id>.ts`: ids, order, answers, the same in every language) and one text file per language (`src/localisation/learn/content/<id>.<lang>.ts`, typed from the structure's ids, not in vue-i18n). `buildModule` merges them, and components only read content through `getModuleContent` / `useModuleContent`. UI labels (buttons, kickers, tags) go in vue-i18n under `learn.module.*` / `learn.discipline.*`, never in the content. `/learn/discipline` (old `/microlearning`, which redirects) is the discipline module: a screen state machine in `useDisciplineModule` (welcome → briefing → self-eval before → trail of steps → self-eval after → complete). Its content follows the same split: `DISCIPLINES` and `buildDiscipline` in `src/learn/modules/discipline.ts`, the text in `src/localisation/learn/content/discipline.<lang>.ts`. The self-evaluation answers are sent once each to `/metric/form_data` (`useEvalForms`, which keeps in localStorage which forms are done); the other answers stay in memory.
6. **`/search`:** document similarity search (the query needs >5 words or >50 chars) plus SDG detection from an external classifier.
7. **`/bookmarks`:** the saved documents, with a bibliography export.
8. `/tutor_test` (TestMAS) is a hidden experimental page. Don't remove it or `SecondStep.vue`, which it depends on.
9. Other routes: `/profile` (accounts only), `/about`, `/terms`, `/register` and `/request-university` (reached from the Keycloak login, no header or nav: `meta.hideTemplate`), `/login` (back from the account set-up email) and the hidden `/features`.

The nav entries and routes are gated by `featureFlip` store flags (see Conventions).

## Conventions

- **API calls:** always go through `@/utils/fetch` (`baseGetAxios`, `basePostAxios`, `baseDeleteAxios`) or the `http` axios instance in `utils/api.ts`. These already add the `X-API-Key`, `X-Session-Id` and Bearer token, refresh the token and log out on 401. Use `fetchStream` only for streaming endpoints. Don't call `fetch`/`axios` directly for the WeLearn API.
- **Store pattern:** async actions live in the store. Track state with `isLoading`, error flags such as `hasXError` / `shouldRetryAction` and an `errorCode` from `error.response.data.detail.code`. Stores expose `$reset()` when they persist state.
- **Analytics:** track product events with `track('Event Name', props)` from `@/utils/analytics`, never by importing `mixpanel-browser` directly. Declare each event and its props in `AnalyticsEvents` (`src/types/index.ts`). Send only counts, lengths, enums and ids, never free text, file content, names or emails. When you add an event, update the Mixpanel section of `public/terms_*.md` if the kind of data changes. The heatmap clicks send the `aria-label` and `title` of the clicked element and its parents: give the class `mp-sensitive` to any element whose label or title holds the user's own text (their name, a file name, a course title or excerpt).
- **Persistence:** use `saveToStorage` / `getFromStorage` / `clearFromStorage` from `utils/storage.ts`, which handle JSON for you. Stores that survive a reload initialize from storage (`ref(getFromStorage('chat') || [])`).
- **Feature flips:** `src/featureEnvironments.json` lists, for each feature, the environments where it is on, its page and a one-line description. `stores/featureFlip.ts` reads it and resolves it at runtime from `ENVIRONMENT_NAME` (`utils/env.ts`), because one Docker image serves every environment. A new page gets an entry there and `meta.feature` on its route; the router guard then redirects it away where it is off. Remove the entry once the feature is on everywhere. `"preview": false` keeps a feature out of `?preview=` (the hidden `/features` page, which lists the flags and previews them, is only on dev and staging that way). After any change, run `yarn docs:features` and commit `docs/features.md`: CI and the pre-push hook fail when it is out of date. On a version tag, `.github/workflows/release.yml` adds the same table to the GitHub release notes (a draft release when there is none).
- **i18n:** every user-facing string goes in **both** `localisation/en.ts` and `localisation/fr.ts`. A unit test (`localisation/__tests__/langs.spec.ts`) fails if their top-level keys differ. In templates use `$t('key')`. In TS use `i18n.global.t`. French is the default locale (`?lang=` or localStorage `language` overrides it).
- **Comments:** comments are short, lowercase and explain _why_. A `// ponytail:` comment marks a deliberate shortcut or trade-off (for example "kept for a future rewrite" or "native checkbox for the visual only"). Read it before "fixing" that code, and use the same tag when you knowingly take a shortcut.
- **Components:** use PascalCase file names. Many shared ones end in `Component.vue` (`ButtonComponent`, `ModalComponent`). Icons are SVG components in `components/icons/`.
- **Reuse existing components:**
  - Before you write any UI, check `src/components/` (including the `icons/`, `dropdowns/`, `modals/` and `nav/` subfolders) for an existing component. Use it rather than creating a new one or writing raw HTML for it in a view.
  - Common ones to reach for:
    - Buttons: `ButtonComponent`, `DeleteButton`
    - Modals: `ModalWrapper`, `ModalComponent`
    - Pills and tags: `PillComponent`, `GenericPillComponent`
    - Form inputs: `CheckboxCompnent`, `TextInputComponent`, `TextAreaComponent`
    - Dropdowns: `BaseDropdown`, `DropDownMenu`
    - Cards: `CardComponent`, `CardSimpleComponent`
    - Feedback: `TooltipComponent`, `ToasterComponent`
    - Loading and errors: `LoadingComponent`, `LoadingOverlay`, `ErrorComponent`
    - Layout: `ColumnTemplate`, `FullpageTemplate`
    - Progress: `learn/ProgressBar`
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
- nginx sends a **Content-Security-Policy** (`security-headers.conf`, included by `welearn.conf`). The API and Keycloak origins are filled in from `VITE_API_BASE` / `VITE_KEYCLOAK_URL` when the container starts, and the container refuses to start if the API base isn't an http(s) url. Any other external origin (a CDN, a tracker, a new API) must be added to that policy, or the browser blocks it once deployed (`yarn dev` sends no CSP, so it only shows up there). Inline scripts are blocked: put scripts in files, as `public/silent-check-sso.js` does.
- `devops-toolbox/` is a git submodule (sops secrets). Don't edit it.
- The project does not accept outside contributions. PRs follow `.github/PULL_REQUEST_TEMPLATE.md` (Description / Why / How / type of change).
- Branches are `<type>_<short-kebab-description>` (`feat_bookmark-collections`). Commit messages and PR titles are Conventional Commits, `<type>(<scope>): <summary>` with type `feat`, `fix`, `docs`, `test`, `refactor`, `chore`, `build` or `ci` and an optional scope (`chat`, `tutor`, `ui`, ...). PRs are squash-merged, so the PR title becomes the commit on `main`.

## Gotchas

- Sign-up (`RegisterPage.vue` → `authStore.register` → `/user/signup`): the API answers the same whether or not the email already has an account (no user enumeration), so a success only means "check your email".
- Mixpanel is behind the `analytics` feature flip (`analytics` in `src/featureEnvironments.json`: on in `dev`, `staging` and `prod`, off in the `test` build): elsewhere there is no consent banner, no cookie settings link and Mixpanel never starts. When on, it only starts after the user accepts the consent banner (`ConsentBanner.vue`, `user` store `analyticsConsent`). In `test` mode or without a token it never starts. E2E specs that need it run in the `chromium-auth` (dev) project.
