import type { ApiSchema } from './api';
import type { ModuleId } from '@/types/learn/modules';

type DocumentPayload = ApiSchema<'EnhancedDocumentSlicePayloadModel'>;

// the API types `document_details` as a free dict, so its known keys are listed here
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

// the deploy targets, read from VITE_ENVIRONMENT (see utils/env.ts)
export type Environment = 'dev' | 'staging' | 'test' | 'prod';

// syllabus v2: improve a course the teacher already has, or create one from scratch
export type CoursePath = 'existing' | 'scratch';

// syllabus v2, "I have a course": the course as WeLearn read it from the teacher's file
export type CourseReadResponse = ApiSchema<'CourseReadResponse'>;
export type CourseReading = ApiSchema<'CourseReading'>;
export type ObjectiveScope = ApiSchema<'ReadObjective'>['scope'];

// one piece of the checked course: read from the syllabus, corrected or added by the teacher.
// `original` keeps the syllabus wording of a corrected piece, so it can be restored
export type CourseFieldOrigin = 'extracted' | 'edited' | 'added';
// how an extracted piece compares with the syllabus text: found in it word for word (verified),
// or not (unverified: reworded, translated or put together by the AI). unchecked: no text to
// compare with
export type Verification = 'verified' | 'unverified' | 'unchecked';
// course objectives, competencies, or objectives wider than the course (degree, institution,
// general education), kept apart; unsorted: neither the AI nor the syllabus's headings say
// whether it belongs to this course
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
  // the syllabus line a topic comes from, found word for word in it: where changes to it go
  source?: string | null;
};

// how the course is taught; empty means the teacher did not say, never a default
export type TeachingContext = {
  title: string;
  discipline: string;
  level: string;
  sessions: number | null;
  sessionLength: number | null; // hours
  sessionType: string;
  sessionMode: ApiSchema<'SessionMode'> | '';
  classSize: number | null;
};

// the course as the teacher confirmed it on the review screen, for the sustainability additions:
// their corrections included, degree-level objectives left out
export type ConfirmedCourse = ApiSchema<'ConfirmedCourse'>;

// the confirmed course as the updated syllabus uses it: topics keep the syllabus line they come
// from
export type CourseToUpdate = Required<Omit<ConfirmedCourse, 'topics'>> & {
  topics: (ApiSchema<'CourseTopic'> & { source: string | null })[];
};

// a sustainability connection suggested for the confirmed course, and the WeLearn resources
// found and judged for it
export type ConnectionIdea = ApiSchema<'ConnectionIdea'>;
// ponytail: `document` refined to the client's Document, as for search results
export type EvidencedResource = Omit<ApiSchema<'EvidencedResource'>, 'document'> & {
  document: Document;
};
export type ConnectionEvidence = Omit<
  ApiSchema<'ConnectionEvidenceResponse'>,
  'resources' | 'background'
> & { resources: EvidencedResource[]; background: EvidencedResource[] };

// one checked change to the course for a connection the teacher chose to develop
export type ChosenConnection = Omit<ApiSchema<'ChosenConnection'>, 'resources' | 'background'> & {
  resources: EvidencedResource[];
  background: EvidencedResource[];
};
export type AdaptationResource = Omit<ApiSchema<'AdaptationResource'>, 'document'> & {
  document: Document;
};
export type AdaptationProposal = Omit<ApiSchema<'AdaptationProposal'>, 'resources'> & {
  resources: AdaptationResource[];
};
export type AdaptationKind = AdaptationProposal['kind'];
export type AdaptationGuidance = AdaptationProposal['guidance'];
export type GreenCompId = ApiSchema<'GreenCompLink'>['id'];

// a change the teacher accepted, as the updated syllabus shows and exports it: the proposal, the
// connection it came from, the accepted wording and where it goes in the course
export type ApprovedChange = AdaptationProposal & {
  connectionId: string;
  connection: string;
  // the course part it replaces or sits in, as the teacher confirmed it
  placement: string | null;
  // the accepted wording (the teacher's own when edited)
  text: string;
  // the session it belongs to, when the outline names it reliably (set when assembled)
  session?: string | null;
};

// device-level choice, stored with the date so it can be asked again
export type AnalyticsConsent = {
  status: 'granted' | 'denied';
  date: string;
};

export type SourceOrigin = 'chat' | 'search' | 'tutor' | 'bookmarks' | 'learn' | 'other';

// what a guest tried to do when the signup prompt opened (key under authentication.signupPrompt)
export type SignupPromptReason =
  | 'bookmarks'
  | 'bookmark'
  | 'download'
  | 'bibliography'
  | 'chatLimit'
  | 'syllabusLimit'
  // the API refused a new guest: too many from the same network (IP) this hour
  | 'tooManyGuests'
  | 'feedbackLimit'
  | 'filesLimit'
  | 'adaptationLimit';

// what a guest can do a limited number of times a day (counted by the API, stores/guestQuota.ts)
export type GuestQuotaFeature = 'chat' | 'syllabus' | 'feedback' | 'files' | 'adaptation';

// event name -> props. Only counts, lengths, enums and ids: never free text or document content
export type AnalyticsEvents = {
  'Page Viewed': { routeName: string };
  'Analytics Consent': { granted: true };
  'Chat Question Sent': {
    queryLength: number;
    isFollowUp: boolean;
    isSuggestedQuestion: boolean;
    sdgFilterCount: number;
    corpusFilterCount: number;
  };
  'Chat Answer Received': { durationMs: number; sourcesCount: number };
  'Chat Answer Failed': { durationMs: number };
  'Chat Reset': Record<string, never>;
  'Source Opened': { origin: SourceOrigin };
  'Search Performed': {
    queryLength: number;
    resultsCount: number;
    sdgCount: number;
    sdgFilterCount: number;
    corpusFilterCount: number;
    hasError: boolean;
    errorCode?: string;
  };
  'Tutor Step Completed': {
    step: number;
    durationMs: number;
    filesCount?: number;
    fileTypes?: string[];
    totalSizeKb?: number;
    sourcesCount?: number;
  };
  'Tutor Step Failed': { step: number; durationMs: number };
  'Syllabus Feedback Sent': { feedbackLength: number; isApplied: boolean };
  'Syllabus Downloaded': Record<string, never>;
  'Bookmark Added': { corpus: string; bookmarksCount: number };
  'Bookmark Removed': { bookmarksCount: number };
  'Bibliography Exported': { count: number };
  'Microlearning Started': { discipline: string };
  'Microlearning Step Completed': { discipline: string; stepIndex: number };
  'Microlearning Completed': { discipline: string; hasPreEval: boolean; hasPostEval: boolean };
  'Learn Module Started': { module: ModuleId };
  'Learn Module Completed': { module: ModuleId };
  // 1–5 self-rating, at the start (before) or the end (after) of a module
  'Learn Confidence Rated': { module: ModuleId; moment: 'before' | 'after'; value: number };
  'Learn Sort Completed': {
    module: ModuleId;
    stepId: string;
    firstTryCount: number;
    total: number;
  };
  'Login Clicked': Record<string, never>;
  'Signup Prompt Shown': { reason: SignupPromptReason };
  'Signup Prompt Clicked': { reason: SignupPromptReason; action: 'register' | 'login' };
  'Guest Quota Notice Clicked': { feature: GuestQuotaFeature; remaining: number };
  'Logged In': Record<string, never>;
  'Logged Out': Record<string, never>;
  'Language Changed': { language: string };
};
