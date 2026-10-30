[![CC BY-NC-SA 4.0][cc-by-nc-sa-shield]][cc-by-nc-sa]

![https://welearn-demo.learningplanetinstitute.org](https://welearn-demo.learningplanetinstitute.org/assets/logo-fdaefaa7.png)

## About Us

This repository is maintained by the Learning Planet Institute, a global NGO dedicated to transforming education through innovative, collaborative, and inclusive approaches. It fosters the development of sustainable learning ecosystems, promotes lifelong learning, and empowers individuals and communities to actively contribute to solving global challenges. The institute connects diverse stakeholders to create a more equitable and impactful educational future.

# WELEARN CLIENT

WeLearn is a web app designed for university and undergraduate teachers to facilitate the integration of Sustainable Development Goals (SDGs) into their courses. The app provides a chat interface powered by a language model that assists in creating course content with verified, SDG-related information. It ensures that all resources used in course creation are reliable and accurate, empowering educators to teach about the SDGs effectively.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
- [Development](#development)
- [Contact](#contact)
- [License](#license)

## Introduction

This project is built with Vue 3 and TypeScript and serves as an SDG expert to help teachers and students incorporate SDGs into their classes. It is only a frontend: all data and language model calls go through the [WeLearn API](https://github.com/CyberCRI/WeLearn-api). While it is open-source, please note that **this project is not open to contributions** at the moment.

## Features

- **Chat**: Teachers ask questions and get answers built from a database of verified sources, through the WeLearn API (language model + vector similarity search). Results can be filtered by SDG or by source, and cited sources can be bookmarked.
- **Syllabus**: A step-by-step assistant that turns a teacher's own course files (PDF, TXT or DOCX) into a syllabus enriched with SDG-related resources. Teachers review the summaries, pick resources, edit the syllabus and download it as a Word document.
- **Microlearning**: Short learning journeys, by discipline, that show how a subject connects to sustainability and how to bring it into class.
- **Search**: Similarity-based search across the database of verified sources, with detection of the SDGs a text relates to.
- **Bookmarks**: A central place to view and manage the documents saved from the search or chat features, with a bibliography export.

## Requirements

To run this project locally, you'll need:

- **Node.js 20** (the version used by CI and the Docker image). You can download it from [nodejs.org](https://nodejs.org/).
- **Yarn 1.22.x or later**. Install it globally with:

```bash
npm install -g yarn
```

## Installation

To install and run this project locally, follow these steps:

1. Clone the repository (the `devops-toolbox/` submodule is only used to build the Docker image, you don't need it to run the app locally):

```bash
git clone https://github.com/CyberCRI/WeLearn-client.git
```

2. Navigate into the project directory:

```bash
cd WeLearn-client
```

3. Copy the example env file, then fill in the values:

```bash
cp .env.test .env.local
```

| Variable                                                              | Purpose                                                                       |
| --------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `VITE_API_BASE`, `VITE_API_VERSION`                                   | URL and version of the WeLearn API                                            |
| `VITE_WL_API_KEY`                                                     | API key sent with every request                                               |
| `VITE_ENVIRONMENT`                                                    | Environment name. Login is only required when it is set to `dev` or `staging` |
| `VITE_KEYCLOAK_URL`, `VITE_KEYCLOAK_REALM`, `VITE_KEYCLOAK_CLIENT_ID` | Keycloak authentication                                                       |
| `VITE_MIXPANEL_TOKEN`                                                 | Analytics token. Optional, analytics are currently disabled                   |

4. Install dependencies using Yarn (this also enables the git pre-push hook, see [Development](#development)):

```bash
yarn install
```

5. Run the development server:

```bash
yarn dev
```

## Usage

After setting up the project locally, open `http://localhost:5173/` in your browser.

### API Dependency

This project relies on a REST API that handles all interactions with the database and the large language model (LLM) service. **Certain features of the application will only function correctly if the API is up and running.**

If you're encountering issues with features not working or receiving errors, it's possible that the API is down or unreachable. You can find instructions for setting up the API in the [API repository](https://github.com/CyberCRI/WeLearn-api).

Ensure that you have the API running locally or connected to a live instance for full functionality. The app communicates with the API to fetch data and interact with the LLM service, so both need to be operational for a complete experience.

### Project structure

The project follows a standard Vue 3 application structure:

- **`src/`**: All the source code of the web application.
  - `src/views/`: One view per page of the app.
  - `src/components/`: Reusable Vue components, with feature subfolders (`tutor/`, `microlearning/`, `icons/`, ...).
  - `src/stores/`: Pinia stores for state management, one per feature.
  - `src/composables/`: Reusable composition functions.
  - `src/utils/`: API helpers, storage and other utilities.
  - `src/localisation/`: English and French translations.
  - `src/types/`: Shared TypeScript types. `src/types/generated/` is generated from the API contract, see below.
- **Unit tests** live in `__tests__/` folders next to the code they test. `tests/` only holds the global test setup.
- **`e2e/`**: End-to-end tests powered by Playwright. API calls are mocked in `e2e/base.ts`.

## Development

| Command              | What it does                                             |
| -------------------- | -------------------------------------------------------- |
| `yarn dev`           | Start the development server                             |
| `yarn build`         | Type-check and build for production                      |
| `yarn test:unit`     | Run the unit tests (Vitest) in watch mode                |
| `yarn test:coverage` | Run the unit tests once with coverage                    |
| `yarn test:e2e`      | Run the end-to-end tests (Playwright)                    |
| `yarn lint`          | Lint and fix the code (ESLint)                           |
| `yarn format`        | Format the code (Prettier)                               |
| `yarn type-check`    | Check types (vue-tsc)                                    |
| `yarn gen:api`       | Regenerate the API types from WeLearn-api's OpenAPI file |

See `package.json` for the full list of scripts.

### API types

The types in `src/types/generated/` are generated from the `openapi.json` file of the [WeLearn API](https://github.com/CyberCRI/WeLearn-api) by `yarn gen:api`. Don't edit them by hand. Set `OPENAPI_SCHEMA=<path or url>` to generate them from a local file or another branch. CI fails if the committed types don't match the API's `main` branch.

### Pre-push hook

`yarn install` enables a git pre-push hook (`.githooks/pre-push`) that runs the same checks as CI before every push: lint, format, type check, unit tests with coverage and the API contract check. End-to-end tests are left to CI. To skip the hook once, use `git push --no-verify`.

### Code conventions

The coding rules are in [CLAUDE.md](CLAUDE.md). It is written for AI agents, but the rules apply to everyone: formatting, naming, reusing components, API calls and types, stores, translations, styling and tests. Prettier and ESLint enforce the formatting and part of the rules. The rest is checked in review.

### Git workflow

- Never commit or push to `main`. Work on a branch and open a pull request, it reaches `main` through a squash merge.
- Name branches `<type>/<short-description>` in kebab-case, for example `feat/bookmark-collections` or `fix/ui-filters-chat-nav`.
- Write commit messages and PR titles as [Conventional Commits](https://www.conventionalcommits.org/): `<type>(<scope>): <summary>`, for example `feat(microlearning): adds form data collection`. The scope is optional and names the feature or area (`chat`, `tutor`, `ui`, `ci`, ...). The PR title becomes the commit on `main`.
- Types: `feat`, `fix`, `docs`, `test`, `refactor`, `chore`, `build`, `ci`.
- Fill in the [pull request template](.github/PULL_REQUEST_TEMPLATE.md).

## Contact

If you have any questions or need further information, feel free to reach out at:

Email: welearn@learningplanetinstitute.org

## License

This work is licensed under a
[Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License][cc-by-nc-sa].

[![CC BY-NC-SA 4.0][cc-by-nc-sa-image]][cc-by-nc-sa]

[cc-by-nc-sa]: http://creativecommons.org/licenses/by-nc-sa/4.0/
[cc-by-nc-sa-image]: https://licensebuttons.net/l/by-nc-sa/4.0/88x31.png
[cc-by-nc-sa-shield]: https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg
