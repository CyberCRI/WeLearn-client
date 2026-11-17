// 'votretour' is the reflection step; the value is fixed by the static data
export type StepType = 'flip' | 'competences' | 'activities' | 'votretour';
export type DiscValue =
  | 'math'
  | 'history'
  | 'economics'
  | 'law'
  | 'philosophy'
  | 'psychology'
  | 'geography'
  | 'health'
  | 'staps'
  | 'letters'
  | 'ecology'
  | 'art'
  | 'polsci'
  | 'physics'
  | 'anthropology';

export interface EvalAnswers {
  link?: number;
  confidence?: number;
  willUse?: string;
  feedback?: string;
}

export type Screens =
  | 'welcome'
  | 'briefing'
  | 'autoEvalStart'
  | 'autoEvalEnd'
  | 'trail'
  | 'complete';

export enum ScreensEnum {
  welcome = 'welcome',
  briefing = 'briefing',
  autoEvalStart = 'autoEvalStart',
  autoEvalEnd = 'autoEvalEnd',
  trail = 'trail',
  complete = 'complete'
}

export interface DisciplineMeta {
  id: string;
  name: string;
}

export interface FlipCard {
  verb: string;
  text: string;
  color: string;
}

export interface Competence {
  name: string;
  // its label is translated in learn.discipline.competence.tags
  tagClass: 'transversal' | 'disciplinary';
  concrete: string;
}

export interface Activity {
  title: string;
  desc: string;
}

export interface ActivityRef {
  apport: number;
  act: number;
}

export interface Apport {
  label: string;
  color: string;
  acts: Activity[];
}

export interface StepBase {
  type: StepType;
}

export interface FlipStep extends StepBase {
  type: 'flip';
  statement: string;
  cards: FlipCard[];
  closing: string;
}

export interface CompetencesStep extends StepBase {
  type: 'competences';
  intro: string;
  featured: Competence[];
  also: string[];
}

export interface ActivitiesStep extends StepBase {
  type: 'activities';
  apports: Apport[];
  feedback: string;
}

export interface ReflectionStep extends StepBase {
  type: 'votretour';
  sub: string;
  prompts: { q: string; placeholder: string }[];
  resource: {
    title: string;
    href: string;
  };
}

export type Data = Record<
  DiscValue,
  { steps: [FlipStep, CompetencesStep, ActivitiesStep, ReflectionStep] }
>;

export type DataByLang = Record<'fr' | 'en', Data>;

export type Step = FlipStep | CompetencesStep | ActivitiesStep | ReflectionStep;

export interface Discipline {
  steps: Step[];
}

// ---- how the content is written: one structure for every language, one text per language ----
// buildDiscipline (src/learn/modules/discipline.ts) merges them into `Data` above

// what does not depend on the language: the kind of each featured competence and the UVED sheet
export type DisciplineStructure = {
  featured: readonly Competence['tagClass'][];
  resource: string;
};

// one of the four ways a discipline contributes: its flip card, then the activities built on it.
// the card colour comes from its position
export type ContributionText = { verb: string; text: string; activities: Activity[] };

type FeaturedText<L extends readonly unknown[]> = {
  -readonly [K in keyof L]: { name: string; concrete: string };
};

export type DisciplineText<S extends DisciplineStructure> = {
  flip: { statement: string; closing: string };
  contributions: [ContributionText, ContributionText, ContributionText, ContributionText];
  competences: { intro: string; featured: FeaturedText<S['featured']>; also: string[] };
  activities: { feedback: string };
  reflection: {
    sub: string;
    prompts: { q: string; placeholder: string }[];
    resourceTitle: string;
  };
};

export type DisciplinesText<S extends Record<DiscValue, DisciplineStructure>> = {
  [D in DiscValue]: DisciplineText<S[D]>;
};
