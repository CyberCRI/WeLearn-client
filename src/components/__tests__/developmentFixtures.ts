import type { mount } from '@vue/test-utils';
import { type Connection, type Development, useConnectionsStore } from '@/stores/connections';
import { useCourseStore } from '@/stores/course';
import type { AdaptationProposal, AdaptationResource, CourseReadResponse, Document } from '@/types';

// shared data for the specs of the components that show a developed connection

export const resource = (
  role: AdaptationResource['role'],
  quote: string | null
): AdaptationResource => ({
  document: {
    score: 0.9,
    payload: {
      document_id: `doc-${role}`,
      document_title: `Doc ${role}`,
      document_url: 'https://example.org/a',
      document_corpus: 'conversation',
      document_details: {}
    }
  } as unknown as Document,
  usefulness: 'useful',
  evidence: 'The passage it was kept for.',
  role,
  quote
});

export const proposal = (overrides: Partial<AdaptationProposal> = {}): AdaptationProposal => ({
  kind: 'topic',
  original: 'GDP',
  suggested: 'Add the ecological footprint next to GDP.',
  why: 'GDP ignores the environment.',
  support: 'strong',
  resources: [resource('direct', 'The footprint measures it.')],
  guidance: { learning: null, greencomp: null, teaching: null, check: null },
  checks: { status: 'checked', problems: [], unbacked_names: [] },
  ...overrides
});

export const development = (overrides: Partial<Development> = {}): Development => ({
  status: 'ready',
  proposal: proposal(),
  decision: 'pending',
  edited: null,
  placement: null,
  retryAfter: null,
  ...overrides
});

const connection = (dev: Development, id = 'idea-1'): Connection => ({
  id,
  title: `Idea ${id.slice(-1)}`,
  anchor: 'GDP',
  anchor_label: null,
  why: 'why',
  use: null,
  queries: ['q'],
  decision: 'selected',
  evidence: null,
  isChecking: false,
  hasCheckFailed: false,
  development: dev
});

// a course with one topic, one subtopic, two objectives and one outline line
export const seedCourse = () => {
  const course = useCourseStore();
  course.courseTopics = [{ value: 'GDP', origin: 'extracted', subtopics: ['Measure'] }];
  course.courseObjectives = [
    { value: 'Define GDP.', origin: 'extracted' },
    { value: 'Use indicators.', origin: 'extracted' }
  ];
  course.coursePlan = ['Week 1 – GDP'];
  return course;
};

// the store holds the connection, so a component's actions change what it shows
export const seedConnection = (dev: Partial<Development> = {}) => {
  const store = useConnectionsStore();
  store.connections = [connection(development(dev))];
  return store;
};

// several accepted changes, one connection each (idea-1, idea-2, …)
export const seedAccepted = (...proposals: AdaptationProposal[]) => {
  const store = useConnectionsStore();
  store.connections = proposals.map((one, index) =>
    connection(development({ proposal: one, decision: 'accepted' }), `idea-${index + 1}`)
  );
  return store;
};

// the seeded course's syllabus as the API read it: long enough to stand for the whole syllabus,
// each part of the course appearing once
export const WHOLE_TEXT = [
  'MACROECONOMICS',
  'OBJECTIVES',
  'Define GDP.',
  'Use indicators.',
  'CONTENT',
  'Week 1 – GDP',
  '',
  ...Array.from(
    { length: 8 },
    (_, i) => `Reading ${i + 1}: a chapter of the handbook on national accounting and growth.`
  )
].join('\n');

export const seedReading = (text = WHOLE_TEXT, isTruncated = false) => {
  useCourseStore().reading = {
    text,
    is_text_truncated: isTruncated,
    is_partial: false,
    reading: {
      title: 'Macroeconomics',
      courses_found: [],
      objectives: [],
      topics: [],
      sessions: []
    }
  } as unknown as CourseReadResponse;
};

type Wrapper = Pick<ReturnType<typeof mount>, 'find'>;

export const text = (wrapper: Wrapper, testId: string) =>
  wrapper.find(`[data-testid="${testId}"]`).text();
export const exists = (wrapper: Wrapper, testId: string) =>
  wrapper.find(`[data-testid="${testId}"]`).exists();
