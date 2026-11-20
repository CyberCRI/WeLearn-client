// structure of the learn module "Sustainability foundations": ids, order and answers, the same
// in every language. its text is in src/localisation/learn/content/foundations.<lang>.ts
import type { ModuleStructure } from '@/types/learn/modules';

export const FOUNDATIONS = {
  steps: [
    {
      id: 'concepts',
      type: 'concepts',
      items: [
        { id: 'sustainability' },
        { id: 'sd' },
        { id: 'transition' },
        { id: 'esd' },
        { id: 'teds' }
      ],
      map: [{ ids: ['transition', 'sd', 'sustainability'] }, { ids: ['esd', 'teds'] }]
    },
    {
      id: 'dimensions',
      type: 'dimensions',
      examples: [{ id: 'canteen' }, { id: 'online' }, { id: 'housing' }]
    },
    {
      id: 'sort',
      type: 'sort',
      bins: [
        { id: 'sustainability' },
        { id: 'sd' },
        { id: 'transition' },
        { id: 'esd' },
        { id: 'teds' }
      ],
      cards: [
        { id: 'c1', bin: 'sd' },
        { id: 'c2', bin: 'teds' },
        { id: 'c3', bin: 'transition' },
        { id: 'c4', bin: 'esd' },
        { id: 'c5', bin: 'sustainability' },
        { id: 'c6', bin: 'sd' }
      ]
    },
    {
      id: 'timeline',
      type: 'timeline',
      events: [
        { year: '2015' },
        { year: '2020' },
        { year: '2022' },
        { year: '2023' },
        { year: '2025' }
      ]
    },
    {
      id: 'sort-2',
      type: 'sort',
      bins: [{ id: 'cognitive' }, { id: 'socio' }, { id: 'behavioural' }],
      cards: [
        { id: 'd1', bin: 'cognitive' },
        { id: 'd2', bin: 'socio' },
        { id: 'd3', bin: 'behavioural' },
        { id: 'd4', bin: 'cognitive' },
        { id: 'd5', bin: 'socio' },
        { id: 'd6', bin: 'behavioural' }
      ]
    }
  ]
} as const satisfies ModuleStructure;
