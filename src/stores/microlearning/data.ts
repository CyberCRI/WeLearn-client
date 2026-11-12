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
              text: "Vous apprenez à vos étudiant·es à lire, analyser et visualiser des données. C'est exactement ainsi que des enjeux comme le changement climatique et la perte de biodiversité sont suivis. Par exemple, en analysant l'évolution des émissions de CO₂ en France sur plusieurs décennies.",
              color: 'ct'
            },
            {
              verb: 'Modéliser',
              text: "Simuler l'évolution du climat ou prédire la dynamique des écosystèmes repose sur des modèles mathématiques. Vous apprenez à vos étudiant·es à construire ce type de raisonnement. Par exemple, modéliser comment une ville évolue face à la hausse des températures et au risque d'inondation.",
              color: 'cp'
            },
            {
              verb: 'Optimiser',
              text: "Optimiser les ressources et l'énergie est au cœur de la transition. Vous enseignez les outils qui permettent de les résoudre. Par exemple, calculer comment distribuer l'électricité sur un réseau électrique intelligent (smart grid) pour minimiser les pertes.",
              color: 'ck'
            },
            {
              verb: 'Aider à la décision',
              text: "La transition nécessite des indicateurs pour guider les décisions politiques et économiques. Vous apprenez à vos étudiant·es à construire et interpréter ces outils. Par exemple, calculer l'empreinte carbone d'un produit sur l'ensemble de son cycle de vie.",
              color: 'cy'
            }
          ],
          closing:
            "Ces apports sont déjà intégrés dans votre discipline. Vous n'avez pas besoin d'ajouter de nouveaux contenus : il s'agit de rendre la connexion visible pour vos étudiant·es."
        },
        // STEP 2: COMPETENCES
        {
          type: 'competences',
          intro:
            'En étudiant la transition écologique à travers les mathématiques, vos étudiant·es développent des compétences qui dépassent le calcul. En voici les plus significatives.',
          featured: [
            {
              name: 'Pensée critique',
              tag: 'transversal',
              tagClass: 'transversal',
              concrete:
                "Vos étudiant·es apprennent à interroger les choix de paramètres dans un modèle climatique : pourquoi ces données et pas d'autres ? Quelles sont les limites et les incertitudes du modèle ?"
            },
            {
              name: 'Interdisciplinarité',
              tag: 'transversal',
              tagClass: 'transversal',
              concrete:
                "En croisant mathématiques et climatologie, vos étudiant·es comprennent pourquoi les marges d'incertitude du GIEC sont exprimées en probabilités et comment différentes disciplines collaborent pour produire des connaissances."
            },
            {
              name: 'Responsabilité et éthique',
              tag: 'transversal',
              tagClass: 'transversal',
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
        // STEP 3: ACTIVITIES
        {
          type: 'activities',
          intro: 'Des activités concrètes que vous pouvez intégrer dans une séance existante.',
          apports: [
            {
              label: 'Mesurer et représenter',
              color: 'ct',
              acts: [
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
              label: 'Modéliser',
              color: 'cp',
              acts: [
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
              label: 'Optimiser',
              color: 'ck',
              acts: [
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
              label: 'Aider à la décision',
              color: 'cy',
              acts: [
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
          feedback:
            "Bonne idée. Cette activité peut s'intégrer directement dans une séance existante sans modifier votre programme."
        },
        // STEP 4: A VOTRE TOUR
        {
          type: 'votretour',
          statement: 'À vous de jouer',
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
          resource: {
            label: 'Une ressource UVED pour aller plus loin',
            title: 'Mathématiques & Transition écologique',
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
              text: 'Elle décrypte comment les sociétés répondent aux défis environnementaux.',
              color: 'cp'
            },
            {
              verb: 'Éclairer',
              text: 'Elle tire des leçons des expériences passées pour guider les politiques actuelles.',
              color: 'ck'
            },
            {
              verb: 'Contextualiser',
              text: 'Elle met au jour les racines historiques des problèmes écologiques actuels.',
              color: 'cy'
            }
          ],
          closing:
            'Votre discipline offre une perspective systémique, critique et contextualisée sur la transition écologique.'
        },
        {
          type: 'competences',
          intro:
            "En étudiant la transition écologique à travers l'histoire, vos étudiant·es développent des compétences essentielles. En voici les plus significatives.",
          featured: [
            {
              name: 'Pensée critique',
              tag: 'transversal',
              tagClass: 'transversal',
              concrete:
                'Les étudiant·es apprennent à identifier et croiser plusieurs types de sources sur les crises environnementales passées.'
            },
            {
              name: 'Analyse systémique',
              tag: 'transversal',
              tagClass: 'transversal',
              concrete:
                'En croisant les apports de plusieurs disciplines pour analyser le passé, les étudiant·es comprennent les interactions complexes entre sociétés et environnement.'
            },
            {
              name: 'Conscience citoyenne',
              tag: 'transversal',
              tagClass: 'transversal',
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
                  desc: "Les étudiant·es examinent des archives de la révolution industrielle sous l'angle de ses impacts environnementaux."
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
              label: 'Éclairer',
              color: 'ck',
              acts: [
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
              label: 'Contextualiser',
              color: 'cy',
              acts: [
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
          feedback: "Parfait. Cette activité s'intègre directement dans une séance existante."
        },
        {
          type: 'votretour',
          statement: 'À vous de jouer',
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
          resource: {
            label: 'Une ressource UVED pour aller plus loin',
            title: 'Histoire & Transition écologique',
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
              text: "Proposer des instruments économiques comme la fiscalité ou les subventions pour réduire l'empreinte environnementale.",
              color: 'cp'
            },
            {
              verb: 'Modéliser',
              text: 'Construire des modèles alternatifs : économie circulaire, décroissance, économie écologique, limites planétaires.',
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
            "En étudiant la transition écologique à travers l'économie, vos étudiant·es développent des compétences analytiques et critiques essentielles. En voici les plus significatives.",
          featured: [
            {
              name: 'Analyse systémique',
              tag: 'disciplinaire',
              tagClass: 'disciplinary',
              concrete:
                "Les étudiant·es intègrent les limites planétaires dans l'analyse économique, dans une perspective interdisciplinaire qui va au-delà des modèles standard."
            },
            {
              name: 'Analyse prospective',
              tag: 'disciplinaire',
              tagClass: 'disciplinary',
              concrete:
                'Les étudiant·es décrivent les hypothèses économiques des différents scénarios de transition et anticipent les réactions des acteur·rices face aux politiques environnementales.'
            },
            {
              name: 'Capacité à agir',
              tag: 'transversal',
              tagClass: 'transversal',
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
                  desc: "Les étudiant·es utilisent les données du rapport Stern pour estimer le coût économique de l'inaction climatique et le comparer à celui des politiques d'atténuation."
                },
                {
                  title: "Analyser les externalités d'une industrie",
                  desc: "Identifier et quantifier les externalités négatives d'un secteur industriel (pollution, perte de biodiversité). Qui paie ces coûts et comment ?"
                }
              ]
            },
            {
              label: 'Réguler',
              color: 'cp',
              acts: [
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
              label: 'Modéliser',
              color: 'ck',
              acts: [
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
              label: 'Décider',
              color: 'cy',
              acts: [
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
          feedback:
            'Excellente idée. Cette activité connecte directement les outils économiques que vous enseignez à des enjeux concrets.'
        },
        {
          type: 'votretour',
          statement: 'À vous de jouer',
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
          resource: {
            label: 'Une ressource UVED pour aller plus loin',
            title: 'Économie & Transition écologique',
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
              text: "Le droit fixe les principes constitutionnels de protection de l'environnement : prévention, précaution, non-régression, pollueur-payeur.",
              color: 'ct'
            },
            {
              verb: 'Encadrer',
              text: 'Il organise les activités humaines pour limiter leur impact : urbanisme, industrie, agriculture, mines, transports.',
              color: 'cp'
            },
            {
              verb: 'Responsabiliser',
              text: "Il règle les litiges, sanctionne les atteintes à l'environnement et établit les régimes de responsabilité écologique.",
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
            'En étudiant la transition écologique à travers le droit, vos étudiant·es développent des compétences analytiques et citoyennes essentielles. En voici les plus significatives.',
          featured: [
            {
              name: 'Analyse critique',
              tag: 'disciplinaire',
              tagClass: 'disciplinary',
              concrete:
                "Les étudiant·es interprètent une loi sur l'énergie ou le climat et distinguent ce qui relève du droit national, européen et international."
            },
            {
              name: 'Analyse systémique',
              tag: 'transversal',
              tagClass: 'transversal',
              concrete:
                "Les étudiant·es reconnaissent le droit comme un outil de transformation sociale et comprennent les liens entre le droit de l'environnement et les autres domaines juridiques."
            },
            {
              name: 'Action collective',
              tag: 'transversal',
              tagClass: 'transversal',
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
        {
          type: 'activities',
          intro: 'Des activités concrètes que vous pouvez intégrer dans une séance existante.',
          apports: [
            {
              label: 'Définir',
              color: 'ct',
              acts: [
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
              label: 'Encadrer',
              color: 'cp',
              acts: [
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
              label: 'Responsabiliser',
              color: 'ck',
              acts: [
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
              label: 'Gouverner',
              color: 'cy',
              acts: [
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
          feedback:
            'Très bien. Cette activité ancre directement les mécanismes juridiques dans des situations réelles.'
        },
        {
          type: 'votretour',
          statement: 'À vous de jouer',
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
          resource: {
            label: 'Une ressource UVED pour aller plus loin',
            title: 'Droit & Transition écologique',
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
              verb: "Penser l'éthique",
              text: 'Elle examine les principes éthiques qui guident les choix individuels et collectifs, et éclaire la notion de responsabilité intergénérationnelle.',
              color: 'cp'
            },
            {
              verb: 'Critiquer',
              text: 'Elle remet en cause les dualismes nature/culture, humains/non-humains, et met au jour les valeurs qui sous-tendent notre relation à la nature.',
              color: 'ck'
            },
            {
              verb: 'Imaginer',
              text: "Elle définit les conditions d'une démocratie écologique et réfléchit au vivre-ensemble avec les autres vivants, humains et non-humains.",
              color: 'cy'
            }
          ],
          closing:
            'La philosophie prépare aux choix éthiques, politiques et existentiels que pose la transition écologique et contribue à former des citoyen·nes lucides et responsables.'
        },
        {
          type: 'competences',
          intro:
            "En étudiant la transition écologique à travers la philosophie, vos étudiant·es développent des compétences de pensée et d'argumentation essentielles. En voici les plus significatives.",
          featured: [
            {
              name: 'Problématisation',
              tag: 'disciplinaire',
              tagClass: 'disciplinary',
              concrete:
                'Les étudiant·es posent des questions fondamentales sur la responsabilité envers les générations futures, sur la valeur intrinsèque de la nature, sur ce que signifie le progrès.'
            },
            {
              name: 'Esprit critique',
              tag: 'transversal',
              tagClass: 'transversal',
              concrete:
                'Les étudiant·es distinguent les connaissances des opinions et remettent en question les évidences, notamment les grands récits du progrès et de la croissance.'
            },
            {
              name: 'Réflexivité citoyenne',
              tag: 'transversal',
              tagClass: 'transversal',
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
        {
          type: 'activities',
          intro: 'Des activités concrètes que vous pouvez intégrer dans une séance existante.',
          apports: [
            {
              label: 'Questionner',
              color: 'ct',
              acts: [
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
              label: "Penser l'éthique",
              color: 'cp',
              acts: [
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
              label: 'Critiquer',
              color: 'ck',
              acts: [
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
              label: 'Imaginer',
              color: 'cy',
              acts: [
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
          feedback:
            'Bien choisi. Cette activité ancre la philosophie dans des questions que vos étudiant·es vivent réellement.'
        },
        {
          type: 'votretour',
          statement: 'À vous de jouer',
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
          resource: {
            label: 'Une ressource UVED pour aller plus loin',
            title: 'Philosophie & Transition écologique',
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
              text: 'Analyser la perception et les représentations des risques environnementaux, et saisir notre rapport aux lieux que la transition transforme.',
              color: 'ct'
            },
            {
              verb: 'Réguler',
              text: "Comprendre et réguler les émotions associées aux changements environnementaux : éco-anxiété, solastalgie, sentiment de perte ou d'impuissance.",
              color: 'cp'
            },
            {
              verb: 'Mobiliser',
              text: "Identifier les freins psychologiques au changement et mobiliser les leviers pour favoriser l'action : normes sociales, nudges verts, processus identitaires.",
              color: 'ck'
            },
            {
              verb: 'Accompagner',
              text: "Soutenir la durabilité psychologique : aider les personnes à rester actives et constructives malgré l'angoisse environnementale.",
              color: 'cy'
            }
          ],
          closing:
            "La psychologie permet de passer des connaissances à l'action, en tenant compte de ce que les humains perçoivent et ressentent face aux enjeux écologiques."
        },
        {
          type: 'competences',
          intro:
            'En étudiant la transition écologique à travers la psychologie, vos étudiant·es développent des compétences analytiques et appliquées essentielles. En voici les plus significatives.',
          featured: [
            {
              name: 'Pensée complexe et systémique',
              tag: 'transversal',
              tagClass: 'transversal',
              concrete:
                "Les étudiant·es identifient les liens entre émotions, comportements pro-environnementaux et politiques de durabilité, et saisissent la complexité des représentations liées à l'environnement."
            },
            {
              name: 'Analyse critique',
              tag: 'transversal',
              tagClass: 'transversal',
              concrete:
                'Les étudiant·es comprennent ce qui sous-tend les discours et les comportements environnementaux et identifient leur propre posture par rapport à ces enjeux.'
            },
            {
              name: 'Capacité à transformer',
              tag: 'transversal',
              tagClass: 'transversal',
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
                  desc: 'Les étudiant·es examinent, sous un angle psychosocial, comment différentes populations perçoivent le risque climatique, en identifiant les biais cognitifs et culturels.'
                },
                {
                  title: "Comparer l'éco-anxiété selon les contextes culturels",
                  desc: "Comparer la perception de l'éco-anxiété dans différents contextes culturels et régionaux. Les étudiant·es analysent des témoignages et appliquent des cadres psychologiques."
                }
              ]
            },
            {
              label: 'Réguler',
              color: 'cp',
              acts: [
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
              label: 'Mobiliser',
              color: 'ck',
              acts: [
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
              label: 'Accompagner',
              color: 'cy',
              acts: [
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
          feedback:
            'Bien vu. Cette activité ancre directement la psychologie dans des situations que vos étudiant·es vivent ou observent.'
        },
        {
          type: 'votretour',
          statement: 'À vous de jouer',
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
          resource: {
            label: 'Une ressource UVED pour aller plus loin',
            title: 'Psychologie & Transition écologique',
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
              text: "Vous apprenez à vos étudiant·es à lire les dynamiques spatiales. C'est exactement ce dont on a besoin pour cartographier les vulnérabilités climatiques, les flux de pollution et les inégalités environnementales à différentes échelles.",
              color: 'ct'
            },
            {
              verb: 'Comprendre les territoires',
              text: 'La géographie analyse les interactions entre sociétés et environnements. Par exemple, comprendre comment une ville côtière se transforme face à la montée des eaux, ou comment un territoire rural gère la transition énergétique.',
              color: 'cp'
            },
            {
              verb: 'Décrypter les politiques',
              text: "Vous enseignez à vos étudiant·es à analyser les acteur·rices et les décisions publiques. C'est ce qu'exige la transition : comprendre qui décide, à quelle échelle, et avec quels effets sur les territoires.",
              color: 'ck'
            },
            {
              verb: 'Penser les inégalités',
              text: 'La géographie explore les inégalités socio-spatiales. La crise écologique les amplifie : qui est le plus vulnérable, qui a accès aux ressources, qui subit les effets du changement climatique ?',
              color: 'cy'
            }
          ],
          closing:
            'Sans ancrage géographique et sans prise en compte des spécificités des espaces et des sociétés, la transition écologique serait inopérante. Votre discipline est indispensable.'
        },
        {
          type: 'competences',
          intro:
            'En étudiant la transition écologique à travers la géographie, vos étudiant·es développent des compétences analytiques et citoyennes essentielles. En voici les plus significatives.',
          featured: [
            {
              name: 'Lecture et production de cartes',
              tag: 'disciplinaire',
              tagClass: 'disciplinary',
              concrete:
                "Les étudiant·es réalisent une carte des vulnérabilités climatiques d'un territoire, en identifiant les zones à risque et les populations exposées à des événements extrêmes."
            },
            {
              name: 'Esprit critique',
              tag: 'transversal',
              tagClass: 'transversal',
              concrete:
                "Les étudiant·es analysent des enjeux complexes comme les conflits d'usage autour de l'eau ou les tensions entre développement touristique et préservation des littoraux."
            },
            {
              name: 'Pensée multiscalaire',
              tag: 'disciplinaire',
              tagClass: 'disciplinary',
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
                  desc: "Les étudiant·es réalisent une carte des zones à risque (inondation, sécheresse, canicule) à l'échelle d'un territoire local ou régional, en croisant données climatiques et données sociales."
                },
                {
                  title: 'Comparer les empreintes écologiques de différents pays',
                  desc: 'Mettre en regard les empreintes écologiques nationales : qui consomme le plus, qui subit le plus ? Relier ces données aux inégalités de développement.'
                }
              ]
            },
            {
              label: 'Comprendre les territoires',
              color: 'cp',
              acts: [
                {
                  title: "Étudier un projet d'écoquartier ou de ville en transition",
                  desc: 'Les étudiant·es analysent un projet urbain durable réel (par exemple, le quartier de la Confluence à Lyon ou Bottière-Chénaie à Nantes) : acteur·rices, enjeux, compromis et limites.'
                },
                {
                  title:
                    "Analyser les impacts du tourisme de montagne face au recul de l'enneigement",
                  desc: "Étudier un territoire de montagne (Alpes, Pyrénées) confronté au recul de l'enneigement. Quelles reconversions ? Quelles résistances ? Quelles parties prenantes ?"
                }
              ]
            },
            {
              label: 'Décrypter les politiques',
              color: 'ck',
              acts: [
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
              label: 'Penser les inégalités',
              color: 'cy',
              acts: [
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
          feedback:
            'Bien choisi. Cette activité ancre directement les outils géographiques dans des enjeux territoriaux concrets.'
        },
        {
          type: 'votretour',
          statement: 'À vous de jouer',
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
          resource: {
            label: 'Une ressource UVED pour aller plus loin',
            title: 'Géographie & Transition écologique',
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
              text: 'Vous apprenez à vos étudiant·es à évaluer les effets des expositions environnementales sur la santé. Par exemple, analyser la surmortalité liée aux canicules ou les maladies respiratoires liées à la pollution atmosphérique.',
              color: 'ct'
            },
            {
              verb: 'Analyser les politiques',
              text: "La santé permet d'évaluer les co-bénéfices des politiques climatiques : la baisse de la consommation de viande améliore la santé tout en réduisant les émissions. Vos étudiant·es apprennent à raisonner en systèmes.",
              color: 'cp'
            },
            {
              verb: 'Renforcer la résilience',
              text: "Passer d'une logique de réparation à une logique de prévention : c'est l'un des grands enjeux de la santé environnementale, et un raisonnement que vos étudiant·es construisent dès leur formation.",
              color: 'ck'
            },
            {
              verb: "Réduire l'empreinte",
              text: 'Le secteur de la santé contribue lui-même aux émissions. Vos étudiant·es peuvent concevoir des pratiques médicales plus sobres : recyclage des réactifs, éco-conception des soins, sobriété énergétique.',
              color: 'cy'
            }
          ],
          closing:
            "La santé est un langage commun entre disciplines et un point d'entrée concret pour parler de l'interdépendance entre les humains et leur environnement."
        },
        {
          type: 'competences',
          intro:
            'En étudiant la transition écologique à travers les sciences de la santé, vos étudiant·es développent des compétences cliniques, systémiques et citoyennes essentielles. En voici les plus significatives.',
          featured: [
            {
              name: 'Approche One Health',
              tag: 'disciplinaire',
              tagClass: 'disciplinary',
              concrete:
                "Les étudiant·es apprennent à penser la santé humaine comme liée à celle des écosystèmes et des autres vivants. Par exemple, analyser l'émergence de maladies vectorielles liées au réchauffement climatique."
            },
            {
              name: 'Interdisciplinarité',
              tag: 'transversal',
              tagClass: 'transversal',
              concrete:
                "Les étudiant·es croisent médecine, écologie, psychologie et sociologie pour analyser les déterminants environnementaux de la santé d'une population dans un territoire donné."
            },
            {
              name: 'Esprit critique',
              tag: 'transversal',
              tagClass: 'transversal',
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
        {
          type: 'activities',
          intro: 'Des activités concrètes que vous pouvez intégrer dans une séance existante.',
          apports: [
            {
              label: 'Identifier les risques',
              color: 'ct',
              acts: [
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
              label: 'Analyser les politiques',
              color: 'cp',
              acts: [
                {
                  title:
                    "Évaluer les bénéfices et les risques sanitaires d'une politique climatique",
                  desc: "Les étudiant·es analysent une politique de transition (mobilités douces, réduction de la consommation de viande, végétalisation urbaine) sous l'angle de ses bénéfices et de ses risques sanitaires."
                },
                {
                  title: 'Analyser les stratégies de santé environnementale',
                  desc: 'Décrypter les stratégies nationales et internationales (PNSE, OMS, One Health) : quels objectifs, quels outils, quelle efficacité dans un contexte de transition écologique ?'
                }
              ]
            },
            {
              label: 'Renforcer la résilience',
              color: 'ck',
              acts: [
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
              label: "Réduire l'empreinte",
              color: 'cy',
              acts: [
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
          feedback:
            'Très bien. Cette activité connecte directement les compétences cliniques à des enjeux environnementaux concrets.'
        },
        {
          type: 'votretour',
          statement: 'À vous de jouer',
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
          resource: {
            label: 'Une ressource UVED pour aller plus loin',
            title: 'Santé & Transition écologique',
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
              text: 'Les activités physiques et sportives dépendent fortement des conditions environnementales. Vos étudiant·es apprennent à analyser les adaptations physiologiques aux fortes chaleurs, aux pollutions et aux événements climatiques extrêmes.',
              color: 'ct'
            },
            {
              verb: 'Accroître la résilience',
              text: 'Une meilleure condition physique peut améliorer la tolérance à certaines contraintes environnementales. Vos étudiant·es apprennent à concevoir des programmes adaptés aux contraintes climatiques actuelles.',
              color: 'cp'
            },
            {
              verb: "Atténuer l'empreinte",
              text: 'Le secteur sportif repose largement sur des infrastructures, des équipements et des mobilités. Vos étudiant·es peuvent apprendre à concevoir des pratiques sportives plus sobres et responsables.',
              color: 'ck'
            },
            {
              verb: 'Éduquer à la santé globale',
              text: "Les STAPS diffusent des valeurs de respect, de coopération et d'engagement. Elles permettent de penser les liens entre santé humaine et santé environnementale dans une perspective de durabilité.",
              color: 'cy'
            }
          ],
          closing:
            "Les STAPS forment des professionnel·les capables d'adapter les pratiques sportives aux contraintes écologiques, d'organiser des événements plus sobres et d'accompagner les transitions du secteur sportif."
        },
        {
          type: 'competences',
          intro:
            'En étudiant la transition écologique à travers les STAPS, vos étudiant·es développent des compétences disciplinaires et transversales essentielles. En voici les plus significatives.',
          featured: [
            {
              name: 'Pensée systémique',
              tag: 'transversal',
              tagClass: 'transversal',
              concrete:
                'Les étudiant·es décrivent les interactions entre santé, climat, infrastructures sportives et économie du sport. Par exemple, analyser comment la montée des températures affecte les pratiques et les performances.'
            },
            {
              name: 'Analyse critique',
              tag: 'disciplinaire',
              tagClass: 'disciplinary',
              concrete:
                "Les étudiant·es analysent un objet sportif à l'ère des limites planétaires, en renseignant et en interprétant les indicateurs de performance environnementale d'une infrastructure ou d'un événement sportif."
            },
            {
              name: 'Capacité à concevoir',
              tag: 'disciplinaire',
              tagClass: 'disciplinary',
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
        {
          type: 'activities',
          intro: 'Des activités concrètes que vous pouvez intégrer dans une séance existante.',
          apports: [
            {
              label: 'Comprendre les effets du climat',
              color: 'ct',
              acts: [
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
              label: 'Accroître la résilience',
              color: 'cp',
              acts: [
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
              label: "Atténuer l'empreinte",
              color: 'ck',
              acts: [
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
              label: 'Éduquer à la santé globale',
              color: 'cy',
              acts: [
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
          feedback:
            'Bien vu. Cette activité connecte directement les compétences STAPS à des défis environnementaux concrets.'
        },
        {
          type: 'votretour',
          statement: 'À vous de jouer',
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
          resource: {
            label: 'Une ressource UVED pour aller plus loin',
            title: 'STAPS & Transition écologique',
            href: 'https://www.uved.fr/fileadmin/user_upload/Documents/pdf/Fiches/Fiche_STAPS_et_TEDS.pdf'
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
              text: "Vous apprenez à vos étudiant·es à lire les œuvres et les discours. C'est exactement ce dont on a besoin pour comprendre les imaginaires qui ont conduit à la surexploitation du monde, ou pour inventer d'autres façons d'habiter la Terre.",
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
              verb: 'Former des citoyen·nes critiques',
              text: "Vos étudiant·es apprennent à analyser les discours publicitaires, médiatiques et politiques sur l'écologie et développent une pensée personnelle étayée sur ces questions.",
              color: 'cy'
            }
          ],
          closing:
            "Les lettres forment des citoyen·nes capables de penser, de dire et de raconter autrement le monde. C'est une condition essentielle pour transformer nos modes de vie."
        },
        {
          type: 'competences',
          intro:
            'En étudiant la transition écologique à travers les lettres, vos étudiant·es développent des compétences littéraires, critiques et citoyennes essentielles. En voici les plus significatives.',
          featured: [
            {
              name: 'Lecture critique et contextualisée',
              tag: 'disciplinaire',
              tagClass: 'disciplinary',
              concrete:
                "Les étudiant·es analysent les origines historiques et sociales d'une œuvre liée à la nature, et clarifient les valeurs et idéologies rattachées aux récits sur l'environnement."
            },
            {
              name: 'Pensée critique',
              tag: 'transversal',
              tagClass: 'transversal',
              concrete:
                "Les étudiant·es analysent les discours publicitaires et politiques sur l'écologie, et distinguent ce qui relève de la rhétorique du greenwashing de ce qui est scientifiquement fondé."
            },
            {
              name: 'Expression et créativité',
              tag: 'transversal',
              tagClass: 'transversal',
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
                  desc: "Les étudiant·es lisent des extraits d'œuvres (de la littérature naturaliste au roman d'anticipation climatique) pour analyser l'évolution des imaginaires du progrès, du vivant et de la planète."
                },
                {
                  title: "Décrypter les discours sur l'écologie",
                  desc: "À partir d'exemples publicitaires, politiques ou médiatiques, les étudiant·es identifient les stratégies discursives liées à la transition, y compris celles qui relèvent du greenwashing."
                }
              ]
            },
            {
              label: 'Donner du sens',
              color: 'cp',
              acts: [
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
              label: 'Imaginer des futurs',
              color: 'ck',
              acts: [
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
              label: 'Former des citoyen·nes critiques',
              color: 'cy',
              acts: [
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
          feedback:
            'Bien choisi. Cette activité ancre les outils littéraires dans des questions que vos étudiant·es vivent et lisent réellement.'
        },
        {
          type: 'votretour',
          statement: 'À vous de jouer',
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
          resource: {
            label: 'Une ressource UVED pour aller plus loin',
            title: 'Lettres & Transition écologique',
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
              text: "L'écologie analyse les interactions entre les êtres vivants et leur milieu. Vous apprenez à vos étudiant·es à comprendre la structure et le fonctionnement des écosystèmes, qu'ils soient peu ou fortement anthropisés.",
              color: 'ct'
            },
            {
              verb: 'Évaluer et prédire',
              text: "Vos étudiant·es apprennent à évaluer la résilience ou la vulnérabilité des milieux face aux pressions humaines, à identifier les points de bascule et à modéliser l'évolution des écosystèmes.",
              color: 'cp'
            },
            {
              verb: 'Proposer des solutions',
              text: "L'écologie propose des leviers pour la transformation : agroécologie, écologie urbaine, solutions fondées sur la nature, bio-inspiration. Vos étudiant·es apprennent à concevoir des plans d'action concrets.",
              color: 'ck'
            },
            {
              verb: 'Éclairer les décisions',
              text: 'Les connaissances écologiques sont indispensables pour éclairer les politiques publiques. Vos étudiant·es apprennent à communiquer des données scientifiques complexes à des décideur·euses et à des non-spécialistes.',
              color: 'cy'
            }
          ],
          closing:
            "L'écologie fournit les connaissances essentielles pour comprendre les crises environnementales actuelles. Par son exploration du vivant, elle est source de progrès et d'innovations pour la transition."
        },
        {
          type: 'competences',
          intro:
            "En étudiant la transition écologique à travers l'écologie scientifique, vos étudiant·es développent des compétences essentielles d'analyse et d'action. En voici les plus significatives.",
          featured: [
            {
              name: 'Analyse systémique',
              tag: 'disciplinaire',
              tagClass: 'disciplinary',
              concrete:
                "Les étudiant·es décrivent un écosystème sous l'angle de ses réseaux d'interaction, identifient les réactions en cascade lors d'une perturbation, et expliquent les notions de résilience et d'irréversibilité."
            },
            {
              name: 'Analyse critique',
              tag: 'disciplinaire',
              tagClass: 'disciplinary',
              concrete:
                "Les étudiant·es identifient les facteurs naturels et anthropiques responsables de la dynamique des écosystèmes, et mesurent l'intérêt et les limites des outils de collecte et de modélisation."
            },
            {
              name: 'Capacité à agir',
              tag: 'transversal',
              tagClass: 'transversal',
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
        {
          type: 'activities',
          intro: 'Des activités concrètes que vous pouvez intégrer dans une séance existante.',
          apports: [
            {
              label: 'Décrire et comprendre',
              color: 'ct',
              acts: [
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
              label: 'Évaluer et prédire',
              color: 'cp',
              acts: [
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
              label: 'Proposer des solutions',
              color: 'ck',
              acts: [
                {
                  title:
                    "Définir les lignes directrices d'un programme d'action pour un territoire",
                  desc: "Pour un territoire donné subissant de fortes pressions (urbanisation, pollution, sécheresse), les étudiant·es définissent un programme d'action et décrivent les compromis nécessaires."
                },
                {
                  title: 'Concevoir une solution fondée sur la nature',
                  desc: 'Les étudiant·es identifient un problème environnemental local (îlot de chaleur urbain, ruissellement, perte de pollinisateurs) et conçoivent une solution inspirée du fonctionnement des écosystèmes.'
                }
              ]
            },
            {
              label: 'Éclairer les décisions',
              color: 'cy',
              acts: [
                {
                  title: 'Jeu de rôle : une controverse de gestion du territoire',
                  desc: "Les étudiant·es incarnent les parties prenantes d'une question controversée de gestion du territoire (réintroduction du loup, artificialisation des terres, gestion des zones humides) et débattent en s'appuyant sur des données scientifiques."
                },
                {
                  title:
                    'Analyser la prise en compte de la biodiversité dans un scénario sectoriel',
                  desc: 'Les étudiant·es analysent comment la biodiversité est intégrée (ou non) dans un scénario agricole, énergétique ou urbanistique réel, et proposent des améliorations.'
                }
              ]
            }
          ],
          feedback:
            'Excellent choix. Cette activité connecte directement les concepts écologiques à des situations réelles de terrain.'
        },
        {
          type: 'votretour',
          statement: 'À vous de jouer',
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
          resource: {
            label: 'Une ressource UVED pour aller plus loin',
            title: 'Écologie & Transition écologique',
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
              text: "L'art suscite des émotions et fait mieux ressentir la beauté et la fragilité de la nature, ou la violence des transformations de notre environnement. Vos étudiant·es apprennent à développer une conscience écologique par l'expérience esthétique.",
              color: 'ct'
            },
            {
              verb: 'Créer de nouveaux récits',
              text: "L'art invente des histoires, des images et des symboles qui donnent envie d'agir et ouvrent le champ des possibles. Vos étudiant·es apprennent à produire des œuvres qui transforment les imaginaires collectifs.",
              color: 'cp'
            },
            {
              verb: 'Expérimenter autrement',
              text: "L'art explore d'autres façons d'habiter un lieu, de réutiliser des matériaux, de travailler avec le vivant. Vos étudiant·es peuvent interroger leur rapport aux objets, aux déchets et à la technique.",
              color: 'ck'
            },
            {
              verb: 'Favoriser la participation',
              text: "L'art réunit et fait réagir les citoyen·nes par des projets collectifs (fresques, performances, installations). Vos étudiant·es apprennent à créer des outils de mobilisation et de dialogue autour de la transition.",
              color: 'cy'
            }
          ],
          closing:
            "Susciter des ressentis, transformer les imaginaires, questionner nos modes de vie, rassembler autour de récits et d'expériences : les apports de l'art à la transition écologique sont multiples et irremplaçables."
        },
        {
          type: 'competences',
          intro:
            'En étudiant la transition écologique à travers les arts, vos étudiant·es développent des compétences créatives, critiques et citoyennes essentielles. En voici les plus significatives.',
          featured: [
            {
              name: 'Analyse critique des œuvres',
              tag: 'disciplinaire',
              tagClass: 'disciplinary',
              concrete:
                "Les étudiant·es comprennent comment les artistes traitent des enjeux écologiques dans différents contextes culturels, et décryptent l'évolution des sensibilités artistiques face à la nature et à l'artificialisation."
            },
            {
              name: 'Créativité et innovation',
              tag: 'disciplinaire',
              tagClass: 'disciplinary',
              concrete:
                'Les étudiant·es explorent de nouveaux matériaux (recyclés, naturels, durables) et expérimentent des formes artistiques sobres ou collaboratives en lien avec les enjeux de la transition.'
            },
            {
              name: 'Pensée critique et éthique',
              tag: 'transversal',
              tagClass: 'transversal',
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
        {
          type: 'activities',
          intro: 'Des activités concrètes que vous pouvez intégrer dans une séance existante.',
          apports: [
            {
              label: 'Changer les regards',
              color: 'ct',
              acts: [
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
              label: 'Créer de nouveaux récits',
              color: 'cp',
              acts: [
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
              label: 'Expérimenter autrement',
              color: 'ck',
              acts: [
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
              label: 'Favoriser la participation',
              color: 'cy',
              acts: [
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
          feedback:
            'Excellent. Cette activité croise création artistique et conscience écologique de manière directement applicable.'
        },
        {
          type: 'votretour',
          statement: 'À vous de jouer',
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
          resource: {
            label: 'Une ressource UVED pour aller plus loin',
            title: 'Art & Transition écologique',
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
              text: 'Qui décide, à quel niveau et comment ? Vous apprenez à vos étudiant·es à identifier les différents échelons de gouvernance (local, national, international) et les acteur·rices impliqué·es dans les décisions de transition.',
              color: 'ct'
            },
            {
              verb: 'Analyser les rapports de pouvoir',
              text: "La transition révèle des conflits d'intérêts entre les sphères économique, politique et sociale. Vos étudiant·es apprennent à décrypter les arbitrages autour des ressources naturelles et de la justice environnementale.",
              color: 'cp'
            },
            {
              verb: 'Évaluer les politiques publiques',
              text: "Concevoir, évaluer et comparer des politiques de transition : instruments utilisés (taxes, réglementations, subventions), ce qui fonctionne ou échoue selon les contextes. C'est au cœur de votre discipline.",
              color: 'ck'
            },
            {
              verb: 'Analyser la démocratie écologique',
              text: 'Distinguer et analyser les formes de démocratie mobilisées pour la transition : participative, délibérative. Comprendre le rôle des mobilisations citoyennes et des nouvelles pratiques de gouvernance partagée.',
              color: 'cy'
            }
          ],
          closing:
            "La transition écologique est avant tout un enjeu politique, car elle touche à la manière dont les sociétés s'organisent, décident, arbitrent et se transforment. Votre discipline est au cœur de ces questions."
        },
        {
          type: 'competences',
          intro:
            'En étudiant la transition écologique à travers la science politique, vos étudiant·es développent des compétences analytiques et citoyennes essentielles. En voici les plus significatives.',
          featured: [
            {
              name: 'Analyse des politiques publiques',
              tag: 'disciplinaire',
              tagClass: 'disciplinary',
              concrete:
                'Les étudiant·es conçoivent et évaluent des politiques de transition, comparent des instruments (taxes carbone, marchés de droits à polluer, réglementations) et identifient ce qui fonctionne selon les contextes.'
            },
            {
              name: 'Analyse critique des récits politiques',
              tag: 'disciplinaire',
              tagClass: 'disciplinary',
              concrete:
                'Les étudiant·es identifient les récits, croyances et idéologies mobilisés dans les prises de décision politiques sur la transition (croissance verte ou décroissance) et analysent les visions qui orientent les choix collectifs.'
            },
            {
              name: 'Citoyenneté et engagement',
              tag: 'transversal',
              tagClass: 'transversal',
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
                  desc: 'Les étudiant·es représentent différents États dans une négociation climatique. Ils et elles expérimentent les mécanismes de coopération et de conflit, et négocient des engagements selon leurs intérêts nationaux.'
                },
                {
                  title: "Analyser la gouvernance multi-niveaux d'une politique climatique",
                  desc: 'Décrypter comment une politique climatique (par exemple, la loi Climat et résilience) articule les niveaux européen, national et local. Identifier les acteur·rices, les tensions et les marges de manœuvre.'
                }
              ]
            },
            {
              label: 'Analyser les rapports de pouvoir',
              color: 'cp',
              acts: [
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
              label: 'Évaluer les politiques publiques',
              color: 'ck',
              acts: [
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
              label: 'Analyser la démocratie écologique',
              color: 'cy',
              acts: [
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
          feedback:
            'Bien choisi. Cette activité ancre directement les outils de la science politique dans les enjeux de transition contemporains.'
        },
        {
          type: 'votretour',
          statement: 'À vous de jouer',
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
          resource: {
            label: 'Une ressource UVED pour aller plus loin',
            title: 'Science politique & Transition écologique',
            href: 'https://www.uved.fr/fileadmin/user_upload/Documents/pdf/Fiches/Fiche_Science_politique_et_TEDS.pdf'
          }
        }
      ]
    },
    physics: {
      steps: [
        {
          type: 'flip',
          statement: 'La physique est au cœur de la transition écologique.',
          hint: 'Cliquez sur chaque carte pour découvrir le lien.',
          cards: [
            {
              verb: 'Comprendre le système Terre',
              text: "Vous apprenez à vos étudiant·es le bilan radiatif, l'effet de serre, les circulations atmosphérique et océanique. C'est le socle pour comprendre le changement climatique, identifier des points de bascule et prévoir les événements extrêmes.",
              color: 'ct'
            },
            {
              verb: 'Développer des énergies soutenables',
              text: "Capter le vent, le rayonnement solaire ou la géothermie, stocker l'énergie, optimiser les réseaux électriques (smart grids) : ce sont des problèmes de physique que vos étudiant·es apprennent à résoudre.",
              color: 'cp'
            },
            {
              verb: 'Concevoir des matériaux durables',
              text: 'Matériaux adaptés aux nouvelles contraintes climatiques, procédés de recyclage, alternatives aux matériaux critiques ou épuisables : la physique des matériaux est un levier majeur de la transition.',
              color: 'ck'
            },
            {
              verb: 'Poser un regard critique',
              text: "Par les ordres de grandeur et les modèles, la physique permet d'évaluer les limites de certaines solutions technologiques et d'argumenter pour des approches de sobriété.",
              color: 'cy'
            }
          ],
          closing:
            "La physique éclaire le fonctionnement de la planète, outille les solutions bas carbone et donne les moyens d'en mesurer les limites. Ces contributions sont déjà dans votre discipline : il s'agit de les rendre visibles."
        },
        {
          type: 'competences',
          intro:
            'En étudiant la transition écologique à travers la physique, vos étudiant·es développent des compétences qui dépassent le calcul. En voici les plus significatives.',
          featured: [
            {
              name: 'Pensée systémique',
              tag: 'transversal',
              tagClass: 'transversal',
              concrete:
                "Les étudiant·es articulent climat, énergie, ressources et technologies, identifient les boucles de rétroaction des systèmes biophysiques et considèrent le cycle de vie complet d'un matériau ou d'un procédé."
            },
            {
              name: 'Analyse critique',
              tag: 'transversal',
              tagClass: 'transversal',
              concrete:
                "Les étudiant·es produisent une analyse bénéfices/risques d'une solution technologique, questionnent les hypothèses d'un modèle, évaluent les incertitudes et articulent efficacité et sobriété."
            },
            {
              name: 'Responsabilité et engagement scientifique',
              tag: 'transversal',
              tagClass: 'transversal',
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
        {
          type: 'activities',
          intro: 'Des activités concrètes que vous pouvez intégrer dans une séance existante.',
          apports: [
            {
              label: 'Comprendre le système Terre',
              color: 'ct',
              acts: [
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
              label: 'Développer des énergies soutenables',
              color: 'cp',
              acts: [
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
              label: 'Concevoir des matériaux durables',
              color: 'ck',
              acts: [
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
              label: 'Poser un regard critique',
              color: 'cy',
              acts: [
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
          feedback:
            'Très bien. Cette activité ancre directement les outils de la physique dans des enjeux concrets de transition.'
        },
        {
          type: 'votretour',
          statement: 'À vous de jouer',
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
          resource: {
            label: 'Une ressource UVED pour aller plus loin',
            title: 'Physique & Transition écologique',
            href: 'https://www.uved.fr/fileadmin/user_upload/Documents/pdf/Fiches/Fiche_Physique_et_TEDS.pdf'
          }
        }
      ]
    },
    anthropology: {
      steps: [
        {
          type: 'flip',
          statement: "L'anthropologie éclaire la dimension humaine de la transition écologique.",
          hint: 'Cliquez sur chaque carte pour découvrir le lien.',
          cards: [
            {
              verb: 'Révéler la diversité des rapports à la nature',
              text: "Vous apprenez à vos étudiant·es que les relations entre humains et non-humains varient selon les contextes culturels, géographiques et historiques. Il existe d'autres manières d'habiter le monde et d'autres valeurs attribuées à la nature.",
              color: 'ct'
            },
            {
              verb: 'Comprendre les savoirs locaux et autochtones',
              text: "Plantes, animaux, rythmes de la nature : vos étudiant·es découvrent comment ces savoirs sont produits et transmis, et ce qu'ils peuvent apporter, par exemple en agroécologie ou en préservation des écosystèmes.",
              color: 'cp'
            },
            {
              verb: 'Décrire les modes de vie',
              text: "Organisation sociale, gouvernance, techniques, savoirs sur l'environnement : vos étudiant·es apprennent à observer comment les sociétés vivent avec leur milieu et comment elles évoluent face au changement global.",
              color: 'ck'
            },
            {
              verb: "Ouvrir d'autres perspectives",
              text: "L'anthropologie invite à prendre du recul sur la croissance, le progrès ou le développement, et légitime d'autres horizons comme la sobriété ou le « bien vivre ».",
              color: 'cy'
            }
          ],
          closing:
            "L'anthropologie permet de définir ou redéfinir des politiques et des modes d'action au plus près des personnes, en vue d'une transition écologique juste et efficace."
        },
        {
          type: 'competences',
          intro:
            "En étudiant la transition écologique à travers l'anthropologie, vos étudiant·es développent des compétences d'analyse, de dialogue et de réflexion éthique essentielles. En voici les plus significatives.",
          featured: [
            {
              name: 'Analyse des représentations de la nature',
              tag: 'disciplinaire',
              tagClass: 'disciplinary',
              concrete:
                'Les étudiant·es décrivent la diversité des rapports au vivant, interprètent les imaginaires, croyances et systèmes de valeurs associés à la nature et analysent leur influence sur les modes de vie.'
            },
            {
              name: 'Accompagnement du changement et dialogue',
              tag: 'transversal',
              tagClass: 'transversal',
              concrete:
                "Les étudiant·es identifient les freins et leviers sociaux à l'appropriation des enjeux écologiques, traduisent des savoirs complexes pour différents publics et intègrent les savoirs locaux dans les prises de décision."
            },
            {
              name: 'Conduite éthique et responsable du terrain',
              tag: 'disciplinaire',
              tagClass: 'disciplinary',
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
        {
          type: 'activities',
          intro: 'Des activités concrètes que vous pouvez intégrer dans une séance existante.',
          apports: [
            {
              label: 'Révéler la diversité des rapports à la nature',
              color: 'ct',
              acts: [
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
              label: 'Comprendre les savoirs locaux et autochtones',
              color: 'cp',
              acts: [
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
              label: 'Décrire les modes de vie',
              color: 'ck',
              acts: [
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
              label: "Ouvrir d'autres perspectives",
              color: 'cy',
              acts: [
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
          feedback:
            "Bien choisi. Cette activité ancre directement les outils de l'anthropologie dans des situations concrètes de transition."
        },
        {
          type: 'votretour',
          statement: 'À vous de jouer',
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
          resource: {
            label: 'Une ressource UVED pour aller plus loin',
            title: 'Anthropologie & Transition écologique',
            href: 'https://www.uved.fr/fileadmin/user_upload/Documents/pdf/Fiches/Fiche_Anthropologie_et_TEDS.pdf'
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
          statement: 'You are already teaching the tools of the ecological transition.',
          hint: 'Click on each card to discover the connection.',
          cards: [
            {
              verb: 'Measuring and representing',
              text: "You teach students to read, analyze, and visualize data, which is exactly how we track issues like climate change and biodiversity loss. For example, analyzing how France's CO₂ emissions have changed over several decades.",
              color: 'ct'
            },
            {
              verb: 'Modeling',
              text: 'Simulating climate change or predicting how ecosystems behave relies on mathematical models, and you teach students to reason this way. For example, modeling how a city adapts to rising temperatures and flood risk.',
              color: 'cp'
            },
            {
              verb: 'Optimizing',
              text: 'Using resources and energy efficiently is central to sustainability, and you teach the tools for solving these problems. For example, working out how to distribute electricity across a smart grid to minimize losses.',
              color: 'ck'
            },
            {
              verb: 'Supporting decision-making',
              text: "Sustainability policy depends on indicators to guide political and economic decisions, and you teach students to build and interpret them. For example, calculating a product's carbon footprint across its entire life cycle.",
              color: 'cy'
            }
          ],
          closing:
            "All of this is already part of your discipline. You don't need to add new content; you just need to make the connection visible to your students."
        },

        // STEP 2: SKILLS
        {
          type: 'competences',
          intro:
            'Studying sustainability through mathematics helps your students build skills that go well beyond calculation. Here are the most significant ones.',
          featured: [
            {
              name: 'Critical thinking',
              tag: 'transversal',
              tagClass: 'transversal',
              concrete:
                "Students learn to question the parameters behind a climate model: why this data and not other data? What are the model's limits and uncertainties?"
            },
            {
              name: 'Interdisciplinary thinking',
              tag: 'transversal',
              tagClass: 'transversal',
              concrete:
                'By combining mathematics and climate science, students see why IPCC uncertainty ranges are expressed as probabilities and how different disciplines work together to build knowledge.'
            },
            {
              name: 'Responsibility and ethics',
              tag: 'transversal',
              tagClass: 'transversal',
              concrete:
                'Students examine what a model can and cannot tell us, and where the line falls between what is effective, what is likely, and what is desirable in climate policy.'
            }
          ],
          also: [
            'Modeling social-ecological systems',
            'Carrying out statistical and probabilistic analysis',
            'Solving differential equations',
            'Turning real-world problems into equations',
            'Assessing data reliability',
            'Reasoning through scenarios',
            'Communicating complex results'
          ]
        },

        // STEP 3: ACTIVITIES
        {
          type: 'activities',
          intro: 'Here are practical activities you can add to a class you already teach.',
          apports: [
            {
              label: 'Measuring and representing',
              color: 'ct',
              acts: [
                {
                  title: 'Analyzing local temperatures',
                  desc: 'Students work with real historical temperature data to identify trends and key variables, using statistical tools they already know.'
                },
                {
                  title: 'Critiquing a climate data visualization',
                  desc: 'Give students two graphs that show the same climate data in different ways. They analyze what each one highlights and what it hides.'
                }
              ]
            },
            {
              label: 'Modeling',
              color: 'cp',
              acts: [
                {
                  title: 'Modeling how a city responds to rising sea levels',
                  desc: 'Students build a simple model of how a city responds to rising sea levels, using differential equations or functions they already know.'
                },
                {
                  title: 'Simulating the spread of an invasive species',
                  desc: 'Using real data on an invasive species, students model and predict its population growth with exponential or logistic functions.'
                }
              ]
            },
            {
              label: 'Optimizing',
              color: 'ck',
              acts: [
                {
                  title: 'Optimizing renewable energy distribution',
                  desc: 'Students solve an optimization problem: how to distribute electricity from solar panels across a neighborhood while minimizing losses and costs.'
                },
                {
                  title: 'Comparing two transportation systems',
                  desc: 'Students use math to compare two ways of getting around (private car vs. public transit) on energy use, travel time, and emissions. The result is a multi-criteria optimization problem.'
                }
              ]
            },
            {
              label: 'Supporting decision-making',
              color: 'cy',
              acts: [
                {
                  title: 'Comparing the carbon footprint of two lifestyles',
                  desc: 'Students compare the carbon footprints of two students with different lifestyles in terms of transportation, food, and energy use. They get real numbers using math they already know.'
                },
                {
                  title: 'Building a sustainability indicator',
                  desc: "Students design a simple index to assess a region's sustainability, choosing their variables and justifying how they weight them. Students see how much complexity hides behind every indicator."
                }
              ]
            }
          ],
          feedback:
            'Great idea. You can fit this activity into an existing lesson without changing your curriculum.'
        },

        // STEP 4: YOUR TURN
        {
          type: 'votretour',
          statement: 'Your turn',
          sub: "You've just seen how mathematics connects to sustainability. Now take a moment to think about how this applies to your own teaching.",
          prompts: [
            {
              q: 'Which concept that you teach could you connect to sustainability?',
              placeholder: 'For example: exponential functions, probability, data analysis'
            },
            {
              q: 'How could you make this connection in your next class?',
              placeholder: 'For example: swapping a generic example for real climate data'
            }
          ],
          resource: {
            label: 'Further reading from UVED',
            title: 'Mathematics & Ecological Transition',
            href: 'https://www.uved.fr/fileadmin/user_upload/Documents/pdf/Fiches/Fiche_Mathematiques_et_TEDS.pdf'
          }
        }
      ]
    },
    history: {
      steps: [
        {
          type: 'flip',
          statement:
            'History already helps us understand the challenges of the ecological transition.',
          hint: 'Click on each card to discover the connection.',
          cards: [
            {
              verb: 'Understanding',
              text: 'History traces how societies and their environments have shaped each other over the long term.',
              color: 'ct'
            },
            {
              verb: 'Analyzing',
              text: 'It uncovers how societies have responded, or failed to respond, to environmental challenges.',
              color: 'cp'
            },
            {
              verb: 'Shedding light',
              text: "It draws lessons from the past to inform today's policy choices.",
              color: 'ck'
            },
            {
              verb: 'Contextualizing',
              text: "It traces the historical roots of today's environmental issues.",
              color: 'cy'
            }
          ],
          closing:
            'Your discipline provides a systemic, critical, and contextualized perspective on the ecological transition.'
        },
        {
          type: 'competences',
          intro:
            'Studying sustainability through history helps your students build essential skills. Here are the most significant ones.',
          featured: [
            {
              name: 'Critical thinking',
              tag: 'transversal',
              tagClass: 'transversal',
              concrete:
                'Students learn to identify and cross-check different types of sources on past environmental crises.'
            },
            {
              name: 'Systems thinking',
              tag: 'transversal',
              tagClass: 'transversal',
              concrete:
                'By drawing on several disciplines, students grasp how societies and their environments interact in complex ways.'
            },
            {
              name: 'Civic awareness',
              tag: 'transversal',
              tagClass: 'transversal',
              concrete:
                'Students think through their individual and collective responsibility for the changes ahead.'
            }
          ],
          also: [
            'Identifying sources in environmental history',
            'Analyzing social and environmental change',
            'Placing events in time and space',
            'Comparing historical periods',
            'Proposing solutions'
          ]
        },
        {
          type: 'activities',
          intro: 'Here are practical activities you can add to a class you already teach.',
          apports: [
            {
              label: 'Understanding',
              color: 'ct',
              acts: [
                {
                  title: 'Analyzing industrial archives',
                  desc: 'Students study archives from the Industrial Revolution to examine its environmental impact.'
                },
                {
                  title: 'Studying an environmental disaster',
                  desc: 'Analyze a major disaster (an oil spill, an industrial accident) as a window onto the tensions between economics, politics, and the environment.'
                }
              ]
            },
            {
              label: 'Analyzing',
              color: 'cp',
              acts: [
                {
                  title: 'Comparing how two societies managed their resources',
                  desc: 'Compare two societies that faced resource pressures: ancient Rome, which overexploited its farmland, and a society that managed the transition successfully.'
                },
                {
                  title: 'Debate: was the Industrial Revolution an ecological disaster?',
                  desc: '“Was the Industrial Revolution destined to become an environmental disaster?” Students build their arguments from historical sources.'
                }
              ]
            },
            {
              label: 'Shedding light',
              color: 'ck',
              acts: [
                {
                  title: 'Connecting past and present',
                  desc: "Students trace the historical roots of a current environmental issue and suggest lessons for today's policies."
                },
                {
                  title: 'Writing a futures narrative',
                  desc: 'Students write a short story about the future based on the historical trends they have identified. It shows how much shared narratives matter.'
                }
              ]
            },
            {
              label: 'Contextualizing',
              color: 'cy',
              acts: [
                {
                  title: 'Building a timeline of human pressure on the environment',
                  desc: 'Students map the major milestones in the growing human impact on the environment.'
                },
                {
                  title: 'Analyzing an SDG through history',
                  desc: 'Choose one of the UN Sustainable Development Goals and trace its historical roots. It gives students a historical way into the SDGs.'
                }
              ]
            }
          ],
          feedback: 'Perfect. You can add this activity directly to an existing lesson.'
        },
        {
          type: 'votretour',
          statement: 'Your turn',
          sub: "You've just seen how history connects to sustainability. Now take a moment to think about how this applies to your own teaching.",
          prompts: [
            {
              q: 'Which period or event in your course has the clearest environmental dimension?',
              placeholder: 'For example: the Industrial Revolution, decolonization, major disasters'
            },
            {
              q: 'How could you bring this dimension into your next class?',
              placeholder:
                'For example: adding a question about the environmental impact of an event you already cover'
            }
          ],
          resource: {
            label: 'Further reading from UVED',
            title: 'History & Ecological Transition',
            href: 'https://www.uved.fr/fileadmin/user_upload/Documents/pdf/Fiches/Fiche_Histoire_et_TEDS.pdf'
          }
        }
      ]
    },
    economics: {
      steps: [
        {
          type: 'flip',
          statement: 'You are already teaching the tools of the ecological transition.',
          hint: 'Click on each card to discover the connection.',
          cards: [
            {
              verb: 'Diagnosing',
              text: 'Economics puts a price on environmental damage and weighs the benefits of managing resources sustainably.',
              color: 'ct'
            },
            {
              verb: 'Regulating',
              text: 'It designs economic instruments, such as taxes and subsidies, that reduce environmental impact.',
              color: 'cp'
            },
            {
              verb: 'Modeling',
              text: 'It builds alternative models: the circular economy, degrowth, ecological economics, and planetary boundaries.',
              color: 'ck'
            },
            {
              verb: 'Decision-making',
              text: 'It provides decision-making tools that make sustainability attractive economically and socially.',
              color: 'cy'
            }
          ],
          closing:
            'Economics offers many ways to connect sustainability, prosperity, and social justice.'
        },
        {
          type: 'competences',
          intro:
            'Studying sustainability through economics helps your students build essential analytical and critical skills. Here are the most significant ones.',
          featured: [
            {
              name: 'Systems thinking',
              tag: 'disciplinary',
              tagClass: 'disciplinary',
              concrete:
                'Students build planetary boundaries into their economic analysis, taking an interdisciplinary view that goes beyond standard models.'
            },
            {
              name: 'Foresight analysis',
              tag: 'disciplinary',
              tagClass: 'disciplinary',
              concrete:
                'Students unpack the economic assumptions behind different transition scenarios and anticipate how stakeholders might respond to environmental policies.'
            },
            {
              name: 'Capacity to act',
              tag: 'transversal',
              tagClass: 'transversal',
              concrete:
                'Students apply cost-benefit analysis to real climate policies and assess how effective environmental taxes are.'
            }
          ],
          also: [
            'Critically analyzing economic models',
            'Assessing life-cycle costs',
            'Connecting climate justice and inequality',
            'Modeling the impact of public policy',
            'Assessing alternative regulatory approaches'
          ]
        },
        {
          type: 'activities',
          intro: 'Here are practical activities you can add to a class you already teach.',
          apports: [
            {
              label: 'Diagnosing',
              color: 'ct',
              acts: [
                {
                  title: 'Calculating the cost of climate inaction',
                  desc: 'Students use data from the Stern Review to compare the economic cost of climate inaction with the cost of mitigation policies.'
                },
                {
                  title: 'Analyzing the externalities of an industry',
                  desc: 'Identify and quantify the negative externalities of an industry, such as pollution and biodiversity loss. Who pays these costs, and how?'
                }
              ]
            },
            {
              label: 'Regulating',
              color: 'cp',
              acts: [
                {
                  title: 'Debate: carbon taxes',
                  desc: '“Under what conditions can a carbon tax be both fair and effective?” Students argue different positions using economic data and fairness criteria.'
                },
                {
                  title: 'Simulating a climate negotiation (COP)',
                  desc: 'Students play different countries in a climate negotiation, applying the concepts of public goods, externalities, and trade-offs between development and mitigation.'
                }
              ]
            },
            {
              label: 'Modeling',
              color: 'ck',
              acts: [
                {
                  title: 'Modeling a circular economy',
                  desc: "Using François Grosse's mathematical conditions (recycling rates, growth rates), students test whether an economy can truly become circular."
                },
                {
                  title: 'Building a net-zero pathway',
                  desc: 'Students develop an economic pathway to carbon neutrality by 2050, identifying the key levers and constraints.'
                }
              ]
            },
            {
              label: 'Decision-making',
              color: 'cy',
              acts: [
                {
                  title: 'Running a cost-benefit analysis of a climate policy',
                  desc: 'Assess the costs and benefits of a measure to cut greenhouse gas emissions, using the Nordhaus model, for example.'
                },
                {
                  title: 'Designing a sustainable local development project',
                  desc: 'In this interdisciplinary project, students design a sustainable local community that balances environmental, social, and economic constraints, then defend their choices.'
                }
              ]
            }
          ],
          feedback:
            'Excellent idea. This activity links the economic tools you teach directly to real-world challenges.'
        },
        {
          type: 'votretour',
          statement: 'Your turn',
          sub: "You've just seen how economics connects to sustainability. Now take a moment to think about how this applies to your own teaching.",
          prompts: [
            {
              q: 'Which economic concept from your course connects most naturally to sustainability?',
              placeholder: 'For example: externalities, public goods, cost-benefit analysis'
            },
            {
              q: 'How could you add a sustainability angle to one of your existing lessons?',
              placeholder:
                'For example: replacing a generic example with a real environmental policy case'
            }
          ],
          resource: {
            label: 'Further reading from UVED',
            title: 'Economics & Ecological Transition',
            href: 'https://www.uved.fr/fileadmin/user_upload/Documents/pdf/Fiches/Fiche_Economie_et_TEDS.pdf'
          }
        }
      ]
    },
    law: {
      steps: [
        {
          type: 'flip',
          statement: 'Law is central to the ecological transition.',
          hint: 'Click on each card to discover the connection.',
          cards: [
            {
              verb: 'Defining',
              text: 'Law establishes the core principles of environmental protection: prevention, precaution, non-regression, and the polluter-pays principle.',
              color: 'ct'
            },
            {
              verb: 'Regulating',
              text: 'It governs human activities to limit their impact, from urban planning and industry to agriculture, mining, and transportation.',
              color: 'cp'
            },
            {
              verb: 'Holding accountable',
              text: 'It resolves disputes, penalizes environmental harm, and establishes frameworks for environmental liability.',
              color: 'ck'
            },
            {
              verb: 'Governing',
              text: 'It organizes public participation in environmental decisions and defines the responsibilities of public authorities.',
              color: 'cy'
            }
          ],
          closing:
            'Law makes decision-making orderly, democratic, and transparent, serving the public interest while respecting planetary boundaries.'
        },
        {
          type: 'competences',
          intro:
            'Studying sustainability through law helps your students build essential analytical and civic skills. Here are the most significant ones.',
          featured: [
            {
              name: 'Critical analysis',
              tag: 'disciplinary',
              tagClass: 'disciplinary',
              concrete:
                'Students interpret an energy or climate law and sort out what falls under national, European, and international law.'
            },
            {
              name: 'Systems thinking',
              tag: 'transversal',
              tagClass: 'transversal',
              concrete:
                'Students see law as a tool for social change and understand how environmental law connects to other areas of law.'
            },
            {
              name: 'Collective action',
              tag: 'transversal',
              tagClass: 'transversal',
              concrete:
                'Students use legal arguments to make the case for environmental protection in real situations.'
            }
          ],
          also: [
            'Identifying key constitutional principles',
            'Understanding liability frameworks',
            'Exploring environmental democracy',
            'Assessing whether projects are constitutional',
            'Mastering legal methodology',
            'Drafting a legal opinion collaboratively'
          ]
        },
        {
          type: 'activities',
          intro: 'Here are practical activities you can add to a class you already teach.',
          apports: [
            {
              label: 'Defining',
              color: 'ct',
              acts: [
                {
                  title: "Analyzing France's Charter for the Environment",
                  desc: "Students study France's Charter for the Environment. What rights and duties does it establish? Where does it fall short? How effective is it?"
                },
                {
                  title: 'Comparing environmental principles in European and national law',
                  desc: 'Identify how the precautionary and polluter-pays principles are applied differently at each level of governance.'
                }
              ]
            },
            {
              label: 'Regulating',
              color: 'cp',
              acts: [
                {
                  title: 'Case study: testing a project against environmental law',
                  desc: 'Analyze whether a development project (a wind farm, mine, or highway) is lawful under environmental law and the constitution.'
                },
                {
                  title: 'Reading and analyzing an environmental law',
                  desc: 'Examine a recent piece of environmental legislation to identify how it works, where it falls short, and what stands in the way of implementing it.'
                }
              ]
            },
            {
              label: 'Holding accountable',
              color: 'ck',
              acts: [
                {
                  title: 'Analyzing a real case of environmental damage',
                  desc: 'Study a real case of environmental damage to see how the law handles harm and compensation.'
                },
                {
                  title: 'Role-play: competing land uses',
                  desc: 'Students take on the roles of different stakeholders in an environmental dispute (farmers, NGOs, local authorities, the national government) to see the legal tensions involved.'
                }
              ]
            },
            {
              label: 'Governing',
              color: 'cy',
              acts: [
                {
                  title: 'Simulating a public consultation on the environment',
                  desc: 'Stage a mock public hearing on a project so students weigh opposing views and see how environmental democracy works.'
                },
                {
                  title: 'Drafting a mock bill',
                  desc: 'Students draft a bill or amendments on an environmental issue, learning how the legislative process works and what compromises it requires.'
                }
              ]
            }
          ],
          feedback:
            'Very good. This activity links legal mechanisms directly to real-life situations.'
        },
        {
          type: 'votretour',
          statement: 'Your turn',
          sub: "You've just seen how law connects to sustainability. Now take a moment to think about how this applies to your own teaching.",
          prompts: [
            {
              q: 'Which legal principle from your course has the most direct environmental application?',
              placeholder:
                'For example: civil liability, the precautionary principle, fundamental rights'
            },
            {
              q: 'How could you use a real environmental case in your next class?',
              placeholder: 'For example: studying a recent court decision, analyzing a current law'
            }
          ],
          resource: {
            label: 'Further reading from UVED',
            title: 'Law & Ecological Transition',
            href: 'https://www.uved.fr/fileadmin/user_upload/Documents/pdf/Fiches/Fiche_Droit_et_TEDS.pdf'
          }
        }
      ]
    },
    philosophy: {
      steps: [
        {
          type: 'flip',
          statement:
            'Philosophy is already grappling with the challenges of the ecological transition.',
          hint: 'Click on each card to discover the connection.',
          cards: [
            {
              verb: 'Questioning',
              text: 'Philosophy questions the goals of progress and development and examines the cultural assumptions of modernity.',
              color: 'ct'
            },
            {
              verb: 'Examining ethics',
              text: 'It looks at the ethical principles behind individual and collective choices and clarifies our responsibility to future generations.',
              color: 'cp'
            },
            {
              verb: 'Critiquing',
              text: 'It challenges the dualisms of nature versus culture and human versus non-human, and explores the values that shape how we relate to nature.',
              color: 'ck'
            },
            {
              verb: 'Imagining',
              text: 'It asks what an ecological democracy would require and how we might live alongside other forms of life, human and non-human.',
              color: 'cy'
            }
          ],
          closing:
            'Philosophy prepares students for the ethical, political, and existential choices the ecological transition raises, and helps shape informed, responsible citizens.'
        },
        {
          type: 'competences',
          intro:
            'Studying sustainability through philosophy helps your students build essential reasoning and argumentation skills. Here are the most significant ones.',
          featured: [
            {
              name: 'Problem framing',
              tag: 'disciplinary',
              tagClass: 'disciplinary',
              concrete:
                'Students ask fundamental questions about our responsibility to future generations, the intrinsic value of nature, and the meaning of progress.'
            },
            {
              name: 'Critical thinking',
              tag: 'transversal',
              tagClass: 'transversal',
              concrete:
                'Students distinguish knowledge from opinion and question assumptions, especially the grand narratives of progress and growth.'
            },
            {
              name: 'Civic reflection',
              tag: 'transversal',
              tagClass: 'transversal',
              concrete:
                'Students distinguish and connect the dimensions of responsibility: individual, collective, historical, intergenerational, moral, and legal.'
            }
          ],
          also: [
            'Analyzing concepts',
            'Building rigorous arguments',
            'Interpreting philosophical texts',
            'Placing theories in context',
            'Debating and disagreeing constructively',
            'Connecting knowledge across disciplines'
          ]
        },
        {
          type: 'activities',
          intro: 'Here are practical activities you can add to a class you already teach.',
          apports: [
            {
              label: 'Questioning',
              color: 'ct',
              acts: [
                {
                  title: 'Writing an essay on progress and its limits',
                  desc: '“Can technological progress solve the ecological crisis?” A classic philosophical question made urgent by the climate crisis.'
                },
                {
                  title: 'Analyzing a text on modernity and the environment',
                  desc: 'Read and discuss an excerpt from Hans Jonas, Dominique Bourg, or Bruno Latour. Students sharpen their textual analysis skills on authors who address environmental issues directly.'
                }
              ]
            },
            {
              label: 'Examining ethics',
              color: 'cp',
              acts: [
                {
                  title: 'Debate: intergenerational responsibility',
                  desc: '“Do we have moral obligations to future generations?” Students explore Rawls, Jonas, and theories of climate justice in a structured debate.'
                },
                {
                  title: 'Writing an ethical charter',
                  desc: "In groups, students write an ethical charter for an institution (a university, company, or city) facing a specific environmental challenge. It's a hands-on exercise in applied ethics."
                }
              ]
            },
            {
              label: 'Critiquing',
              color: 'ck',
              acts: [
                {
                  title: 'Studying veganism as a philosophical case',
                  desc: 'Approach veganism not just as a lifestyle choice but as a philosophical test case: which ethical frameworks does it challenge, and what moral foundations does it reveal?'
                },
                {
                  title: 'Critiquing the nature/culture dualism',
                  desc: 'Using texts by Latour or Descola, students deconstruct the divide between nature and culture and explore what it means for the ecological crisis.'
                }
              ]
            },
            {
              label: 'Imagining',
              color: 'cy',
              acts: [
                {
                  title: 'Discussing climate justice',
                  desc: 'Bring philosophy and geography together around a single question: who suffers most from climate change, and who bears the greatest responsibility? Is that fair?'
                },
                {
                  title: 'Designing an ecological democracy',
                  desc: "Students define the conditions for a democracy that respects planetary boundaries and gives future generations a voice. It's an exercise in political philosophy."
                }
              ]
            }
          ],
          feedback:
            'Well chosen. This activity connects philosophy to questions your students actually face.'
        },
        {
          type: 'votretour',
          statement: 'Your turn',
          sub: "You've just seen how philosophy connects to sustainability. Now take a moment to think about how this applies to your own teaching.",
          prompts: [
            {
              q: 'Which concept from your course connects most directly to an environmental issue?',
              placeholder: 'For example: responsibility, justice, progress, nature, the common good'
            },
            {
              q: 'How could you bring an example or text about sustainability into your next class?',
              placeholder:
                'For example: replacing a classic example with a current environmental situation'
            }
          ],
          resource: {
            label: 'Further reading from UVED',
            title: 'Philosophy & Ecological Transition',
            href: 'https://www.uved.fr/fileadmin/user_upload/Documents/pdf/Fiches/Fiche_Philosophie_et_TEDS.pdf'
          }
        }
      ]
    },
    psychology: {
      steps: [
        {
          type: 'flip',
          statement: 'Psychology helps explain the human side of the ecological transition.',
          hint: 'Click on each card to discover the connection.',
          cards: [
            {
              verb: 'Understanding',
              text: 'Psychology analyzes how people perceive and imagine environmental risks, and how they relate to the places the transition affects.',
              color: 'ct'
            },
            {
              verb: 'Regulating',
              text: 'It helps people understand and manage the emotions that environmental change brings: eco-anxiety, solastalgia, and feelings of loss or helplessness.',
              color: 'cp'
            },
            {
              verb: 'Mobilizing',
              text: 'It identifies psychological barriers to change and points to levers for action: social norms, green nudges, and identity.',
              color: 'ck'
            },
            {
              verb: 'Supporting',
              text: 'It supports psychological sustainability by helping people stay active and constructive despite environmental anxiety.',
              color: 'cy'
            }
          ],
          closing:
            'Psychology helps bridge the gap between knowledge and action by taking seriously what people perceive and feel in the face of ecological challenges.'
        },
        {
          type: 'competences',
          intro:
            'Studying sustainability through psychology helps your students build essential analytical and applied skills. Here are the most significant ones.',
          featured: [
            {
              name: 'Complex systems thinking',
              tag: 'transversal',
              tagClass: 'transversal',
              concrete:
                'Students identify the links between emotions, pro-environmental behavior, and sustainability policies, and see how complex our views of the environment can be.'
            },
            {
              name: 'Critical analysis',
              tag: 'transversal',
              tagClass: 'transversal',
              concrete:
                'Students understand what underlies environmental discourse and behavior, and recognize where they themselves stand on these issues.'
            },
            {
              name: 'Capacity to drive change',
              tag: 'transversal',
              tagClass: 'transversal',
              concrete:
                'Students design strategies for change and help people turn vulnerability and anxiety into action and resilience.'
            }
          ],
          also: [
            'Understanding human behavior in times of transition',
            'Designing and evaluating strategies for change',
            'Communicating to inform and engage',
            'Analyzing decision-making mechanisms',
            'Analyzing social representations and everyday beliefs'
          ]
        },
        {
          type: 'activities',
          intro: 'Here are practical activities you can add to a class you already teach.',
          apports: [
            {
              label: 'Understanding',
              color: 'ct',
              acts: [
                {
                  title: 'Analyzing perceptions of climate risk',
                  desc: 'Students use a social-psychology lens to examine how different populations perceive climate risk, identifying cognitive and cultural biases.'
                },
                {
                  title: 'Comparing eco-anxiety across cultural contexts',
                  desc: 'Compare how eco-anxiety is experienced in different cultural and regional contexts. Students analyze first-hand accounts and apply psychological frameworks.'
                }
              ]
            },
            {
              label: 'Regulating',
              color: 'cp',
              acts: [
                {
                  title: 'Debate: is eco-anxiety a disorder or an appropriate response?',
                  desc: '“Is eco-anxiety a condition to be treated or a healthy psychological response to climate change?” Students hold a structured debate grounded in scientific evidence.'
                },
                {
                  title: 'Analyzing the cognitive mechanisms behind eco-anxiety',
                  desc: 'Using anonymized first-hand accounts, students identify the cognitive and emotional mechanisms involved in eco-anxiety and suggest ways to support those affected.'
                }
              ]
            },
            {
              label: 'Mobilizing',
              color: 'ck',
              acts: [
                {
                  title: 'Designing a green nudge campaign',
                  desc: 'Students apply psychological theories (social norms, the theory of planned behavior) to design an awareness campaign on a university campus.'
                },
                {
                  title: 'Observing and analyzing eco-friendly behavior',
                  desc: 'Observe recycling habits or food choices in real-life settings, interview people about their motivations, and apply social-psychology frameworks.'
                }
              ]
            },
            {
              label: 'Supporting',
              color: 'cy',
              acts: [
                {
                  title: 'Designing psychological support for the climate crisis',
                  desc: 'Design a psychological support campaign, informed by research on eco-anxiety, for people affected by climate disasters.'
                },
                {
                  title: 'Role-play: persuading a cognitively vulnerable group',
                  desc: 'Students must persuade a cognitively vulnerable group to engage in the transition to sustainability, for example in response to rising sea levels in a coastal city.'
                }
              ]
            }
          ],
          feedback:
            'Good choice. This activity links psychology directly to situations your students experience or observe.'
        },
        {
          type: 'votretour',
          statement: 'Your turn',
          sub: "You've just seen how psychology connects to sustainability. Now take a moment to think about how this applies to your own teaching.",
          prompts: [
            {
              q: 'Which psychological concept from your course is most meaningful when applied to environmental behavior?',
              placeholder:
                'For example: theory of planned behavior, cognitive biases, social representations'
            },
            {
              q: 'How could you make this connection in your next class?',
              placeholder:
                'For example: applying a theoretical framework to a real environmental behavior your students have observed'
            }
          ],
          resource: {
            label: 'Further reading from UVED',
            title: 'Psychology & Ecological Transition',
            href: 'https://www.uved.fr/fileadmin/user_upload/Documents/pdf/Fiches/Fiche_Psychologie_et_TEDS.pdf'
          }
        }
      ]
    },
    geography: {
      steps: [
        {
          type: 'flip',
          statement: 'Geography is essential to the ecological transition.',
          hint: 'Click on each card to discover the connection.',
          cards: [
            {
              verb: 'Locating and mapping',
              text: 'You teach students to read spatial dynamics, which is exactly the skill needed to map climate vulnerabilities, pollution flows, and environmental inequalities at different scales.',
              color: 'ct'
            },
            {
              verb: 'Understanding places',
              text: 'Geography examines how societies and their environments interact, such as how a coastal city adapts to rising sea levels, for example, or how a rural area manages the energy transition.',
              color: 'cp'
            },
            {
              verb: 'Decoding policies',
              text: 'You teach students to analyze stakeholders and public decisions. The transition demands exactly that: knowing who decides, at what level, and with what effects on local communities.',
              color: 'ck'
            },
            {
              verb: 'Examining inequalities',
              text: 'Geography explores social and spatial inequalities, which the ecological crisis deepens. Who is most vulnerable? Who has access to resources? Who bears the brunt of climate change?',
              color: 'cy'
            }
          ],
          closing:
            'Without a geographic grounding in the specific character of places and societies, the ecological transition cannot work. Your discipline is essential.'
        },
        {
          type: 'competences',
          intro:
            'Studying sustainability through geography helps your students build essential analytical and civic skills. Here are the most significant ones.',
          featured: [
            {
              name: 'Reading and making maps',
              tag: 'disciplinary',
              tagClass: 'disciplinary',
              concrete:
                "Students map an area's climate vulnerabilities, pinpointing high-risk zones and the populations exposed to extreme weather."
            },
            {
              name: 'Critical thinking',
              tag: 'transversal',
              tagClass: 'transversal',
              concrete:
                'Students untangle complex issues, such as conflicts over water use or tensions between tourism development and coastal protection.'
            },
            {
              name: 'Thinking across scales',
              tag: 'disciplinary',
              tagClass: 'disciplinary',
              concrete:
                'Students link local decisions (such as an eco-district project) to national and global dynamics (climate policy, climate-driven migration).'
            }
          ],
          also: [
            'Identifying stakeholders and local dynamics',
            'Analyzing spatial dynamics',
            'Working across time and spatial scales',
            'Making the case for a project',
            'Using digital and mapping tools',
            'Seeing how global issues play out locally'
          ]
        },
        {
          type: 'activities',
          intro: 'Here are practical activities you can add to a class you already teach.',
          apports: [
            {
              label: 'Locating and mapping',
              color: 'ct',
              acts: [
                {
                  title: "Mapping an area's climate vulnerabilities",
                  desc: 'Students build a map of high-risk zones (flooding, drought, heatwaves) at the local or regional scale by combining climate and social data.'
                },
                {
                  title: 'Comparing ecological footprints across countries',
                  desc: 'Students compare national ecological footprints: who consumes the most, and who suffers the most? They then link the data to inequalities in development.'
                }
              ]
            },
            {
              label: 'Understanding places',
              color: 'cp',
              acts: [
                {
                  title: 'Studying an eco-district or transition-town project',
                  desc: 'Students analyze a real sustainable urban project (for example, the Confluence district in Lyon or Bottière-Chénaie in Nantes): its stakeholders, challenges, trade-offs, and limits.'
                },
                {
                  title: 'Analyzing how shrinking snow cover affects mountain tourism',
                  desc: 'Students study a mountain area (the Alps, the Pyrenees) facing declining snowfall. How is the local economy diversifying? Where does it meet resistance? Who has a stake?'
                }
              ]
            },
            {
              label: 'Decoding policies',
              color: 'ck',
              acts: [
                {
                  title: 'Simulating a COP-style negotiation on a local resource',
                  desc: 'Students play different stakeholders (national government, local authorities, NGOs, businesses, citizens) negotiating the sustainable management of a shared resource: water, forests, or coastline.'
                },
                {
                  title: 'Analyzing a sustainable land-use policy',
                  desc: 'Students examine a local land-use plan or regional planning framework through a sustainability lens. What are its goals? Where does it contradict itself?'
                }
              ]
            },
            {
              label: 'Examining inequalities',
              color: 'cy',
              acts: [
                {
                  title: 'Case study: environmental justice',
                  desc: 'Students analyze a place where a polluting industrial site borders disadvantaged communities. Who decided where the site would go? Who bears the consequences? What recourse do residents have?'
                },
                {
                  title: 'Mapping climate migration',
                  desc: 'Using real data, students map migration driven by climate disasters and analyze differences in vulnerability between the Global North and South.'
                }
              ]
            }
          ],
          feedback:
            'Good choice. This activity applies geographical tools directly to real local issues.'
        },
        {
          type: 'votretour',
          statement: 'Your turn',
          sub: "You've just seen how geography connects to sustainability. Now take a moment to think about how this applies to your own teaching.",
          prompts: [
            {
              q: 'Which place or spatial dynamic in your course connects most clearly to sustainability?',
              placeholder:
                'For example: urban dynamics, rural areas, coastlines, regional inequalities'
            },
            {
              q: 'How could you bring a sustainability-related map or case study into your next class?',
              placeholder:
                'For example: adding a climate vulnerability map to an existing lesson on land-use planning'
            }
          ],
          resource: {
            label: 'Further reading from UVED',
            title: 'Geography & Ecological Transition',
            href: 'https://www.uved.fr/fileadmin/user_upload/Documents/pdf/Fiches/Fiche_Geographie_et_TEDS.pdf'
          }
        }
      ]
    },
    health: {
      steps: [
        {
          type: 'flip',
          statement: 'Health sciences have a central part to play in the ecological transition.',
          hint: 'Click on each card to discover the connection.',
          cards: [
            {
              verb: 'Identifying risks',
              text: 'You teach students to assess how environmental exposures affect health: excess deaths during heatwaves, for example, or respiratory diseases linked to air pollution.',
              color: 'ct'
            },
            {
              verb: 'Analyzing policies',
              text: 'Health sciences help measure the co-benefits of climate policy. Eating less meat, for instance, improves health and cuts emissions. Your students learn to think in systems.',
              color: 'cp'
            },
            {
              verb: 'Strengthening resilience',
              text: 'Shifting from treatment to prevention is one of the biggest challenges in environmental health, and a mindset students can build from the very start of their training.',
              color: 'ck'
            },
            {
              verb: 'Reducing the footprint',
              text: 'Healthcare itself is a source of emissions. Your students can design more sustainable medical practices: recycling reagents, eco-designing care, and improving energy efficiency.',
              color: 'cy'
            }
          ],
          closing:
            'Health is a common language across disciplines and a concrete way into discussing how humans and their environment depend on each other.'
        },
        {
          type: 'competences',
          intro:
            'Studying sustainability through health sciences helps your students build essential clinical, systems-thinking, and civic skills. Here are the most significant ones.',
          featured: [
            {
              name: 'One Health approach',
              tag: 'disciplinary',
              tagClass: 'disciplinary',
              concrete:
                'Students learn to see human health as closely tied to the health of ecosystems and other species, for example by analyzing how global warming drives the spread of vector-borne diseases.'
            },
            {
              name: 'Interdisciplinary thinking',
              tag: 'transversal',
              tagClass: 'transversal',
              concrete:
                "Students combine medicine, ecology, psychology, and sociology to analyze the environmental factors that shape a region's health."
            },
            {
              name: 'Critical thinking',
              tag: 'transversal',
              tagClass: 'transversal',
              concrete:
                'Students distinguish political and media narratives from established science in environmental health, and build ethical reasoning skills for questions of health justice.'
            }
          ],
          also: [
            'Describing how environment and health interact',
            'Analyzing the ecological and social determinants of health',
            'Understanding environmental and health justice issues',
            'Leading change in the health sector',
            'Making recommendations on risk prevention',
            'Contributing to public education and awareness'
          ]
        },
        {
          type: 'activities',
          intro: 'Here are practical activities you can add to a class you already teach.',
          apports: [
            {
              label: 'Identifying risks',
              color: 'ct',
              acts: [
                {
                  title: 'Case study: how a heatwave affects public health',
                  desc: 'Students analyze data from a real heatwave (deaths, hospital admissions, vulnerable groups) and identify health responses and prevention strategies.'
                },
                {
                  title: 'Analyzing an air pollution episode',
                  desc: "Using real data (from the WHO or Airparif, the Paris region's air quality monitor), students assess the health effects of a pollution spike and how exposure varies across neighborhoods and populations."
                }
              ]
            },
            {
              label: 'Analyzing policies',
              color: 'cp',
              acts: [
                {
                  title: 'Assessing the health benefits and risks of a climate policy',
                  desc: 'Students analyze a sustainability policy (active mobility, lower meat consumption, urban greening) in terms of its health benefits and risks.'
                },
                {
                  title: 'Analyzing environmental health strategies',
                  desc: "Students examine national and international strategies (France's National Environmental Health Plan, WHO, One Health). What are their goals and tools? How effective are they in supporting the transition to sustainability?"
                }
              ]
            },
            {
              label: 'Strengthening resilience',
              color: 'ck',
              acts: [
                {
                  title: 'Carrying out an environmental health audit on campus',
                  desc: 'Students carry out an environmental health audit of their campus (air quality, access to green space, food, transportation), then link the findings to environmental justice.'
                },
                {
                  title: 'Role-play: an environmental health issue',
                  desc: 'Students play different stakeholders (healthcare professionals, elected officials, NGOs, researchers, citizens) and debate an environmental health issue such as pesticides, pollution, or heatwaves.'
                }
              ]
            },
            {
              label: 'Reducing the footprint',
              color: 'cy',
              acts: [
                {
                  title: 'Designing more sustainable medical practices',
                  desc: 'Students identify ways to reduce the environmental footprint of a hospital unit: recycling, energy efficiency, responsible purchasing, and eco-designed medical equipment.'
                },
                {
                  title: 'Communicating the links between health and sustainability',
                  desc: 'In groups, students create a poster, podcast, or explainer video for a general audience on how a health issue connects to sustainability.'
                }
              ]
            }
          ],
          feedback:
            'Great choice. This activity links clinical skills directly to real environmental issues.'
        },
        {
          type: 'votretour',
          statement: 'Your turn',
          sub: "You've just seen how health sciences connect to sustainability. Now take a moment to think about how this applies to your own teaching.",
          prompts: [
            {
              q: 'Which link between health and the environment could you bring into your next class?',
              placeholder:
                'For example: pollution and respiratory disease, mental health and climate'
            },
            {
              q: 'How could you use sustainability as a context for learning in your course?',
              placeholder:
                'For example: using climate-related epidemiological data in a clinical case'
            }
          ],
          resource: {
            label: 'Further reading from UVED',
            title: 'Health & Ecological Transition',
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
            "Sports science sits where today's health, social, and environmental challenges meet.",
          hint: 'Click on each card to discover the connection.',
          cards: [
            {
              verb: 'Understanding climate impacts',
              text: 'Physical activity and sport depend heavily on environmental conditions. Your students learn how the body adapts to extreme heat, air pollution, and severe weather.',
              color: 'ct'
            },
            {
              verb: 'Building resilience',
              text: "Better fitness can help people cope with certain environmental stresses. Your students learn to design programs suited to today's climate conditions.",
              color: 'cp'
            },
            {
              verb: 'Reducing the footprint',
              text: 'Sport relies heavily on infrastructure, equipment, and travel. Your students can learn to design more sustainable, responsible ways to play and train.',
              color: 'ck'
            },
            {
              verb: 'Educating for global health',
              text: 'Sports science promotes respect, cooperation, and commitment. It offers a way to explore the links between human and environmental health.',
              color: 'cy'
            }
          ],
          closing:
            'Sports science trains professionals who can adapt sports practices to ecological constraints, organize more sustainable events, and support change within the sports sector.'
        },
        {
          type: 'competences',
          intro:
            'Studying sustainability through sports science helps your students build essential disciplinary and transferable skills. Here are the most significant ones.',
          featured: [
            {
              name: 'Systems thinking',
              tag: 'transversal',
              tagClass: 'transversal',
              concrete:
                'Students describe how health, climate, sports facilities, and the sports economy interact, for example by analyzing how rising temperatures affect training and performance.'
            },
            {
              name: 'Critical analysis',
              tag: 'disciplinary',
              tagClass: 'disciplinary',
              concrete:
                'Students examine sport in an era of planetary boundaries, identifying and interpreting the environmental performance indicators of a sports facility or event.'
            },
            {
              name: 'Design skills',
              tag: 'disciplinary',
              tagClass: 'disciplinary',
              concrete:
                'Students design a PE or training program that accounts for climate hazards (heatwaves, air quality, flooding) and uses resources responsibly.'
            }
          ],
          also: [
            'Defining sustainability indicators for sporting events',
            'Organizing fair, responsible, low-impact sporting events',
            'Designing a nutrition plan that is both optimal and sustainable',
            'Explaining how climate risks affect athletic performance',
            'Connecting urban planning, mobility, and sport',
            'Carrying out integrated assessments of a local area'
          ]
        },
        {
          type: 'activities',
          intro: 'Here are practical activities you can add to a class you already teach.',
          apports: [
            {
              label: 'Understanding climate impacts',
              color: 'ct',
              acts: [
                {
                  title: 'Adapting training to heat',
                  desc: "Students study real physiological data on heat adaptation and design training protocols suited to today's climate conditions."
                },
                {
                  title: 'Case study: mountain sports and shrinking snow cover',
                  desc: 'Students analyze how climate change affects a mountain sport such as skiing or mountaineering. How will practices, infrastructure, and business models need to adapt?'
                }
              ]
            },
            {
              label: 'Building resilience',
              color: 'cp',
              acts: [
                {
                  title: 'Designing a PE program adapted to climate conditions',
                  desc: 'Students design a PE unit around a real environmental constraint (a heatwave, poor air quality), with learning objectives, adaptations, and monitoring indicators.'
                },
                {
                  title: 'Analyzing the health and climate co-benefits of active mobility',
                  desc: "Students calculate and compare the health effects and CO₂ emissions of different ways of getting to a sports facility. It's a hands-on exercise in systems analysis."
                }
              ]
            },
            {
              label: 'Reducing the footprint',
              color: 'ck',
              acts: [
                {
                  title: 'Assessing the sustainability of the Olympic Games',
                  desc: 'Using official reports and real data, students assess the environmental footprint of the Olympic Games and propose indicators and ways to reduce it.'
                },
                {
                  title: 'Designing a low-impact sporting event',
                  desc: 'Students plan a sporting event built around sustainability criteria (transportation, food, waste, accessibility) and define their own sustainability indicators.'
                }
              ]
            },
            {
              label: 'Educating for global health',
              color: 'cy',
              acts: [
                {
                  title: 'Debate: sports performance and planetary boundaries',
                  desc: '“Is the pursuit of sports performance compatible with planetary boundaries?” Students argue different positions using economic, health, and environmental data.'
                },
                {
                  title: 'Running an awareness initiative at a sports club',
                  desc: 'Students design and run a sustainability awareness campaign at a local sports club or association.'
                }
              ]
            }
          ],
          feedback:
            'Good choice. This activity links sports science skills directly to real environmental challenges.'
        },
        {
          type: 'votretour',
          statement: 'Your turn',
          sub: "You've just seen how sports science connects to sustainability. Now take a moment to think about how this applies to your own teaching.",
          prompts: [
            {
              q: 'Which sport or lesson in your course could include a sustainability angle?',
              placeholder:
                "For example: a PE class adapted to hot weather, an analysis of a sports facility's footprint"
            },
            {
              q: 'How could you use sustainability as a context for learning in your course?',
              placeholder:
                'For example: using real data from a sporting event to build disciplinary skills'
            }
          ],
          resource: {
            label: 'Further reading from UVED',
            title: 'Sports Science & Ecological Transition',
            href: 'https://www.uved.fr/fileadmin/user_upload/Documents/pdf/Fiches/Fiche_STAPS_et_TEDS.pdf'
          }
        }
      ]
    },
    letters: {
      steps: [
        {
          type: 'flip',
          statement:
            'The humanities and literature have an essential role to play in the ecological transition.',
          hint: 'Click on each card to discover the connection.',
          cards: [
            {
              verb: 'Analyzing worldviews',
              text: 'You teach students to read texts and discourse, which is exactly what it takes to understand the worldviews that led us to overexploit the planet, and to imagine other ways of living on Earth.',
              color: 'ct'
            },
            {
              verb: 'Making sense of the crisis',
              text: 'The ecological crisis is hard to put into words. Literature gives us ways to name, think through, and give shape to ecological upheaval, and to see through greenwashing.',
              color: 'cp'
            },
            {
              verb: 'Imagining futures',
              text: 'Through fiction, poetry, theater, and climate science fiction, literature helps us think about social change and craft new shared stories about how we live alongside other species.',
              color: 'ck'
            },
            {
              verb: 'Fostering critical citizens',
              text: 'Your students learn to analyze how advertising, the media, and politicians talk about ecology, and to form their own informed views on these issues.',
              color: 'cy'
            }
          ],
          closing:
            'Literature and the humanities train citizens who can think about, express, and narrate the world differently, which is essential to transforming how we live.'
        },
        {
          type: 'competences',
          intro:
            'Studying sustainability through literature and the humanities helps your students build essential literary, critical, and civic skills. Here are the most significant ones.',
          featured: [
            {
              name: 'Critical and contextual reading',
              tag: 'disciplinary',
              tagClass: 'disciplinary',
              concrete:
                'Students analyze the historical and social context of a work about nature and uncover the values and ideologies behind environmental stories.'
            },
            {
              name: 'Critical thinking',
              tag: 'transversal',
              tagClass: 'transversal',
              concrete:
                'Students examine advertising and political messaging on ecology, telling greenwashing apart from scientifically grounded claims.'
            },
            {
              name: 'Expression and creativity',
              tag: 'transversal',
              tagClass: 'transversal',
              concrete:
                'Students use literature and language to express emotions, values, and visions of the future in response to the climate crisis, turning complex knowledge into accessible stories.'
            }
          ],
          also: [
            'Analyzing a literary work or a speech',
            'Writing an essay or commentary on a sustainability issue',
            'Writing a comparative analysis of texts',
            'Experimenting with creative writing about the natural world',
            'Creating new stories that can drive social change',
            'Spotting opportunities to collaborate across disciplines'
          ]
        },
        {
          type: 'activities',
          intro: 'Here are practical activities you can add to a class you already teach.',
          apports: [
            {
              label: 'Analyzing worldviews',
              color: 'ct',
              acts: [
                {
                  title: 'Analyzing a body of literature about nature',
                  desc: 'Students study excerpts ranging from naturalist writing to climate fiction to trace how ideas of progress, nature, and the planet have changed.'
                },
                {
                  title: 'Decoding how we talk about ecology',
                  desc: 'Using examples from advertising, politics, and the media, students identify rhetorical strategies around sustainability, including greenwashing.'
                }
              ]
            },
            {
              label: 'Making sense of the crisis',
              color: 'cp',
              acts: [
                {
                  title: 'Rewriting a text for the climate era',
                  desc: "Students rewrite an excerpt from a literary classic to add a contemporary ecological dimension. This stylistic exercise also puts the original's cultural assumptions under scrutiny."
                },
                {
                  title: 'Studying eco-literature authors',
                  desc: 'Students study writers of ecological literature (Thoreau, Le Clézio, Tesson, Giono). How do language and style convey a relationship with nature? What new literary genres are emerging?'
                }
              ]
            },
            {
              label: 'Imagining futures',
              color: 'ck',
              acts: [
                {
                  title: 'Imagining a sustainable or devastated society through writing',
                  desc: "Students write a short story set in a society that has made the transition to sustainability, or one that has failed to. It's an exercise in imagining the future through fiction."
                },
                {
                  title: 'Bringing literature and science together in an interdisciplinary project',
                  desc: 'Working with science colleagues, students write a literary text (essay, story, poem) that puts scientific knowledge in dialogue with how we imagine the climate crisis.'
                }
              ]
            },
            {
              label: 'Fostering critical citizens',
              color: 'cy',
              acts: [
                {
                  title: 'Analyzing a political speech on ecology',
                  desc: 'Students dissect a recent political speech on sustainability. What figures of speech, unstated assumptions, and framing does it use? A rhetorical and civic analysis.'
                },
                {
                  title: 'Reading and discussing a text in a natural setting',
                  desc: 'Students read and discuss a literary text tied to a nearby natural setting, pairing reading with a sensory experience of the environment. It works well as part of a partnership with a cultural or community organization.'
                }
              ]
            }
          ],
          feedback:
            'Good choice. This activity applies literary tools to questions your students actually live with and read about.'
        },
        {
          type: 'votretour',
          statement: 'Your turn',
          sub: "You've just seen how the humanities connect to sustainability. Now take a moment to think about how this applies to your own teaching.",
          prompts: [
            {
              q: 'Which work or author in your course connects most directly to ecological issues?',
              placeholder:
                'For example: Zola and industry, Le Clézio and our relationship with nature, climate dystopias'
            },
            {
              q: 'How could you bring an ecological angle into your next literature class?',
              placeholder:
                'For example: adding a question about how nature is imagined in a work already on your syllabus'
            }
          ],
          resource: {
            label: 'Further reading from UVED',
            title: 'Humanities & Ecological Transition',
            href: 'https://www.uved.fr/fileadmin/user_upload/Documents/pdf/Fiches/Fiche_Lettres_et_TEDS.pdf'
          }
        }
      ]
    },
    ecology: {
      steps: [
        {
          type: 'flip',
          statement: 'Scientific ecology provides the foundational knowledge for the transition.',
          hint: 'Click on each card to discover the connection.',
          cards: [
            {
              verb: 'Describing and understanding',
              text: 'Ecology studies how living organisms interact with their environment. You teach students how ecosystems are structured and how they function, whether human activity has shaped them heavily or only lightly.',
              color: 'ct'
            },
            {
              verb: 'Assessing and predicting',
              text: 'Your students learn to assess how resilient or vulnerable ecosystems are to human pressure, identify tipping points, and model how they change.',
              color: 'cp'
            },
            {
              verb: 'Proposing solutions',
              text: 'Ecology offers ways to drive change: agroecology, urban ecology, nature-based solutions, biomimicry. Your students learn to design concrete action plans.',
              color: 'ck'
            },
            {
              verb: 'Informing decisions',
              text: 'Ecological knowledge is essential to sound public policy. Your students learn to explain complex scientific data to decision-makers and non-specialists.',
              color: 'cy'
            }
          ],
          closing:
            "Ecology provides essential knowledge for understanding today's environmental crises. By studying the living world, it also drives progress and innovation for the transition."
        },
        {
          type: 'competences',
          intro:
            'Studying sustainability through ecology helps your students build essential analytical and practical skills. Here are the most significant ones.',
          featured: [
            {
              name: 'Systems analysis',
              tag: 'disciplinary',
              tagClass: 'disciplinary',
              concrete:
                'Students describe an ecosystem as a network of interactions, trace cascading responses to disturbance, and explain the concepts of resilience and irreversibility.'
            },
            {
              name: 'Critical analysis',
              tag: 'disciplinary',
              tagClass: 'disciplinary',
              concrete:
                'Students identify the natural and human factors that drive ecosystem dynamics and recognize the strengths and limits of data collection and modeling tools.'
            },
            {
              name: 'Taking action',
              tag: 'transversal',
              tagClass: 'transversal',
              concrete:
                'Students propose action plans to conserve or restore biodiversity and draw on nature to design mitigation and adaptation solutions.'
            }
          ],
          also: [
            'Explaining what drives genetic and species diversity',
            'Applying population and community ecology',
            'Understanding ecosystem services and nature-based solutions',
            'Anticipating the consequences of biodiversity loss',
            'Linking ecology with other disciplines to describe social-ecological systems',
            'Identifying reliable sources of ecological information'
          ]
        },
        {
          type: 'activities',
          intro: 'Here are practical activities you can add to a class you already teach.',
          apports: [
            {
              label: 'Describing and understanding',
              color: 'ct',
              acts: [
                {
                  title: 'Carrying out a field-based ecological assessment',
                  desc: 'Students carry out an ecological assessment of a local site (a river, forest, soil, or grassland) using the observation and measurement methods they have learned in class.'
                },
                {
                  title: 'Building a biodiversity atlas',
                  desc: 'Students survey biodiversity across their campus or neighborhood, map the species they observe, and analyze what influences their presence.'
                }
              ]
            },
            {
              label: 'Assessing and predicting',
              color: 'cp',
              acts: [
                {
                  title: 'Modeling the effects of a disturbance on an ecosystem',
                  desc: 'Starting from a real-world scenario (road construction, river pollution, an invasive species), students model the cascading effects on the ecosystem.'
                },
                {
                  title: 'Comparing farming practices by their ecosystem benefits',
                  desc: 'Students compare conventional farming and agroecology on criteria such as biodiversity, soil quality, and ecosystem services. A multi-criteria analysis.'
                }
              ]
            },
            {
              label: 'Proposing solutions',
              color: 'ck',
              acts: [
                {
                  title: 'Drafting an action plan for a local area',
                  desc: 'For an area under heavy pressure (urban sprawl, pollution, drought), students draft an action plan and spell out the trade-offs involved.'
                },
                {
                  title: 'Designing a nature-based solution',
                  desc: 'Students identify a local environmental problem (urban heat island, stormwater runoff, pollinator decline) and design a solution inspired by how ecosystems work.'
                }
              ]
            },
            {
              label: 'Informing decisions',
              color: 'cy',
              acts: [
                {
                  title: 'Role-play: a land management controversy',
                  desc: 'In a role-play, students use scientific data to debate how to manage a contested area or issue (wolf reintroduction, loss of open land to development, wetland management).'
                },
                {
                  title: 'Analyzing how a sector scenario accounts for biodiversity',
                  desc: 'Students analyze how biodiversity is (or is not) built into a real agricultural, energy, or urban planning scenario, and suggest improvements.'
                }
              ]
            }
          ],
          feedback:
            'Excellent choice. This activity ties ecological concepts directly to real-world field situations.'
        },
        {
          type: 'votretour',
          statement: 'Your turn',
          sub: "You've just seen how ecology connects to sustainability. Now take a moment to think about how this applies to your own teaching.",
          prompts: [
            {
              q: 'Which ecological concept from your course applies most directly to a sustainability issue?',
              placeholder:
                'For example: ecosystem resilience, ecosystem services, population dynamics'
            },
            {
              q: 'How could you bring fieldwork or a real-world case related to sustainability into your next class?',
              placeholder:
                'For example: using a disturbed local ecosystem as a case study for a modeling class'
            }
          ],
          resource: {
            label: 'Further reading from UVED',
            title: 'Ecology & Ecological Transition',
            href: 'https://www.uved.fr/fileadmin/user_upload/Documents/pdf/Fiches/Fiche_Ecologie_et_TEDS.pdf'
          }
        }
      ]
    },
    art: {
      steps: [
        {
          type: 'flip',
          statement: 'Art plays a unique and vital role in the ecological transition.',
          hint: 'Click on each card to discover the connection.',
          cards: [
            {
              verb: 'Shifting perspectives',
              text: 'Art stirs emotions and helps us feel the beauty and fragility of nature, or the violence of environmental change, more deeply. Your students learn to build ecological awareness through aesthetic experience.',
              color: 'ct'
            },
            {
              verb: 'Creating new stories',
              text: 'Art invents stories, images, and symbols that inspire action and open up new possibilities. Your students learn to create works that change how we collectively imagine the world.',
              color: 'cp'
            },
            {
              verb: 'Trying new approaches',
              text: 'Art explores other ways of inhabiting a place, reusing materials, and working with living systems. Your students can rethink their relationship with objects, waste, and technology.',
              color: 'ck'
            },
            {
              verb: 'Encouraging participation',
              text: 'Art brings people together and sparks reactions through collective projects such as murals, performances, and installations. Your students learn to create tools that bring people together and open a dialogue about sustainability.',
              color: 'cy'
            }
          ],
          closing:
            'Art stirs emotions, transforms how we imagine the world, questions how we live, and brings people together around shared stories and experiences. Its contributions to the ecological transition are many and irreplaceable.'
        },
        {
          type: 'competences',
          intro:
            'Studying sustainability through the arts helps your students build essential creative, critical, and civic skills. Here are the most significant ones.',
          featured: [
            {
              name: 'Critical analysis of artworks',
              tag: 'disciplinary',
              tagClass: 'disciplinary',
              concrete:
                'Students explore how artists address ecological issues in different cultural contexts and trace how artistic attitudes toward nature and the built environment have changed over time.'
            },
            {
              name: 'Creativity and innovation',
              tag: 'disciplinary',
              tagClass: 'disciplinary',
              concrete:
                'Students try out new materials (recycled, natural, sustainable) and experiment with low-impact or collaborative art forms tied to sustainability issues.'
            },
            {
              name: 'Critical and ethical thinking',
              tag: 'transversal',
              tagClass: 'transversal',
              concrete:
                'Students analyze the tensions between art, consumer society, and sustainability, and question the environmental impact of their own artistic practice (transportation, exhibitions, distribution).'
            }
          ],
          also: [
            'Representing the complexity of ecological issues',
            'Imagining new ways of seeing and representing the world',
            'Leading collective art projects that build engagement',
            'Contributing to ecological awareness initiatives through the arts',
            'Turning complex issues into sensory, accessible forms',
            'Using art to bring people together and share knowledge'
          ]
        },
        {
          type: 'activities',
          intro: 'Here are practical activities you can add to a class you already teach.',
          apports: [
            {
              label: 'Shifting perspectives',
              color: 'ct',
              acts: [
                {
                  title: 'Analyzing ecological artworks (eco-art, land art)',
                  desc: 'Students analyze works by artists engaged with ecological issues (Andy Goldsworthy, Agnes Denes, Olafur Eliasson). How does each work challenge the way we relate to nature?'
                },
                {
                  title: 'Creating a sound piece from field recordings',
                  desc: "Students record sounds in different places, from heavily altered to nearly untouched environments, and compose a sound piece. It's an exercise in paying close sensory attention to the environment and how it is changing."
                }
              ]
            },
            {
              label: 'Creating new stories',
              color: 'cp',
              acts: [
                {
                  title: 'Creating comic pages about sustainability',
                  desc: 'In multidisciplinary groups, students create comic pages that teach a sustainability issue, combining visual storytelling with scientific knowledge.'
                },
                {
                  title: 'Sharing science through slam poetry',
                  desc: 'Invite a slam poet, or have students write their own slam poem, on a sustainability issue. Students practice turning scientific knowledge into a shared artistic performance.'
                }
              ]
            },
            {
              label: 'Trying new approaches',
              color: 'ck',
              acts: [
                {
                  title: 'Creating with reclaimed materials',
                  desc: 'Students create a visual artwork using only salvaged or natural materials. The workshop explores our relationship with materials, waste, and resources in artistic practice.'
                },
                {
                  title: 'Exploring ecosomatic practices and environmental awareness',
                  desc: 'Movement-based exercises (dance, theater) invite students to sense the natural world within themselves and pay closer attention to their surroundings. The approach sits at the crossroads of dance, theater, and ecology.'
                }
              ]
            },
            {
              label: 'Encouraging participation',
              color: 'cy',
              acts: [
                {
                  title: 'Staging forum theater on a sustainability issue',
                  desc: "Run a forum theater session built around a sustainability scenario. Students perform, then audience members step in. Augusto Boal's method is a powerful way to raise awareness."
                },
                {
                  title: 'Organizing an ecological arts festival or week',
                  desc: 'Organize a week-long program of performances, screenings, workshops, exhibitions, and talks. Student groups produce an artistic piece in the format of their choice.'
                }
              ]
            }
          ],
          feedback:
            'Excellent. This activity brings artistic creation and ecological awareness together in a way you can use right away.'
        },
        {
          type: 'votretour',
          statement: 'Your turn',
          sub: "You've just seen how the arts connect to sustainability. Now take a moment to think about how this applies to your own teaching.",
          prompts: [
            {
              q: 'Which art form in your course could take an ecological issue as its material or subject?',
              placeholder:
                'For example: a creative workshop on the natural world, an analysis of ecological artworks'
            },
            {
              q: 'How could you turn sustainability into a space for artistic experimentation in your course?',
              placeholder:
                'For example: requiring sustainable materials in your next creative workshop'
            }
          ],
          resource: {
            label: 'Further reading from UVED',
            title: 'Art & Ecological Transition',
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
            'Political science is essential for understanding and guiding the ecological transition.',
          hint: 'Click on each card to discover the connection.',
          cards: [
            {
              verb: 'Understanding governance',
              text: 'Who decides, at what level, and how? You teach students to identify the levels of governance (local, national, international) and the stakeholders involved in sustainability decisions.',
              color: 'ct'
            },
            {
              verb: 'Analyzing power relations',
              text: 'The transition to sustainability exposes conflicts of interest among economic, political, and social groups. Your students learn to unpack the trade-offs around natural resources and environmental justice.',
              color: 'cp'
            },
            {
              verb: 'Evaluating public policy',
              text: 'Designing, evaluating, and comparing sustainability policies means asking which instruments to use (taxes, regulations, subsidies) and what works or fails in a given context. That is core to your discipline.',
              color: 'ck'
            },
            {
              verb: 'Analyzing ecological democracy',
              text: 'Your students learn to distinguish and analyze the forms of democracy at work in the transition, such as participatory and deliberative democracy, and to understand the role of citizen movements and new models of shared governance.',
              color: 'cy'
            }
          ],
          closing:
            'The ecological transition is above all a political issue, because it is about how societies organize themselves, make decisions, weigh trade-offs, and change. Your discipline speaks directly to these questions.'
        },
        {
          type: 'competences',
          intro:
            'Studying sustainability through political science helps your students build essential analytical and civic skills. Here are the most significant ones.',
          featured: [
            {
              name: 'Public policy analysis',
              tag: 'disciplinary',
              tagClass: 'disciplinary',
              concrete:
                'Students design and evaluate sustainability policies, compare instruments (carbon taxes, emissions trading, regulation), and identify what works in which context.'
            },
            {
              name: 'Critical analysis of political narratives',
              tag: 'disciplinary',
              tagClass: 'disciplinary',
              concrete:
                'Students identify the narratives, beliefs, and ideologies that shape political decisions on sustainability (green growth versus degrowth) and examine the visions of society behind collective choices.'
            },
            {
              name: 'Citizenship and engagement',
              tag: 'transversal',
              tagClass: 'transversal',
              concrete:
                'Students learn about the role of citizen movements and new models of shared governance, and build the capacity to take part in democratic debate on ecological issues.'
            }
          ],
          also: [
            'Identifying stakeholders in multi-level governance',
            'Analyzing power relations between political, economic, and social stakeholders',
            'Understanding how international negotiations work (COP, SDGs)',
            'Connecting environmental justice, social justice, and development',
            'Studying transitions through a Global North–South lens',
            'Analyzing sustainability policy instruments'
          ]
        },
        {
          type: 'activities',
          intro: 'Here are practical activities you can add to a class you already teach.',
          apports: [
            {
              label: 'Understanding governance',
              color: 'ct',
              acts: [
                {
                  title: 'Simulating an international climate negotiation (COP)',
                  desc: 'Students represent different countries in a climate negotiation. They feel the pull between cooperation and conflict firsthand as they negotiate commitments based on their national interests.'
                },
                {
                  title: 'Analyzing the multi-level governance of a climate policy',
                  desc: "Students examine how a climate policy (for example, France's Climate and Resilience Law) links European, national, and local levels, and identify the stakeholders, tensions, and room to maneuver."
                }
              ]
            },
            {
              label: 'Analyzing power relations',
              color: 'cp',
              acts: [
                {
                  title: 'Case study: conflicts over a natural resource',
                  desc: 'Students analyze a real conflict over the use of a resource (water, energy, farmland, coastline). Who are the stakeholders? What are their interests? What regulations apply?'
                },
                {
                  title: 'Debate: North–South climate justice',
                  desc: '“Do developed countries bear a special responsibility for the global transition to sustainability?” A structured debate grounded in data on historical responsibility and current vulnerability.'
                }
              ]
            },
            {
              label: 'Evaluating public policy',
              color: 'ck',
              acts: [
                {
                  title: 'Evaluating the effectiveness of carbon pricing',
                  desc: "Using real cases (Sweden's carbon tax, the EU carbon market), students analyze what makes a market-based instrument succeed or fail."
                },
                {
                  title: 'Comparing the same sustainability policy in two countries',
                  desc: 'Students compare the same sustainability policy (building renovation, transportation, energy) in two countries: contexts, instruments, results, and lessons learned.'
                }
              ]
            },
            {
              label: 'Analyzing ecological democracy',
              color: 'cy',
              acts: [
                {
                  title: "Analyzing France's Citizens' Convention for Climate",
                  desc: "Students study the process and outcomes of France's Citizens' Convention for Climate. How does deliberative democracy work in practice? Which proposals were adopted, and why?"
                },
                {
                  title: 'Debate: are democracy and climate urgency compatible?',
                  desc: '“Can democratic timelines keep pace with the urgency of the climate crisis?” A philosophical and political debate on the tension between legitimacy and effectiveness.'
                }
              ]
            }
          ],
          feedback:
            'Good choice. This activity applies political science tools directly to current sustainability issues.'
        },
        {
          type: 'votretour',
          statement: 'Your turn',
          sub: "You've just seen how political science connects to sustainability. Now take a moment to think about how this applies to your own teaching.",
          prompts: [
            {
              q: 'Which concept or case from your course connects most directly to an environmental governance issue?',
              placeholder:
                'For example: public policy, participatory democracy, international relations'
            },
            {
              q: 'How could you bring a real environmental policy case into your next class?',
              placeholder:
                'For example: analyzing a recent climate policy decision, simulating an international negotiation'
            }
          ],
          resource: {
            label: 'Further reading from UVED',
            title: 'Political Science & Ecological Transition',
            href: 'https://www.uved.fr/fileadmin/user_upload/Documents/pdf/Fiches/Fiche_Science_politique_et_TEDS.pdf'
          }
        }
      ]
    },
    physics: {
      steps: [
        {
          type: 'flip',
          statement: 'Physics is fundamental to the ecological transition.',
          hint: 'Click on each card to discover the connection.',
          cards: [
            {
              verb: 'Understanding the Earth system',
              text: "You teach students about the Earth's radiation balance, the greenhouse effect, and atmospheric and ocean circulation. This is the foundation for understanding climate change, identifying tipping points, and forecasting extreme weather.",
              color: 'ct'
            },
            {
              verb: 'Developing sustainable energy',
              text: 'Harnessing wind, solar radiation, or geothermal heat, storing energy, and optimizing smart grids: these are physics problems your students learn to solve.',
              color: 'cp'
            },
            {
              verb: 'Designing sustainable materials',
              text: 'Materials built for a changing climate, recycling processes, and alternatives to critical or finite materials: materials physics is a major lever for the transition.',
              color: 'ck'
            },
            {
              verb: 'Taking a critical view',
              text: 'With orders of magnitude and models, physics lets us assess the limits of some technological solutions and make the case for sufficiency.',
              color: 'cy'
            }
          ],
          closing:
            'Physics explains how the planet works, provides the tools for low-carbon solutions, and gives you the means to measure their limits. All of this is already part of your discipline; the point is to make it visible.'
        },
        {
          type: 'competences',
          intro:
            'Studying sustainability through physics helps your students build skills that go well beyond calculation. Here are the most significant ones.',
          featured: [
            {
              name: 'Systems thinking',
              tag: 'transversal',
              tagClass: 'transversal',
              concrete:
                'Students connect climate, energy, resources, and technology, identify feedback loops in biophysical systems, and consider the full life cycle of a material or process.'
            },
            {
              name: 'Critical analysis',
              tag: 'transversal',
              tagClass: 'transversal',
              concrete:
                'Students produce a risk–benefit analysis of a technological solution, question the assumptions behind a model, assess uncertainty, and weigh efficiency against sufficiency.'
            },
            {
              name: 'Scientific responsibility and engagement',
              tag: 'transversal',
              tagClass: 'transversal',
              concrete:
                'Students reflect on how the technologies they study are used and on what scientific and technical choices mean for society, and see themselves as future contributors to the transition.'
            }
          ],
          also: [
            'Linking climate, energy, resources, and technology',
            'Thinking in terms of material life cycles',
            'Combining physics with economics, biology, and the social sciences',
            'Understanding sociotechnical systems',
            'Engaging with other disciplines',
            'Weighing ethical questions'
          ]
        },
        {
          type: 'activities',
          intro: 'Here are practical activities you can add to a class you already teach.',
          apports: [
            {
              label: 'Understanding the Earth system',
              color: 'ct',
              acts: [
                {
                  title: 'Building a simplified radiation balance of the Earth',
                  desc: "Students use the radiation laws they already know to calculate the Earth's equilibrium temperature with and without the greenhouse effect, and to see how rising CO₂ concentrations change the result."
                },
                {
                  title: 'Analyzing ocean circulation data',
                  desc: 'Using real data (temperature, salinity, sea level), students identify how the ocean stores heat and how its circulation changes with climate change.'
                }
              ]
            },
            {
              label: 'Developing sustainable energy',
              color: 'cp',
              acts: [
                {
                  title: 'Comparing ways of generating electricity',
                  desc: 'Students calculate the power, efficiency, and emissions of several technologies (wind, solar, nuclear, gas) and discuss the physical constraints of each.'
                },
                {
                  title: 'Studying the performance of a solar cell',
                  desc: 'Students use the current–voltage characteristic of a solar cell to determine its efficiency and identify the factors that limit it.'
                }
              ]
            },
            {
              label: 'Designing sustainable materials',
              color: 'ck',
              acts: [
                {
                  title: 'Comparing the life cycle of two materials',
                  desc: 'Students compare two materials (for example, two insulation materials) on manufacturing energy, performance, and end of life, to discuss what makes a choice truly sustainable.'
                },
                {
                  title: 'Finding alternatives to a critical material',
                  desc: 'Students identify a critical or finite material in a technology (battery, magnet) and discuss alternative processes, their performance, and their limits.'
                }
              ]
            },
            {
              label: 'Taking a critical view',
              color: 'cy',
              acts: [
                {
                  title: 'Using orders of magnitude to estimate emission cuts in a sector',
                  desc: 'Students calculate how much several levers can realistically deliver (efficiency, new propulsion technologies, sufficiency) to cut emissions from transportation or aviation.'
                },
                {
                  title: 'Assessing the physical footprint of digital technology',
                  desc: 'Students estimate the energy and materials used by an everyday digital activity (streaming, data storage) and debate what technological solutions can and cannot solve.'
                }
              ]
            }
          ],
          feedback:
            'Very good. This activity applies physics tools directly to real sustainability challenges.'
        },
        {
          type: 'votretour',
          statement: 'Your turn',
          sub: "You've just seen how physics connects to sustainability. Now take a moment to think about how this applies to your own teaching.",
          prompts: [
            {
              q: 'Which chapter of your course connects most directly to an energy or climate issue?',
              placeholder: 'For example: thermodynamics, radiation, waves, fluid mechanics'
            },
            {
              q: 'How could you bring a sustainability-related order-of-magnitude calculation into your next class?',
              placeholder: 'For example: estimating the solar panel area needed to power a building'
            }
          ],
          resource: {
            label: 'Further reading from UVED',
            title: 'Physics & Ecological Transition',
            href: 'https://www.uved.fr/fileadmin/user_upload/Documents/pdf/Fiches/Fiche_Physique_et_TEDS.pdf'
          }
        }
      ]
    },
    anthropology: {
      steps: [
        {
          type: 'flip',
          statement:
            'Anthropology helps us understand the human side of the ecological transition.',
          hint: 'Click on each card to discover the connection.',
          cards: [
            {
              verb: 'Revealing the diversity of relationships with nature',
              text: 'You teach your students that relationships between humans and non-humans vary across cultural, geographical, and historical contexts. Other ways of inhabiting the world exist, and so do other values placed on nature.',
              color: 'ct'
            },
            {
              verb: 'Understanding local and Indigenous knowledge',
              text: 'Plants, animals, the rhythms of nature: your students discover how this knowledge is produced and passed on, and what it can contribute to fields such as agroecology or ecosystem conservation.',
              color: 'cp'
            },
            {
              verb: 'Describing ways of life',
              text: 'Social organization, governance, techniques, environmental knowledge: your students learn to observe how societies live with their environment and how they adapt to global change.',
              color: 'ck'
            },
            {
              verb: 'Opening up other perspectives',
              text: 'Anthropology invites us to step back from ideas of growth, progress, and development, and lends legitimacy to other goals such as sufficiency or “living well.”',
              color: 'cy'
            }
          ],
          closing:
            "Anthropology helps shape policies and actions grounded in people's lives, for a fair and effective ecological transition."
        },
        {
          type: 'competences',
          intro:
            'Studying sustainability through anthropology helps your students build essential analytical, dialogue, and ethical skills. Here are the most significant ones.',
          featured: [
            {
              name: 'Analysis of how people represent nature',
              tag: 'disciplinary',
              tagClass: 'disciplinary',
              concrete:
                'Students describe the diversity of relationships with the natural world, interpret the beliefs, stories, and value systems associated with nature, and analyze how they shape ways of life.'
            },
            {
              name: 'Supporting change and fostering dialogue',
              tag: 'transversal',
              tagClass: 'transversal',
              concrete:
                'Students identify the social barriers to and drivers of engagement with ecological issues, translate complex knowledge for different audiences, and bring local knowledge into decision-making.'
            },
            {
              name: 'Ethical and responsible fieldwork',
              tag: 'disciplinary',
              tagClass: 'disciplinary',
              concrete:
                'Students use participant observation, interviews, and ethnographic surveys, and examine their own position, their biases, and historical power imbalances.'
            }
          ],
          also: [
            'Defining different types of knowledge (local, academic)',
            'Questioning development models and discourses',
            'Seeing how ecological, social, economic, and political factors interact',
            'Facilitating dialogue between stakeholders with different interests',
            'Collaborating with other disciplines',
            'Getting involved in action research'
          ]
        },
        {
          type: 'activities',
          intro: 'Here are practical activities you can add to a class you already teach.',
          apports: [
            {
              label: 'Revealing the diversity of relationships with nature',
              color: 'ct',
              acts: [
                {
                  title: 'Comparing two conceptions of nature',
                  desc: 'Using excerpts from ethnographies, students analyze two societies with contrasting relationships with nature. They identify what each conception means for how people inhabit the world and use resources.'
                },
                {
                  title: 'Analyzing the values attached to biodiversity',
                  desc: 'Students examine how different groups (residents, scientists, NGOs, land managers) value the same species or protected area, and why those values sometimes clash.'
                }
              ]
            },
            {
              label: 'Understanding local and Indigenous knowledge',
              color: 'cp',
              acts: [
                {
                  title: 'Studying a case of knowledge co-production',
                  desc: 'Students analyze an example where Indigenous and scientific knowledge were brought together to respond to global change: who produced what, how the different kinds of knowledge interacted, and what difficulties arose.'
                },
                {
                  title: 'Discussing the role of traditional knowledge in a project',
                  desc: 'Students examine an environmental management or restoration project and discuss how to include local knowledge, under what conditions, and with what ethical precautions.'
                }
              ]
            },
            {
              label: 'Describing ways of life',
              color: 'ck',
              acts: [
                {
                  title: 'Running a mini-survey on how people use a place',
                  desc: 'Students carry out a few interviews or observations with people who use a place (community garden, river, coastline) to describe their practices, their knowledge, and their relationship with the environment.'
                },
                {
                  title: 'Analyzing how a way of life adapts to global change',
                  desc: 'Drawing on a field case studied in class, students describe how the social organization and techniques of a community change in response to environmental change.'
                }
              ]
            },
            {
              label: 'Opening up other perspectives',
              color: 'cy',
              acts: [
                {
                  title: 'Debate: growth, sufficiency, or living well?',
                  desc: 'Drawing on societies studied in class, students debate what progress and development mean, and what other paths could look like.'
                },
                {
                  title: 'Questioning your own fieldwork practices',
                  desc: 'Students identify the ecological impact of a fieldwork project (travel, tools, methods) and suggest adjustments, while examining their own stance as researchers.'
                }
              ]
            }
          ],
          feedback:
            'Good choice. This activity applies the tools of anthropology directly to real sustainability situations.'
        },
        {
          type: 'votretour',
          statement: 'Your turn',
          sub: "You've just seen how anthropology connects to sustainability. Now take a moment to think about how this applies to your own teaching.",
          prompts: [
            {
              q: 'Which society, field case, or author from your course best illuminates how people relate to nature?',
              placeholder:
                'For example: a field case studied in class, the nature/culture divide, Indigenous knowledge'
            },
            {
              q: 'How could you bring ecological questions into your next class?',
              placeholder:
                'For example: adding a question on local knowledge or on the values attached to biodiversity'
            }
          ],
          resource: {
            label: 'Further reading from UVED',
            title: 'Anthropology & Ecological Transition',
            href: 'https://www.uved.fr/fileadmin/user_upload/Documents/pdf/Fiches/Fiche_Anthropologie_et_TEDS.pdf'
          }
        }
      ]
    }
  }
};
