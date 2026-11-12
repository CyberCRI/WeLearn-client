import type { CourseReading, CourseTopic, MaterialType, ObjectiveScope } from '@/types';
import { core } from '@/utils/courseCheck';

// structured reading of a syllabus through the question-answering endpoint (/qna/chat/answer):
// the syllabus text goes in as the only source, the reading instructions as the question.
// reused from the "design your course" prototype (esra/pedagogy-experiments). ponytail: a
// stand-in for a dedicated extraction endpoint; each value is then checked against the text
// (utils/courseCheck), and what is not found word for word is kept and marked, never dropped

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

// the endpoint's answer has a length limit: short values, the overview and the objectives come
// first, so long lists of topics or sessions cannot push them out
const FORMAT = `{"title": string|null, "discipline": string|null, "discipline_suggested": string|null, "level": string|null, "document_language": string|null, "material_type": "syllabus"|"course_plan"|"lesson"|"partial"|"other", "courses_found": string[], "description": string|null, "summary": string|null, "objectives": [{"text": string, "scope": "course"|"programme"|"unspecified"}], "topics": [{"title": string, "subtopics": string[], "source": string}], "sessions": [{"label": string|null, "title": string|null}]}`;

// same rules as the API-team request; the French version was tested on the dev API (22 Oct)
// the overview and topic rules, shared by the full reading and the outline request below
const SUMMARY_RULE: Record<ReadingLanguage, string> = {
  fr: `- "summary" : une présentation courte du cours (2 ou 3 phrases) : ce qu'il couvre et ce que les étudiants y apprennent, écrite uniquement à partir du contenu du document, dans sa langue, sans rien ajouter. null si le document ne le permet pas.`,
  en: `- "summary": a short overview of the course (2 or 3 sentences): what it covers and what students learn in it, written only from the document's content, in its language, adding nothing. null if the document does not allow it.`
};
const TOPICS_RULE: Record<ReadingLanguage, string> = {
  fr: `- "topics" : les thèmes principaux du cours, identifiés à partir de son contenu, de son plan, de ses chapitres ou de ses séances, même s'ils ne sont pas présentés comme une liste ; dans l'ordre du cours. Pour chacun : "title" (l'intitulé du document tel qu'il est écrit ; seulement s'il est très long, une version courte avec ses propres mots), "subtopics" (seulement ses quelques sous-thèmes principaux que le document place sous ce thème, quelques mots chacun, pas chaque point du plan ; sinon []) et "source" (le titre ou la ligne du document d'où vient le thème, recopié mot pour mot). Si le document numérote ses thèmes, chapitres, parties ou modules (par exemple « Thème 3 : … », « Chapitre 2 – … »), chaque élément numéroté est un thème, dans l'ordre, avec son intitulé comme "title" et sa ligne comme "source" : ne les regroupe pas sous des catégories plus larges citées ailleurs dans le texte et ne les remplace pas par ces catégories. Jamais deux thèmes avec le même titre. Uniquement des thèmes présents dans le document : n'ajoute rien. Ni examens, ni lectures, ni devoirs, ni séances de révision.`,
  en: `- "topics": the main topics of the course, identified from its content, outline, chapters or sessions, even when they are not presented as a list; in the course's order. For each: "title" (the document's own heading, as written; only when it is very long, a short version in its own words), "subtopics" (only the few main subtopics the document places under this topic, a few words each, not every point of the outline; otherwise []) and "source" (the heading or line of the document the topic comes from, copied word for word). When the document numbers its themes, chapters, parts or modules (for example "Theme 3: …", "Chapter 2 – …"), each numbered item is one topic, in order, with its heading as "title" and its line as "source": do not group them under broader categories mentioned elsewhere in the text, and do not replace them with such categories. Never two topics with the same title. Only topics present in the document: add nothing. No exams, readings, assignments or review sessions.`
};

