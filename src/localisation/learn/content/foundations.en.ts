// text of the learn module "Sustainability foundations" in English, keyed by the ids of its structure
import type { FOUNDATIONS } from '@/learn/modules/foundations';
import type { ModuleText } from '@/types/learn/modules';

export const foundations: ModuleText<typeof FOUNDATIONS> = {
  title: 'Sustainability foundations',
  subtitle: 'Tell apart five terms you hear all the time.',
  duration: '≈ 5 min',
  hook: 'Sustainability, sustainable development, ecological transition, ESD, TEDS… These terms are often used as if they meant the same thing. They don’t, and the difference matters when you teach.',
  goal: 'In about five minutes, you will tell the five terms apart, see why they concern every discipline and understand why higher education is being asked to act now. There is nothing to memorize.',
  confidenceBefore: 'Right now, how confident are you in telling these five terms apart?',
  confidenceAfter: 'And now, how confident are you in telling these five terms apart?',
  takeaways: [
    'Sustainability is the goal, sustainable development the pathway and ecological transition the transformation underway.',
    'ESD is the response of education, and TEDS is how French higher education frames it.',
    'Sustainability always involves the environmental, social and economic dimensions together.',
    'In every discipline, ESD develops what learners can understand and do, not just what they know.'
  ],
  steps: {
    concepts: {
      title: 'Five terms, five roles',
      short: 'Concepts',
      instruction: 'Open each card. Just notice what each term is for.',
      items: {
        sustainability: {
          term: 'Sustainability',
          role: 'The long-term goal',
          explanation:
            'A state we aim for: human activity that the planet and all forms of life can sustain over time. It is broader than protecting the environment: it also involves fairness between people and economic viability.',
          example:
            'A university asks whether its campus can operate within environmental limits while staying fair to staff and students.',
          relation:
            'Sustainability is where we want to go. The other terms describe how we get there, or how we teach it.',
          cite: [{ src: 'greencomp', loc: 'pp. 11–12' }]
        },
        sd: {
          term: 'Sustainable development',
          role: 'The pathway',
          explanation:
            'Development that “meets the needs of the present without compromising the ability of future generations to meet their own needs”. Today it is framed by the 17 Sustainable Development Goals (SDGs), which balance the economic, social and environmental dimensions.',
          example:
            'An engineering course weighs a project’s benefits today against the costs it leaves to future users.',
          relation:
            'Sustainable development is the process that leads towards sustainability. French policy texts often say “développement soutenable”.',
          cite: [
            { src: 'wced', loc: 'ch. 2, §1 (p. 54)' },
            { src: 'agenda', loc: 'preamble' },
            { src: 'mesr2023', loc: 'p. 3' }
          ]
        },
        transition: {
          term: 'Ecological transition',
          role: 'The transformation underway',
          explanation:
            'The transformation of how society works (energy, production, consumption, mobility…) to restore the planet’s viability, by putting the SDGs into practice.',
          example:
            'A business school course examines how a sector has to change its model to cut its emissions and resource use.',
          relation:
            'It names the concrete changes that societies are going through. It is not a synonym for sustainable development.',
          cite: [{ src: 'jouzel', loc: 'p. 1' }]
        },
        esd: {
          term: 'Education for Sustainable Development (ESD)',
          role: 'The educational response',
          explanation:
            'Education that gives learners the knowledge, skills, values and ability to act on sustainability issues. It is not only about teaching facts on climate or biodiversity: it is about what learners become able to understand, analyze and do.',
          example:
            'A law course where students analyze a real environmental dispute and argue a position, rather than only learning the texts.',
          relation:
            'ESD is how education contributes to sustainable development, in every discipline.',
          cite: [{ src: 'roadmap' }, { src: 'unesco2017' }]
        },
        teds: {
          term: 'TEDS',
          role: 'The French higher education framing',
          explanation:
            '“Transition écologique pour un développement soutenable” (ecological transition for sustainable development): the framing used by the French Ministry of Higher Education to train all students in these issues, whatever their discipline.',
          example:
            'A first-year history program adds sessions on how past societies faced environmental change.',
          relation:
            'TEDS is the French way of putting ESD into practice in universities. It combines ecological transition and sustainable development.',
          cite: [{ src: 'mesr2023', loc: 'p. 3' }]
        }
      },
      map: [
        { arrows: ['moves societies along', 'leads towards'] },
        { arrows: ['framed in French higher education as'] }
      ]
    },
    dimensions: {
      title: 'More than the environment',
      short: 'Dimensions',
      instruction:
        'Pick an example to see how its environmental, social and economic sides interact.',
      cite: [{ src: 'agenda', loc: 'preamble' }],
      examples: {
        canteen: {
          label: 'Food supply for the campus canteen',
          env: 'Emissions of different meals, packaging and food waste.',
          soc: 'Affordable, healthy meals for every student; working conditions at suppliers.',
          eco: 'Costs for the university, income for local producers.',
          link: 'Choosing low-emission meals can change prices and suppliers: a decision on one side affects the others.'
        },
        online: {
          label: 'Moving courses online',
          env: 'Less commuting, but more devices and energy use.',
          soc: 'Access for students without good equipment or a reliable connection.',
          eco: 'Savings on buildings, spending on platforms and equipment.',
          link: 'An environmental gain can create a social cost: the dimensions have to be weighed together.'
        },
        housing: {
          label: 'Renovating student housing',
          env: 'Energy efficiency, choice of materials.',
          soc: 'Rents, comfort and health of the residents.',
          eco: 'Upfront investment against long-term savings.',
          link: 'The same project is an environmental, social and economic decision at once.'
        }
      },
      closing:
        'Sustainability issues are never only environmental: the 2030 Agenda describes its goals as balancing the economic, social and environmental dimensions.'
    },
    sort: {
      title: 'Which term is it?',
      short: 'Quiz',
      instruction:
        'Drag each statement onto the term it describes, or select a statement and then a term.',
      bins: {
        sustainability: 'Sustainability',
        sd: 'Sustainable development',
        transition: 'Ecological transition',
        esd: 'ESD',
        teds: 'TEDS'
      },
      cards: {
        c1: {
          text: 'Meeting today’s needs without compromising those of future generations',
          feedback: 'Yes: this is the Brundtland definition of sustainable development (1987).',
          hint: 'it is a famous 1987 definition of a pathway.'
        },
        c2: {
          text: 'The French ministry’s framing for training all university students',
          feedback: 'Yes: TEDS is the framing of the French Ministry of Higher Education.',
          hint: 'look for the term that is specific to France.'
        },
        c3: {
          text: 'Changing how energy, production and mobility work to restore the planet’s viability',
          feedback: 'Yes: this describes the ecological transition, a transformation underway.',
          hint: 'it describes concrete changes in how society works.'
        },
        c4: {
          text: 'Helping learners become able to analyze and act, not only to know facts',
          feedback: 'Yes: that is what Education for Sustainable Development aims for.',
          hint: 'it is about learners.'
        },
        c5: {
          text: 'A long-term state where human activity stays within what the planet can sustain',
          feedback: 'Yes: sustainability is the long-term goal.',
          hint: 'it is a goal rather than a process.'
        },
        c6: {
          text: 'Balancing economic, social and environmental goals through the 17 SDGs',
          feedback: 'Yes: the SDGs are today’s framework for sustainable development.',
          hint: 'the SDGs are named after it.'
        }
      }
    },
    timeline: {
      title: 'Why higher education, and why now?',
      short: 'Context',
      instruction: 'Open each milestone.',
      events: [
        {
          label: 'UN 2030 Agenda',
          detail:
            'All UN member states adopt the 17 SDGs. Target 4.7 asks that all learners acquire the knowledge and skills needed to promote sustainable development.',
          cite: [{ src: 'agenda', loc: 'goal 4, target 4.7' }]
        },
        {
          label: 'UNESCO “ESD for 2030”',
          detail:
            'UNESCO sets a roadmap for ESD for the decade. It includes building the capacities of educators.',
          cite: [{ src: 'roadmap' }]
        },
        {
          label: 'Jouzel report (France)',
          detail:
            'A working group chaired by climatologist Jean Jouzel recommends training 100% of students at Bac+2 level (the first two years of higher education), whatever their program, within five years, as an integral part of their studies.',
          cite: [{ src: 'jouzel', loc: 'p. 3' }]
        },
        {
          label: 'Ministry framing note (TEDS)',
          detail:
            'The ministry asks universities to give every first-cycle (bachelor’s level) student a shared foundation of knowledge and competences: at least 30 hours of teaching, ideally worth at least 3 ECTS credits.',
          cite: [{ src: 'mesr2023', loc: 'pp. 8–9' }]
        },
        {
          label: 'Target date',
          detail:
            'In 2022, the minister announced that all students should receive dedicated ecological transition teaching by 2025 at the latest. Universities are rolling it out now.',
          cite: [{ src: 'mesr2022' }, { src: 'mesr2023', loc: 'p. 3' }]
        }
      ],
      closing:
        'Why it concerns you: these issues are expected in all disciplines (sciences, engineering, health, humanities and social sciences) and built into existing courses, not only specialist ones.',
      closingCite: [{ src: 'mesr2023', loc: 'p. 5' }, { src: 'jouzel' }]
    },
    'sort-2': {
      title: 'Knowing is not enough',
      short: 'ESD',
      instruction:
        'ESD develops more than knowledge. Sort each learning intention by what it mainly develops.',
      cite: [{ src: 'unesco2017' }],
      bins: {
        cognitive: 'Knowing and thinking',
        socio: 'Valuing and relating',
        behavioural: 'Acting'
      },
      cards: {
        d1: {
          text: 'Explain how a supply chain produces emissions',
          feedback: 'Yes: understanding a mechanism is mainly knowing and thinking.',
          hint: 'this one is about understanding.'
        },
        d2: {
          text: 'Reflect on their own values about consumption',
          feedback:
            'Yes: reflecting on values is valuing and relating (the socio-emotional dimension).',
          hint: 'this one is about values.'
        },
        d3: {
          text: 'Propose and carry out a waste-reduction plan with classmates',
          feedback: 'Yes: carrying out a plan is acting.',
          hint: 'students actually do something.'
        },
        d4: {
          text: 'Analyze the trade-offs between two energy options',
          feedback: 'Yes: analysing trade-offs is thinking.',
          hint: 'this one is about analysis.'
        },
        d5: {
          text: 'Empathize with communities affected by a project',
          feedback: 'Yes: empathy is relating to others.',
          hint: 'this one is about other people.'
        },
        d6: {
          text: 'Take part in a local sustainability initiative',
          feedback: 'Yes: taking part is acting.',
          hint: 'students take part in something real.'
        }
      },
      closing:
        'Competence frameworks such as GreenComp describe these capabilities. They are the topic of the next module.'
    }
  }
};
