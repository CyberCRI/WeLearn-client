import type { TeachingContext } from '@/types';

// quick choices of the teaching context; labels live in the tutor.course texts
export const LEVELS = ['l1', 'l2', 'l3', 'm1', 'm2', 'doctorate', 'other'] as const;
export const SESSION_LENGTHS = [1, 1.5, 2, 2.5, 3, 3.5, 4] as const;
export const SESSION_TYPES = ['lecture', 'tutorial', 'practical', 'seminar', 'project', 'mixed'];
export const SESSION_MODES = ['PRESENTIEL', 'DISTANCIEL', 'HYBRIDE'] as const;

export const emptyTeachingContext = (): TeachingContext => ({
  title: '',
  discipline: '',
  level: '',
  sessions: null,
  sessionLength: null,
  sessionType: '',
  sessionMode: '',
  classSize: null
});

// "1 h 30" in both languages
export const formatHours = (hours: number) =>
  `${Math.floor(hours)} h${hours % 1 ? ` ${Math.round((hours % 1) * 60)}` : ''}`;

// "L1", "L 1", "Licence 1", "M2", "Master 2", "first-year bachelor"
const LEVEL =
  /\b(?:L\s?([123])|M\s?([12])|licence\s+([123])|master\s+([12])|(first|second|third)[- ]year\s+(?:bachelor|undergraduate))\b/gi;

const levelOf = (match: RegExpMatchArray) => {
  const [, l, m, licence, master, year] = match;
  if (l || licence) return `l${l || licence}`;
  if (m || master) return `m${m || master}`;
  return { first: 'l1', second: 'l2', third: 'l3' }[year.toLowerCase()] || '';
};

// the quick choice for a level written in words ("Licence 1, Semestre 1", "First-year
// Bachelor"); '' when it names none, or several
export const levelFromText = (text: string) => {
  const levels = new Set([...text.matchAll(LEVEL)].map(levelOf).filter(Boolean));
  return levels.size === 1 ? [...levels][0] : '';
};
