/* eslint-env node */
// builds the app once for every e2e environment, the way one docker image serves every environment:
// VITE_ENVIRONMENT is built as the docker placeholder, read at runtime (src/utils/env.ts), and
// filled in per copy like interpolate-variables.sh does at nginx start. one build instead of one
// per environment halves the e2e startup time and peak memory on the CI runner
import { cpSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';

const PLACEHOLDER = '$DOCKER_INJECT_VITE_ENVIRONMENT';
const ENVIRONMENTS = ['test', 'dev'];

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'dist/e2e');

// variables already in the environment win over .env.test
process.env.VITE_ENVIRONMENT = PLACEHOLDER;
await build({ root, mode: 'test', logLevel: 'warn', build: { outDir, emptyOutDir: true } });

for (const env of ENVIRONMENTS) {
  const envDir = path.join(root, `dist/e2e-${env}`);
  rmSync(envDir, { recursive: true, force: true });
  cpSync(outDir, envDir, { recursive: true });

  const files = [
    path.join(envDir, 'index.html'),
    ...readdirSync(path.join(envDir, 'assets'))
      .filter((name) => name.endsWith('.js'))
      .map((name) => path.join(envDir, 'assets', name))
  ];
  let replaced = 0;
  for (const file of files) {
    const text = readFileSync(file, 'utf8');
    if (!text.includes(PLACEHOLDER)) continue;
    writeFileSync(file, text.replaceAll(PLACEHOLDER, env));
    replaced++;
  }
  // no placeholder left in the bundle: the environment got folded in at build time, and every
  // e2e project would silently run as the same environment
  if (!replaced) throw new Error(`${PLACEHOLDER} not found in the e2e build`);
  console.log(`e2e build ready for ${env}: dist/e2e-${env}`);
}
