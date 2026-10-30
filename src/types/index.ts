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
