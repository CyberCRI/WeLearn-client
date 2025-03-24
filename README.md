[![CC BY-NC-SA 4.0][cc-by-nc-sa-shield]][cc-by-nc-sa]


![https://welearn-demo.learningplanetinstitute.org](https://welearn-demo.learningplanetinstitute.org/assets/logo-fdaefaa7.png)

## About Us

This repository is maintained by Learning Planet Institute, a non-governmental organization dedicated to The Learning Planet Institute is a global NGO dedicated to transforming education through innovative, collaborative, and inclusive approaches. It fosters the development of sustainable learning ecosystems, promotes lifelong learning, and empowers individuals and communities to actively contribute to solving global challenges. The institute connects diverse stakeholders to create a more equitable and impactful educational future.

# WELEARN CLIENT

WeLearn is a web app designed for university and undergraduate teachers to facilitate the integration of Sustainable Development Goals (SDGs) into their courses. The app provides a chat interface powered by a language model that assists in creating course content with verified, SDG-related information. It ensures that all resources used in course creation are reliable and accurate, empowering educators to teach about the SDGs effectively.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Requirements](#requirements)
- [License](#license)
- [Contact](#contact)

## Introduction

This project is built with Vue.js and serves as SDG Expert to help teachers and students incorporate SDGs into their classes. While it is open-source, please note that **this project is not open to contributions** at the moment.

## Features

- **Chat**: The chat uses GPT-4 Mini with Qdrant for similarity search, enabling teachers to create SDG-focused content. Teachers can filter results by SDG or source to access verified, relevant information for course development.
- **Search**: The search feature uses Qdrant for similarity-based searching, enabling efficient retrieval of relevant, contextually similar content from a database of verified sources.
- **Bookmark**: The bookmark page allows teachers to easily access and organize all documents they've saved from the search or chat features. It provides a centralized location to view and manage bookmarked resources, making it simple to revisit relevant materials for course development.

Requirements
To run this project locally, you'll need:

Node.js (version >= 14.x.x): You can download it from nodejs.org.
Yarn (version >= 1.22.x): You can install it globally using the command:
bash
Copy
npm install -g yarn

## Installation

To install and run this project locally, follow these steps:

1. Clone the repository:

```bash
   git clone https://github.com/your-username/project-name.git
```

2. Navigate into the project directory:

```bash
  cd WeLearn-client
```

3. Copy and fill the env variables:

```bash
  cp .env.test .env.local
```

4. Install dependencies using Yarn:

```bash
  yarn install
```

5. Run the development server:

```bash
  yarn dev
```

6. For more details on scripts check the `./package.json` file

## Usage

After setting up the project locally, you can begin using it by navigating to the appropriate URL in your browser at `http://localhost:5173/`.

### API Dependency

This project relies on a REST API that handles all interactions with the database and the large language model (LLM) service. **Certain features of the application will only function correctly if the API is up and running.**

If you're encountering issues with features not working or receiving errors, it’s possible that the API is down or unreachable. You find instructions for setting up the API by visiting the [API repository](https://github.com/CyberCRI/WeLearn-api).

Ensure that you have the API running locally or connected to a live instance for full functionality. The app communicates with the API to fetch data and interact with the LLM service, so both need to be operational for a complete experience.

### Project strucutre

The project follows a standard Vue 3 application structure. Here's an overview of the directory layout:

- **`src/`**: Contains all the source code for the web application, including components, views, and stores. This is where the main development of the app takes place.

  - `src/components/`: Contains reusable Vue components.
  - `src/views/`: Contains the main views or pages of the app.
  - `src/store/`: Contains Pinia store(s) for state management.

- **`tests/`**: Contains all the unit and integration test files for the application. This folder includes the test suite for the core functionality of the app.

- **`e2e/`**: Contains end-to-end tests for the application. These tests are powered by Playwright, ensuring that the entire flow of the web app works as expected in real-world scenarios.

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
