import type { CourseReading, MaterialType, ObjectiveScope } from '@/types';

// structured reading of a syllabus through the existing question-answering endpoint
// (/qna/chat/answer): the syllabus text goes in as the only source, the reading instructions as
// the question. ponytail: a stand-in for a dedicated extraction endpoint (see the API-team
// request "richer syllabus extraction"); every copied value is checked against the text here,
// so nothing the document does not contain is shown as read from it

export type ReadingLanguage = 'fr' | 'en';

// the endpoint answers in the language of the question, so the instructions are written in the
// syllabus's own language: nothing gets translated
const COMMON_WORDS: Record<ReadingLanguage, string[]> = {
  fr: ['le', 'la', 'les', 'des', 'du', 'et', 'est', 'une', 'pour', 'dans', 'au', 'aux'],
  en: ['the', 'and', 'of', 'to', 'is', 'in', 'for', 'with', 'on', 'by', 'this', 'are']
};

export const guessLanguage = (text: string, fallback: ReadingLanguage = 'fr'): ReadingLanguage => {
  const words = text.toLowerCase().match(/\p{L}+/gu) || [];
  const count = (lang: ReadingLanguage) =>
    words.filter((word) => COMMON_WORDS[lang].includes(word)).length;
  const fr = count('fr');
  const en = count('en');
  if (fr === en) return fallback;
  return fr > en ? 'fr' : 'en';
};

const FORMAT = `{"title": string|null, "discipline": string|null, "level": string|null, "description": string|null, "topics": string[], "sessions": [{"label": string|null, "title": string}], "objectives": [{"text": string, "scope": "course"|"programme"|"unspecified"}], "document_language": string|null, "material_type": "syllabus"|"course_plan"|"lesson"|"partial"|"other", "courses_found": string[]}`;

// same rules as the API-team request; the French version was tested on the dev API (22 Oct)
const INSTRUCTIONS: Record<ReadingLanguage, string> = {
  fr: `Analyse le document fourni (Doc 1, un syllabus de cours). Ne réponds qu'avec un objet JSON, sans texte avant ou après, sans balise de code, sans citation ni lien.

Règles :
- Recopie chaque valeur mot pour mot depuis le document, dans sa langue d'origine. Ne traduis pas, ne reformule pas, ne résume pas.
- Recopie la valeur seule, sans son intitulé ni séparateur (par exemple « Économie », pas « Cours : Économie » ni « Cours | Économie »).
- Si une information n'est pas écrite explicitement dans le document, mets null ou une liste vide. N'invente rien, ne déduis rien.
- "description" : la présentation officielle du cours, recopiée mot pour mot (paragraphes consécutifs réunis). Jamais le document entier, ni un plan de séances, ni une liste. Sinon null.
- "topics" : uniquement les éléments d'une liste explicite de contenus du cours (par exemple « Contenu du cours », « Programme », « Plan du cours »), un élément par entrée. Sinon [].
- "sessions" : uniquement si le document contient un plan de séances explicite ; un objet par séance avec "label" (tel qu'écrit, par exemple « Séance 3 ») et "title" (tel qu'écrit). Sinon [].
- "objectives" : chaque objectif d'apprentissage explicite, avec "text" (mot pour mot) et "scope" : "programme" s'il est placé sous un titre qui désigne le programme, la mention, le diplôme ou un référentiel ; "course" s'il est placé sous un titre qui désigne le cours ; "unspecified" sinon.
- "discipline" : seulement si une discipline est nommée explicitement.
- "material_type" : ce qu'est le document : "syllabus" (syllabus complet d'un cours), "course_plan" (plan de semestre, emploi du temps, plan de cours en plusieurs séances), "lesson" (une seule séance ou leçon, même si elle porte un numéro de séance), "partial" (description partielle d'un cours), "other" (autre chose).
- "courses_found" : si le document contient plusieurs cours distincts, le titre de chacun, mot pour mot ; sinon []. Ne fusionne jamais plusieurs cours en un seul.

Format exact :
${FORMAT}`,
  en: `Analyse the provided document (Doc 1, a course syllabus). Answer only with a JSON object, with no text before or after, no code fence, no citation and no link.

Rules:
- Copy every value word for word from the document, in its original language. Do not translate, rephrase or summarise.
- Copy the value alone, without its label or separator (for example "Economics", not "Course: Economics" or "Course | Economics").
- If a piece of information is not explicitly written in the document, use null or an empty list. Do not invent or infer anything.
- "description": the official course description, copied word for word (consecutive paragraphs joined). Never the whole document, a session plan or a list. Otherwise null.
- "topics": only the items of an explicit list of course contents (for example "Course content", "Topics", "Course outline"), one item per entry. Otherwise [].
- "sessions": only if the document contains an explicit session plan; one object per session with "label" (as written, for example "Week 3") and "title" (as written). Otherwise [].
- "objectives": every explicit learning objective, with "text" (word for word) and "scope": "programme" if it sits under a heading naming the programme, degree, diploma or a competence framework; "course" if it sits under a heading naming the course; "unspecified" otherwise.
- "discipline": only if a discipline is explicitly named.
- "material_type": what the document is: "syllabus" (a complete course syllabus), "course_plan" (a semester plan, timetable or outline with several sessions), "lesson" (a single session or lesson, even if it carries a session number), "partial" (a partial course description), "other" (anything else).
- "courses_found": if the document contains several distinct courses, the title of each, word for word; otherwise []. Never merge several courses into one.

Exact format:
${FORMAT}`
};

