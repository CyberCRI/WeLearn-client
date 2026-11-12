import type { TeachingContext } from '@/types';
import { isCourseTitle } from '@/utils/courseReading';

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
const TITLE =
  /^\s*(?:intitul[ée](?:\s+du\s+cours)?|titre(?:\s+du\s+cours)?|nom\s+du\s+cours|course\s+title|course\s+name|title)\s*:\s*(.*)$/i;
// a document headed "SYLLABUS": the course title is the next line
const SYLLABUS_HEADER = /^(?:syllabus|course\s+syllabus|plan\s+de\s+cours)$/i;
const SESSION_COUNTS = /(\d+)\s+(?:sessions?|séances?)\b/gi;
const DISCIPLINE = /^\s*(?:discipline|subject)\s*:\s*(.+)$/i;
const CLASS_SIZE =
  /(?:effectif|class\s+size|nombre\s+d['’]étudiants|number\s+of\s+students)\s*:?\s*(\d+)/i;
// "L1", "L 1", "Licence 1", "M2", "Master 2", "first-year bachelor"
const LEVEL =
  /\b(?:L\s?([123])|M\s?([12])|licence\s+([123])|master\s+([12])|(first|second|third)[- ]year\s+(?:bachelor|undergraduate))\b/gi;
const HAS_LEVEL = new RegExp(LEVEL.source, 'i');
const MODES = {
  hybrid: /hybride|hybrid|comodal/i,
  inPerson: /pr[ée]sentiel|in[- ]person|face[- ]to[- ]face/i,
  remote: /distanciel|(?:^|[\s(])à distance|\bonline\b|\bremote\b/i
};
// "lecture" is not used alone: in French it means reading
const TYPES: Record<string, RegExp> = {
  lecture: /\bCM\b|[Cc]ours\s+magistra|\b[Ll]ectures?\s*[:(]/,
  tutorial: /\bTD\b|travaux\s+dirig|\btutorials?\b/i,
  practical: /\bTP\b|travaux\s+pratiques|\blab\s+sessions?\b|\bpracticals?\b/i,
  seminar: /s[ée]minaire|\bseminars?\b/i
};

type Found = Partial<TeachingContext>;
export type ContextReading = {
  values: Found;
  // the line of the syllabus each value was read from, shown to the teacher as evidence
  evidence: Partial<Record<keyof TeachingContext, string>>;
};

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

// only what the syllabus states explicitly: nothing is guessed. a value stated in several
// conflicting ways (L1, L2 and L3 in a degree overview) is left to the teacher, and a length that
// is not one of the quick choices is left out rather than rounded
export const readTeachingContext = (text: string): ContextReading => {
  const lines = text.split('\n').map((line) => line.trim());
  const values: Found = {};
  const evidence: ContextReading['evidence'] = {};
  const lineWith = (pattern: RegExp) => lines.find((line) => pattern.test(line));
  const keep = <K extends keyof TeachingContext>(
    key: K,
    value: TeachingContext[K],
    line?: string
  ) => {
    values[key] = value;
    if (line) evidence[key] = line.slice(0, 160);
  };

  const both = text.match(SESSIONS_WITH_LENGTH);
  const only = text.match(SESSIONS_ONLY);
  // several different counts (7 lectures, 5 tutorials) leave the number to the teacher
  const counts = new Set([...text.matchAll(SESSION_COUNTS)].map((match) => match[1]));
  if (counts.size > 1) {
    // ambiguous: nothing is filled in
  } else if (both) {
    const length = Number(both[2].replace(',', '.'));
    keep('sessions', Number(both[1]), lineWith(SESSIONS_WITH_LENGTH));
    if ((SESSION_LENGTHS as readonly number[]).includes(length)) {
      keep('sessionLength', length, lineWith(SESSIONS_WITH_LENGTH));
    }
  } else if (only) {
    keep('sessions', Number(only[1]), lineWith(SESSIONS_ONLY));
  }

  // the title is the rest of its labelled line, or the next line when the label stands alone
  const labelAt = lines.findIndex((line) => TITLE.test(line));
  const titleAt = labelAt >= 0 ? labelAt : lines.findIndex((line) => SYLLABUS_HEADER.test(line));
  if (titleAt >= 0) {
    const sameLine = labelAt >= 0 ? lines[titleAt].match(TITLE)?.[1].trim() : undefined;
    const next = lines.slice(titleAt + 1).find(Boolean);
    const title = sameLine || next;
    // the line after "SYLLABUS" may be a teacher or a date ("Professor: …", "2026"): not a title
    if (title && title.length <= 120 && isCourseTitle(title))
      keep('title', title, sameLine ? lines[titleAt] : title);
    // the level written right under the title belongs to this course
    const block = lines.slice(titleAt, titleAt + 4).join('\n');
    const near = [...block.matchAll(LEVEL)].map(levelOf).filter(Boolean);
    if (new Set(near).size === 1) {
      keep(
        'level',
        near[0],
        lines.slice(titleAt, titleAt + 4).find((line) => HAS_LEVEL.test(line))
      );
    }
  }
  if (!values.level) {
    const all = [...text.matchAll(LEVEL)].map(levelOf).filter(Boolean);
    if (new Set(all).size === 1) keep('level', all[0], lineWith(HAS_LEVEL));
  }

  const discipline = text.match(new RegExp(DISCIPLINE.source, 'im'));
  if (discipline) keep('discipline', discipline[1].trim(), discipline[0].trim());

  const size = text.match(CLASS_SIZE);
  if (size) keep('classSize', Number(size[1]), lineWith(CLASS_SIZE));

  const hybrid = lineWith(MODES.hybrid);
  const inPerson = lineWith(MODES.inPerson);
  const remote = lineWith(MODES.remote);
  if (hybrid) keep('sessionMode', 'HYBRIDE', hybrid);
  else if (inPerson && remote) {
    keep('sessionMode', 'HYBRIDE', inPerson === remote ? inPerson : `${inPerson} … ${remote}`);
  } else if (inPerson) keep('sessionMode', 'PRESENTIEL', inPerson);
  else if (remote) keep('sessionMode', 'DISTANCIEL', remote);

  const types = Object.keys(TYPES).filter((type) => TYPES[type].test(text));
  if (types.length === 1) keep('sessionType', types[0], lineWith(TYPES[types[0]]));
  if (types.length > 1) {
    const typeLines = [...new Set(types.map((type) => lineWith(TYPES[type])))];
    keep('sessionType', 'mixed', typeLines.join(' … '));
  }

  return { values, evidence };
};
