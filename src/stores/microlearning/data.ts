import { type Data } from '@/types/microlearning';
export const DATA: Data = {
  math: {
    steps: [
      // STEP 1: FLIP CARDS (APPORTS)
      {
        type: 'flip',
        statement: 'Vous enseignez déjà les outils de la transition écologique.',
        hint: 'Cliquez sur chaque carte pour découvrir le lien.',
        cards: [
          {
            verb: 'Mesurer et représenter',
            text: "Vous apprenez à vos étudiants à lire, analyser et visualiser des données. C'est exactement ainsi que des enjeux comme le changement climatique et la perte de biodiversité sont suivis. Par exemple, en analysant l'évolution des émissions de CO₂ en France sur plusieurs décennies.",
            color: 'ct'
          },
          {
            verb: 'Modéliser',
            text: "Simuler l'évolution du climat ou prédire la dynamique des écosystèmes, ce sont des modèles mathématiques. Vous apprenez à vos étudiants à construire ce type de raisonnement. Par exemple, modéliser comment une ville évolue face à la hausse des températures et au risque d'inondation.",
            color: 'cp'
          },
          {
            verb: 'Optimiser',
            text: "Optimiser les ressources et l'énergie est au cœur de la transition. Vous enseignez les outils pour résoudre ces problèmes. Par exemple, calculer comment distribuer l'électricité sur un smart grid pour minimiser les pertes.",
            color: 'ck'
          },
          {
            verb: 'Aider à la décision',
            text: "La transition nécessite des indicateurs pour guider les décisions politiques et économiques. Vous apprenez à vos étudiants à construire et interpréter ces outils. Par exemple, calculer l'empreinte carbone d'un produit sur l'ensemble de son cycle de vie.",
            color: 'cy'
          }
        ],
        closing:
          "Ces contributions sont déjà intégrées dans votre discipline. Vous n'avez pas besoin d'ajouter de nouveaux contenus : il s'agit de rendre la connexion visible pour vos étudiants."
      },
      // STEP 2: COMPETENCES
      {
        type: 'competences',
        intro:
          'En étudiant la transition écologique à travers les mathématiques, vos étudiants développent des compétences qui dépassent le calcul. Voici les plus significatives.',
        featured: [
          {
            name: 'Pensée critique',
            tag: 'transversal',
            tagClass: 'transversal',
            concrete:
              "Vos étudiants apprennent à questionner les choix de paramètres dans un modèle climatique : pourquoi ces données et pas d'autres ? Quelles sont les limites et les incertitudes du modèle ?"
          },
          {
            name: 'Interdisciplinarité',
            tag: 'transversal',
            tagClass: 'transversal',
            concrete:
              "En croisant mathématiques et climatologie, vos étudiants comprennent pourquoi les marges d'incertitude du GIEC sont exprimées en probabilités et comment différentes disciplines collaborent pour produire une connaissance."
          },
          {
            name: 'Responsabilité et éthique',
            tag: 'transversal',
            tagClass: 'transversal',
            concrete:
              "Vos étudiants questionnent ce qu'un modèle peut et ne peut pas dire : la frontière entre ce qui est efficace, probable et souhaitable dans le contexte des politiques climatiques."
          }
        ],
        also: [
          'Modélisation mathématique des socio-écosystèmes',
          'Analyse statistique et probabiliste',
          'Équations différentielles',
          'Traduction de problèmes concrets en équations',
          'Analyse de la fiabilité des données',
          'Raisonner en scénarios',
          'Communiquer des résultats complexes'
        ]
      },
      // STEP 3: ACTIVITIES
      {
        type: 'activities',
        intro:
          'Voici des activités concrètes que vous pouvez intégrer dans une séance existante. Choisissez celle qui correspond le mieux à ce que vous enseignez.',
        apports: [
          {
            label: 'Mesurer et représenter',
            color: 'ct',
            acts: [
              {
                title: 'Analyser les températures locales',
                desc: "Les étudiants travaillent sur des données réelles de températures historiques pour identifier des tendances et des variables clés à l'aide d'outils statistiques qu'ils connaissent déjà."
              },
              {
                title: 'Critiquer une représentation de données climatiques',
                desc: "Donner aux étudiants deux graphiques représentant les mêmes données climatiques différemment. Ils analysent ce que chaque représentation met en valeur et ce qu'elle cache."
              }
            ]
          },
          {
            label: 'Modéliser',
            color: 'cp',
            acts: [
              {
                title: "Modéliser l'évolution d'un écosystème urbain",
                desc: "Les étudiants construisent un modèle simple d'évolution d'une ville face à la montée des eaux, en utilisant les équations différentielles ou les fonctions qu'ils ont déjà vues en cours."
              },
              {
                title: "Simuler la propagation d'une espèce invasive",
                desc: "À partir de données réelles sur une espèce invasive, les étudiants utilisent des fonctions exponentielles ou logistiques pour modéliser et prédire l'évolution de la population."
              }
            ]
          },
          {
            label: 'Optimiser',
            color: 'ck',
            acts: [
              {
                title: "Optimiser la distribution d'énergie renouvelable",
                desc: "Les étudiants résolvent un problème d'optimisation : comment distribuer l'électricité produite par des panneaux solaires dans un quartier pour minimiser les pertes et les coûts."
              },
              {
                title: "Calculer l'efficacité d'un système de transport durable",
                desc: "Comparer mathematiquement deux systèmes de transport (voiture individuelle vs transport en commun) sur des critères d'énergie, de temps et d'émissions. Un problème d'optimisation multi-critères."
              }
            ]
          },
          {
            label: 'Aider à la décision',
            color: 'cy',
            acts: [
              {
                title: "Calculer l'empreinte carbone de deux modes de vie",
                desc: "Les étudiants comparent l'empreinte carbone de deux profils d'étudiant avec des modes de vie différents : transport, alimentation, énergie. Des chiffres concrets, des maths familières."
              },
              {
                title: 'Construire un indicateur de durabilité',
                desc: "Les étudiants conçoivent un indice simple pour évaluer la durabilité d'un territoire, en choisissant leurs variables et en justifiant leurs pondérations. Introduit la complexité des choix derrière tout indicateur."
              }
            ]
          }
        ],
        feedback:
          "Bonne idée. Cette activité peut s'intégrer directement dans une séance existante sans modifier votre programme."
      },
      // STEP 4: A VOTRE TOUR
      {
        type: 'votretour',
        statement: 'À votre tour.',
        sub: "Vous venez de découvrir comment les mathématiques s'inscrivent dans la transition écologique. Prenez un moment pour faire le lien avec votre propre cours.",
        prompts: [
          {
            q: 'Quel concept enseignez-vous qui pourrait être connecté à la TEDS ?',
            placeholder:
              "Ex : les fonctions exponentielles, les probabilités, l'analyse de données..."
          },
          {
            q: 'Comment imaginez-vous faire cette connexion dans votre prochain cours ?',
            placeholder:
              'Ex : remplacer un exemple générique par des données climatiques réelles...'
          }
        ],
        resource: {
          label: 'Ressource UVED',
          title: 'Mathématiques et Transition Écologique et au Développement Soutenable',
          href: 'https://www.uved.fr/fileadmin/user_upload/Documents/pdf/Fiches/Fiche_Mathematiques_et_TEDS.pdf'
        }
      }
    ]
  },
  history: {
    steps: [
      {
        type: 'flip',
        statement: "L'histoire éclaire déjà les enjeux de la transition écologique.",
        hint: 'Cliquez sur chaque carte pour découvrir le lien.',
        cards: [
          {
            verb: 'Comprendre',
            text: "L'histoire analyse les relations entre sociétés et environnement sur le temps long.",
            color: 'ct'
          },
          {
            verb: 'Analyser',
            text: 'Elle décrypte les mécanismes permettant aux sociétés de répondre aux défis environnementaux.',
            color: 'cp'
          },
          {
            verb: 'Éclairer',
            text: 'Elle extrait des expériences passées des leçons pour guider les politiques actuelles.',
            color: 'ck'
          },
          {
            verb: 'Contextualiser',
            text: 'Elle explicite les racines historiques des problèmes écologiques contemporains.',
            color: 'cy'
          }
        ],
        closing:
          'Votre discipline offre une perspective systémique, critique et contextualisée sur la transition écologique.'
      },
      {
        type: 'competences',
        intro:
          "En étudiant la transition écologique à travers l'histoire, vos étudiants développent des compétences essentielles.",
        featured: [
          {
            name: 'Pensée critique',
            tag: 'transversal',
            tagClass: 'transversal',
            concrete:
              'Les étudiants apprennent à identifier et croiser plusieurs types de sources sur les crises environnementales passées.'
          },
          {
            name: 'Analyse systémique',
            tag: 'transversal',
            tagClass: 'transversal',
            concrete:
              "En mobilisant l'ensemble des disciplines pour analyser l'histoire, les étudiants comprennent les interactions complexes entre sociétés et environnement."
          },
          {
            name: 'Conscience citoyenne',
            tag: 'transversal',
            tagClass: 'transversal',
            concrete:
              'Les étudiants définissent leur responsabilité individuelle et collective par rapport aux transformations à engager.'
          }
        ],
        also: [
          "Identifier les sources de l'histoire environnementale",
          'Analyser des transformations socio-environnementales',
          "Délimiter des événements dans le temps et l'espace",
          'Comparer différentes périodes historiques',
          'Capacité à proposer des solutions'
        ]
      },
      {
        type: 'activities',
        intro: 'Des activités concrètes que vous pouvez intégrer dans une séance existante.',
        apports: [
          {
            label: 'Comprendre',
            color: 'ct',
            acts: [
              {
                title: 'Analyser des archives industrielles',
                desc: 'Les étudiants étudient des archives sur la révolution industrielle et ses impacts environnementaux à travers un prisme écologique.'
              },
              {
                title: 'Étudier une catastrophe écologique',
                desc: 'Analyser une grande catastrophe (marée noire, accident industriel) comme révélateur des tensions entre économie, politique et environnement.'
              }
            ]
          },
          {
            label: 'Analyser',
            color: 'cp',
            acts: [
              {
                title: 'Étude de cas comparative',
                desc: 'Comparer deux sociétés face à la gestion de leurs ressources : Rome antique et la surexploitation agricole vs une société ayant réussi sa transition.'
              },
              {
                title: 'Débat historique',
                desc: '"La révolution industrielle était-elle inévitablement une catastrophe écologique ?" Les étudiants argumentent avec des sources historiques.'
              }
            ]
          },
          {
            label: 'Éclairer',
            color: 'ck',
            acts: [
              {
                title: 'Relier passé et présent',
                desc: "Les étudiants identifient les racines historiques d'un problème écologique contemporain et proposent des leçons à en tirer pour les politiques actuelles."
              },
              {
                title: 'Atelier prospectif',
                desc: "Rédiger un court récit de prospective en se basant sur des tendances historiques identifiées. Comprendre l'importance des récits collectifs."
              }
            ]
          },
          {
            label: 'Contextualiser',
            color: 'cy',
            acts: [
              {
                title: 'Frise chronologique des pressions anthropiques',
                desc: "Les étudiants construisent une frise des grandes étapes de l'accroissement des pressions humaines sur l'environnement."
              },
              {
                title: "Analyser un ODD à travers l'histoire",
                desc: "Choisir un Objectif de Développement Durable et retracer ses racines historiques. Exercice d'introduction historique aux ODD."
              }
            ]
          }
        ],
        feedback: "Parfait. Cette activité s'intègre directement dans une séance existante."
      },
      {
        type: 'votretour',
        statement: 'À votre tour.',
        sub: "Vous venez de découvrir comment l'histoire s'inscrit dans la transition écologique. Prenez un moment pour faire le lien avec votre propre cours.",
        prompts: [
          {
            q: 'Quelle période ou quel événement de votre cours a la dimension environnementale la plus visible ?',
            placeholder:
              'Ex : la révolution industrielle, la décolonisation, les grandes catastrophes...'
          },
          {
            q: 'Comment imaginez-vous introduire cette dimension dans votre prochain cours ?',
            placeholder:
              "Ex : ajouter une question sur les impacts environnementaux d'un événement étudié..."
          }
        ],
        resource: {
          label: 'Ressource UVED',
          title: 'Histoire et Transition Écologique et au Développement Soutenable',
          href: 'https://www.uved.fr/fileadmin/user_upload/Documents/pdf/Fiches/Fiche_Histoire_et_TEDS.pdf'
        }
      }
    ]
  },
  economics: {
    steps: [
      {
        type: 'flip',
        statement: 'Vous enseignez déjà les outils de la transition écologique.',
        hint: 'Cliquez sur chaque carte pour découvrir le lien.',
        cards: [
          {
            verb: 'Diagnostiquer',
            text: "Estimer le coût des dégradations environnementales et évaluer les bénéfices d'une exploitation durable des ressources.",
            color: 'ct'
          },
          {
            verb: 'Réguler',
            text: "Proposer des instruments économiques comme la fiscalité ou les subventions pour impulser la réduction de l'empreinte environnementale.",
            color: 'cp'
          },
          {
            verb: 'Modéliser',
            text: 'Construire des modèles alternatifs : économie circulaire, décroissance, économie écologique, limites planétaires.',
            color: 'ck'
          },
          {
            verb: 'Décider',
            text: "Fournir des outils d'aide à la décision pour rendre la transition écologique attractive sur le plan économique et social.",
            color: 'cy'
          }
        ],
        closing:
          "L'économie propose une diversité d'approches pour articuler durabilité, prospérité et justice sociale."
      },
      {
        type: 'competences',
        intro:
          "En étudiant la transition écologique à travers l'économie, vos étudiants développent des compétences analytiques et critiques essentielles.",
        featured: [
          {
            name: 'Analyse systémique',
            tag: 'disciplinaire',
            tagClass: 'disciplinaire',
            concrete:
              "Les étudiants intègrent les limites planétaires dans l'analyse économique, dans une perspective interdisciplinaire qui va au-delà des modèles standard."
          },
          {
            name: 'Analyse prospective',
            tag: 'disciplinaire',
            tagClass: 'disciplinaire',
            concrete:
              'Les étudiants décrivent les hypothèses économiques des différents scénarios de transition et anticipent les réactions des acteurs face aux politiques environnementales.'
          },
          {
            name: 'Capacité à agir',
            tag: 'transversal',
            tagClass: 'transversal',
            concrete:
              "Les étudiants appliquent des analyses coûts-bénéfices à des politiques climatiques réelles et évaluent l'efficacité d'une fiscalité environnementale."
          }
        ],
        also: [
          'Analyse critique des modèles économiques',
          'Évaluer les coûts sur le cycle de vie',
          'Justice climatique et inégalités',
          'Modéliser les impacts de politiques publiques',
          'Évaluer les stratégies alternatives de régulation'
        ]
      },
      {
        type: 'activities',
        intro: 'Des activités concrètes que vous pouvez intégrer dans une séance existante.',
        apports: [
          {
            label: 'Diagnostiquer',
            color: 'ct',
            acts: [
              {
                title: "Calculer le coût de l'inaction climatique",
                desc: "Les étudiants utilisent les données du rapport Stern pour estimer le coût économique de l'inaction climatique versus le coût des politiques d'atténuation."
              },
              {
                title: "Analyser les externalités d'une industrie",
                desc: "Identifier et quantifier les externalités négatives d'un secteur industriel (pollution, perte de biodiversité). Qui paie ces coûts et comment ?"
              }
            ]
          },
          {
            label: 'Réguler',
            color: 'cp',
            acts: [
              {
                title: 'Débat sur la taxe carbone',
                desc: '"À quelles conditions une taxe carbone peut-elle être un outil juste et efficace ?" Les étudiants argumentent des positions en utilisant des données économiques et des critères d\'équité.'
              },
              {
                title: "Simulation d'une négociation climatique (COP)",
                desc: "Les étudiants représentent différents pays dans une négociation climatique, appliquant les concepts de biens publics, d'externalités et de compromis entre développement et atténuation."
              }
            ]
          },
          {
            label: 'Modéliser',
            color: 'ck',
            acts: [
              {
                title: 'Modéliser une économie circulaire',
                desc: 'À partir des conditions mathématiques de François Grosse (taux de recyclage, taux de croissance), les étudiants testent dans quelles conditions une économie peut être réellement circulaire.'
              },
              {
                title: 'Construire une trajectoire de neutralité carbone',
                desc: 'Les étudiants élaborent une trajectoire économique compatible avec la neutralité carbone en 2050, en identifiant les leviers et les contraintes.'
              }
            ]
          },
          {
            label: 'Décider',
            color: 'cy',
            acts: [
              {
                title: "Analyse coûts-bénéfices d'une politique climatique",
                desc: "Évaluer les gains et les coûts d'une action visant à réduire les émissions de gaz à effet de serre, en utilisant par exemple le modèle de Nordhaus."
              },
              {
                title: 'Concevoir un projet de territoire durable',
                desc: 'Projet interdisciplinaire : concevoir un territoire durable en intégrant des contraintes écologiques, sociales et économiques. Les étudiants défendent leurs choix.'
              }
            ]
          }
        ],
        feedback:
          'Excellente idée. Cette activité connecte directement les outils économiques que vous enseignez à des enjeux concrets.'
      },
      {
        type: 'votretour',
        statement: 'À votre tour.',
        sub: "Vous venez de découvrir comment l'économie s'inscrit dans la transition écologique. Faites le lien avec votre propre enseignement.",
        prompts: [
          {
            q: 'Quel concept économique de votre cours se connecte le plus naturellement à la transition écologique ?',
            placeholder: "Ex : les externalités, les biens publics, l'analyse coûts-bénéfices..."
          },
          {
            q: 'Comment imaginez-vous enrichir un de vos cours existants avec une dimension TEDS ?',
            placeholder:
              'Ex : remplacer un exemple générique par un cas de politique environnementale réelle...'
          }
        ],
        resource: {
          label: 'Ressource UVED',
          title: 'Économie et Transition Écologique et au Développement Soutenable',
          href: 'https://www.uved.fr/fileadmin/user_upload/Documents/pdf/Fiches/Fiche_Economie_et_TEDS.pdf'
        }
      }
    ]
  },
  law: {
    steps: [
      {
        type: 'flip',
        statement: 'Le droit est au cœur de la transition écologique.',
        hint: 'Cliquez sur chaque carte pour découvrir le lien.',
        cards: [
          {
            verb: 'Définir',
            text: "Le droit fixe les principes constitutionnels de protection de l'environnement : prévention, précaution, non-régression, pollueur-payeur.",
            color: 'ct'
          },
          {
            verb: 'Encadrer',
            text: 'Il organise les activités humaines pour limiter leur impact : urbanisme, industrie, agriculture, mines, transports.',
            color: 'cp'
          },
          {
            verb: 'Responsabiliser',
            text: "Il gère les litiges, sanctionne les atteintes à l'environnement et établit les régimes de responsabilité écologique.",
            color: 'ck'
          },
          {
            verb: 'Gouverner',
            text: 'Il organise la participation du public aux décisions environnementales et établit les compétences des autorités publiques.',
            color: 'cy'
          }
        ],
        closing:
          "Le droit permet une prise de décision encadrée, démocratique et transparente, au service de l'intérêt général et dans le respect des limites planétaires."
      },
      {
        type: 'competences',
        intro:
          'En étudiant la transition écologique à travers le droit, vos étudiants développent des compétences analytiques et citoyennes essentielles.',
        featured: [
          {
            name: 'Analyse critique',
            tag: 'disciplinaire',
            tagClass: 'disciplinaire',
            concrete:
              "Les étudiants interprètent une loi sur l'énergie ou le climat et distinguent ce qui relève du droit national, européen et international."
          },
          {
            name: 'Analyse systémique',
            tag: 'transversal',
            tagClass: 'transversal',
            concrete:
              "Les étudiants identifient le droit comme outil de transformation sociale et comprennent les liens entre droit de l'environnement et autres domaines juridiques."
          },
          {
            name: 'Action collective',
            tag: 'transversal',
            tagClass: 'transversal',
            concrete:
              "Les étudiants mobilisent le vocabulaire juridique pour argumenter en faveur de la protection de l'environnement dans des cas concrets."
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
      {
        type: 'activities',
        intro: 'Des activités concrètes que vous pouvez intégrer dans une séance existante.',
        apports: [
          {
            label: 'Définir',
            color: 'ct',
            acts: [
              {
                title: "Analyser la Charte de l'Environnement",
                desc: "Les étudiants étudient la Charte constitutionnelle de l'Environnement française : quels droits et devoirs crée-t-elle ? Quelles limites ? Quelle effectivité ?"
              },
              {
                title: 'Comparer les principes environnementaux en droit européen et national',
                desc: 'Identifier comment les principes de précaution et de pollueur-payeur se déclinent différemment selon les niveaux de gouvernance.'
              }
            ]
          },
          {
            label: 'Encadrer',
            color: 'cp',
            acts: [
              {
                title: 'Étude de cas : un projet face au droit environnemental',
                desc: "Analyser la légalité et la constitutionnalité d'un projet d'aménagement (éolienne, mine, autoroute) au regard du droit de l'environnement."
              },
              {
                title: 'Lire et analyser une loi environnementale',
                desc: 'Décortiquer un texte juridique environnemental récent pour identifier ses mécanismes, ses lacunes et les résistances à son application.'
              }
            ]
          },
          {
            label: 'Responsabiliser',
            color: 'ck',
            acts: [
              {
                title: 'Analyser une décision de justice pénale environnementale',
                desc: "Étude d'un cas réel de préjudice écologique pour comprendre comment le droit traite les atteintes à l'environnement et la réparation."
              },
              {
                title: "Jeu de rôle : conflits d'usage",
                desc: 'Les étudiants incarnent différents acteurs face à une controverse environnementale (agriculteurs, ONG, collectivité, État) pour comprendre les tensions juridiques.'
              }
            ]
          },
          {
            label: 'Gouverner',
            color: 'cy',
            acts: [
              {
                title: 'Simuler une réunion publique environnementale',
                desc: "Débattre dans une instance de dialogue fictive autour d'un projet pour confronter des points de vue opposés et comprendre la démocratie environnementale."
              },
              {
                title: 'Rédiger un projet de loi fictif',
                desc: 'Les étudiants rédigent un projet de loi ou des amendements sur un sujet environnemental, découvrant ainsi le processus législatif et les compromis nécessaires.'
              }
            ]
          }
        ],
        feedback:
          'Très bien. Cette activité ancre directement les mécanismes juridiques dans des situations réelles.'
      },
      {
        type: 'votretour',
        statement: 'À votre tour.',
        sub: "Vous venez de découvrir comment le droit s'inscrit dans la transition écologique. Faites le lien avec votre propre enseignement.",
        prompts: [
          {
            q: "Quel principe juridique de votre cours a l'application environnementale la plus directe ?",
            placeholder:
              'Ex : la responsabilité civile, le principe de précaution, les droits fondamentaux...'
          },
          {
            q: 'Comment imaginez-vous utiliser un cas environnemental réel dans votre prochain cours ?',
            placeholder:
              'Ex : étudier une décision de justice récente, analyser une loi en vigueur...'
          }
        ],
        resource: {
          label: 'Ressource UVED',
          title: 'Droit et Transition Écologique et au Développement Soutenable',
          href: 'https://www.uved.fr/fileadmin/user_upload/Documents/pdf/Fiches/Fiche_Droit_et_TEDS.pdf'
        }
      }
    ]
  },
  philosophy: {
    steps: [
      {
        type: 'flip',
        statement: 'La philosophie pense déjà les enjeux de la transition écologique.',
        hint: 'Cliquez sur chaque carte pour découvrir le lien.',
        cards: [
          {
            verb: 'Questionner',
            text: 'La philosophie met en question les finalités du progrès et du développement et interroge les présupposés culturels de la modernité.',
            color: 'ct'
          },
          {
            verb: 'Éthiquer',
            text: 'Elle questionne les principes éthiques qui guident les choix individuels et collectifs, et éclaire la notion de responsabilité intergénérationnelle.',
            color: 'cp'
          },
          {
            verb: 'Critiquer',
            text: 'Elle critique les dualismes nature/culture, humains/non-humains, et décrit les différentes valeurs qui sous-tendent notre relation à la nature.',
            color: 'ck'
          },
          {
            verb: 'Imaginer',
            text: "Elle définit les conditions d'une démocratie écologique et réfléchit au vivre-ensemble avec les autres vivants, humains et non-humains.",
            color: 'cy'
          }
        ],
        closing:
          'La philosophie prépare aux choix éthiques, politiques et existentiels que pose la transition écologique et participe à la construction de citoyens lucides et responsables.'
      },
      {
        type: 'competences',
        intro:
          "En étudiant la transition écologique à travers la philosophie, vos étudiants développent des compétences de pensée et d'argumentation essentielles.",
        featured: [
          {
            name: 'Problématiser',
            tag: 'disciplinaire',
            tagClass: 'disciplinaire',
            concrete:
              'Les étudiants posent des questions fondamentales sur la responsabilité envers les générations futures, sur la valeur intrinsèque de la nature, sur ce que signifie le progrès.'
          },
          {
            name: 'Esprit critique',
            tag: 'transversal',
            tagClass: 'transversal',
            concrete:
              'Les étudiants distinguent les connaissances des opinions et remettent en question les évidences, notamment les grands récits du progrès et de la croissance.'
          },
          {
            name: 'Réflexivité citoyenne',
            tag: 'transversal',
            tagClass: 'transversal',
            concrete:
              'Les étudiants articulent plusieurs dimensions de la responsabilité : individuelle, collective, historique, intergénérationnelle, morale et juridique.'
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
      {
        type: 'activities',
        intro: 'Des activités concrètes que vous pouvez intégrer dans une séance existante.',
        apports: [
          {
            label: 'Questionner',
            color: 'ct',
            acts: [
              {
                title: 'Dissertation sur le progrès et ses limites',
                desc: '"Le progrès technique peut-il résoudre la crise écologique ?" Une question philosophique classique rendue urgente par les enjeux contemporains.'
              },
              {
                title: "Analyser un texte sur la modernité et l'environnement",
                desc: "Lire et commenter un extrait de Hans Jonas, Dominique Bourg ou Bruno Latour. Les étudiants développent l'analyse de texte sur des auteurs directement pertinents."
              }
            ]
          },
          {
            label: 'Éthiquer',
            color: 'cp',
            acts: [
              {
                title: 'Débat sur la responsabilité intergénérationnelle',
                desc: '"Avons-nous des obligations morales envers les générations futures ?" Croiser Rawls, Jonas et les théories de la justice climatique dans un débat structuré.'
              },
              {
                title: 'Élaborer une charte éthique',
                desc: "En groupes, les étudiants rédigent une charte éthique pour une institution (université, entreprise, ville) face à un défi écologique précis. Teste l'éthique appliquée."
              }
            ]
          },
          {
            label: 'Critiquer',
            color: 'ck',
            acts: [
              {
                title: 'Étude du véganism comme cas philosophique',
                desc: 'Aborder le véganism non comme un choix de vie mais comme un test case philosophique : quels cadres éthiques remet-il en question ? Quels fondements moraux révèle-t-il ?'
              },
              {
                title: 'Critiquer le dualisme nature/culture',
                desc: 'À partir de textes de Latour ou Descola, les étudiants déconstruisent la séparation nature/culture et explorent ses implications pour la crise écologique.'
              }
            ]
          },
          {
            label: 'Imaginer',
            color: 'cy',
            acts: [
              {
                title: 'Discussion à visée philosophique sur la justice climatique',
                desc: 'Croiser philosophie et géographie sur la question : qui subit le plus les effets du changement climatique et qui en est le plus responsable ? Est-ce juste ?'
              },
              {
                title: 'Concevoir une démocratie écologique',
                desc: "Les étudiants définissent les conditions d'une démocratie qui intègre les limites planétaires et la représentation des générations futures. Exercice de philosophie politique."
              }
            ]
          }
        ],
        feedback:
          'Bien choisi. Cette activité ancre la philosophie dans des questions que vos étudiants vivent réellement.'
      },
      {
        type: 'votretour',
        statement: 'À votre tour.',
        sub: "Vous venez de découvrir comment la philosophie s'inscrit dans la transition écologique. Faites le lien avec votre propre enseignement.",
        prompts: [
          {
            q: 'Quel concept de votre cours a le lien le plus direct avec un enjeu écologique ?',
            placeholder:
              'Ex : la responsabilité, la justice, le progrès, la nature, le bien commun...'
          },
          {
            q: 'Comment imaginez-vous introduire un exemple ou un texte lié à la TEDS dans votre prochaine séance ?',
            placeholder:
              'Ex : remplacer un exemple classique par une situation écologique contemporaine...'
          }
        ],
        resource: {
          label: 'Ressource UVED',
          title: 'Philosophie et Transition Écologique et au Développement Soutenable',
          href: 'https://www.uved.fr/fileadmin/user_upload/Documents/pdf/Fiches/Fiche_Philosophie_et_TEDS.pdf'
        }
      }
    ]
  },
  psychology: {
    steps: [
      {
        type: 'flip',
        statement: 'La psychologie éclaire les dimensions humaines de la transition écologique.',
        hint: 'Cliquez sur chaque carte pour découvrir le lien.',
        cards: [
          {
            verb: 'Comprendre',
            text: 'Analyser la perception et les représentations des risques environnementaux, et comprendre nos rapports aux différents espaces engagés par la transition.',
            color: 'ct'
          },
          {
            verb: 'Réguler',
            text: "Comprendre et réguler les émotions associées aux changements environnementaux : éco-anxiété, solastalgie, sentiment de perte ou d'impuissance.",
            color: 'cp'
          },
          {
            verb: 'Mobiliser',
            text: "Identifier les freins psychologiques au changement et mobiliser les leviers pour favoriser l'action : normes sociales, nudges verts, processus identitaires.",
            color: 'ck'
          },
          {
            verb: 'Accompagner',
            text: "Soutenir la durabilité psychologique en accompagnant les individus pour qu'ils demeurent actifs et constructifs malgré l'angoisse environnementale.",
            color: 'cy'
          }
        ],
        closing:
          'La psychologie permet de passer des connaissances aux actions, en tenant compte de ce que les humains perçoivent et ressentent face aux enjeux écologiques.'
      },
      {
        type: 'competences',
        intro:
          'En étudiant la transition écologique à travers la psychologie, vos étudiants développent des compétences analytiques et appliquées essentielles.',
        featured: [
          {
            name: 'Pensée complexe et systémique',
            tag: 'transversal',
            tagClass: 'transversal',
            concrete:
              "Les étudiants identifient les liens entre émotions, comportements pro-environnementaux et politiques de durabilité, comprenant la complexité des représentations liées à l'environnement."
          },
          {
            name: 'Analyse critique',
            tag: 'transversal',
            tagClass: 'transversal',
            concrete:
              'Les étudiants comprennent ce qui sous-tend les discours et les comportements environnementaux et identifient leur propre posture par rapport à ces enjeux.'
          },
          {
            name: 'Capacité à transformer',
            tag: 'transversal',
            tagClass: 'transversal',
            concrete:
              "Les étudiants conçoivent des stratégies de changement et accompagnent les individus pour transformer la vulnérabilité et l'anxiété en action et en résilience."
          }
        ],
        also: [
          'Comprendre les comportements humains en contexte de transition',
          'Concevoir et évaluer des stratégies de changement',
          'Communiquer pour informer et engager',
          'Analyser les mécanismes de décision',
          'Représentations sociales et sens commun'
        ]
      },
      {
        type: 'activities',
        intro: 'Des activités concrètes que vous pouvez intégrer dans une séance existante.',
        apports: [
          {
            label: 'Comprendre',
            color: 'ct',
            acts: [
              {
                title: 'Analyser la perception du risque climatique',
                desc: 'Les étudiants étudient comment différentes populations perçoivent le risque climatique à travers une perspective psychosociale, en identifiant les biais cognitifs et culturels.'
              },
              {
                title: "Étude comparative de l'éco-anxiété",
                desc: "Comparer la perception de l'éco-anxiété dans différents contextes culturels et régionaux. Les étudiants analysent des témoignages et appliquent des cadres psychologiques."
              }
            ]
          },
          {
            label: 'Réguler',
            color: 'cp',
            acts: [
              {
                title: "Débat : l'éco-anxiété, pathologie ou réponse adaptée ?",
                desc: '"L\'éco-anxiété est-elle une pathologie à traiter ou un indicateur psychologique sain du changement climatique ?" Débat structuré avec des arguments scientifiques.'
              },
              {
                title: "Analyser des mécanismes cognitifs liés à l'éco-anxiété",
                desc: "À partir de témoignages anonymisés, les étudiants identifient les mécanismes cognitifs et émotionnels liés à l'éco-anxiété et proposent des stratégies d'accompagnement."
              }
            ]
          },
          {
            label: 'Mobiliser',
            color: 'ck',
            acts: [
              {
                title: 'Concevoir une campagne de nudges verts',
                desc: 'Les étudiants appliquent les théories psychologiques (normes sociales, comportement planifié) pour concevoir une campagne de sensibilisation sur le campus universitaire.'
              },
              {
                title: 'Observer et analyser des comportements écoresponsables',
                desc: 'Observer les comportements de tri ou les choix alimentaires en contexte réel, interroger les personnes sur leurs motivations et appliquer des cadres psychosociaux.'
              }
            ]
          },
          {
            label: 'Accompagner',
            color: 'cy',
            acts: [
              {
                title: 'Projet de soutien psychologique face à la crise climatique',
                desc: "Construire une campagne de soutien psychologique intégrant les connaissances sur l'éco-anxiété, pour aider des personnes affectées par des événements climatiques."
              },
              {
                title: 'Jeu de rôle : convaincre face à la vulnérabilité cognitive',
                desc: "Les étudiants doivent convaincre un groupe cognitivement vulnérable d'adhérer à la transition écologique, par exemple face à la montée des eaux dans une ville côtière."
              }
            ]
          }
        ],
        feedback:
          'Bien vu. Cette activité ancre directement la psychologie dans des situations que vos étudiants vivent ou observent.'
      },
      {
        type: 'votretour',
        statement: 'À votre tour.',
        sub: "Vous venez de découvrir comment la psychologie s'inscrit dans la transition écologique. Faites le lien avec votre propre enseignement.",
        prompts: [
          {
            q: "Quel concept psychologique de votre cours devient le plus vivant quand on l'applique à un comportement avec des enjeux écologiques ?",
            placeholder:
              'Ex : la théorie du comportement planifié, les biais cognitifs, les représentations sociales...'
          },
          {
            q: 'Comment imaginez-vous faire cette connexion dans votre prochain cours ?',
            placeholder:
              'Ex : appliquer un cadre théorique à un comportement environnemental réel observé par les étudiants...'
          }
        ],
        resource: {
          label: 'Ressource UVED',
          title: 'Psychologie et Transition Écologique et au Développement Soutenable',
          href: 'https://www.uved.fr/fileadmin/user_upload/Documents/pdf/Fiches/Fiche_Psychologie_et_TEDS.pdf'
        }
      }
    ]
  }
};
