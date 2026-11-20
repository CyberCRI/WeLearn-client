import i18n from '@/localisation/i18n';
import {
  editField,
  fromSyllabus,
  looksLikeMoreThanDescription,
  placeObjectives,
  verify
} from '@/utils/courseCheck';
import { levelFromText } from '@/utils/teachingContext';
import type {
  ConfirmedCourse,
  CourseField,
  CourseReadResponse,
  CourseToUpdate,
  ObjectiveGroup,
  TeachingContext
} from '@/types';

type ContextKey = keyof TeachingContext;

// the course information the review shows on its own lines
export const OVERVIEW_KEYS = ['title', 'discipline', 'level'] as const;
export type OverviewKey = (typeof OVERVIEW_KEYS)[number];

// what the review screen shows of a reading: each value checked against the syllabus text, what
// is not found word for word kept and marked, never dropped
export type CourseReview = {
  detectedType: string | null;
  description: CourseField | null;
  // a short overview written by the AI, shown when the syllabus has no clear description
  summary: CourseField | null;
  objectives: CourseField[];
  topics: CourseField[];
  plan: string[];
  // a long syllabus, or a part that could not be read: something may be missing
  isPartial: boolean;
};

export const reviewFromReading = ({
  text,
  reading,
  is_text_truncated,
  is_partial
}: CourseReadResponse): CourseReview => ({
  detectedType: reading.material_type ?? null,
  description: reading.description
    ? fromSyllabus(reading.description, verify(reading.description, text))
    : null,
  summary: reading.summary
    ? { ...fromSyllabus(reading.summary, 'unchecked'), isSummary: true }
    : null,
  // the course's own, its competencies, wider ones, and those to sort: by the reading's scope and
  // the headings they sit under
  objectives: placeObjectives(reading.objectives, text),
  // a topic may be named in the AI's own words; the line it comes from must be in the syllabus.
  // one whose source is not found is kept and marked for checking
  topics: reading.topics.map(({ title, subtopics, source }) => {
    const asWritten = verify(title, text);
    const grounding = asWritten === 'verified' ? asWritten : verify(source || title, text);
    return {
      ...fromSyllabus(title, grounding),
      isSummary: asWritten !== 'verified',
      subtopics,
      source: asWritten === 'verified' ? title : grounding === 'verified' ? source : null
    };
  }),
  plan: reading.sessions.map(({ label, title }) => sessionLine(label, title)),
  isPartial: is_text_truncated || is_partial
});

// title, discipline and level from the reading: found word for word, they are marked as read
// from the syllabus; otherwise for checking. a discipline the syllabus does not state is the AI's
// suggestion
export type ContextFill = {
  values: Partial<TeachingContext>;
  prefilled: ContextKey[];
  aiFilled: ContextKey[];
  aiSuggested: ContextKey[];
  evidence: Partial<Record<ContextKey, string>>;
};

export const contextFromReading = ({ text, reading }: CourseReadResponse): ContextFill => {
  const fill: ContextFill = {
    values: {},
    prefilled: [],
    aiFilled: [],
    aiSuggested: [],
    evidence: {}
  };
  // [the value kept, the syllabus wording it comes from]
  const found: Partial<Record<'title' | 'discipline' | 'level', [string, string]>> = {};
  if (reading.title) found.title = [reading.title, reading.title];
  if (reading.discipline) found.discipline = [reading.discipline, reading.discipline];
  const level = reading.level ? levelFromText(reading.level) : '';
  if (reading.level && level) found.level = [level, reading.level];

  (Object.keys(found) as (keyof typeof found)[]).forEach((key) => {
    const [value, asWritten] = found[key]!;
    fill.values[key] = value;
    if (verify(asWritten, text) === 'verified') {
      fill.prefilled.push(key);
      fill.evidence[key] = asWritten;
    } else {
      fill.aiFilled.push(key);
    }
  });
  if (!reading.discipline && reading.discipline_suggested) {
    fill.values.discipline = reading.discipline_suggested;
    fill.aiSuggested.push('discipline');
  }
  return fill;
};

// the course's own objectives and competencies; the degree's and the unsorted ones are left out
const inGroup = (objectives: CourseField[], group: 'objective' | 'competency') =>
  objectives
    .filter((objective) => (objective.group || 'objective') === group)
    .map(({ value }) => value);

