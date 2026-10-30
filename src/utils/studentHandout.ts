import type { ReadingLanguage } from '@/utils/courseReading';
import { sourceLink } from '@/utils/connections';
import type { ActivityResource, ActivitySuggestion, ApproachId } from '@/utils/activityDesign';

// the student handout: the approved activity rearranged for students, in its own language, with
// only what it already contains (its scenario, its verified table, the verified excerpts of its
// resources). no AI call, so nothing is added; what an activity of its kind needs and lacks is
// listed for the teacher, never written into the handout

export type HandoutGap = 'instructions' | 'data' | 'scenario' | 'sources' | 'assumes' | 'edited';

export interface StudentHandout {
  text: string;
  gaps: HandoutGap[];
}

const LABELS: Record<ReadingLanguage, Record<string, string>> = {
  fr: {
    method: 'Méthode',
    duration: 'Durée et organisation',
    objective: 'Objectif',
    instructions: 'Consignes',
    case: 'Le cas',
    roles: 'Scénario et rôles',
    situation: 'Situation à cartographier',
    material: 'Document de travail',
    data: 'Données',
    context: 'Contexte',
    source: 'Source',
    reportedFrom: 'valeurs rapportées d’après',
    excerpts: 'Extraits des sources',
    steps: 'Déroulé',
    output: 'À rendre'
  },
  en: {
    method: 'Method',
    duration: 'Duration and organisation',
    objective: 'Objective',
    instructions: 'Instructions',
    case: 'The case',
    roles: 'Scenario and roles',
    situation: 'Situation to map',
    material: 'Working material',
    data: 'Data',
    context: 'Context',
    source: 'Source',
    reportedFrom: 'values reported from',
    excerpts: 'Source excerpts',
    steps: 'Steps',
    output: 'To hand in'
  }
};

const DATA_METHODS: ApproachId[] = ['comparative_data_analysis', 'lca_project'];
const ROLE_METHODS: ApproachId[] = ['stakeholder_role_play', 'structured_debate'];
// methods whose students need a situation to work on: written by WeLearn or documented
const SITUATION_METHODS: ApproachId[] = [
  'case_study',
  'systems_mapping',
  'futures_workshop',
  'problem_based_learning',
  'transition_planning',
  ...ROLE_METHODS
];

// what the provided material is for students, after the method
const materialHeading = (approach: ApproachId | null) => {
  if (approach === 'case_study') return 'case';
  if (approach && ROLE_METHODS.includes(approach)) return 'roles';
  if (approach === 'systems_mapping') return 'situation';
  return 'material';
};

// steps the teacher carries out alone ("the teacher sums up...") are not for students
const TEACHER_STEP = /\b(l['’]enseignant|the teacher|the instructor)/i;

export const buildHandout = (
  activity: ActivitySuggestion,
  resources: ActivityResource[],
  lang: ReadingLanguage,
  methodLabel: string,
  isEdited = false
): StudentHandout => {
  const label = LABELS[lang];
  const section = (key: string, body: string | null) => (body ? `## ${label[key]}\n\n${body}` : '');
  const { approach, dataTable: table } = activity;
  const tableText = table
    ? [
        `**${table.caption}**`,
        `| ${table.columns.join(' | ')} |`,
        `| ${table.columns.map(() => '---').join(' | ')} |`,
        ...table.rows.map((row) => `| ${row.join(' | ')} |`),
        `${label.context} : ${table.context}`,
        `${label.source} : ${table.document.payload.document_title} (${sourceLink(table.document)})${
          table.reportedFrom ? ` — ${label.reportedFrom} ${table.reportedFrom}` : ''
        }`
      ].join('\n\n')
    : null;
  const excerpts = resources.length
    ? resources
        .map(
          ({ document, evidence }) =>
            `> « ${evidence} »\n\n— ${document.payload.document_title} (${sourceLink(document, evidence)})`
        )
        .join('\n\n')
    : null;
  const steps = activity.steps.filter((step) => !TEACHER_STEP.test(step));
  const isData = !!approach && DATA_METHODS.includes(approach);

  const text = [
    `# ${activity.title}`,
    [
      methodLabel ? `**${label.method} :** ${methodLabel}` : '',
      activity.format ? `**${label.duration} :** ${activity.format}` : ''
    ]
      .filter(Boolean)
      .join('\n\n'),
    section('objective', activity.objective),
    section('instructions', activity.studentInstructions),
    section(materialHeading(approach), activity.providedMaterial),
    // data first for a data analysis, the excerpts first otherwise
    ...(isData
      ? [section('data', tableText), section('excerpts', excerpts)]
      : [section('excerpts', excerpts), section('data', tableText)]),
    section('steps', steps.length ? steps.map((step, i) => `${i + 1}. ${step}`).join('\n') : null),
    section('output', activity.studentOutput)
  ]
    .filter(Boolean)
    .join('\n\n');

  const hasCase = resources.some((resource) => resource.material === 'case');
  const gaps: HandoutGap[] = [];
  if (!activity.studentInstructions && !steps.length) gaps.push('instructions');
  if (isData && !table) gaps.push('data');
  // the situation students work on: a debate or role-play needs its written positions or roles, a
  // case study its case (written or documented), the other methods a situation or a resource
  const hasSituation =
    !!activity.providedMaterial ||
    (approach === 'case_study' && hasCase) ||
    (!!approach &&
      !ROLE_METHODS.includes(approach) &&
      approach !== 'case_study' &&
      !!resources.length);
  if (approach && SITUATION_METHODS.includes(approach) && !hasSituation) gaps.push('scenario');
  if (!resources.length && !activity.providedMaterial && !table) gaps.push('sources');
  if (activity.assumesMissing) gaps.push('assumes');
  if (isEdited) gaps.push('edited');
  return { text, gaps };
};
