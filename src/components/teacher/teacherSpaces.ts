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
  // kept as a page (its route still works) but not listed as a card on the space page
  isHidden?: boolean;
}

// understand and design list modules; explore and teach are a single preview page each
export const TEACHER_MODULES: Partial<Record<TeacherSpace, TeacherModule[]>> = {
  understand: [
    { key: 'foundations' },
    { key: 'frameworks' },
    // ponytail: TEDS now belongs within foundations; its preview page is kept but no longer listed
    { key: 'teds', isHidden: true },
    { key: 'discipline', route: 'micro-learning' }
  ],
  design: [
    // course design starts with a choice: adapt an existing course or plan a new one
    { key: 'course', route: 'teach-course' },
    { key: 'activity', route: 'teach-activity' }
  ]
};

export const EXPLORE_LENSES = ['learn', 'teach'] as const;

// source categories of the WeLearn API (/search/collections) behind each lens; a lens button
// pre-selects them in the shared filters before opening search or chat
// ponytail: no longer used since explore became the search page (filters are chosen there);
// kept for a later "learn / teaching materials" shortcut
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

// activity design preview: its three parts (texts in journey.teach.spaces.design.modules.activity.parts)
export const ACTIVITY_PARTS = ['context', 'intention', 'develop'] as const;

export const TEACH_STEPS = ['use', 'reflect', 'share'] as const;

// TEDS preview page: the course's main themes
export const TEDS_THEMES = ['climate', 'biodiversity', 'resources', 'justTransition'] as const;

export const isPreviewModule = (space: unknown, module: unknown) =>
  !!TEACHER_MODULES[space as TeacherSpace]?.some((item) => item.key === module && !item.route);