// the overview: the AI's short summary, or the syllabus's description when it is a clear one (a
// description holding programme information is not)
// which text stands for the overview: WeLearn's summary, else the syllabus's description when it
// is a clear one (one holding programme information is not)
export const overviewKind = (
  summary: CourseField | null,
  description: CourseField | null
): 'summary' | 'description' | null => {
  if (summary?.value) return 'summary';
  const isClear =
    !!description &&
    (description.origin !== 'extracted' || !looksLikeMoreThanDescription(description.value));
  return isClear ? 'description' : null;
};

export const overviewOf = (summary: CourseField | null, description: CourseField | null) => {
  const kind = overviewKind(summary, description);
  return kind === 'summary' ? summary!.value : kind === 'description' ? description!.value : null;
};

export const confirmCourse = (
  context: TeachingContext,
  review: Pick<CourseReview, 'summary' | 'description' | 'objectives' | 'topics' | 'plan'>
): CourseToUpdate => ({
  title: context.title || null,
  discipline: context.discipline || null,
  level: context.level ? i18n.global.t(`tutor.course.levels.${context.level}`) : null,
  overview: overviewOf(review.summary, review.description),
  topics: review.topics.map(({ value, subtopics, source }) => ({
    title: value,
    subtopics: subtopics || [],
    source: source || null
  })),
  objectives: inGroup(review.objectives, 'objective'),
  competencies: inGroup(review.objectives, 'competency'),
  sessions: review.plan
});

// the same course as the connection routes take it: topics without their syllabus line
export const toConfirmedCourse = (course: CourseToUpdate): ConfirmedCourse => ({
  ...course,
  topics: course.topics.map(({ title, subtopics }) => ({ title, subtopics }))
});

// the parts of the course a connection may build on, each as the teacher sees it
// a session of the outline is one line: its label ("Semaine du 15/12") and its title
const SESSION_SEPARATOR = ' – ';
export const sessionLine = (label?: string | null, title?: string | null) =>
  [label, title].filter(Boolean).join(SESSION_SEPARATOR);
// the label and title of a session line; no label when it has none
export const sessionParts = (line: string) => {
  const cut = line.indexOf(SESSION_SEPARATOR);
  return cut >= 0
    ? { label: line.slice(0, cut), title: line.slice(cut + SESSION_SEPARATOR.length) }
    : { label: null, title: line };
};

// a course's topics as parts of it: each title, then its subtopics
export const topicNames = (topics: { title: string; subtopics: string[] }[]) =>
  topics.flatMap(({ title, subtopics }) => [title, ...subtopics]);

// the course's parts by kind, as placeInCourse reads them
export const courseOutline = (course: CourseToUpdate) => ({
  topics: topicNames(course.topics),
  objectives: course.objectives,
  competencies: course.competencies,
  sessions: course.sessions
});

export const coursePartsOf = (course: CourseToUpdate) => [
  ...topicNames(course.topics),
  ...course.objectives,
  ...course.competencies,
  ...course.sessions
];

// the teacher's corrections to the topics, saved at once: a topic keeps its place and what was
// read (`from` is its index before editing), a new one is the teacher's; an empty title removes it
export type TopicDraft = { from: number | null; title: string; subtopics: string[] };
export const applyTopicDrafts = (topics: CourseField[], drafts: TopicDraft[]): CourseField[] =>
  drafts
    .map(({ from, title, subtopics }): CourseField | null => {
      const text = title.trim();
      const kept = subtopics.map((sub) => sub.trim()).filter(Boolean);
      const topic = from === null ? null : topics[from];
      if (!text) return null;
      if (!topic) return { value: text, origin: 'added', subtopics: kept };
      return { ...(text === topic.value ? topic : editField(topic, text)), subtopics: kept };
    })
    .filter((topic): topic is CourseField => !!topic);

// objectives of one group, with their place in the store's list (what its actions take)
export const itemsOf = (objectives: CourseField[], group: ObjectiveGroup) =>
  objectives
    .map((field, index) => ({ field, index }))
    .filter(({ field }) => (field.group || 'objective') === group);

// a word only where it helps: what the teacher changed, or a real doubt (not found in the
// syllabus)
export const noteOf = (field: CourseField) =>
  field.origin === 'edited' || field.origin === 'added'
    ? `tutor.check.origin.${field.origin}`
    : field.verification === 'unverified'
      ? 'tutor.check.pleaseCheck'
      : null;
