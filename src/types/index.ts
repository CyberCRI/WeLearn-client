export type Document = {
  id: string;
  score: number;
  payload: {
    document_id: string;
    document_external_id?: string;
    document_corpus: string;
    document_title: string;
    document_desc: string;
    document_url: string;
    document_sdg: number[];
    document_details: DocumentDetails;
    slice_content: string;
    slice_sdg: number;
    document_lang: string;
    document_scrape_date: string;
  };
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

export interface Corpus {
  is_active: boolean;
  name: string;
  category: string;
}

export interface ErrorDetails {
  response: {
    status: number;
    data: {
      detail: {
        message: string;
        code: string;
      };
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

export type TutorSearch = {
  extracts: { original_document: string; summary: string; themes: string[] }[];
  nb_results: number;
  documents: Document[];
};

export type TutorSyllabus = {
  syllabus: { content: string; source: string }[];
  documents: Document[];
};

// answer of /tutor/mas_files/content: the document type it detected and, for a syllabus, its
// description and objectives copied as written (null or [] when not found)
export type SyllabusExtraction = {
  detected_document_type: 'none' | 'article' | 'syllabus' | 'unknown';
  confidence: number;
  summary: string | null;
  description: string | null;
  objectives: string[];
  reasoning: string | null;
};

// where a piece of the reviewed course comes from: read from the document, corrected or added
// by the teacher
export type CourseFieldOrigin = 'extracted' | 'edited' | 'added';

export interface CourseField {
  value: string;
  origin: CourseFieldOrigin;
  // the text as read from the document, kept so the teacher can see or restore it
  original?: string;
  // an objective the teacher marked as belonging to the whole programme, not to this course
  isProgramme?: boolean;
}

// the course overview; the extraction does not read these yet, so only the teacher adds them
export const COURSE_OVERVIEW_KEYS = ['title', 'disciplineLevel', 'topics'] as const;
export type CourseOverviewKey = (typeof COURSE_OVERVIEW_KEYS)[number];

// optional details the extraction does not read yet; only the teacher fills them
export const COURSE_EXTRA_KEYS = ['workload', 'sessions', 'assessment'] as const;
export type CourseExtraKey = (typeof COURSE_EXTRA_KEYS)[number];

export interface SyllabusData {
  description: {
    text: string;
  };
  objectives: {
    objectives: {
      text: string;
      number: number;
    }[];
  };
  sustainability: {
    connections: {
      sdg_themes: string[];
      objective_number: number;
      connection_explanation: string;
      key_resources: {
        url: string;
        text?: string;
        title: string;
        corpus: string;
      }[];
    }[];
  };
  outcomes: {
    outcomes: {
      text: string;
      number: number;
    }[];
  };
  competencies: {
    mappings: {
      greencomp_competencies: string[];
      rationale: string;
      outcome_number: number;
    }[];
  };
}

export interface CourseMetadata {
  topic?: string;
  discipline?: string;
  level?: string;
  num_sessions?: number;
  session_duration?: number;
  syllabus_mode?: 'mode_1' | 'mode_2' | 'mode_3';
  user_description?: string;
  session_type?: string;
  class_size?: number;
  session_mode?: 'PRESENTIEL' | 'REMOTE' | 'HYBRID';
  output_language?: 'french' | 'english';
}

export enum CreateSyllabusStepsId {
  search = 'search',
  syllabus = 'syllabus'
}
