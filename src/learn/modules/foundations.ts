// learn module "Sustainability foundations", EN + FR: both languages keep the same structure
// ponytail: local content until the API serves it (GET /learn/modules/foundations), then this file goes away
import type { ModuleContent } from '@/types/learn/modules';

const en: ModuleContent = {
  title: 'Sustainability foundations',
  subtitle: 'Tell apart five terms you hear all the time.',
  duration: '≈ 5 min',
  hook: 'Sustainability, sustainable development, ecological transition, ESD, TEDS… These terms are often used as if they meant the same thing. They don’t, and the difference matters when you teach.',
  goal: 'In about five minutes, you will tell the five terms apart, see why they concern every discipline and understand why higher education is being asked to act now. There is nothing to memorize.',
  confidenceBefore: 'Right now, how confident are you in telling these five terms apart?',
  confidenceAfter: 'And now, how confident are you in telling these five terms apart?',
  steps: [
    {
      type: 'concepts',
      id: 'concepts',
      title: 'Five terms, five roles',
      short: 'Concepts',
      instruction: 'Open each card. Just notice what each term is for.',
      items: [
        {
          id: 'sustainability',
          term: 'Sustainability',
          role: 'The long-term goal',
          explanation:
            'A state we aim for: human activity that the planet and all forms of life can sustain over time. It is broader than protecting the environment: it also involves fairness between people and economic viability.',
          example:
            'A university asks whether its campus can operate within environmental limits while staying fair to staff and students.',
          relation:
            'Sustainability is where we want to go. The other terms describe how we get there, or how we teach it.',
          cite: [
            {
              src: 'greencomp',
              loc: 'pp. 11–12'
            }
          ]
        },
        {
          id: 'sd',
          term: 'Sustainable development',
          role: 'The pathway',
          explanation:
            'Development that “meets the needs of the present without compromising the ability of future generations to meet their own needs”. Today it is framed by the 17 Sustainable Development Goals (SDGs), which balance the economic, social and environmental dimensions.',
          example:
            'An engineering course weighs a project’s benefits today against the costs it leaves to future users.',
          relation:
            'Sustainable development is the process that leads towards sustainability. French policy texts often say “développement soutenable”.',
          cite: [
            {
              src: 'wced',
              loc: 'ch. 2, §1 (p. 54)'
            },
            {
              src: 'agenda',
              loc: 'preamble'
            },
            {
              src: 'mesr2023',
              loc: 'p. 3'
            }
          ]
        },
        {
          id: 'transition',
          term: 'Ecological transition',
          role: 'The transformation underway',
          explanation:
            'The transformation of how society works (energy, production, consumption, mobility…) to restore the planet’s viability, by putting the SDGs into practice.',
          example:
            'A business school course examines how a sector has to change its model to cut its emissions and resource use.',
          relation:
            'It names the concrete changes that societies are going through. It is not a synonym for sustainable development.',
          cite: [
            {
              src: 'jouzel',
              loc: 'p. 1'
            }
          ]
        },
        {
          id: 'esd',
          term: 'Education for Sustainable Development (ESD)',
          role: 'The educational response',
          explanation:
            'Education that gives learners the knowledge, skills, values and ability to act on sustainability issues. It is not only about teaching facts on climate or biodiversity: it is about what learners become able to understand, analyze and do.',
          example:
            'A law course where students analyze a real environmental dispute and argue a position, rather than only learning the texts.',
          relation:
            'ESD is how education contributes to sustainable development, in every discipline.',
          cite: [
            {
              src: 'roadmap'
            },
            {
              src: 'unesco2017'
            }
          ]
        },
        {
          id: 'teds',
          term: 'TEDS',
          role: 'The French higher education framing',
          explanation:
            '“Transition écologique pour un développement soutenable” (ecological transition for sustainable development): the framing used by the French Ministry of Higher Education to train all students in these issues, whatever their discipline.',
          example:
            'A first-year history program adds sessions on how past societies faced environmental change.',
          relation:
            'TEDS is the French way of putting ESD into practice in universities. It combines ecological transition and sustainable development.',
          cite: [
            {
              src: 'mesr2023',
              loc: 'p. 3'
            }
          ]
        }
      ],
      mapTitle: 'How they fit together',
      map: [
        {
          ids: ['transition', 'sd', 'sustainability'],
          arrows: ['moves societies along', 'leads towards']
        },
        {
          ids: ['esd', 'teds'],
          arrows: ['framed in French higher education as']
        }
      ]
    },
    {
      type: 'dimensions',
      id: 'dimensions',
      title: 'More than the environment',
      short: 'Dimensions',
      instruction:
        'Pick an example to see how its environmental, social and economic sides interact.',
      cite: [
        {
          src: 'agenda',
          loc: 'preamble'
        }
      ],
      labels: {
        env: 'Environmental',
        soc: 'Social',
        eco: 'Economic'
      },
      examples: [
        {
          id: 'canteen',
          label: 'Food supply for the campus canteen',
          env: 'Emissions of different meals, packaging and food waste.',
          soc: 'Affordable, healthy meals for every student; working conditions at suppliers.',
          eco: 'Costs for the university, income for local producers.',
          link: 'Choosing low-emission meals can change prices and suppliers: a decision on one side affects the others.'
        },
        {
          id: 'online',
          label: 'Moving courses online',
          env: 'Less commuting, but more devices and energy use.',
          soc: 'Access for students without good equipment or a reliable connection.',
          eco: 'Savings on buildings, spending on platforms and equipment.',
          link: 'An environmental gain can create a social cost: the dimensions have to be weighed together.'
        },
        {
          id: 'housing',
          label: 'Renovating student housing',
          env: 'Energy efficiency, choice of materials.',
          soc: 'Rents, comfort and health of the residents.',
          eco: 'Upfront investment against long-term savings.',
          link: 'The same project is an environmental, social and economic decision at once.'
        }
      ],
      closing:
        'Sustainability issues are never only environmental: the 2030 Agenda describes its goals as balancing the economic, social and environmental dimensions.'
    },
    {
      type: 'sort',
      id: 'sort',
      title: 'Which term is it?',
      short: 'Quiz',
      instruction:
        'Drag each statement onto the term it describes, or select a statement and then a term.',
      bins: [
        {
          id: 'sustainability',
          label: 'Sustainability'
        },
        {
          id: 'sd',
          label: 'Sustainable development'
        },
        {
          id: 'transition',
          label: 'Ecological transition'
        },
        {
          id: 'esd',
          label: 'ESD'
        },
        {
          id: 'teds',
          label: 'TEDS'
        }
      ],
      cards: [
        {
          id: 'c1',
          text: 'Meeting today’s needs without compromising those of future generations',
          bin: 'sd',
          feedback: 'Yes: this is the Brundtland definition of sustainable development (1987).',
          hint: 'it is a famous 1987 definition of a pathway.'
        },
        {
          id: 'c2',
          text: 'The French ministry’s framing for training all university students',
          bin: 'teds',
          feedback: 'Yes: TEDS is the framing of the French Ministry of Higher Education.',
          hint: 'look for the term that is specific to France.'
        },
        {
          id: 'c3',
          text: 'Changing how energy, production and mobility work to restore the planet’s viability',
          bin: 'transition',
          feedback: 'Yes: this describes the ecological transition, a transformation underway.',
          hint: 'it describes concrete changes in how society works.'
        },
        {
          id: 'c4',
          text: 'Helping learners become able to analyze and act, not only to know facts',
          bin: 'esd',
          feedback: 'Yes: that is what Education for Sustainable Development aims for.',
          hint: 'it is about learners.'
        },
        {
          id: 'c5',
          text: 'A long-term state where human activity stays within what the planet can sustain',
          bin: 'sustainability',
          feedback: 'Yes: sustainability is the long-term goal.',
          hint: 'it is a goal rather than a process.'
        },
        {
          id: 'c6',
          text: 'Balancing economic, social and environmental goals through the 17 SDGs',
          bin: 'sd',
          feedback: 'Yes: the SDGs are today’s framework for sustainable development.',
          hint: 'the SDGs are named after it.'
        }
      ]
    },
    {
      type: 'timeline',
      id: 'timeline',
      title: 'Why higher education, and why now?',
      short: 'Context',
      instruction: 'Open each milestone.',
      events: [
        {
          year: '2015',
          label: 'UN 2030 Agenda',
          detail:
            'All UN member states adopt the 17 SDGs. Target 4.7 asks that all learners acquire the knowledge and skills needed to promote sustainable development.',
          cite: [
            {
              src: 'agenda',
              loc: 'goal 4, target 4.7'
            }
          ]
        },
        {
          year: '2020',
          label: 'UNESCO “ESD for 2030”',
          detail:
            'UNESCO sets a roadmap for ESD for the decade. It includes building the capacities of educators.',
          cite: [
            {
              src: 'roadmap'
            }
          ]
        },
        {
          year: '2022',
          label: 'Jouzel report (France)',
          detail:
            'A working group chaired by climatologist Jean Jouzel recommends training 100% of students at Bac+2 level (the first two years of higher education), whatever their program, within five years, as an integral part of their studies.',
          cite: [
            {
              src: 'jouzel',
              loc: 'p. 3'
            }
          ]
        },
        {
          year: '2023',
          label: 'Ministry framing note (TEDS)',
          detail:
            'The ministry asks universities to give every first-cycle (bachelor’s level) student a shared foundation of knowledge and competences: at least 30 hours of teaching, ideally worth at least 3 ECTS credits.',
          cite: [
            {
              src: 'mesr2023',
              loc: 'pp. 8–9'
            }
          ]
        },
        {
          year: '2025',
          label: 'Target date',
          detail:
            'In 2022, the minister announced that all students should receive dedicated ecological transition teaching by 2025 at the latest. Universities are rolling it out now.',
          cite: [
            { src: 'mesr2022' },
            {
              src: 'mesr2023',
              loc: 'p. 3'
            }
          ]
        }
      ],
      closing:
        'Why it concerns you: these issues are expected in all disciplines (sciences, engineering, health, humanities and social sciences) and built into existing courses, not only specialist ones.',
      closingCite: [
        {
          src: 'mesr2023',
          loc: 'p. 5'
        },
        {
          src: 'jouzel'
        }
      ],
      note: 'This is an overview: you don’t need to know the regulations in detail.'
    },
    {
      type: 'sort',
      id: 'sort-2',
      title: 'Knowing is not enough',
      short: 'ESD',
      instruction:
        'ESD develops more than knowledge. Sort each learning intention by what it mainly develops.',
      cite: [
        {
          src: 'unesco2017'
        }
      ],
      bins: [
        {
          id: 'cognitive',
          label: 'Knowing and thinking'
        },
        {
          id: 'socio',
          label: 'Valuing and relating'
        },
        {
          id: 'behavioural',
          label: 'Acting'
        }
      ],
      cards: [
        {
          id: 'd1',
          text: 'Explain how a supply chain produces emissions',
          bin: 'cognitive',
          feedback: 'Yes: understanding a mechanism is mainly knowing and thinking.',
          hint: 'this one is about understanding.'
        },
        {
          id: 'd2',
          text: 'Reflect on their own values about consumption',
          bin: 'socio',
          feedback:
            'Yes: reflecting on values is valuing and relating (the socio-emotional dimension).',
          hint: 'this one is about values.'
        },
        {
          id: 'd3',
          text: 'Propose and carry out a waste-reduction plan with classmates',
          bin: 'behavioural',
          feedback: 'Yes: carrying out a plan is acting.',
          hint: 'students actually do something.'
        },
        {
          id: 'd4',
          text: 'Analyze the trade-offs between two energy options',
          bin: 'cognitive',
          feedback: 'Yes: analysing trade-offs is thinking.',
          hint: 'this one is about analysis.'
        },
        {
          id: 'd5',
          text: 'Empathize with communities affected by a project',
          bin: 'socio',
          feedback: 'Yes: empathy is relating to others.',
          hint: 'this one is about other people.'
        },
        {
          id: 'd6',
          text: 'Take part in a local sustainability initiative',
          bin: 'behavioural',
          feedback: 'Yes: taking part is acting.',
          hint: 'students take part in something real.'
        }
      ],
      closing:
        'Competence frameworks such as GreenComp describe these capabilities. They are the topic of the next module.'
    }
  ],
  takeaways: [
    'Sustainability is the goal, sustainable development the pathway and ecological transition the transformation underway.',
    'ESD is the response of education, and TEDS is how French higher education frames it.',
    'Sustainability always involves the environmental, social and economic dimensions together.',
    'In every discipline, ESD develops what learners can understand and do, not just what they know.'
  ]
};

