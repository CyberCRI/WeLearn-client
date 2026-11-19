import i18n from '@/localisation/i18n';
import type { ConnectionEvidence, Document } from '@/types';
import { normalise } from '@/utils/courseCheck';
import { idToLabel } from '@/utils/strings';

// what the sustainability additions screen shows of a connection, ported from the prototype
// (esra/syllabus-improvement). the ideas, searches, judgement and checks are the API's
// (/tutor/course/connection_ideas, /tutor/course/connection_evidence)

// where a connection stands: its resources still being looked for, or the API's judgement; a
// call that failed is unchecked, like a judgement the API could not make
export type EvidenceState = 'pending' | ConnectionEvidence['status'];
export const evidenceState = ({
  evidence,
  hasCheckFailed
}: {
  evidence: ConnectionEvidence | null;
  hasCheckFailed: boolean;
}): EvidenceState => (hasCheckFailed ? 'unchecked' : (evidence?.status ?? 'pending'));

// the original source rather than a catalogue page: the publisher's DOI when there is one, opened
// at the verified passage (a text fragment, highlighted by most browsers)
export const sourceLink = (doc: Document, passage?: string) => {
  const doi = (doc.payload.document_details as { doi?: unknown } | undefined)?.doi;
  const base = typeof doi === 'string' && /^https?:\/\//.test(doi) ? doi : doc.payload.document_url;
  if (!passage) return base;
  const start = passage.split(/\s+/).slice(0, 8).join(' ');
  return `${base}#:~:text=${encodeURIComponent(start).replace(/-/g, '%2D')}`;
};

// where a source comes from, in a few words: a journal or publisher, else the collection
// ("Wikipedia")
export const sourceName = (doc: Document) => {
  const { journal, publisher } = doc.payload.document_details || {};
  const named = [journal, publisher].find((v) => typeof v === 'string' && v);
  if (named) return named;
  const corpus = doc.payload.document_corpus;
  const key = `corpus.${corpus}`;
  return i18n.global.te(key) ? i18n.global.t(key) : idToLabel(corpus);
};

// where a connection sits in the course, as the teacher sees it. a session line ("Semaine du
// 15/12 – CM7 « Évaluation des performances »") gives both: its subject (the quoted title, or the
// title) and its placement (the rest: "CM7 · Semaine du 15/12"). a topic gets a placement only
// from the one session that names it; an objective never gets one
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
