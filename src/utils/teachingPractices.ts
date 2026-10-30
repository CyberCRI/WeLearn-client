import type { TeachingPractice } from '@/types';
import { normalise } from '@/utils/courseReading';

// the TEACH collection: real teaching practices shared by teachers and approved after review.
// ponytail: a static list until WeLearn has a service to store and review contributions; a
// practice is added here only once a teacher has shared it and agreed to its publication.
// never fill it with invented or AI-generated examples
export const TEACHING_PRACTICES: TeachingPractice[] = [];

// contributions go to the WeLearn team's contact address (the footer's "Contact us"), sent by the
// teacher from their own mail client; nothing is published without review
export const CONTRIBUTION_ADDRESS = 'welearn@learningplanetinstitute.org';

// practices whose discipline, course, topic or approach mention every word searched
export const searchPractices = (practices: TeachingPractice[], query: string) => {
  const words = query.split(/\s+/).map(normalise).filter(Boolean);
  return practices.filter((practice) => {
    const text = normalise(
      [
        practice.discipline,
        practice.course,
        practice.level,
        practice.topic,
        practice.approach
      ].join(' ')
    );
    return words.every((word) => text.includes(word));
  });
};

export interface PracticeContribution {
  discipline: string;
  course: string;
  level: string;
  topic: string;
  approach: string;
  resources: string;
  lessons: string;
  // links to the teacher's materials, one per line (a title may come before the link)
  materials: string;
}

export const emptyContribution = (): PracticeContribution => ({
  discipline: '',
  course: '',
  level: '',
  topic: '',
  approach: '',
  resources: '',
  lessons: '',
  materials: ''
});

const LINK = /https?:\/\/[^\s<>"]+/;

// the material lines: those with a web link, and those without one (to be corrected)
export const materialLinks = (text: string) => {
  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
  return {
    links: lines.filter((line) => LINK.test(line)),
    invalid: lines.filter((line) => !LINK.test(line))
  };
};

// the contribution as plain text, with the form's own labels, for the e-mail or a copy
export const contributionText = (
  contribution: PracticeContribution,
  labels: Record<keyof PracticeContribution, string>
) =>
  (Object.keys(labels) as (keyof PracticeContribution)[])
    .filter((key) => contribution[key].trim())
    .map((key) => `${labels[key]}\n${contribution[key].trim()}`)
    .join('\n\n');

export const contributionMailto = (subject: string, body: string) =>
  `mailto:${CONTRIBUTION_ADDRESS}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
