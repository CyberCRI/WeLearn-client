import {
  placeInCourse,
  type AdaptationGuidance,
  type AdaptationKind,
  type ProposalResource
} from '@/utils/connections';

// step 4 "updated syllabus": the teacher's accepted changes brought together with the course as
// they confirmed it. nothing is generated here: the course is what step 2 holds, each change is
// the wording the teacher accepted, placed where step 3b placed it. a revised objective replaces
// its original; any other change is added to the topic, session or objective it belongs to. what
// has no place yet stays apart, said as such. the uploaded document is never touched

export interface ApprovedChange {
  connectionId: number;
  // the sustainability connection it came from
  connection: string;
  kind: AdaptationKind;
  // the course part the change replaces or sits in, as the teacher confirmed it
  placement: string | null;
  // the course objective a revised objective replaces
  original: string | null;
  // the accepted wording (the teacher's own when edited)
  text: string;
  why: string;
  resources: ProposalResource[];
  // the session or activity it belongs to, when the outline names it reliably (set when assembled)
  session?: string | null;
  // the optional pedagogical notes of its proposal: never part of the change, only in the
  // pedagogical appendix when the teacher asks for it
  guidance?: AdaptationGuidance;
}

export interface CourseToUpdate {
  title: string | null;
  discipline: string | null;
  level: string | null;
  overview: string | null;
  // each topic with the syllabus line it comes from, when verified
  topics: { title: string; subtopics: string[]; source?: string | null }[];
  objectives: string[];
  competencies: string[];
  sessions: string[];
}

export interface UpdatedCourse {
  // revision: the approved change that rewords the objective, if any
  objectives: {
    text: string;
    original: string | null;
    revision?: ApprovedChange;
    added: ApprovedChange[];
  }[];
  competencies: { text: string; added: ApprovedChange[] }[];
  topics: { title: string; subtopics: string[]; added: ApprovedChange[] }[];
  sessions: { line: string; added: ApprovedChange[] }[];
  // changes whose place in the course is not known yet
  unplaced: ApprovedChange[];
}

export const buildUpdatedCourse = (
  course: CourseToUpdate,
  changes: ApprovedChange[]
): UpdatedCourse => {
  const updated: UpdatedCourse = {
    objectives: course.objectives.map((text) => ({ text, original: null, added: [] })),
    competencies: course.competencies.map((text) => ({ text, added: [] })),
    topics: course.topics.map(({ title, subtopics }) => ({ title, subtopics, added: [] })),
    sessions: course.sessions.map((line) => ({ line, added: [] })),
    unplaced: []
  };
  changes.forEach((change) => {
    const place = change.placement;
    const objective = updated.objectives.find(({ text, original }) => (original || text) === place);
    // a revised objective takes the place of the one it revises
    if (objective && change.kind === 'objective') {
      objective.original = objective.text;
      objective.text = change.text;
      objective.revision = change;
      return;
    }
    const target =
      objective ||
      updated.competencies.find(({ text }) => text === place) ||
      updated.topics.find(
        ({ title, subtopics }) => title === place || subtopics.includes(place!)
      ) ||
      updated.sessions.find(({ line }) => line === place);
    if (place && target) {
      // a topic taught in one session of the outline: that session is kept with the change
      const session =
        'subtopics' in target
          ? placeInCourse(place, {
              topics: course.topics.flatMap(({ title, subtopics }) => [title, ...subtopics]),
              objectives: course.objectives,
              competencies: course.competencies,
              sessions: course.sessions
            })?.placement || null
          : null;
      target.added.push({ ...change, session });
    } else updated.unplaced.push(change);
  });
  return updated;
};

// the changes grouped by where they belong, in the course's order; the unplaced last
export const groupChanges = (course: CourseToUpdate, changes: ApprovedChange[]) => {
  const order = [
    ...course.objectives,
    ...course.competencies,
    ...course.topics.flatMap(({ title, subtopics }) => [title, ...subtopics]),
    ...course.sessions
  ];
  const groups = new Map<string | null, ApprovedChange[]>();
  [...changes]
    .sort((a, b) => {
      const rank = (change: ApprovedChange) => {
        const index = change.placement ? order.indexOf(change.placement) : -1;
        return index < 0 ? order.length : index;
      };
      return rank(a) - rank(b);
    })
    .forEach((change) => {
      const key = change.placement && order.includes(change.placement) ? change.placement : null;
      groups.set(key, [...(groups.get(key) || []), change]);
    });
  return [...groups.entries()].map(([placement, items]) => ({ placement, changes: items }));
};

