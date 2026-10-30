import type { Document } from '@/types';
import { normalise, parseJsonObject, type ReadingLanguage } from '@/utils/courseReading';

// sustainability connections and adaptations, asked through the same question-answering
// endpoint as the reading (/qna/chat/answer), in three steps:
// 1. ideas: from the confirmed course alone, a few candidate connections, each with its own
//    targeted search questions;
// 2. evidence: each idea is searched in the WeLearn database (/search/by_document) with those
//    questions (done by the store);
// 3. selection: for each idea, the AI judges its candidate resources for this teaching purpose
//    and keeps 0 to 3 complementary ones, or drops the idea.
// the code then checks what can be checked: a kept resource must contain the sentence quoted for
// it and have a real link, and no figure may be stated that the resources do not contain.
// ponytail: a stand-in for dedicated endpoints, like the reading

// the course as the teacher confirmed it (their corrections included)
export interface ConfirmedCourse {
  title: string | null;
  discipline: string | null;
  level: string | null;
  isLesson: boolean;
  topics: string[];
  sessions: string[];
  objectives: string[];
  description: string | null;
}

// the endpoint keeps at most 7 sources
export const MAX_SOURCES = 7;
export const MAX_IDEAS = 4;
export const MAX_CONNECTIONS = 3;
// candidates judged per idea, and resources kept per connection
export const MAX_CANDIDATES = 6;
const MAX_RESOURCES = 3;
const MAX_DESCRIPTION = 1500;

const courseBlock = (course: ConfirmedCourse, lang: ReadingLanguage) => {
  const fr = lang === 'fr';
  const line = (label: string, value: string | null) => (value ? `${label} : ${value}` : '');
  const list = (label: string, items: string[]) =>
    items.length ? `${label} :\n${items.map((item) => `- ${item}`).join('\n')}` : '';
  return [
    line(fr ? 'Titre' : 'Title', course.title),
    line('Discipline', course.discipline),
    line(fr ? 'Niveau' : 'Level', course.level),
    list(fr ? 'Thèmes' : 'Topics', course.topics),
    list(fr ? 'Séances' : 'Sessions', course.sessions),
    list(fr ? 'Objectifs' : 'Objectives', course.objectives),
    line('Description', course.description?.slice(0, MAX_DESCRIPTION) || null)
  ]
    .filter(Boolean)
    .join('\n');
};

const SCALE: Record<ReadingLanguage, Record<'lesson' | 'course', string>> = {
  fr: {
    course:
      'Il s’agit d’un cours complet en plusieurs séances. Ne cherche pas à couvrir chaque thème ou chaque séance : choisis seulement les parties où un lien est vraiment solide.',
    lesson:
      'Il s’agit d’une seule séance : un lien doit pouvoir s’intégrer dans cette séance (un exemple, un cas, une question de discussion), dans sa durée.'
  },
  en: {
    course:
      'This is a whole course with several sessions. Do not try to cover every topic or session: only choose the parts where a connection is genuinely strong.',
    lesson:
      'This is a single lesson: a connection must fit within this lesson (an example, a case, a discussion question) and its length.'
  }
};

const IDEAS: Record<ReadingLanguage, string> = {
  fr: `Tu aides un·e enseignant·e à relier son enseignement au développement durable. Son enseignement, tel qu'il l'a confirmé, est le document fourni (Doc 1).

{scale}

Propose au plus 4 liens possibles avec la durabilité, qui approfondissent un concept que cet enseignement traite vraiment, au niveau de ses étudiant·e·s (par exemple, les limites du PIB comme mesure du bien-être dans un cours sur le PIB). Pas de lien fondé sur un simple mot-clé commun. Pour chacun, écris deux questions de recherche précises qui permettraient de trouver des ressources à l'appui de ce lien précis : la première en français, la seconde en anglais, formulée autrement.

Ne réponds qu'avec un objet JSON, sans texte avant ou après, sans balise de code, sans lien :
{"ideas": [{"title": string (court), "anchor": string (copie exacte de l'élément de l'enseignement concerné : un thème, une séance, un objectif ou le titre), "why": string (pourquoi ce lien compte pour cet enseignement, une phrase courte), "how": string (comment l'utiliser en cours, une phrase), "queries": [string, string]}]}`,
  en: `You help a teacher connect their teaching to sustainability. Their teaching, as they confirmed it, is the provided document (Doc 1).

{scale}

Suggest at most 4 possible sustainability connections that deepen a concept this teaching actually covers, at its students' level (for example, the limits of GDP as a measure of well-being in a course on GDP). No connection based on a shared keyword only. For each, write two precise search questions that would find resources supporting this specific connection: the first in English, the second reworded differently.

Answer only with a JSON object, with no text before or after, no code fence and no link:
{"ideas": [{"title": string (short), "anchor": string (exact copy of the part of the teaching concerned: a topic, a session, an objective or the title), "why": string (why this connection matters for this teaching, one short sentence), "how": string (how to use it in class, one sentence), "queries": [string, string]}]}`
};

