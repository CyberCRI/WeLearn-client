<!--- PR title: `<type>(<scope>): <summary>` (Conventional Commits), it becomes the squash commit on `main` -->
<!--- Branch: `<type>/<short-kebab-description>`, for example `feat/bookmark-collections` -->

## Description

<!--- What changes, and which pages, stores or components it touches (chat, tutor, microlearning, search, bookmarks, ...) -->

## Why?

<!--- The problem it solves. Link the issue if there is one. -->
<!--- If it follows a WeLearn-api change, link the API PR. -->

## How?

<!--- How it works, and how you tested it: unit tests, e2e tests, manual checks with `yarn dev` against which API (local, dev, ...) -->

## Screenshots

<!--- For UI changes: before / after. Check both FR and EN if text changed. Delete this section otherwise. -->

## Type of change

<!--- Matches the type in the PR title. Put an `x` in the one that applies. -->

- [ ] `feat`: new feature
- [ ] `fix`: bug fix
- [ ] `refactor`: code change with no behavior change
- [ ] `test`: tests only
- [ ] `docs`: documentation only
- [ ] `chore` / `build` / `ci`: tooling, dependencies, build or CI
- [ ] **Breaking change**: needs a matching WeLearn-api change, a new env var or a manual step on deploy (explain above)

## Checklist

<!--- Put an `x` in the boxes that apply, and strike out the ones that don't (`~~text~~`). -->

- [ ] The code follows the [code conventions](https://github.com/CyberCRI/WeLearn-client/blob/main/README.md#code-conventions).
- [ ] The PR title and branch name follow the [git workflow](https://github.com/CyberCRI/WeLearn-client/blob/main/README.md#git-workflow).
- [ ] `yarn lint:check`, `yarn format:check`, `yarn type-check` and `yarn test:coverage` pass (the pre-push hook runs them).
- [ ] New code is tested, and the coverage floors in `vitest.config.ts` are raised if coverage went up.
- [ ] Snapshots were updated on purpose (`-u`) and the diff was reviewed.
- [ ] New user-facing strings are in both `localisation/en.ts` and `localisation/fr.ts`.
- [ ] API types come from `yarn gen:api` (`src/types/generated/` not edited by hand), and new endpoints are mocked in `e2e/base.ts`.
- [ ] New `VITE_*` variables are added to the `Dockerfile` ARGs and the `ci.yml` build-args.
- [ ] No new package, or the new package was agreed on with the team.
- [ ] The README and `CLAUDE.md` are updated if the change affects setup, commands or conventions.
