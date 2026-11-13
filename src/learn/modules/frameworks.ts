// learn module "Sustainability frameworks", EN + FR: both languages keep the same structure
// ponytail: local content until the API serves it (GET /learn/modules/frameworks), then this file goes away
import type { ModuleContent } from '@/types/learn/modules';

const en: ModuleContent = {
  title: 'Sustainability frameworks',
  subtitle: 'See what the SDGs and GreenComp are each for.',
  duration: '≈ 5 min',
  hook: 'You have probably seen the colorful icons of the Sustainable Development Goals (SDGs) and heard of GreenComp, the European sustainability competence framework. They are not competing checklists: they answer two different questions.',
  goal: 'In about five minutes, you will see what the SDGs and GreenComp are for, and how they work together when you design a course.',
  confidenceBefore:
    'Right now, how confident are you about the difference between the SDGs and GreenComp?',
  confidenceAfter:
    'And now, how confident are you about the difference between the SDGs and GreenComp?',
  steps: [
    {
      type: 'sdgs',
      id: 'sdgs',
      title: 'The SDGs: which challenges?',
      short: 'SDGs',
      instruction:
        'Group the 17 goals by the five Ps named in the 2030 Agenda (a common grouping, not an official one), then see how the goals connect.',
      explanation:
        'The 17 SDGs are part of the UN 2030 Agenda. They cover environmental, social and economic challenges, and the Agenda describes them as “integrated and indivisible”.',
      cite: [{ src: 'agenda', loc: 'preamble; §55' }],
      ps: [
        { id: 'people', label: 'People', goals: [1, 2, 3, 4, 5] },
        { id: 'planet', label: 'Planet', goals: [6, 12, 13, 14, 15] },
        { id: 'prosperity', label: 'Prosperity', goals: [7, 8, 9, 10, 11] },
        { id: 'peace', label: 'Peace', goals: [16] },
        { id: 'partnership', label: 'Partnership', goals: [17] }
      ],
      psCite: [{ src: 'agenda', loc: 'preamble' }],
      groupLabel: 'Group by the 5 Ps',
      ungroupLabel: 'Show in order',
      focus: {
        goal: 12,
        linked: [8, 10, 11],
        button: 'See how SDG 12 connects',
        text: 'Example: fast fashion. Responsible consumption (12) is tied to poor working conditions (decent work, 8; inequalities, 10) and to solid waste piling up in cities (11). Acting on one goal affects the others.',
        cite: [{ src: 'greencomp', loc: 'p. 21' }]
      },
      note: 'The SDGs help you identify which challenges a course can engage with. They are neither a teaching method nor a competence framework.'
    },
    {
      type: 'greencomp',
      id: 'greencomp',
      title: 'GreenComp: which competences?',
      short: 'GreenComp',
      instruction: 'Open each area to see its three competences.',
      explanation:
        'GreenComp is the European sustainability competence framework. It describes what learners can become able to do, in four interconnected areas of three competences each.',
      cite: [{ src: 'greencomp', loc: 'Table 1, pp. 14–15' }],
      areas: [
        {
          id: 'values',
          name: 'Embodying sustainability values',
          competences: [
            {
              name: 'Valuing sustainability',
              line: 'Reflecting on personal values and how they shape actions.'
            },
            {
              name: 'Supporting fairness',
              line: 'Supporting equity and justice for current and future generations.'
            },
            {
              name: 'Promoting nature',
              line: 'Recognizing that humans are part of nature and respecting other species.'
            }
          ]
        },
        {
          id: 'complexity',
          name: 'Embracing complexity in sustainability',
          competences: [
            {
              name: 'Systems thinking',
              line: 'Approaching a problem from all sides, across time, space and context.'
            },
            {
              name: 'Critical thinking',
              line: 'Assessing information and arguments, and challenging assumptions.'
            },
            {
              name: 'Problem framing',
              line: 'Formulating challenges as sustainability problems and defining their scope.'
            }
          ]
        },
        {
          id: 'futures',
          name: 'Envisioning sustainable futures',
          competences: [
            {
              name: 'Futures literacy',
              line: 'Imagining alternative futures and the steps to reach them.'
            },
            { name: 'Adaptability', line: 'Managing transitions and uncertainty.' },
            {
              name: 'Exploratory thinking',
              line: 'Combining disciplines, creativity and experimentation.'
            }
          ]
        },
        {
          id: 'acting',
          name: 'Acting for sustainability',
          competences: [
            {
              name: 'Political agency',
              line: 'Navigating the political system, identifying responsibility and demanding effective policies.'
            },
            {
              name: 'Collective action',
              line: 'Acting for change together with others.'
            },
            {
              name: 'Individual initiative',
              line: 'Identifying one’s own potential and acting to contribute.'
            }
          ]
        }
      ],
      note: 'GreenComp is non-prescriptive: it is a reference, not a checklist. A course can focus on the few competences that fit what your students do; the 12 are meant to be developed across a whole program.',
      noteCite: [{ src: 'greencomp', loc: 'pp. 15, 29' }],
      attribution: 'Adapted from Bianchi, Pisiotis & Cabrera Giraldez (2022), GreenComp, CC BY 4.0.'
    },
    {
      type: 'sort',
      id: 'sort',
      title: 'Challenge or competence?',
      short: 'Quiz',
      instruction:
        'Is each item a sustainability challenge (SDGs) or something learners become able to do (GreenComp)?',
      bins: [
        { id: 'sdg', label: 'A challenge → SDGs' },
        { id: 'gc', label: 'A competence → GreenComp' }
      ],
      cards: [
        {
          id: 'f1',
          text: 'Access to clean water',
          bin: 'sdg',
          feedback: 'Yes: a challenge (SDG 6).',
          hint: 'is it a problem in the world, or a capability?'
        },
        {
          id: 'f2',
          text: 'Seeing a problem as a system of interactions',
          bin: 'gc',
          feedback: 'Yes: systems thinking, a GreenComp competence.',
          hint: 'is it something learners become able to do?'
        },
        {
          id: 'f3',
          text: 'Reducing inequalities between countries',
          bin: 'sdg',
          feedback: 'Yes: a challenge (SDG 10).',
          hint: 'is it a problem in the world, or a capability?'
        },
        {
          id: 'f4',
          text: 'Imagining alternative futures and how to reach them',
          bin: 'gc',
          feedback: 'Yes: futures literacy, a GreenComp competence.',
          hint: 'is it something learners become able to do?'
        },
        {
          id: 'f5',
          text: 'Climate change and its impacts',
          bin: 'sdg',
          feedback: 'Yes: a challenge (SDG 13).',
          hint: 'is it a problem in the world, or a capability?'
        },
        {
          id: 'f6',
          text: 'Acting with others to bring about change',
          bin: 'gc',
          feedback: 'Yes: collective action, a GreenComp competence.',
          hint: 'is it something learners become able to do?'
        }
      ]
    },
    {
      type: 'example',
      id: 'example',
      title: 'Using them together',
      short: 'Example',
      instruction: 'Take one course topic and ask two questions.',
      challengeLabel: 'The sustainability challenge',
      challenge: 'Responsible use of resources',
      sdg: { goal: 12, text: 'Can connect to SDG 12: Responsible consumption and production' },
      question: 'Now, what will students actually do? Pick a learning intention:',
      options: [
        {
          id: 'systems',
          intention:
            'Students analyze the relationships between resource use, production processes, waste and environmental impacts.',
          competence: 'Systems thinking',
          area: 'Embracing complexity in sustainability'
        },
        {
          id: 'futures',
          intention:
            'Students imagine what a zero-waste campus could look like in 2040, and the steps to get there.',
          competence: 'Futures literacy',
          area: 'Envisioning sustainable futures'
        },
        {
          id: 'collective',
          intention: 'Students organize a repair café on campus with local partners.',
          competence: 'Collective action',
          area: 'Acting for sustainability'
        }
      ],
      lesson:
        'Same SDG, different competences: the competence depends on what students learn and do. There is no fixed SDG ↔ GreenComp mapping.'
    },
    {
      type: 'myth',
      id: 'myth',
      title: 'True or false?',
      short: 'Myths',
      trueLabel: 'True',
      falseLabel: 'False',
      statements: [
        {
          text: 'Adding SDG logos to my syllabus is enough to make it an ESD course.',
          answer: false,
          feedback:
            'False. Labelling a course with an SDG does not change what students learn. Education for Sustainable Development (ESD) is about what they become able to understand and do.'
        },
        {
          text: 'A course should develop all 12 GreenComp competences.',
          answer: false,
          feedback:
            'False. GreenComp is non-prescriptive: a course can focus on the few competences that fit it.',
          cite: [{ src: 'greencomp', loc: 'pp. 15, 29' }]
        },
        {
          text: 'The SDGs and GreenComp can be used together.',
          answer: true,
          feedback:
            'True. The SDGs help frame the challenge, and GreenComp helps frame what students develop while working on it.'
        }
      ]
    }
  ],
  takeaways: [
    'The SDGs describe the sustainability challenges your students engage with.',
    'GreenComp describes the competences they develop while engaging with them.',
    'Both are references to guide your choices, not checklists to complete.',
    'The link between an SDG and a competence depends on what students actually do.'
  ]
};

