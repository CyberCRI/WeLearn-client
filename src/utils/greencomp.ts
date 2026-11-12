import type { ReadingLanguage } from '@/utils/courseReading';

// the twelve GreenComp competences (European Commission, 2022, "GreenComp: the European
// sustainability competence framework"), ported from the activity design of the "design your
// course" prototype (esra/pedagogy-experiments). competences are learning outcomes, not
// teaching methods. each comes with a short definition for the AI, so a competence is chosen for
// what students actually do, not for a shared word. labels for teachers are in localisation
// (tutor.greencomp.<id>)
export const GREENCOMP = [
  'valuing_sustainability',
  'supporting_fairness',
  'promoting_nature',
  'systems_thinking',
  'critical_thinking',
  'problem_framing',
  'futures_literacy',
  'adaptability',
  'exploratory_thinking',
  'political_agency',
  'collective_action',
  'individual_initiative'
] as const;
export type GreenCompId = (typeof GREENCOMP)[number];

export const isGreenCompId = (value: unknown): value is GreenCompId =>
  GREENCOMP.includes(value as GreenCompId);

const DEFINITIONS: Record<ReadingLanguage, Record<GreenCompId, string>> = {
  fr: {
    valuing_sustainability:
      'réfléchir à ses valeurs et à celles des autres, et évaluer en quoi elles s’accordent avec la durabilité',
    supporting_fairness:
      'défendre l’équité et la justice pour les générations actuelles et futures',
    promoting_nature:
      'reconnaître que l’humain fait partie de la nature et respecter les besoins des autres espèces et des écosystèmes',
    systems_thinking:
      'aborder un problème de durabilité sous tous ses angles, en considérant le temps, l’espace et le contexte, et comprendre comment les éléments interagissent dans et entre les systèmes',
    critical_thinking:
      'évaluer des informations et des arguments, repérer les présupposés, remettre en question le statu quo',
    problem_framing:
      'formuler un défi comme un problème de durabilité (difficulté, personnes concernées, échelle de temps et d’espace) pour choisir une approche adaptée',
    futures_literacy:
      'imaginer des futurs durables possibles, élaborer des scénarios et identifier les étapes pour y parvenir',
    adaptability:
      'gérer les transitions et décider face à l’incertitude, à l’ambiguïté et au risque',
    exploratory_thinking:
      'relier différentes disciplines et expérimenter de nouvelles idées ou méthodes',
    political_agency:
      'comprendre le système politique, identifier les responsabilités et demander des politiques efficaces',
    collective_action: 'agir pour le changement avec d’autres',
    individual_initiative:
      'identifier son propre potentiel d’action et contribuer activement à la durabilité'
  },
  en: {
    valuing_sustainability:
      'reflect on one’s own and others’ values and evaluate how they align with sustainability',
    supporting_fairness: 'support equity and justice for current and future generations',
    promoting_nature:
      'acknowledge that humans are part of nature and respect the needs of other species and ecosystems',
    systems_thinking:
      'approach a sustainability problem from all sides, considering time, space and context, and understand how elements interact within and between systems',
    critical_thinking:
      'assess information and arguments, identify assumptions and challenge the status quo',
    problem_framing:
      'frame a challenge as a sustainability problem (difficulty, people involved, time and geographical scope) to choose a suitable approach',
    futures_literacy:
      'envision alternative sustainable futures, develop scenarios and identify the steps to reach them',
    adaptability:
      'manage transitions and make decisions in the face of uncertainty, ambiguity and risk',
    exploratory_thinking: 'link different disciplines and experiment with new ideas or methods',
    political_agency:
      'navigate the political system, identify responsibility and demand effective policies',
    collective_action: 'act for change together with others',
    individual_initiative:
      'identify one’s own potential to act and actively contribute to sustainability'
  }
};

// the list given to the AI: each identifier with what it means
export const greenCompForPrompt = (lang: ReadingLanguage) =>
  GREENCOMP.map((id) => `- ${id} : ${DEFINITIONS[lang][id]}`).join('\n');
