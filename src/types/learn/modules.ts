// learn modules built from typed steps (foundations, frameworks); the discipline module has its own
// types (discipline.ts). content lives in src/learn/modules/<id>.ts, EN and FR both typed `ModuleContent`
// so TypeScript keeps them structurally identical. components and state only use ids, never translated text
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
  mapTitle: string;
  // concept ids, in the order shown on each row of the map, with the arrow labels between them
  map: { ids: string[]; arrows: string[] }[];
};

export type DimensionsStep = StepBase & {
  type: 'dimensions';
  labels: { env: string; soc: string; eco: string };
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
  groupLabel: string;
  ungroupLabel: string;
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
  challengeLabel: string;
  challenge: string;
  sdg: { goal: number; text: string };
  question: string;
  options: { id: string; intention: string; competence: string; area: string }[];
  lesson: string;
};

export type MythStep = StepBase & {
  type: 'myth';
  trueLabel: string;
  falseLabel: string;
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
