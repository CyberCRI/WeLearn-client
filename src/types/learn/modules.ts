// learn modules built from typed steps (foundations, frameworks); the discipline module has its own
// types (discipline.ts). each module is written in two parts:
// - its structure (src/learn/modules/<id>.ts): ids, order and answers, the same in every language
// - its text (src/localisation/learn/content/<id>.<lang>.ts): typed from the structure's ids, so a
//   missing or extra id in one language fails type-check
// buildModule (src/learn/modules.ts) merges them into the `ModuleContent` the components read.
// components and state only use ids, never translated text
import type { SourceId } from '@/learn/sources';

// modules run by LearnModule.vue from typed steps
export type ModuleId = 'foundations' | 'frameworks';
// every module on the Learn page
export type LearnModuleId = ModuleId | 'discipline';

// a citation shown as a chip next to a statement. `check`: rests on a source not fully verified yet,
// kept for the researcher's review (not shown in the app)
export type Cite = { src: SourceId; loc?: string; check?: boolean };

// `id` is stable across languages and reorders, so saved progress keeps pointing at the right step
type StepBase = { id: string; title: string; short: string; instruction?: string; cite?: Cite[] };

export type ConceptsStep = StepBase & {
  type: 'concepts';
  items: {
    id: string;
    term: string;
    role: string;
    explanation: string;
    example: string;
    relation: string;
    cite: Cite[];
  }[];
  // concept ids, in the order shown on each row of the map, with the arrow labels between them
  map: { ids: string[]; arrows: string[] }[];
};

export type DimensionsStep = StepBase & {
  type: 'dimensions';
  examples: { id: string; label: string; env: string; soc: string; eco: string; link: string }[];
  closing: string;
};

export type SortStep = StepBase & {
  type: 'sort';
  bins: { id: string; label: string }[];
  cards: { id: string; text: string; bin: string; feedback: string; hint: string }[];
  closing?: string;
};

export type TimelineStep = StepBase & {
  type: 'timeline';
  events: { year: string; label: string; detail: string; cite: Cite[] }[];
  closing: string;
  closingCite: Cite[];
  note: string;
};

export type SdgsStep = StepBase & {
  type: 'sdgs';
  explanation: string;
  ps: { id: string; label: string; goals: number[] }[];
  psCite: Cite[];
  focus: { goal: number; linked: number[]; button: string; text: string; cite: Cite[] };
  note: string;
};

export type GreenCompStep = StepBase & {
  type: 'greencomp';
  explanation: string;
  areas: { id: string; name: string; competences: { name: string; line: string }[] }[];
  note: string;
  noteCite: Cite[];
  attribution: string;
};

export type ExampleStep = StepBase & {
  type: 'example';
  challenge: string;
  sdg: { goal: number; text: string };
  question: string;
  options: { id: string; intention: string; competence: string; area: string }[];
  lesson: string;
};

export type MythStep = StepBase & {
  type: 'myth';
  statements: { text: string; answer: boolean; feedback: string; cite?: Cite[] }[];
};

export type Step =
  | ConceptsStep
  | DimensionsStep
  | SortStep
  | TimelineStep
  | SdgsStep
  | GreenCompStep
  | ExampleStep
  | MythStep;

export type ModuleContent = {
  title: string;
  subtitle: string;
  duration: string;
  hook: string;
  goal: string;
  confidenceBefore: string;
  confidenceAfter: string;
  steps: Step[];
  takeaways: string[];
};

// ---- structure: everything that does not depend on the language ----
// citations are not part of it: their location ("p. 3", "préambule") is written in each language

type StructureBase = { id: string };

