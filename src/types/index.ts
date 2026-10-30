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

// where an objective sits in the syllabus: under a heading naming the course, the programme or
// degree, or neither
export type ObjectiveScope = 'course' | 'programme' | 'unspecified';

// what the teaching material is, as interpreted by the AI (the teacher can change it)
export type MaterialType = 'syllabus' | 'course_plan' | 'lesson' | 'partial' | 'other';

// structured reading of a syllabus (asked through /qna/chat/answer): every text copied as
// written in the document, null or [] when the document does not state it
export interface CourseReading {
  title: string | null;
  discipline: string | null;
  level: string | null;
  description: string | null;
  topics: string[];
  sessions: { label: string | null; title: string }[];
  objectives: { text: string; scope: ObjectiveScope }[];
  document_language: string | null;
  material_type: MaterialType;
  // titles of the distinct courses when the document holds several, copied as written
  courses_found: string[];
}

// where a piece of the reviewed course comes from: read from the document, suggested by the AI
// (an interpretation, not a copy), corrected or added by the teacher
export type CourseFieldOrigin = 'extracted' | 'suggested' | 'edited' | 'added';

export interface CourseField {
  value: string;
  origin: CourseFieldOrigin;
  // the text as read from the document (or as the AI suggested it), kept so the teacher can see
  // or restore it
  original?: string;
  // an objective that belongs to the whole programme, not to this course (listed under a
  // programme heading in the syllabus, or marked by the teacher)
  isProgramme?: boolean;
  // proposed by WeLearn (a course created from scratch): its original is a suggestion, which the
  // teacher may also reject
  isSuggestion?: boolean;
}

// the course overview lines, read from the syllabus when it states them
export const COURSE_OVERVIEW_KEYS = ['title', 'discipline', 'level'] as const;
export type CourseOverviewKey = (typeof COURSE_OVERVIEW_KEYS)[number];

// optional details the reading does not return; only the teacher fills them
export const COURSE_EXTRA_KEYS = ['workload', 'assessment'] as const;
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

// a teaching practice shared by a university teacher and approved for the TEACH collection
export interface TeachingPractice {
  id: string;
  discipline: string;
  course: string;
  level: string;
  // what sustainability topic was integrated, and why
  topic: string;
  why: string;
  // what the teacher actually did with students
  approach: string;
  resources: { title: string; url: string }[];
  // the teacher's own materials (syllabus, worksheets, slides...), only those they agreed to
  // publish, at a public link checked during review and free of students' personal information
  materials?: { title: string; url: string }[];
  // the teacher's own account, when given
  worked?: string;
  challenges?: string;
  adaptations?: string;
}
