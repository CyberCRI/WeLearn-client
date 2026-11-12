import type { Document } from '@/types';
import { normalise } from '@/utils/courseCheck';
import { parseJsonObject, type ReadingLanguage } from '@/utils/courseReading';
import { greenCompForPrompt, isGreenCompId, type GreenCompId } from '@/utils/greencomp';

// sustainability connections for a confirmed course, reused from the "design your course"
// prototype (esra/pedagogy-experiments), asked through the same question-answering endpoint as the
// reading (/qna/chat/answer), in three steps:
// 1. ideas: from the confirmed course alone, a few candidate connections, each tied to a part of
//    the course and with its own targeted search questions;
// 2. evidence: each idea is searched in the WeLearn database (/search/by_document) with those
//    questions (done by the store);
// 3. selection: for each idea, the AI judges its candidate resources for this connection and keeps
//    0 to 3 complementary ones, or none.
// the code then checks what can be checked: a kept resource must contain the sentence quoted for
// it and have a real link, and no figure may be stated that the resources do not contain. an idea
// left without such a resource is not dropped: it is shown apart, as not supported by WeLearn.
// ponytail: a stand-in for dedicated endpoints, like the reading

// the course as the teacher confirmed it in step 2 (their corrections included)
export interface ConfirmedCourse {
  title: string | null;
  discipline: string | null;
  level: string | null;
  overview: string | null;
  topics: string[];
  objectives: string[];
  competencies: string[];
  // the course outline (sessions, weeks or chapters) as the teacher confirmed it
  sessions: string[];
}

// the endpoint keeps at most 7 sources
export const MAX_SOURCES = 7;
// a small set the teacher can weigh: a few ideas, a few resources each
export const MAX_IDEAS = 4;
export const MAX_CANDIDATES = 6;
const MAX_RESOURCES = 3;

const courseBlock = (course: ConfirmedCourse, lang: ReadingLanguage) => {
  const fr = lang === 'fr';
  const line = (label: string, value: string | null) => (value ? `${label} : ${value}` : '');
  const list = (label: string, items: string[]) =>
    items.length ? `${label} :\n${items.map((item) => `- ${item}`).join('\n')}` : '';
  return [
    line(fr ? 'Titre' : 'Title', course.title),
    line('Discipline', course.discipline),
    line(fr ? 'Niveau' : 'Level', course.level),
    line(fr ? 'Présentation' : 'Overview', course.overview),
    list(fr ? 'Thèmes' : 'Topics', course.topics),
    course.objectives.length
      ? list(fr ? 'Objectifs d’apprentissage' : 'Learning objectives', course.objectives)
      : fr
        ? 'Objectifs d’apprentissage : aucun objectif explicite dans le syllabus'
        : 'Learning objectives: none stated in the syllabus',
    list(fr ? 'Compétences' : 'Competencies', course.competencies),
    list(fr ? 'Plan du cours' : 'Course outline', course.sessions)
  ]
    .filter(Boolean)
    .join('\n');
};

const IDEAS: Record<ReadingLanguage, string> = {
  fr: `Tu aides un·e enseignant·e à relier son cours au développement durable. Son cours, tel qu'il l'a confirmé, est le document fourni (Doc 1).

Il s'agit d'un cours complet en plusieurs séances. Ne cherche pas à couvrir chaque thème : choisis seulement les parties où un lien est vraiment solide sur le plan disciplinaire.

Propose au plus 4 liens possibles avec la durabilité, qui approfondissent un concept que ce cours traite vraiment, dans sa discipline et au niveau de ses étudiant·e·s (par exemple, les limites du PIB comme mesure du bien-être dans un cours sur le PIB). Pas de lien fondé sur un simple mot-clé commun, pas de thème de durabilité générique. Chaque lien repose sur un seul mécanisme précis : ne mélange pas deux mécanismes différents (par exemple, l'effet des prix de l'énergie sur l'inflation et le coût des pollutions sont deux liens distincts). Moins de liens solides valent mieux que des liens faibles. Pour chacun, écris deux questions de recherche précises qui permettraient de trouver des ressources à l'appui de ce lien précis : la première en français, la seconde en anglais, formulée autrement.

Ne réponds qu'avec un objet JSON, sans texte avant ou après, sans balise de code, sans lien :
{"ideas": [{"title": string (court), "anchor": string (copie exacte de la partie du cours concernée : de préférence un thème ou une séance du plan, sinon un objectif d'apprentissage), "anchor_label": string (2 à 5 mots qui nomment ce que traite cette partie du cours, par exemple « Mesure du PIB »), "why": string (pourquoi ce lien compte pour ce cours, une phrase courte), "queries": [string, string]}]}`,
  en: `You help a teacher connect their course to sustainability. Their course, as they confirmed it, is the provided document (Doc 1).

This is a whole course with several sessions. Do not try to cover every topic: only choose the parts where a connection is genuinely strong within the discipline.

Suggest at most 4 possible sustainability connections that deepen a concept this course actually covers, within its discipline and at its students' level (for example, the limits of GDP as a measure of well-being in a course on GDP). No connection based on a shared keyword only, no generic sustainability theme. Each connection rests on one precise mechanism: do not mix two different mechanisms (for example, the effect of energy prices on inflation and the cost of pollution are two distinct connections). Fewer strong connections are better than weak ones. For each, write two precise search questions that would find resources supporting this specific connection: the first in English, the second reworded differently.

Answer only with a JSON object, with no text before or after, no code fence and no link:
{"ideas": [{"title": string (short), "anchor": string (exact copy of the course part concerned: preferably a topic or a session of the outline, otherwise a learning objective), "anchor_label": string (2 to 5 words naming what this course part covers, for example "GDP measurement"), "why": string (why this connection matters for this course, one short sentence), "queries": [string, string]}]}`
};