// the words a text export needs, in the syllabus's language
export interface ExportLabels {
  documentTitle: string;
  note: string;
  overview: string;
  objectives: string;
  competencies: string;
  topics: string;
  outline: string;
  toPlace: string;
  revised: string;
  added: string;
  replaces: string;
  why: string;
  sources: string;
  placement: string;
  changesTitle: string;
  placementUnknown: string;
  kinds: Record<AdaptationKind, string>;
  // said after a resource that only gives context ("context only")
  context?: string;
}

const sourcesOf = (change: ApprovedChange, labels?: ExportLabels) =>
  change.resources.map(({ document, role }) => {
    const { document_title: title, document_url: url } = document.payload;
    const source = url ? `[${title}](${url})` : title;
    return role && labels?.context ? `${source} (${labels.context})` : source;
  });

const changeLines = (change: ApprovedChange, labels: ExportLabels, indent = '') =>
  [
    `${indent}- **${labels.kinds[change.kind]} :** ${change.text}`,
    change.session ? `${indent}  - ${labels.placement} : ${change.session}` : '',
    change.resources.length
      ? `${indent}  - ${labels.sources} : ${sourcesOf(change, labels).join(' ; ')}`
      : ''
  ].filter(Boolean);

// the updated course outline as markdown (for the word export): the course as confirmed, each
// accepted change in its place and marked, then the list of changes with why and their sources
export const updatedCourseMarkdown = (
  course: CourseToUpdate,
  changes: ApprovedChange[],
  labels: ExportLabels
) => {
  const updated = buildUpdatedCourse(course, changes);
  const lines: string[] = [`# ${course.title || labels.documentTitle}`];
  const facts = [course.discipline, course.level].filter(Boolean).join(' · ');
  if (facts) lines.push(facts);
  lines.push('', `> ${labels.note}`, '');
  if (course.overview) lines.push(`## ${labels.overview}`, course.overview, '');
  if (updated.objectives.length) {
    lines.push(`## ${labels.objectives}`);
    updated.objectives.forEach(({ text, original, added }) => {
      lines.push(original ? `- **${labels.revised}** ${text}` : `- ${text}`);
      if (original) lines.push(`  - ${labels.replaces} : ${original}`);
      added.forEach((change) => lines.push(...changeLines(change, labels, '  ')));
    });
    lines.push('');
  }
  if (updated.competencies.length) {
    lines.push(`## ${labels.competencies}`);
    updated.competencies.forEach(({ text, added }) => {
      lines.push(`- ${text}`);
      added.forEach((change) => lines.push(...changeLines(change, labels, '  ')));
    });
    lines.push('');
  }
  if (updated.topics.length) {
    lines.push(`## ${labels.topics}`);
    updated.topics.forEach(({ title, subtopics, added }) => {
      lines.push(subtopics.length ? `- **${title}** : ${subtopics.join(', ')}` : `- **${title}**`);
      added.forEach((change) => lines.push(...changeLines(change, labels, '  ')));
    });
    lines.push('');
  }
  if (updated.sessions.some(({ added }) => added.length) || !updated.topics.length) {
    if (updated.sessions.length) {
      lines.push(`## ${labels.outline}`);
      updated.sessions.forEach(({ line, added }) => {
        lines.push(`- ${line}`);
        added.forEach((change) => lines.push(...changeLines(change, labels, '  ')));
      });
      lines.push('');
    }
  }
  if (updated.unplaced.length) {
    lines.push(`## ${labels.toPlace}`);
    updated.unplaced.forEach((change) => lines.push(...changeLines(change, labels)));
    lines.push('');
  }
  if (changes.length) {
    lines.push('---', '', `## ${labels.changesTitle}`);
    changes.forEach((change) => {
      lines.push(
        `- **${change.connection}** (${labels.kinds[change.kind]}) — ${change.placement || labels.placementUnknown}`,
        `  - ${change.text}`,
        `  - ${labels.why} : ${change.why}`
      );
      if (change.resources.length) {
        lines.push(`  - ${labels.sources} : ${sourcesOf(change, labels).join(' ; ')}`);
      }
    });
  }
  return lines.join('\n');
};

// the accepted changes as plain text, grouped by where they belong (to paste anywhere)
export const changesText = (
  course: CourseToUpdate,
  changes: ApprovedChange[],
  labels: ExportLabels
) =>
  groupChanges(course, changes)
    .map(({ placement, changes: items }) =>
      [
        placement || labels.placementUnknown,
        ...items.flatMap((change) => [
          `- ${labels.kinds[change.kind]} : ${change.text}`,
          `  ${labels.why} : ${change.why}`,
          ...change.resources.map(
            ({ document }) =>
              `  ${labels.sources} : ${document.payload.document_title}${
                document.payload.document_url ? ` (${document.payload.document_url})` : ''
              }`
          )
        ])
      ].join('\n')
    )
    .join('\n\n');