export type ConceptsStructure = StructureBase & {
  type: 'concepts';
  items: readonly { id: string }[];
  map: readonly { ids: readonly string[] }[];
};
export type DimensionsStructure = StructureBase & {
  type: 'dimensions';
  examples: readonly { id: string }[];
};
export type SortStructure = StructureBase & {
  type: 'sort';
  bins: readonly { id: string }[];
  cards: readonly { id: string; bin: string }[];
};
export type TimelineStructure = StructureBase & {
  type: 'timeline';
  events: readonly { year: string }[];
};
export type SdgsStructure = StructureBase & {
  type: 'sdgs';
  ps: readonly { id: string; goals: readonly number[] }[];
  focus: { goal: number; linked: readonly number[] };
};
export type GreenCompStructure = StructureBase & {
  type: 'greencomp';
  areas: readonly { id: string; competences: readonly string[] }[];
};
// each option points to a GreenComp area and competence: their names come from the greencomp step
export type ExampleStructure = StructureBase & {
  type: 'example';
  sdg: { goal: number };
  options: readonly { id: string; area: string; competence: string }[];
};
export type MythStructure = StructureBase & {
  type: 'myth';
  statements: readonly { answer: boolean }[];
};

export type StepStructure =
  | ConceptsStructure
  | DimensionsStructure
  | SortStructure
  | TimelineStructure
  | SdgsStructure
  | GreenCompStructure
  | ExampleStructure
  | MythStructure;

export type ModuleStructure = { steps: readonly StepStructure[] };

// ---- text: one object per language, shaped by the structure ----

// lists with ids become objects keyed by those ids; lists without ids keep their length
type ById<L extends readonly { id: string }[], T> = { [K in L[number]['id']]: T };
type ByPosition<L extends readonly unknown[], T> = { -readonly [K in keyof L]: T };

type StepTextBase = { title: string; short: string; instruction?: string; cite?: Cite[] };

type GreenCompAreasText<L extends GreenCompStructure['areas']> = {
  [A in L[number] as A['id']]: {
    name: string;
    competences: { [C in A['competences'][number]]: { name: string; line: string } };
  };
};

export type StepText<S extends StepStructure> = StepTextBase &
  (S extends ConceptsStructure
    ? {
        items: ById<
          S['items'],
          {
            term: string;
            role: string;
            explanation: string;
            example: string;
            relation: string;
            cite: Cite[];
          }
        >;
        map: ByPosition<S['map'], { arrows: string[] }>;
      }
    : S extends DimensionsStructure
      ? {
          examples: ById<
            S['examples'],
            { label: string; env: string; soc: string; eco: string; link: string }
          >;
          closing: string;
        }
      : S extends SortStructure
        ? {
            bins: ById<S['bins'], string>;
            cards: ById<S['cards'], { text: string; feedback: string; hint: string }>;
            closing?: string;
          }
        : S extends TimelineStructure
          ? {
              events: ByPosition<S['events'], { label: string; detail: string; cite: Cite[] }>;
              closing: string;
              closingCite: Cite[];
              note: string;
            }
          : S extends SdgsStructure
            ? {
                explanation: string;
                ps: ById<S['ps'], string>;
                psCite: Cite[];
                focus: { button: string; text: string; cite: Cite[] };
                note: string;
              }
            : S extends GreenCompStructure
              ? {
                  explanation: string;
                  areas: GreenCompAreasText<S['areas']>;
                  note: string;
                  noteCite: Cite[];
                  attribution: string;
                }
              : S extends ExampleStructure
                ? {
                    challenge: string;
                    sdg: { text: string };
                    question: string;
                    options: ById<S['options'], { intention: string }>;
                    lesson: string;
                  }
                : S extends MythStructure
                  ? {
                      statements: ByPosition<
                        S['statements'],
                        { text: string; feedback: string; cite?: Cite[] }
                      >;
                    }
                  : never);

export type ModuleText<S extends ModuleStructure> = {
  title: string;
  subtitle: string;
  duration: string;
  hook: string;
  goal: string;
  confidenceBefore: string;
  confidenceAfter: string;
  takeaways: string[];
  steps: { [St in S['steps'][number] as St['id']]: StepText<St> };
};