const INSTRUCTIONS: Record<ReadingLanguage, string> = {
  fr: `Analyse le document fourni (Doc 1, un syllabus de cours). Ne réponds qu'avec un objet JSON, sans texte avant ou après, sans balise de code, sans citation ni lien.

Règles :
- Recopie chaque valeur mot pour mot depuis le document, dans sa langue d'origine. Ne traduis pas, ne reformule pas, ne résume pas. Seuls "summary" et les "title" et "subtopics" de "topics" peuvent être formulés par toi.
- Recopie la valeur seule, sans son intitulé ni séparateur (par exemple « Économie », pas « Cours : Économie » ni « Cours | Économie »).
- "title" : le nom du cours tel que le document l'écrit, en général son intitulé principal en tête du document. Jamais le nom d'une personne ni une ligne sur l'enseignant·e (« Professeur : … »), ni une date ou une année, ni une session ou un semestre, ni l'établissement, ni un mot comme « Syllabus ». null si le document ne donne pas le nom du cours.
- Si une information n'est pas écrite explicitement dans le document, mets null ou une liste vide. N'invente rien, ne déduis rien.
- "description" : la présentation officielle du cours, recopiée mot pour mot (paragraphes consécutifs réunis). Jamais le document entier, ni un plan de séances, ni une liste, ni les objectifs du programme ou du diplôme. Sinon null.
${SUMMARY_RULE.fr}
${TOPICS_RULE.fr}
- "sessions" : uniquement si le document contient un plan de séances explicite ; un objet pour chaque séance, toutes les séances dans l'ordre du document, y compris les séances d'examen ou de révision, avec "label" (tel qu'écrit, par exemple « Séance 3 ») et "title" (tel qu'écrit, ou null si la séance n'a pas de titre). Sinon [].
- "objectives" : tous les éléments de toutes les listes d'objectifs, d'objectifs pédagogiques, d'acquis d'apprentissage et de compétences (par exemple « Compétences développées », « Savoir-faire ») du document, à tous les niveaux (cours, programme, mention, diplôme, chaque année du diplôme, formation générale), un objet par élément, dans l'ordre du document. Jamais un titre, ni une phrase qui présente ou annonce une liste, ni une phrase de la présentation, du résumé, de l'organisation du cours ou des prérequis. Il n'y a pas de nombre attendu : ne choisis pas, ne fusionne pas, ne raccourcis pas et n'omets aucun élément. Pour chacun, "text" (mot pour mot, sans numéro ni puce) et "scope" : "programme" s'il est placé sous un titre qui désigne le programme, la mention, le diplôme, une année du diplôme ou un référentiel ; "course" s'il est placé sous un titre qui désigne le cours ; "unspecified" sinon.
- "discipline" : seulement si une discipline est nommée explicitement.
- "discipline_suggested" : seulement si "discipline" est null : la discipline académique à laquelle le cours appartient clairement d'après son titre et son contenu (par exemple « Gestion » pour un cours d'introduction à la gestion d'entreprise), en un ou deux mots, dans la langue du document. null si le cours est interdisciplinaire ou si sa discipline n'est pas claire. C'est la seule valeur que tu peux déduire.
- "material_type" : ce qu'est le document : "syllabus" (syllabus complet d'un cours), "course_plan" (plan de semestre, emploi du temps, plan de cours en plusieurs séances), "lesson" (une seule séance ou leçon, même si elle porte un numéro de séance), "partial" (description partielle d'un cours), "other" (autre chose).
- "courses_found" : si le document contient plusieurs cours distincts, le titre de chacun, mot pour mot ; sinon []. Ne fusionne jamais plusieurs cours en un seul.

Format exact :
${FORMAT}`,
  en: `Analyse the provided document (Doc 1, a course syllabus). Answer only with a JSON object, with no text before or after, no code fence, no citation and no link.

Rules:
- Copy every value word for word from the document, in its original language. Do not translate, rephrase or summarise. Only "summary" and the "title" and "subtopics" of "topics" may be worded by you.
- Copy the value alone, without its label or separator (for example "Economics", not "Course: Economics" or "Course | Economics").
- "title": the course's name as the document writes it, usually its main heading at the top of the document. Never a person's name or a line about the teacher ("Professor: …"), a date or a year, a session or a semester, the institution, or a word such as "Syllabus". null if the document does not give the course's name.
- If a piece of information is not explicitly written in the document, use null or an empty list. Do not invent or infer anything.
- "description": the official course description, copied word for word (consecutive paragraphs joined). Never the whole document, a session plan, a list or the objectives of the programme or degree. Otherwise null.
${SUMMARY_RULE.en}
${TOPICS_RULE.en}
- "sessions": only if the document contains an explicit session plan; one object for each session, every session in the document's order, exam and review sessions included, with "label" (as written, for example "Week 3") and "title" (as written, or null if the session has no title). Otherwise [].
- "objectives": every item of every list of objectives, learning objectives, learning outcomes and competencies or skills (for example "Skills developed", "Competencies") in the document, at every level (course, programme, degree, each year of the degree, general education), one object per item, in the document's order. Never a heading, a sentence that introduces or announces a list, or a sentence of the course's description, summary, organisation or prerequisites. There is no expected number: do not select, merge, shorten or leave out any item. For each, "text" (word for word, without its number or bullet) and "scope": "programme" if it sits under a heading naming the programme, degree, a year of the degree, general education or a competence framework; "course" if it sits under a heading naming the course; "unspecified" otherwise.
- "discipline": only if a discipline is explicitly named.
- "discipline_suggested": only if "discipline" is null: the academic discipline the course clearly belongs to, judging from its title and content (for example "Management" for an introduction to business management), in one or two words, in the document's language. null if the course is interdisciplinary or its discipline is not clear. This is the only value you may infer.
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

// long documents are cut so the request stays reasonable; the check screen says when this happened
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

// the full reading answers in one go and its answer has a length limit: a syllabus with many
// objectives can push the topics and the overview out of it, and a very long syllabus is read
// only up to MAX_TEXT_LENGTH. the outline request asks for these two alone, part by part
const OUTLINE: Record<ReadingLanguage, string> = {
  fr: `Analyse le document fourni (Doc 1, une partie d'un syllabus de cours). Ne réponds qu'avec un objet JSON, sans texte avant ou après, sans balise de code, sans citation ni lien.

Règles :
- N'invente rien : uniquement ce que le document contient.
${SUMMARY_RULE.fr}
${TOPICS_RULE.fr}

Format exact :
{"summary": string|null, "topics": [{"title": string, "subtopics": string[], "source": string}]}`,
  en: `Analyse the provided document (Doc 1, part of a course syllabus). Answer only with a JSON object, with no text before or after, no code fence, no citation and no link.

Rules:
- Do not invent anything: only what the document contains.
${SUMMARY_RULE.en}
${TOPICS_RULE.en}

Exact format:
{"summary": string|null, "topics": [{"title": string, "subtopics": string[], "source": string}]}`
};

// the parts of a syllabus read one by one for its outline; a short syllabus is one part
export const textParts = (text: string) => {
  const parts: string[] = [];
  for (let start = 0; start < text.length; start += MAX_TEXT_LENGTH) {
    parts.push(text.slice(start, start + MAX_TEXT_LENGTH));
  }
  return parts;
};

export const buildOutlineRequest = (part: string, lang: ReadingLanguage) => ({
  ...buildReadingRequest(part, lang),
  query: OUTLINE[lang]
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
// brackets are put back where the structure shows them; nothing else is changed. brackets still
// open at the very end mean the answer stopped before its end (its length limit)
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
  return { json: out + open.reverse().join(''), isCut: open.length > 0 };
};

// an answer that stopped before its end: what it holds can be used, but items may be missing
export const isAnswerCut = (answer: string) => {
  const start = answer.indexOf('{');
  return start >= 0 && closeBrackets(answer.slice(start)).isCut;
};

// the one JSON object in an answer, or null
export const parseJsonObject = (answer: string): any => {
  const start = answer.indexOf('{');
  const end = answer.lastIndexOf('}');
  if (start === -1 || end <= start) return null;
  const json = answer.slice(start, end + 1);
  for (const candidate of [json, closeBrackets(json).json]) {
    try {
      const data = JSON.parse(candidate);
      if (data && typeof data === 'object' && !Array.isArray(data)) return data;
    } catch {
      // try the repaired version next
    }
  }
  return null;
};

const list = (value: unknown): any[] => (Array.isArray(value) ? value : []);

// a topic named by the AI, with the line of the document it comes from (its grounding)
const parseTopics = (value: unknown): CourseTopic[] =>
  list(value)
    .map((topic) =>
      typeof topic === 'string'
        ? { title: asText(topic), subtopics: [], source: asText(topic) }
        : {
            title: asText(topic?.title),
            subtopics: list(topic?.subtopics)
              .map(asText)
              .filter((sub): sub is string => !!sub),
            source: asText(topic?.source)
          }
    )
    .filter((topic): topic is CourseTopic => !!topic.title);

// the outline of one part of a syllabus; null when the answer cannot be used
export const parseOutlineAnswer = (
  answer: string
): { summary: string | null; topics: CourseTopic[] } | null => {
  const data = parseJsonObject(answer);
  if (!data || !Array.isArray(data.topics)) return null;
  return { summary: asText(data.summary), topics: parseTopics(data.topics) };
};

// a title the AI gives that is not a course's name: a line about a person (the teacher, a
// contact), a session or a date, a bare year or number, or the document's own label. dropped, so
// the teacher adds the title like any field WeLearn did not find
const NOT_A_TITLE = [
  /^\s*(professeur\w*|professor|prof\.?|enseignant\w*|instructor|lecturer|teacher|tutor|responsable\w*|coordinat\w*|charg[ée]e? de cours|intervenant\w*|contact|e-?mail|office hours)\b/i,
  /^\s*(session|semester|semestre|term|year|ann[ée]e|date|period|p[ée]riode)\s*:/i,
  /^\s*(syllabus|course syllabus|course outline|plan de cours|programme|program|fiche (ue|cours|de cours))\s*$/i
];
export const isCourseTitle = (value: string | null) =>
  !!value && /\p{L}{2}/u.test(value) && !NOT_A_TITLE.some((pattern) => pattern.test(value));

// numbered topics as the syllabus writes them ("Theme 3: Freedom of expression…", "Chapitre 2 –
// …"), read from the text itself. a heading cut by the end of a line (after a comma or a small
// word) goes on to the next line. weeks and sessions are left to the outline
const NUMBERED =
  /^\s*(theme|th[èe]me|topic|chapter|chapitre|part|partie|module|unit|unit[ée]|axe)\s*(\d{1,2})\s*[:.–—-]\s*(\S.*)$/i;
const GOES_ON =
  /(,|-|–|\b(and|or|of|the|for|to|in|on|with|a|an|et|ou|de|des|du|la|le|les|à|au|aux|en|pour|sur|par|dans|avec|d['’]|l['’]))\s*$/i;
const MIN_NUMBERED = 3;
export const numberedTopics = (text: string): CourseTopic[] => {
  const lines = text.split(/\r?\n/);
  const items: { label: string; n: number; title: string }[] = [];
  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(NUMBERED);
    if (!match) continue;
    let title = match[3].trim();
    while (GOES_ON.test(title) && lines[i + 1]?.trim() && !NUMBERED.test(lines[i + 1])) {
      title = `${title} ${lines[++i].trim()}`;
    }
    items.push({
      label: match[1].toLowerCase(),
      n: Number(match[2]),
      title: title.replace(/[\s,;:]+$/, '')
    });
  }
  // the first run of one label numbered 1, 2, 3… in order
  for (const label of new Set(items.map((item) => item.label))) {
    const run: typeof items = [];
    items
      .filter((item) => item.label === label)
      .forEach((item) => {
        if (item.n === run.length + 1) run.push(item);
      });
    if (run.length >= MIN_NUMBERED) {
      return run.map(({ title }) => ({ title, subtopics: [], source: title }));
    }
  }
  return [];
};

// the same topic named twice: one topic, its subtopics together
export const mergeDuplicateTopics = (topics: CourseTopic[]): CourseTopic[] => {
  const merged: CourseTopic[] = [];
  topics.forEach((topic) => {
    const same = merged.find((known) => core(known.title) === core(topic.title));
    if (!same) merged.push({ ...topic, subtopics: [...topic.subtopics] });
    else
      topic.subtopics.forEach((sub) => {
        if (!same.subtopics.some((known) => core(known) === core(sub))) same.subtopics.push(sub);
      });
  });
  return merged;
};

// the AI's topics checked against the syllabus's own numbered topics: when the syllabus numbers
// them and the AI's list does not match them one for one (grouped under other categories,
// repeated, renamed), the syllabus's own headings are kept, in its order, with the subtopics the
// AI gave for the same heading. otherwise the AI's topics, without duplicates
const isSameTopic = (topic: CourseTopic, numbered: CourseTopic) => {
  const [mine, theirs] = [core(numbered.title), core(topic.source || topic.title)];
  return !!mine && !!theirs && (mine.includes(theirs) || theirs.includes(mine));
};
// a heading of the syllabus: a line of its own, not words inside a sentence (a label such as
// "Partie II :" before it allowed)
const MAX_LABEL = 20;
const isHeadingLine = (title: string, text: string) => {
  const wanted = core(title);
  return (
    !!wanted &&
    text
      .split(/\r?\n/)
      .some((line) => core(line).includes(wanted) && core(line).length <= wanted.length + MAX_LABEL)
  );
};

// a topic's subtopics, without those that are the words of a numbered heading (its own, or another
// theme the AI grouped under it)
const subtopicsOf = (topic: CourseTopic, numbered: CourseTopic[]) =>
  topic.subtopics.filter((sub) => !numbered.some((other) => core(other.title).includes(core(sub))));

export const preferNumberedTopics = (topics: CourseTopic[], text: string | null): CourseTopic[] => {
  const unique = mergeDuplicateTopics(topics);
  const numbered = text ? numberedTopics(text) : [];
  if (!numbered.length) return unique;
  const isFaithful =
    unique.length === topics.length &&
    unique.length === numbered.length &&
    numbered.every((item, index) => isSameTopic(unique[index], item));
  // the numbered items kept under the syllabus's own higher headings ("Partie II : …" with its
  // chapters as subtopics): a faithful structure too, not categories taken from the prose
  const isUnderOwnHeadings =
    unique.length === topics.length &&
    numbered.every((item) =>
      unique.some(
        (topic) =>
          isSameTopic(topic, item) ||
          topic.subtopics.some((sub) =>
            isSameTopic({ title: sub, subtopics: [], source: sub }, item)
          )
      )
    ) &&
    unique.every((topic) => isHeadingLine(topic.title, text!));
  if (isUnderOwnHeadings) return unique;
  // one for one, but a title may be a category from the prose rather than the heading's own words
  // (the right "Theme 2" line as source, "Civil and Political Rights" as title): the heading wins
  if (isFaithful) {
    return unique.map((topic, index) => {
      const heading = numbered[index];
      const isOwnWords =
        core(heading.title).includes(core(topic.title)) ||
        core(topic.title).includes(core(heading.title));
      return isOwnWords ? topic : { ...heading, subtopics: subtopicsOf(topic, numbered) };
    });
  }
  return numbered.map((item) => {
    const same = unique.find((topic) => isSameTopic(topic, item));
    return { ...item, subtopics: same ? subtopicsOf(same, numbered) : [] };
  });
};

export const parseReadingAnswer = (answer: string): CourseReading | null => {
  const data = parseJsonObject(answer);
  if (!data) return null;
  return {
    title: isCourseTitle(asText(data.title)) ? asText(data.title) : null,
    discipline: asText(data.discipline),
    // inferred by the AI when none is stated: shown as its suggestion, never as read
    disciplineSuggested: asText(data.discipline) ? null : asText(data.discipline_suggested),
    level: asText(data.level),
    description: asText(data.description),
    summary: asText(data.summary),
    topics: parseTopics(data.topics),
    sessions: list(data.sessions)
      .map((session) => ({ label: asText(session?.label), title: asText(session?.title) }))
      // a session with only its label ("Week 8") is still a session
      .filter((session) => session.label || session.title),
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
      .filter((title): title is string => !!title),
    isAnswerCut: isAnswerCut(answer),
    // the objectives come before the topics in the answer: cut before "topics", they may be
    // incomplete; cut later, only the topics or sessions were (and the outline request gets them)
    isObjectivesCut: isAnswerCut(answer) && !/"topics"\s*:/.test(answer)
  };
};
