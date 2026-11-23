export const docs = [
  {
    id: 1,
    payload: {
      document_title: 'Document one test',
      document_url: 'documentonetest.com',
      document_corpus: 'doc_one_corpus',
      document_sdg: [1],
      document_desc: 'document description',
      document_details: {}
    }
  },
  {
    id: 2,
    payload: {
      document_title: 'Document two test',
      document_url: 'documenttwotest.com',
      document_corpus: 'doc_two_corpus',
      document_sdg: [1, 2],
      document_desc: 'document two test description',
      document_details: {}
    }
  }
];

// the "I have a course" path (/tutor/course/*), one run that goes well: a syllabus long enough
// to stand for the whole course, so the complete updated syllabus is offered
export const courseText = [
  'Ecology',
  'Theme 1: Soil ecology',
  ...Array.from(
    { length: 8 },
    (_, i) => `Reading ${i + 1}: a chapter on the water cycle and the rivers of Europe.`
  ),
  '12 sessions'
].join('\n');

export const syllabusFile = {
  name: 'syllabus.txt',
  mimeType: 'text/plain',
  buffer: Buffer.from(courseText)
};

export const courseReading = {
  text: courseText,
  is_text_truncated: false,
  is_partial: false,
  reading: {
    title: 'Ecology',
    material_type: 'syllabus',
    courses_found: [],
    objectives: [],
    topics: [{ title: 'Soil ecology', subtopics: [], source: 'Theme 1: Soil ecology' }],
    sessions: []
  }
};

const idea = (id: string, title: string) => ({
  id,
  title,
  anchor: 'Soil ecology',
  anchor_label: null,
  why: `${title} matters.`,
  use: null,
  queries: ['soil carbon', 'soil erosion']
});

export const connectionIdeas = {
  ideas: [idea('idea-1', 'Soil carbon'), idea('idea-2', 'Erosion')],
  none_reason: null
};

// the first idea is backed by one resource, the second by none
export const connectionEvidence = (asked: { id: string; why: string }) => {
  const isSupported = asked.id === 'idea-1';
  return {
    status: isSupported ? 'supported' : 'unsupported',
    concept: null,
    why: asked.why,
    candidate_count: 6,
    background: [],
    resources: isSupported
      ? [
          {
            usefulness: 'Shows how soils store carbon.',
            evidence: 'Soils store more carbon than the atmosphere.',
            document: {
              score: 0.9,
              payload: {
                document_id: 'doc-1',
                document_title: 'Soils and carbon',
                document_url: 'https://example.org/soils',
                document_corpus: 'conversation',
                document_desc: '',
                document_details: {},
                document_lang: 'en',
                document_sdg: [13],
                slice_content: 'Soils store more carbon than the atmosphere.',
                slice_sdg: null
              }
            }
          }
        ]
      : []
  };
};

export const courseAdaptation = {
  kind: 'topic',
  original: 'Soil ecology',
  suggested: 'Add how soils store carbon.',
  why: 'Soils are a carbon sink.',
  support: 'strong',
  resources: [],
  guidance: { learning: null, greencomp: null, teaching: null, check: null },
  checks: null
};
