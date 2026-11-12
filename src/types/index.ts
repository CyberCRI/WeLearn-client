import type { ApiSchema } from './api';

type DocumentPayload = ApiSchema<'EnhancedDocumentSlicePayloadModel'>;

// ponytail: the API types `document_details` as a free dict, so its known keys are listed here
export type Document = Omit<ApiSchema<'EnhancedDocumentSlice'>, 'payload'> & {
  payload: Omit<DocumentPayload, 'document_details'> & { document_details: DocumentDetails };
};

export type DocumentDetails = {
  authors: Record<string, string>[];
  author?: string;
  duration?: number;
  readability?: number;
  source?: string;
  publisher?: string;
  journal?: string;
};

export type Corpus = ApiSchema<'CorpusRead'>;

export interface ErrorDetails {
  response: {
    status: number;
    data: {
      detail: ApiSchema<'ErrorDetail'>;
    };
  };
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatProcessingMetadata {
  status: 'processing';
  step?: string;
  label?: string;
}

export type ReformulateResponse = {
  STANDALONE_QUESTION_EN: string;
  STANDALONE_QUESTION_FR: string;
  USER_LANGUAGE: string;
  QUERY_STATUS: 'INVALID' | 'VALID' | 'REF_TO_PAST';
};

export type TutorSearch = Omit<ApiSchema<'TutorSearchResponse'>, 'documents'> & {
  documents: Document[];
};

export type TutorSyllabus = Omit<ApiSchema<'SyllabusResponse'>, 'documents'> & {
  documents: Document[];
};

// the two ways into /tutor: improving an existing course, or creating one from scratch
export type CoursePath = 'existing' | 'scratch';

// the teaching context of the course; empty means the teacher did not say, never a default
export type TeachingContext = {
  title: string;
  discipline: string;
  level: string;
  sessions: number | null;
  sessionLength: number | null; // hours, as the API expects
  sessionType: string;
  sessionMode: ApiSchema<'SessionMode'> | '';
  classSize: number | null;
};

// one piece of the checked course: read from the syllabus, corrected or added by the teacher.
// `original` keeps the syllabus wording of a corrected piece, so it can be restored
export type CourseFieldOrigin = 'extracted' | 'edited' | 'added';
// how an extracted piece compares with the uploaded document: found in it (verified), not found
// word for word (unverified: reworded, translated or put together by the AI), or not compared
// because the file's text cannot be read in the browser (unchecked, e.g. pdf)
export type Verification = 'verified' | 'unverified' | 'unchecked';
// course objectives, competencies, or objectives wider than the course (degree, institution,
// general education), kept apart;
// unsorted: neither the AI nor the syllabus's headings say whether it belongs to this course
export type ObjectiveGroup = 'objective' | 'competency' | 'programme' | 'unsorted';
export type CourseField = {
  value: string;
  origin: CourseFieldOrigin;
  original?: string;
  verification?: Verification;
  group?: ObjectiveGroup;
  // written by the AI (an overview, a topic named in its own words), not copied from the syllabus
  isSummary?: boolean;
  subtopics?: string[];
  // the syllabus line a topic comes from, found word for word in it: where changes to it are placed
  source?: string | null;
};

// a main topic as the reading names it, with the line of the syllabus it comes from
export interface CourseTopic {
  title: string;
  subtopics: string[];
  source: string | null;
}

// the structured reading of a syllabus (utils/courseReading), as in the "design your course"
// prototype: values copied from the document, objectives with the heading level they sit under
export type ObjectiveScope = 'course' | 'programme' | 'unspecified';
export type MaterialType = 'syllabus' | 'course_plan' | 'lesson' | 'partial' | 'other';
export interface CourseReading {
  title: string | null;
  discipline: string | null;
  disciplineSuggested: string | null;
  level: string | null;
  description: string | null;
  summary: string | null;
  topics: CourseTopic[];
  sessions: { label: string | null; title: string | null }[];
  objectives: { text: string; scope: ObjectiveScope }[];
  document_language: string | null;
  material_type: MaterialType;
  // titles of the distinct courses when the document holds several, copied as written
  courses_found: string[];
  // the answer stopped before its end: the last items may be missing
  isAnswerCut: boolean;
  // stopped before its objectives were complete
  isObjectivesCut: boolean;
}

// ponytail: /qna/chat/answer is deployed on the dev API but missing from WeLearn-api main's
// openapi.json (removed in the 29 oct cleanup), so it has no generated type yet. this mirrors
// the live contract; replace with ApiRequestBody / ApiResponse once it is back in the contract
export type ChatAnswerRequest = {
  query: string;
  history: object[];
  lang: string;
  sources: ApiSchema<'EnhancedDocumentSlice'>[];
};
export type ChatAnswerResponse = {
  answer: string;
  message_id: string | null;
  conversation_id: string | null;
};

type SyllabusGeneration = ApiSchema<'SyllabusGenerationResponse'>;

export type SyllabusData = {
  [Section in
    | 'description'
    | 'objectives'
    | 'sustainability'
    | 'outcomes'
    | 'competencies']: NonNullable<SyllabusGeneration[Section]>;
};

// filled step by step in the form, hence partial
export type CourseMetadata = Partial<ApiSchema<'CourseMetadata'>> & {
  syllabus_mode?: 'mode_1' | 'mode_2' | 'mode_3';
};

export enum CreateSyllabusStepsId {
  search = 'search',
  syllabus = 'syllabus'
}

// the register form; the API takes it as `SignUpRequest` (snake_case)
export type UserRegisterData = {
  firstName: string;
  lastName: string;
  email: string;
};
