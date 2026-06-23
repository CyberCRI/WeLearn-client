export type Document = {
  id: string;
  score: number;
  payload: {
    document_id: string;
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
        metadata?: {
          document_title: string;
          text: string;
        };
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
  syllabus_mode?: 'one' | 'two' | 'three';
  user_description?: string;
  session_type?: string;
  class_size?: number;
  session_mode?: 'PRESENTIEL' | 'REMOTE' | 'HYBRID';
  output_language?: 'french' | 'english';
}
