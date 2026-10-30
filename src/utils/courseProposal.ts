import { normalise, parseJsonObject, type ReadingLanguage } from '@/utils/courseReading';
import type { ConnectionIdea } from '@/utils/connections';

// "create a course from scratch": the teacher's short brief goes to the question-answering
// endpoint (/qna/chat/answer, the brief as the only source), which drafts a concise course
// proposal with sustainability built in. everything returned is WeLearn's proposal, shown as
// such; the sustainability opportunities become the ideas the connections step finds WeLearn
// resources for. ponytail: a stand-in for a dedicated endpoint, like the reading

export interface CourseBrief {
  idea: string;
  disciplineLevel: string;
  format: string;
  goals: string;
}

export interface CourseProposal {
  title: string;
  purpose: string | null;
  discipline: string | null;
  level: string | null;
  objectives: string[];
  topics: string[];
  sessions: string[];
  activities: string[];
  assessment: string[];
  opportunities: ConnectionIdea[];
}

const LIMITS = { objectives: 6, topics: 8, sessions: 16, activities: 4, assessment: 3 };
const MAX_OPPORTUNITIES = 3;

const briefText = (brief: CourseBrief, lang: ReadingLanguage) => {
  const fr = lang === 'fr';
  return [
    [fr ? 'Idée de cours' : 'Course idea', brief.idea],
    [fr ? 'Discipline et niveau' : 'Discipline and level', brief.disciplineLevel],
    [fr ? 'Durée ou format' : 'Duration or format', brief.format],
    [fr ? 'Objectifs ou intérêts en durabilité' : 'Goals or sustainability interests', brief.goals]
  ]
    .filter(([, value]) => value.trim())
    .map(([label, value]) => `${label} : ${value.trim()}`)
    .join('\n');
};

const INSTRUCTIONS: Record<ReadingLanguage, string> = {
  fr: `Tu aides un·e enseignant·e de l'enseignement supérieur à concevoir un nouveau cours. Sa demande est le document fourni (Doc 1).

Propose un cours concis et cohérent, fidèle à sa demande et à sa discipline :
- un titre et sa finalité (2 phrases au plus) ;
- 4 à 6 objectifs d'apprentissage observables, adaptés au niveau indiqué ;
- 5 à 8 thèmes ou contenus principaux ;
- une structure en séances adaptée à la durée indiquée (si aucune durée n'est donnée, 6 à 8 séances), une ligne par séance ;
- 2 à 4 activités d'apprentissage variées, sans imposer une méthode unique ;
- 1 à 3 modalités d'évaluation alignées sur les objectifs ;
- 1 à 3 occasions d'intégrer la durabilité là où elle approfondit vraiment le contenu disciplinaire (sans forcer d'ODD, sans changer la finalité du cours), chacune rattachée à un thème ou une séance du cours, avec deux questions de recherche précises pour trouver des ressources (la première en français, la seconde en anglais, formulée autrement).
Pas de chiffres, de statistiques ni de références : des ressources seront cherchées ensuite.

Ne réponds qu'avec un objet JSON, sans texte avant ou après, sans balise de code, sans lien :
{"title": string, "purpose": string, "discipline": string|null, "level": string|null, "objectives": string[], "topics": string[], "sessions": string[], "activities": string[], "assessment": string[], "sustainability": [{"title": string (court), "anchor": string (copie exacte d'un thème ou d'une séance proposés), "why": string (une phrase), "how": string (une phrase), "queries": [string, string]}]}`,
  en: `You help a university teacher design a new course. Their request is the provided document (Doc 1).

Suggest a concise, coherent course, faithful to the request and its discipline:
- a title and its purpose (2 sentences at most);
- 4 to 6 observable learning objectives suited to the given level;
- 5 to 8 main topics or contents;
- a session structure suited to the given duration (if none is given, 6 to 8 sessions), one line per session;
- 2 to 4 varied learning activities, without imposing a single method;
- 1 to 3 assessment approaches aligned with the objectives;
- 1 to 3 opportunities to integrate sustainability where it genuinely deepens the disciplinary content (no forced SDGs, no change to the course's purpose), each tied to a topic or session of the course, with two precise search questions to find resources (the first in English, the second reworded differently).
No figures, statistics or references: resources will be searched afterwards.

Answer only with a JSON object, with no text before or after, no code fence and no link:
{"title": string, "purpose": string, "discipline": string|null, "level": string|null, "objectives": string[], "topics": string[], "sessions": string[], "activities": string[], "assessment": string[], "sustainability": [{"title": string (short), "anchor": string (exact copy of a proposed topic or session), "why": string (one sentence), "how": string (one sentence), "queries": [string, string]}]}`
};

