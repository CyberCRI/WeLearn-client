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
}

// understand and design list modules; explore and teach are a single preview page each
export const TEACHER_MODULES: Partial<Record<TeacherSpace, TeacherModule[]>> = {
  understand: [
    { key: 'foundations' },
    { key: 'frameworks' },
    { key: 'teds' },
    { key: 'discipline', route: 'micro-learning' }
  ],
  design: [{ key: 'course', route: 'tutor' }, { key: 'activity' }]
};

export const EXPLORE_LENSES = ['learn', 'teach'] as const;

export const ACTIVITY_STEPS = [
  'context',
  'connection',
  'intention',
  'type',
  'resources',
  'draft'
] as const;

export const TEACH_STEPS = ['use', 'reflect', 'share'] as const;

export const isPreviewModule = (space: unknown, module: unknown) =>
  !!TEACHER_MODULES[space as TeacherSpace]?.some((item) => item.key === module && !item.route);
