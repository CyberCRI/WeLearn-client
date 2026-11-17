// text of the learn module "Sustainability foundations" in French, keyed by the ids of its structure
import type { FOUNDATIONS } from '@/learn/modules/foundations';
import type { ModuleText } from '@/types/learn/modules';

export const foundations: ModuleText<typeof FOUNDATIONS> = {
  title: 'Les fondamentaux de la durabilité',
  subtitle: 'Distinguez cinq termes que l’on entend partout.',
  duration: '≈ 5 min',
  hook: 'Durabilité, développement durable, transition écologique, EDD, TEDS… On emploie souvent ces termes comme s’ils étaient synonymes. Ils ne le sont pas, et la différence compte quand vous enseignez.',
  goal: 'En cinq minutes environ, vous allez distinguer les cinq termes, voir pourquoi ils concernent toutes les disciplines et comprendre pourquoi l’enseignement supérieur est appelé à agir dès maintenant. Il n’y a rien à apprendre par cœur.',
  confidenceBefore:
    'À ce stade, à quel point vous sentez-vous capable de distinguer ces cinq termes ?',
  confidenceAfter:
    'Et maintenant, à quel point vous sentez-vous capable de distinguer ces cinq termes ?',
  takeaways: [
    'La durabilité est le but, le développement durable le chemin et la transition écologique la transformation en cours.',
    'L’EDD est la réponse de l’éducation, et la TEDS est la façon dont l’enseignement supérieur français la met en œuvre.',
    'La durabilité associe toujours les dimensions environnementale, sociale et économique.',
    'Dans toutes les disciplines, l’EDD développe ce que les apprenant·es sont capables de comprendre et de faire, pas seulement leurs connaissances.'
  ],
  steps: {
    concepts: {
      title: 'Cinq termes, cinq rôles',
      short: 'Notions',
      instruction: 'Ouvrez chaque carte. Repérez simplement à quoi sert chaque terme.',
      items: {
        sustainability: {
          term: 'Durabilité',
          role: 'Le but à long terme',
          explanation:
            'Un état que l’on vise : une activité humaine que la planète et toutes les formes de vie peuvent supporter dans la durée. C’est plus large que la protection de l’environnement : cela implique aussi l’équité entre les personnes et la viabilité économique.',
          example:
            'Une université se demande si son campus peut fonctionner dans les limites environnementales tout en restant juste envers son personnel et ses étudiant·es.',
          relation:
            'La durabilité est la destination. Les autres termes décrivent comment y parvenir, ou comment l’enseigner.',
          cite: [{ src: 'greencomp', loc: 'p. 11–12' }]
        },
        sd: {
          term: 'Développement durable',
          role: 'Le chemin',
          explanation:
            'Un développement qui « répond aux besoins du présent sans compromettre la capacité des générations futures de répondre aux leurs ». Il s’appuie aujourd’hui sur les 17 Objectifs de développement durable (ODD), qui équilibrent les dimensions économique, sociale et environnementale.',
          example:
            'Un cours d’ingénierie met en balance les bénéfices immédiats d’un projet et les coûts qu’il laisse aux futur·es usager·es.',
          relation:
            'Le développement durable est le processus qui mène vers la durabilité. Les textes publics français parlent souvent de « développement soutenable ».',
          cite: [
            { src: 'wced', loc: 'chap. 2, §1 (p. 54)' },
            { src: 'agenda', loc: 'préambule' },
            { src: 'mesr2023', loc: 'p. 3' }
          ]
        },
        transition: {
          term: 'Transition écologique',
          role: 'La transformation en cours',
          explanation:
            'La transformation du fonctionnement de la société (énergie, production, consommation, mobilité…) pour rétablir la viabilité de la planète, en mettant en œuvre les ODD.',
          example:
            'Un cours d’école de commerce examine comment un secteur doit changer de modèle pour réduire ses émissions et sa consommation de ressources.',
          relation:
            'Elle désigne les changements concrets que traversent les sociétés. Ce n’est pas un synonyme de développement durable.',
          cite: [{ src: 'jouzel', loc: 'p. 1' }]
        },
        esd: {
          term: 'Éducation au développement durable (EDD)',
          role: 'La réponse éducative',
          explanation:
            'Une éducation qui donne aux apprenant·es les connaissances, les compétences, les valeurs et la capacité d’agir face aux enjeux de durabilité. Il ne s’agit pas seulement d’enseigner des faits sur le climat ou la biodiversité, mais de ce que les apprenant·es deviennent capables de comprendre, d’analyser et de faire.',
          example:
            'Un cours de droit où les étudiant·es analysent un véritable litige environnemental et défendent une position, au lieu de seulement apprendre les textes.',
          relation:
            'L’EDD est la façon dont l’éducation contribue au développement durable, dans toutes les disciplines.',
          cite: [{ src: 'roadmap' }, { src: 'unesco2017' }]
        },
        teds: {
          term: 'TEDS',
          role: 'Le cadre de l’enseignement supérieur français',
          explanation:
            '« Transition écologique pour un développement soutenable » : le cadre retenu par le ministère de l’Enseignement supérieur pour former l’ensemble des étudiant·es à ces enjeux, quelle que soit leur discipline.',
          example:
            'Une licence d’histoire ajoute des séances sur la façon dont les sociétés passées ont fait face aux changements environnementaux.',
          relation:
            'La TEDS est la manière française de mettre l’EDD en pratique à l’université. Elle associe transition écologique et développement soutenable.',
          cite: [{ src: 'mesr2023', loc: 'p. 3' }]
        }
      },
      map: [
        { arrows: ['fait avancer les sociétés sur le', 'mène vers la'] },
        { arrows: ['se traduit dans l’enseignement supérieur français par la'] }
      ]
    },
    dimensions: {
      title: 'Bien plus que l’environnement',
      short: 'Dimensions',
      instruction:
        'Choisissez un exemple pour voir comment ses aspects environnementaux, sociaux et économiques interagissent.',
      cite: [{ src: 'agenda', loc: 'préambule' }],
      examples: {
        canteen: {
          label: 'L’approvisionnement du restaurant universitaire',
          env: 'Les émissions des différents repas, les emballages et le gaspillage alimentaire.',
          soc: 'Des repas abordables et sains pour chaque étudiant·e ; les conditions de travail chez les fournisseurs.',
          eco: 'Les coûts pour l’université, les revenus des producteurs locaux.',
          link: 'Choisir des repas moins émetteurs peut changer les prix et les fournisseurs : une décision d’un côté se répercute sur les autres.'
        },
        online: {
          label: 'Le passage des cours en ligne',
          env: 'Moins de trajets, mais plus d’équipements et d’énergie consommée.',
          soc: 'L’accès des étudiant·es qui n’ont ni bon équipement ni connexion fiable.',
          eco: 'Des économies sur les locaux, des dépenses en plateformes et en matériel.',
          link: 'Un gain environnemental peut créer un coût social : il faut peser les dimensions ensemble.'
        },
        housing: {
          label: 'La rénovation des logements étudiants',
          env: 'L’efficacité énergétique, le choix des matériaux.',
          soc: 'Les loyers, le confort et la santé des résidents.',
          eco: 'L’investissement initial face aux économies à long terme.',
          link: 'Le même projet est à la fois une décision environnementale, sociale et économique.'
        }
      },
      closing:
        'Les enjeux de durabilité ne sont jamais seulement environnementaux : l’Agenda 2030 présente ses objectifs comme un équilibre entre les dimensions économique, sociale et environnementale.'
    },
    sort: {
      title: 'De quel terme s’agit-il ?',
      short: 'Quiz',
      instruction:
        'Faites glisser chaque énoncé sur le terme qu’il décrit, ou sélectionnez un énoncé puis un terme.',
      bins: {
        sustainability: 'Durabilité',
        sd: 'Développement durable',
        transition: 'Transition écologique',
        esd: 'EDD',
        teds: 'TEDS'
      },
      cards: {
        c1: {
          text: 'Répondre aux besoins d’aujourd’hui sans compromettre ceux des générations futures',
          feedback:
            'Oui : c’est la définition du développement durable donnée par le rapport Brundtland (1987).',
          hint: 'c’est une définition célèbre d’un chemin, qui date de 1987.'
        },
        c2: {
          text: 'Le cadre du ministère pour former l’ensemble des étudiant·es des universités',
          feedback: 'Oui : la TEDS est le cadre du ministère de l’Enseignement supérieur.',
          hint: 'cherchez le terme propre à la France.'
        },
        c3: {
          text: 'Changer le fonctionnement de l’énergie, de la production et de la mobilité pour rétablir la viabilité de la planète',
          feedback: 'Oui : cela décrit la transition écologique, une transformation en cours.',
          hint: 'il s’agit de changements concrets dans le fonctionnement de la société.'
        },
        c4: {
          text: 'Aider les apprenant·es à devenir capables d’analyser et d’agir, pas seulement de connaître des faits',
          feedback: 'Oui : c’est ce que vise l’éducation au développement durable.',
          hint: 'il s’agit des apprenant·es.'
        },
        c5: {
          text: 'Un état, à long terme, où l’activité humaine reste dans les limites de ce que la planète peut supporter',
          feedback: 'Oui : la durabilité est le but à long terme.',
          hint: 'c’est un but plutôt qu’un processus.'
        },
        c6: {
          text: 'Équilibrer objectifs économiques, sociaux et environnementaux à travers les 17 ODD',
          feedback: 'Oui : les ODD sont aujourd’hui le cadre du développement durable.',
          hint: 'les ODD portent son nom.'
        }
      }
    },
    timeline: {
      title: 'Pourquoi l’enseignement supérieur, et pourquoi maintenant ?',
      short: 'Contexte',
      instruction: 'Ouvrez chaque étape.',
      events: [
        {
          label: 'Agenda 2030 de l’ONU',
          detail:
            'Tous les États membres de l’ONU adoptent les 17 ODD. La cible 4.7 demande que tous les élèves acquièrent les connaissances et les compétences nécessaires pour promouvoir le développement durable.',
          cite: [{ src: 'agenda', loc: 'objectif 4, cible 4.7' }]
        },
        {
          label: 'UNESCO « EDD pour 2030 »',
          detail:
            'L’UNESCO fixe une feuille de route pour l’EDD sur la décennie. Elle prévoit notamment de renforcer les capacités des éducateurs.',
          cite: [{ src: 'roadmap' }]
        },
        {
          label: 'Rapport Jouzel (France)',
          detail:
            'Un groupe de travail présidé par le climatologue Jean Jouzel recommande de former d’ici cinq ans 100 % des étudiant·es de niveau bac+2, quel que soit leur cursus, aux enjeux de la transition écologique, comme partie intégrante de leur formation.',
          cite: [{ src: 'jouzel', loc: 'p. 3' }]
        },
        {
          label: 'Note de cadrage du ministère (TEDS)',
          detail:
            'Le ministère demande aux universités d’offrir à chaque étudiant·e de premier cycle un socle commun de connaissances et de compétences : au moins 30 heures d’enseignement, valant de préférence au moins 3 crédits ECTS.',
          cite: [{ src: 'mesr2023', loc: 'p. 8–9' }]
        },
        {
          label: 'Échéance',
          detail:
            'En 2022, la ministre a annoncé que l’ensemble des étudiant·es devraient recevoir des enseignements spécifiques à la transition écologique au plus tard en 2025. Les universités les déploient en ce moment.',
          cite: [{ src: 'mesr2022' }, { src: 'mesr2023', loc: 'p. 3' }]
        }
      ],
      closing:
        'Pourquoi cela vous concerne : ces enjeux sont attendus dans toutes les disciplines (sciences, ingénierie, santé, sciences humaines et sociales) et intégrés aux cours existants, pas seulement aux cours spécialisés.',
      closingCite: [{ src: 'mesr2023', loc: 'p. 5' }, { src: 'jouzel' }],
      note: 'Il s’agit d’un aperçu : inutile de connaître la réglementation en détail.'
    },
    'sort-2': {
      title: 'Savoir ne suffit pas',
      short: 'EDD',
      instruction:
        'L’EDD développe plus que des connaissances. Classez chaque intention d’apprentissage selon ce qu’elle développe principalement.',
      cite: [{ src: 'unesco2017' }],
      bins: {
        cognitive: 'Connaissances et réflexion',
        socio: 'Valeurs et relations',
        behavioural: 'Action'
      },
      cards: {
        d1: {
          text: 'Expliquer comment une chaîne d’approvisionnement produit des émissions',
          feedback:
            'Oui : comprendre un mécanisme relève surtout des connaissances et de la réflexion.',
          hint: 'il s’agit de comprendre.'
        },
        d2: {
          text: 'Réfléchir à ses propres valeurs en matière de consommation',
          feedback:
            'Oui : réfléchir à ses valeurs relève des valeurs et des relations (la dimension socio-émotionnelle).',
          hint: 'il s’agit de valeurs.'
        },
        d3: {
          text: 'Proposer et mener un plan de réduction des déchets avec ses camarades',
          feedback: 'Oui : mener un plan, c’est agir.',
          hint: 'les étudiant·es font réellement quelque chose.'
        },
        d4: {
          text: 'Analyser les compromis entre deux options énergétiques',
          feedback: 'Oui : analyser des compromis, c’est réfléchir.',
          hint: 'il s’agit d’analyser.'
        },
        d5: {
          text: 'Faire preuve d’empathie envers les populations touchées par un projet',
          feedback: 'Oui : l’empathie, c’est entrer en relation avec les autres.',
          hint: 'il s’agit de la relation aux autres.'
        },
        d6: {
          text: 'Participer à une initiative locale en faveur de la durabilité',
          feedback: 'Oui : participer, c’est agir.',
          hint: 'les étudiant·es prennent part à quelque chose de réel.'
        }
      },
      closing:
        'Les référentiels de compétences comme le GreenComp décrivent ces capacités. C’est l’objet du module suivant.'
    }
  }
};