const SELECTION: Record<ReadingLanguage, string> = {
  fr: `Tu aides un·e enseignant·e à choisir des ressources pour un lien entre son cours et la durabilité.

Cours :
{course}

Lien envisagé :
Titre : {title}
Partie concernée : {anchor}
Pourquoi : {why}
Usage du concept du cours : {use}

Juge d'abord le lien lui-même, dans "fit" : "genuine" si le concept du cours explique, mesure, modélise cette question de durabilité ou s'y applique directement, d'une façon que les spécialistes de la discipline reconnaîtraient ; "analogy" s'il repose sur une métaphore ou une ressemblance ; "off_discipline" s'il repose sur un mot qui a un autre sens dans cette discipline, ou sur un lien que la discipline n'établit pas. Si "fit" n'est pas "genuine", réponds avec "keep": false.

Les documents fournis (Doc 1 à Doc {count}) viennent de la base WeLearn ; la première ligne de chacun indique sa source. Évalue chacun pour CE lien précis : soutient-il directement ce qui est affirmé ? Sa source est-elle crédible (institution publique ou statistique, organisation internationale, recherche publiée) ? Est-il utile en cours et adapté au niveau des étudiant·e·s ? Pour un cours français, préfère des sources françaises ou européennes quand elles sont pertinentes ; une étude d'un autre pays ne convient que si elle éclaire directement ce lien. Préfère une source institutionnelle ou scientifique à un article d'encyclopédie général quand elle existe. Une phrase contenant les mêmes mots ne suffit pas.

Commence par nommer pour toi le concept ou le mécanisme disciplinaire précis de ce lien dans ce cours (une notion, une méthode, un modèle ou un phénomène que le cours enseigne) et la façon dont le lien l'utiliserait en cours. Puis, pour chaque document, demande-toi quel est son sujet principal, et classe-le :
- "direct" : son sujet principal traite ce concept ou ce mécanisme, ou son application dans cette discipline, en lien avec la durabilité, et il apporte un contenu qu'un·e enseignant·e peut utiliser pour enseigner ce lien (une explication, des données, un cas, une méthode) ;
- "context" : il traite la question de durabilité, le secteur ou le thème général de ce lien, mais pas ce concept ou ce mécanisme ; il ne sert que de contexte ;
- n'inclus pas un autre document (un autre sujet, un autre pays sans lien avec ce cours, un texte général qui ne partage que des mots-clés).
Un document sur le thème général de durabilité n'est pas "direct" pour un concept disciplinaire précis. Pour un document "direct", donne dans "concept_terms" les mots que le document lui-même emploie pour ce concept ou ce mécanisme (dans sa langue), et recopie dans "evidence" une phrase du document qui contient l'un de ces mots et traite ce concept. Si le document n'emploie aucun mot pour ce concept lui-même, il ne peut être que "context" (avec "concept_terms": []). Donne aussi dans "sustainability_terms" les mots que le document lui-même emploie pour le côté durabilité de ce lien. Attention aux mots qui ont un autre sens dans cette discipline : "same_sense" est false si le document emploie le mot clé dans un autre sens que ce cours (par exemple, le recyclage des déchets pour un cours où « recyclage » désigne un flux recyclé dans un procédé) ; un tel document n'est pas inclus. "establishes" est true seulement si le document lui-même établit l'affirmation précise de ce lien (le mécanisme, l'exemple, la relation de cause) pour la situation de ce cours : un résultat obtenu sur un système artificiel, expérimental ou particulier n'établit pas le fonctionnement général ou naturel, et une mesure d'un concept n'établit pas son effet sur un comportement. Un document n'est "direct" que si "same_sense" et "establishes" sont true. Qu'une phrase figure dans le document ne prouve rien : juge le contenu du document.

Garde au plus 3 documents complémentaires, les "direct" d'abord (par exemple : une publication scientifique, des données ou un rapport institutionnel, une ressource pédagogique) ; ne garde un document "context" que s'il apporte un contexte utile. Un seul excellent document vaut mieux que trois faibles. Si aucun ne convient, réponds avec "keep": false.

Ne réponds qu'avec un objet JSON, sans texte avant ou après, sans balise de code, sans lien :
{"fit": "genuine"|"analogy"|"off_discipline", "fit_reason": string (une phrase), "keep": boolean, "concept": string (le concept ou le mécanisme disciplinaire de ce lien, en quelques mots), "why": string (une ou deux phrases courtes : ce que cette partie du cours enseigne déjà, ce que ce lien y apporterait, et ce que les étudiant·e·s pourraient ainsi mieux comprendre ou faire ; pas de formule générale sur la durabilité, et ne parle ni de toi, ni de l'enseignant·e, ni des documents, ni « du lien » ; seulement ce que les documents "direct" permettent d'affirmer), "resources": [{"document": number, "subject": string (le sujet principal du document, en quelques mots), "concept_terms": string[], "sustainability_terms": string[], "same_sense": boolean, "establishes": boolean, "relevance": "direct"|"context", "usefulness": string (en une phrase, ce que ce document apporte à ce lien en cours), "evidence": string (une phrase recopiée mot pour mot du document)}]}
N'avance aucun chiffre qui ne figure pas mot pour mot dans un document gardé.`,
  en: `You help a teacher choose resources for a connection between their course and sustainability.

Course:
{course}

Proposed connection:
Title: {title}
Part concerned: {anchor}
Why: {why}
Use of the course's concept: {use}

First judge the connection itself, in "fit": "genuine" if the course's concept explains, measures or models this sustainability issue, or applies directly to it, in a way specialists of the discipline would recognise; "analogy" if it rests on a metaphor or a resemblance; "off_discipline" if it rests on a word that means something else in this discipline, or on a link the discipline does not establish. If "fit" is not "genuine", answer with "keep": false.

The provided documents (Doc 1 to Doc {count}) come from the WeLearn database; the first line of each gives its source. Judge each for THIS specific connection: does it directly support what is claimed? Is its source credible (public or statistical institution, international organisation, published research)? Is it useful in class and suited to the students' level? Prefer sources from the course's own country or region when relevant; a study from another country only fits if it directly illuminates this connection. Prefer an institutional or scientific source to a general encyclopedia article when one exists. A sentence sharing the same words is not enough.

First name, for yourself, the precise disciplinary concept or mechanism of this connection in this course (a notion, method, model or phenomenon the course teaches) and how the connection would use it in teaching. Then, for each document, ask what its main subject is, and classify it:
- "direct": its main subject treats this concept or mechanism, or its application in this discipline, in relation to sustainability, and it gives content a teacher could use to teach this connection (an explanation, data, a case, a method);
- "context": it treats the sustainability issue, sector or general theme of this connection, but not this concept or mechanism; it only serves as background;
- do not include any other document (another subject, another country unrelated to this course, a general text sharing only keywords).
A document on the general sustainability theme is not "direct" for a precise disciplinary concept. For a "direct" document, give in "concept_terms" the words the document itself uses for this concept or mechanism (in its own language), and copy into "evidence" a sentence of the document that contains one of these words and treats this concept. If the document uses no word for the concept itself, it can only be "context" (with "concept_terms": []). Also give in "sustainability_terms" the words the document itself uses for the sustainability side of this connection. Beware of words that mean something else in this discipline: "same_sense" is false when the document uses the key word in another sense than this course (for example, waste recycling for a course where "recycle" means a recycled stream in a process); such a document is not included. "establishes" is true only if the document itself establishes the specific claim of this connection (the mechanism, the example, the causal relation) for the situation of this course: a result obtained on an artificial, experimental or particular system does not establish how the general or natural process works, and a measure of a concept does not establish its effect on a behaviour. A document is "direct" only if "same_sense" and "establishes" are both true. That a sentence appears in the document proves nothing: judge the document's content.

Keep at most 3 complementary documents, "direct" ones first (for example: a scientific publication, data or an institutional report, a teaching resource); keep a "context" document only when it adds useful background. One excellent document is better than three weak ones. If none fits, answer with "keep": false.

Answer only with a JSON object, with no text before or after, no code fence and no link:
{"fit": "genuine"|"analogy"|"off_discipline", "fit_reason": string (one sentence), "keep": boolean, "concept": string (the disciplinary concept or mechanism of this connection, in a few words), "why": string (one or two short sentences: what this part of the course already teaches, what this connection would add to it, and what students could then better understand or do; no generic sustainability phrase, and do not mention yourself, the teacher, the documents or "the connection"; only what the "direct" documents allow to say), "resources": [{"document": number, "subject": string (the document's main subject, in a few words), "concept_terms": string[], "sustainability_terms": string[], "same_sense": boolean, "establishes": boolean, "relevance": "direct"|"context", "usefulness": string (in one sentence, what this document brings to this connection in class), "evidence": string (one sentence copied word for word from the document)}]}
Do not state any figure that is not written word for word in a kept document.`
};

export const fill = (template: string, values: Record<string, string>) =>
  template.replace(/\{(\w+)\}/g, (match, key) => (key in values ? values[key] : match));

