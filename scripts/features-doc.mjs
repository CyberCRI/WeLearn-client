/* eslint-env node */
// writes docs/features.md from src/featureEnvironments.json, the feature flags' only source:
//   node scripts/features-doc.mjs           write the page
//   node scripts/features-doc.mjs --check   fail when the page is out of date (ci, pre-push)
//   node scripts/features-doc.mjs --release [notes.md]
//     print a release's notes with the section in them: between its markers when the notes
//     already have it (a new run replaces it), else at their end
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SOURCE = 'src/featureEnvironments.json';
const PAGE = 'docs/features.md';
// the same list as ENVIRONMENTS in src/utils/env.ts, in the order of the table
export const ENVIRONMENTS = ['dev', 'staging', 'test', 'prod'];

// every feature, checked: known environments, a description, a page starting with /
export function readFeatures(json) {
  return Object.entries(json).map(([name, { environments, page, preview, description }]) => {
    const unknown = environments.filter((env) => !ENVIRONMENTS.includes(env));
    if (unknown.length) {
      throw new Error(`${SOURCE}: ${name} lists unknown environments: ${unknown.join(', ')}`);
    }
    if (!description?.trim()) throw new Error(`${SOURCE}: ${name} has no description`);
    if (page !== null && !page?.startsWith('/')) {
      throw new Error(`${SOURCE}: ${name} has a page that does not start with /: ${page}`);
    }
    if (preview !== undefined && typeof preview !== 'boolean') {
      throw new Error(`${SOURCE}: ${name} has a preview that is not true or false`);
    }
    return {
      name,
      environments,
      page,
      preview: preview !== false,
      description: description.trim()
    };
  });
}

// a feature off somewhere can be previewed there; one on everywhere has nothing to preview
const previewOf = ({ name, environments, page, preview }) => {
  if (environments.length === ENVIRONMENTS.length) return '—';
  if (!preview) return 'never';
  return page ? `\`${page}?preview=${name}\`` : `\`?preview=${name}\``;
};

const cell = (text) => text.replace(/\|/g, '\\|');

export function featuresTable(features) {
  const header = `| Feature (\`?preview=\`) | ${ENVIRONMENTS.join(' | ')} | Preview | What it is |`;
  const rule = `|---|${ENVIRONMENTS.map(() => ':-:').join('|')}|---|---|`;
  const rows = features.map((feature) => {
    const marks = ENVIRONMENTS.map((env) => (feature.environments.includes(env) ? '✅' : '❌'));
    return `| \`${feature.name}\` | ${marks.join(' | ')} | ${previewOf(feature)} | ${cell(feature.description)} |`;
  });
  return [header, rule, ...rows].join('\n');
}

const HOW_TO_PREVIEW = `\`?preview=<feature>\` turns a feature on for this browser where its environment keeps it off,
\`?preview=a,b\` several at once. The choice is kept in localStorage (\`featurePreview\`), so it
survives reloads and the Keycloak redirects; \`?preview=off\` clears it. A preview never turns off
a feature its environment turns on, and a feature marked "never" (\`"preview": false\`) is never
previewed. Hidden, not secret: anyone who knows the parameter gets it. On dev and staging, the
\`/features\` page lists the same flags with a button to preview each one in this browser.`;

export function featuresPage(features) {
  return `# Feature flags

<!-- generated from ${SOURCE} by \`yarn docs:features\`: edit that file, not this one -->

Where each client feature is on, as \`src/stores/featureFlip.ts\` reads it at runtime from
\`VITE_ENVIRONMENT\`. One Docker image serves every environment. \`test\` is the e2e and CI
build. A feature on everywhere can lose its entry once nothing reads it anymore.

${featuresTable(features)}

## Preview a feature

${HOW_TO_PREVIEW}
`;
}

const START = '<!-- features:start -->';
const END = '<!-- features:end -->';

// the release notes' section: what this version turns on, environment by environment
export function releaseSection(features) {
  return `${START}
## Features by environment

${featuresTable(features)}

${HOW_TO_PREVIEW}
${END}`;
}

export function withReleaseSection(notes, features) {
  const section = releaseSection(features);
  const start = notes.indexOf(START);
  const end = notes.indexOf(END);
  if (start !== -1 && end > start) {
    return notes.slice(0, start) + section + notes.slice(end + END.length);
  }
  return notes.trim() ? `${notes.trimEnd()}\n\n${section}\n` : `${section}\n`;
}

function main(args) {
  const features = readFeatures(JSON.parse(readFileSync(`${ROOT}/${SOURCE}`, 'utf8')));
  const release = args.indexOf('--release');
  if (release !== -1) {
    const notesFile = args[release + 1];
    const notes = notesFile ? readFileSync(notesFile, 'utf8') : '';
    process.stdout.write(withReleaseSection(notes, features));
    return;
  }
  const page = featuresPage(features);
  if (args.includes('--check')) {
    let current = '';
    try {
      current = readFileSync(`${ROOT}/${PAGE}`, 'utf8');
    } catch {
      // no page yet: out of date
    }
    if (current !== page) {
      console.error(
        `${PAGE} is out of date with ${SOURCE}: run \`yarn docs:features\` and commit it`
      );
      process.exit(1);
    }
    return;
  }
  writeFileSync(`${ROOT}/${PAGE}`, page);
  console.log(`wrote ${PAGE}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main(process.argv.slice(2));
