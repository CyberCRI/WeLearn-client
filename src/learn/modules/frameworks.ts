// structure of the learn module "Sustainability frameworks": ids, order and answers, the same
// in every language. its text is in src/localisation/learn/content/frameworks.<lang>.ts
import type { ModuleStructure } from '@/types/learn/modules';

export const FRAMEWORKS = {
  steps: [
    {
      id: 'sdgs',
      type: 'sdgs',
      ps: [
        { id: 'people', goals: [1, 2, 3, 4, 5] },
        { id: 'planet', goals: [6, 12, 13, 14, 15] },
        { id: 'prosperity', goals: [7, 8, 9, 10, 11] },
        { id: 'peace', goals: [16] },
        { id: 'partnership', goals: [17] }
      ],
      focus: { goal: 12, linked: [8, 10, 11] }
    },
    {
      id: 'greencomp',
      type: 'greencomp',
      areas: [
        {
          id: 'values',
          competences: ['valuing-sustainability', 'supporting-fairness', 'promoting-nature']
        },
        {
          id: 'complexity',
          competences: ['systems-thinking', 'critical-thinking', 'problem-framing']
        },
        {
          id: 'futures',
          competences: ['futures-literacy', 'adaptability', 'exploratory-thinking']
        },
        {
          id: 'acting',
          competences: ['political-agency', 'collective-action', 'individual-initiative']
        }
      ]
    },
    {
      id: 'sort',
      type: 'sort',
      bins: [{ id: 'sdg' }, { id: 'gc' }],
      cards: [
        { id: 'f1', bin: 'sdg' },
        { id: 'f2', bin: 'gc' },
        { id: 'f3', bin: 'sdg' },
        { id: 'f4', bin: 'gc' },
        { id: 'f5', bin: 'sdg' },
        { id: 'f6', bin: 'gc' }
      ]
    },
    {
      id: 'example',
      type: 'example',
      sdg: { goal: 12 },
      options: [
        { id: 'systems', area: 'complexity', competence: 'systems-thinking' },
        { id: 'futures', area: 'futures', competence: 'futures-literacy' },
        { id: 'collective', area: 'acting', competence: 'collective-action' }
      ]
    }
  ]
} as const satisfies ModuleStructure;
