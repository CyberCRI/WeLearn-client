# Feature flags

<!-- generated from src/featureEnvironments.json by `yarn docs:features`: edit that file, not this one -->

Where each client feature is on, as `src/stores/featureFlip.ts` reads it at runtime from
`VITE_ENVIRONMENT`. One Docker image serves every environment. `test` is the e2e and CI
build. A feature on everywhere can lose its entry once nothing reads it anymore.

| Feature (`?preview=`) | dev | staging | test | prod | Preview | What it is |
|---|:-:|:-:|:-:|:-:|---|---|
| `chat` | ✅ | ✅ | ✅ | ✅ | — | Chat: questions answered from WeLearn's sources |
| `tutor` | ✅ | ✅ | ✅ | ✅ | — | Syllabus tool |
| `search` | ✅ | ✅ | ✅ | ✅ | — | Document search and SDG detection |
| `bookmarks` | ✅ | ✅ | ✅ | ✅ | — | Bookmarks and bibliography export |
| `about` | ✅ | ✅ | ✅ | ✅ | — | About page |
| `learn` | ✅ | ✅ | ✅ | ✅ | — | Learn hub and its nav entry |
| `learnFoundations` | ✅ | ✅ | ❌ | ❌ | `/learn/foundations?preview=learnFoundations` | Learn module: foundations (the hub lists and numbers only the enabled modules) |
| `learnFrameworks` | ✅ | ✅ | ❌ | ❌ | `/learn/frameworks?preview=learnFrameworks` | Learn module: frameworks |
| `learnDiscipline` | ✅ | ✅ | ✅ | ✅ | — | Learn module: discipline (the former microlearning) |
| `workshop` | ✅ | ❌ | ❌ | ❌ | `?preview=workshop` | Workshop, reserved: no page reads it yet |
| `auth` | ✅ | ✅ | ❌ | ✅ | `?preview=auth` | Keycloak login, accounts and guest limits on the client side; off in the test build |
| `analytics` | ✅ | ✅ | ❌ | ✅ | `?preview=analytics` | Mixpanel and its consent banner; off in the test build, whose e2e specs check that Mixpanel is never called |
| `featuresPage` | ✅ | ✅ | ❌ | ❌ | never | This list as a page, with a button to preview each feature in this browser; never previewed, so never on prod |
| `syllabusV2` | ✅ | ✅ | ❌ | ❌ | `/tutor?preview=syllabusV2` | Syllabus v2: path choice, the "I have a course" path, drafts and the before/after self-evaluation. Every change of the rework sits behind it, so prod stays as it is |

## Preview a feature

`?preview=<feature>` turns a feature on for this browser where its environment keeps it off,
`?preview=a,b` several at once. The choice is kept in localStorage (`featurePreview`), so it
survives reloads and the Keycloak redirects; `?preview=off` clears it. A preview never turns off
a feature its environment turns on, and a feature marked "never" (`"preview": false`) is never
previewed. Hidden, not secret: anyone who knows the parameter gets it. On dev and staging, the
`/features` page lists the same flags with a button to preview each one in this browser.
