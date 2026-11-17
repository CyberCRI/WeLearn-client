import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { getModuleContent } from '@/learn/modules';
import { DATA } from '@/learn/modules/discipline';

// temporary safety net while the learn content is reorganised: what the app serves must stay
// identical to the content before the refactor. read with fs so type-check never infers the json
const BEFORE = JSON.parse(
  readFileSync(
    fileURLToPath(new URL('./__fixtures__/content-before-refactor.json', import.meta.url)),
    'utf8'
  )
);

// fields that left the content on purpose (UI labels now in i18n), as paths with numeric indices
const MOVED: RegExp[] = [
  /^(foundations|frameworks)\.\w+\.steps\.\d+\.(mapTitle|labels|groupLabel|ungroupLabel)$/,
  /^(foundations|frameworks)\.\w+\.steps\.\d+\.(challengeLabel|trueLabel|falseLabel)$/,
  /^discipline\.\w+\.\w+\.steps\.0\.hint$/,
  /^discipline\.\w+\.\w+\.steps\.2\.intro$/,
  /^discipline\.\w+\.\w+\.steps\.3\.statement$/,
  /^discipline\.\w+\.\w+\.steps\.3\.resource\.label$/,
  /^discipline\.\w+\.\w+\.steps\.1\.featured\.\d+\.tag$/
];

const strip = (value: unknown, path = ''): unknown => {
  if (Array.isArray(value)) return value.map((v, i) => strip(v, `${path}.${i}`));
  if (value && typeof value === 'object')
    return Object.fromEntries(
      Object.entries(value)
        .filter(([k]) => !MOVED.some((re) => re.test(`${path}.${k}`.slice(1))))
        .map(([k, v]) => [k, strip(v, `${path}.${k}`)])
    );
  return value;
};

describe('learn content after the refactor', () => {
  it('serves the same content as before', () => {
    const now = {
      foundations: {
        en: getModuleContent('foundations', 'en'),
        fr: getModuleContent('foundations', 'fr')
      },
      frameworks: {
        en: getModuleContent('frameworks', 'en'),
        fr: getModuleContent('frameworks', 'fr')
      },
      discipline: DATA
    };
    expect(strip(JSON.parse(JSON.stringify(now)))).toEqual(strip(BEFORE));
  });
});
