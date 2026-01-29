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
  corpus: string;
  name: string;
  lang: string;
  model: string;
}

export interface ReducedCorpus {
  name: string;
  model: string;
  corpus: string;
  translated: string;
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