export const request = (query: string, sources: unknown[], lang: ReadingLanguage) => ({
  query,
  history: [],
  lang,
  sources: sources.slice(0, MAX_SOURCES)
});

// step 1: the course itself is the only source
export const buildIdeasRequest = (course: ConfirmedCourse, lang: ReadingLanguage) =>
  request(
    IDEAS[lang],
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
  const details = (doc.payload.document_details || {}) as Record<string, unknown>;
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
  // the course topic, session or objective it builds on, as the teacher confirmed it; null when
  // the AI named nothing that is in the course
  anchor: string | null;
  // a few words naming what that course part covers (an objective is long): the AI's wording
  anchorLabel: string | null;
  why: string;
  queries: string[];
  // how the course's own concept is used to study the sustainability issue (the AI's wording)
  use?: string | null;
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
      anchor: idea.anchor || (lang === 'fr' ? 'l’ensemble du cours' : 'the whole course'),
      why: idea.why,
      use: idea.use || '-',
      count: String(Math.min(candidates.length, MAX_SOURCES))
    }),
    candidates.map(withSourceLine),
    lang
  );

export interface SupportingResource {
  document: Document;
  // what this resource brings to the connection, in one sentence
  usefulness: string;
  // the sentence it was chosen for, found word for word in the resource
  evidence: string;
  // "context": about the connection's broader sustainability issue, not the course's own concept
  // or mechanism. background only, never shown or counted as support
  role?: 'context';
}

// the original source rather than a catalogue page: the publisher's DOI when there is one, opened
// at the verified passage (a text fragment, highlighted by most browsers)
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
  anchorLabel: string | null;
  why: string;
  // empty: WeLearn found no resource that supports this idea well enough
  resources: SupportingResource[];
  // resources that only give background on the sustainability issue: kept apart, labelled
  background?: SupportingResource[];
  // the resources could not be judged (the AI's answer was unusable or lost): a technical
  // failure, not a judgement that WeLearn has no resource. the teacher can check again
  isUnchecked?: boolean;
  // the judgement found the connection itself forced (an analogy, a word with another meaning in
  // the discipline, a link the discipline does not establish): not suggested at all
  isForced?: boolean;
  // what the idea was searched with, to check it again
  queries?: string[];
  use?: string | null;
}

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
      // a markdown link keeps its words; a bare link in brackets goes
      .replace(/\[([^\]]+)\]\(https?:[^)\s]+\)/g, '$1')
      .replace(/\(\s*https?:[^)\s]+\s*\)/g, '')
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

// a pedagogical note as a sentence: capital first letter, one closing punctuation mark, no trailing
// colon or stray spaces
export const tidyNote = (text: string) => {
  const trimmed = text
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[\s:;,]+$/, '');
  if (!trimmed) return trimmed;
  const capitalised = trimmed.charAt(0).toLocaleUpperCase() + trimmed.slice(1);
  return /[.!?…]$/.test(capitalised) ? capitalised : `${capitalised}.`;
};

export const asCleanText = (value: unknown, documents: Document[]) => {
  const text = asText(value);
  return text ? asText(cleanCitations(text, documents)) : null;
};

// the course part the AI names, as the teacher wrote it: the part that contains it, or else the
// most precise part it contains; null when it is not in the course
export const partOfCourse = (anchor: string | null, courseParts: string[]) => {
  if (!anchor) return null;
  const wanted = normalise(anchor);
  const known = courseParts.map((part) => ({ part, text: normalise(part) })).filter((p) => p.text);
  const containing = known.find(({ text }) => text.includes(wanted));
  if (containing) return containing.part;
  const contained = known
    .filter(({ text }) => wanted.includes(text))
    .sort((a, b) => b.text.length - a.text.length);
  return contained[0]?.part || null;
};

// why the AI found no connection, shown with the empty result so it reads as a judgement
export const noneReasonOf = (answer: string) =>
  asCleanText(parseJsonObject(answer)?.none_reason, []);