const SELECTION: Record<ReadingLanguage, string> = {
  fr: `Tu aides un·e enseignant·e à choisir des ressources pour un lien entre son enseignement et la durabilité.

Enseignement :
{course}

Lien envisagé :
Titre : {title}
Partie concernée : {anchor}
Pourquoi : {why}

Les documents fournis (Doc 1 à Doc {count}) viennent de la base WeLearn ; la première ligne de chacun indique sa source. Évalue chacun pour CE lien précis : soutient-il directement ce qui est affirmé ? Sa source est-elle crédible (institution publique ou statistique, organisation internationale, recherche publiée) ? Est-il utile en cours et adapté au niveau des étudiant·e·s ? Pour un cours français, préfère des sources françaises ou européennes quand elles sont pertinentes ; une étude d'un autre pays ne convient que si elle éclaire directement ce lien. Préfère une source institutionnelle ou scientifique à un article d'encyclopédie général quand elle existe. Une phrase contenant les mêmes mots ne suffit pas.

Garde de 0 à 3 documents complémentaires (par exemple : des données ou un rapport institutionnel, une publication scientifique, une ressource pédagogique). Un seul excellent document vaut mieux que trois faibles. Si aucun ne convient, réponds avec "keep": false.

Ne réponds qu'avec un objet JSON, sans texte avant ou après, sans balise de code, sans lien :
{"keep": boolean, "why": string (pourquoi ce lien compte, une phrase, seulement ce que les documents gardés permettent d'affirmer), "how": string (comment l'utiliser en cours, une phrase), "resources": [{"document": number, "usefulness": string (en une phrase, ce que ce document apporte à ce lien en cours), "evidence": string (une phrase recopiée mot pour mot du document, qui soutient le lien)}]}
N'avance aucun chiffre qui ne figure pas mot pour mot dans un document gardé.`,
  en: `You help a teacher choose resources for a connection between their teaching and sustainability.

Teaching:
{course}

Proposed connection:
Title: {title}
Part concerned: {anchor}
Why: {why}

The provided documents (Doc 1 to Doc {count}) come from the WeLearn database; the first line of each gives its source. Judge each for THIS specific connection: does it directly support what is claimed? Is its source credible (public or statistical institution, international organisation, published research)? Is it useful in class and suited to the students' level? Prefer sources from the course's own country or region when relevant; a study from another country only fits if it directly illuminates this connection. Prefer an institutional or scientific source to a general encyclopedia article when one exists. A sentence sharing the same words is not enough.

Keep 0 to 3 complementary documents (for example: data or an institutional report, a scientific publication, a teaching resource). One excellent document is better than three weak ones. If none fits, answer with "keep": false.

Answer only with a JSON object, with no text before or after, no code fence and no link:
{"keep": boolean, "why": string (why this connection matters, one sentence, only what the kept documents allow to say), "how": string (how to use it in class, one sentence), "resources": [{"document": number, "usefulness": string (in one sentence, what this document brings to this connection in class), "evidence": string (one sentence copied word for word from the document, supporting the connection)}]}
Do not state any figure that is not written word for word in a kept document.`
};

