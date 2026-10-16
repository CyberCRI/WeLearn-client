// the five learning spaces, in the order shown on the student homepage;
// their texts live in src/localisation/student/
export const STUDENT_SPACES = ['understand', 'explore', 'analyse', 'envision', 'apply'] as const;

export type StudentSpace = (typeof STUDENT_SPACES)[number];

// one WeLearn logo colour per space (src/assets/base.css): the accent for borders,
// the tint behind the space label (label text stays dark for contrast)
export const SPACE_COLOURS: Record<StudentSpace, { accent: string; tint: string }> = {
  understand: { accent: 'var(--primary)', tint: 'var(--primary-lighter)' },
  explore: { accent: 'var(--secondary)', tint: 'var(--secondary-lighter)' },
  analyse: { accent: 'var(--lpi-violet)', tint: 'var(--lpi-violet-lighter)' },
  envision: { accent: 'var(--lpi-yellow)', tint: 'var(--lpi-yellow-lighter)' },
  apply: { accent: 'var(--tertiary)', tint: 'var(--tertiary-lighter)' }
};

export const isStudentRoute = (name: unknown) => name === 'learn' || name === 'learn-space';
