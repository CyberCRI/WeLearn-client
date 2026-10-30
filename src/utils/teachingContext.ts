import type { TeachingContext } from '@/types';

// quick choices of the "Teaching context" section; labels live in the tutor.course texts
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

// "12 sessions of 3 hours", "12 séances de 3 h"...
const SESSIONS_WITH_LENGTH =
  /(\d+)\s+(?:sessions?|séances?)\s+(?:of|de)\s+(\d+(?:[.,]\d+)?)\s*(?:hours?|heures?|h)\b/i;
const SESSIONS_ONLY = /(\d+)\s+(?:sessions|séances)\b/i;

// only what the syllabus states explicitly, word for word: nothing is guessed. a length that
// is not one of the quick choices is left out rather than rounded
export const readTeachingContext = (
  text: string
): Partial<Pick<TeachingContext, 'sessions' | 'sessionLength'>> => {
  const both = text.match(SESSIONS_WITH_LENGTH);
  if (both) {
    const sessions = Number(both[1]);
    const length = Number(both[2].replace(',', '.'));
    const isChoice = (SESSION_LENGTHS as readonly number[]).includes(length);
    return isChoice ? { sessions, sessionLength: length } : { sessions };
  }
  const only = text.match(SESSIONS_ONLY);
  return only ? { sessions: Number(only[1]) } : {};
};