const ADAPTATION: Record<ReadingLanguage, string> = {
  fr: `Tu aides un·e enseignant·e à intégrer la durabilité dans son enseignement, sans le réécrire. Voici son enseignement :

{course}

{scale}

Il ou elle a choisi ce lien :
Titre : {title}
Partie concernée : {anchor}
Pourquoi : {why}
Comment : {how}

À partir des documents fournis (Doc 1 à Doc {count}), propose une activité courte et réaliste qui s'ajoute à cette partie, adaptée à la discipline, au niveau des étudiant·e·s et au temps disponible. Utilise les documents pour appuyer la proposition, sans reprendre leurs méthodes de recherche, formules ou détails propres à leur cas d'étude. Ne demande pas aux étudiant·e·s d'analyser des données, un tableau ou un graphique qui ne figurent pas dans les documents ; si l'activité en a besoin, écris clairement que l'enseignant·e devra les fournir. Phrases simples, pas d'équations, aucun chiffre absent des documents, aucune ressource inventée.

Ne réponds qu'avec un objet JSON, sans texte avant ou après, sans balise de code, sans lien :
{"title": string (court), "placement": string (où dans l'enseignement, une phrase), "objective": string (l'objectif d'apprentissage de l'activité, une phrase), "duration": string (durée approximative), "steps": string[] (3 ou 4 étapes, une phrase chacune), "student_task": string (ce que font les étudiant·e·s, une phrase), "check": string (comment l'enseignant·e vérifie l'apprentissage, une phrase), "documents": number[] (documents utilisés)}`,
  en: `You help a teacher bring sustainability into their teaching, without rewriting it. Here is their teaching:

{course}

{scale}

They chose this connection:
Title: {title}
Part concerned: {anchor}
Why: {why}
How: {how}

Using the provided documents (Doc 1 to Doc {count}), suggest a short, realistic activity added to this part, suited to the discipline, the students' level and the time available. Use the documents to support the proposal, without copying their research methods, formulas or case-specific details. Do not ask students to analyse data, a table or a graph that is not in the documents; if the activity needs some, state clearly that the teacher will have to provide it. Simple sentences, no equations, no figure missing from the documents, no invented resource.

Answer only with a JSON object, with no text before or after, no code fence and no link:
{"title": string (short), "placement": string (where in the teaching, one sentence), "objective": string (the learning objective of the activity, one sentence), "duration": string (approximate duration), "steps": string[] (3 or 4 steps, one sentence each), "student_task": string (what students do, one sentence), "check": string (how the teacher checks learning, one sentence), "documents": number[] (documents used)}`
};

export const fill = (template: string, values: Record<string, string>) =>
  template.replace(/\{(\w+)\}/g, (match, key) => (key in values ? values[key] : match));

export const request = (query: string, sources: unknown[], lang: ReadingLanguage) => ({
  query,
  history: [],
  lang,
  sources: sources.slice(0, MAX_SOURCES)
});

const scaleOf = (course: ConfirmedCourse, lang: ReadingLanguage) =>
  SCALE[lang][course.isLesson ? 'lesson' : 'course'];

// step 1: the course itself is the only source
export const buildIdeasRequest = (course: ConfirmedCourse, lang: ReadingLanguage) =>
  request(
    fill(IDEAS[lang], { scale: scaleOf(course, lang) }),
    [
      {
        score: 1,
        payload: {
          document_corpus: 'course',
          document_desc: '',
          document_details: {},
          document_id: crypto.randomUUID(),
          document_lang: lang,
          document_sdg: [],
          document_title: course.title || 'Course',
          // ponytail: the endpoint requires a url; this one never resolves and is never shown
          document_url: 'https://example.invalid/course',
          slice_content: courseBlock(course, lang),
          slice_sdg: null
        }
      }
    ],
    lang
  );

// what the AI sees of a resource: its source first, so credibility can be judged
export const withSourceLine = (doc: Document): Document => {
  const details = doc.payload.document_details || ({} as Document['payload']['document_details']);
  const source = [doc.payload.document_corpus, details.publisher, details.journal, details.source]
    .filter(Boolean)
    .join(' · ');
  return {
    ...doc,
    payload: {
      ...doc.payload,
      slice_content: `Source : ${source} · ${doc.payload.document_lang}\n${doc.payload.slice_content}`
    }
  };
};

export interface ConnectionIdea {
  title: string;
  anchor: string | null;
  why: string;
  how: string;
  queries: string[];
}

// step 3: one idea and its own candidates
export const buildSelectionRequest = (
  course: ConfirmedCourse,
  idea: ConnectionIdea,
  candidates: Document[],
  lang: ReadingLanguage
) =>
  request(
    fill(SELECTION[lang], {
      course: courseBlock(course, lang),
      title: idea.title,
      anchor: idea.anchor || (lang === 'fr' ? 'l’ensemble' : 'the whole'),
      why: idea.why,
      count: String(Math.min(candidates.length, MAX_SOURCES))
    }),
    candidates.map(withSourceLine),
    lang
  );