// the endpoint's answers vary from one call to the next: one that cannot be used is asked for
// once more before failing (a failed request is not retried, its error goes up)
export const askUsableAnswer = async <T>(
  send: () => Promise<any>,
  parse: (answer: string) => T | null
): Promise<T | null> => {
  for (let attempt = 0; attempt < 2; attempt++) {
    const answer = (await send())?.data?.answer;
    const parsed = typeof answer === 'string' ? parse(answer) : null;
    if (parsed) return parsed;
  }
  return null;
};

// long documents are cut so the request stays reasonable; the review says when this happened
export const MAX_TEXT_LENGTH = 60000;

// when the document holds several courses, the teacher picks one and it is read again alone
const FOCUS: Record<ReadingLanguage, (title: string) => string> = {
  fr: (title) =>
    `

Le document contient plusieurs cours. Ne traite que le cours intitulé « ${title} » et ignore entièrement les autres ; "courses_found" doit être [].`,
  en: (title) =>
    `

The document contains several courses. Only process the course titled "${title}" and fully ignore the others; "courses_found" must be [].`
};

export const buildReadingRequest = (text: string, lang: ReadingLanguage, focus?: string) => ({
  query: INSTRUCTIONS[lang] + (focus ? FOCUS[lang](focus) : ''),
  history: [],
  lang,
  sources: [
    {
      score: 1,
      payload: {
        document_corpus: 'syllabus',
        document_desc: '',
        document_details: {},
        document_id: crypto.randomUUID(),
        document_lang: lang,
        document_sdg: [],
        document_title: 'Syllabus',
        // ponytail: the endpoint requires a url; this one never resolves and is never shown
        document_url: 'https://example.invalid/syllabus',
        slice_content: text.slice(0, MAX_TEXT_LENGTH),
        slice_sdg: null
      }
    }
  ]
});

const asText = (value: unknown): string | null =>
  typeof value === 'string' && value.trim() ? value.trim() : null;

const SCOPES: ObjectiveScope[] = ['course', 'programme', 'unspecified'];
export const MATERIAL_TYPES: MaterialType[] = [
  'syllabus',
  'course_plan',
  'lesson',
  'partial',
  'other'
];

// the answer is expected to be one JSON object; anything else means it cannot be used
// the model sometimes forgets to close an object before closing a list ("…"]): the missing
// brackets are put back where the structure shows them; nothing else is changed
const closeBrackets = (json: string) => {
  const open: string[] = [];
  let out = '';
  let isInString = false;
  for (let i = 0; i < json.length; i++) {
    const char = json[i];
    if (isInString) {
      if (char === '\\') {
        out += char + (json[++i] ?? '');
        continue;
      }
      if (char === '"') isInString = false;
    } else if (char === '"') {
      isInString = true;
    } else if (char === '{' || char === '[') {
      open.push(char === '{' ? '}' : ']');
    } else if (char === '}' || char === ']') {
      while (open.length && open[open.length - 1] !== char) out += open.pop();
      open.pop();
    }
    out += char;
  }
  return out + open.reverse().join('');
};