// null when the answer is not the expected structure. an empty list is a judgement only when the
// AI says why no connection fits; an empty list without a reason, or a list none of whose items
// is usable, is an unusable answer (asked again, then reported as a failure): never shown as
// "no connection found"
export const parseIdeas = (answer: string, courseParts: string[]): ConnectionIdea[] | null => {
  const data = parseJsonObject(answer);
  if (!data || !Array.isArray(data.ideas)) return null;
  if (!data.ideas.length) return asText(data.none_reason) ? [] : null;
  const ideas = data.ideas
    .map((item: any) => {
      const title = asCleanText(item?.title, []);
      const why = asCleanText(item?.why, []);
      const queries = (Array.isArray(item?.queries) ? item.queries : [])
        .map(asText)
        .filter((query: string | null): query is string => !!query)
        .slice(0, 2);
      if (!title || !why || !queries.length) return null;
      const anchor = partOfCourse(asText(item?.anchor), courseParts);
      const label = asCleanText(item?.anchor_label, []);
      // a label only names a part that is in the course, and stays short
      const anchorLabel = anchor && label && label.split(/\s+/).length <= 8 ? label : null;
      return { title, anchor, anchorLabel, why, queries, use: asCleanText(item?.use, []) };
    })
    .filter((idea: ConnectionIdea | null): idea is ConnectionIdea => !!idea)
    .slice(0, MAX_IDEAS);
  return ideas.length ? ideas : null;
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

// a quoted sentence is in the document: word for word, or with only what text extraction adds
// to a pdf (a word cut by a hyphen, "diffi- cult"; a page header or number inside a sentence).
// the quote's words must all be there, in order: nothing changed or left out, and a short quote
// must match exactly
const MIN_LOOSE_WORDS = 8;
const MAX_INSERTED_WORDS = 8;
const wordsOf = (text: string) =>
  text
    .normalize('NFC')
    .toLowerCase()
    .replace(/[’‘`´]/g, "'")
    .replace(/(\p{L})[-‐‑]\s+(\p{L})/gu, '$1$2')
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean);
export const isQuotedIn = (quote: string, document: Document) => {
  const text = resourceText([document]);
  const wanted = normalise(quote);
  if (!wanted) return false;
  if (text.includes(wanted) || text.replace(/-/g, '').includes(wanted.replace(/-/g, '')))
    return true;
  const quoted = wordsOf(quote);
  if (quoted.length < MIN_LOOSE_WORDS) return false;
  const source = wordsOf(`${document.payload.document_title} ${document.payload.slice_content}`);
  return source.some((word, start) => {
    if (word !== quoted[0]) return false;
    let found = 1;
    let inserted = 0;
    for (let i = start + 1; i < source.length && found < quoted.length; i++) {
      if (source[i] === quoted[found]) found++;
      else if (++inserted > MAX_INSERTED_WORDS) return false;
    }
    return found === quoted.length;
  });
};

// the part of a quote that is really in the document: all of it, or else the first of its
// sentences that is (a quote stitched from sentences far apart keeps only a true one); null when
// none is. only a verified sentence is ever shown as a quote
const MIN_SENTENCE = 40;
export const verifiedQuote = (quote: string | null, document: Document) => {
  if (!quote) return null;
  if (isQuotedIn(quote, document)) return quote;
  const sentences = quote
    .split(/(?<=[.!?;])\s+/)
    .map((part) => part.replace(/^\[(\.\.\.|…)\]\s*/, ''))
    .filter((part) => part.length >= MIN_SENTENCE);
  return sentences.length > 1 ? sentences.find((part) => isQuotedIn(part, document)) || null : null;
};

// the quote without the endpoint's citation markup or the quotation marks around it
export const cleanQuote = (value: unknown) =>
  asText(
    cleanCitations(asText(value) || '', [])
      // quotation marks around it, and the punctuation after them ("…»." or "…".)
      .replace(/^[«"“\s]+|[»"”\s]+[.;,]?\s*$/g, '')
  );

export const hasLink = (doc: Document) => /^https?:\/\//.test(doc.payload.document_url || '');

// the selection for one idea: null when unusable. a resource the AI judges direct support (about
// the course's concept or mechanism itself) supports the connection; one that only gives context
// on the sustainability issue is kept apart as background. both must pass the checks (a real
// link, the quoted sentence present in its text): a quote found in the text proves only that it
// is there, the judgement is on the content. the connection keeps the idea's
// own words when the AI's "why" states a figure the resources do not contain. without any kept
// resource, the idea comes back with none: shown as not supported, never dropped
// the sentence contains one of the words the AI says the document uses for the course's concept
export const namesConcept = (sentence: string, terms: unknown) => {
  const text = normalise(sentence);
  return (
    Array.isArray(terms) &&
    terms.some(
      (term) =>
        typeof term === 'string' && normalise(term).length >= 3 && text.includes(normalise(term))
    )
  );
};

// the document speaks of the sustainability side of the connection: in the words the AI says it
// uses, or, since the AI sometimes gives those words translated, in common sustainability words
// of its own (english or french). a paper on attachment measures or on stars has none of them
const SUSTAINABILITY_WORDS = [
  'sustainab',
  'durabl',
  'environment',
  'environnement',
  'climat',
  'ecolog',
  'écolog',
  'ecosystem',
  'écosystème',
  'biodivers',
  'pollut',
  'emission',
  'émission',
  'carbon',
  'greenhouse',
  'effetdeserre',
  'renewable',
  'renouvelable',
  'inequalit',
  'inégalit',
  'poverty',
  'pauvreté',
  'waste',
  'déchet',
  'circulareconomy',
  'économiecirculaire'
];
export const speaksOfSustainability = (document: Document, terms: unknown) => {
  const text = resourceText([document]);
  return namesConcept(text, terms) || SUSTAINABILITY_WORDS.some((word) => text.includes(word));
};

// an explanation about the process rather than the course ("…the connection chosen by the teacher,
// using evidence from…"): not a pedagogical reason
const PROCESS_WORDS =
  /\b(?:chosen by the teacher|the teacher chose|the (?:provided |cited )?documents?|this connection|choisie? par l['’]enseignant|les documents|ce lien)\b/i;
export const isAboutProcess = (text: string) => PROCESS_WORDS.test(text);

export const parseSelection = (
  answer: string,
  idea: ConnectionIdea,
  candidates: Document[]
): ConnectionSuggestion | null => {
  const data = parseJsonObject(answer);
  if (!data || typeof data.keep !== 'boolean') return null;
  const unsupported = {
    title: idea.title,
    anchor: idea.anchor,
    anchorLabel: idea.anchorLabel,
    why: idea.why,
    resources: [] as SupportingResource[],
    background: [] as SupportingResource[],
    queries: idea.queries,
    use: idea.use ?? null
  };
  // an analogy, or a link through a word with another meaning in the discipline: not suggested
  if (data.fit === 'analogy' || data.fit === 'off_discipline') {
    return { ...unsupported, isForced: true };
  }
  if (!data.keep) return unsupported;
  const given = candidates.slice(0, MAX_SOURCES);
  const seen = new Set<number>();
  const resources = (Array.isArray(data.resources) ? data.resources : [])
    .map((item: any): SupportingResource | null => {
      const n = item?.document;
      if (!Number.isInteger(n) || n < 1 || n > given.length || seen.has(n)) return null;
      seen.add(n);
      const document = given[n - 1];
      // "indirect" was this judgement's earlier name for context; anything else is left out
      if (!['direct', 'context', 'indirect'].includes(item?.relevance)) return null;
      // the key word used in another sense than the course's (waste recycling for a recycle
      // stream): a keyword match, not a resource for this connection
      if (item?.same_sense === false) return null;
      const usefulness = asCleanText(item?.usefulness, given);
      const evidence = verifiedQuote(cleanQuote(item?.evidence), document);
      // direct only when the verified sentence names the course's concept in the document's own
      // words, the document itself speaks of the sustainability side in its own words, and the
      // AI judges that it establishes this connection's claim for the course's situation (not
      // for another system): otherwise context at most
      const isDirect =
        item?.relevance === 'direct' &&
        item?.same_sense === true &&
        item?.establishes === true &&
        !!evidence &&
        namesConcept(evidence, item?.concept_terms) &&
        speaksOfSustainability(document, item?.sustainability_terms);
      if (!usefulness || !evidence || !hasLink(document)) return null;
      if (hasUnsupportedFigure(usefulness, [document])) return null;
      return isDirect
        ? { document, usefulness, evidence }
        : { document, usefulness, evidence, role: 'context' as const };
    })
    .filter((item: SupportingResource | null): item is SupportingResource => !!item)
    .slice(0, MAX_RESOURCES);
  const direct = resources.filter((resource: SupportingResource) => !resource.role);
  const background = resources.filter((resource: SupportingResource) => resource.role);
  if (!direct.length) return { ...unsupported, background };
  const kept = direct.map((resource: SupportingResource) => resource.document);
  const why = asCleanText(data.why, given);
  return {
    ...unsupported,
    why: why && !hasUnsupportedFigure(why, kept) && !isAboutProcess(why) ? why : idea.why,
    resources: direct,
    background
  };
};

// step 3b: one selected connection developed into one concrete, scoped change to the confirmed
// course (DESIGN.md "how course changes should be proposed"): the original element, the suggested
// adaptation and why, from the connection's own resources only. not an activity by default: the
// smallest change that fits. the teacher accepts, edits or keeps the original; nothing changes
// the course before that
export type AdaptationKind = 'objective' | 'topic' | 'teaching' | 'assessment';
export const ADAPTATION_KINDS: AdaptationKind[] = ['objective', 'topic', 'teaching', 'assessment'];
// how well the connection's resources back this change, as judged by the AI and checked by code:
// strong only with a sentence of a cited resource found word for word; without a cited resource,
// never more than 'none'
export type AdaptationSupport = 'strong' | 'partial' | 'none';

// a resource the change relies on, with the sentence of it that backs the change (checked word
// for word), when the AI gave one
export type ProposalResource = SupportingResource & { quote: string | null };

// optional pedagogical notes for the teacher, attached to a proposed change and separate from it:
// never part of the syllabus change, never exported or inserted. each is null when it would add
// nothing concrete
export interface AdaptationGuidance {
  // what students could do thanks to the change (an observable verb), not a new course objective
  learning: string | null;
  // at most one GreenComp competence the change genuinely develops, and how
  greencomp: { id: GreenCompId; how: string } | null;
  // a teaching approach in one sentence (not an activity)
  teaching: string | null;
  // how the teacher might check that learning (not a change to assessment rules)
  check: string | null;
}

export interface AdaptationProposal {
  kind: AdaptationKind;
  // the course element as the teacher confirmed it; null when the change only adds something
  original: string | null;
  suggested: string;
  why: string;
  support: AdaptationSupport;
  // the connection's resources the change relies on
  resources: ProposalResource[];
  guidance: AdaptationGuidance;
  // what the independent check of its claims found (absent before the check)
  checks?: ProposalChecks;
}

// a second reading of a proposed change, claim by claim, against its resources: a quotation that
// exists is not proof that the claim is right
export interface ProposalChecks {
  // 'unchecked': the check could not be made (technical failure); the change is never strong then
  status: 'checked' | 'unchecked';
  // the claims found not established by the resources, or wrong, in a sentence for the teacher
  problems: string[];
  // names in the change (a person, a substance, an acronym) that neither a direct resource nor
  // the course contains
  unbackedNames: string[];
}

const ADAPTATION: Record<ReadingLanguage, string> = {
  fr: `Tu aides un·e enseignant·e à adapter son cours, sans le réécrire. Son cours, tel qu'il l'a confirmé :
{course}

Il ou elle a choisi ce lien avec la durabilité :
Titre : {title}
Partie concernée : {anchor}
Pourquoi : {why}

Propose UNE seule modification concrète et limitée du cours pour intégrer ce lien, du type le plus adapté :
- "objective" : reformuler un objectif d'apprentissage existant, seulement si le lien change vraiment ce que les étudiant·e·s apprennent ou font, et jamais si le cours n'a pas d'objectif explicite ;
- "topic" : ajouter un point ou un exemple précis à un thème existant ;
- "teaching" : un ajustement de l'enseignement dans un thème existant (un cas, un exemple, une question de discussion), pas une activité complète ;
- "assessment" : un petit ajustement de l'évaluation.
Choisis la plus petite modification qui suffit. N'invente aucune séance, aucun objectif, aucune évaluation qui n'existe pas dans le cours.

Les documents fournis (Doc 1 à Doc {count}) sont les ressources WeLearn de ce lien ; la première ligne de chacun indique sa source. Appuie-toi seulement sur ce qu'ils disent vraiment. Distingue les mécanismes : par exemple, l'effet des prix de l'énergie sur l'inflation n'est pas le coût des pollutions. Tout exemple, cas ou fait précis de "suggested" doit venir d'un document cité : recopie dans "evidence" la phrase du document qui l'appuie, mot pour mot. Rapporte fidèlement ce que dit le document et n'en tire aucune conclusion qu'il n'énonce pas (par exemple, un coût pour l'économie n'est pas une baisse du PIB). Si aucun document n'appuie un exemple précis, propose une modification plus générale. Si les documents ne soutiennent pas directement la modification, dis-le avec "support". La première ligne de chaque document indique s'il appuie directement ce lien ou s'il ne donne que du contexte. Un document de contexte peut situer la modification mais n'appuie aucun exemple, cas, résultat ou affirmation technique précise : si seuls des documents de contexte conviennent, propose une modification générale, sans exemple technique, et indique au plus "partial". Une phrase présente dans un document ne suffit pas : le document doit vraiment soutenir la modification précise proposée, pour cette partie du cours. Un résultat obtenu sur un système artificiel, expérimental ou particulier n'établit pas le fonctionnement général ou naturel : n'en fais pas un fait général du cours. Ne nomme aucune personne, œuvre, organisation, substance ou molécule qu'un document d'appui direct ne nomme pas. N'écris rien qui soit faux dans cette discipline.{feedback}

En plus de cette modification, et sans la changer, donne des repères pédagogiques facultatifs pour l'enseignant·e dans "guidance" (null pour tout élément qui n'apporterait rien de concret) :
- "learning" : ce que les étudiant·e·s pourront faire grâce à cette modification, en une phrase courte (25 mots au plus) qui commence par un verbe d'action observable à l'infinitif, avec une majuscule (Expliquer, Comparer, Analyser, Évaluer…), au niveau du cours. Ce n'est pas un nouvel objectif du cours.
- "greencomp" : au plus une compétence GreenComp (un résultat d'apprentissage, pas une méthode). Pour la choisir, pars de ce que les étudiant·e·s font concrètement avec cette modification (par exemple interroger une donnée ou un argument, formuler un problème, relier des éléments qui interagissent, imaginer des futurs, relier des disciplines, réfléchir à des valeurs, agir avec d'autres) et choisis la compétence dont la définition ci-dessous décrit le mieux ce processus. Aucune compétence n'est à privilégier : ne choisis pas une compétence parce qu'elle s'applique à presque tout sujet de durabilité. Si aucune n'est clairement justifiée par ce que font les étudiant·e·s, mets null. "how" explique ce lien précis en une phrase. Compétences :
{greencomp}
- "teaching" : une idée d'approche pédagogique en une seule phrase courte (25 mots au plus), par exemple une courte discussion de cas ou une comparaison, pas une activité complète.
- "check" : en une seule phrase courte (25 mots au plus), comment l'enseignant·e pourrait vérifier que les étudiant·e·s y sont parvenus, sans changer les modalités, les coefficients ni le calendrier d'évaluation.

Ne réponds qu'avec un objet JSON, sans texte avant ou après, sans balise de code, sans lien :
{"kind": "objective"|"topic"|"teaching"|"assessment", "original": string|null (copie exacte de l'objectif, du thème ou de la séance du cours concerné ; null si tu ne sais pas où la modification se place), "suggested": string (la modification proposée, deux phrases au plus ; pour "objective", l'objectif reformulé en entier), "why": string (une ou deux phrases courtes : ce que cette partie du cours enseigne déjà, et ce que la modification permettrait aux étudiant·e·s de mieux comprendre ou faire ; pas de formule générale, et ne parle ni de toi, ni de l'enseignant·e, ni des documents, ni « du lien choisi »), "documents": number[] (les documents sur lesquels elle s'appuie), "evidence": [{"document": number, "quote": string (une phrase recopiée mot pour mot du document, qui appuie la modification)}], "support": "strong"|"partial"|"none" (strong : les documents soutiennent directement la modification ; partial : ils n'en donnent que le contexte ; none : ils ne la soutiennent pas), "guidance": {"learning": string|null, "greencomp": {"id": string, "how": string}|null, "teaching": string|null, "check": string|null}}
N'avance aucun chiffre qui ne figure pas mot pour mot dans un document cité.`,
  en: `You help a teacher adapt their course, without rewriting it. Their course, as they confirmed it:
{course}

They chose this sustainability connection:
Title: {title}
Part concerned: {anchor}
Why: {why}

Suggest ONE concrete, limited change to the course to bring in this connection, of the most fitting kind:
- "objective": reword an existing learning objective, only if the connection genuinely changes what students learn or do, and never if the course states no learning objectives;
- "topic": add a specific point or example to an existing topic;
- "teaching": a teaching adjustment within an existing topic (a case, an example, a discussion question), not a full activity;
- "assessment": a small adjustment to assessment.
Choose the smallest change that is enough. Do not invent any session, objective or assessment that is not in the course.

The provided documents (Doc 1 to Doc {count}) are this connection's WeLearn resources; the first line of each gives its source. Rely only on what they actually say. Keep mechanisms apart: for example, the effect of energy prices on inflation is not the cost of pollution. Every specific example, case or fact in "suggested" must come from a cited document: copy into "evidence" the document's sentence that backs it, word for word. Report faithfully what the document says and draw no conclusion it does not state (for example, a cost to the economy is not a fall in GDP). If no document backs a specific example, suggest a more general change. If the documents do not directly support the change, say so with "support". Each document's first line says whether it directly supports this connection or only gives context. A context document may frame the change but backs no specific example, case, result or technical claim: if only context documents fit, suggest a general change without a technical example, and give "partial" at most. A sentence present in a document is not enough: the document must actually support the specific change proposed, for this part of the course. A result obtained on an artificial, experimental or particular system does not establish how the general or natural process works: do not turn it into a general fact of the course. Name no person, work, organisation, substance or molecule that no direct-support document names. Write nothing that is wrong in this discipline.{feedback}

In addition to this change, and without altering it, give optional pedagogical notes for the teacher in "guidance" (null for any item that would add nothing concrete):
- "learning": what students will be able to do thanks to this change, in one short sentence (25 words at most) starting with a capitalised observable action verb (Explain, Compare, Analyse, Evaluate…), at the course's level. It is not a new course objective.
- "greencomp": at most one GreenComp competence (a learning outcome, not a method). To choose it, start from what students concretely do with this change (for example question a figure or an argument, frame a problem, relate interacting elements, imagine futures, link disciplines, reflect on values, act with others) and choose the competence whose definition below best describes that process. No competence is preferred: do not pick one because it applies to almost any sustainability topic. If none is clearly justified by what students do, use null. "how" explains this specific link in one sentence. Competences:
{greencomp}
- "teaching": a teaching approach in one short sentence (25 words at most), for example a short case discussion or a comparison, not a full activity.
- "check": in one short sentence (25 words at most), how the teacher could check that students achieved it, without changing assessment rules, weights or schedule.

Answer only with a JSON object, with no text before or after, no code fence and no link:
{"kind": "objective"|"topic"|"teaching"|"assessment", "original": string|null (exact copy of the course objective, topic or session concerned; null if you do not know where the change belongs), "suggested": string (the proposed change, two sentences at most; for "objective", the full reworded objective), "why": string (one or two short sentences: what this part of the course already teaches, and what the change would let students better understand or do; no generic phrase, and do not mention yourself, the teacher, the documents or "the chosen connection"), "documents": number[] (the documents it relies on), "evidence": [{"document": number, "quote": string (one sentence copied word for word from the document, backing the change)}], "support": "strong"|"partial"|"none" (strong: the documents directly support the change; partial: they only give its context; none: they do not support it), "guidance": {"learning": string|null, "greencomp": {"id": string, "how": string}|null, "teaching": string|null, "check": string|null}}
Do not state any figure that is not written word for word in a cited document.`
};

const withRole = (resource: SupportingResource, lang: ReadingLanguage): Document => {
  const role =
    lang === 'fr'
      ? resource.role
        ? 'Rôle : contexte seulement'
        : 'Rôle : appui direct'
      : resource.role
        ? 'Role: context only'
        : 'Role: direct support';
  return {
    ...resource.document,
    payload: {
      ...resource.document.payload,
      slice_content: `${role}\n${resource.document.payload.slice_content}`
    }
  };
};

// a first proposal whose claims the check found not established or wrong: asked again once,
// with what was wrong, so the claim is removed rather than kept
const FEEDBACK: Record<ReadingLanguage, (problems: string[]) => string> = {
  fr: (problems) =>
    `\n\nUne première proposition a été vérifiée. Ces affirmations n'étaient pas établies par les documents, ou étaient fausses :\n${problems.map((p) => `- ${p}`).join('\n')}\nNe les reprends pas : retire-les, ou propose une modification plus générale.`,
  en: (problems) =>
    `\n\nA first proposal was checked. These claims were not established by the documents, or were wrong:\n${problems.map((p) => `- ${p}`).join('\n')}\nDo not repeat them: remove them, or suggest a more general change.`
};

export const buildAdaptationRequest = (
  course: ConfirmedCourse,
  connection: { title: string; anchor: string | null; why: string },
  resources: SupportingResource[],
  lang: ReadingLanguage,
  problems: string[] = []
) => {
  // each document says its role: direct support for the connection, or context only
  const documents = resources.map((resource) => withRole(resource, lang));
  return request(
    fill(ADAPTATION[lang], {
      course: courseBlock(course, lang),
      title: connection.title,
      anchor: connection.anchor || (lang === 'fr' ? 'l’ensemble du cours' : 'the whole course'),
      why: connection.why,
      count: String(Math.min(documents.length, MAX_SOURCES)),
      greencomp: greenCompForPrompt(lang),
      feedback: problems.length ? FEEDBACK[lang](problems) : ''
    }),
    // without resources the endpoint still needs a source: the course itself
    documents.length ? documents.map(withSourceLine) : buildIdeasRequest(course, lang).sources,
    lang
  );
};

const SUPPORT: AdaptationSupport[] = ['strong', 'partial', 'none'];

// null when the answer cannot be used (asked again once, then reported). the original must be a
// part of the confirmed course, as the teacher wrote it: otherwise the change is shown as an
// addition, never as a change to something the course does not contain. a figure the cited
// resources do not contain makes the answer unusable. "strongly supported" needs a sentence of a
// cited resource that backs the change, found word for word in it
// a topic of the course and its subtopics, as confirmed in step 2
export interface CourseTopicParts {
  value: string;
  subtopics?: string[];
}

// one course part names the other (the same part, worded more or less fully)
const isSamePlace = (a: string, b: string) => {
  const [x, y] = [normalise(a), normalise(b)];
  return !!x && !!y && (x.includes(y) || y.includes(x));
};

export const parseAdaptation = (
  answer: string,
  courseParts: string[],
  resources: SupportingResource[],
  // the course part the connection itself was tied to (already checked against the course)
  anchor: string | null = null,
  // the course's topics with their subtopics: a topic is a broader level of its subtopics
  topics: CourseTopicParts[] = []
): AdaptationProposal | null => {
  const data = parseJsonObject(answer);
  const given = resources.slice(0, MAX_SOURCES);
  const documents = given.map((resource) => resource.document);
  const suggested = asCleanText(data?.suggested, documents);
  const why = asCleanText(data?.why, documents);
  if (!data || !suggested || !why || !ADAPTATION_KINDS.includes(data.kind)) return null;
  // an addition to a topic or a teaching adjustment that names no course part sits in the part
  // its connection is tied to; a revised objective or an assessment change never borrows it
  // the AI's part is kept when it is the connection's own part or a broader level of it (the
  // topic that contains it); another part of the course (a sibling subtopic, another session) is
  // not followed: the change stays with the connection the teacher chose
  const named = partOfCourse(asText(data.original), courseParts);
  const linked = partOfCourse(anchor, courseParts);
  const isWithLink = (part: string) =>
    !linked ||
    isSamePlace(part, linked) ||
    topics.some(
      ({ value, subtopics }) =>
        value === part && (subtopics || []).some((subtopic) => isSamePlace(subtopic, linked))
    );
  const original = ['topic', 'teaching'].includes(data.kind)
    ? named && isWithLink(named)
      ? named
      : linked || named
    : named;
  // a revised objective revises one the course has: not a new objective written by the AI
  if (data.kind === 'objective' && !original) return null;
  const isGiven = (n: unknown): n is number =>
    Number.isInteger(n) && (n as number) >= 1 && (n as number) <= given.length;
  // each quoted sentence must be in the document it is quoted from
  const quotes = new Map<number, string>();
  (Array.isArray(data.evidence) ? data.evidence : []).forEach((item: any) => {
    if (!isGiven(item?.document) || quotes.has(item.document)) return;
    const quote = verifiedQuote(cleanQuote(item?.quote), given[item.document - 1].document);
    if (quote) {
      quotes.set(item.document, quote);
    }
  });
  const numbers = [
    ...new Set<unknown>([
      ...(Array.isArray(data.documents) ? data.documents : []),
      ...quotes.keys()
    ])
  ].filter(isGiven);
  const cited: ProposalResource[] = numbers.map((n) => ({
    ...given[n - 1],
    quote: quotes.get(n) || null
  }));
  if (
    hasUnsupportedFigure(
      `${suggested} ${why}`,
      cited.map((resource) => resource.document)
    )
  ) {
    return null;
  }
  // strong only with a verified sentence from a resource that directly supports the connection:
  // context resources, or a quote alone, never make a change strongly supported
  const claimed: AdaptationSupport = SUPPORT.includes(data.support) ? data.support : 'none';
  const isDirectlyBacked = cited.some((resource) => !resource.role && resource.quote);
  const support: AdaptationSupport = !cited.length
    ? 'none'
    : claimed === 'strong' && !isDirectlyBacked
      ? 'partial'
      : claimed;
  // the notes: each dropped when empty or stating a figure the cited resources do not contain;
  // a competence only when it is one of the twelve and its link is explained
  const notes = data.guidance && typeof data.guidance === 'object' ? data.guidance : {};
  const note = (value: unknown) => {
    const text = asCleanText(value, documents);
    return text &&
      !hasUnsupportedFigure(
        text,
        cited.map((resource) => resource.document)
      )
      ? tidyNote(text)
      : null;
  };
  const competence = notes.greencomp && typeof notes.greencomp === 'object' ? notes.greencomp : {};
  const how = note(competence.how);
  return {
    kind: data.kind,
    original,
    suggested,
    why,
    support,
    resources: cited,
    guidance: {
      learning: note(notes.learning),
      greencomp: isGreenCompId(competence.id) && how ? { id: competence.id, how } : null,
      teaching: note(notes.teaching),
      check: note(notes.check)
    }
  };
};

// the check of a proposed change: each specific claim (a fact, a mechanism, a causal relation, a
// named example) judged against the resources, and against the discipline itself. asked
// separately from the proposal, so the AI reads it as a text to check, not as its own work
const VERIFICATION: Record<ReadingLanguage, string> = {
  fr: `Tu vérifies une modification proposée pour un cours universitaire, avant qu'un·e enseignant·e la voie. Tu ne l'as pas écrite. Le cours :
{course}

Modification proposée : {suggested}
Pourquoi : {why}

Les documents fournis (Doc 1 à Doc {count}) sont les ressources de cette modification ; la première ligne de chacun dit s'il est un appui direct ou seulement du contexte.

Relève seulement les affirmations écrites dans la modification proposée ci-dessus, jamais celles des documents : chaque "claim" reprend un passage de la modification. Relève chaque affirmation précise de la modification : un fait scientifique ou technique, un mécanisme, une relation de cause, un exemple nommé (une personne, une œuvre, un lieu, une organisation, une substance, un cas), un résultat. Ne relève pas l'intention générale (par exemple « discuter de X avec les étudiant·e·s »). Pour chacune :
- "established" : un document d'appui direct l'énonce, pour la même situation que le cours (recopie cette phrase mot pour mot dans "quote") ;
- "not_established" : aucun document ne l'énonce ainsi : il la mentionne seulement, ou l'énonce pour un autre système (un système artificiel, expérimental ou particulier n'établit pas le fonctionnement général ou naturel), ou seul un document de contexte en parle, ou les documents disent quelque chose de plus faible ;
- "incorrect" : elle est fausse dans cette discipline, quoi que disent les documents (sers-toi de ta connaissance de la discipline).
Juge aussi "fit" : "genuine" si la modification utilise un concept de ce cours pour une vraie question de durabilité dans cette discipline ; "forced" si elle repose sur une analogie, un mot qui a un autre sens dans la discipline, ou un lien que la discipline n'établit pas.

Ne réponds qu'avec un objet JSON, sans texte avant ou après, sans balise de code, sans lien :
{"claims": [{"claim": string (court), "status": "established"|"not_established"|"incorrect", "document": number|null, "quote": string|null, "problem": string|null (pour une affirmation non établie ou fausse : ce qui ne va pas, en une phrase courte pour l'enseignant·e)}], "fit": "genuine"|"forced", "fit_problem": string|null}`,
  en: `You check a change proposed for a university course, before a teacher sees it. You did not write it. The course:
{course}

Proposed change: {suggested}
Why: {why}

The provided documents (Doc 1 to Doc {count}) are this change's resources; the first line of each says whether it is direct support or context only.

List only the claims written in the proposed change above, never those of the documents: each "claim" restates a passage of the change. List every specific claim of the change: a scientific or technical fact, a mechanism, a causal relation, a named example (a person, a work, a place, an organisation, a substance, a case), a result. Do not list the general intention (for example "discuss X with students"). For each:
- "established": a direct-support document states it, for the same situation as the course (copy that sentence word for word into "quote");
- "not_established": no document states it as such: it only mentions it, or states it for another system (an artificial, experimental or particular system does not establish how the general or natural process works), or only a context document deals with it, or the documents say something weaker;
- "incorrect": it is wrong in this discipline, whatever the documents say (use your knowledge of the discipline).
Also judge "fit": "genuine" if the change uses a concept of this course for a real sustainability issue in this discipline; "forced" if it rests on an analogy, a word that means something else in the discipline, or a link the discipline does not establish.

Answer only with a JSON object, with no text before or after, no code fence and no link:
{"claims": [{"claim": string (short), "status": "established"|"not_established"|"incorrect", "document": number|null, "quote": string|null, "problem": string|null (for a claim not established or wrong: what is wrong, in one short sentence for the teacher)}], "fit": "genuine"|"forced", "fit_problem": string|null}`
};

export const buildVerificationRequest = (
  course: ConfirmedCourse,
  proposal: { suggested: string; why: string },
  resources: SupportingResource[],
  lang: ReadingLanguage
) =>
  request(
    fill(VERIFICATION[lang], {
      course: courseBlock(course, lang),
      suggested: proposal.suggested,
      why: proposal.why,
      count: String(Math.min(resources.length, MAX_SOURCES))
    }),
    resources.map((resource) => withSourceLine(withRole(resource, lang))),
    lang
  );

export interface Verification {
  // the claims found not established or wrong, for the teacher
  problems: string[];
  hasIncorrect: boolean;
  hasUnestablished: boolean;
  isForced: boolean;
}

// null when unusable. a claim the AI calls established counts only with a sentence of a direct
// resource found word for word in it; otherwise it is not established
// a claim restates the change: most of its content words are in the change's text (a claim taken
// from the documents instead is not the change's, and is left out)
const MIN_CLAIM_WORD = 5;
export const restatesChange = (claim: string, change: string) => {
  const text = wordsOf(change).join(' ');
  const words = wordsOf(claim).filter((word) => word.length >= MIN_CLAIM_WORD);
  return !!words.length && words.filter((word) => text.includes(word)).length * 2 >= words.length;
};
// the teacher reads a few problems, not a list
export const MAX_PROBLEMS = 4;

export const parseVerification = (
  answer: string,
  resources: SupportingResource[],
  // the change's own text (suggested and why): only its claims are judged
  change = ''
): Verification | null => {
  const data = parseJsonObject(answer);
  if (!data || !Array.isArray(data.claims)) return null;
  const given = resources.slice(0, MAX_SOURCES);
  const documents = given.map((resource) => resource.document);
  const problems: string[] = [];
  let hasIncorrect = false;
  let hasUnestablished = false;
  data.claims.forEach((item: any) => {
    const claim = asCleanText(item?.claim, documents);
    if (!claim || (change && !restatesChange(claim, change))) return;
    const resource = Number.isInteger(item?.document) ? given[item.document - 1] : undefined;
    const isBacked =
      item?.status === 'established' &&
      !!resource &&
      !resource.role &&
      !!verifiedQuote(cleanQuote(item?.quote), resource.document);
    if (isBacked) return;
    if (item?.status === 'incorrect') hasIncorrect = true;
    else hasUnestablished = true;
    problems.push(tidyNote(asCleanText(item?.problem, documents) || claim));
  });
  const isForced = data.fit === 'forced';
  const fitProblem = asCleanText(data.fit_problem, documents);
  if (isForced && fitProblem) problems.unshift(tidyNote(fitProblem));
  return { problems: problems.slice(0, MAX_PROBLEMS), hasIncorrect, hasUnestablished, isForced };
};

// names a change states: acronyms and formulas (NADH, CO2, LCA) and capitalised words inside a
// sentence (Rauschenberg). sustainability's own acronyms, the most common formulas and the
// capitalised common nouns of astronomy are left aside
const COMMON_NAMES = new Set([
  'sdg',
  'sdgs',
  'odd',
  'greencomp',
  'co2',
  'h2o',
  'o2',
  'ch4',
  'earth',
  'sun',
  'moon',
  'terre',
  'soleil',
  'lune'
]);
// "CO₂" is "CO2"
const SUBSCRIPTS = '₀₁₂₃₄₅₆₇₈₉';
const plainDigits = (text: string) =>
  text.replace(/[₀-₉]/g, (digit) => String(SUBSCRIPTS.indexOf(digit)));
export const namesIn = (text: string) => {
  const names = new Set<string>();
  // a sentence may end inside quotation marks ("…?' Use")
  text.split(/(?<=[.!?:;]["'’”»)]*)\s+/).forEach((sentence) => {
    const words = sentence.match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu) || [];
    words.forEach((word, index) => {
      // a compound ("Earth-based") is named by its first part
      const head = plainDigits(word).split('-')[0];
      const capitals = (head.match(/\p{Lu}/gu) || []).length;
      const isAcronym = capitals >= 2 || (capitals >= 1 && /\d/.test(head));
      const isProperName = index > 0 && /^\p{Lu}\p{Ll}/u.test(head);
      if ((isAcronym || isProperName) && !COMMON_NAMES.has(head.toLowerCase())) names.add(word);
    });
  });
  return [...names];
};

// the names of a change that neither its direct resources nor the course contain: a named example
// needs a resource that directly supports it; a context resource does not count
export const unbackedNames = (
  text: string,
  resources: SupportingResource[],
  course: ConfirmedCourse
) => {
  const direct = resourceText(
    resources.filter((resource) => !resource.role).map((resource) => resource.document)
  );
  const known = plainDigits(`${direct} ${normalise(courseBlock(course, 'en'))}`);
  // a name written in another language than the resource ("Australie", "Australia") is found by
  // its stem: all but its last three letters, five at least
  const MIN_STEM = 5;
  return namesIn(text).filter((name) => {
    const wanted = plainDigits(normalise(name));
    const stem =
      wanted.length > MIN_STEM ? wanted.slice(0, Math.max(MIN_STEM, wanted.length - 3)) : wanted;
    return !known.includes(stem);
  });
};

const RANK: AdaptationSupport[] = ['none', 'partial', 'strong'];
const atMost = (support: AdaptationSupport, limit: AdaptationSupport) =>
  RANK.indexOf(support) <= RANK.indexOf(limit) ? support : limit;

// a proposal with what its check found. never raised: a wrong or forced claim makes it
// unsupported; a claim not established, an unbacked name or a check that could not run makes it
// partly supported at most. its text is left as it is, for the teacher to judge
export const withChecks = (
  proposal: AdaptationProposal,
  verification: Verification | null,
  resources: SupportingResource[],
  course: ConfirmedCourse
): AdaptationProposal => {
  const names = unbackedNames(proposal.suggested, resources, course);
  // a change judged forced keeps some support only when a direct resource backs it with a
  // verified sentence: the check's second opinion is not always right (linear systems for power
  // flows, conditional probabilities for climate attribution were both called forced)
  const isDirectlyQuoted = proposal.resources.some((resource) => !resource.role && resource.quote);
  const limit: AdaptationSupport = !verification
    ? 'partial'
    : verification.hasIncorrect || (verification.isForced && !isDirectlyQuoted)
      ? 'none'
      : verification.isForced || verification.hasUnestablished || names.length
        ? 'partial'
        : 'strong';
  return {
    ...proposal,
    support: atMost(proposal.support, limit),
    checks: {
      status: verification ? 'checked' : 'unchecked',
      problems: verification?.problems || [],
      unbackedNames: names
    }
  };
};

// what a course part is about, and where it sits in the course when the outline says so. a session
// line ("Semaine du 15/12 – CM7 « Évaluation des performances »") gives both: its subject (the
// quoted title, or the title) and its placement (the rest: "CM7 · Semaine du 15/12"). a topic
// gets a placement only from the one session that names it; an objective never gets one
export interface CoursePlace {
  kind: 'topic' | 'session' | 'objective' | 'competency';
  // its number among the course's objectives or competencies
  index: number;
  subject: string;
  placement: string | null;
  // the course part as the teacher confirmed it
  full: string;
}

const splitSession = (line: string) => {
  const cut = line.indexOf(' – ');
  const label = cut >= 0 ? line.slice(0, cut).trim() : null;
  const title = cut >= 0 ? line.slice(cut + 3).trim() : line.trim();
  const quoted = title.match(/[«"“]\s*([^»"”]+?)\s*[»"”]/);
  const subject = quoted ? quoted[1] : title;
  const rest = quoted
    ? title
        .replace(quoted[0], '')
        .replace(/[\s:–-]+$/, '')
        .trim()
    : '';
  const placement = label ? [rest, label].filter(Boolean).join(' · ') : null;
  return { subject: subject || line, placement };
};

export const placeInCourse = (
  anchor: string | null,
  course: { topics: string[]; objectives: string[]; competencies: string[]; sessions: string[] }
): CoursePlace | null => {
  if (!anchor) return null;
  const objective = course.objectives.indexOf(anchor);
  if (objective >= 0) {
    return { kind: 'objective', index: objective, subject: anchor, placement: null, full: anchor };
  }
  const competency = course.competencies.indexOf(anchor);
  if (competency >= 0) {
    return {
      kind: 'competency',
      index: competency,
      subject: anchor,
      placement: null,
      full: anchor
    };
  }
  if (course.sessions.includes(anchor) && !course.topics.includes(anchor)) {
    return { kind: 'session', index: 0, full: anchor, ...splitSession(anchor) };
  }
  // a topic: placed only when exactly one session of the outline names it
  const wanted = normalise(anchor);
  const sessions = course.sessions.filter((line) => normalise(line).includes(wanted));
  const placement = sessions.length === 1 ? splitSession(sessions[0]).placement : null;
  return { kind: 'topic', index: 0, subject: anchor, placement, full: anchor };
};