export interface SupportingResource {
  document: Document;
  // why this resource helps for this connection, in one sentence
  usefulness: string;
  // the verified sentence it was chosen for, to open the source at that passage
  evidence?: string;
}

// the original source rather than a catalogue page: the publisher's DOI when there is one, opened
// at the verified passage when one is known (a text fragment, highlighted by most browsers)
export const sourceLink = (doc: Document, passage?: string) => {
  const doi = (doc.payload.document_details as { doi?: unknown } | undefined)?.doi;
  const base = typeof doi === 'string' && /^https?:\/\//.test(doi) ? doi : doc.payload.document_url;
  if (!passage) return base;
  const start = passage.split(/\s+/).slice(0, 8).join(' ');
  return `${base}#:~:text=${encodeURIComponent(start).replace(/-/g, '%2D')}`;
};

export interface ConnectionSuggestion {
  title: string;
  anchor: string | null;
  why: string;
  how: string;
  resources: SupportingResource[];
}

export const buildAdaptationRequest = (
  course: ConfirmedCourse,
  connection: { title: string; anchor: string | null; why: string; how: string },
  documents: Document[],
  lang: ReadingLanguage
) =>
  request(
    fill(ADAPTATION[lang], {
      course: courseBlock(course, lang),
      scale: scaleOf(course, lang),
      title: connection.title,
      anchor: connection.anchor || (lang === 'fr' ? 'l’ensemble' : 'the whole'),
      why: connection.why,
      how: connection.how,
      count: String(Math.min(documents.length, MAX_SOURCES))
    }),
    documents,
    lang
  );

const asText = (value: unknown): string | null =>
  typeof value === 'string' && value.trim() ? value.trim() : null;

// the endpoint adds html citations and "Doc N" references, meaningless to a teacher: each one
// becomes the title of the real resource it points to; other markup is removed
export const cleanCitations = (text: string, documents: Document[]) => {
  const titleOf = (n: string) => documents[Number(n) - 1]?.payload.document_title;
  const cited = (n: string) => (titleOf(n) ? `« ${titleOf(n)} »` : '');
  return (
    text
      .replace(
        /<a\b[^>]*>\s*\[?\s*Doc(?:ument)?\s*(\d+)\s*\]?\s*<\/a>/gi,
        (_, n) => ` (${cited(n)})`
      )
      .replace(/<[^>]+>/g, '')
      .replace(/\[\s*Doc(?:ument)?\s*(\d+)\s*\]/gi, (_, n) => cited(n))
      // a list ("Docs 2, 3 et 5"): every document named, not only the first
      .replace(/\bDoc(?:ument)?s?\s*(\d+(?:\s*(?:,|et|and|&)\s*\d+)+)\b/gi, (_, list: string) =>
        (list.match(/\d+/g) || []).map(cited).filter(Boolean).join(', ')
      )
      .replace(/\bDoc(?:ument)?\s*(\d+)\b/gi, (_, n) => cited(n))
      .replace(/\(\s*\)/g, '')
      .replace(/\*+/g, '')
      .replace(/[ \t]{2,}/g, ' ')
      .replace(/\s+([.,)])/g, '$1')
      .trim()
  );
};

export const asCleanText = (value: unknown, documents: Document[]) => {
  const text = asText(value);
  return text ? asText(cleanCitations(text, documents)) : null;
};

export const isPartOfCourse = (anchor: string | null, courseParts: string[]) =>
  !!anchor &&
  courseParts
    .map(normalise)
    .some((part) => part.includes(normalise(anchor)) || normalise(anchor).includes(part));

// null when the answer is not the expected structure
export const parseIdeas = (answer: string, courseParts: string[]): ConnectionIdea[] | null => {
  const data = parseJsonObject(answer);
  if (!data || !Array.isArray(data.ideas)) return null;
  return data.ideas
    .map((item: any) => {
      const title = asCleanText(item?.title, []);
      const why = asCleanText(item?.why, []);
      const how = asCleanText(item?.how, []);
      const queries = (Array.isArray(item?.queries) ? item.queries : [])
        .map(asText)
        .filter((query: string | null): query is string => !!query)
        .slice(0, 2);
      if (!title || !why || !how || !queries.length) return null;
      const anchor = asText(item?.anchor);
      return {
        title,
        anchor: isPartOfCourse(anchor, courseParts) ? anchor : null,
        why,
        how,
        queries
      };
    })
    .filter((idea: ConnectionIdea | null): idea is ConnectionIdea => !!idea)
    .slice(0, MAX_IDEAS);
};

