// text of the learn module "Sustainability in your discipline" in French, per discipline.
// flip.statement, flip.closing and activities.feedback are not shown by the current screens
import type { DISCIPLINES } from '@/learn/modules/discipline';
import type { DisciplinesText } from '@/types/learn/discipline';

export const discipline: DisciplinesText<typeof DISCIPLINES> = {
  math: {
    flip: {
      statement: 'Vous enseignez déjà les outils de la transition écologique.',
      closing:
        "Ces apports sont déjà intégrés dans votre discipline. Vous n'avez pas besoin d'ajouter de nouveaux contenus : il s'agit de rendre la connexion visible pour vos étudiant·es."
    },
    contributions: [
      {
        verb: 'Mesurer et représenter',
        text: "Vous apprenez à vos étudiant·es à lire, analyser et visualiser des données. C'est exactement ainsi que des enjeux comme le changement climatique et la perte de biodiversité sont suivis. Par exemple, en analysant l'évolution des émissions de CO₂ en France sur plusieurs décennies.",
        activities: [
          {
            title: 'Analyser les températures locales',
            desc: "Les étudiant·es travaillent sur des données réelles de températures historiques pour identifier des tendances et des variables clés à l'aide d'outils statistiques déjà connus."
          },
          {
            title: 'Critiquer une représentation de données climatiques',
            desc: "Les étudiant·es comparent deux graphiques représentant les mêmes données climatiques de façon différente et analysent ce que chaque représentation met en valeur et ce qu'elle cache."
          }
        ]
      },
      {
        verb: 'Modéliser',
        text: "Simuler l'évolution du climat ou prédire la dynamique des écosystèmes repose sur des modèles mathématiques. Vous apprenez à vos étudiant·es à construire ce type de raisonnement. Par exemple, modéliser comment une ville évolue face à la hausse des températures et au risque d'inondation.",
        activities: [
          {
            title: "Modéliser l'évolution d'une ville face à la montée des eaux",
            desc: "Les étudiant·es construisent un modèle simple de l'évolution d'une ville menacée par la montée des eaux, à l'aide des équations différentielles ou des fonctions déjà vues en cours."
          },
          {
            title: "Simuler la propagation d'une espèce invasive",
            desc: "À partir de données réelles sur une espèce invasive, les étudiant·es utilisent des fonctions exponentielles ou logistiques pour modéliser et prédire l'évolution de la population."
          }
        ]
      },
      {
        verb: 'Optimiser',
        text: "Optimiser les ressources et l'énergie est au cœur de la transition. Vous enseignez les outils qui permettent de les résoudre. Par exemple, calculer comment distribuer l'électricité sur un réseau électrique intelligent (smart grid) pour minimiser les pertes.",
        activities: [
          {
            title: "Optimiser la distribution d'énergie renouvelable",
            desc: "Les étudiant·es résolvent un problème d'optimisation : comment distribuer l'électricité produite par des panneaux solaires dans un quartier pour minimiser les pertes et les coûts."
          },
          {
            title: 'Comparer deux systèmes de transport',
            desc: "Comparer mathématiquement deux systèmes de transport (voiture individuelle et transports en commun) selon des critères d'énergie, de temps et d'émissions. Un problème d'optimisation multicritère."
          }
        ]
      },
      {
        verb: 'Aider à la décision',
        text: "La transition nécessite des indicateurs pour guider les décisions politiques et économiques. Vous apprenez à vos étudiant·es à construire et interpréter ces outils. Par exemple, calculer l'empreinte carbone d'un produit sur l'ensemble de son cycle de vie.",
        activities: [
          {
            title: "Comparer l'empreinte carbone de deux modes de vie",
            desc: "Les étudiant·es comparent l'empreinte carbone de deux profils d'étudiant·e avec des modes de vie différents : transport, alimentation, énergie. Des chiffres concrets, des maths familières."
          },
          {
            title: 'Construire un indicateur de durabilité',
            desc: "Les étudiant·es conçoivent un indice simple pour évaluer la durabilité d'un territoire, en choisissant leurs variables et en justifiant leurs pondérations. L'exercice révèle ainsi la complexité des choix derrière tout indicateur."
          }
        ]
      }
    ],
    competences: {
      intro:
        'En étudiant la transition écologique à travers les mathématiques, vos étudiant·es développent des compétences qui dépassent le calcul. En voici les plus significatives.',
      featured: [
        {
          name: 'Pensée critique',
          concrete:
            "Vos étudiant·es apprennent à interroger les choix de paramètres dans un modèle climatique : pourquoi ces données et pas d'autres ? Quelles sont les limites et les incertitudes du modèle ?"
        },
        {
          name: 'Interdisciplinarité',
          concrete:
            "En croisant mathématiques et climatologie, vos étudiant·es comprennent pourquoi les marges d'incertitude du GIEC sont exprimées en probabilités et comment différentes disciplines collaborent pour produire des connaissances."
        },
        {
          name: 'Responsabilité et éthique',
          concrete:
            "Vos étudiant·es s'interrogent sur ce qu'un modèle peut ou non dire : où passe la frontière entre l'efficace, le probable et le souhaitable en matière de politiques climatiques ?"
        }
      ],
      also: [
        'Modéliser les socio-écosystèmes',
        'Mener des analyses statistiques et probabilistes',
        'Résoudre des équations différentielles',
        'Traduire des problèmes concrets en équations',
        'Évaluer la fiabilité des données',
        'Raisonner en scénarios',
        'Communiquer des résultats complexes'
      ]
    },
    activities: {
      feedback:
        "Bonne idée. Cette activité peut s'intégrer directement dans une séance existante sans modifier votre programme."
    },
    reflection: {
      sub: "Vous venez de découvrir comment les mathématiques s'inscrivent dans la transition écologique. Prenez un moment pour faire le lien avec votre propre enseignement.",
      prompts: [
        {
          q: 'Quel concept que vous enseignez pourrait être relié à la transition écologique et au développement soutenable (TEDS) ?',
          placeholder:
            "Par exemple : les fonctions exponentielles, les probabilités, l'analyse de données"
        },
        {
          q: 'Comment imaginez-vous faire cette connexion dans votre prochain cours ?',
          placeholder:
            'Par exemple : remplacer une illustration générique par des données climatiques réelles'
        }
      ],
      resourceTitle: 'Mathématiques & Transition écologique'
    }
  },
  history: {
    flip: {
      statement: "L'histoire éclaire déjà les enjeux de la transition écologique.",
      closing:
        'Votre discipline offre une perspective systémique, critique et contextualisée sur la transition écologique.'
    },
    contributions: [
      {
        verb: 'Comprendre',
        text: "L'histoire analyse les relations entre sociétés et environnement sur le temps long.",
        activities: [
          {
            title: 'Analyser des archives industrielles',
            desc: "Les étudiant·es examinent des archives de la révolution industrielle sous l'angle de ses impacts environnementaux."
          },
          {
            title: 'Étudier une catastrophe écologique',
            desc: 'Analyser une grande catastrophe (marée noire, accident industriel) comme révélateur des tensions entre économie, politique et environnement.'
          }
        ]
      },
      {
        verb: 'Analyser',
        text: 'Elle décrypte comment les sociétés répondent aux défis environnementaux.',
        activities: [
          {
            title: 'Comparer la gestion des ressources de deux sociétés',
            desc: 'Mettre en regard deux sociétés : la Rome antique, confrontée à la surexploitation agricole, et une société ayant réussi sa transition.'
          },
          {
            title: 'Débat : la révolution industrielle, une catastrophe écologique ?',
            desc: '« La révolution industrielle était-elle inévitablement une catastrophe écologique ? » Les étudiant·es argumentent à partir de sources historiques.'
          }
        ]
      },
      {
        verb: 'Éclairer',
        text: 'Elle tire des leçons des expériences passées pour guider les politiques actuelles.',
        activities: [
          {
            title: 'Relier passé et présent',
            desc: "Les étudiant·es identifient les racines historiques d'un problème écologique contemporain et en tirent des leçons pour les politiques actuelles."
          },
          {
            title: 'Écrire un récit prospectif',
            desc: "Rédiger un court récit prospectif à partir de tendances historiques identifiées, pour comprendre l'importance des récits collectifs."
          }
        ]
      },
      {
        verb: 'Contextualiser',
        text: 'Elle met au jour les racines historiques des problèmes écologiques actuels.',
        activities: [
          {
            title: 'Construire une frise chronologique des pressions anthropiques',
            desc: "Les étudiant·es construisent une frise des grandes étapes de l'accroissement des pressions humaines sur l'environnement."
          },
          {
            title: "Analyser un ODD à travers l'histoire",
            desc: 'Choisir un objectif de développement durable (ODD) et retracer ses racines historiques. Une introduction historique aux ODD.'
          }
        ]
      }
    ],
    competences: {
      intro:
        "En étudiant la transition écologique à travers l'histoire, vos étudiant·es développent des compétences essentielles. En voici les plus significatives.",
      featured: [
        {
          name: 'Pensée critique',
          concrete:
            'Les étudiant·es apprennent à identifier et croiser plusieurs types de sources sur les crises environnementales passées.'
        },
        {
          name: 'Analyse systémique',
          concrete:
            'En croisant les apports de plusieurs disciplines pour analyser le passé, les étudiant·es comprennent les interactions complexes entre sociétés et environnement.'
        },
        {
          name: 'Conscience citoyenne',
          concrete:
            'Les étudiant·es situent leur responsabilité, individuelle et collective, face aux transformations à engager.'
        }
      ],
      also: [
        "Identifier les sources de l'histoire environnementale",
        'Analyser des transformations socio-environnementales',
        "Situer des événements dans le temps et dans l'espace",
        'Comparer différentes périodes historiques',
        'Proposer des solutions'
      ]
    },
    activities: {
      feedback: "Parfait. Cette activité s'intègre directement dans une séance existante."
    },
    reflection: {
      sub: "Vous venez de découvrir comment l'histoire s'inscrit dans la transition écologique. Prenez un moment pour faire le lien avec votre propre enseignement.",
      prompts: [
        {
          q: 'Quelle période ou quel événement de votre cours a la dimension environnementale la plus visible ?',
          placeholder:
            'Par exemple : la révolution industrielle, la décolonisation, les grandes catastrophes'
        },
        {
          q: 'Comment imaginez-vous introduire cette dimension dans votre prochain cours ?',
          placeholder:
            "Par exemple : ajouter une question sur les impacts environnementaux d'un événement étudié"
        }
      ],
      resourceTitle: 'Histoire & Transition écologique'
    }
  },
  economics: {
    flip: {
      statement: 'Vous enseignez déjà les outils de la transition écologique.',
      closing:
        "L'économie propose une diversité d'approches pour articuler durabilité, prospérité et justice sociale."
    },
    contributions: [
      {
        verb: 'Diagnostiquer',
        text: "Estimer le coût des dégradations environnementales et évaluer les bénéfices d'une exploitation durable des ressources.",
        activities: [
          {
            title: "Calculer le coût de l'inaction climatique",
            desc: "Les étudiant·es utilisent les données du rapport Stern pour estimer le coût économique de l'inaction climatique et le comparer à celui des politiques d'atténuation."
          },
          {
            title: "Analyser les externalités d'une industrie",
            desc: "Identifier et quantifier les externalités négatives d'un secteur industriel (pollution, perte de biodiversité). Qui paie ces coûts et comment ?"
          }
        ]
      },
      {
        verb: 'Réguler',
        text: "Proposer des instruments économiques comme la fiscalité ou les subventions pour réduire l'empreinte environnementale.",
        activities: [
          {
            title: 'Débat : la taxe carbone',
            desc: "« À quelles conditions une taxe carbone peut-elle être un outil juste et efficace ? » Les étudiant·es défendent des positions en s'appuyant sur des données économiques et des critères d'équité."
          },
          {
            title: 'Simuler une négociation climatique (COP)',
            desc: "Les étudiant·es représentent différents pays dans une négociation climatique, en mobilisant les notions de biens publics et d'externalités et en arbitrant entre développement et atténuation."
          }
        ]
      },
      {
        verb: 'Modéliser',
        text: 'Construire des modèles alternatifs : économie circulaire, décroissance, économie écologique, limites planétaires.',
        activities: [
          {
            title: 'Modéliser une économie circulaire',
            desc: 'À partir des critères mathématiques de François Grosse (taux de recyclage, taux de croissance), les étudiant·es vérifient à quelles conditions une économie peut être réellement circulaire.'
          },
          {
            title: 'Construire une trajectoire de neutralité carbone',
            desc: 'Les étudiant·es élaborent une trajectoire économique compatible avec la neutralité carbone en 2050, en identifiant les leviers et les contraintes.'
          }
        ]
      },
      {
        verb: 'Décider',
        text: "Fournir des outils d'aide à la décision pour rendre la transition écologique attractive sur le plan économique et social.",
        activities: [
          {
            title: "Mener l'analyse coûts-bénéfices d'une politique climatique",
            desc: "Évaluer les gains et les coûts d'une action visant à réduire les émissions de gaz à effet de serre, en s'appuyant par exemple sur le modèle de Nordhaus."
          },
          {
            title: 'Concevoir un projet de territoire durable',
            desc: 'Projet interdisciplinaire : concevoir un territoire durable en intégrant des contraintes écologiques, sociales et économiques. Les étudiant·es défendent leurs choix.'
          }
        ]
      }
    ],
    competences: {
      intro:
        "En étudiant la transition écologique à travers l'économie, vos étudiant·es développent des compétences analytiques et critiques essentielles. En voici les plus significatives.",
      featured: [
        {
          name: 'Analyse systémique',
          concrete:
            "Les étudiant·es intègrent les limites planétaires dans l'analyse économique, dans une perspective interdisciplinaire qui va au-delà des modèles standard."
        },
        {
          name: 'Analyse prospective',
          concrete:
            'Les étudiant·es décrivent les hypothèses économiques des différents scénarios de transition et anticipent les réactions des acteur·rices face aux politiques environnementales.'
        },
        {
          name: 'Capacité à agir',
          concrete:
            "Les étudiant·es appliquent des analyses coûts-bénéfices à des politiques climatiques réelles et évaluent l'efficacité d'une fiscalité environnementale."
        }
      ],
      also: [
        'Analyser de manière critique les modèles économiques',
        'Évaluer les coûts sur tout le cycle de vie',
        'Relier justice climatique et inégalités',
        'Modéliser les impacts des politiques publiques',
        'Évaluer les stratégies alternatives de régulation'
      ]
    },
    activities: {
      feedback:
        'Excellente idée. Cette activité connecte directement les outils économiques que vous enseignez à des enjeux concrets.'
    },
    reflection: {
      sub: "Vous venez de découvrir comment l'économie s'inscrit dans la transition écologique. Prenez un moment pour faire le lien avec votre propre enseignement.",
      prompts: [
        {
          q: 'Quel concept économique de votre cours se connecte le plus naturellement à la transition écologique ?',
          placeholder:
            "Par exemple : les externalités, les biens publics, l'analyse coûts-bénéfices"
        },
        {
          q: "Comment imaginez-vous relier l'un de vos cours existants à la transition écologique et au développement soutenable ?",
          placeholder:
            'Par exemple : remplacer une illustration générique par un cas réel de politique environnementale'
        }
      ],
      resourceTitle: 'Économie & Transition écologique'
    }
  },
  law: {
    flip: {
      statement: 'Le droit est au cœur de la transition écologique.',
      closing:
        "Le droit permet une prise de décision encadrée, démocratique et transparente, au service de l'intérêt général et dans le respect des limites planétaires."
    },
    contributions: [
      {
        verb: 'Définir',
        text: "Le droit fixe les principes constitutionnels de protection de l'environnement : prévention, précaution, non-régression, pollueur-payeur.",
        activities: [
          {
            title: "Analyser la Charte de l'environnement",
            desc: "Les étudiant·es examinent la Charte de l'environnement, texte à valeur constitutionnelle : quels droits et devoirs crée-t-elle ? Quelles limites ? Quelle effectivité ?"
          },
          {
            title: 'Comparer les principes environnementaux en droit européen et national',
            desc: 'Identifier comment le principe de précaution et le principe pollueur-payeur se déclinent différemment selon les niveaux de gouvernance.'
          }
        ]
      },
      {
        verb: 'Encadrer',
        text: 'Il organise les activités humaines pour limiter leur impact : urbanisme, industrie, agriculture, mines, transports.',
        activities: [
          {
            title: 'Étude de cas : un projet face au droit environnemental',
            desc: "Analyser la légalité et la constitutionnalité d'un projet d'aménagement (éolienne, mine, autoroute) au regard du droit de l'environnement."
          },
          {
            title: 'Lire et analyser une loi environnementale',
            desc: 'Décortiquer un texte juridique environnemental récent pour identifier ses mécanismes, ses lacunes et les résistances à son application.'
          }
        ]
      },
      {
        verb: 'Responsabiliser',
        text: "Il règle les litiges, sanctionne les atteintes à l'environnement et établit les régimes de responsabilité écologique.",
        activities: [
          {
            title: 'Analyser un cas réel de préjudice écologique',
            desc: "Étudier un dossier réel pour comprendre comment le droit traite les atteintes à l'environnement et leur réparation."
          },
          {
            title: "Jeu de rôle : conflits d'usage",
            desc: 'Les étudiant·es incarnent différent·es acteur·rices (agriculteur·rices, ONG, collectivité, État) face à une controverse environnementale pour comprendre les tensions juridiques.'
          }
        ]
      },
      {
        verb: 'Gouverner',
        text: 'Il organise la participation du public aux décisions environnementales et établit les compétences des autorités publiques.',
        activities: [
          {
            title: 'Simuler une réunion publique environnementale',
            desc: "Débattre d'un projet dans une instance de dialogue fictive pour confronter des points de vue opposés et comprendre la démocratie environnementale."
          },
          {
            title: 'Rédiger un projet de loi fictif',
            desc: 'Les étudiant·es rédigent un projet de loi ou des amendements sur un sujet environnemental et découvrent ainsi le processus législatif et les compromis nécessaires.'
          }
        ]
      }
    ],
    competences: {
      intro:
        'En étudiant la transition écologique à travers le droit, vos étudiant·es développent des compétences analytiques et citoyennes essentielles. En voici les plus significatives.',
      featured: [
        {
          name: 'Analyse critique',
          concrete:
            "Les étudiant·es interprètent une loi sur l'énergie ou le climat et distinguent ce qui relève du droit national, européen et international."
        },
        {
          name: 'Analyse systémique',
          concrete:
            "Les étudiant·es reconnaissent le droit comme un outil de transformation sociale et comprennent les liens entre le droit de l'environnement et les autres domaines juridiques."
        },
        {
          name: 'Action collective',
          concrete:
            "Les étudiant·es mobilisent le vocabulaire juridique pour argumenter en faveur de la protection de l'environnement dans des cas concrets."
        }
      ],
      also: [
        'Identifier les grands principes constitutionnels',
        'Comprendre les régimes de responsabilité',
        'Expérimenter la démocratie environnementale',
        'Analyser la constitutionnalité de projets',
        'Maîtriser la méthodologie juridique',
        'Co-construire un avis juridique'
      ]
    },
    activities: {
      feedback:
        'Très bien. Cette activité ancre directement les mécanismes juridiques dans des situations réelles.'
    },
    reflection: {
      sub: "Vous venez de découvrir comment le droit s'inscrit dans la transition écologique. Prenez un moment pour faire le lien avec votre propre enseignement.",
      prompts: [
        {
          q: "Quel principe juridique de votre cours a l'application environnementale la plus directe ?",
          placeholder:
            'Par exemple : la responsabilité civile, le principe de précaution, les droits fondamentaux'
        },
        {
          q: 'Comment imaginez-vous utiliser un cas environnemental réel dans votre prochain cours ?',
          placeholder:
            'Par exemple : étudier une décision de justice récente, analyser une loi en vigueur'
        }
      ],
      resourceTitle: 'Droit & Transition écologique'
    }
  },
  philosophy: {
    flip: {
      statement: 'La philosophie pense déjà les enjeux de la transition écologique.',
      closing:
        'La philosophie prépare aux choix éthiques, politiques et existentiels que pose la transition écologique et contribue à former des citoyen·nes lucides et responsables.'
    },
    contributions: [
      {
        verb: 'Questionner',
        text: 'La philosophie met en question les finalités du progrès et du développement et interroge les présupposés culturels de la modernité.',
        activities: [
          {
            title: 'Rédiger une dissertation sur le progrès et ses limites',
            desc: '« Le progrès technique peut-il résoudre la crise écologique ? » Une question philosophique classique rendue urgente par les enjeux contemporains.'
          },
          {
            title: "Analyser un texte sur la modernité et l'environnement",
            desc: "Lire et commenter un extrait de Hans Jonas, Dominique Bourg ou Bruno Latour. Les étudiant·es s'exercent à l'analyse de texte sur des œuvres au cœur de ces enjeux."
          }
        ]
      },
      {
        verb: "Penser l'éthique",
        text: 'Elle examine les principes éthiques qui guident les choix individuels et collectifs, et éclaire la notion de responsabilité intergénérationnelle.',
        activities: [
          {
            title: 'Débat : la responsabilité intergénérationnelle',
            desc: '« Avons-nous des obligations morales envers les générations futures ? » Croiser Rawls, Jonas et les théories de la justice climatique dans un débat structuré.'
          },
          {
            title: 'Élaborer une charte éthique',
            desc: "En groupes, les étudiant·es rédigent une charte éthique pour une institution (université, entreprise, ville) face à un défi écologique précis. Un exercice d'éthique appliquée."
          }
        ]
      },
      {
        verb: 'Critiquer',
        text: 'Elle remet en cause les dualismes nature/culture, humains/non-humains, et met au jour les valeurs qui sous-tendent notre relation à la nature.',
        activities: [
          {
            title: 'Étudier le véganisme comme cas philosophique',
            desc: "Aborder le véganisme non comme un choix de vie, mais comme un cas d'école philosophique : quels cadres éthiques remet-il en question ? Quels fondements moraux révèle-t-il ?"
          },
          {
            title: 'Critiquer le dualisme nature/culture',
            desc: 'À partir de textes de Latour ou de Descola, les étudiant·es déconstruisent la séparation nature/culture et explorent ses implications pour la crise écologique.'
          }
        ]
      },
      {
        verb: 'Imaginer',
        text: "Elle définit les conditions d'une démocratie écologique et réfléchit au vivre-ensemble avec les autres vivants, humains et non-humains.",
        activities: [
          {
            title: 'Discuter de la justice climatique',
            desc: "Croiser philosophie et géographie autour d'une question : qui subit le plus les effets du changement climatique et qui en est le plus responsable ? Est-ce juste ?"
          },
          {
            title: 'Concevoir une démocratie écologique',
            desc: "Les étudiant·es définissent les conditions d'une démocratie qui intègre les limites planétaires et la représentation des générations futures. Exercice de philosophie politique."
          }
        ]
      }
    ],
    competences: {
      intro:
        "En étudiant la transition écologique à travers la philosophie, vos étudiant·es développent des compétences de pensée et d'argumentation essentielles. En voici les plus significatives.",
      featured: [
        {
          name: 'Problématisation',
          concrete:
            'Les étudiant·es posent des questions fondamentales sur la responsabilité envers les générations futures, sur la valeur intrinsèque de la nature, sur ce que signifie le progrès.'
        },
        {
          name: 'Esprit critique',
          concrete:
            'Les étudiant·es distinguent les connaissances des opinions et remettent en question les évidences, notamment les grands récits du progrès et de la croissance.'
        },
        {
          name: 'Réflexivité citoyenne',
          concrete:
            'Les étudiant·es articulent plusieurs dimensions de la responsabilité : individuelle, collective, historique, intergénérationnelle, morale et juridique.'
        }
      ],
      also: [
        'Analyser des concepts',
        'Construire une argumentation rigoureuse',
        'Interpréter des textes philosophiques',
        'Mettre en perspective des doctrines',
        'Débattre et exprimer des désaccords constructifs',
        'Articuler des savoirs interdisciplinaires'
      ]
    },
    activities: {
      feedback:
        'Bien choisi. Cette activité ancre la philosophie dans des questions que vos étudiant·es vivent réellement.'
    },
    reflection: {
      sub: "Vous venez de découvrir comment la philosophie s'inscrit dans la transition écologique. Prenez un moment pour faire le lien avec votre propre enseignement.",
      prompts: [
        {
          q: 'Quel concept de votre cours a le lien le plus direct avec un enjeu écologique ?',
          placeholder:
            'Par exemple : la responsabilité, la justice, le progrès, la nature, le bien commun'
        },
        {
          q: 'Comment imaginez-vous introduire un exemple ou un texte lié à la transition écologique dans votre prochaine séance ?',
          placeholder:
            'Par exemple : remplacer une illustration classique par une situation écologique contemporaine'
        }
      ],
      resourceTitle: 'Philosophie & Transition écologique'
    }
  },
  psychology: {
    flip: {
      statement: 'La psychologie éclaire les dimensions humaines de la transition écologique.',
      closing:
        "La psychologie permet de passer des connaissances à l'action, en tenant compte de ce que les humains perçoivent et ressentent face aux enjeux écologiques."
    },
    contributions: [
      {
        verb: 'Comprendre',
        text: 'Analyser la perception et les représentations des risques environnementaux, et saisir notre rapport aux lieux que la transition transforme.',
        activities: [
          {
            title: 'Analyser la perception du risque climatique',
            desc: 'Les étudiant·es examinent, sous un angle psychosocial, comment différentes populations perçoivent le risque climatique, en identifiant les biais cognitifs et culturels.'
          },
          {
            title: "Comparer l'éco-anxiété selon les contextes culturels",
            desc: "Comparer la perception de l'éco-anxiété dans différents contextes culturels et régionaux. Les étudiant·es analysent des témoignages et appliquent des cadres psychologiques."
          }
        ]
      },
      {
        verb: 'Réguler',
        text: "Comprendre et réguler les émotions associées aux changements environnementaux : éco-anxiété, solastalgie, sentiment de perte ou d'impuissance.",
        activities: [
          {
            title: "Débat : l'éco-anxiété, pathologie ou réponse adaptée ?",
            desc: "« L'éco-anxiété est-elle une pathologie à traiter ou une réponse psychologique saine au changement climatique ? » Débat structuré avec des arguments scientifiques."
          },
          {
            title: "Analyser des mécanismes cognitifs liés à l'éco-anxiété",
            desc: "À partir de témoignages anonymisés, les étudiant·es identifient les mécanismes cognitifs et émotionnels liés à l'éco-anxiété et proposent des stratégies d'accompagnement."
          }
        ]
      },
      {
        verb: 'Mobiliser',
        text: "Identifier les freins psychologiques au changement et mobiliser les leviers pour favoriser l'action : normes sociales, nudges verts, processus identitaires.",
        activities: [
          {
            title: 'Concevoir une campagne de nudges verts',
            desc: 'Les étudiant·es appliquent les théories psychologiques (normes sociales, comportement planifié) pour concevoir une campagne de sensibilisation sur le campus.'
          },
          {
            title: 'Observer et analyser des comportements écoresponsables',
            desc: 'Observer les comportements de tri ou les choix alimentaires en contexte réel, interroger les personnes sur leurs motivations et appliquer des cadres psychosociaux.'
          }
        ]
      },
      {
        verb: 'Accompagner',
        text: "Soutenir la durabilité psychologique : aider les personnes à rester actives et constructives malgré l'angoisse environnementale.",
        activities: [
          {
            title: 'Concevoir un soutien psychologique face à la crise climatique',
            desc: "Construire une campagne de soutien psychologique intégrant les connaissances sur l'éco-anxiété, pour aider des personnes affectées par des événements climatiques."
          },
          {
            title: 'Jeu de rôle : convaincre face à la vulnérabilité cognitive',
            desc: "Les étudiant·es doivent convaincre un groupe cognitivement vulnérable d'adhérer à la transition écologique, par exemple dans une ville côtière confrontée à la montée des eaux."
          }
        ]
      }
    ],
    competences: {
      intro:
        'En étudiant la transition écologique à travers la psychologie, vos étudiant·es développent des compétences analytiques et appliquées essentielles. En voici les plus significatives.',
      featured: [
        {
          name: 'Pensée complexe et systémique',
          concrete:
            "Les étudiant·es identifient les liens entre émotions, comportements pro-environnementaux et politiques de durabilité, et saisissent la complexité des représentations liées à l'environnement."
        },
        {
          name: 'Analyse critique',
          concrete:
            'Les étudiant·es comprennent ce qui sous-tend les discours et les comportements environnementaux et identifient leur propre posture par rapport à ces enjeux.'
        },
        {
          name: 'Capacité à transformer',
          concrete:
            "Les étudiant·es conçoivent des stratégies de changement et accompagnent les individus pour transformer la vulnérabilité et l'anxiété en action et en résilience."
        }
      ],
      also: [
        'Comprendre les comportements humains en contexte de transition',
        'Concevoir et évaluer des stratégies de changement',
        'Communiquer pour informer et engager',
        'Analyser les mécanismes de décision',
        'Analyser les représentations sociales et le sens commun'
      ]
    },
    activities: {
      feedback:
        'Bien vu. Cette activité ancre directement la psychologie dans des situations que vos étudiant·es vivent ou observent.'
    },
    reflection: {
      sub: "Vous venez de découvrir comment la psychologie s'inscrit dans la transition écologique. Prenez un moment pour faire le lien avec votre propre enseignement.",
      prompts: [
        {
          q: "Quel concept psychologique de votre cours devient le plus parlant lorsqu'on l'applique à un comportement à fort enjeu écologique ?",
          placeholder:
            'Par exemple : la théorie du comportement planifié, les biais cognitifs, les représentations sociales'
        },
        {
          q: 'Comment imaginez-vous faire cette connexion dans votre prochain cours ?',
          placeholder:
            'Par exemple : appliquer un cadre théorique à un comportement environnemental réel observé par les étudiant·es'
        }
      ],
      resourceTitle: 'Psychologie & Transition écologique'
    }
  },
  geography: {
    flip: {
      statement: 'La géographie est au cœur de la transition écologique.',
      closing:
        'Sans ancrage géographique et sans prise en compte des spécificités des espaces et des sociétés, la transition écologique serait inopérante. Votre discipline est indispensable.'
    },
    contributions: [
      {
        verb: 'Localiser et cartographier',
        text: "Vous apprenez à vos étudiant·es à lire les dynamiques spatiales. C'est exactement ce dont on a besoin pour cartographier les vulnérabilités climatiques, les flux de pollution et les inégalités environnementales à différentes échelles.",
        activities: [
          {
            title: "Cartographier les vulnérabilités climatiques d'un territoire",
            desc: "Les étudiant·es réalisent une carte des zones à risque (inondation, sécheresse, canicule) à l'échelle d'un territoire local ou régional, en croisant données climatiques et données sociales."
          },
          {
            title: 'Comparer les empreintes écologiques de différents pays',
            desc: 'Mettre en regard les empreintes écologiques nationales : qui consomme le plus, qui subit le plus ? Relier ces données aux inégalités de développement.'
          }
        ]
      },
      {
        verb: 'Comprendre les territoires',
        text: 'La géographie analyse les interactions entre sociétés et environnements. Par exemple, comprendre comment une ville côtière se transforme face à la montée des eaux, ou comment un territoire rural gère la transition énergétique.',
        activities: [
          {
            title: "Étudier un projet d'écoquartier ou de ville en transition",
            desc: 'Les étudiant·es analysent un projet urbain durable réel (par exemple, le quartier de la Confluence à Lyon ou Bottière-Chénaie à Nantes) : acteur·rices, enjeux, compromis et limites.'
          },
          {
            title: "Analyser les impacts du tourisme de montagne face au recul de l'enneigement",
            desc: "Étudier un territoire de montagne (Alpes, Pyrénées) confronté au recul de l'enneigement. Quelles reconversions ? Quelles résistances ? Quelles parties prenantes ?"
          }
        ]
      },
      {
        verb: 'Décrypter les politiques',
        text: "Vous enseignez à vos étudiant·es à analyser les acteur·rices et les décisions publiques. C'est ce qu'exige la transition : comprendre qui décide, à quelle échelle, et avec quels effets sur les territoires.",
        activities: [
          {
            title: 'Simuler une conférence des parties (COP) sur une ressource locale',
            desc: "Les étudiant·es représentent différentes parties prenantes (État, collectivités, ONG, entreprises, citoyen·nes) qui négocient la gestion durable d'une ressource commune : eau, forêt, littoral."
          },
          {
            title: "Analyser une politique d'aménagement durable",
            desc: "Décrypter un plan local d'urbanisme (PLU) ou un schéma de cohérence territoriale (SCoT) à travers le prisme de la transition écologique : quels objectifs ? Quelles contradictions ?"
          }
        ]
      },
      {
        verb: 'Penser les inégalités',
        text: 'La géographie explore les inégalités socio-spatiales. La crise écologique les amplifie : qui est le plus vulnérable, qui a accès aux ressources, qui subit les effets du changement climatique ?',
        activities: [
          {
            title: 'Étude de cas : la justice environnementale',
            desc: "Analyser un territoire où coexistent une zone industrielle polluante et des populations précaires. Qui décide de l'implantation ? Qui subit les effets ? Quels recours existent ?"
          },
          {
            title: 'Cartographier les migrations climatiques',
            desc: 'À partir de données réelles, les étudiant·es cartographient les migrations liées aux catastrophes climatiques et analysent les inégalités de vulnérabilité entre pays du Nord et du Sud.'
          }
        ]
      }
    ],
    competences: {
      intro:
        'En étudiant la transition écologique à travers la géographie, vos étudiant·es développent des compétences analytiques et citoyennes essentielles. En voici les plus significatives.',
      featured: [
        {
          name: 'Lecture et production de cartes',
          concrete:
            "Les étudiant·es réalisent une carte des vulnérabilités climatiques d'un territoire, en identifiant les zones à risque et les populations exposées à des événements extrêmes."
        },
        {
          name: 'Esprit critique',
          concrete:
            "Les étudiant·es analysent des enjeux complexes comme les conflits d'usage autour de l'eau ou les tensions entre développement touristique et préservation des littoraux."
        },
        {
          name: 'Pensée multiscalaire',
          concrete:
            "Les étudiant·es relient les décisions locales (un projet d'écoquartier) aux dynamiques nationales et mondiales (politiques climatiques, flux migratoires liés au climat)."
        }
      ],
      also: [
        'Identifier des acteur·rices et des logiques territoriales',
        'Analyser des dynamiques spatiales',
        "Travailler à différentes échelles de temps et d'espace",
        "Construire une argumentation autour d'un projet",
        'Maîtriser des outils numériques et cartographiques',
        'Comprendre les enjeux globaux et leurs déclinaisons locales'
      ]
    },
    activities: {
      feedback:
        'Bien choisi. Cette activité ancre directement les outils géographiques dans des enjeux territoriaux concrets.'
    },
    reflection: {
      sub: "Vous venez de découvrir comment la géographie s'inscrit dans la transition écologique. Prenez un moment pour faire le lien avec votre propre enseignement.",
      prompts: [
        {
          q: 'Quel territoire ou quelle dynamique spatiale de votre cours a le lien le plus évident avec la transition écologique ?',
          placeholder:
            'Par exemple : les dynamiques urbaines, les espaces ruraux, les littoraux, les inégalités régionales'
        },
        {
          q: 'Comment imaginez-vous introduire une carte ou une étude de cas liée à la transition dans votre prochaine séance ?',
          placeholder:
            "Par exemple : ajouter une carte des vulnérabilités climatiques à une séance existante sur l'aménagement"
        }
      ],
      resourceTitle: 'Géographie & Transition écologique'
    }
  },
  health: {
    flip: {
      statement: 'Les sciences de la santé sont un levier central de la transition écologique.',
      closing:
        "La santé est un langage commun entre disciplines et un point d'entrée concret pour parler de l'interdépendance entre les humains et leur environnement."
    },
    contributions: [
      {
        verb: 'Identifier les risques',
        text: 'Vous apprenez à vos étudiant·es à évaluer les effets des expositions environnementales sur la santé. Par exemple, analyser la surmortalité liée aux canicules ou les maladies respiratoires liées à la pollution atmosphérique.',
        activities: [
          {
            title: "Étude de cas : impact d'une canicule sur la santé publique",
            desc: "Les étudiant·es analysent les données d'un épisode de canicule réel (mortalité, hospitalisations, populations vulnérables) et identifient les réponses sanitaires et les leviers de prévention."
          },
          {
            title: 'Analyser un épisode de pollution atmosphérique',
            desc: "À partir de données réelles (Airparif, OMS), les étudiant·es évaluent les effets sanitaires d'un pic de pollution et les inégalités d'exposition selon les territoires et les populations."
          }
        ]
      },
      {
        verb: 'Analyser les politiques',
        text: "La santé permet d'évaluer les co-bénéfices des politiques climatiques : la baisse de la consommation de viande améliore la santé tout en réduisant les émissions. Vos étudiant·es apprennent à raisonner en systèmes.",
        activities: [
          {
            title: "Évaluer les bénéfices et les risques sanitaires d'une politique climatique",
            desc: "Les étudiant·es analysent une politique de transition (mobilités douces, réduction de la consommation de viande, végétalisation urbaine) sous l'angle de ses bénéfices et de ses risques sanitaires."
          },
          {
            title: 'Analyser les stratégies de santé environnementale',
            desc: 'Décrypter les stratégies nationales et internationales (PNSE, OMS, One Health) : quels objectifs, quels outils, quelle efficacité dans un contexte de transition écologique ?'
          }
        ]
      },
      {
        verb: 'Renforcer la résilience',
        text: "Passer d'une logique de réparation à une logique de prévention : c'est l'un des grands enjeux de la santé environnementale, et un raisonnement que vos étudiant·es construisent dès leur formation.",
        activities: [
          {
            title: 'Réaliser un diagnostic de santé environnementale sur un campus',
            desc: "Examiner le campus sous l'angle de la santé environnementale : qualité de l'air, accès aux espaces verts, alimentation, mobilité. Relier les données à des enjeux de justice environnementale."
          },
          {
            title: 'Jeu de rôle : un enjeu de santé environnementale',
            desc: "Les étudiant·es incarnent différentes parties prenantes (soignant·es, élu·es, ONG, chercheur·euses, citoyen·nes) pour débattre d'une problématique de santé publique liée à l'environnement (pesticides, pollution, canicule)."
          }
        ]
      },
      {
        verb: "Réduire l'empreinte",
        text: 'Le secteur de la santé contribue lui-même aux émissions. Vos étudiant·es peuvent concevoir des pratiques médicales plus sobres : recyclage des réactifs, éco-conception des soins, sobriété énergétique.',
        activities: [
          {
            title: 'Concevoir des pratiques médicales plus sobres',
            desc: "Les étudiant·es imaginent des solutions pour réduire l'empreinte écologique d'un service de santé : recyclage, sobriété énergétique, achats responsables, éco-conception du matériel médical."
          },
          {
            title: 'Vulgariser les liens entre santé et transition',
            desc: 'En groupes, les étudiant·es créent une affiche, un podcast ou une vidéo pédagogique sur les liens entre un enjeu de santé et la transition écologique, destinée à un public non spécialiste.'
          }
        ]
      }
    ],
    competences: {
      intro:
        'En étudiant la transition écologique à travers les sciences de la santé, vos étudiant·es développent des compétences cliniques, systémiques et citoyennes essentielles. En voici les plus significatives.',
      featured: [
        {
          name: 'Approche One Health',
          concrete:
            "Les étudiant·es apprennent à penser la santé humaine comme liée à celle des écosystèmes et des autres vivants. Par exemple, analyser l'émergence de maladies vectorielles liées au réchauffement climatique."
        },
        {
          name: 'Interdisciplinarité',
          concrete:
            "Les étudiant·es croisent médecine, écologie, psychologie et sociologie pour analyser les déterminants environnementaux de la santé d'une population dans un territoire donné."
        },
        {
          name: 'Esprit critique',
          concrete:
            'Les étudiant·es distinguent les discours politiques et médiatiques des faits scientifiques établis en santé environnementale, et développent des compétences éthiques face aux enjeux de justice sanitaire.'
        }
      ],
      also: [
        'Décrire les interactions entre environnement et santé',
        'Analyser les déterminants écologiques et sociaux de la santé',
        'Comprendre les enjeux de justice environnementale et sanitaire',
        'Agir comme acteur·rice de la transition dans le champ de la santé',
        'Faire des recommandations pour la prévention des risques',
        "Contribuer à l'éducation et à la sensibilisation des citoyen·nes"
      ]
    },
    activities: {
      feedback:
        'Très bien. Cette activité connecte directement les compétences cliniques à des enjeux environnementaux concrets.'
    },
    reflection: {
      sub: "Vous venez de découvrir comment les sciences de la santé s'inscrivent dans la transition écologique. Prenez un moment pour faire le lien avec votre propre enseignement.",
      prompts: [
        {
          q: 'Quel lien entre santé et environnement pourriez-vous introduire dans votre prochaine séance ?',
          placeholder:
            'Par exemple : les effets de la pollution sur les pathologies respiratoires, la santé mentale et le climat'
        },
        {
          q: "Comment imaginez-vous faire de la transition écologique un contexte d'apprentissage dans votre cours ?",
          placeholder:
            'Par exemple : utiliser des données épidémiologiques liées au changement climatique dans un cas clinique'
        }
      ],
      resourceTitle: 'Santé & Transition écologique'
    }
  },
  staps: {
    flip: {
      statement:
        'Les STAPS sont au cœur des enjeux sanitaires, sociaux et environnementaux contemporains.',
      closing:
        "Les STAPS forment des professionnel·les capables d'adapter les pratiques sportives aux contraintes écologiques, d'organiser des événements plus sobres et d'accompagner les transitions du secteur sportif."
    },
    contributions: [
      {
        verb: 'Comprendre les effets du climat',
        text: 'Les activités physiques et sportives dépendent fortement des conditions environnementales. Vos étudiant·es apprennent à analyser les adaptations physiologiques aux fortes chaleurs, aux pollutions et aux événements climatiques extrêmes.',
        activities: [
          {
            title: "Adapter l'entraînement à la chaleur",
            desc: "Les étudiant·es examinent des données physiologiques réelles sur les adaptations à la chaleur et conçoivent des protocoles d'entraînement tenant compte des contraintes climatiques actuelles."
          },
          {
            title: "Étude de cas : sport de montagne et recul de l'enneigement",
            desc: "Analyser l'impact du changement climatique sur un sport de montagne (ski, alpinisme) : quelles adaptations des pratiques, des infrastructures, des modèles économiques ?"
          }
        ]
      },
      {
        verb: 'Accroître la résilience',
        text: 'Une meilleure condition physique peut améliorer la tolérance à certaines contraintes environnementales. Vos étudiant·es apprennent à concevoir des programmes adaptés aux contraintes climatiques actuelles.',
        activities: [
          {
            title: "Concevoir un programme d'EPS adapté aux contraintes climatiques",
            desc: "Les étudiant·es conçoivent une séquence d'EPS tenant compte d'une contrainte environnementale réelle (canicule, qualité de l'air) : objectifs pédagogiques, adaptations, indicateurs de suivi."
          },
          {
            title: 'Analyser les co-bénéfices santé/climat des mobilités actives',
            desc: "Quantifier et comparer les effets sur la santé et les émissions de CO₂ de différents modes de transport vers un équipement sportif. Un cas concret d'analyse systémique."
          }
        ]
      },
      {
        verb: "Atténuer l'empreinte",
        text: 'Le secteur sportif repose largement sur des infrastructures, des équipements et des mobilités. Vos étudiant·es peuvent apprendre à concevoir des pratiques sportives plus sobres et responsables.',
        activities: [
          {
            title: 'Évaluer la soutenabilité des Jeux olympiques',
            desc: "À partir de rapports institutionnels et de données réelles, les étudiant·es évaluent l'empreinte écologique des JO et proposent des indicateurs et des leviers de réduction."
          },
          {
            title: 'Concevoir un événement sportif sobre',
            desc: 'Les étudiant·es planifient un événement sportif en intégrant des critères de durabilité (mobilités, alimentation, déchets, accessibilité) et définissent leurs propres indicateurs de soutenabilité.'
          }
        ]
      },
      {
        verb: 'Éduquer à la santé globale',
        text: "Les STAPS diffusent des valeurs de respect, de coopération et d'engagement. Elles permettent de penser les liens entre santé humaine et santé environnementale dans une perspective de durabilité.",
        activities: [
          {
            title: 'Débat : performance sportive et limites planétaires',
            desc: '« La logique de performance sportive est-elle compatible avec les limites planétaires ? » Les étudiant·es défendent des positions à partir de données économiques, sanitaires et environnementales.'
          },
          {
            title: 'Mener une action de sensibilisation dans un club sportif',
            desc: 'Les étudiant·es conçoivent et mettent en œuvre une action de sensibilisation aux enjeux de durabilité dans un club ou une association sportive locale.'
          }
        ]
      }
    ],
    competences: {
      intro:
        'En étudiant la transition écologique à travers les STAPS, vos étudiant·es développent des compétences disciplinaires et transversales essentielles. En voici les plus significatives.',
      featured: [
        {
          name: 'Pensée systémique',
          concrete:
            'Les étudiant·es décrivent les interactions entre santé, climat, infrastructures sportives et économie du sport. Par exemple, analyser comment la montée des températures affecte les pratiques et les performances.'
        },
        {
          name: 'Analyse critique',
          concrete:
            "Les étudiant·es analysent un objet sportif à l'ère des limites planétaires, en renseignant et en interprétant les indicateurs de performance environnementale d'une infrastructure ou d'un événement sportif."
        },
        {
          name: 'Capacité à concevoir',
          concrete:
            "Les étudiant·es conçoivent un programme d'EPS ou d'entraînement tenant compte des aléas climatiques (canicule, qualité de l'air, inondation) et économe en ressources."
        }
      ],
      also: [
        'Définir des indicateurs de soutenabilité pour les événements sportifs',
        'Organiser des événements sportifs justes, responsables et sobres',
        'Construire un plan nutritionnel optimisé et soutenable',
        "Expliquer l'impact des risques climatiques sur la performance",
        'Articuler urbanisme, mobilité et pratiques sportives',
        'Développer des diagnostics territoriaux intégrés'
      ]
    },
    activities: {
      feedback:
        'Bien vu. Cette activité connecte directement les compétences STAPS à des défis environnementaux concrets.'
    },
    reflection: {
      sub: "Vous venez de découvrir comment les STAPS s'inscrivent dans la transition écologique. Prenez un moment pour faire le lien avec votre propre enseignement.",
      prompts: [
        {
          q: 'Quelle pratique sportive ou quelle séance de votre cours pourrait intégrer une dimension de durabilité ?',
          placeholder:
            "Par exemple : une séance d'EPS adaptée à la chaleur, l'analyse de l'empreinte d'un équipement sportif"
        },
        {
          q: "Comment imaginez-vous faire de la transition écologique un contexte d'apprentissage dans votre cours ?",
          placeholder:
            'Par exemple : utiliser des données réelles sur un événement sportif pour travailler les compétences disciplinaires'
        }
      ],
      resourceTitle: 'STAPS & Transition écologique'
    }
  },
  letters: {
    flip: {
      statement: 'Les lettres jouent un rôle essentiel dans la transition écologique.',
      closing:
        "Les lettres forment des citoyen·nes capables de penser, de dire et de raconter autrement le monde. C'est une condition essentielle pour transformer nos modes de vie."
    },
    contributions: [
      {
        verb: 'Analyser les imaginaires',
        text: "Vous apprenez à vos étudiant·es à lire les œuvres et les discours. C'est exactement ce dont on a besoin pour comprendre les imaginaires qui ont conduit à la surexploitation du monde, ou pour inventer d'autres façons d'habiter la Terre.",
        activities: [
          {
            title: 'Analyser un corpus littéraire autour de la nature',
            desc: "Les étudiant·es lisent des extraits d'œuvres (de la littérature naturaliste au roman d'anticipation climatique) pour analyser l'évolution des imaginaires du progrès, du vivant et de la planète."
          },
          {
            title: "Décrypter les discours sur l'écologie",
            desc: "À partir d'exemples publicitaires, politiques ou médiatiques, les étudiant·es identifient les stratégies discursives liées à la transition, y compris celles qui relèvent du greenwashing."
          }
        ]
      },
      {
        verb: 'Donner du sens',
        text: "La crise écologique manque de mots. Les lettres permettent d'identifier les différentes manières de nommer, de penser et de symboliser les bouleversements écologiques, y compris pour décrypter le greenwashing.",
        activities: [
          {
            title: 'Réécrire un texte à la lumière des enjeux climatiques',
            desc: "Les étudiant·es réécrivent un extrait littéraire classique en intégrant une dimension écologique contemporaine. Exercice de style qui interroge les présupposés culturels de l'œuvre originale."
          },
          {
            title: "Étudier les auteur·rices de l'éco-littérature",
            desc: "Lire des auteur·rices de l'éco-littérature (Thoreau, Le Clézio, Tesson, Giono) : comment la langue et le style traduisent-ils un rapport à la nature ? Quels nouveaux genres littéraires émergent ?"
          }
        ]
      },
      {
        verb: 'Imaginer des futurs',
        text: "Par la fiction, la poésie, le théâtre, la science-fiction écologique, les lettres permettent de penser la transformation sociale et d'élaborer de nouveaux récits collectifs sur le vivre-ensemble avec le vivant.",
        activities: [
          {
            title: "Imaginer par l'écriture une société sobre ou dévastée",
            desc: 'Les étudiant·es rédigent une courte nouvelle se déroulant dans une société qui a réussi sa transition écologique, ou au contraire qui a échoué. Exercice de prospective par la fiction.'
          },
          {
            title: 'Croiser lettres et sciences dans un projet interdisciplinaire',
            desc: 'En collaboration avec des enseignant·es de sciences, les étudiant·es créent un texte littéraire (essai, récit, poème) qui met en dialogue savoirs scientifiques et imaginaires sur la crise climatique.'
          }
        ]
      },
      {
        verb: 'Former des citoyen·nes critiques',
        text: "Vos étudiant·es apprennent à analyser les discours publicitaires, médiatiques et politiques sur l'écologie et développent une pensée personnelle étayée sur ces questions.",
        activities: [
          {
            title: "Lire et analyser un discours politique sur l'écologie",
            desc: 'Les étudiant·es décortiquent un discours politique récent sur la transition écologique : quelles figures de style, quels implicites, quels effets de cadrage ? Analyse rhétorique et citoyenne.'
          },
          {
            title: "Lire et discuter un texte au contact d'un espace naturel",
            desc: "Lecture et discussion d'un texte littéraire en lien avec un espace naturel local. Relier la lecture à l'expérience sensible du milieu. Peut être couplé à un partenariat culturel ou associatif."
          }
        ]
      }
    ],
    competences: {
      intro:
        'En étudiant la transition écologique à travers les lettres, vos étudiant·es développent des compétences littéraires, critiques et citoyennes essentielles. En voici les plus significatives.',
      featured: [
        {
          name: 'Lecture critique et contextualisée',
          concrete:
            "Les étudiant·es analysent les origines historiques et sociales d'une œuvre liée à la nature, et clarifient les valeurs et idéologies rattachées aux récits sur l'environnement."
        },
        {
          name: 'Pensée critique',
          concrete:
            "Les étudiant·es analysent les discours publicitaires et politiques sur l'écologie, et distinguent ce qui relève de la rhétorique du greenwashing de ce qui est scientifiquement fondé."
        },
        {
          name: 'Expression et créativité',
          concrete:
            "Les étudiant·es utilisent la littérature et la langue pour exprimer émotions, valeurs et visions de l'avenir face aux enjeux climatiques, en transformant des savoirs complexes en récits accessibles."
        }
      ],
      also: [
        'Analyser une œuvre littéraire ou un discours',
        "Rédiger une dissertation ou un commentaire autour d'enjeux de durabilité",
        'Produire une analyse comparative de textes',
        "Expérimenter des formes d'écriture créative sur les thèmes du vivant",
        'Produire de nouveaux récits capables de nourrir des transformations sociales',
        'Identifier des pistes de collaboration interdisciplinaire'
      ]
    },
    activities: {
      feedback:
        'Bien choisi. Cette activité ancre les outils littéraires dans des questions que vos étudiant·es vivent et lisent réellement.'
    },
    reflection: {
      sub: "Vous venez de découvrir comment les lettres s'inscrivent dans la transition écologique. Prenez un moment pour faire le lien avec votre propre enseignement.",
      prompts: [
        {
          q: 'Quelle œuvre ou quel·le auteur·rice de votre cours a le lien le plus direct avec les enjeux écologiques ?',
          placeholder:
            "Par exemple : Zola et l'industrie, Le Clézio et le rapport à la nature, la dystopie climatique"
        },
        {
          q: 'Comment imaginez-vous introduire une dimension écologique dans votre prochain cours de littérature ?',
          placeholder:
            'Par exemple : ajouter une question sur les imaginaires de la nature dans une œuvre déjà au programme'
        }
      ],
      resourceTitle: 'Lettres & Transition écologique'
    }
  },
  ecology: {
    flip: {
      statement:
        "L'écologie scientifique fournit les connaissances fondamentales de la transition.",
      closing:
        "L'écologie fournit les connaissances essentielles pour comprendre les crises environnementales actuelles. Par son exploration du vivant, elle est source de progrès et d'innovations pour la transition."
    },
    contributions: [
      {
        verb: 'Décrire et comprendre',
        text: "L'écologie analyse les interactions entre les êtres vivants et leur milieu. Vous apprenez à vos étudiant·es à comprendre la structure et le fonctionnement des écosystèmes, qu'ils soient peu ou fortement anthropisés.",
        activities: [
          {
            title: 'Réaliser un diagnostic écologique sur le terrain',
            desc: "Les étudiant·es réalisent un diagnostic écologique sur un terrain local (rivière, forêt, sol, prairie) en appliquant les méthodes d'observation et de mesure vues en cours."
          },
          {
            title: 'Construire un atlas de la biodiversité',
            desc: "À l'échelle de l'établissement ou du quartier, les étudiant·es inventorient la biodiversité locale, cartographient les espèces observées et analysent les facteurs qui influencent leur présence."
          }
        ]
      },
      {
        verb: 'Évaluer et prédire',
        text: "Vos étudiant·es apprennent à évaluer la résilience ou la vulnérabilité des milieux face aux pressions humaines, à identifier les points de bascule et à modéliser l'évolution des écosystèmes.",
        activities: [
          {
            title: "Modéliser les effets d'une perturbation sur un écosystème",
            desc: "À partir d'un scénario réel (construction d'une route, pollution d'une rivière, introduction d'une espèce invasive), les étudiant·es modélisent les effets en cascade sur l'écosystème."
          },
          {
            title: 'Comparer des pratiques agricoles selon leurs bénéfices écosystémiques',
            desc: 'Les étudiant·es comparent agriculture conventionnelle et agroécologie selon des critères de biodiversité, de qualité des sols et de services écosystémiques. Analyse multicritère.'
          }
        ]
      },
      {
        verb: 'Proposer des solutions',
        text: "L'écologie propose des leviers pour la transformation : agroécologie, écologie urbaine, solutions fondées sur la nature, bio-inspiration. Vos étudiant·es apprennent à concevoir des plans d'action concrets.",
        activities: [
          {
            title: "Définir les lignes directrices d'un programme d'action pour un territoire",
            desc: "Pour un territoire donné subissant de fortes pressions (urbanisation, pollution, sécheresse), les étudiant·es définissent un programme d'action et décrivent les compromis nécessaires."
          },
          {
            title: 'Concevoir une solution fondée sur la nature',
            desc: 'Les étudiant·es identifient un problème environnemental local (îlot de chaleur urbain, ruissellement, perte de pollinisateurs) et conçoivent une solution inspirée du fonctionnement des écosystèmes.'
          }
        ]
      },
      {
        verb: 'Éclairer les décisions',
        text: 'Les connaissances écologiques sont indispensables pour éclairer les politiques publiques. Vos étudiant·es apprennent à communiquer des données scientifiques complexes à des décideur·euses et à des non-spécialistes.',
        activities: [
          {
            title: 'Jeu de rôle : une controverse de gestion du territoire',
            desc: "Les étudiant·es incarnent les parties prenantes d'une question controversée de gestion du territoire (réintroduction du loup, artificialisation des terres, gestion des zones humides) et débattent en s'appuyant sur des données scientifiques."
          },
          {
            title: 'Analyser la prise en compte de la biodiversité dans un scénario sectoriel',
            desc: 'Les étudiant·es analysent comment la biodiversité est intégrée (ou non) dans un scénario agricole, énergétique ou urbanistique réel, et proposent des améliorations.'
          }
        ]
      }
    ],
    competences: {
      intro:
        "En étudiant la transition écologique à travers l'écologie scientifique, vos étudiant·es développent des compétences essentielles d'analyse et d'action. En voici les plus significatives.",
      featured: [
        {
          name: 'Analyse systémique',
          concrete:
            "Les étudiant·es décrivent un écosystème sous l'angle de ses réseaux d'interaction, identifient les réactions en cascade lors d'une perturbation, et expliquent les notions de résilience et d'irréversibilité."
        },
        {
          name: 'Analyse critique',
          concrete:
            "Les étudiant·es identifient les facteurs naturels et anthropiques responsables de la dynamique des écosystèmes, et mesurent l'intérêt et les limites des outils de collecte et de modélisation."
        },
        {
          name: 'Capacité à agir',
          concrete:
            "Les étudiant·es proposent des programmes d'action pour la conservation ou la restauration de la biodiversité, et s'appuient sur la nature pour concevoir des solutions d'atténuation ou d'adaptation."
        }
      ],
      also: [
        'Expliquer les forces qui déterminent la diversité génétique et spécifique',
        "Comprendre l'écologie des populations et des communautés",
        'Comprendre les services écosystémiques et les solutions fondées sur la nature',
        "Anticiper les conséquences d'une perte de diversité du vivant",
        "Relier l'écologie à d'autres disciplines pour décrire les socio-écosystèmes",
        "Identifier les sources d'information les plus fiables en écologie"
      ]
    },
    activities: {
      feedback:
        'Excellent choix. Cette activité connecte directement les concepts écologiques à des situations réelles de terrain.'
    },
    reflection: {
      sub: "Vous venez de découvrir comment l'écologie scientifique s'inscrit dans la transition écologique. Prenez un moment pour faire le lien avec votre propre enseignement.",
      prompts: [
        {
          q: "Quel concept écologique de votre cours a l'application la plus directe à un enjeu de transition ?",
          placeholder:
            'Par exemple : la résilience des écosystèmes, les services écosystémiques, la dynamique des populations'
        },
        {
          q: 'Comment imaginez-vous introduire un terrain ou un cas concret lié à la transition dans votre prochain cours ?',
          placeholder:
            "Par exemple : utiliser un écosystème local perturbé comme cas d'étude pour une séance de modélisation"
        }
      ],
      resourceTitle: 'Écologie & Transition écologique'
    }
  },
  art: {
    flip: {
      statement: "L'art joue un rôle clé et singulier dans la transition écologique.",
      closing:
        "Susciter des ressentis, transformer les imaginaires, questionner nos modes de vie, rassembler autour de récits et d'expériences : les apports de l'art à la transition écologique sont multiples et irremplaçables."
    },
    contributions: [
      {
        verb: 'Changer les regards',
        text: "L'art suscite des émotions et fait mieux ressentir la beauté et la fragilité de la nature, ou la violence des transformations de notre environnement. Vos étudiant·es apprennent à développer une conscience écologique par l'expérience esthétique.",
        activities: [
          {
            title: "Analyser des œuvres d'art écologique (éco-art, land art)",
            desc: "Les étudiant·es analysent des œuvres d'artistes engagé·es dans les questions écologiques (Andy Goldsworthy, Agnes Denes, Olafur Eliasson) : comment l'œuvre interpelle-t-elle notre rapport à la nature ?"
          },
          {
            title: "Créer une pièce sonore à partir d'enregistrements de terrain",
            desc: "Les étudiant·es enregistrent des sons dans différents lieux plus ou moins anthropisés et créent une pièce sonore. Exercice d'attention sensorielle au milieu et aux transformations de l'environnement."
          }
        ]
      },
      {
        verb: 'Créer de nouveaux récits',
        text: "L'art invente des histoires, des images et des symboles qui donnent envie d'agir et ouvrent le champ des possibles. Vos étudiant·es apprennent à produire des œuvres qui transforment les imaginaires collectifs.",
        activities: [
          {
            title: 'Réaliser des planches de BD sur la transition',
            desc: 'En groupes pluridisciplinaires, les étudiant·es créent des planches de bande dessinée qui servent de supports pédagogiques sur un enjeu de la transition écologique. Croisement entre narration visuelle et savoirs scientifiques.'
          },
          {
            title: 'Transmettre des savoirs scientifiques par le slam',
            desc: 'Faire intervenir un·e slameur·euse ou faire créer un slam sur un enjeu de la transition écologique. Les étudiant·es travaillent le passage de la connaissance scientifique à une restitution artistique collective.'
          }
        ]
      },
      {
        verb: 'Expérimenter autrement',
        text: "L'art explore d'autres façons d'habiter un lieu, de réutiliser des matériaux, de travailler avec le vivant. Vos étudiant·es peuvent interroger leur rapport aux objets, aux déchets et à la technique.",
        activities: [
          {
            title: 'Créer avec des matériaux récupérés',
            desc: "Les étudiant·es créent une œuvre plastique en utilisant uniquement des matériaux récupérés ou naturels. L'atelier interroge la relation à la matière, au déchet et à la ressource dans la pratique artistique."
          },
          {
            title: "Explorer les pratiques écosomatiques et l'attention aux milieux",
            desc: "Exercices corporels (danse, théâtre) qui invitent à sentir les vivants en soi et à développer une attention écologique au milieu. Approche à la croisée des arts chorégraphiques et de l'écologie."
          }
        ]
      },
      {
        verb: 'Favoriser la participation',
        text: "L'art réunit et fait réagir les citoyen·nes par des projets collectifs (fresques, performances, installations). Vos étudiant·es apprennent à créer des outils de mobilisation et de dialogue autour de la transition.",
        activities: [
          {
            title: 'Monter un théâtre-forum sur un enjeu de transition',
            desc: "Organiser un théâtre-forum à partir d'un scénario lié à la transition écologique. Les étudiant·es jouent une scène, puis les spectateur·rices interviennent. Méthode d'Augusto Boal, un outil puissant de prise de conscience."
          },
          {
            title: "Organiser un festival ou une semaine artistique sur l'écologie",
            desc: "Organiser une semaine à la programmation collective : spectacles, projections, ateliers, expositions, conférences. Restitution artistique par groupes d'étudiant·es avec carte blanche sur le format."
          }
        ]
      }
    ],
    competences: {
      intro:
        'En étudiant la transition écologique à travers les arts, vos étudiant·es développent des compétences créatives, critiques et citoyennes essentielles. En voici les plus significatives.',
      featured: [
        {
          name: 'Analyse critique des œuvres',
          concrete:
            "Les étudiant·es comprennent comment les artistes traitent des enjeux écologiques dans différents contextes culturels, et décryptent l'évolution des sensibilités artistiques face à la nature et à l'artificialisation."
        },
        {
          name: 'Créativité et innovation',
          concrete:
            'Les étudiant·es explorent de nouveaux matériaux (recyclés, naturels, durables) et expérimentent des formes artistiques sobres ou collaboratives en lien avec les enjeux de la transition.'
        },
        {
          name: 'Pensée critique et éthique',
          concrete:
            "Les étudiant·es analysent les contradictions entre art, société de consommation et transition écologique, et questionnent l'impact écologique de leurs propres pratiques artistiques (transport, exposition, diffusion)."
        }
      ],
      also: [
        'Représenter la complexité des enjeux écologiques',
        'Imaginer de nouvelles manières de penser et de représenter le monde',
        "Réaliser des projets artistiques collectifs favorisant l'engagement",
        'Contribuer à des actions de sensibilisation écologique par les arts',
        'Traduire des enjeux complexes de manière sensible et accessible',
        "Utiliser l'art comme vecteur de mobilisation et de transmission"
      ]
    },
    activities: {
      feedback:
        'Excellent. Cette activité croise création artistique et conscience écologique de manière directement applicable.'
    },
    reflection: {
      sub: "Vous venez de découvrir comment les arts s'inscrivent dans la transition écologique. Prenez un moment pour faire le lien avec votre propre enseignement.",
      prompts: [
        {
          q: 'Quelle forme artistique de votre cours pourrait intégrer un enjeu écologique comme matière ou comme sujet ?',
          placeholder:
            "Par exemple : un atelier de création sur le thème du vivant, une analyse d'œuvres d'art écologique"
        },
        {
          q: "Comment imaginez-vous faire de la transition un terrain d'expérimentation artistique dans votre cours ?",
          placeholder:
            'Par exemple : proposer une contrainte de matériaux durables dans un prochain atelier de création'
        }
      ],
      resourceTitle: 'Art & Transition écologique'
    }
  },
  polsci: {
    flip: {
      statement:
        'La science politique est indispensable pour comprendre et piloter la transition écologique.',
      closing:
        "La transition écologique est avant tout un enjeu politique, car elle touche à la manière dont les sociétés s'organisent, décident, arbitrent et se transforment. Votre discipline est au cœur de ces questions."
    },
    contributions: [
      {
        verb: 'Comprendre la gouvernance',
        text: 'Qui décide, à quel niveau et comment ? Vous apprenez à vos étudiant·es à identifier les différents échelons de gouvernance (local, national, international) et les acteur·rices impliqué·es dans les décisions de transition.',
        activities: [
          {
            title: 'Simuler une négociation climatique internationale (COP)',
            desc: 'Les étudiant·es représentent différents États dans une négociation climatique. Ils et elles expérimentent les mécanismes de coopération et de conflit, et négocient des engagements selon leurs intérêts nationaux.'
          },
          {
            title: "Analyser la gouvernance multi-niveaux d'une politique climatique",
            desc: 'Décrypter comment une politique climatique (par exemple, la loi Climat et résilience) articule les niveaux européen, national et local. Identifier les acteur·rices, les tensions et les marges de manœuvre.'
          }
        ]
      },
      {
        verb: 'Analyser les rapports de pouvoir',
        text: "La transition révèle des conflits d'intérêts entre les sphères économique, politique et sociale. Vos étudiant·es apprennent à décrypter les arbitrages autour des ressources naturelles et de la justice environnementale.",
        activities: [
          {
            title: "Étude de cas : conflits autour d'une ressource naturelle",
            desc: "Analyser un conflit d'usage réel autour d'une ressource (eau, énergie, terres agricoles, littoral) : qui sont les acteur·rices, quels sont leurs intérêts, quels mécanismes de régulation existent ?"
          },
          {
            title: 'Débat : justice climatique Nord/Sud',
            desc: '« Les pays développés ont-ils une responsabilité particulière dans la transition écologique mondiale ? » Débat structuré à partir de données sur les responsabilités historiques et les vulnérabilités actuelles.'
          }
        ]
      },
      {
        verb: 'Évaluer les politiques publiques',
        text: "Concevoir, évaluer et comparer des politiques de transition : instruments utilisés (taxes, réglementations, subventions), ce qui fonctionne ou échoue selon les contextes. C'est au cœur de votre discipline.",
        activities: [
          {
            title: "Évaluer l'efficacité de la tarification carbone",
            desc: "À partir de cas réels (taxe carbone suédoise, marché carbone européen), les étudiant·es analysent les conditions de réussite et d'échec d'un instrument économique de transition."
          },
          {
            title: 'Comparer une politique de transition dans deux pays',
            desc: "Analyse comparative d'une même politique de transition (rénovation thermique, mobilités, énergie) dans deux pays différents : contextes, instruments, résultats, leçons à en tirer."
          }
        ]
      },
      {
        verb: 'Analyser la démocratie écologique',
        text: 'Distinguer et analyser les formes de démocratie mobilisées pour la transition : participative, délibérative. Comprendre le rôle des mobilisations citoyennes et des nouvelles pratiques de gouvernance partagée.',
        activities: [
          {
            title: 'Analyser la Convention citoyenne pour le climat',
            desc: 'Les étudiant·es étudient le processus et les résultats de la CCC française : comment fonctionne la démocratie délibérative ? Quelles recommandations ont été retenues et pourquoi ?'
          },
          {
            title: 'Débat : démocratie et urgence climatique sont-elles compatibles ?',
            desc: "« Les délais démocratiques sont-ils compatibles avec l'urgence de la transition climatique ? » Débat philosophico-politique autour de la tension entre légitimité et efficacité."
          }
        ]
      }
    ],
    competences: {
      intro:
        'En étudiant la transition écologique à travers la science politique, vos étudiant·es développent des compétences analytiques et citoyennes essentielles. En voici les plus significatives.',
      featured: [
        {
          name: 'Analyse des politiques publiques',
          concrete:
            'Les étudiant·es conçoivent et évaluent des politiques de transition, comparent des instruments (taxes carbone, marchés de droits à polluer, réglementations) et identifient ce qui fonctionne selon les contextes.'
        },
        {
          name: 'Analyse critique des récits politiques',
          concrete:
            'Les étudiant·es identifient les récits, croyances et idéologies mobilisés dans les prises de décision politiques sur la transition (croissance verte ou décroissance) et analysent les visions qui orientent les choix collectifs.'
        },
        {
          name: 'Citoyenneté et engagement',
          concrete:
            'Les étudiant·es comprennent le rôle des mobilisations citoyennes et des nouvelles formes de gouvernance partagée, et développent leur capacité à participer aux débats démocratiques sur les enjeux écologiques.'
        }
      ],
      also: [
        'Identifier les acteur·rices de la gouvernance multi-niveaux',
        'Analyser les rapports de force entre les sphères politique, économique et sociale',
        'Comprendre les mécanismes de négociation internationale (COP, ODD)',
        'Relier justice environnementale, justice sociale et développement',
        'Étudier les transitions dans un cadre global Nord/Sud',
        'Analyser les instruments des politiques de transition'
      ]
    },
    activities: {
      feedback:
        'Bien choisi. Cette activité ancre directement les outils de la science politique dans les enjeux de transition contemporains.'
    },
    reflection: {
      sub: "Vous venez de découvrir comment la science politique s'inscrit dans la transition écologique. Prenez un moment pour faire le lien avec votre propre enseignement.",
      prompts: [
        {
          q: 'Quel concept ou quel cas de votre cours a le lien le plus direct avec un enjeu de gouvernance écologique ?',
          placeholder:
            'Par exemple : les politiques publiques, la démocratie participative, les relations internationales'
        },
        {
          q: 'Comment imaginez-vous introduire un cas réel de politique environnementale dans votre prochain cours ?',
          placeholder:
            'Par exemple : analyser une décision de politique climatique récente, simuler une négociation internationale'
        }
      ],
      resourceTitle: 'Science politique & Transition écologique'
    }
  },
  physics: {
    flip: {
      statement: 'La physique est au cœur de la transition écologique.',
      closing:
        "La physique éclaire le fonctionnement de la planète, outille les solutions bas carbone et donne les moyens d'en mesurer les limites. Ces contributions sont déjà dans votre discipline : il s'agit de les rendre visibles."
    },
    contributions: [
      {
        verb: 'Comprendre le système Terre',
        text: "Vous apprenez à vos étudiant·es le bilan radiatif, l'effet de serre, les circulations atmosphérique et océanique. C'est le socle pour comprendre le changement climatique, identifier des points de bascule et prévoir les événements extrêmes.",
        activities: [
          {
            title: 'Construire un bilan radiatif simplifié de la Terre',
            desc: "Les étudiant·es utilisent les lois du rayonnement qu'ils et elles connaissent déjà pour calculer la température d'équilibre de la Terre avec et sans effet de serre, et comprendre ce que change une hausse de la concentration en CO₂."
          },
          {
            title: 'Analyser des données sur la circulation océanique',
            desc: "À partir de données réelles (température, salinité, niveau de la mer), les étudiant·es identifient comment l'océan stocke la chaleur et comment sa circulation évolue avec le changement climatique."
          }
        ]
      },
      {
        verb: 'Développer des énergies soutenables',
        text: "Capter le vent, le rayonnement solaire ou la géothermie, stocker l'énergie, optimiser les réseaux électriques (smart grids) : ce sont des problèmes de physique que vos étudiant·es apprennent à résoudre.",
        activities: [
          {
            title: "Comparer des moyens de production d'électricité",
            desc: 'Les étudiant·es calculent puissance, rendement et émissions de plusieurs filières (éolien, solaire, nucléaire, gaz) et discutent des contraintes physiques propres à chacune.'
          },
          {
            title: "Étudier les performances d'une cellule photovoltaïque",
            desc: "Les étudiant·es exploitent la caractéristique courant-tension d'une cellule pour déterminer son rendement et identifier les facteurs qui le limitent."
          }
        ]
      },
      {
        verb: 'Concevoir des matériaux durables',
        text: 'Matériaux adaptés aux nouvelles contraintes climatiques, procédés de recyclage, alternatives aux matériaux critiques ou épuisables : la physique des matériaux est un levier majeur de la transition.',
        activities: [
          {
            title: 'Comparer le cycle de vie de deux matériaux',
            desc: "Les étudiant·es comparent deux matériaux (par exemple, deux isolants) sur l'énergie de fabrication, la performance et la fin de vie, pour débattre de ce qui fait un choix réellement durable."
          },
          {
            title: 'Chercher des alternatives à un matériau critique',
            desc: 'Les étudiant·es identifient un matériau critique ou épuisable dans une technologie (batterie, aimant) et discutent les procédés alternatifs, leurs performances et leurs limites.'
          }
        ]
      },
      {
        verb: 'Poser un regard critique',
        text: "Par les ordres de grandeur et les modèles, la physique permet d'évaluer les limites de certaines solutions technologiques et d'argumenter pour des approches de sobriété.",
        activities: [
          {
            title: "Estimer par ordre de grandeur la réduction des émissions d'un secteur",
            desc: "Les étudiant·es calculent le potentiel réel de plusieurs leviers (efficacité, changement de motorisation, sobriété) pour réduire les émissions de la mobilité ou de l'aéronautique."
          },
          {
            title: "Évaluer l'empreinte physique du numérique",
            desc: "Les étudiant·es estiment l'énergie et les matériaux mobilisés par un usage numérique courant (streaming, stockage de données) et débattent de ce que les solutions technologiques peuvent ou non résoudre."
          }
        ]
      }
    ],
    competences: {
      intro:
        'En étudiant la transition écologique à travers la physique, vos étudiant·es développent des compétences qui dépassent le calcul. En voici les plus significatives.',
      featured: [
        {
          name: 'Pensée systémique',
          concrete:
            "Les étudiant·es articulent climat, énergie, ressources et technologies, identifient les boucles de rétroaction des systèmes biophysiques et considèrent le cycle de vie complet d'un matériau ou d'un procédé."
        },
        {
          name: 'Analyse critique',
          concrete:
            "Les étudiant·es produisent une analyse bénéfices/risques d'une solution technologique, questionnent les hypothèses d'un modèle, évaluent les incertitudes et articulent efficacité et sobriété."
        },
        {
          name: 'Responsabilité et engagement scientifique',
          concrete:
            'Les étudiant·es réfléchissent aux usages des technologies étudiées, aux implications sociétales des choix scientifiques et techniques, et se situent comme futur·es acteur·rices des transitions.'
        }
      ],
      also: [
        'Articuler climat, énergie, ressources et technologies',
        'Considérer le cycle de vie des matériaux',
        "Croiser la physique avec l'économie, la biologie et les sciences humaines",
        'Comprendre les systèmes sociotechniques',
        "Dialoguer avec d'autres disciplines",
        'Réfléchir aux questions éthiques'
      ]
    },
    activities: {
      feedback:
        'Très bien. Cette activité ancre directement les outils de la physique dans des enjeux concrets de transition.'
    },
    reflection: {
      sub: "Vous venez de découvrir comment la physique s'inscrit dans la transition écologique. Prenez un moment pour faire le lien avec votre propre enseignement.",
      prompts: [
        {
          q: 'Quel chapitre de votre cours a le lien le plus direct avec un enjeu énergétique ou climatique ?',
          placeholder:
            'Par exemple : la thermodynamique, le rayonnement, les ondes, la mécanique des fluides'
        },
        {
          q: "Comment imaginez-vous intégrer un calcul d'ordre de grandeur lié à la transition dans votre prochain cours ?",
          placeholder:
            'Par exemple : estimer la surface de panneaux solaires nécessaire pour alimenter un bâtiment'
        }
      ],
      resourceTitle: 'Physique & Transition écologique'
    }
  },
  anthropology: {
    flip: {
      statement: "L'anthropologie éclaire la dimension humaine de la transition écologique.",
      closing:
        "L'anthropologie permet de définir ou redéfinir des politiques et des modes d'action au plus près des personnes, en vue d'une transition écologique juste et efficace."
    },
    contributions: [
      {
        verb: 'Révéler la diversité des rapports à la nature',
        text: "Vous apprenez à vos étudiant·es que les relations entre humains et non-humains varient selon les contextes culturels, géographiques et historiques. Il existe d'autres manières d'habiter le monde et d'autres valeurs attribuées à la nature.",
        activities: [
          {
            title: 'Comparer deux conceptions de la nature',
            desc: "À partir d'extraits d'ethnographies, les étudiant·es analysent deux sociétés aux rapports à la nature contrastés. Ils et elles identifient ce que chaque conception implique pour la manière d'habiter le monde et d'utiliser les ressources."
          },
          {
            title: 'Analyser les valeurs attribuées à la biodiversité',
            desc: 'Les étudiant·es examinent comment différent·es acteur·rices (habitant·es, scientifiques, ONG, gestionnaires) valorisent une même espèce ou un même espace protégé, et pourquoi ces valeurs entrent parfois en tension.'
          }
        ]
      },
      {
        verb: 'Comprendre les savoirs locaux et autochtones',
        text: "Plantes, animaux, rythmes de la nature : vos étudiant·es découvrent comment ces savoirs sont produits et transmis, et ce qu'ils peuvent apporter, par exemple en agroécologie ou en préservation des écosystèmes.",
        activities: [
          {
            title: 'Étudier un cas de coproduction de savoirs',
            desc: 'Les étudiant·es analysent un exemple où savoirs autochtones et savoirs scientifiques ont été croisés face au changement global : qui a produit quoi, comment les savoirs ont dialogué, quelles difficultés sont apparues.'
          },
          {
            title: 'Discuter la place des savoirs traditionnels dans un projet',
            desc: "Les étudiant·es examinent un projet de gestion ou de restauration d'un milieu et discutent comment y intégrer des savoirs locaux, à quelles conditions et avec quelles précautions éthiques."
          }
        ]
      },
      {
        verb: 'Décrire les modes de vie',
        text: "Organisation sociale, gouvernance, techniques, savoirs sur l'environnement : vos étudiant·es apprennent à observer comment les sociétés vivent avec leur milieu et comment elles évoluent face au changement global.",
        activities: [
          {
            title: "Mener une mini-enquête sur les pratiques d'un milieu",
            desc: "Les étudiant·es réalisent quelques entretiens ou observations auprès d'usager·es d'un lieu (jardin partagé, rivière, littoral) pour décrire leurs pratiques, leurs savoirs et leur rapport au milieu."
          },
          {
            title: "Analyser l'évolution d'un mode de vie face au changement global",
            desc: "À partir d'un terrain étudié en cours, les étudiant·es décrivent comment l'organisation sociale et les techniques d'une communauté se transforment sous l'effet d'un changement environnemental."
          }
        ]
      },
      {
        verb: "Ouvrir d'autres perspectives",
        text: "L'anthropologie invite à prendre du recul sur la croissance, le progrès ou le développement, et légitime d'autres horizons comme la sobriété ou le « bien vivre ».",
        activities: [
          {
            title: 'Débat : croissance, sobriété ou bien vivre ?',
            desc: "À partir de sociétés étudiées en cours, les étudiant·es argumentent sur ce que signifient progrès et développement, et sur ce que pourraient être d'autres trajectoires."
          },
          {
            title: 'Interroger ses propres pratiques de terrain',
            desc: "Les étudiant·es identifient l'impact écologique d'un projet de terrain (déplacements, outils, méthodes) et proposent des ajustements, tout en questionnant leur posture de chercheur·euse."
          }
        ]
      }
    ],
    competences: {
      intro:
        "En étudiant la transition écologique à travers l'anthropologie, vos étudiant·es développent des compétences d'analyse, de dialogue et de réflexion éthique essentielles. En voici les plus significatives.",
      featured: [
        {
          name: 'Analyse des représentations de la nature',
          concrete:
            'Les étudiant·es décrivent la diversité des rapports au vivant, interprètent les imaginaires, croyances et systèmes de valeurs associés à la nature et analysent leur influence sur les modes de vie.'
        },
        {
          name: 'Accompagnement du changement et dialogue',
          concrete:
            "Les étudiant·es identifient les freins et leviers sociaux à l'appropriation des enjeux écologiques, traduisent des savoirs complexes pour différents publics et intègrent les savoirs locaux dans les prises de décision."
        },
        {
          name: 'Conduite éthique et responsable du terrain',
          concrete:
            "Les étudiant·es mobilisent l'observation participante, les entretiens et les enquêtes ethnographiques, et questionnent leur propre position, leurs biais et les rapports de domination historiques."
        }
      ],
      also: [
        'Définir les différents types de savoirs (locaux, académiques)',
        'Questionner les modèles de développement et les discours',
        'Appréhender les interactions écologiques, sociales, économiques et politiques',
        'Faciliter le dialogue entre acteur·rices aux intérêts variés',
        "Collaborer avec d'autres disciplines",
        "S'impliquer dans des démarches de recherche-action"
      ]
    },
    activities: {
      feedback:
        "Bien choisi. Cette activité ancre directement les outils de l'anthropologie dans des situations concrètes de transition."
    },
    reflection: {
      sub: "Vous venez de découvrir comment l'anthropologie s'inscrit dans la transition écologique. Prenez un moment pour faire le lien avec votre propre enseignement.",
      prompts: [
        {
          q: 'Quelle société, quel terrain ou quel·le auteur·rice de votre cours éclaire le mieux un enjeu de rapport à la nature ?',
          placeholder:
            'Par exemple : un terrain étudié en cours, la distinction nature/culture, les savoirs autochtones'
        },
        {
          q: 'Comment imaginez-vous introduire la question écologique dans votre prochain cours ?',
          placeholder:
            'Par exemple : ajouter une question sur les savoirs locaux ou sur les valeurs attribuées à la biodiversité'
        }
      ],
      resourceTitle: 'Anthropologie & Transition écologique'
    }
  }
};
