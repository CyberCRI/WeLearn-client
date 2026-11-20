// text of the learn module "Sustainability frameworks" in English, keyed by the ids of its structure
import type { FRAMEWORKS } from '@/learn/modules/frameworks';
import type { ModuleText } from '@/types/learn/modules';

export const frameworks: ModuleText<typeof FRAMEWORKS> = {
  title: 'Sustainability frameworks',
  subtitle: 'See what the SDGs and GreenComp are each for.',
  duration: '≈ 5 min',
  hook: 'You have probably seen the colorful icons of the Sustainable Development Goals (SDGs) and heard of GreenComp, the European sustainability competence framework. They are not competing checklists: they answer two different questions.',
  goal: 'In about five minutes, you will see what the SDGs and GreenComp are for, and how they work together when you design a course.',
  confidenceBefore:
    'Right now, how confident are you about the difference between the SDGs and GreenComp?',
  confidenceAfter:
    'And now, how confident are you about the difference between the SDGs and GreenComp?',
  takeaways: [
    'The SDGs describe the sustainability challenges your students engage with.',
    'GreenComp describes the competences they develop while engaging with them.',
    'Both are references to guide your choices, not checklists to complete.',
    'The link between an SDG and a competence depends on what students actually do.'
  ],
  steps: {
    sdgs: {
      title: 'The SDGs: which challenges?',
      short: 'SDGs',
      instruction:
        'Group the 17 goals by the five Ps named in the 2030 Agenda (a common grouping, not an official one), then see how the goals connect.',
      cite: [{ src: 'agenda', loc: 'preamble; §55' }],
      explanation:
        'The 17 SDGs are part of the UN 2030 Agenda. They cover environmental, social and economic challenges, and the Agenda describes them as “integrated and indivisible”.',
      ps: {
        people: 'People',
        planet: 'Planet',
        prosperity: 'Prosperity',
        peace: 'Peace',
        partnership: 'Partnership'
      },
      psCite: [{ src: 'agenda', loc: 'preamble' }],
      focus: {
        button: 'See how SDG 12 connects',
        text: 'Example: fast fashion. Responsible consumption (12) is tied to poor working conditions (decent work, 8; inequalities, 10) and to solid waste piling up in cities (11). Acting on one goal affects the others.',
        cite: [{ src: 'greencomp', loc: 'p. 21' }]
      },
      note: 'The SDGs help you identify which challenges a course can engage with. They are neither a teaching method nor a competence framework.'
    },
    greencomp: {
      title: 'GreenComp: which competences?',
      short: 'GreenComp',
      instruction: 'Open each area to see its three competences.',
      cite: [{ src: 'greencomp', loc: 'Table 1, pp. 14–15' }],
      explanation:
        'GreenComp is the European sustainability competence framework. It describes what learners can become able to do, in four interconnected areas of three competences each.',
      areas: {
        values: {
          name: 'Embodying sustainability values',
          competences: {
            'valuing-sustainability': {
              name: 'Valuing sustainability',
              line: 'Reflecting on personal values and how they shape actions.'
            },
            'supporting-fairness': {
              name: 'Supporting fairness',
              line: 'Supporting equity and justice for current and future generations.'
            },
            'promoting-nature': {
              name: 'Promoting nature',
              line: 'Recognizing that humans are part of nature and respecting other species.'
            }
          }
        },
        complexity: {
          name: 'Embracing complexity in sustainability',
          competences: {
            'systems-thinking': {
              name: 'Systems thinking',
              line: 'Approaching a problem from all sides, across time, space and context.'
            },
            'critical-thinking': {
              name: 'Critical thinking',
              line: 'Assessing information and arguments, and challenging assumptions.'
            },
            'problem-framing': {
              name: 'Problem framing',
              line: 'Formulating challenges as sustainability problems and defining their scope.'
            }
          }
        },
        futures: {
          name: 'Envisioning sustainable futures',
          competences: {
            'futures-literacy': {
              name: 'Futures literacy',
              line: 'Imagining alternative futures and the steps to reach them.'
            },
            adaptability: { name: 'Adaptability', line: 'Managing transitions and uncertainty.' },
            'exploratory-thinking': {
              name: 'Exploratory thinking',
              line: 'Combining disciplines, creativity and experimentation.'
            }
          }
        },
        acting: {
          name: 'Acting for sustainability',
          competences: {
            'political-agency': {
              name: 'Political agency',
              line: 'Navigating the political system, identifying responsibility and demanding effective policies.'
            },
            'collective-action': {
              name: 'Collective action',
              line: 'Acting for change together with others.'
            },
            'individual-initiative': {
              name: 'Individual initiative',
              line: 'Identifying one’s own potential and acting to contribute.'
            }
          }
        }
      },
      note: 'GreenComp is non-prescriptive: it is a reference, not a checklist. A course can focus on the few competences that fit what your students do; the 12 are meant to be developed across a whole program.',
      noteCite: [{ src: 'greencomp', loc: 'pp. 15, 29' }],
      attribution: 'Adapted from Bianchi, Pisiotis & Cabrera Giraldez (2022), GreenComp, CC BY 4.0.'
    },
    sort: {
      title: 'Challenge or competence?',
      short: 'Quiz',
      instruction:
        'Is each item a sustainability challenge (SDGs) or something learners become able to do (GreenComp)?',
      bins: { sdg: 'A challenge → SDGs', gc: 'A competence → GreenComp' },
      cards: {
        f1: {
          text: 'Access to clean water',
          feedback: 'Yes: a challenge (SDG 6).',
          hint: 'is it a problem in the world, or a capability?'
        },
        f2: {
          text: 'Seeing a problem as a system of interactions',
          feedback: 'Yes: systems thinking, a GreenComp competence.',
          hint: 'is it something learners become able to do?'
        },
        f3: {
          text: 'Reducing inequalities between countries',
          feedback: 'Yes: a challenge (SDG 10).',
          hint: 'is it a problem in the world, or a capability?'
        },
        f4: {
          text: 'Imagining alternative futures and how to reach them',
          feedback: 'Yes: futures literacy, a GreenComp competence.',
          hint: 'is it something learners become able to do?'
        },
        f5: {
          text: 'Climate change and its impacts',
          feedback: 'Yes: a challenge (SDG 13).',
          hint: 'is it a problem in the world, or a capability?'
        },
        f6: {
          text: 'Acting with others to bring about change',
          feedback: 'Yes: collective action, a GreenComp competence.',
          hint: 'is it something learners become able to do?'
        }
      }
    },
    example: {
      title: 'Using them together',
      short: 'Example',
      instruction: 'Take one course topic and ask two questions.',
      challenge: 'Responsible use of resources',
      sdg: { text: 'Can connect to SDG 12: Responsible consumption and production' },
      question: 'Now, what will students actually do? Pick a learning intention:',
      options: {
        systems: {
          intention:
            'Students analyze the relationships between resource use, production processes, waste and environmental impacts.'
        },
        futures: {
          intention:
            'Students imagine what a zero-waste campus could look like in 2040, and the steps to get there.'
        },
        collective: { intention: 'Students organize a repair café on campus with local partners.' }
      },
      lesson:
        'Same SDG, different competences: the competence depends on what students learn and do. There is no fixed SDG ↔ GreenComp mapping.'
    }
  }
};