// figures the AI states (percentages, decimal numbers) must be written in a kept resource
// (amounts in millions or billions, and currencies, count as figures too)
const FIGURES =
  /\d+(?:[.,]\d+)?\s?(?:%|milliards?|millions?|billions?|bn|€|\$|£)|[€$£]\s?\d+(?:[.,]\d+)?|\d+[.,]\d+/gi;
export const resourceText = (documents: Document[]) =>
  normalise(
    documents.map((doc) => `${doc.payload.document_title} ${doc.payload.slice_content}`).join(' ')
  );
export const hasUnsupportedFigure = (text: string, documents: Document[]) => {
  const source = resourceText(documents);
  return (text.match(FIGURES) || []).some((figure) => !source.includes(normalise(figure)));
};

// the quote without the endpoint's citation markup or the quotation marks around it
export const cleanQuote = (value: unknown) =>
  asText(
    cleanCitations(asText(value) || '', [])
      // quotation marks around it, and the punctuation after them ("…»." or "…".)
      .replace(/^[«"“\s]+|[»"”\s]+[.;,]?\s*$/g, '')
  );

export const hasLink = (doc: Document) => /^https?:\/\//.test(doc.payload.document_url || '');

// the selection for one idea: null when unusable; a connection only when the AI keeps it and at
// least one resource passes the checks (a real link, the quoted sentence present in its text)
export const parseSelection = (
  answer: string,
  idea: ConnectionIdea,
  candidates: Document[]
): ConnectionSuggestion | { keep: false } | null => {
  const data = parseJsonObject(answer);
  if (!data || typeof data.keep !== 'boolean') return null;
  if (!data.keep) return { keep: false };
  const given = candidates.slice(0, MAX_SOURCES);
  const seen = new Set<number>();
  const resources = (Array.isArray(data.resources) ? data.resources : [])
    .map((item: any) => {
      const n = item?.document;
      if (!Number.isInteger(n) || n < 1 || n > given.length || seen.has(n)) return null;
      seen.add(n);
      const document = given[n - 1];
      const usefulness = asCleanText(item?.usefulness, given);
      const evidence = cleanQuote(item?.evidence);
      if (!usefulness || !evidence || !hasLink(document)) return null;
      if (!resourceText([document]).includes(normalise(evidence))) return null;
      return { document, usefulness };
    })
    .filter((item: SupportingResource | null): item is SupportingResource => !!item)
    .slice(0, MAX_RESOURCES);
  if (!resources.length) return { keep: false };
  const why = asCleanText(data.why, given) || idea.why;
  const how = asCleanText(data.how, given) || idea.how;
  const kept = resources.map((resource: SupportingResource) => resource.document);
  if (hasUnsupportedFigure(`${idea.title} ${why} ${how}`, kept)) return { keep: false };
  return { title: idea.title, anchor: idea.anchor, why, how, resources };
};

export interface AdaptationSuggestion {
  title: string;
  placement: string | null;
  objective: string | null;
  duration: string | null;
  steps: string[];
  studentTask: string | null;
  check: string | null;
  documents: Document[];
}

const MAX_STEPS = 4;

// the cited resources, among the ones given (Doc 1 = documents[0]); unknown numbers are ignored
export const citedDocuments = (value: unknown, documents: Document[]) =>
  [...new Set(Array.isArray(value) ? value : [])]
    .filter((n): n is number => Number.isInteger(n) && n >= 1 && n <= documents.length)
    .map((n) => documents[n - 1]);

export const parseAdaptation = (
  answer: string,
  documents: Document[]
): AdaptationSuggestion | null => {
  const data = parseJsonObject(answer);
  const given = documents.slice(0, MAX_SOURCES);
  const clean = (value: unknown) => asCleanText(value, given);
  const title = clean(data?.title);
  const steps = (Array.isArray(data?.steps) ? data.steps : [])
    .map(clean)
    .filter((step: string | null): step is string => !!step)
    .slice(0, MAX_STEPS);
  if (!title || !steps.length) return null;
  return {
    title,
    placement: clean(data.placement),
    objective: clean(data.objective),
    duration: clean(data.duration),
    steps,
    studentTask: clean(data.student_task),
    check: clean(data.check),
    documents: citedDocuments(data.documents, given)
  };
};