const fr: ModuleContent = {
  title: 'Les référentiels de la durabilité',
  subtitle: 'Voyez à quoi servent les ODD et le GreenComp.',
  duration: '≈ 5 min',
  hook: 'Vous avez sans doute déjà vu les icônes colorées des Objectifs de développement durable (ODD) et entendu parler du GreenComp, le référentiel européen des compétences en durabilité. Ce ne sont pas des listes à cocher concurrentes\u00a0: ils répondent à deux questions différentes.',
  goal: 'En cinq minutes environ, vous allez voir à quoi servent les ODD et le GreenComp, et comment ils se complètent quand vous concevez un cours.',
  confidenceBefore:
    'À ce stade, à quel point voyez-vous clairement la différence entre les ODD et le GreenComp\u00a0?',
  confidenceAfter:
    'Et maintenant, à quel point voyez-vous clairement la différence entre les ODD et le GreenComp\u00a0?',
  steps: [
    {
      type: 'sdgs',
      id: 'sdgs',
      title: 'Les ODD\u00a0: quels enjeux\u00a0?',
      short: 'ODD',
      instruction:
        'Regroupez les 17 objectifs selon les cinq P cités par l’Agenda 2030 (un regroupement courant, non officiel), puis voyez comment les objectifs sont liés.',
      explanation:
        'Les 17 ODD font partie de l’Agenda 2030 de l’ONU. Ils couvrent des enjeux environnementaux, sociaux et économiques, et l’Agenda les décrit comme «\u00a0intégrés et indissociables\u00a0».',
      cite: [{ src: 'agenda', loc: 'préambule\u00a0; §55' }],
      ps: [
        { id: 'people', label: 'Humanité', goals: [1, 2, 3, 4, 5] },
        { id: 'planet', label: 'Planète', goals: [6, 12, 13, 14, 15] },
        { id: 'prosperity', label: 'Prospérité', goals: [7, 8, 9, 10, 11] },
        { id: 'peace', label: 'Paix', goals: [16] },
        { id: 'partnership', label: 'Partenariats', goals: [17] }
      ],
      psCite: [{ src: 'agenda', loc: 'préambule' }],
      groupLabel: 'Regrouper par les 5 P',
      ungroupLabel: 'Afficher dans l’ordre',
      focus: {
        goal: 12,
        linked: [8, 10, 11],
        button: 'Voir les liens de l’ODD 12',
        text: 'Exemple\u00a0: la mode éphémère (fast fashion). La consommation responsable (12) est liée aux mauvaises conditions de travail (travail décent, 8\u00a0; inégalités, 10) et à l’accumulation des déchets dans les villes (11). Agir sur un objectif a des effets sur les autres.',
        cite: [{ src: 'greencomp', loc: 'p. 21' }]
      },
      note: 'Les ODD vous aident à repérer les enjeux qu’un cours peut aborder. Ce ne sont ni une méthode pédagogique ni un référentiel de compétences.'
    },
    {
      type: 'greencomp',
      id: 'greencomp',
      title: 'GreenComp\u00a0: quelles compétences\u00a0?',
      short: 'GreenComp',
      instruction: 'Ouvrez chaque domaine pour voir ses trois compétences.',
      explanation:
        'Le GreenComp est le référentiel européen des compétences en durabilité. Il décrit ce que les apprenant·es peuvent devenir capables de faire, en quatre domaines interconnectés de trois compétences chacun.',
      cite: [{ src: 'greencomp', loc: 'tableau 1, p. 14–15' }],
      areas: [
        {
          id: 'values',
          name: 'Incarner les valeurs de la durabilité',
          competences: [
            {
              name: 'Accorder de la valeur à la durabilité',
              line: 'Réfléchir à ses valeurs personnelles et à la façon dont elles orientent ses actions.'
            },
            {
              name: 'Encourager l’équité',
              line: 'Favoriser l’équité et la justice pour les générations actuelles et à venir.'
            },
            {
              name: 'Promouvoir la nature',
              line: 'Reconnaître que l’humain fait partie de la nature et respecter les autres espèces.'
            }
          ]
        },
        {
          id: 'complexity',
          name: 'S’ouvrir à la complexité dans la durabilité',
          competences: [
            {
              name: 'Pensée systémique',
              line: 'Aborder un problème sous tous ses angles, dans le temps, l’espace et son contexte.'
            },
            {
              name: 'Pensée critique',
              line: 'Évaluer les informations et les arguments, et remettre en question les présupposés.'
            },
            {
              name: 'Cadrage des problèmes',
              line: 'Formuler les défis comme des problèmes de durabilité et en définir la portée.'
            }
          ]
        },
        {
          id: 'futures',
          name: 'Envisager des avenirs durables',
          competences: [
            {
              name: 'Littératie des futurs',
              line: 'Imaginer d’autres futurs possibles et les étapes pour y parvenir.'
            },
            { name: 'Adaptabilité', line: 'Gérer les transitions et l’incertitude.' },
            {
              name: 'Pensée exploratoire',
              line: 'Combiner les disciplines, la créativité et l’expérimentation.'
            }
          ]
        },
        {
          id: 'acting',
          name: 'Agir pour la durabilité',
          competences: [
            {
              name: 'Agentivité politique',
              line: 'S’orienter dans le système politique, identifier les responsabilités et exiger des politiques efficaces.'
            },
            {
              name: 'Action collective',
              line: 'Agir pour le changement avec les autres.'
            },
            {
              name: 'Initiative individuelle',
              line: 'Identifier son propre potentiel et agir pour contribuer.'
            }
          ]
        }
      ],
      note: 'Le GreenComp n’est pas prescriptif\u00a0: c’est une référence, pas une liste à cocher. Un cours peut se concentrer sur les quelques compétences qui correspondent à ce que font vos étudiant·es\u00a0; les 12 ont vocation à être développées sur l’ensemble d’un parcours.',
      noteCite: [{ src: 'greencomp', loc: 'p. 15, 30' }],
      attribution: 'Adapté de Bianchi, Pisiotis et Cabrera Giraldez (2022), GreenComp, CC BY 4.0.'
    },
    {
      type: 'sort',
      id: 'sort',
      title: 'Enjeu ou compétence\u00a0?',
      short: 'Quiz',
      instruction:
        'Chaque élément est-il un enjeu de durabilité (ODD) ou quelque chose que les apprenant·es deviennent capables de faire (GreenComp)\u00a0?',
      bins: [
        { id: 'sdg', label: 'Un enjeu → ODD' },
        { id: 'gc', label: 'Une compétence → GreenComp' }
      ],
      cards: [
        {
          id: 'f1',
          text: 'L’accès à l’eau potable',
          bin: 'sdg',
          feedback: 'Oui\u00a0: un enjeu (ODD 6).',
          hint: 'est-ce un problème du monde, ou une capacité\u00a0?'
        },
        {
          id: 'f2',
          text: 'Voir un problème comme un système d’interactions',
          bin: 'gc',
          feedback: 'Oui\u00a0: la pensée systémique, une compétence du GreenComp.',
          hint: 'est-ce quelque chose que les apprenant·es deviennent capables de faire\u00a0?'
        },
        {
          id: 'f3',
          text: 'Réduire les inégalités entre les pays',
          bin: 'sdg',
          feedback: 'Oui\u00a0: un enjeu (ODD 10).',
          hint: 'est-ce un problème du monde, ou une capacité\u00a0?'
        },
        {
          id: 'f4',
          text: 'Imaginer d’autres futurs possibles et la façon d’y parvenir',
          bin: 'gc',
          feedback: 'Oui\u00a0: la littératie des futurs, une compétence du GreenComp.',
          hint: 'est-ce quelque chose que les apprenant·es deviennent capables de faire\u00a0?'
        },
        {
          id: 'f5',
          text: 'Le changement climatique et ses impacts',
          bin: 'sdg',
          feedback: 'Oui\u00a0: un enjeu (ODD 13).',
          hint: 'est-ce un problème du monde, ou une capacité\u00a0?'
        },
        {
          id: 'f6',
          text: 'Agir avec d’autres pour faire advenir un changement',
          bin: 'gc',
          feedback: 'Oui\u00a0: l’action collective, une compétence du GreenComp.',
          hint: 'est-ce quelque chose que les apprenant·es deviennent capables de faire\u00a0?'
        }
      ]
    },
    {
      type: 'example',
      id: 'example',
      title: 'Les utiliser ensemble',
      short: 'Exemple',
      instruction: 'Partez d’un thème de cours et posez deux questions.',
      challengeLabel: 'L’enjeu de durabilité',
      challenge: 'L’utilisation responsable des ressources',
      sdg: {
        goal: 12,
        text: 'Peut se rattacher à l’ODD 12\u00a0: Consommation et production responsables'
      },
      question:
        'Et maintenant, que vont réellement faire les étudiant·es\u00a0? Choisissez une intention d’apprentissage\u00a0:',
      options: [
        {
          id: 'systems',
          intention:
            'Les étudiant·es analysent les relations entre l’utilisation des ressources, les procédés de production, les déchets et les impacts environnementaux.',
          competence: 'Pensée systémique',
          area: 'S’ouvrir à la complexité dans la durabilité'
        },
        {
          id: 'futures',
          intention:
            'Les étudiant·es imaginent à quoi pourrait ressembler un campus zéro déchet en 2040, et les étapes pour y arriver.',
          competence: 'Littératie des futurs',
          area: 'Envisager des avenirs durables'
        },
        {
          id: 'collective',
          intention:
            'Les étudiant·es organisent un repair café sur le campus avec des partenaires locaux.',
          competence: 'Action collective',
          area: 'Agir pour la durabilité'
        }
      ],
      lesson:
        'Même ODD, compétences différentes\u00a0: la compétence dépend de ce que les étudiant·es apprennent et font. Il n’existe pas de correspondance fixe ODD ↔ GreenComp.'
    },
    {
      type: 'myth',
      id: 'myth',
      title: 'Vrai ou faux\u00a0?',
      short: 'Idées reçues',
      trueLabel: 'Vrai',
      falseLabel: 'Faux',
      statements: [
        {
          text: 'Ajouter des logos ODD à mon syllabus suffit à en faire un cours d’EDD.',
          answer: false,
          feedback:
            'Faux. Associer un ODD à un cours ne change pas ce que les étudiant·es apprennent. L’éducation au développement durable (EDD) porte sur ce qu’elle les rend capables de comprendre et de faire.'
        },
        {
          text: 'Un cours devrait développer les 12 compétences du GreenComp.',
          answer: false,
          feedback:
            'Faux. Le GreenComp n’est pas prescriptif\u00a0: un cours peut se concentrer sur les quelques compétences qui lui correspondent.',
          cite: [{ src: 'greencomp', loc: 'p. 15, 30' }]
        },
        {
          text: 'Les ODD et le GreenComp peuvent être utilisés ensemble.',
          answer: true,
          feedback:
            'Vrai. Les ODD aident à cadrer l’enjeu, et le GreenComp aide à cadrer ce que les étudiant·es développent en y travaillant.'
        }
      ]
    }
  ],
  takeaways: [
    'Les ODD décrivent les enjeux de durabilité que vos étudiant·es abordent.',
    'Le GreenComp décrit les compétences développées en les abordant.',
    'Ce sont des références pour éclairer vos choix, pas des listes à cocher.',
    'Le lien entre un ODD et une compétence dépend de ce que font réellement les étudiant·es.'
  ]
};

export const frameworks = { en, fr };