const fr: ModuleContent = {
  title: 'Les fondamentaux de la durabilité',
  subtitle: 'Distinguez cinq termes que l’on entend partout.',
  duration: '≈ 5 min',
  hook: 'Durabilité, développement durable, transition écologique, EDD, TEDS… On emploie souvent ces termes comme s’ils étaient synonymes. Ils ne le sont pas, et la différence compte quand vous enseignez.',
  goal: 'En cinq minutes environ, vous allez distinguer les cinq termes, voir pourquoi ils concernent toutes les disciplines et comprendre pourquoi l’enseignement supérieur est appelé à agir dès maintenant. Il n’y a rien à apprendre par cœur.',
  confidenceBefore:
    'À ce stade, à quel point vous sentez-vous capable de distinguer ces cinq termes\u00a0?',
  confidenceAfter:
    'Et maintenant, à quel point vous sentez-vous capable de distinguer ces cinq termes\u00a0?',
  steps: [
    {
      type: 'concepts',
      id: 'concepts',
      title: 'Cinq termes, cinq rôles',
      short: 'Notions',
      instruction: 'Ouvrez chaque carte. Repérez simplement à quoi sert chaque terme.',
      items: [
        {
          id: 'sustainability',
          term: 'Durabilité',
          role: 'Le but à long terme',
          explanation:
            'Un état que l’on vise\u00a0: une activité humaine que la planète et toutes les formes de vie peuvent supporter dans la durée. C’est plus large que la protection de l’environnement\u00a0: cela implique aussi l’équité entre les personnes et la viabilité économique.',
          example:
            'Une université se demande si son campus peut fonctionner dans les limites environnementales tout en restant juste envers son personnel et ses étudiant·es.',
          relation:
            'La durabilité est la destination. Les autres termes décrivent comment y parvenir, ou comment l’enseigner.',
          cite: [
            {
              src: 'greencomp',
              loc: 'p. 11–12'
            }
          ]
        },
        {
          id: 'sd',
          term: 'Développement durable',
          role: 'Le chemin',
          explanation:
            'Un développement qui «\u00a0répond aux besoins du présent sans compromettre la capacité des générations futures de répondre aux leurs\u00a0». Il s’appuie aujourd’hui sur les 17 Objectifs de développement durable (ODD), qui équilibrent les dimensions économique, sociale et environnementale.',
          example:
            'Un cours d’ingénierie met en balance les bénéfices immédiats d’un projet et les coûts qu’il laisse aux futur·es usager·es.',
          relation:
            'Le développement durable est le processus qui mène vers la durabilité. Les textes publics français parlent souvent de «\u00a0développement soutenable\u00a0».',
          cite: [
            {
              src: 'wced',
              loc: 'chap. 2, §1 (p. 54)'
            },
            {
              src: 'agenda',
              loc: 'préambule'
            },
            {
              src: 'mesr2023',
              loc: 'p. 3'
            }
          ]
        },
        {
          id: 'transition',
          term: 'Transition écologique',
          role: 'La transformation en cours',
          explanation:
            'La transformation du fonctionnement de la société (énergie, production, consommation, mobilité…) pour rétablir la viabilité de la planète, en mettant en œuvre les ODD.',
          example:
            'Un cours d’école de commerce examine comment un secteur doit changer de modèle pour réduire ses émissions et sa consommation de ressources.',
          relation:
            'Elle désigne les changements concrets que traversent les sociétés. Ce n’est pas un synonyme de développement durable.',
          cite: [
            {
              src: 'jouzel',
              loc: 'p. 1'
            }
          ]
        },
        {
          id: 'esd',
          term: 'Éducation au développement durable (EDD)',
          role: 'La réponse éducative',
          explanation:
            'Une éducation qui donne aux apprenant·es les connaissances, les compétences, les valeurs et la capacité d’agir face aux enjeux de durabilité. Il ne s’agit pas seulement d’enseigner des faits sur le climat ou la biodiversité, mais de ce que les apprenant·es deviennent capables de comprendre, d’analyser et de faire.',
          example:
            'Un cours de droit où les étudiant·es analysent un véritable litige environnemental et défendent une position, au lieu de seulement apprendre les textes.',
          relation:
            'L’EDD est la façon dont l’éducation contribue au développement durable, dans toutes les disciplines.',
          cite: [
            {
              src: 'roadmap'
            },
            {
              src: 'unesco2017'
            }
          ]
        },
        {
          id: 'teds',
          term: 'TEDS',
          role: 'Le cadre de l’enseignement supérieur français',
          explanation:
            '«\u00a0Transition écologique pour un développement soutenable\u00a0»\u00a0: le cadre retenu par le ministère de l’Enseignement supérieur pour former l’ensemble des étudiant·es à ces enjeux, quelle que soit leur discipline.',
          example:
            'Une licence d’histoire ajoute des séances sur la façon dont les sociétés passées ont fait face aux changements environnementaux.',
          relation:
            'La TEDS est la manière française de mettre l’EDD en pratique à l’université. Elle associe transition écologique et développement soutenable.',
          cite: [
            {
              src: 'mesr2023',
              loc: 'p. 3'
            }
          ]
        }
      ],
      mapTitle: 'Comment ils s’articulent',
      map: [
        {
          ids: ['transition', 'sd', 'sustainability'],
          arrows: ['fait avancer les sociétés sur le', 'mène vers la']
        },
        {
          ids: ['esd', 'teds'],
          arrows: ['se traduit dans l’enseignement supérieur français par la']
        }
      ]
    },
    {
      type: 'dimensions',
      id: 'dimensions',
      title: 'Bien plus que l’environnement',
      short: 'Dimensions',
      instruction:
        'Choisissez un exemple pour voir comment ses aspects environnementaux, sociaux et économiques interagissent.',
      cite: [
        {
          src: 'agenda',
          loc: 'préambule'
        }
      ],
      labels: {
        env: 'Environnemental',
        soc: 'Social',
        eco: 'Économique'
      },
      examples: [
        {
          id: 'canteen',
          label: 'L’approvisionnement du restaurant universitaire',
          env: 'Les émissions des différents repas, les emballages et le gaspillage alimentaire.',
          soc: 'Des repas abordables et sains pour chaque étudiant·e\u00a0; les conditions de travail chez les fournisseurs.',
          eco: 'Les coûts pour l’université, les revenus des producteurs locaux.',
          link: 'Choisir des repas moins émetteurs peut changer les prix et les fournisseurs\u00a0: une décision d’un côté se répercute sur les autres.'
        },
        {
          id: 'online',
          label: 'Le passage des cours en ligne',
          env: 'Moins de trajets, mais plus d’équipements et d’énergie consommée.',
          soc: 'L’accès des étudiant·es qui n’ont ni bon équipement ni connexion fiable.',
          eco: 'Des économies sur les locaux, des dépenses en plateformes et en matériel.',
          link: 'Un gain environnemental peut créer un coût social\u00a0: il faut peser les dimensions ensemble.'
        },
        {
          id: 'housing',
          label: 'La rénovation des logements étudiants',
          env: 'L’efficacité énergétique, le choix des matériaux.',
          soc: 'Les loyers, le confort et la santé des résidents.',
          eco: 'L’investissement initial face aux économies à long terme.',
          link: 'Le même projet est à la fois une décision environnementale, sociale et économique.'
        }
      ],
      closing:
        'Les enjeux de durabilité ne sont jamais seulement environnementaux\u00a0: l’Agenda 2030 présente ses objectifs comme un équilibre entre les dimensions économique, sociale et environnementale.'
    },
    {
      type: 'sort',
      id: 'sort',
      title: 'De quel terme s’agit-il\u00a0?',
      short: 'Quiz',
      instruction:
        'Faites glisser chaque énoncé sur le terme qu’il décrit, ou sélectionnez un énoncé puis un terme.',
      bins: [
        {
          id: 'sustainability',
          label: 'Durabilité'
        },
        {
          id: 'sd',
          label: 'Développement durable'
        },
        {
          id: 'transition',
          label: 'Transition écologique'
        },
        {
          id: 'esd',
          label: 'EDD'
        },
        {
          id: 'teds',
          label: 'TEDS'
        }
      ],
      cards: [
        {
          id: 'c1',
          text: 'Répondre aux besoins d’aujourd’hui sans compromettre ceux des générations futures',
          bin: 'sd',
          feedback:
            'Oui\u00a0: c’est la définition du développement durable donnée par le rapport Brundtland (1987).',
          hint: 'c’est une définition célèbre d’un chemin, qui date de 1987.'
        },
        {
          id: 'c2',
          text: 'Le cadre du ministère pour former l’ensemble des étudiant·es des universités',
          bin: 'teds',
          feedback: 'Oui\u00a0: la TEDS est le cadre du ministère de l’Enseignement supérieur.',
          hint: 'cherchez le terme propre à la France.'
        },
        {
          id: 'c3',
          text: 'Changer le fonctionnement de l’énergie, de la production et de la mobilité pour rétablir la viabilité de la planète',
          bin: 'transition',
          feedback: 'Oui\u00a0: cela décrit la transition écologique, une transformation en cours.',
          hint: 'il s’agit de changements concrets dans le fonctionnement de la société.'
        },
        {
          id: 'c4',
          text: 'Aider les apprenant·es à devenir capables d’analyser et d’agir, pas seulement de connaître des faits',
          bin: 'esd',
          feedback: 'Oui\u00a0: c’est ce que vise l’éducation au développement durable.',
          hint: 'il s’agit des apprenant·es.'
        },
        {
          id: 'c5',
          text: 'Un état, à long terme, où l’activité humaine reste dans les limites de ce que la planète peut supporter',
          bin: 'sustainability',
          feedback: 'Oui\u00a0: la durabilité est le but à long terme.',
          hint: 'c’est un but plutôt qu’un processus.'
        },
        {
          id: 'c6',
          text: 'Équilibrer objectifs économiques, sociaux et environnementaux à travers les 17 ODD',
          bin: 'sd',
          feedback: 'Oui\u00a0: les ODD sont aujourd’hui le cadre du développement durable.',
          hint: 'les ODD portent son nom.'
        }
      ]
    },
    {
      type: 'timeline',
      id: 'timeline',
      title: 'Pourquoi l’enseignement supérieur, et pourquoi maintenant\u00a0?',
      short: 'Contexte',
      instruction: 'Ouvrez chaque étape.',
      events: [
        {
          year: '2015',
          label: 'Agenda 2030 de l’ONU',
          detail:
            'Tous les États membres de l’ONU adoptent les 17 ODD. La cible 4.7 demande que tous les élèves acquièrent les connaissances et les compétences nécessaires pour promouvoir le développement durable.',
          cite: [
            {
              src: 'agenda',
              loc: 'objectif 4, cible 4.7'
            }
          ]
        },
        {
          year: '2020',
          label: 'UNESCO «\u00a0EDD pour 2030\u00a0»',
          detail:
            'L’UNESCO fixe une feuille de route pour l’EDD sur la décennie. Elle prévoit notamment de renforcer les capacités des éducateurs.',
          cite: [
            {
              src: 'roadmap'
            }
          ]
        },
        {
          year: '2022',
          label: 'Rapport Jouzel (France)',
          detail:
            'Un groupe de travail présidé par le climatologue Jean Jouzel recommande de former d’ici cinq ans 100\u00a0% des étudiant·es de niveau bac+2, quel que soit leur cursus, aux enjeux de la transition écologique, comme partie intégrante de leur formation.',
          cite: [
            {
              src: 'jouzel',
              loc: 'p. 3'
            }
          ]
        },
        {
          year: '2023',
          label: 'Note de cadrage du ministère (TEDS)',
          detail:
            'Le ministère demande aux universités d’offrir à chaque étudiant·e de premier cycle un socle commun de connaissances et de compétences\u00a0: au moins 30 heures d’enseignement, valant de préférence au moins 3 crédits ECTS.',
          cite: [
            {
              src: 'mesr2023',
              loc: 'p. 8–9'
            }
          ]
        },
        {
          year: '2025',
          label: 'Échéance',
          detail:
            'En 2022, la ministre a annoncé que l’ensemble des étudiant·es devraient recevoir des enseignements spécifiques à la transition écologique au plus tard en 2025. Les universités les déploient en ce moment.',
          cite: [
            { src: 'mesr2022' },
            {
              src: 'mesr2023',
              loc: 'p. 3'
            }
          ]
        }
      ],
      closing:
        'Pourquoi cela vous concerne\u00a0: ces enjeux sont attendus dans toutes les disciplines (sciences, ingénierie, santé, sciences humaines et sociales) et intégrés aux cours existants, pas seulement aux cours spécialisés.',
      closingCite: [
        {
          src: 'mesr2023',
          loc: 'p. 5'
        },
        {
          src: 'jouzel'
        }
      ],
      note: 'Il s’agit d’un aperçu\u00a0: inutile de connaître la réglementation en détail.'
    },
    {
      type: 'sort',
      id: 'sort-2',
      title: 'Savoir ne suffit pas',
      short: 'EDD',
      instruction:
        'L’EDD développe plus que des connaissances. Classez chaque intention d’apprentissage selon ce qu’elle développe principalement.',
      cite: [
        {
          src: 'unesco2017'
        }
      ],
      bins: [
        {
          id: 'cognitive',
          label: 'Connaissances et réflexion'
        },
        {
          id: 'socio',
          label: 'Valeurs et relations'
        },
        {
          id: 'behavioural',
          label: 'Action'
        }
      ],
      cards: [
        {
          id: 'd1',
          text: 'Expliquer comment une chaîne d’approvisionnement produit des émissions',
          bin: 'cognitive',
          feedback:
            'Oui\u00a0: comprendre un mécanisme relève surtout des connaissances et de la réflexion.',
          hint: 'il s’agit de comprendre.'
        },
        {
          id: 'd2',
          text: 'Réfléchir à ses propres valeurs en matière de consommation',
          bin: 'socio',
          feedback:
            'Oui\u00a0: réfléchir à ses valeurs relève des valeurs et des relations (la dimension socio-émotionnelle).',
          hint: 'il s’agit de valeurs.'
        },
        {
          id: 'd3',
          text: 'Proposer et mener un plan de réduction des déchets avec ses camarades',
          bin: 'behavioural',
          feedback: 'Oui\u00a0: mener un plan, c’est agir.',
          hint: 'les étudiant·es font réellement quelque chose.'
        },
        {
          id: 'd4',
          text: 'Analyser les compromis entre deux options énergétiques',
          bin: 'cognitive',
          feedback: 'Oui\u00a0: analyser des compromis, c’est réfléchir.',
          hint: 'il s’agit d’analyser.'
        },
        {
          id: 'd5',
          text: 'Faire preuve d’empathie envers les populations touchées par un projet',
          bin: 'socio',
          feedback: 'Oui\u00a0: l’empathie, c’est entrer en relation avec les autres.',
          hint: 'il s’agit de la relation aux autres.'
        },
        {
          id: 'd6',
          text: 'Participer à une initiative locale en faveur de la durabilité',
          bin: 'behavioural',
          feedback: 'Oui\u00a0: participer, c’est agir.',
          hint: 'les étudiant·es prennent part à quelque chose de réel.'
        }
      ],
      closing:
        'Les référentiels de compétences comme le GreenComp décrivent ces capacités. C’est l’objet du module suivant.'
    }
  ],
  takeaways: [
    'La durabilité est le but, le développement durable le chemin et la transition écologique la transformation en cours.',
    'L’EDD est la réponse de l’éducation, et la TEDS est la façon dont l’enseignement supérieur français la met en œuvre.',
    'La durabilité associe toujours les dimensions environnementale, sociale et économique.',
    'Dans toutes les disciplines, l’EDD développe ce que les apprenant·es sont capables de comprendre et de faire, pas seulement leurs connaissances.'
  ]
};

export const foundations = { en, fr };