// the one JSON object in an answer, or null
export const parseJsonObject = (answer: string): any => {
  const start = answer.indexOf('{');
  const end = answer.lastIndexOf('}');
  if (start === -1 || end <= start) return null;
  const json = answer.slice(start, end + 1);
  for (const candidate of [json, closeBrackets(json)]) {
    try {
      const data = JSON.parse(candidate);
      if (data && typeof data === 'object' && !Array.isArray(data)) return data;
    } catch {
      // try the repaired version next
    }
  }
  return null;
};

export const parseReadingAnswer = (answer: string): CourseReading | null => {
  const data = parseJsonObject(answer);
  if (!data) return null;
  const list = (value: unknown): any[] => (Array.isArray(value) ? value : []);
  return {
    title: asText(data.title),
    discipline: asText(data.discipline),
    level: asText(data.level),
    description: asText(data.description),
    topics: list(data.topics)
      .map(asText)
      .filter((topic): topic is string => !!topic),
    sessions: list(data.sessions)
      .map((session) => ({ label: asText(session?.label), title: asText(session?.title) }))
      .filter((session): session is { label: string | null; title: string } => !!session.title),
    objectives: list(data.objectives)
      .map((objective) => ({
        text: asText(objective?.text),
        scope: SCOPES.includes(objective?.scope) ? objective.scope : 'unspecified'
      }))
      .filter(
        (objective): objective is { text: string; scope: ObjectiveScope } => !!objective.text
      ),
    document_language: asText(data.document_language),
    // an interpretation, not a copy: shown as the AI's, and the teacher can change it
    material_type: MATERIAL_TYPES.includes(data.material_type) ? data.material_type : 'other',
    courses_found: list(data.courses_found)
      .map(asText)
      .filter((title): title is string => !!title)
  };
};

// compares texts the way they read: case, spaces, line breaks and quote or dash styles aside
// (pdf text breaks lines anywhere)
export const normalise = (text: string) =>
  text
    .normalize('NFC')
    .toLowerCase()
    .replace(/[’‘`´]/g, "'")
    .replace(/[«»“”]/g, '"')
    .replace(/[‐-―−]/g, '-')
    // pdf line-break hyphenation ("struc - ture", "con-\ncrete") is not part of the words
    .replace(/\s*-\s+/g, '')
    .replace(/\s+/g, '');

// keeps only what is really written in the document; the rest is dropped and counted, so the
// review can say so instead of showing reworded or invented text as read from the syllabus
export const verifyReading = (reading: CourseReading, text: string) => {
  const documentText = normalise(text);
  let droppedCount = 0;
  const isInDocument = (value: string) => {
    const isFound = documentText.includes(normalise(value));
    if (!isFound) droppedCount++;
    return isFound;
  };
  const keep = (value: string | null) => (value && isInDocument(value) ? value : null);
  // a spreadsheet row "Cours | Économie" read as one value: the label cell is not the value
  const withoutCellLabel = (value: string | null) => value?.split(' | ').pop() || null;
  // a "description" that is most of the document is the document itself, not its description
  const isWholeDocument = (value: string | null) =>
    !!value && normalise(value).length > documentText.length * 0.6;

  let description: string | null = null;
  if (isWholeDocument(reading.description)) droppedCount++;
  else description = keep(reading.description);

  const verified: CourseReading = {
    title: keep(withoutCellLabel(reading.title)),
    discipline: keep(withoutCellLabel(reading.discipline)),
    level: keep(withoutCellLabel(reading.level)),
    description,
    topics: reading.topics.filter(isInDocument),
    sessions: reading.sessions
      .filter((session) => isInDocument(session.title))
      .map((session) => ({
        ...session,
        label:
          session.label && documentText.includes(normalise(session.label)) ? session.label : null
      })),
    objectives: reading.objectives.filter((objective) => isInDocument(objective.text)),
    document_language: reading.document_language,
    material_type: reading.material_type,
    courses_found: reading.courses_found.filter(isInDocument)
  };
  return { reading: verified, droppedCount };
};