export const buildProposalRequest = (brief: CourseBrief, lang: ReadingLanguage) => ({
  query: INSTRUCTIONS[lang],
  history: [],
  lang,
  sources: [
    {
      score: 1,
      payload: {
        document_corpus: 'brief',
        document_desc: '',
        document_details: {},
        document_id: crypto.randomUUID(),
        document_lang: lang,
        document_sdg: [],
        document_title: lang === 'fr' ? 'Demande de l’enseignant·e' : 'Teacher’s request',
        // ponytail: the endpoint requires a url; this one never resolves and is never shown
        document_url: 'https://example.invalid/brief',
        slice_content: briefText(brief, lang),
        slice_sdg: null
      }
    }
  ]
});

// the endpoint's own markup (html citations, "Doc 1", bold marks) is removed from every text
const clean = (value: unknown): string | null => {
  if (typeof value !== 'string') return null;
  const text = value
    .replace(/<[^>]+>/g, '')
    .replace(/\(?\[?\bDoc(?:ument)?\s*\d+\]?\)?/gi, '')
    .replace(/\*+/g, '')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\s+([.,;:)])/g, (match, mark) => (/[;:]/.test(mark) ? ` ${mark}` : mark))
    .trim();
  return text || null;
};

const list = (value: unknown, max: number) =>
  (Array.isArray(value) ? value : [])
    .map(clean)
    .filter((item): item is string => !!item)
    .slice(0, max);

// null when the answer is not the expected structure; a proposal needs at least a title,
// objectives and topics. an opportunity keeps its place only when it is a proposed topic or
// session, and needs its search questions
export const parseProposal = (answer: string): CourseProposal | null => {
  const data = parseJsonObject(answer);
  const title = clean(data?.title);
  if (!data || !title) return null;
  const objectives = list(data.objectives, LIMITS.objectives);
  const topics = list(data.topics, LIMITS.topics);
  if (!objectives.length || !topics.length) return null;
  const sessions = list(data.sessions, LIMITS.sessions);
  const parts = [...topics, ...sessions].map(normalise);
  const opportunities = (Array.isArray(data.sustainability) ? data.sustainability : [])
    .map((item: any): ConnectionIdea | null => {
      const ideaTitle = clean(item?.title);
      const why = clean(item?.why);
      const how = clean(item?.how);
      const queries = list(item?.queries, 2);
      if (!ideaTitle || !why || !how || !queries.length) return null;
      const anchor = clean(item?.anchor);
      const isPart =
        !!anchor &&
        parts.some((part) => part.includes(normalise(anchor)) || normalise(anchor).includes(part));
      return { title: ideaTitle, anchor: isPart ? anchor : null, why, how, queries };
    })
    .filter((item: ConnectionIdea | null): item is ConnectionIdea => !!item)
    .slice(0, MAX_OPPORTUNITIES);
  return {
    title,
    purpose: clean(data.purpose),
    discipline: clean(data.discipline),
    level: clean(data.level),
    objectives,
    topics,
    sessions,
    activities: list(data.activities, LIMITS.activities),
    assessment: list(data.assessment, LIMITS.assessment),
    opportunities
  };
};
