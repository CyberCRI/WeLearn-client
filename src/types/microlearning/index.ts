export type StepType = 'flip' | 'competences' | 'activities' | 'votretour';
export type DiscValue = 'math' | 'history' | 'economics' | 'law' | 'philosophy' | 'psychology';

export interface DisciplineMeta {
  name: string;
  icon: string;
}

export interface FlipCard {
  verb: string;
  text: string;
  color: string;
}

export interface Competence {
  name: string;
  tag: 'transversal' | 'disciplinaire';
  concrete: string;
}

export interface Activity {
  title: string;
  desc: string;
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
  hint: string;
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
  intro: string;
  apports: Apport[];
  feedback: string;
}

export interface VotretourStep extends StepBase {
  type: 'votretour';
  statement: string;
  sub: string;
  prompts: { q: string; placeholder: string }[];
  resource: {
    label: string;
    title: string;
    href: string;
  };
}

export interface Data {
  math: {
    steps: [FlipStep, CompetencesStep, ActivitiesStep, VotretourStep];
  };
  history: {
    steps: [FlipStep, CompetencesStep, ActivitiesStep, VotretourStep];
  };
  economics: {
    steps: [FlipStep, CompetencesStep, ActivitiesStep, VotretourStep];
  };
  law: {
    steps: [FlipStep, CompetencesStep, ActivitiesStep, VotretourStep];
  };
  philosophy: {
    steps: [FlipStep, CompetencesStep, ActivitiesStep, VotretourStep];
  };
  psychology: {
    steps: [FlipStep, CompetencesStep, ActivitiesStep, VotretourStep];
  };
}

export type Step = FlipStep | CompetencesStep | ActivitiesStep | VotretourStep;

export interface Discipline {
  steps: Step[];
}

export const DISC_META: Record<string, DisciplineMeta> = {
  math: { name: 'Mathématiques', icon: '📐' },
  history: { name: 'Histoire', icon: '🏛' },
  economics: { name: 'Économie', icon: '📊' },
  law: { name: 'Droit', icon: '⚖️' },
  philosophy: { name: 'Philosophie', icon: '💭' },
  psychology: { name: 'Psychologie', icon: '🧠' }
};
