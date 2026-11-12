import type { CourseField, ObjectiveGroup, ObjectiveScope, Verification } from '@/types';

// compares texts the way they read: case, spaces, line breaks, quote and dash styles, list
// markers and final punctuation aside. accents and words are kept: "Maîtriser" is not
// "Maitriser", so a corrected or reworded item is never taken for the syllabus's own words
// (adapted from the "design your course" prototype)
export const normalise = (text: string) =>
  text
    .normalize('NFC')
    .toLowerCase()
    .replace(/[’‘`´]/g, "'")
    .replace(/[«»“”]/g, '"')
    .replace(/[‐-―−]/g, '-')
    .replace(/…/g, '...')
    .replace(/œ/g, 'oe')
    // a word cut at the end of a line ("struc-\nture") is one word
    .replace(/-\s*\n\s*/g, '')
    .replace(/\s+/g, '');

const LIST_MARKER = /^\s*(?:[-–•o▪◦*]|\d+[.)])\s/;

// an item as WeLearn returns it may carry the list marker or the full stop the document did
// not, or the other way round: neither is part of the words
export const core = (text: string) =>
  normalise(text.replace(LIST_MARKER, '')).replace(/[.;:,!]+$/, '');

export const verify = (value: string, documentText: string | null): Verification => {
  if (documentText === null) return 'unchecked';
  const needle = core(value);
  return needle && normalise(documentText).includes(needle) ? 'verified' : 'unverified';
};

const HEADING = {
  competency: /comp[ée]tence|competenc|skill|savoir-faire|aptitude|capacit/i,
  objective: /objecti|outcome|acquis d|\baims?\b|\bgoals?\b/i,
  // the degree the course belongs to; a heading naming the course as well is the course's
  programme:
    /licence|bachelor|master|programme|program\b|dipl[ôo]me|degree|mention|parcours|formation|\bprl\b/i,
  // the institution: general education, a common core, a competence framework, requirements for
  // every course of an area. wider than the course even when the heading says "course"
  institution:
    /general education|\bgen\.? ?ed\b|common core|required core|flexible core|core curriculum|tronc commun|r[ée]f[ée]rentiel|graduate attributes|institution|universit|college-wide|in this area/i,
  // the course itself named next to its objectives
  course:
    /\bcourse\b[^.:]{0,30}(objecti|outcome|aim|goal)|(objecti|outcome|aim|goal)\w*[^.:]{0,20}\b(of|for|in) (this|the) (course|module|class|unit)\b|objectifs?[^.:]{0,30}\b(du|de ce|de l[’'])\s?(cours|module|enseignement|ue)\b|acquis[^.:]{0,30}\b(du|de ce) (cours|module)\b|\bce cours\b|\bthis course\b/i
};

// a heading line: short, not a list item, and ending with a colon or naming objectives or
// competencies
const isHeading = (line: string) => {
  const text = line.trim();
  if (!text || text.length > 100 || LIST_MARKER.test(text)) return false;
  return /:\s*$/.test(text) || HEADING.competency.test(text) || HEADING.objective.test(text);
};

// a heading of a descriptive part of the syllabus (its summary, description, organisation,
// prerequisites, readings, assessment): what sits under it describes the course, it is not an
// objective
const SECTION =
  /^\s*(course\s+)?(summary|description|overview|organi[sz]ation(\s+of\s+the\s+course)?|prerequisites?|pre-requisites?|requirements|bibliography|readings?|assessment|grading|schedule|r[ée]sum[ée]|pr[ée]sentation(\s+du\s+cours)?|organisation(\s+du\s+cours)?|pr[ée]-?requis|bibliographie|lectures|[ée]valuation|modalit[ée]s\s+d['’][ée]valuation|calendrier)\s*:?\s*$/i;

// what a heading says about the items under it; "other": a descriptive part, not objectives
type HeadingScope = 'course' | 'programme' | 'competency' | 'generic' | 'other';
const scopeOf = (heading: string): HeadingScope | null => {
  if (HEADING.institution.test(heading)) return 'programme';
  if (HEADING.programme.test(heading) && !HEADING.course.test(heading)) return 'programme';
  if (HEADING.competency.test(heading)) return 'competency';
  if (HEADING.course.test(heading)) return 'course';
  return HEADING.objective.test(heading) ? 'generic' : null;
};

// how far up a generic heading ("Learning outcomes") is read to find what it belongs to
const MAX_HEADINGS = 3;

// where an item sits in the document: under the course's objectives, its competencies, wider
// (degree, institution, general education) objectives, or a generic heading that does not say.
// a generic heading takes the scope of the heading above it, when that one names one (a table
// "Learning outcomes" under "General education learning outcomes"). null when the item or its
// heading cannot be found
export const headingScope = (value: string, documentText: string | null): HeadingScope | null => {
  if (!documentText) return null;
  const lines = documentText.split('\n');
  const needle = core(value);
  // the line where the item starts: the normalised text is built line by line
  let joined = '';
  const starts: number[] = [];
  lines.forEach((line) => {
    starts.push(joined.length);
    joined += normalise(line);
  });
  const at = needle ? joined.indexOf(needle) : -1;
  // an item the AI reworded: found only by its words, which tells no more than whether it comes
  // from a descriptive part (its summary, description, organisation); any other scope stays unknown.
  // its words may start on the heading's own line ("Summary" then its sentence)
  if (at < 0) {
    const near = lineByWords(value, lines);
    // up from there: a descriptive heading first means a descriptive part; a short heading first
    // (an objectives one) means nothing can be said. a long line is the text, never a heading
    for (let i = near; i >= 0; i--) {
      if (SECTION.test(lines[i])) return 'other';
      if (lines[i].trim().length <= MAX_SHORT_HEADING && isHeading(lines[i])) return null;
    }
    return null;
  }
  let line = starts.length - 1;
  while (line > 0 && starts[line] > at) line--;
  return scopeAbove(line, lines);
};

// the line where a reworded item most likely comes from: most of its words (four letters or more)
// within three lines of the syllabus; -1 when none holds enough of them
const MIN_WORDS = 4;
const MIN_SHARE = 0.6;
// a heading is short; a longer line read upwards is the syllabus's text
const MAX_SHORT_HEADING = 60;
const wordsIn = (text: string) =>
  text
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter((word) => word.length >= 4);
const lineByWords = (value: string, lines: string[]) => {
  const wanted = [...new Set(wordsIn(value))];
  if (wanted.length < MIN_WORDS) return -1;
  let best = -1;
  let bestShare = 0;
  lines.forEach((_, i) => {
    const near = new Set(wordsIn(lines.slice(i, i + 3).join(' ')));
    const share = wanted.filter((word) => near.has(word)).length / wanted.length;
    // the last of the best windows: it starts on the item's own first line, not above it
    if (share >= bestShare) [best, bestShare] = [i, share];
  });
  return bestShare >= MIN_SHARE ? best : -1;
};

// the scope given by the headings above a line
const scopeAbove = (line: number, lines: string[]): HeadingScope | null => {
  let found: HeadingScope | null = null;
  let seen = 0;
  for (let i = line - 1; i >= 0 && seen < MAX_HEADINGS; i--) {
    // under a descriptive part, unless an objectives heading came first
    if (SECTION.test(lines[i])) return found ?? 'other';
    if (!isHeading(lines[i])) continue;
    seen++;
    const scope = scopeOf(lines[i]);
    if (scope && scope !== 'generic') return scope;
    if (!scope) return found;
    found = 'generic';
  }
  return found;
};

// the group a heading alone gives (a reading without the AI's scope)
export const groupInDocument = (
  value: string,
  documentText: string | null
): ObjectiveGroup | null => {
  const scope = headingScope(value, documentText);
  if (scope === 'programme' || scope === 'competency') return scope;
  return scope && scope !== 'other' ? 'objective' : null;
};

// a "description" that includes other parts of the syllabus: very long, or several labelled
// parts ("Intitulé du cours :", "Plan de cours :") inside it
export const looksLikeMoreThanDescription = (text: string) =>
  text.length > 1200 || (text.match(/[^\s.:;]{3,}[^.:;]{0,60}\s:\s/g) || []).length >= 3;

export const fromSyllabus = (
  value: string,
  verification: Verification,
  group?: ObjectiveGroup
): CourseField => ({
  value,
  origin: 'extracted',
  original: value,
  verification,
  ...(group && { group })
});

// WeLearn's objectives, each checked and placed in its group; nothing is dropped. WeLearn
// returns them in document order, so an item that cannot be placed (reworded, or the file not
// readable here) joins its neighbours when both sit in the same group; otherwise it stays a course
// objective, which the teacher can move
export const checkObjectives = (values: string[], documentText: string | null): CourseField[] => {
  const groups = values.map((value) => groupInDocument(value, documentText));
  return values.map((value, index) => {
    const before = groups.slice(0, index).reverse().find(Boolean);
    const after = groups.slice(index + 1).find(Boolean);
    const group = groups[index] || (before && before === after ? before : 'objective');
    return fromSyllabus(value, verify(value, documentText), group);
  });
};

// the full reading's objectives, placed with both what the AI says (the course, the programme,
// or unspecified) and the heading they sit under. a sentence of a descriptive part (summary,
// description, organisation, prerequisites) is not taken as the course's: it waits for the
// teacher, unsorted, whatever the AI says. wider than the course (the degree, the
// institution, general education) by either: kept apart. the course's own by either: course
// objectives or competencies. what neither settles (a generic "Learning outcomes" the AI could
// not place) is never taken as the course's: it waits for the teacher, unsorted. nothing is
// dropped
export const placeObjectives = (
  items: { text: string; scope: ObjectiveScope }[],
  documentText: string | null
): CourseField[] =>
  items.map(({ text, scope }) => {
    const heading = headingScope(text, documentText);
    const group: ObjectiveGroup =
      heading === 'other'
        ? 'unsorted'
        : scope === 'programme' || heading === 'programme'
          ? 'programme'
          : heading === 'competency'
            ? 'competency'
            : scope === 'course' || heading === 'course'
              ? 'objective'
              : 'unsorted';
    return fromSyllabus(text, verify(text, documentText), group);
  });

// a corrected piece keeps its syllabus wording; getting that wording back makes it "read" again
export const editField = (field: CourseField, value: string): CourseField => {
  if (field.origin === 'added') return { ...field, value };
  return { ...field, value, origin: value === field.original ? 'extracted' : 'edited' };
};

export const restoreField = (field: CourseField): CourseField =>
  field.original === undefined ? field : { ...field, value: field.original, origin: 'extracted' };
