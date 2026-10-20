// the four teacher spaces of the pedagogical framework, shown on /teach (no required order);
// their texts live in src/localisation/journey/
export const TEACHER_SPACES = ['understand', 'explore', 'design', 'teach'] as const;

export type TeacherSpace = (typeof TEACHER_SPACES)[number];

// one WeLearn logo colour per space (src/assets/base.css), as on the student homepage
export const TEACHER_SPACE_COLOURS: Record<TeacherSpace, { accent: string; tint: string }> = {
  understand: { accent: 'var(--primary)', tint: 'var(--primary-lighter)' },
  explore: { accent: 'var(--secondary)', tint: 'var(--secondary-lighter)' },
  design: { accent: 'var(--lpi-violet)', tint: 'var(--lpi-violet-lighter)' },
  teach: { accent: 'var(--tertiary)', tint: 'var(--tertiary-lighter)' }
};

export interface TeacherModule {
  key: string;
  // name of an existing teacher page; without it the module opens a preview page
  route?: string;
  // the module's result is written by the AI (shown with an "AI draft" label)
  hasAiDraft?: boolean;
}

// understand and design list modules; explore and teach are a single preview page each
export const TEACHER_MODULES: Partial<Record<TeacherSpace, TeacherModule[]>> = {
  understand: [
    { key: 'foundations' },
    { key: 'frameworks' },
    { key: 'teds' },
    { key: 'discipline', route: 'micro-learning' }
  ],
  design: [
    { key: 'course', route: 'tutor', hasAiDraft: true },
    { key: 'activity', hasAiDraft: true }
  ]
};

export const EXPLORE_LENSES = ['learn', 'teach'] as const;

// source categories of the WeLearn API (/search/collections) behind each lens; a lens button
// pre-selects them in the shared filters before opening search or chat
export const EXPLORE_LENS_CATEGORIES: Record<(typeof EXPLORE_LENSES)[number], string[]> = {
  learn: [
    'academic_scientific_publications',
    'expert_reports',
    'science_communication_and_outreach'
  ],
  teach: ['teaching_resources']
};

// the two kinds of results inside "Teach the topic", each shown with one invented example
export const TEACH_RESULT_KINDS = ['teachingResources', 'researchCases'] as const;

// original document of the invented "Cases from research" example (an IPCC report, in WeLearn's corpus)
export const RESEARCH_CASE_SOURCE_URL = 'https://www.ipcc.ch/report/ar6/wg2/';

// example questions of the "Ask WeLearn" panel, per space (texts in journey.teach.spaces.*.ask)
export const ASK_QUESTIONS = ['q1', 'q2'] as const;

export const ACTIVITY_STEPS = [
  'context',
  'connection',
  'intention',
  'type',
  'resources',
  'draft'
] as const;

export const TEACH_STEPS = ['use', 'reflect', 'share'] as const;

// example subjects under the fast lane's text box (texts in journey.teach.fastLane.chips)
export const FAST_LANE_CHIPS = ['law', 'biology', 'engineering'] as const;

// TEDS preview page: the course's main themes
export const TEDS_THEMES = ['climate', 'biodiversity', 'resources', 'justTransition'] as const;

// pages of the teacher space, which show the four spaces instead of the tools in the top menu
const TEACHER_SPACE_ROUTES = ['teach', 'teach-space', 'teach-preview', 'teach-teds'];

export const isTeacherSpaceRoute = (name: unknown) => TEACHER_SPACE_ROUTES.includes(name as string);

export const isPreviewModule = (space: unknown, module: unknown) =>
  !!TEACHER_MODULES[space as TeacherSpace]?.some((item) => item.key === module && !item.route);
