import { type DataByLang } from '@/types/microlearning';
export const DATA: DataByLang = {
  fr: {
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
    },
    geography: {
      steps: [
        {
          type: 'flip',
          statement: 'La géographie est au cœur de la transition écologique.',
          hint: 'Cliquez sur chaque carte pour découvrir le lien.',
          cards: [
            {
              verb: 'Localiser et cartographier',
              text: "Vous apprenez à vos étudiants à lire les dynamiques spatiales. C'est exactement ce dont on a besoin pour cartographier les vulnérabilités climatiques, les flux de pollution et les inégalités environnementales à différentes échelles.",
              color: 'ct'
            },
            {
              verb: 'Comprendre les territoires',
              text: 'La géographie analyse les interactions entre sociétés et environnements. Par exemple, comprendre comment une ville côtière se transforme face à la montée des eaux, ou comment un territoire rural gère la transition énergétique.',
              color: 'cp'
            },
            {
              verb: 'Décrypter les politiques',
              text: "Vous enseignez à vos étudiants à analyser les acteurs et les décisions publiques. C'est exactement ce qu'exige la transition : comprendre qui décide, à quelle échelle, et avec quels effets sur les territoires.",
              color: 'ck'
            },
            {
              verb: 'Penser les inégalités',
              text: 'La géographie explore les inégalités socio-spatiales. La crise écologique les amplifie : qui est le plus vulnérable, qui a accès aux ressources, qui subit les effets du changement climatique ?',
              color: 'cy'
            }
          ],
          closing:
            'Sans ancrage géographique et sans prise en compte des spécificités des espaces et des sociétés, la transition écologique serait inopérante. Votre discipline est indispensable.'
        },
        {
          type: 'competences',
          intro:
            'En étudiant la transition écologique à travers la géographie, vos étudiants développent des compétences analytiques et citoyennes essentielles.',
          featured: [
            {
              name: 'Lecture et production de cartes',
              tag: 'disciplinaire',
              tagClass: 'disciplinaire',
              concrete:
                "Les étudiants réalisent une carte des vulnérabilités climatiques d'un territoire, en identifiant les zones à risque et les populations exposées à des événements extrêmes."
            },
            {
              name: 'Esprit critique',
              tag: 'transversal',
              tagClass: 'transversal',
              concrete:
                "Les étudiants analysent des enjeux complexes comme les conflits d'usage autour de l'eau ou les tensions entre développement touristique et préservation des littoraux."
            },
            {
              name: 'Pensée multiscalaire',
              tag: 'disciplinaire',
              tagClass: 'disciplinaire',
              concrete:
                "Les étudiants relient les décisions locales (un projet d'écoquartier) aux dynamiques nationales et mondiales (politiques climatiques, flux migratoires liés au climat)."
            }
          ],
          also: [
            'Identifier des acteurs et logiques territoriales',
            'Analyser des dynamiques spatiales',
            "Travailler à différentes échelles de temps et d'espace",
            "Construire une argumentation autour d'un projet",
            'Maîtriser des outils numériques et cartographiques',
            'Comprendre les enjeux globaux et leurs déclinaisons locales'
          ]
        },
        {
          type: 'activities',
          intro: 'Des activités concrètes que vous pouvez intégrer dans une séance existante.',
          apports: [
            {
              label: 'Localiser et cartographier',
              color: 'ct',
              acts: [
                {
                  title: "Cartographier les vulnérabilités climatiques d'un territoire",
                  desc: "Les étudiants réalisent une carte des zones à risque (inondation, sécheresse, canicule) à l'échelle d'un territoire local ou régional, en croisant données climatiques et données sociales."
                },
                {
                  title: 'Comparer les empreintes écologiques de différents pays',
                  desc: 'Analyse comparative des empreintes écologiques nationales : qui consomme le plus, qui subit le plus ? Relier ces données aux inégalités de développement.'
                }
              ]
            },
            {
              label: 'Comprendre les territoires',
              color: 'cp',
              acts: [
                {
                  title: "Étudier un projet d'écoquartier ou de ville en transition",
                  desc: 'Les étudiants analysent un projet urbain durable réel (ex : quartier de la Confluence à Lyon, Bottière-Chénaie à Nantes) : acteurs, enjeux, compromis et limites.'
                },
                {
                  title: 'Analyser les impacts du tourisme de montagne face au recul des neiges',
                  desc: "Étude de cas sur un territoire de montagne (Alpes, Pyrénées) confronté au recul de l'enneigement. Quelles reconversions ? Quelles résistances ? Quels acteurs ?"
                }
              ]
            },
            {
              label: 'Décrypter les politiques',
              color: 'ck',
              acts: [
                {
                  title: 'Simuler une conférence des parties (COP) sur une ressource locale',
                  desc: "Les étudiants représentent différents acteurs (État, collectivités, ONG, entreprises, citoyens) négociant la gestion durable d'une ressource commune : eau, forêt, littoral."
                },
                {
                  title: "Analyser une politique d'aménagement durable",
                  desc: "Décrypter un plan local d'urbanisme (PLU) ou un schéma de cohérence territoriale (SCoT) à travers le prisme de la transition écologique : quels objectifs ? Quelles contradictions ?"
                }
              ]
            },
            {
              label: 'Penser les inégalités',
              color: 'cy',
              acts: [
                {
                  title: 'Étude de cas sur la justice environnementale',
                  desc: "Analyser un territoire où coexistent une zone industrielle polluante et des populations précaires. Qui décide de l'implantation ? Qui subit les effets ? Quels recours existent ?"
                },
                {
                  title: 'Géographie des migrations climatiques',
                  desc: 'À partir de données réelles, les étudiants cartographient les migrations liées aux catastrophes climatiques et analysent les inégalités de vulnérabilité entre pays du Nord et du Sud.'
                }
              ]
            }
          ],
          feedback:
            'Bien choisi. Cette activité ancre directement les outils géographiques dans des enjeux territoriaux concrets.'
        },
        {
          type: 'votretour',
          statement: 'À votre tour.',
          sub: "Vous venez de découvrir comment la géographie s'inscrit dans la transition écologique. Faites le lien avec votre propre enseignement.",
          prompts: [
            {
              q: 'Quel territoire ou quelle dynamique spatiale de votre cours a la connexion la plus évidente avec la TEDS ?',
              placeholder:
                'Ex : les dynamiques urbaines, les espaces ruraux, les littoraux, les inégalités régionales...'
            },
            {
              q: 'Comment imaginez-vous introduire une carte ou une étude de cas liée à la transition dans votre prochaine séance ?',
              placeholder:
                "Ex : ajouter une carte des vulnérabilités climatiques à une séance existante sur l'aménagement..."
            }
          ],
          resource: {
            label: 'Ressource UVED',
            title: 'Géographie et Transition Écologique et au Développement Soutenable',
            href: 'https://www.uved.fr/fileadmin/user_upload/Documents/pdf/Fiches/Fiche_Geographie_et_TEDS.pdf'
          }
        }
      ]
    },
    health: {
      steps: [
        {
          type: 'flip',
          statement: 'Les sciences de la santé sont un levier central de la transition écologique.',
          hint: 'Cliquez sur chaque carte pour découvrir le lien.',
          cards: [
            {
              verb: 'Identifier les risques',
              text: 'Vous apprenez à vos étudiants à évaluer les effets des expositions environnementales sur la santé. Par exemple, analyser la surmortalité liée aux canicules ou les maladies respiratoires liées à la pollution atmosphérique.',
              color: 'ct'
            },
            {
              verb: 'Analyser les politiques',
              text: "La santé permet d'évaluer les co-bénéfices des politiques climatiques : la baisse de la consommation de viande améliore à la fois la santé et réduit les émissions. Vos étudiants apprennent à raisonner en systèmes.",
              color: 'cp'
            },
            {
              verb: 'Renforcer la résilience',
              text: "Passer d'une logique de réparation à une logique de prévention : c'est l'un des grands enjeux de la santé environnementale, et un raisonnement que vos étudiants construisent dès leur formation.",
              color: 'ck'
            },
            {
              verb: "Réduire l'empreinte",
              text: 'Le secteur de la santé est lui-même un contributeur aux émissions. Vos étudiants peuvent concevoir des pratiques médicales plus sobres : recyclage des réactifs, éco-conception des soins, sobriété énergétique.',
              color: 'cy'
            }
          ],
          closing:
            "La santé est un langage commun entre disciplines et un point d'entrée concret pour parler d'interdépendance entre les humains et leur environnement."
        },
        {
          type: 'competences',
          intro:
            'En étudiant la transition écologique à travers les sciences de la santé, vos étudiants développent des compétences cliniques, systémiques et citoyennes.',
          featured: [
            {
              name: 'Approche One Health',
              tag: 'disciplinaire',
              tagClass: 'disciplinaire',
              concrete:
                "Les étudiants apprennent à penser la santé humaine comme liée à celle des écosystèmes et des autres vivants. Par exemple, analyser l'émergence de maladies vectorielles liées au réchauffement climatique."
            },
            {
              name: 'Mobiliser des savoirs interdisciplinaires',
              tag: 'transversal',
              tagClass: 'transversal',
              concrete:
                "Les étudiants croisent médecine, écologie, psychologie et sociologie pour analyser les déterminants environnementaux de la santé d'une population dans un territoire donné."
            },
            {
              name: 'Esprit critique',
              tag: 'transversal',
              tagClass: 'transversal',
              concrete:
                'Les étudiants distinguent les discours politiques et médiatiques des faits scientifiques établis en santé environnementale, et développent des compétences éthiques face aux enjeux de justice sanitaire.'
            }
          ],
          also: [
            'Décrire les interactions entre environnement et santé',
            'Analyser les déterminants écologiques et sociaux de la santé',
            'Comprendre les enjeux de justice environnementale et sanitaire',
            'Agir en acteur de la transition dans le champ de la santé',
            'Faire des recommandations pour la prévention des risques',
            "Contribuer à l'éducation et la sensibilisation des citoyens"
          ]
        },
        {
          type: 'activities',
          intro: 'Des activités concrètes que vous pouvez intégrer dans une séance existante.',
          apports: [
            {
              label: 'Identifier les risques',
              color: 'ct',
              acts: [
                {
                  title: "Étude de cas : impact d'une canicule sur la santé publique",
                  desc: "Les étudiants analysent les données d'un épisode de canicule réel (mortalité, hospitalisations, populations vulnérables) et identifient les réponses sanitaires et les leviers de prévention."
                },
                {
                  title: 'Analyser un épisode de pollution atmosphérique',
                  desc: "À partir de données réelles (Airparif, OMS), les étudiants évaluent les effets sanitaires d'un pic de pollution et les inégalités d'exposition selon les territoires et les populations."
                }
              ]
            },
            {
              label: 'Analyser les politiques',
              color: 'cp',
              acts: [
                {
                  title: "Évaluer les co-bénéfices d'une politique climatique",
                  desc: "Les étudiants analysent une politique de transition (mobilités douces, réduction de la consommation de viande, végétalisation urbaine) sous l'angle de ses bénéfices et risques sanitaires."
                },
                {
                  title: 'Étudier le Plan national santé environnement',
                  desc: 'Décrypter les stratégies nationales et internationales (PNSE, OMS, One Health) : quels objectifs, quels outils, quelle efficacité dans un contexte de transition écologique ?'
                }
              ]
            },
            {
              label: 'Renforcer la résilience',
              color: 'ck',
              acts: [
                {
                  title: 'Projet pluridisciplinaire : santé environnementale sur un campus',
                  desc: "Réaliser un diagnostic de santé environnementale sur le campus : qualité de l'air, accès aux espaces verts, alimentation, mobilité. Relier les données à des enjeux de justice environnementale."
                },
                {
                  title: "Jeu de rôle : débattre d'une problématique de santé publique",
                  desc: "Les étudiants incarnent différents acteurs (soignants, élus, ONG, chercheurs, citoyens) pour débattre d'une problématique de santé publique liée à l'environnement (pesticides, pollution, canicule)."
                }
              ]
            },
            {
              label: "Réduire l'empreinte",
              color: 'cy',
              acts: [
                {
                  title: 'Concevoir des pratiques médicales plus sobres',
                  desc: "Les étudiants imaginent des solutions pour réduire l'empreinte écologique d'un service de santé : recyclage, sobriété énergétique, achats responsables, éco-conception du matériel médical."
                },
                {
                  title: 'Communication scientifique sur santé et transition',
                  desc: 'En groupes, les étudiants créent une affiche, un podcast ou une vidéo pédagogique sur les liens entre un enjeu de santé et la transition écologique, destinée à un public non spécialiste.'
                }
              ]
            }
          ],
          feedback:
            'Très bien. Cette activité connecte directement les compétences cliniques à des enjeux environnementaux concrets.'
        },
        {
          type: 'votretour',
          statement: 'À votre tour.',
          sub: "Vous venez de découvrir comment les sciences de la santé s'inscrivent dans la transition écologique. Faites le lien avec votre propre enseignement.",
          prompts: [
            {
              q: 'Quel lien entre santé et environnement pourriez-vous introduire dans votre prochaine séance ?',
              placeholder:
                'Ex : les effets de la pollution sur les pathologies respiratoires, la santé mentale et le climat...'
            },
            {
              q: "Comment imaginez-vous faire de la transition écologique un contexte d'apprentissage dans votre cours ?",
              placeholder:
                'Ex : utiliser des données épidémiologiques liées au changement climatique dans un cas clinique...'
            }
          ],
          resource: {
            label: 'Ressource UVED',
            title: 'Santé et Transition Écologique et au Développement Soutenable',
            href: 'https://www.uved.fr/fileadmin/user_upload/Documents/pdf/Fiches/Fiche_Sante_et_TEDS.pdf'
          }
        }
      ]
    },
    staps: {
      steps: [
        {
          type: 'flip',
          statement:
            'Les STAPS sont au cœur des enjeux sanitaires, sociaux et environnementaux contemporains.',
          hint: 'Cliquez sur chaque carte pour découvrir le lien.',
          cards: [
            {
              verb: 'Comprendre les effets du climat',
              text: 'Les activités physiques et sportives dépendent fortement des conditions environnementales. Vos étudiants apprennent à comprendre les adaptations physiologiques aux fortes chaleurs, aux pollutions et aux événements climatiques extrêmes.',
              color: 'ct'
            },
            {
              verb: 'Accroître la résilience',
              text: 'Une meilleure condition physique peut améliorer la tolérance à certaines contraintes environnementales. Vos étudiants apprennent à concevoir des programmes adaptés aux contraintes climatiques actuelles.',
              color: 'cp'
            },
            {
              verb: "Atténuer l'empreinte",
              text: 'Le secteur sportif a une forte dépendance aux infrastructures, aux équipements et aux mobilités. Vos étudiants peuvent apprendre à concevoir des pratiques sportives plus sobres et responsables.',
              color: 'ck'
            },
            {
              verb: 'Éduquer à la santé globale',
              text: "Les STAPS diffusent des valeurs de respect, de coopération et d'engagement. Elles permettent de penser les liens entre santé humaine et santé environnementale dans une optique de durabilité.",
              color: 'cy'
            }
          ],
          closing:
            "Les STAPS forment des professionnels capables d'adapter les pratiques sportives aux contraintes écologiques, d'organiser des événements plus sobres et d'accompagner les transitions du secteur sportif."
        },
        {
          type: 'competences',
          intro:
            'En étudiant la transition écologique à travers les STAPS, vos étudiants développent des compétences disciplinaires et transversales essentielles.',
          featured: [
            {
              name: 'Pensée systémique',
              tag: 'transversal',
              tagClass: 'transversal',
              concrete:
                'Les étudiants décrivent les interactions entre santé, climat, infrastructures sportives et économie du sport. Par exemple, analyser comment la montée des températures affecte les pratiques et les performances.'
            },
            {
              name: 'Analyse critique',
              tag: 'disciplinaire',
              tagClass: 'disciplinaire',
              concrete:
                "Les étudiants analysent un objet sportif à l'ère des limites planétaires : renseigner et interpréter les indicateurs de performance environnementale d'une infrastructure ou d'un événement sportif."
            },
            {
              name: 'Capacité à concevoir',
              tag: 'disciplinaire',
              tagClass: 'disciplinaire',
              concrete:
                "Les étudiants conçoivent un programme d'EPS ou d'entraînement tenant compte des aléas climatiques (canicule, qualité de l'air, inondation) et éco-responsable en ressources."
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
        {
          type: 'activities',
          intro: 'Des activités concrètes que vous pouvez intégrer dans une séance existante.',
          apports: [
            {
              label: 'Comprendre les effets du climat',
              color: 'ct',
              acts: [
                {
                  title: 'Analyser les effets de la chaleur sur la performance sportive',
                  desc: "Les étudiants étudient des données physiologiques réelles sur les adaptations à la chaleur et conçoivent des protocoles d'entraînement tenant compte des contraintes climatiques actuelles."
                },
                {
                  title: 'Étude de cas : sport de montagne et recul des neiges',
                  desc: "Analyser l'impact du changement climatique sur un sport de montagne (ski, alpinisme) : quelles adaptations des pratiques, des infrastructures, des business models ?"
                }
              ]
            },
            {
              label: 'Accroître la résilience',
              color: 'cp',
              acts: [
                {
                  title: "Concevoir un programme d'EPS adapté aux contraintes climatiques",
                  desc: "Les étudiants conçoivent une séquence d'EPS tenant compte d'une contrainte environnementale réelle (canicule, qualité de l'air) : objectifs pédagogiques, adaptations, indicateurs de suivi."
                },
                {
                  title: 'Analyser les co-bénéfices santé/climat des mobilités actives',
                  desc: "Comparer mathematiquement les effets sur la santé et les émissions de CO₂ de différents modes de transport vers un équipement sportif. Un cas concret d'analyse systémique."
                }
              ]
            },
            {
              label: "Atténuer l'empreinte",
              color: 'ck',
              acts: [
                {
                  title: 'TD Soutenabilité des Jeux Olympiques',
                  desc: "À partir de rapports institutionnels et de données réelles, les étudiants évaluent l'empreinte écologique des JO et proposent des indicateurs et des leviers de réduction."
                },
                {
                  title: 'Concevoir un événement sportif sobre',
                  desc: 'Les étudiants planifient un événement sportif en intégrant des critères de durabilité : mobilités, alimentation, déchets, accessibilité. Ils définissent leurs propres indicateurs de soutenabilité.'
                }
              ]
            },
            {
              label: 'Éduquer à la santé globale',
              color: 'cy',
              acts: [
                {
                  title: 'Débat : performance sportive et limites planétaires',
                  desc: '"La logique de performance sportive est-elle compatible avec les limites planétaires ?" Les étudiants argumentent des positions à partir de données économiques, sanitaires et environnementales.'
                },
                {
                  title: 'Projet de sensibilisation dans un club sportif',
                  desc: 'Les étudiants conçoivent et mettent en œuvre une action de sensibilisation aux enjeux de durabilité dans un club ou une association sportive locale.'
                }
              ]
            }
          ],
          feedback:
            'Bien vu. Cette activité connecte directement les compétences STAPS à des défis environnementaux concrets.'
        },
        {
          type: 'votretour',
          statement: 'À votre tour.',
          sub: "Vous venez de découvrir comment les STAPS s'inscrivent dans la transition écologique. Faites le lien avec votre propre enseignement.",
          prompts: [
            {
              q: 'Quelle pratique sportive ou quelle séance de votre cours pourrait intégrer une dimension de durabilité ?',
              placeholder:
                "Ex : une séance d'EPS adaptée à la chaleur, l'analyse de l'empreinte d'un équipement sportif..."
            },
            {
              q: "Comment imaginez-vous faire de la transition écologique un contexte d'apprentissage dans votre cours ?",
              placeholder:
                'Ex : utiliser des données réelles sur un événement sportif pour travailler les compétences disciplinaires...'
            }
          ],
          resource: {
            label: 'Ressource UVED',
            title: 'STAPS et Transition Écologique et au Développement Soutenable',
            href: 'https://www.uved.fr/fileadmin/user_upload/Documents/pdf/Fiches/Fiche_Staps_et_TEDS.pdf'
          }
        }
      ]
    },
    letters: {
      steps: [
        {
          type: 'flip',
          statement: 'Les lettres jouent un rôle essentiel dans la transition écologique.',
          hint: 'Cliquez sur chaque carte pour découvrir le lien.',
          cards: [
            {
              verb: 'Analyser les imaginaires',
              text: "Vous apprenez à vos étudiants à lire les œuvres et les discours. C'est exactement ce dont on a besoin pour comprendre les imaginaires qui ont conduit à la surexploitation du monde, ou pour inventer d'autres façons d'habiter la Terre.",
              color: 'ct'
            },
            {
              verb: 'Donner du sens',
              text: "La crise écologique manque de mots. Les lettres permettent d'identifier les différentes manières de nommer, de penser et de symboliser les bouleversements écologiques, y compris pour décrypter le greenwashing.",
              color: 'cp'
            },
            {
              verb: 'Imaginer des futurs',
              text: "Par la fiction, la poésie, le théâtre, la science-fiction écologique, les lettres permettent de penser la transformation sociale et d'élaborer de nouveaux récits collectifs sur le vivre-ensemble avec le vivant.",
              color: 'ck'
            },
            {
              verb: 'Former des citoyens critiques',
              text: "Vos étudiants apprennent à analyser les discours publicitaires, médiatiques et politiques sur l'écologie. Ils développent une pensée personnelle étayée sur ces questions.",
              color: 'cy'
            }
          ],
          closing:
            "Les lettres forment des citoyens capables de penser, de dire et de raconter autrement le monde. C'est une condition essentielle pour transformer nos modes de vie."
        },
        {
          type: 'competences',
          intro:
            'En étudiant la transition écologique à travers les lettres, vos étudiants développent des compétences littéraires, critiques et citoyennes essentielles.',
          featured: [
            {
              name: 'Lecture critique et contextualisée',
              tag: 'disciplinaire',
              tagClass: 'disciplinaire',
              concrete:
                "Les étudiants analysent les origines historiques et sociales d'une œuvre liée à la nature, et clarifient les valeurs et idéologies rattachées aux récits sur l'environnement."
            },
            {
              name: 'Pensée critique',
              tag: 'transversal',
              tagClass: 'transversal',
              concrete:
                "Les étudiants analysent les discours publicitaires et politiques sur l'écologie, distinguent ce qui relève de la rhétorique du greenwashing de ce qui est scientifiquement fondé."
            },
            {
              name: 'Expression et créativité',
              tag: 'transversal',
              tagClass: 'transversal',
              concrete:
                "Les étudiants utilisent la littérature et la langue pour exprimer émotions, valeurs et visions de l'avenir face aux enjeux climatiques, en transformant des savoirs complexes en récits accessibles."
            }
          ],
          also: [
            'Analyser une œuvre littéraire ou un discours',
            'Faire une dissertation ou un commentaire avec en toile de fond les enjeux de durabilité',
            'Produire une analyse comparative de textes',
            "Expérimenter des formes d'écriture créative sur les thèmes du vivant",
            "Produire de nouveaux récits susceptibles d'impulser des transformations sociales",
            'Identifier des pistes de collaboration interdisciplinaire'
          ]
        },
        {
          type: 'activities',
          intro: 'Des activités concrètes que vous pouvez intégrer dans une séance existante.',
          apports: [
            {
              label: 'Analyser les imaginaires',
              color: 'ct',
              acts: [
                {
                  title: 'Analyser un corpus littéraire autour de la nature',
                  desc: "Les étudiants étudient des extraits d'œuvres (de la littérature naturaliste au roman d'anticipation climatique) pour analyser l'évolution des imaginaires du progrès, du vivant et de la planète."
                },
                {
                  title: "Décrypter les discours sur l'écologie",
                  desc: "À partir d'exemples publicitaires, politiques ou médiatiques, les étudiants identifient les stratégies discursives liées à la transition, y compris celles qui relèvent du greenwashing."
                }
              ]
            },
            {
              label: 'Donner du sens',
              color: 'cp',
              acts: [
                {
                  title: "Atelier de réécriture d'un texte à la lumière des enjeux climatiques",
                  desc: "Les étudiants réécrivent un extrait littéraire classique en intégrant une dimension écologique contemporaine. Exercice de style qui interroge les présupposés culturels de l'œuvre originale."
                },
                {
                  title: "Analyser l'éco-poétique dans la littérature contemporaine",
                  desc: "Étude d'auteurs de l'éco-littérature (Thoreau, Le Clézio, Tesson, Giono) : comment la langue et le style traduisent-ils un rapport à la nature ? Quels nouveaux genres littéraires émergent ?"
                }
              ]
            },
            {
              label: 'Imaginer des futurs',
              color: 'ck',
              acts: [
                {
                  title: "Atelier d'écriture : imaginer une société sobre ou dévastée",
                  desc: 'Les étudiants rédigent une nouvelle courte se déroulant dans une société qui a réussi sa transition écologique, ou au contraire qui a échoué. Exercice de prospective par la fiction.'
                },
                {
                  title: 'Projet interdisciplinaire lettres et sciences',
                  desc: 'En collaboration avec des enseignants de sciences, les étudiants créent un texte littéraire (essai, récit, poème) qui met en dialogue savoirs scientifiques et imaginaires sur la crise climatique.'
                }
              ]
            },
            {
              label: 'Former des citoyens critiques',
              color: 'cy',
              acts: [
                {
                  title: "Lire et analyser un discours politique sur l'écologie",
                  desc: 'Les étudiants décortiquent un discours politique récent sur la transition écologique : quelles figures de style, quels implicites, quels effets de cadrage ? Analyse rhétorique et citoyenne.'
                },
                {
                  title: 'Atelier de lecture en plein air',
                  desc: "Lecture et discussion d'un texte littéraire en lien avec un espace naturel local. Relier la lecture à l'expérience sensible du milieu. Peut être couplé avec un partenariat culturel ou associatif."
                }
              ]
            }
          ],
          feedback:
            'Bien choisi. Cette activité ancre les outils littéraires dans des questions que vos étudiants vivent et lisent réellement.'
        },
        {
          type: 'votretour',
          statement: 'À votre tour.',
          sub: "Vous venez de découvrir comment les lettres s'inscrivent dans la transition écologique. Faites le lien avec votre propre enseignement.",
          prompts: [
            {
              q: 'Quelle œuvre ou quel auteur de votre cours a la connexion la plus directe avec les enjeux écologiques ?',
              placeholder:
                "Ex : Zola et l'industrie, Le Clézio et le rapport à la nature, la dystopie climatique..."
            },
            {
              q: 'Comment imaginez-vous introduire une dimension écologique dans votre prochain cours de littérature ?',
              placeholder:
                'Ex : ajouter une question sur les imaginaires de la nature dans une œuvre déjà au programme...'
            }
          ],
          resource: {
            label: 'Ressource UVED',
            title: 'Lettres et Transition Écologique et au Développement Soutenable',
            href: 'https://www.uved.fr/fileadmin/user_upload/Documents/pdf/Fiches/Fiche_Lettres_et_TEDS.pdf'
          }
        }
      ]
    },
    ecology: {
      steps: [
        {
          type: 'flip',
          statement:
            "L'écologie scientifique fournit les connaissances fondamentales de la transition.",
          hint: 'Cliquez sur chaque carte pour découvrir le lien.',
          cards: [
            {
              verb: 'Décrire et comprendre',
              text: "L'écologie analyse les interactions entre les êtres vivants et leur milieu. Vous apprenez à vos étudiants à comprendre la structure et le fonctionnement des écosystèmes, qu'ils soient peu ou fortement anthropisés.",
              color: 'ct'
            },
            {
              verb: 'Évaluer et prédire',
              text: "Vos étudiants apprennent à évaluer la résilience ou la vulnérabilité des milieux face aux pressions humaines, à identifier les points de bascule et à modéliser l'évolution des écosystèmes.",
              color: 'cp'
            },
            {
              verb: 'Proposer des solutions',
              text: "L'écologie propose des leviers pour la transformation : agroécologie, écologie urbaine, solutions fondées sur la nature, bio-inspiration. Vos étudiants apprennent à concevoir des plans d'action concrets.",
              color: 'ck'
            },
            {
              verb: 'Éclairer les décisions',
              text: 'Les connaissances écologiques sont indispensables pour éclairer les politiques publiques. Vos étudiants apprennent à communiquer des données scientifiques complexes à des décideurs et des non-spécialistes.',
              color: 'cy'
            }
          ],
          closing:
            "L'écologie fournit les connaissances essentielles pour comprendre les crises environnementales actuelles. Par son exploration du vivant, elle est source de progrès et d'innovations pour la transition."
        },
        {
          type: 'competences',
          intro:
            "En étudiant la transition écologique à travers l'écologie scientifique, vos étudiants développent des compétences analytiques et d'action essentielles.",
          featured: [
            {
              name: 'Analyse systémique',
              tag: 'disciplinaire',
              tagClass: 'disciplinaire',
              concrete:
                "Les étudiants décrivent un écosystème sous l'angle de ses réseaux d'interaction, identifient les réactions en cascade lors d'une perturbation, et expliquent les notions de résilience et d'irréversibilité."
            },
            {
              name: 'Analyse critique',
              tag: 'disciplinaire',
              tagClass: 'disciplinaire',
              concrete:
                'Les étudiants identifient les facteurs naturels et anthropiques responsables de la dynamique des écosystèmes, et connaissent les intérêts et limites des outils de collecte et de modélisation.'
            },
            {
              name: 'Capacité à agir',
              tag: 'transversal',
              tagClass: 'transversal',
              concrete:
                "Les étudiants proposent des programmes d'action pour la conservation ou la restauration de la biodiversité, et s'appuient sur la nature pour concevoir des solutions d'atténuation ou d'adaptation."
            }
          ],
          also: [
            'Expliquer les forces déterminant la diversité génétique et spécifique',
            "Comprendre l'écologie des populations et des communautés",
            'Comprendre les services écosystémiques et solutions fondées sur la nature',
            "Anticiper les conséquences d'une perte de diversité du vivant",
            "Relier l'écologie à d'autres disciplines pour décrire les socio-écosystèmes",
            "Identifier les sources d'information les plus fiables en écologie"
          ]
        },
        {
          type: 'activities',
          intro: 'Des activités concrètes que vous pouvez intégrer dans une séance existante.',
          apports: [
            {
              label: 'Décrire et comprendre',
              color: 'ct',
              acts: [
                {
                  title: 'Diagnostic écologique via une étude de terrain',
                  desc: "Les étudiants réalisent un diagnostic écologique sur un terrain local (rivière, forêt, sol, prairie) en appliquant les méthodes d'observation et de mesure vues en cours."
                },
                {
                  title: 'Construire un atlas de la biodiversité',
                  desc: "À l'échelle de l'établissement ou du quartier, les étudiants inventorient la biodiversité locale, cartographient les espèces observées et analysent les facteurs qui influencent leur présence."
                }
              ]
            },
            {
              label: 'Évaluer et prédire',
              color: 'cp',
              acts: [
                {
                  title: "Modéliser les effets d'une perturbation sur un écosystème",
                  desc: "À partir d'un scénario réel (construction d'une route, pollution d'une rivière, introduction d'une espèce invasive), les étudiants modélisent les effets en cascade sur l'écosystème."
                },
                {
                  title: 'Comparer des pratiques agricoles selon leurs bénéfices écosystémiques',
                  desc: 'Les étudiants comparent agriculture conventionnelle et agroécologie selon des critères de biodiversité, de qualité des sols et de services écosystémiques. Analyse multicritère.'
                }
              ]
            },
            {
              label: 'Proposer des solutions',
              color: 'ck',
              acts: [
                {
                  title:
                    "Définir les lignes directrices d'un programme d'action pour un territoire",
                  desc: "Pour un territoire donné subissant de fortes pressions (urbanisation, pollution, sécheresse), les étudiants définissent un programme d'action et décrivent les compromis nécessaires."
                },
                {
                  title: 'Concevoir une solution fondée sur la nature',
                  desc: 'Les étudiants identifient un problème environnemental local (îlot de chaleur urbain, ruissellement, perte de pollinisateurs) et conçoivent une solution inspirée du fonctionnement des écosystèmes.'
                }
              ]
            },
            {
              label: 'Éclairer les décisions',
              color: 'cy',
              acts: [
                {
                  title: "Débat d'experts sur une controverse écologique",
                  desc: "Jeu de rôle : les étudiants débattent de la gestion d'un territoire controversé (réintroduction du loup, artificialisation des terres, gestion des zones humides) en s'appuyant sur des données scientifiques."
                },
                {
                  title:
                    'Analyser la prise en compte de la biodiversité dans un scénario sectoriel',
                  desc: 'Les étudiants analysent comment la biodiversité est intégrée (ou non) dans un scénario agricole, énergétique ou urbanistique réel, et proposent des améliorations.'
                }
              ]
            }
          ],
          feedback:
            'Excellent choix. Cette activité connecte directement les concepts écologiques à des situations réelles de terrain.'
        },
        {
          type: 'votretour',
          statement: 'À votre tour.',
          sub: "Vous venez de redécouvrir comment l'écologie scientifique est au cœur de la transition écologique. Faites le lien avec votre propre enseignement.",
          prompts: [
            {
              q: "Quel concept écologique de votre cours a l'application la plus directe à un enjeu de transition ?",
              placeholder:
                'Ex : la résilience des écosystèmes, les services écosystémiques, la dynamique des populations...'
            },
            {
              q: 'Comment imaginez-vous introduire un terrain ou un cas concret lié à la transition dans votre prochain cours ?',
              placeholder:
                "Ex : utiliser un écosystème local perturbé comme cas d'étude pour une séance de modélisation..."
            }
          ],
          resource: {
            label: 'Ressource UVED',
            title: 'Écologie et Transition Écologique et au Développement Soutenable',
            href: 'https://www.uved.fr/fileadmin/user_upload/Documents/pdf/Fiches/Fiche_Ecologie_et_TEDS.pdf'
          }
        }
      ]
    },
    art: {
      steps: [
        {
          type: 'flip',
          statement: "L'art joue un rôle clé et singulier dans la transition écologique.",
          hint: 'Cliquez sur chaque carte pour découvrir le lien.',
          cards: [
            {
              verb: 'Changer les regards',
              text: "L'art suscite des émotions et fait mieux ressentir la beauté et la fragilité de la nature, ou la violence des transformations de notre environnement. Vos étudiants apprennent à développer une conscience écologique par l'expérience esthétique.",
              color: 'ct'
            },
            {
              verb: 'Créer de nouveaux récits',
              text: "L'art invente des histoires, des images et des symboles qui donnent envie d'agir et ouvrent le champ des possibles. Vos étudiants apprennent à produire des œuvres qui transforment les imaginaires collectifs.",
              color: 'cp'
            },
            {
              verb: 'Expérimenter autrement',
              text: "L'art explore d'autres façons d'habiter un lieu, de réutiliser des matériaux, de travailler avec le vivant. Vos étudiants peuvent interroger leur rapport aux objets, aux déchets et à la technique.",
              color: 'ck'
            },
            {
              verb: 'Favoriser la participation',
              text: "L'art réunit et fait réagir les citoyens via des projets collectifs (fresques, performances, installations). Vos étudiants apprennent à créer des outils de mobilisation et de dialogue autour de la transition.",
              color: 'cy'
            }
          ],
          closing:
            "Susciter des ressentis, transformer les imaginaires, questionner nos modes de vie, rassembler autour de récits et d'expériences : les contributions de l'art à la TEDS sont multiples et irremplaçables."
        },
        {
          type: 'competences',
          intro:
            'En étudiant la transition écologique à travers les arts, vos étudiants développent des compétences créatives, critiques et citoyennes essentielles.',
          featured: [
            {
              name: 'Analyse critique des œuvres',
              tag: 'disciplinaire',
              tagClass: 'disciplinaire',
              concrete:
                "Les étudiants comprennent comment les artistes traitent des enjeux écologiques dans différents contextes culturels, et décryptent l'évolution des sensibilités artistiques face à la nature et à l'artificialisation."
            },
            {
              name: 'Créativité et innovation',
              tag: 'disciplinaire',
              tagClass: 'disciplinaire',
              concrete:
                'Les étudiants explorent de nouveaux matériaux (recyclés, naturels, durables) et expérimentent des formes artistiques sobres ou collaboratives en lien avec les enjeux de la transition.'
            },
            {
              name: 'Pensée critique et éthique',
              tag: 'transversal',
              tagClass: 'transversal',
              concrete:
                "Les étudiants analysent les contradictions entre art, société de consommation et transition écologique, et questionnent l'impact écologique de leurs propres pratiques artistiques (transport, exposition, diffusion)."
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
        {
          type: 'activities',
          intro: 'Des activités concrètes que vous pouvez intégrer dans une séance existante.',
          apports: [
            {
              label: 'Changer les regards',
              color: 'ct',
              acts: [
                {
                  title: "Analyser des œuvres d'art écologique (Eco-Art, Land Art)",
                  desc: "Les étudiants analysent des œuvres d'artistes engagés dans les questions écologiques (Andy Goldsworthy, Agnes Denes, Olafur Eliasson) : comment l'œuvre interpelle-t-elle notre rapport à la nature ?"
                },
                {
                  title: "Pratiques d'écoute et de field recording",
                  desc: "Les étudiants enregistrent des sons dans différents lieux plus ou moins anthropisés et créent une pièce sonore. Exercice d'attention sensorielle au milieu et aux transformations de l'environnement."
                }
              ]
            },
            {
              label: 'Créer de nouveaux récits',
              color: 'cp',
              acts: [
                {
                  title: 'Réaliser des planches de BD sur la transition',
                  desc: 'En groupes pluridisciplinaires, les étudiants créent des planches de bande dessinée qui servent de supports pédagogiques sur un enjeu de la TEDS. Croisement entre narration visuelle et savoirs scientifiques.'
                },
                {
                  title: 'Slam et transmission scientifique',
                  desc: 'Faire intervenir ou faire créer un slam sur un enjeu de la transition écologique. Les étudiants travaillent le passage de la connaissance scientifique à une restitution artistique collective.'
                }
              ]
            },
            {
              label: 'Expérimenter autrement',
              color: 'ck',
              acts: [
                {
                  title: 'Atelier de création avec matériaux recyclés',
                  desc: "Les étudiants créent une œuvre plastique en utilisant uniquement des matériaux récupérés ou naturels. L'atelier interroge la relation à la matière, au déchet et à la ressource dans la pratique artistique."
                },
                {
                  title: 'Pratiques écosomatiques et attention aux milieux',
                  desc: 'Exercices corporels (danse, théâtre) qui invitent à sentir les vivants en soi et à développer une attention écologique au milieu. Approche intersectionnelle entre arts chorégraphiques et écologie.'
                }
              ]
            },
            {
              label: 'Favoriser la participation',
              color: 'cy',
              acts: [
                {
                  title: 'Théâtre-forum sur un enjeu de transition',
                  desc: "Organisation d'un théâtre-forum à partir d'un scénario lié à la transition écologique. Les étudiants jouent puis les spectateurs interviennent. Méthode d'Augusto Boal, puissant outil de conscientisation."
                },
                {
                  title: 'Festival ou semaine écologique artistique',
                  desc: "Organiser une semaine avec programmation collective : spectacles, projections, ateliers, expositions, conférences. Restitution artistique par groupes d'étudiants avec carte blanche sur le format."
                }
              ]
            }
          ],
          feedback:
            'Excellent. Cette activité croise création artistique et conscience écologique de manière directement applicable.'
        },
        {
          type: 'votretour',
          statement: 'À votre tour.',
          sub: "Vous venez de découvrir comment les arts s'inscrivent dans la transition écologique. Faites le lien avec votre propre enseignement.",
          prompts: [
            {
              q: 'Quelle forme artistique de votre cours pourrait intégrer un enjeu écologique comme matière ou comme sujet ?',
              placeholder:
                "Ex : un atelier de création sur le thème du vivant, une analyse d'œuvres d'art écologique..."
            },
            {
              q: "Comment imaginez-vous faire de la transition un contexte d'expérimentation artistique dans votre cours ?",
              placeholder:
                'Ex : proposer une contrainte de matériaux durables dans un prochain atelier de création...'
            }
          ],
          resource: {
            label: 'Ressource UVED',
            title: 'Art et Transition Écologique et au Développement Soutenable',
            href: 'https://www.uved.fr/fileadmin/user_upload/Documents/pdf/Fiches/Fiche_Art_et_TEDS.pdf'
          }
        }
      ]
    },
    polsci: {
      steps: [
        {
          type: 'flip',
          statement:
            'La science politique est indispensable pour comprendre et piloter la transition écologique.',
          hint: 'Cliquez sur chaque carte pour découvrir le lien.',
          cards: [
            {
              verb: 'Comprendre la gouvernance',
              text: 'Qui décide, à quel niveau et comment ? Vous apprenez à vos étudiants à identifier les échelons de gouvernance multi-niveaux (local, national, international) et les acteurs impliqués dans les décisions de transition.',
              color: 'ct'
            },
            {
              verb: 'Analyser les rapports de pouvoir',
              text: "La transition révèle des conflits d'intérêts entre acteurs économiques, politiques et sociaux. Vos étudiants apprennent à décrypter les arbitrages autour des ressources naturelles et de la justice environnementale.",
              color: 'cp'
            },
            {
              verb: 'Évaluer les politiques publiques',
              text: "Concevoir, évaluer et comparer des politiques de transition : instruments utilisés (taxes, réglementations, subventions), ce qui fonctionne ou échoue selon les contextes. C'est au cœur de votre discipline.",
              color: 'ck'
            },
            {
              verb: 'Analyser la démocratie écologique',
              text: 'Distinguer et analyser les formes de démocratie mobilisées pour la transition : participative, délibérative. Comprendre le rôle des mobilisations citoyennes et des nouvelles pratiques de gouvernance partagée.',
              color: 'cy'
            }
          ],
          closing:
            "La transition écologique est avant tout un enjeu politique, car elle touche à la manière dont les sociétés s'organisent, décident, arbitrent et se transforment. Votre discipline est au cœur de ces questions."
        },
        {
          type: 'competences',
          intro:
            'En étudiant la transition écologique à travers la science politique, vos étudiants développent des compétences analytiques et citoyennes essentielles.',
          featured: [
            {
              name: 'Analyse des politiques publiques',
              tag: 'disciplinaire',
              tagClass: 'disciplinaire',
              concrete:
                'Les étudiants conçoivent et évaluent des politiques de transition, comparent des instruments (taxes carbone, marchés de droits à polluer, réglementations) et identifient ce qui fonctionne selon les contextes.'
            },
            {
              name: 'Analyse critique des récits politiques',
              tag: 'disciplinaire',
              tagClass: 'disciplinaire',
              concrete:
                'Les étudiants identifient les récits, croyances et idéologies mobilisés dans les prises de décision politiques sur la transition (croissance verte vs décroissance) et analysent les visions qui orientent les choix collectifs.'
            },
            {
              name: 'Citoyenneté et engagement',
              tag: 'transversal',
              tagClass: 'transversal',
              concrete:
                'Les étudiants comprennent le rôle des mobilisations citoyennes et des nouvelles formes de gouvernance partagée, et développent leur capacité à participer aux débats démocratiques sur les enjeux écologiques.'
            }
          ],
          also: [
            'Identifier les acteurs de la gouvernance multi-niveaux',
            'Analyser les rapports de force entre acteurs politiques, économiques et sociaux',
            'Comprendre les mécanismes de négociation internationale (COP, ODD)',
            'Relier justice environnementale, justice sociale et développement',
            'Étudier les transitions dans un cadre global Nord/Sud',
            'Analyser les instruments des politiques de transition'
          ]
        },
        {
          type: 'activities',
          intro: 'Des activités concrètes que vous pouvez intégrer dans une séance existante.',
          apports: [
            {
              label: 'Comprendre la gouvernance',
              color: 'ct',
              acts: [
                {
                  title: 'Simuler une négociation climatique internationale (COP)',
                  desc: 'Les étudiants représentent différents États dans une négociation climatique. Ils appliquent les mécanismes de coopération et de conflit, et négocient des engagements selon leurs intérêts nationaux.'
                },
                {
                  title: "Analyser la gouvernance multi-niveaux d'une politique climatique",
                  desc: 'Décrypter comment une politique climatique (ex : loi Climat et Résilience) articule les niveaux européen, national et local. Identifier les acteurs, les tensions et les marges de manœuvre.'
                }
              ]
            },
            {
              label: 'Analyser les rapports de pouvoir',
              color: 'cp',
              acts: [
                {
                  title: "Étude de cas : conflits autour d'une ressource naturelle",
                  desc: "Analyser un conflit d'usage réel autour d'une ressource (eau, énergie, terres agricoles, littoral) : qui sont les acteurs, quels sont leurs intérêts, quels mécanismes de régulation existent ?"
                },
                {
                  title: 'Débat : justice climatique Nord/Sud',
                  desc: '"Les pays développés ont-ils une responsabilité particulière dans la transition écologique mondiale ?" Débat structuré à partir de données sur les responsabilités historiques et les vulnérabilités actuelles.'
                }
              ]
            },
            {
              label: 'Évaluer les politiques publiques',
              color: 'ck',
              acts: [
                {
                  title: "Évaluer l'efficacité d'une taxe carbone",
                  desc: "À partir de cas réels (taxe carbone suédoise, marché carbone européen), les étudiants analysent les conditions de réussite et d'échec d'un instrument économique de transition."
                },
                {
                  title: 'Comparer deux politiques de transition dans deux pays',
                  desc: "Analyse comparative d'une même politique de transition (rénovation thermique, mobilités, énergie) dans deux pays différents : contextes, instruments, résultats, leçons à en tirer."
                }
              ]
            },
            {
              label: 'Analyser la démocratie écologique',
              color: 'cy',
              acts: [
                {
                  title: 'Analyser la Convention citoyenne pour le Climat',
                  desc: 'Les étudiants étudient le processus et les résultats de la CCC française : comment une démocratie délibérative fonctionne-t-elle ? Quelles recommandations ont été retenues et pourquoi ?'
                },
                {
                  title: 'Débat : démocratie et urgence climatique sont-elles compatibles ?',
                  desc: '"Les délais démocratiques sont-ils compatibles avec l\'urgence de la transition climatique ?" Débat philosophico-politique autour de la tension entre légitimité et efficacité.'
                }
              ]
            }
          ],
          feedback:
            'Bien choisi. Cette activité ancre directement les outils de la science politique dans les enjeux de transition contemporains.'
        },
        {
          type: 'votretour',
          statement: 'À votre tour.',
          sub: "Vous venez de découvrir comment la science politique s'inscrit dans la transition écologique. Faites le lien avec votre propre enseignement.",
          prompts: [
            {
              q: 'Quel concept ou quel cas de votre cours a le lien le plus direct avec un enjeu de gouvernance écologique ?',
              placeholder:
                'Ex : les politiques publiques, la démocratie participative, les relations internationales...'
            },
            {
              q: 'Comment imaginez-vous introduire un cas de politique environnementale réelle dans votre prochain cours ?',
              placeholder:
                'Ex : analyser une décision de politique climatique récente, simuler une négociation internationale...'
            }
          ],
          resource: {
            label: 'Ressource UVED',
            title: 'Science politique et Transition Écologique et au Développement Soutenable',
            href: 'https://www.uved.fr/fileadmin/user_upload/Documents/pdf/Fiches/Fiche_Science_politique_et_TEDS.pdf'
          }
        }
      ]
    }
  },
  en: {
    math: {
      steps: [
        // STEP 1: FLIP CARDS (CONTRIBUTIONS)
        {
          type: 'flip',
          statement: 'You are already teaching the tools of ecological transition.',
          hint: 'Click on each card to discover the connection.',
          cards: [
            {
              verb: 'Measuring and representing',
              text: 'You teach your students how to read, analyze, and visualize data. This is exactly how issues such as climate change and biodiversity loss are monitored. For example, by analyzing the evolution of CO₂ emissions in France over several decades.',
              color: 'ct'
            },
            {
              verb: 'Modeling',
              text: 'Simulating climate evolution or predicting ecosystem dynamics relies on mathematical models. You teach your students how to develop this type of reasoning. For example, modeling how a city evolves in response to rising temperatures and flood risks.',
              color: 'cp'
            },
            {
              verb: 'Optimizing',
              text: 'Optimizing resources and energy use is at the heart of ecological transition. You teach the tools needed to solve these problems. For example, calculating how to distribute electricity across a smart grid to minimize losses.',
              color: 'ck'
            },
            {
              verb: 'Supporting decision-making',
              text: 'The transition requires indicators to guide political and economic decisions. You teach your students how to build and interpret these tools. For example, calculating the carbon footprint of a product throughout its entire life cycle.',
              color: 'cy'
            }
          ],
          closing:
            'These contributions are already integrated into your discipline. You do not need to add new content: the goal is to make the connection visible for your students.'
        },

        // STEP 2: SKILLS
        {
          type: 'competences',
          intro:
            'By studying ecological transition through mathematics, your students develop skills that go beyond calculation. Here are the most significant ones.',
          featured: [
            {
              name: 'Critical thinking',
              tag: 'transversal',
              tagClass: 'transversal',
              concrete:
                'Your students learn to question the choice of parameters in a climate model: why these data and not others? What are the limitations and uncertainties of the model?'
            },
            {
              name: 'Interdisciplinarity',
              tag: 'transversal',
              tagClass: 'transversal',
              concrete:
                'By combining mathematics and climatology, your students understand why IPCC uncertainty ranges are expressed as probabilities and how different disciplines collaborate to produce knowledge.'
            },
            {
              name: 'Responsibility and ethics',
              tag: 'transversal',
              tagClass: 'transversal',
              concrete:
                'Your students question what a model can and cannot tell us: the boundary between what is effective, probable, and desirable in the context of climate policies.'
            }
          ],
          also: [
            'Mathematical modeling of socio-ecosystems',
            'Statistical and probabilistic analysis',
            'Differential equations',
            'Translating real-world problems into equations',
            'Analyzing data reliability',
            'Scenario-based reasoning',
            'Communicating complex results'
          ]
        },

        // STEP 3: ACTIVITIES
        {
          type: 'activities',
          intro:
            'Here are concrete activities that you can integrate into an existing lesson. Choose the one that best matches what you already teach.',
          apports: [
            {
              label: 'Measuring and representing',
              color: 'ct',
              acts: [
                {
                  title: 'Analyzing local temperatures',
                  desc: 'Students work with real historical temperature data to identify trends and key variables using statistical tools they already know.'
                },
                {
                  title: 'Critiquing a climate data visualization',
                  desc: 'Give students two graphs representing the same climate data in different ways. They analyze what each representation highlights and what it hides.'
                }
              ]
            },
            {
              label: 'Modeling',
              color: 'cp',
              acts: [
                {
                  title: 'Modeling the evolution of an urban ecosystem',
                  desc: 'Students build a simple model of how a city evolves in response to rising sea levels, using differential equations or functions they have already studied in class.'
                },
                {
                  title: 'Simulating the spread of an invasive species',
                  desc: 'Using real data about an invasive species, students use exponential or logistic functions to model and predict population growth.'
                }
              ]
            },
            {
              label: 'Optimizing',
              color: 'ck',
              acts: [
                {
                  title: 'Optimizing renewable energy distribution',
                  desc: 'Students solve an optimization problem: how to distribute electricity produced by solar panels in a neighborhood while minimizing losses and costs.'
                },
                {
                  title: 'Calculating the efficiency of a sustainable transport system',
                  desc: 'Students mathematically compare two transport systems (private car vs public transport) based on energy, time, and emissions criteria. A multi-criteria optimization problem.'
                }
              ]
            },
            {
              label: 'Supporting decision-making',
              color: 'cy',
              acts: [
                {
                  title: 'Calculating the carbon footprint of two lifestyles',
                  desc: 'Students compare the carbon footprint of two student profiles with different lifestyles: transportation, food, and energy use. Concrete figures using familiar mathematics.'
                },
                {
                  title: 'Building a sustainability indicator',
                  desc: 'Students design a simple index to assess the sustainability of a territory, choosing their variables and justifying their weighting choices. This introduces the complexity behind every indicator.'
                }
              ]
            }
          ],
          feedback:
            'Good idea. This activity can be directly integrated into an existing lesson without changing your curriculum.'
        },

        // STEP 4: YOUR TURN
        {
          type: 'votretour',
          statement: 'Your turn.',
          sub: 'You have just discovered how mathematics can contribute to ecological transition. Take a moment to connect this with your own teaching.',
          prompts: [
            {
              q: 'Which concept do you teach that could be connected to ESDT?',
              placeholder: 'E.g.: exponential functions, probabilities, data analysis...'
            },
            {
              q: 'How could you imagine making this connection in your next lesson?',
              placeholder: 'E.g.: replacing a generic example with real climate data...'
            }
          ],
          resource: {
            label: 'UVED Resource',
            title: 'Mathematics and Ecological Transition and Sustainable Development',
            href: 'https://www.uved.fr/fileadmin/user_upload/Documents/pdf/Fiches/Fiche_Mathematiques_et_TEDS.pdf'
          }
        }
      ]
    },
    history: {
      steps: [
        {
          type: 'flip',
          statement: 'History already sheds light on the challenges of ecological transition.',
          hint: 'Click on each card to discover the connection.',
          cards: [
            {
              verb: 'Understanding',
              text: 'History analyzes the relationships between societies and the environment over the long term.',
              color: 'ct'
            },
            {
              verb: 'Analyzing',
              text: 'It deciphers the mechanisms that enable societies to respond to environmental challenges.',
              color: 'cp'
            },
            {
              verb: 'Shedding light',
              text: 'It draws lessons from past experiences to guide current policies.',
              color: 'ck'
            },
            {
              verb: 'Contextualizing',
              text: 'It explains the historical roots of contemporary ecological issues.',
              color: 'cy'
            }
          ],
          closing:
            'Your discipline provides a systemic, critical, and contextualized perspective on ecological transition.'
        },
        {
          type: 'competences',
          intro:
            'By studying ecological transition through history, your students develop essential skills.',
          featured: [
            {
              name: 'Critical thinking',
              tag: 'transversal',
              tagClass: 'transversal',
              concrete:
                'Students learn to identify and cross-reference different types of sources about past environmental crises.'
            },
            {
              name: 'Systems thinking',
              tag: 'transversal',
              tagClass: 'transversal',
              concrete:
                'By drawing on multiple disciplines to analyze history, students understand the complex interactions between societies and the environment.'
            },
            {
              name: 'Civic awareness',
              tag: 'transversal',
              tagClass: 'transversal',
              concrete:
                'Students define their individual and collective responsibility regarding the transformations that need to be undertaken.'
            }
          ],
          also: [
            'Identifying sources in environmental history',
            'Analyzing socio-environmental transformations',
            'Placing events within time and space',
            'Comparing different historical periods',
            'Ability to propose solutions'
          ]
        },
        {
          type: 'activities',
          intro: 'Concrete activities that you can integrate into an existing lesson.',
          apports: [
            {
              label: 'Understanding',
              color: 'ct',
              acts: [
                {
                  title: 'Analyzing industrial archives',
                  desc: 'Students study archives on the Industrial Revolution and its environmental impacts through an ecological perspective.'
                },
                {
                  title: 'Studying an ecological disaster',
                  desc: 'Analyze a major disaster (oil spill, industrial accident) as a reflection of tensions between economy, politics, and the environment.'
                }
              ]
            },
            {
              label: 'Analyzing',
              color: 'cp',
              acts: [
                {
                  title: 'Comparative case study',
                  desc: 'Compare two societies facing resource management challenges: Ancient Rome and agricultural overexploitation versus a society that successfully managed its transition.'
                },
                {
                  title: 'Historical debate',
                  desc: '"Was the Industrial Revolution inevitably an ecological disaster?" Students argue using historical sources.'
                }
              ]
            },
            {
              label: 'Shedding light',
              color: 'ck',
              acts: [
                {
                  title: 'Connecting past and present',
                  desc: 'Students identify the historical roots of a contemporary ecological issue and propose lessons that can be drawn for current policies.'
                },
                {
                  title: 'Futures workshop',
                  desc: 'Students write a short prospective narrative based on identified historical trends. Understanding the importance of collective narratives.'
                }
              ]
            },
            {
              label: 'Contextualizing',
              color: 'cy',
              acts: [
                {
                  title: 'Timeline of anthropogenic pressures',
                  desc: 'Students create a timeline showing the major stages in the increase of human pressures on the environment.'
                },
                {
                  title: 'Analyzing an SDG through history',
                  desc: 'Choose a Sustainable Development Goal and trace its historical roots. A historical introduction to the SDGs.'
                }
              ]
            }
          ],
          feedback: 'Perfect. This activity can be directly integrated into an existing lesson.'
        },
        {
          type: 'votretour',
          statement: 'Your turn.',
          sub: 'You have just discovered how history connects with ecological transition. Take a moment to link this with your own teaching.',
          prompts: [
            {
              q: 'Which period or event in your course has the most visible environmental dimension?',
              placeholder: 'E.g.: the Industrial Revolution, decolonization, major disasters...'
            },
            {
              q: 'How could you imagine introducing this dimension in your next lesson?',
              placeholder:
                'E.g.: adding a question about the environmental impacts of a studied event...'
            }
          ],
          resource: {
            label: 'UVED Resource',
            title: 'History and Ecological Transition and Sustainable Development',
            href: 'https://www.uved.fr/fileadmin/user_upload/Documents/pdf/Fiches/Fiche_Histoire_et_TEDS.pdf'
          }
        }
      ]
    },
    economics: {
      steps: [
        {
          type: 'flip',
          statement: 'You are already teaching the tools of ecological transition.',
          hint: 'Click on each card to discover the connection.',
          cards: [
            {
              verb: 'Diagnosing',
              text: 'Estimating the cost of environmental degradation and assessing the benefits of sustainable resource management.',
              color: 'ct'
            },
            {
              verb: 'Regulating',
              text: 'Proposing economic instruments such as taxation or subsidies to drive reductions in environmental impact.',
              color: 'cp'
            },
            {
              verb: 'Modeling',
              text: 'Building alternative models: circular economy, degrowth, ecological economics, planetary boundaries.',
              color: 'ck'
            },
            {
              verb: 'Decision-making',
              text: 'Providing decision-support tools to make ecological transition economically and socially attractive.',
              color: 'cy'
            }
          ],
          closing:
            'Economics offers a diversity of approaches to connect sustainability, prosperity, and social justice.'
        },
        {
          type: 'competences',
          intro:
            'By studying ecological transition through economics, your students develop essential analytical and critical skills.',
          featured: [
            {
              name: 'Systems thinking',
              tag: 'disciplinary',
              tagClass: 'disciplinary',
              concrete:
                'Students integrate planetary boundaries into economic analysis, adopting an interdisciplinary perspective that goes beyond standard models.'
            },
            {
              name: 'Prospective analysis',
              tag: 'disciplinary',
              tagClass: 'disciplinary',
              concrete:
                'Students describe the economic assumptions behind different transition scenarios and anticipate how stakeholders may respond to environmental policies.'
            },
            {
              name: 'Ability to take action',
              tag: 'transversal',
              tagClass: 'transversal',
              concrete:
                'Students apply cost-benefit analyses to real climate policies and assess the effectiveness of environmental taxation.'
            }
          ],
          also: [
            'Critical analysis of economic models',
            'Evaluating life-cycle costs',
            'Climate justice and inequalities',
            'Modeling the impacts of public policies',
            'Evaluating alternative regulation strategies'
          ]
        },
        {
          type: 'activities',
          intro: 'Concrete activities that you can integrate into an existing lesson.',
          apports: [
            {
              label: 'Diagnosing',
              color: 'ct',
              acts: [
                {
                  title: 'Calculating the cost of climate inaction',
                  desc: 'Students use data from the Stern Review to estimate the economic cost of climate inaction compared with the cost of mitigation policies.'
                },
                {
                  title: 'Analyzing the externalities of an industry',
                  desc: 'Identify and quantify the negative externalities of an industrial sector (pollution, biodiversity loss). Who pays these costs and how?'
                }
              ]
            },
            {
              label: 'Regulating',
              color: 'cp',
              acts: [
                {
                  title: 'Debate on carbon taxation',
                  desc: '"Under what conditions can a carbon tax be a fair and effective tool?" Students argue different positions using economic data and equity criteria.'
                },
                {
                  title: 'Simulating a climate negotiation (COP)',
                  desc: 'Students represent different countries in a climate negotiation, applying concepts of public goods, externalities, and trade-offs between development and mitigation.'
                }
              ]
            },
            {
              label: 'Modeling',
              color: 'ck',
              acts: [
                {
                  title: 'Modeling a circular economy',
                  desc: 'Based on François Grosse’s mathematical conditions (recycling rates, growth rates), students test under which conditions an economy can truly become circular.'
                },
                {
                  title: 'Building a carbon neutrality pathway',
                  desc: 'Students develop an economic pathway compatible with carbon neutrality by 2050, identifying key levers and constraints.'
                }
              ]
            },
            {
              label: 'Decision-making',
              color: 'cy',
              acts: [
                {
                  title: 'Cost-benefit analysis of a climate policy',
                  desc: 'Assess the benefits and costs of an action aimed at reducing greenhouse gas emissions, using for example the Nordhaus model.'
                },
                {
                  title: 'Designing a sustainable territorial project',
                  desc: 'Interdisciplinary project: design a sustainable territory by integrating ecological, social, and economic constraints. Students defend their choices.'
                }
              ]
            }
          ],
          feedback:
            'Excellent idea. This activity directly connects the economic tools you teach with concrete challenges.'
        },
        {
          type: 'votretour',
          statement: 'Your turn.',
          sub: 'You have just discovered how economics connects with ecological transition. Make the link with your own teaching.',
          prompts: [
            {
              q: 'Which economic concept from your course connects most naturally with ecological transition?',
              placeholder: 'E.g.: externalities, public goods, cost-benefit analysis...'
            },
            {
              q: 'How could you enrich one of your existing lessons with an ESDT dimension?',
              placeholder:
                'E.g.: replacing a generic example with a real environmental policy case...'
            }
          ],
          resource: {
            label: 'UVED Resource',
            title: 'Economics and Ecological Transition and Sustainable Development',
            href: 'https://www.uved.fr/fileadmin/user_upload/Documents/pdf/Fiches/Fiche_Economie_et_TEDS.pdf'
          }
        }
      ]
    },
    law: {
      steps: [
        {
          type: 'flip',
          statement: 'Law is at the heart of ecological transition.',
          hint: 'Click on each card to discover the connection.',
          cards: [
            {
              verb: 'Defining',
              text: 'Law establishes the constitutional principles of environmental protection: prevention, precaution, non-regression, and the polluter-pays principle.',
              color: 'ct'
            },
            {
              verb: 'Regulating',
              text: 'It organizes human activities to limit their impact: urban planning, industry, agriculture, mining, and transport.',
              color: 'cp'
            },
            {
              verb: 'Holding accountable',
              text: 'It manages disputes, sanctions environmental harm, and establishes ecological liability frameworks.',
              color: 'ck'
            },
            {
              verb: 'Governing',
              text: 'It organizes public participation in environmental decision-making and defines the responsibilities of public authorities.',
              color: 'cy'
            }
          ],
          closing:
            'Law enables regulated, democratic, and transparent decision-making, serving the public interest while respecting planetary boundaries.'
        },
        {
          type: 'competences',
          intro:
            'By studying ecological transition through law, your students develop essential analytical and civic skills.',
          featured: [
            {
              name: 'Critical analysis',
              tag: 'disciplinary',
              tagClass: 'disciplinary',
              concrete:
                'Students interpret an energy or climate law and distinguish what falls under national, European, and international law.'
            },
            {
              name: 'Systems thinking',
              tag: 'transversal',
              tagClass: 'transversal',
              concrete:
                'Students identify law as a tool for social transformation and understand the links between environmental law and other legal fields.'
            },
            {
              name: 'Collective action',
              tag: 'transversal',
              tagClass: 'transversal',
              concrete:
                'Students use legal vocabulary to argue in favor of environmental protection in concrete cases.'
            }
          ],
          also: [
            'Identifying major constitutional principles',
            'Understanding liability frameworks',
            'Exploring environmental democracy',
            'Analyzing the constitutionality of projects',
            'Mastering legal methodology',
            'Co-constructing a legal opinion'
          ]
        },
        {
          type: 'activities',
          intro: 'Concrete activities that you can integrate into an existing lesson.',
          apports: [
            {
              label: 'Defining',
              color: 'ct',
              acts: [
                {
                  title: 'Analyzing the Environmental Charter',
                  desc: 'Students study the French Environmental Charter: what rights and duties does it establish? What are its limitations? How effective is it?'
                },
                {
                  title: 'Comparing environmental principles in European and national law',
                  desc: 'Identify how the precautionary and polluter-pays principles are applied differently depending on levels of governance.'
                }
              ]
            },
            {
              label: 'Regulating',
              color: 'cp',
              acts: [
                {
                  title: 'Case study: a project facing environmental law',
                  desc: 'Analyze the legality and constitutionality of a development project (wind farm, mine, highway) in light of environmental law.'
                },
                {
                  title: 'Reading and analyzing an environmental law',
                  desc: 'Examine a recent environmental legal text to identify its mechanisms, limitations, and barriers to implementation.'
                }
              ]
            },
            {
              label: 'Holding accountable',
              color: 'ck',
              acts: [
                {
                  title: 'Analyzing an environmental criminal court decision',
                  desc: 'Study a real case of ecological damage to understand how law addresses environmental harm and compensation.'
                },
                {
                  title: 'Role play: conflicts of use',
                  desc: 'Students represent different stakeholders facing an environmental controversy (farmers, NGOs, local authorities, government) to understand legal tensions.'
                }
              ]
            },
            {
              label: 'Governing',
              color: 'cy',
              acts: [
                {
                  title: 'Simulating a public environmental consultation',
                  desc: 'Debate within a fictional dialogue forum around a project to confront opposing viewpoints and understand environmental democracy.'
                },
                {
                  title: 'Drafting a fictional law proposal',
                  desc: 'Students draft a bill or amendments on an environmental issue, discovering the legislative process and the compromises required.'
                }
              ]
            }
          ],
          feedback:
            'Very good. This activity directly connects legal mechanisms to real-life situations.'
        },
        {
          type: 'votretour',
          statement: 'Your turn.',
          sub: 'You have just discovered how law connects with ecological transition. Make the link with your own teaching.',
          prompts: [
            {
              q: 'Which legal principle from your course has the most direct environmental application?',
              placeholder:
                'E.g.: civil liability, the precautionary principle, fundamental rights...'
            },
            {
              q: 'How could you use a real environmental case in your next lesson?',
              placeholder: 'E.g.: studying a recent court decision, analyzing a current law...'
            }
          ],
          resource: {
            label: 'UVED Resource',
            title: 'Law and Ecological Transition and Sustainable Development',
            href: 'https://www.uved.fr/fileadmin/user_upload/Documents/pdf/Fiches/Fiche_Droit_et_TEDS.pdf'
          }
        }
      ]
    },
    philosophy: {
      steps: [
        {
          type: 'flip',
          statement: 'Philosophy already addresses the challenges of ecological transition.',
          hint: 'Click on each card to discover the connection.',
          cards: [
            {
              verb: 'Questioning',
              text: 'Philosophy questions the aims of progress and development and examines the cultural assumptions of modernity.',
              color: 'ct'
            },
            {
              verb: 'Ethicizing',
              text: 'It questions the ethical principles guiding individual and collective choices and sheds light on the notion of intergenerational responsibility.',
              color: 'cp'
            },
            {
              verb: 'Critiquing',
              text: 'It critiques the dualisms between nature/culture and humans/non-humans, and explores the different values underlying our relationship with nature.',
              color: 'ck'
            },
            {
              verb: 'Imagining',
              text: 'It defines the conditions of an ecological democracy and reflects on living together with other forms of life, human and non-human.',
              color: 'cy'
            }
          ],
          closing:
            'Philosophy prepares students for the ethical, political, and existential choices raised by ecological transition and contributes to building informed and responsible citizens.'
        },
        {
          type: 'competences',
          intro:
            'By studying ecological transition through philosophy, your students develop essential thinking and argumentation skills.',
          featured: [
            {
              name: 'Problem formulation',
              tag: 'disciplinary',
              tagClass: 'disciplinary',
              concrete:
                'Students raise fundamental questions about responsibility toward future generations, the intrinsic value of nature, and the meaning of progress.'
            },
            {
              name: 'Critical thinking',
              tag: 'transversal',
              tagClass: 'transversal',
              concrete:
                'Students distinguish knowledge from opinions and question assumptions, particularly major narratives of progress and growth.'
            },
            {
              name: 'Civic reflexivity',
              tag: 'transversal',
              tagClass: 'transversal',
              concrete:
                'Students connect different dimensions of responsibility: individual, collective, historical, intergenerational, moral, and legal.'
            }
          ],
          also: [
            'Analyzing concepts',
            'Building rigorous arguments',
            'Interpreting philosophical texts',
            'Putting theories into perspective',
            'Debating and expressing constructive disagreements',
            'Connecting interdisciplinary knowledge'
          ]
        },
        {
          type: 'activities',
          intro: 'Concrete activities that you can integrate into an existing lesson.',
          apports: [
            {
              label: 'Questioning',
              color: 'ct',
              acts: [
                {
                  title: 'Essay on progress and its limits',
                  desc: '"Can technological progress solve the ecological crisis?" A classic philosophical question made urgent by contemporary challenges.'
                },
                {
                  title: 'Analyzing a text on modernity and the environment',
                  desc: 'Read and comment on an excerpt from Hans Jonas, Dominique Bourg, or Bruno Latour. Students develop text analysis skills using authors directly relevant to ecological issues.'
                }
              ]
            },
            {
              label: 'Ethicizing',
              color: 'cp',
              acts: [
                {
                  title: 'Debate on intergenerational responsibility',
                  desc: '"Do we have moral obligations toward future generations?" Students explore Rawls, Jonas, and theories of climate justice in a structured debate.'
                },
                {
                  title: 'Developing an ethical charter',
                  desc: 'In groups, students write an ethical charter for an institution (university, company, city) facing a specific ecological challenge. This tests applied ethics.'
                }
              ]
            },
            {
              label: 'Critiquing',
              color: 'ck',
              acts: [
                {
                  title: 'Studying veganism as a philosophical case',
                  desc: 'Approach veganism not simply as a lifestyle choice but as a philosophical test case: which ethical frameworks does it challenge? Which moral foundations does it reveal?'
                },
                {
                  title: 'Critiquing the nature/culture dualism',
                  desc: 'Using texts by Latour or Descola, students deconstruct the separation between nature and culture and explore its implications for the ecological crisis.'
                }
              ]
            },
            {
              label: 'Imagining',
              color: 'cy',
              acts: [
                {
                  title: 'Philosophical discussion on climate justice',
                  desc: 'Combine philosophy and geography around the question: who suffers most from climate change and who bears the greatest responsibility? Is this fair?'
                },
                {
                  title: 'Designing an ecological democracy',
                  desc: 'Students define the conditions of a democracy that integrates planetary boundaries and representation of future generations. A political philosophy exercise.'
                }
              ]
            }
          ],
          feedback:
            'Well chosen. This activity connects philosophy to questions that your students genuinely experience.'
        },
        {
          type: 'votretour',
          statement: 'Your turn.',
          sub: 'You have just discovered how philosophy connects with ecological transition. Make the link with your own teaching.',
          prompts: [
            {
              q: 'Which concept from your course has the most direct connection with an ecological issue?',
              placeholder: 'E.g.: responsibility, justice, progress, nature, the common good...'
            },
            {
              q: 'How could you introduce an example or text related to ESDT in your next lesson?',
              placeholder:
                'E.g.: replacing a classic example with a contemporary ecological situation...'
            }
          ],
          resource: {
            label: 'UVED Resource',
            title: 'Philosophy and Ecological Transition and Sustainable Development',
            href: 'https://www.uved.fr/fileadmin/user_upload/Documents/pdf/Fiches/Fiche_Philosophie_et_TEDS.pdf'
          }
        }
      ]
    },
    psychology: {
      steps: [
        {
          type: 'flip',
          statement: 'Psychology sheds light on the human dimensions of ecological transition.',
          hint: 'Click on each card to discover the connection.',
          cards: [
            {
              verb: 'Understanding',
              text: 'Analyzing perceptions and representations of environmental risks, and understanding our relationships with the different spaces affected by transition.',
              color: 'ct'
            },
            {
              verb: 'Regulating',
              text: 'Understanding and regulating emotions associated with environmental changes: eco-anxiety, solastalgia, feelings of loss or helplessness.',
              color: 'cp'
            },
            {
              verb: 'Mobilizing',
              text: 'Identifying psychological barriers to change and activating levers for action: social norms, green nudges, and identity processes.',
              color: 'ck'
            },
            {
              verb: 'Supporting',
              text: 'Supporting psychological sustainability by helping individuals remain active and constructive despite environmental anxiety.',
              color: 'cy'
            }
          ],
          closing:
            'Psychology helps bridge the gap between knowledge and action by considering what humans perceive and feel in response to ecological challenges.'
        },
        {
          type: 'competences',
          intro:
            'By studying ecological transition through psychology, your students develop essential analytical and applied skills.',
          featured: [
            {
              name: 'Complex and systems thinking',
              tag: 'transversal',
              tagClass: 'transversal',
              concrete:
                'Students identify links between emotions, pro-environmental behaviors, and sustainability policies, understanding the complexity of environmental representations.'
            },
            {
              name: 'Critical analysis',
              tag: 'transversal',
              tagClass: 'transversal',
              concrete:
                'Students understand the foundations of environmental discourses and behaviors and identify their own position regarding these issues.'
            },
            {
              name: 'Capacity for transformation',
              tag: 'transversal',
              tagClass: 'transversal',
              concrete:
                'Students design change strategies and support individuals in transforming vulnerability and anxiety into action and resilience.'
            }
          ],
          also: [
            'Understanding human behaviors in transition contexts',
            'Designing and evaluating change strategies',
            'Communicating to inform and engage',
            'Analyzing decision-making mechanisms',
            'Social representations and common sense'
          ]
        },
        {
          type: 'activities',
          intro: 'Concrete activities that you can integrate into an existing lesson.',
          apports: [
            {
              label: 'Understanding',
              color: 'ct',
              acts: [
                {
                  title: 'Analyzing perceptions of climate risk',
                  desc: 'Students study how different populations perceive climate risk from a psychosocial perspective, identifying cognitive and cultural biases.'
                },
                {
                  title: 'Comparative study of eco-anxiety',
                  desc: 'Compare perceptions of eco-anxiety across different cultural and regional contexts. Students analyze testimonies and apply psychological frameworks.'
                }
              ]
            },
            {
              label: 'Regulating',
              color: 'cp',
              acts: [
                {
                  title: 'Debate: eco-anxiety, pathology or appropriate response?',
                  desc: '"Is eco-anxiety a condition to be treated or a healthy psychological response to climate change?" Structured debate based on scientific arguments.'
                },
                {
                  title: 'Analyzing cognitive mechanisms linked to eco-anxiety',
                  desc: 'Using anonymized testimonies, students identify cognitive and emotional mechanisms related to eco-anxiety and propose support strategies.'
                }
              ]
            },
            {
              label: 'Mobilizing',
              color: 'ck',
              acts: [
                {
                  title: 'Designing a green nudges campaign',
                  desc: 'Students apply psychological theories (social norms, planned behavior) to design an awareness campaign on a university campus.'
                },
                {
                  title: 'Observing and analyzing eco-friendly behaviors',
                  desc: 'Observe recycling behaviors or food choices in real contexts, interview people about their motivations, and apply psychosocial frameworks.'
                }
              ]
            },
            {
              label: 'Supporting',
              color: 'cy',
              acts: [
                {
                  title: 'Psychological support project facing the climate crisis',
                  desc: 'Build a psychological support campaign incorporating knowledge about eco-anxiety to help people affected by climate events.'
                },
                {
                  title: 'Role play: persuading people facing cognitive vulnerability',
                  desc: 'Students must convince a cognitively vulnerable group to engage in ecological transition, for example in response to rising sea levels in a coastal city.'
                }
              ]
            }
          ],
          feedback:
            'Good choice. This activity directly connects psychology to situations your students experience or observe.'
        },
        {
          type: 'votretour',
          statement: 'Your turn.',
          sub: 'You have just discovered how psychology connects with ecological transition. Make the link with your own teaching.',
          prompts: [
            {
              q: 'Which psychological concept from your course becomes most meaningful when applied to a behavior involving ecological issues?',
              placeholder:
                'E.g.: theory of planned behavior, cognitive biases, social representations...'
            },
            {
              q: 'How could you make this connection in your next lesson?',
              placeholder:
                'E.g.: applying a theoretical framework to a real environmental behavior observed by students...'
            }
          ],
          resource: {
            label: 'UVED Resource',
            title: 'Psychology and Ecological Transition and Sustainable Development',
            href: 'https://www.uved.fr/fileadmin/user_upload/Documents/pdf/Fiches/Fiche_Psychologie_et_TEDS.pdf'
          }
        }
      ]
    },
    geography: {
      steps: [
        {
          type: 'flip',
          statement: 'Geography is at the heart of the ecological transition.',
          hint: 'Click on each card to discover the connection.',
          cards: [
            {
              verb: 'Locate and map',
              text: 'You teach your students to read spatial dynamics. This is exactly what is needed to map climate vulnerabilities, pollution flows, and environmental inequalities at different scales.',
              color: 'ct'
            },
            {
              verb: 'Understand territories',
              text: 'Geography analyzes interactions between societies and environments. For example, understanding how a coastal city is changing in response to rising sea levels, or how a rural area is managing the energy transition.',
              color: 'cp'
            },
            {
              verb: 'Decipher policies',
              text: 'You teach your students to analyze stakeholders and public decisions. This is exactly what the transition requires: understanding who makes decisions, at what level, and with what effects on territories.',
              color: 'ck'
            },
            {
              verb: 'Think about inequalities',
              text: 'Geography explores socio-spatial inequalities. The ecological crisis amplifies them: who is most vulnerable, who has access to resources, who bears the effects of climate change?',
              color: 'cy'
            }
          ],
          closing:
            'Without a geographical foundation and without taking into account the specific characteristics of spaces and societies, the ecological transition would be ineffective. Your discipline is essential.'
        },
        {
          type: 'competences',
          intro:
            'By studying the ecological transition through geography, your students develop essential analytical and civic skills.',
          featured: [
            {
              name: 'Map reading and production',
              tag: 'disciplinary',
              tagClass: 'disciplinary',
              concrete:
                'Students create a map of the climate vulnerabilities of a territory, identifying risk areas and populations exposed to extreme events.'
            },
            {
              name: 'Critical thinking',
              tag: 'transversal',
              tagClass: 'transversal',
              concrete:
                'Students analyze complex issues such as conflicts over water use or tensions between tourism development and coastal preservation.'
            },
            {
              name: 'Multiscalar thinking',
              tag: 'disciplinary',
              tagClass: 'disciplinary',
              concrete:
                'Students connect local decisions (an eco-district project) with national and global dynamics (climate policies, climate-related migration flows).'
            }
          ],
          also: [
            'Identify stakeholders and territorial dynamics',
            'Analyze spatial dynamics',
            'Work at different temporal and spatial scales',
            'Build an argument around a project',
            'Master digital and cartographic tools',
            'Understand global issues and their local manifestations'
          ]
        },
        {
          type: 'activities',
          intro: 'Concrete activities that you can integrate into an existing lesson.',
          apports: [
            {
              label: 'Locate and map',
              color: 'ct',
              acts: [
                {
                  title: 'Mapping the climate vulnerabilities of a territory',
                  desc: 'Students create a map of risk areas (flooding, drought, heatwaves) at the local or regional scale, cross-referencing climate data and social data.'
                },
                {
                  title: 'Compare the ecological footprints of different countries',
                  desc: 'Comparative analysis of national ecological footprints: who consumes the most, who suffers the most? Connect these data to development inequalities.'
                }
              ]
            },
            {
              label: 'Understand territories',
              color: 'cp',
              acts: [
                {
                  title: 'Study an eco-district or transition city project',
                  desc: 'Students analyze a real sustainable urban project (e.g. the Confluence district in Lyon, Bottière-Chénaie in Nantes): stakeholders, challenges, compromises, and limitations.'
                },
                {
                  title:
                    'Analyze the impacts of mountain tourism in the face of declining snow cover',
                  desc: 'Case study of a mountain territory (Alps, Pyrenees) facing declining snowfall. What forms of reconversion? What resistance? Which stakeholders?'
                }
              ]
            },
            {
              label: 'Decipher policies',
              color: 'ck',
              acts: [
                {
                  title: 'Simulate a Conference of the Parties (COP) on a local resource',
                  desc: 'Students represent different stakeholders (government, local authorities, NGOs, companies, citizens) negotiating the sustainable management of a common resource: water, forests, or coastline.'
                },
                {
                  title: 'Analyze a sustainable spatial planning policy',
                  desc: 'Examine a local urban development plan (PLU) or territorial coherence scheme (SCoT) through the lens of the ecological transition: what objectives? What contradictions?'
                }
              ]
            },
            {
              label: 'Think about inequalities',
              color: 'cy',
              acts: [
                {
                  title: 'Case study on environmental justice',
                  desc: 'Analyze a territory where a polluting industrial area and disadvantaged populations coexist. Who decides where the facility is located? Who bears the effects? What forms of recourse exist?'
                },
                {
                  title: 'Geography of climate migration',
                  desc: 'Using real data, students map migration linked to climate disasters and analyze inequalities in vulnerability between countries in the Global North and South.'
                }
              ]
            }
          ],
          feedback:
            'Good choice. This activity directly grounds geographical tools in concrete territorial issues.'
        },
        {
          type: 'votretour',
          statement: 'Your turn.',
          sub: 'You have just discovered how geography fits into the ecological transition. Make the connection with your own teaching.',
          prompts: [
            {
              q: 'Which territory or spatial dynamic in your course has the most obvious connection to the TEDS?',
              placeholder: 'E.g.: urban dynamics, rural areas, coastlines, regional inequalities...'
            },
            {
              q: 'How do you imagine introducing a map or case study related to the transition in your next lesson?',
              placeholder:
                'E.g.: adding a map of climate vulnerabilities to an existing lesson on spatial planning...'
            }
          ],
          resource: {
            label: 'UVED Resource',
            title: 'Geography and the Ecological and Sustainable Development Transition',
            href: 'https://www.uved.fr/fileadmin/user_upload/Documents/pdf/Fiches/Fiche_Geographie_et_TEDS.pdf'
          }
        }
      ]
    },
    health: {
      steps: [
        {
          type: 'flip',
          statement: 'Health sciences are a central driver of the ecological transition.',
          hint: 'Click on each card to discover the connection.',
          cards: [
            {
              verb: 'Identify risks',
              text: 'You teach your students to assess the effects of environmental exposures on health. For example, analyzing excess mortality linked to heatwaves or respiratory diseases associated with air pollution.',
              color: 'ct'
            },
            {
              verb: 'Analyze policies',
              text: 'Health makes it possible to assess the co-benefits of climate policies: reducing meat consumption improves health while also reducing emissions. Your students learn to reason in systems.',
              color: 'cp'
            },
            {
              verb: 'Strengthen resilience',
              text: 'Moving from a logic of repair to a logic of prevention: this is one of the major challenges of environmental health, and a way of thinking that students develop from the outset of their training.',
              color: 'ck'
            },
            {
              verb: 'Reduce the footprint',
              text: 'The healthcare sector itself contributes to emissions. Your students can design more sustainable medical practices: recycling reagents, eco-design of care, energy efficiency.',
              color: 'cy'
            }
          ],
          closing:
            'Health is a common language between disciplines and a concrete entry point for discussing interdependence between humans and their environment.'
        },
        {
          type: 'competences',
          intro:
            'By studying the ecological transition through health sciences, your students develop essential clinical, systemic, and civic skills.',
          featured: [
            {
              name: 'One Health approach',
              tag: 'disciplinary',
              tagClass: 'disciplinary',
              concrete:
                'Students learn to understand human health as connected to the health of ecosystems and other living beings. For example, analyzing the emergence of vector-borne diseases linked to global warming.'
            },
            {
              name: 'Mobilize interdisciplinary knowledge',
              tag: 'transversal',
              tagClass: 'transversal',
              concrete:
                "Students combine medicine, ecology, psychology, and sociology to analyze the environmental determinants of a population's health in a given territory."
            },
            {
              name: 'Critical thinking',
              tag: 'transversal',
              tagClass: 'transversal',
              concrete:
                'Students distinguish political and media narratives from established scientific facts in environmental health, and develop ethical skills when addressing issues of health justice.'
            }
          ],
          also: [
            'Describe interactions between environment and health',
            'Analyze the ecological and social determinants of health',
            'Understand environmental and health justice issues',
            'Act as an agent of transition in the health sector',
            'Make recommendations for risk prevention',
            'Contribute to citizen education and awareness'
          ]
        },
        {
          type: 'activities',
          intro: 'Concrete activities that you can integrate into an existing lesson.',
          apports: [
            {
              label: 'Identify risks',
              color: 'ct',
              acts: [
                {
                  title: 'Case study: impact of a heatwave on public health',
                  desc: 'Students analyze data from a real heatwave episode (mortality, hospitalizations, vulnerable populations) and identify health responses and prevention levers.'
                },
                {
                  title: 'Analyze an air pollution episode',
                  desc: 'Using real data (Airparif, WHO), students assess the health effects of a pollution peak and inequalities in exposure according to territories and populations.'
                }
              ]
            },
            {
              label: 'Analyze policies',
              color: 'cp',
              acts: [
                {
                  title: 'Assess the co-benefits of a climate policy',
                  desc: 'Students analyze a transition policy (active mobility, reduced meat consumption, urban greening) from the perspective of its health benefits and risks.'
                },
                {
                  title: 'Study the National Environmental Health Plan',
                  desc: 'Examine national and international strategies (PNSE, WHO, One Health): what objectives, what tools, what effectiveness in a context of ecological transition?'
                }
              ]
            },
            {
              label: 'Strengthen resilience',
              color: 'ck',
              acts: [
                {
                  title: 'Multidisciplinary project: environmental health on a campus',
                  desc: 'Carry out an environmental health assessment on campus: air quality, access to green spaces, food, mobility. Connect the data to issues of environmental justice.'
                },
                {
                  title: 'Role-play: debate a public health issue',
                  desc: 'Students take on the roles of different stakeholders (healthcare professionals, elected officials, NGOs, researchers, citizens) to debate an environmental public health issue (pesticides, pollution, heatwaves).'
                }
              ]
            },
            {
              label: 'Reduce the footprint',
              color: 'cy',
              acts: [
                {
                  title: 'Design more sustainable medical practices',
                  desc: 'Students imagine solutions for reducing the ecological footprint of a healthcare department: recycling, energy efficiency, responsible purchasing, eco-design of medical equipment.'
                },
                {
                  title: 'Scientific communication on health and transition',
                  desc: 'In groups, students create a poster, podcast, or educational video on the links between a health issue and the ecological transition, intended for a non-specialist audience.'
                }
              ]
            }
          ],
          feedback:
            'Very good. This activity directly connects clinical skills with concrete environmental issues.'
        },
        {
          type: 'votretour',
          statement: 'Your turn.',
          sub: 'You have just discovered how health sciences fit into the ecological transition. Make the connection with your own teaching.',
          prompts: [
            {
              q: 'What connection between health and the environment could you introduce in your next lesson?',
              placeholder:
                'E.g.: the effects of pollution on respiratory diseases, mental health and climate...'
            },
            {
              q: 'How do you imagine making the ecological transition a learning context in your course?',
              placeholder:
                'E.g.: using epidemiological data related to climate change in a clinical case...'
            }
          ],
          resource: {
            label: 'UVED Resource',
            title: 'Health and the Ecological and Sustainable Development Transition',
            href: 'https://www.uved.fr/fileadmin/user_upload/Documents/pdf/Fiches/Fiche_Sante_et_TEDS.pdf'
          }
        }
      ]
    },
    staps: {
      steps: [
        {
          type: 'flip',
          statement:
            'STAPS are at the heart of contemporary health, social, and environmental challenges.',
          hint: 'Click on each card to discover the connection.',
          cards: [
            {
              verb: 'Understand the effects of climate',
              text: 'Physical and sports activities are highly dependent on environmental conditions. Your students learn to understand physiological adaptations to extreme heat, pollution, and extreme climate events.',
              color: 'ct'
            },
            {
              verb: 'Increase resilience',
              text: 'Better physical fitness can improve tolerance to certain environmental constraints. Your students learn to design programs adapted to current climate constraints.',
              color: 'cp'
            },
            {
              verb: 'Reduce the footprint',
              text: 'The sports sector is highly dependent on infrastructure, equipment, and mobility. Your students can learn to design more sustainable and responsible sports practices.',
              color: 'ck'
            },
            {
              verb: 'Educate for global health',
              text: 'STAPS promote values of respect, cooperation, and commitment. They make it possible to consider the links between human health and environmental health from a sustainability perspective.',
              color: 'cy'
            }
          ],
          closing:
            'STAPS train professionals capable of adapting sports practices to ecological constraints, organizing more sustainable events, and supporting transitions within the sports sector.'
        },
        {
          type: 'competences',
          intro:
            'By studying the ecological transition through STAPS, your students develop essential disciplinary and transversal skills.',
          featured: [
            {
              name: 'Systems thinking',
              tag: 'transversal',
              tagClass: 'transversal',
              concrete:
                'Students describe the interactions between health, climate, sports infrastructure, and the sports economy. For example, analyzing how rising temperatures affect practices and performance.'
            },
            {
              name: 'Critical analysis',
              tag: 'disciplinary',
              tagClass: 'disciplinary',
              concrete:
                'Students analyze a sports-related issue in the era of planetary boundaries: identify and interpret the environmental performance indicators of a sports facility or event.'
            },
            {
              name: 'Ability to design',
              tag: 'disciplinary',
              tagClass: 'disciplinary',
              concrete:
                'Students design a PE or training program that takes climate hazards (heatwaves, air quality, flooding) into account while using resources responsibly.'
            }
          ],
          also: [
            'Define sustainability indicators for sporting events',
            'Organize fair, responsible, and low-impact sporting events',
            'Build an optimized and sustainable nutrition plan',
            'Explain the impact of climate risks on performance',
            'Connect urban planning, mobility, and sports practices',
            'Develop integrated territorial assessments'
          ]
        },
        {
          type: 'activities',
          intro: 'Concrete activities that you can integrate into an existing lesson.',
          apports: [
            {
              label: 'Understand the effects of climate',
              color: 'ct',
              acts: [
                {
                  title: 'Analyze the effects of heat on sports performance',
                  desc: 'Students study real physiological data on adaptation to heat and design training protocols that take current climate constraints into account.'
                },
                {
                  title: 'Case study: mountain sports and declining snow cover',
                  desc: 'Analyze the impact of climate change on a mountain sport (skiing, mountaineering): what adaptations in practices, infrastructure, and business models?'
                }
              ]
            },
            {
              label: 'Increase resilience',
              color: 'cp',
              acts: [
                {
                  title: 'Design a PE program adapted to climate constraints',
                  desc: 'Students design a PE sequence that takes a real environmental constraint (heatwave, air quality) into account: learning objectives, adaptations, and monitoring indicators.'
                },
                {
                  title: 'Analyze the health/climate co-benefits of active mobility',
                  desc: 'Mathematically compare the health effects and CO₂ emissions of different modes of transport to a sports facility. A concrete case of systems analysis.'
                }
              ]
            },
            {
              label: 'Reduce the footprint',
              color: 'ck',
              acts: [
                {
                  title: 'TD on the sustainability of the Olympic Games',
                  desc: 'Using institutional reports and real data, students assess the ecological footprint of the Olympic Games and propose indicators and reduction levers.'
                },
                {
                  title: 'Design a low-impact sporting event',
                  desc: 'Students plan a sporting event incorporating sustainability criteria: mobility, food, waste, accessibility. They define their own sustainability indicators.'
                }
              ]
            },
            {
              label: 'Educate for global health',
              color: 'cy',
              acts: [
                {
                  title: 'Debate: sports performance and planetary boundaries',
                  desc: '"Is the logic of sports performance compatible with planetary boundaries?" Students argue different positions based on economic, health, and environmental data.'
                },
                {
                  title: 'Awareness-raising project in a sports club',
                  desc: 'Students design and implement an awareness-raising initiative on sustainability issues in a local sports club or association.'
                }
              ]
            }
          ],
          feedback:
            'Good point. This activity directly connects STAPS skills with concrete environmental challenges.'
        },
        {
          type: 'votretour',
          statement: 'Your turn.',
          sub: 'You have just discovered how STAPS fit into the ecological transition. Make the connection with your own teaching.',
          prompts: [
            {
              q: 'Which sports practice or lesson in your course could incorporate a sustainability dimension?',
              placeholder:
                'E.g.: a PE session adapted to heat, analyzing the footprint of a sports facility...'
            },
            {
              q: 'How do you imagine making the ecological transition a learning context in your course?',
              placeholder:
                'E.g.: using real data on a sporting event to work on disciplinary skills...'
            }
          ],
          resource: {
            label: 'UVED Resource',
            title: 'STAPS and the Ecological and Sustainable Development Transition',
            href: 'https://www.uved.fr/fileadmin/user_upload/Documents/pdf/Fiches/Fiche_STAPS_et_TEDS.pdf'
          }
        }
      ]
    },
    lettres: {
      steps: [
        {
          type: 'flip',
          statement:
            'The humanities and literature play an essential role in the ecological transition.',
          hint: 'Click on each card to discover the connection.',
          cards: [
            {
              verb: 'Analyze imaginaries',
              text: 'You teach your students to read works and discourses. This is exactly what is needed to understand the imaginaries that have led to the overexploitation of the world, or to invent other ways of inhabiting the Earth.',
              color: 'ct'
            },
            {
              verb: 'Give meaning',
              text: 'The ecological crisis lacks words. Literature makes it possible to identify the different ways of naming, thinking about, and symbolizing ecological upheavals, including deciphering greenwashing.',
              color: 'cp'
            },
            {
              verb: 'Imagine futures',
              text: 'Through fiction, poetry, theatre, and ecological science fiction, literature makes it possible to think about social transformation and develop new collective narratives about living together with the living world.',
              color: 'ck'
            },
            {
              verb: 'Develop critical citizens',
              text: 'Your students learn to analyze advertising, media, and political discourses about ecology. They develop an informed personal perspective on these issues.',
              color: 'cy'
            }
          ],
          closing:
            'Literature and the humanities train citizens who are capable of thinking, expressing, and telling the story of the world differently. This is an essential condition for transforming our ways of life.'
        },
        {
          type: 'competences',
          intro:
            'By studying the ecological transition through literature and the humanities, your students develop essential literary, critical, and civic skills.',
          featured: [
            {
              name: 'Critical and contextualized reading',
              tag: 'disciplinary',
              tagClass: 'disciplinary',
              concrete:
                'Students analyze the historical and social origins of a work related to nature, and clarify the values and ideologies associated with narratives about the environment.'
            },
            {
              name: 'Critical thinking',
              tag: 'transversal',
              tagClass: 'transversal',
              concrete:
                'Students analyze advertising and political discourses about ecology, distinguishing greenwashing rhetoric from scientifically grounded claims.'
            },
            {
              name: 'Expression and creativity',
              tag: 'transversal',
              tagClass: 'transversal',
              concrete:
                'Students use literature and language to express emotions, values, and visions of the future in response to climate issues, transforming complex knowledge into accessible narratives.'
            }
          ],
          also: [
            'Analyze a literary work or discourse',
            'Write an essay or commentary with sustainability issues as a backdrop',
            'Produce a comparative analysis of texts',
            'Experiment with creative writing on themes related to the living world',
            'Produce new narratives capable of driving social transformations',
            'Identify opportunities for interdisciplinary collaboration'
          ]
        },
        {
          type: 'activities',
          intro: 'Concrete activities that you can integrate into an existing lesson.',
          apports: [
            {
              label: 'Analyze imaginaries',
              color: 'ct',
              acts: [
                {
                  title: 'Analyze a literary corpus about nature',
                  desc: 'Students study excerpts from works (from naturalist literature to climate speculative fiction) to analyze changing imaginaries of progress, the living world, and the planet.'
                },
                {
                  title: 'Decode discourses about ecology',
                  desc: 'Using advertising, political, or media examples, students identify discursive strategies related to the transition, including those involving greenwashing.'
                }
              ]
            },
            {
              label: 'Give meaning',
              color: 'cp',
              acts: [
                {
                  title: 'Workshop: rewriting a text in light of climate issues',
                  desc: 'Students rewrite a classic literary excerpt by incorporating a contemporary ecological dimension. A stylistic exercise that questions the cultural assumptions of the original work.'
                },
                {
                  title: 'Analyze ecopoetics in contemporary literature',
                  desc: 'Study authors of ecological literature (Thoreau, Le Clézio, Tesson, Giono): how do language and style express a relationship with nature? What new literary genres are emerging?'
                }
              ]
            },
            {
              label: 'Imagine futures',
              color: 'ck',
              acts: [
                {
                  title: 'Writing workshop: imagine a sustainable or devastated society',
                  desc: 'Students write a short story set in a society that has successfully completed its ecological transition, or one that has failed. An exercise in fiction-based foresight.'
                },
                {
                  title: 'Interdisciplinary literature and science project',
                  desc: 'In collaboration with science teachers, students create a literary text (essay, narrative, poem) that brings scientific knowledge and imaginaries of the climate crisis into dialogue.'
                }
              ]
            },
            {
              label: 'Develop critical citizens',
              color: 'cy',
              acts: [
                {
                  title: 'Read and analyze a political discourse on ecology',
                  desc: 'Students dissect a recent political speech on the ecological transition: what figures of speech, implicit assumptions, and framing effects? Rhetorical and civic analysis.'
                },
                {
                  title: 'Outdoor reading workshop',
                  desc: 'Read and discuss a literary text connected to a local natural environment. Connect reading to a sensory experience of the environment. This can be combined with a cultural or community partnership.'
                }
              ]
            }
          ],
          feedback:
            'Good choice. This activity grounds literary tools in questions that your students actually experience and read about.'
        },
        {
          type: 'votretour',
          statement: 'Your turn.',
          sub: 'You have just discovered how literature and the humanities fit into the ecological transition. Make the connection with your own teaching.',
          prompts: [
            {
              q: 'Which work or author in your course has the most direct connection with ecological issues?',
              placeholder:
                'E.g.: Zola and industry, Le Clézio and the relationship with nature, climate dystopia...'
            },
            {
              q: 'How do you imagine introducing an ecological dimension into your next literature lesson?',
              placeholder:
                'E.g.: adding a question about imaginaries of nature to a work already on the syllabus...'
            }
          ],
          resource: {
            label: 'UVED Resource',
            title: 'Literature and the Ecological and Sustainable Development Transition',
            href: 'https://www.uved.fr/fileadmin/user_upload/Documents/pdf/Fiches/Fiche_Lettres_et_TEDS.pdf'
          }
        }
      ]
    },
    ecology: {
      steps: [
        {
          type: 'flip',
          statement: 'Scientific ecology provides the fundamental knowledge for the transition.',
          hint: 'Click on each card to discover the connection.',
          cards: [
            {
              verb: 'Describe and understand',
              text: 'Ecology analyzes interactions between living organisms and their environment. You teach your students to understand the structure and functioning of ecosystems, whether highly or minimally shaped by human activity.',
              color: 'ct'
            },
            {
              verb: 'Assess and predict',
              text: 'Your students learn to assess the resilience or vulnerability of environments in response to human pressures, identify tipping points, and model ecosystem change.',
              color: 'cp'
            },
            {
              verb: 'Propose solutions',
              text: 'Ecology offers levers for transformation: agroecology, urban ecology, nature-based solutions, biomimicry. Your students learn to design concrete action plans.',
              color: 'ck'
            },
            {
              verb: 'Inform decisions',
              text: 'Ecological knowledge is essential for informing public policy. Your students learn to communicate complex scientific data to decision-makers and non-specialists.',
              color: 'cy'
            }
          ],
          closing:
            "Ecology provides essential knowledge for understanding today's environmental crises. Through its exploration of the living world, it is a source of progress and innovation for the transition."
        },
        {
          type: 'competences',
          intro:
            'By studying the ecological transition through scientific ecology, your students develop essential analytical and action-oriented skills.',
          featured: [
            {
              name: 'Systems analysis',
              tag: 'disciplinary',
              tagClass: 'disciplinary',
              concrete:
                'Students describe an ecosystem in terms of its interaction networks, identify cascading responses to disturbance, and explain the concepts of resilience and irreversibility.'
            },
            {
              name: 'Critical analysis',
              tag: 'disciplinary',
              tagClass: 'disciplinary',
              concrete:
                'Students identify the natural and human factors responsible for ecosystem dynamics and understand the strengths and limitations of data collection and modeling tools.'
            },
            {
              name: 'Capacity to act',
              tag: 'transversal',
              tagClass: 'transversal',
              concrete:
                'Students propose action programs for biodiversity conservation or restoration and draw on nature to design mitigation or adaptation solutions.'
            }
          ],
          also: [
            'Explain the forces determining genetic and species diversity',
            'Understand population and community ecology',
            'Understand ecosystem services and nature-based solutions',
            'Anticipate the consequences of biodiversity loss',
            'Connect ecology with other disciplines to describe socio-ecosystems',
            'Identify the most reliable sources of information in ecology'
          ]
        },
        {
          type: 'activities',
          intro: 'Concrete activities that you can integrate into an existing lesson.',
          apports: [
            {
              label: 'Describe and understand',
              color: 'ct',
              acts: [
                {
                  title: 'Ecological assessment through fieldwork',
                  desc: 'Students carry out an ecological assessment of a local site (river, forest, soil, grassland) using the observation and measurement methods covered in class.'
                },
                {
                  title: 'Build a biodiversity atlas',
                  desc: 'At the scale of the institution or neighborhood, students inventory local biodiversity, map observed species, and analyze the factors influencing their presence.'
                }
              ]
            },
            {
              label: 'Assess and predict',
              color: 'cp',
              acts: [
                {
                  title: 'Model the effects of a disturbance on an ecosystem',
                  desc: 'Using a real-world scenario (road construction, river pollution, introduction of an invasive species), students model cascading effects on the ecosystem.'
                },
                {
                  title: 'Compare agricultural practices according to their ecosystem benefits',
                  desc: 'Students compare conventional agriculture and agroecology according to criteria such as biodiversity, soil quality, and ecosystem services. Multicriteria analysis.'
                }
              ]
            },
            {
              label: 'Propose solutions',
              color: 'ck',
              acts: [
                {
                  title: 'Define guidelines for an action program for a territory',
                  desc: 'For a given territory experiencing strong pressures (urbanization, pollution, drought), students define an action program and describe the necessary trade-offs.'
                },
                {
                  title: 'Design a nature-based solution',
                  desc: 'Students identify a local environmental problem (urban heat island, runoff, pollinator loss) and design a solution inspired by ecosystem functioning.'
                }
              ]
            },
            {
              label: 'Inform decisions',
              color: 'cy',
              acts: [
                {
                  title: 'Expert debate on an ecological controversy',
                  desc: 'Role-play: students debate the management of a controversial territory or issue (wolf reintroduction, land artificialization, wetland management) using scientific data.'
                },
                {
                  title: 'Analyze how biodiversity is incorporated into a sectoral scenario',
                  desc: 'Students analyze how biodiversity is integrated (or not) into a real agricultural, energy, or urban planning scenario, and propose improvements.'
                }
              ]
            }
          ],
          feedback:
            'Excellent choice. This activity directly connects ecological concepts to real-world field situations.'
        },
        {
          type: 'votretour',
          statement: 'Your turn.',
          sub: 'You have just rediscovered how scientific ecology is at the heart of the ecological transition. Make the connection with your own teaching.',
          prompts: [
            {
              q: 'Which ecological concept from your course has the most direct application to a transition issue?',
              placeholder: 'E.g.: ecosystem resilience, ecosystem services, population dynamics...'
            },
            {
              q: 'How do you imagine introducing fieldwork or a concrete case related to the transition in your next lesson?',
              placeholder:
                'E.g.: using a locally disturbed ecosystem as a case study for a modeling session...'
            }
          ],
          resource: {
            label: 'UVED Resource',
            title: 'Ecology and the Ecological and Sustainable Development Transition',
            href: 'https://www.uved.fr/fileadmin/user_upload/Documents/pdf/Fiches/Fiche_Ecologie_et_TEDS.pdf'
          }
        }
      ]
    },
    art: {
      steps: [
        {
          type: 'flip',
          statement: 'Art plays a key and unique role in the ecological transition.',
          hint: 'Click on each card to discover the connection.',
          cards: [
            {
              verb: 'Change perspectives',
              text: 'Art evokes emotions and helps us better feel the beauty and fragility of nature, or the violence of transformations in our environment. Your students learn to develop ecological awareness through aesthetic experience.',
              color: 'ct'
            },
            {
              verb: 'Create new narratives',
              text: 'Art invents stories, images, and symbols that inspire action and open up the realm of possibilities. Your students learn to create works that transform collective imaginaries.',
              color: 'cp'
            },
            {
              verb: 'Experiment differently',
              text: 'Art explores other ways of inhabiting a place, reusing materials, and working with living things. Your students can question their relationship to objects, waste, and technology.',
              color: 'ck'
            },
            {
              verb: 'Encourage participation',
              text: 'Art brings citizens together and prompts reactions through collective projects (murals, performances, installations). Your students learn to create tools for mobilization and dialogue around the transition.',
              color: 'cy'
            }
          ],
          closing:
            'Creating feelings, transforming imaginaries, questioning our ways of life, bringing people together around narratives and experiences: the contributions of art to the TEDS are multiple and irreplaceable.'
        },
        {
          type: 'competences',
          intro:
            'By studying the ecological transition through the arts, your students develop essential creative, critical, and civic skills.',
          featured: [
            {
              name: 'Critical analysis of artworks',
              tag: 'disciplinary',
              tagClass: 'disciplinary',
              concrete:
                'Students understand how artists address ecological issues in different cultural contexts and decode the evolution of artistic sensitivities toward nature and artificialization.'
            },
            {
              name: 'Creativity and innovation',
              tag: 'disciplinary',
              tagClass: 'disciplinary',
              concrete:
                'Students explore new materials (recycled, natural, sustainable) and experiment with low-impact or collaborative artistic forms connected to transition issues.'
            },
            {
              name: 'Critical and ethical thinking',
              tag: 'transversal',
              tagClass: 'transversal',
              concrete:
                'Students analyze contradictions between art, consumer society, and ecological transition, and question the ecological impact of their own artistic practices (transport, exhibitions, dissemination).'
            }
          ],
          also: [
            'Represent the complexity of ecological issues',
            'Imagine new ways of thinking about and representing the world',
            'Carry out collective artistic projects that foster engagement',
            'Contribute to ecological awareness initiatives through the arts',
            'Translate complex issues into forms that are sensitive and accessible',
            'Use art as a vehicle for mobilization and knowledge transmission'
          ]
        },
        {
          type: 'activities',
          intro: 'Concrete activities that you can integrate into an existing lesson.',
          apports: [
            {
              label: 'Change perspectives',
              color: 'ct',
              acts: [
                {
                  title: 'Analyze ecological artworks (Eco-Art, Land Art)',
                  desc: 'Students analyze works by artists engaged with ecological issues (Andy Goldsworthy, Agnes Denes, Olafur Eliasson): how does the artwork challenge our relationship with nature?'
                },
                {
                  title: 'Listening practices and field recording',
                  desc: 'Students record sounds in different locations, ranging from highly to minimally anthropized environments, and create a sound piece. An exercise in sensory attention to the environment and its transformations.'
                }
              ]
            },
            {
              label: 'Create new narratives',
              color: 'cp',
              acts: [
                {
                  title: 'Create comic-book pages about the transition',
                  desc: 'In multidisciplinary groups, students create comic-book pages serving as educational materials on a TEDS issue. A combination of visual storytelling and scientific knowledge.'
                },
                {
                  title: 'Slam poetry and scientific communication',
                  desc: 'Invite or have students create a slam poem about an ecological transition issue. Students work on transforming scientific knowledge into a collective artistic presentation.'
                }
              ]
            },
            {
              label: 'Experiment differently',
              color: 'ck',
              acts: [
                {
                  title: 'Creative workshop using recycled materials',
                  desc: 'Students create a visual artwork using only recovered or natural materials. The workshop questions the relationship to matter, waste, and resources in artistic practice.'
                },
                {
                  title: 'Ecosomatic practices and attention to environments',
                  desc: 'Body-based exercises (dance, theatre) that invite students to sense living beings within themselves and develop ecological attention to their environment. An intersectional approach between dance/theatre arts and ecology.'
                }
              ]
            },
            {
              label: 'Encourage participation',
              color: 'cy',
              acts: [
                {
                  title: 'Forum theatre on a transition issue',
                  desc: "Organize forum theatre around a scenario related to the ecological transition. Students perform and then spectators intervene. Augusto Boal's method is a powerful tool for raising awareness."
                },
                {
                  title: 'Artistic ecological festival or week',
                  desc: 'Organize a week with a collective program: performances, screenings, workshops, exhibitions, conferences. Groups of students produce an artistic outcome with a free choice of format.'
                }
              ]
            }
          ],
          feedback:
            'Excellent. This activity combines artistic creation and ecological awareness in a directly applicable way.'
        },
        {
          type: 'votretour',
          statement: 'Your turn.',
          sub: 'You have just discovered how the arts fit into the ecological transition. Make the connection with your own teaching.',
          prompts: [
            {
              q: 'Which artistic form in your course could incorporate an ecological issue as material or subject?',
              placeholder:
                'E.g.: a creative workshop on the theme of the living world, an analysis of ecological artworks...'
            },
            {
              q: 'How do you imagine making the transition a context for artistic experimentation in your course?',
              placeholder:
                'E.g.: introducing a constraint requiring sustainable materials in a future creative workshop...'
            }
          ],
          resource: {
            label: 'UVED Resource',
            title: 'Art and the Ecological and Sustainable Development Transition',
            href: 'https://www.uved.fr/fileadmin/user_upload/Documents/pdf/Fiches/Fiche_Art_et_TEDS.pdf'
          }
        }
      ]
    },
    polsci: {
      steps: [
        {
          type: 'flip',
          statement:
            'Political science is essential for understanding and steering the ecological transition.',
          hint: 'Click on each card to discover the connection.',
          cards: [
            {
              verb: 'Understand governance',
              text: 'Who decides, at what level, and how? You teach your students to identify the different levels of multi-level governance (local, national, international) and the stakeholders involved in transition decisions.',
              color: 'ct'
            },
            {
              verb: 'Analyze power relations',
              text: 'The transition reveals conflicts of interest between economic, political, and social actors. Your students learn to decipher trade-offs surrounding natural resources and environmental justice.',
              color: 'cp'
            },
            {
              verb: 'Evaluate public policies',
              text: 'Design, evaluate, and compare transition policies: instruments used (taxes, regulations, subsidies), what works or fails depending on the context. This is at the heart of your discipline.',
              color: 'ck'
            },
            {
              verb: 'Analyze ecological democracy',
              text: 'Distinguish and analyze forms of democracy mobilized for the transition: participatory and deliberative. Understand the role of citizen mobilizations and new forms of shared governance.',
              color: 'cy'
            }
          ],
          closing:
            'The ecological transition is above all a political issue because it concerns how societies organize themselves, make decisions, arbitrate, and transform. Your discipline is at the heart of these questions.'
        },
        {
          type: 'competences',
          intro:
            'By studying the ecological transition through political science, your students develop essential analytical and civic skills.',
          featured: [
            {
              name: 'Public policy analysis',
              tag: 'disciplinary',
              tagClass: 'disciplinary',
              concrete:
                'Students design and evaluate transition policies, compare instruments (carbon taxes, emissions trading schemes, regulations), and identify what works depending on the context.'
            },
            {
              name: 'Critical analysis of political narratives',
              tag: 'disciplinary',
              tagClass: 'disciplinary',
              concrete:
                'Students identify the narratives, beliefs, and ideologies mobilized in political decision-making on the transition (green growth versus degrowth) and analyze the visions guiding collective choices.'
            },
            {
              name: 'Citizenship and engagement',
              tag: 'transversal',
              tagClass: 'transversal',
              concrete:
                'Students understand the role of citizen mobilizations and new forms of shared governance, and develop their ability to participate in democratic debates on ecological issues.'
            }
          ],
          also: [
            'Identify stakeholders in multi-level governance',
            'Analyze power relations between political, economic, and social actors',
            'Understand international negotiation mechanisms (COP, SDGs)',
            'Connect environmental justice, social justice, and development',
            'Study transitions within a global North/South framework',
            'Analyze transition policy instruments'
          ]
        },
        {
          type: 'activities',
          intro: 'Concrete activities that you can integrate into an existing lesson.',
          apports: [
            {
              label: 'Understand governance',
              color: 'ct',
              acts: [
                {
                  title: 'Simulate an international climate negotiation (COP)',
                  desc: 'Students represent different countries in a climate negotiation. They apply mechanisms of cooperation and conflict and negotiate commitments according to their national interests.'
                },
                {
                  title: 'Analyze the multi-level governance of a climate policy',
                  desc: 'Examine how a climate policy (e.g. the Climate and Resilience Law) connects European, national, and local levels. Identify stakeholders, tensions, and room for maneuver.'
                }
              ]
            },
            {
              label: 'Analyze power relations',
              color: 'cp',
              acts: [
                {
                  title: 'Case study: conflicts over a natural resource',
                  desc: 'Analyze a real conflict over the use of a resource (water, energy, agricultural land, coastline): who are the stakeholders, what are their interests, and what regulatory mechanisms exist?'
                },
                {
                  title: 'Debate: North/South climate justice',
                  desc: '"Do developed countries have a particular responsibility for the global ecological transition?" Structured debate based on data concerning historical responsibilities and current vulnerabilities.'
                }
              ]
            },
            {
              label: 'Evaluate public policies',
              color: 'ck',
              acts: [
                {
                  title: 'Evaluate the effectiveness of a carbon tax',
                  desc: 'Using real cases (Swedish carbon tax, European carbon market), students analyze the conditions for success and failure of an economic transition instrument.'
                },
                {
                  title: 'Compare two transition policies in two countries',
                  desc: 'Comparative analysis of the same transition policy (building renovation, mobility, energy) in two different countries: contexts, instruments, results, and lessons to be learned.'
                }
              ]
            },
            {
              label: 'Analyze ecological democracy',
              color: 'cy',
              acts: [
                {
                  title: "Analyze the French Citizens' Climate Convention",
                  desc: "Students study the process and outcomes of the French Citizens' Climate Convention (CCC): how does deliberative democracy work? Which recommendations were adopted and why?"
                },
                {
                  title: 'Debate: are democracy and climate urgency compatible?',
                  desc: '"Are democratic timelines compatible with the urgency of the climate transition?" A philosophical and political debate around the tension between legitimacy and effectiveness.'
                }
              ]
            }
          ],
          feedback:
            'Good choice. This activity directly grounds political science tools in contemporary transition issues.'
        },
        {
          type: 'votretour',
          statement: 'Your turn.',
          sub: 'You have just discovered how political science fits into the ecological transition. Make the connection with your own teaching.',
          prompts: [
            {
              q: 'Which concept or case from your course has the most direct connection to an ecological governance issue?',
              placeholder:
                'E.g.: public policies, participatory democracy, international relations...'
            },
            {
              q: 'How do you imagine introducing a real environmental policy case into your next lesson?',
              placeholder:
                'E.g.: analyzing a recent climate policy decision, simulating an international negotiation...'
            }
          ],
          resource: {
            label: 'UVED Resource',
            title: 'Political Science and the Ecological and Sustainable Development Transition',
            href: 'https://www.uved.fr/fileadmin/user_upload/Documents/pdf/Fiches/Fiche_Science_politique_et_TEDS.pdf'
          }
        }
      ]
    }
  }
};
