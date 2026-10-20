// adapted from en.ts (the source language); spaces before « » ? : are non-breaking
export const journey = {
  entry: {
    title: 'Bienvenue sur WeLearn',
    intro: 'Comment allez-vous utiliser WeLearn aujourd’hui ?',
    teaching: {
      title: 'J’enseigne',
      description: 'Intégrez la durabilité dans les cours que vous enseignez.',
      action: 'Ouvrir l’espace enseignant'
    },
    learning: {
      title: 'J’apprends',
      description: 'Développez votre compréhension de la durabilité et appliquez-la à vos études.',
      action: 'Ouvrir l’espace étudiant'
    }
  },
  teach: {
    identity: 'Enseigner la durabilité, avec l’appui de l’IA et ancré dans la recherche.',
    fastLane: {
      title: 'Qu’enseignez-vous ?',
      subtitle:
        'L’IA de WeLearn propose des ressources, des cas réels et des idées d’activités issus d’une bibliothèque de recherche et de supports pédagogiques, toujours avec leurs sources. Vous décidez de ce que vous utilisez.',
      inputLabel: 'Ce que vous enseignez',
      placeholder: 'Économie en première année, introduction aux marchés',
      examples: 'Exemples :',
      chips: {
        law: 'Droit, contrats',
        biology: 'Biologie, écosystèmes',
        engineering: 'Ingénierie, matériaux'
      },
      button: 'Trouver des idées',
      empty: 'Indiquez d’abord ce que vous enseignez.',
      question:
        'J’enseigne {subject}. Propose des ressources, un cas réel et une idée d’activité pour intégrer la durabilité.'
    },
    teds: {
      entry: 'Vous enseignez un cours TEDS ?',
      themes: 'Climat, biodiversité, ressources, transition juste',
      start: 'Commencer ici',
      title: 'Accompagner les cours TEDS',
      intro:
        'Les cours TEDS initient les étudiants à la transition écologique pour un développement soutenable. WeLearn vous aidera à en préparer un, thème par thème.',
      question: 'Comment WeLearn peut-il m’aider à préparer un cours TEDS ?',
      objective:
        'Préparer un cours TEDS avec des ressources, des cas réels et des activités sur ses grands thèmes, adaptés à vos étudiants.',
      themesTitle: 'Les grands thèmes',
      themeList: {
        climate: 'Climat',
        biodiversity: 'Biodiversité',
        resources: 'Ressources',
        justTransition: 'Transition juste'
      },
      howTitle: 'Comment WeLearn vous accompagnera',
      how: {
        understand: 'Comprendre ce qu’on attend d’un cours TEDS et son lien avec votre discipline.',
        explore:
          'Trouver des travaux de recherche, des rapports et des cas réels pour chaque thème.',
        design:
          'Obtenir un brouillon IA de votre syllabus et de vos activités, que vous relisez et adaptez.',
        teach: 'Partager les activités avec vos étudiants et les améliorer après le cours.'
      }
    },
    chooseTitle: 'Ou choisissez ce dont vous avez besoin',
    journeyNav: 'Espace enseignant',
    ai: {
      draft: 'Brouillon IA',
      adapted: 'Adapté par l’IA à partir de documents'
    },
    getStarted: 'Commencer',
    open: 'Ouvrir',
    seePreview: 'Voir l’aperçu',
    allSpaces: 'Tous les espaces enseignant',
    preview: 'Aperçu',
    previewNotice: 'Aperçu : cette fonctionnalité est en cours de conception',
    question: 'Votre question',
    objective: 'Objectif',
    designNote: 'Note de conception',
    exampleLabel: 'Exemple · rédigé pour ce prototype, pas issu des sources de WeLearn',
    ask: {
      title: 'Demandez à WeLearn',
      intro: 'À chaque étape, l’assistant WeLearn répond à vos questions. Essayez :',
      sourcesNote:
        'Les réponses s’appuient sur la bibliothèque de ressources de WeLearn sur la durabilité, avec leurs sources.'
    },
    spaces: {
      understand: {
        name: 'Comprendre',
        cardQuestion: 'Quel est le rapport entre la durabilité et ma discipline ?',
        cardOutcome: 'Vous repartez avec une vision claire pour votre domaine',
        ask: {
          q1: 'Que signifie la durabilité pour ma discipline ?',
          q2: 'Qu’attendent les ODD et GreenComp des enseignants du supérieur ?'
        },
        title: 'Pourquoi la durabilité compte pour votre enseignement',
        description:
          'Quatre modules courts sur ce que signifie la durabilité et son lien avec votre discipline.',
        modules: {
          foundations: {
            title: 'Les fondamentaux de la durabilité',
            question: 'Qu’entend-on vraiment par durabilité et transition écologique ?',
            objective:
              'Construire une compréhension commune de base de la durabilité, de la transition écologique et de l’éducation au développement durable.'
          },
          frameworks: {
            title: 'Cadres de référence : ODD et GreenComp',
            question:
              'Que sont les ODD et GreenComp, et pourquoi comptent-ils pour l’enseignement ?',
            objective:
              'Découvrir les principaux cadres sans lire de longs documents officiels, souvent abstraits.'
          },
          teds: {
            title: 'La durabilité dans l’enseignement supérieur (TEDS)',
            question: 'Pourquoi me demande-t-on d’intégrer cela dans mon enseignement ?',
            objective:
              'Comprendre le contexte de l’enseignement supérieur, en particulier les attentes françaises en matière de TEDS.'
          },
          discipline: {
            title: 'La durabilité dans votre discipline',
            question: 'Quel est le rapport avec ma discipline ?',
            objective: 'Voir comment votre discipline est déjà liée à la durabilité.'
          }
        }
      },
      explore: {
        name: 'Explorer',
        cardQuestion: 'Où trouver de bons supports pour mon cours ?',
        cardOutcome: 'Vous repartez avec des ressources et des cas réels',
        ask: {
          q1: 'Trouve des études de cas sur la gestion de l’eau que je pourrais utiliser en cours.',
          q2: 'Que dit la recherche récente sur la pollution plastique des rivières ?'
        },
        title: 'Trouver des ressources pour vos cours',
        description:
          'Des ressources scientifiques et pédagogiques liées à votre cours, selon deux angles.',
        question:
          'Quelles connaissances, quels exemples et quelles ressources pédagogiques sur la durabilité peuvent enrichir ce que j’enseigne déjà ?',
        objective:
          'Découvrir des ressources académiques, institutionnelles et pédagogiques fiables liées à votre cours, et voir comment elles peuvent servir votre enseignement.',
        lenses: {
          learn: {
            title: 'Se documenter sur le sujet',
            description:
              'Recherche, rapports et vulgarisation scientifique, pour être à l’aise avec le contenu.'
          },
          teach: {
            title: 'Enseigner le sujet',
            description:
              'Ressources éducatives, activités et études de cas, pour transformer le contenu en enseignement.'
          }
        },
        results: {
          teachingResources: {
            title: 'Ressources pédagogiques',
            description: 'Des supports prêts à l’emploi issus de sources éducatives.',
            exampleTitle: 'Jeu de rôle sur le risque climatique : un plan de cours prêt à l’emploi',
            exampleMeta: 'Plan de cours · source éducative',
            exampleDescription:
              'Un jeu de rôle de 90 minutes où les étudiants négocient l’adaptation d’une région à des inondations plus fréquentes.'
          },
          researchCases: {
            title: 'Cas issus de la recherche',
            description:
              'Des supports pédagogiques extraits par l’IA de documents scientifiques et institutionnels.',
            exampleTitle: 'Qui paie le risque d’inondation ? Le cas d’une ville côtière',
            exampleMeta: 'Étude de cas',
            exampleDescription:
              'Les étudiants jouent un conseil municipal qui arbitre entre digues, assurance et relocalisation planifiée pour un quartier côtier.',
            sourceNote:
              'Exemple inventé. Une version réelle serait adaptée par l’IA à partir d’un document tel que le',
            source: 'Sixième rapport d’évaluation du GIEC, groupe de travail II (2022)'
          }
        },
        search: 'Rechercher des ressources'
      },
      design: {
        name: 'Concevoir',
        cardQuestion: 'Comment l’intégrer à mon cours ?',
        cardOutcome: 'Vous repartez avec un brouillon de syllabus ou d’activité',
        ask: {
          q1: 'Aide-moi à créer une activité sur le risque climatique pour mon cours d’économie.',
          q2: 'Comment évaluer la pensée systémique dans un projet de groupe étudiant ?'
        },
        title: 'L’intégrer à votre cours',
        description: 'Concevez votre cours, ou transformez un lien avec la durabilité en activité.',
        modules: {
          course: {
            title: 'Concevoir votre cours',
            question:
              'Comment créer ou adapter mon cours pour y intégrer la durabilité de façon pertinente ?',
            objective:
              'Structurer la durabilité dans un cours nouveau ou existant : contenus, objectifs d’apprentissage, compétences, approches pédagogiques et évaluation.'
          },
          activity: {
            title: 'Concevoir une activité',
            question:
              'Comment transformer un lien avec la durabilité en une activité qui a du sens pour mes étudiants ?',
            objective:
              'Créer une activité d’apprentissage qui relie votre matière à des objectifs d’apprentissage en durabilité, avec des méthodes pédagogiques adaptées.',
            steps: {
              context: 'Contexte d’enseignement',
              connection: 'Lien avec la durabilité',
              intention: 'Intention d’apprentissage',
              type: 'Type d’activité',
              resources: 'Ressources de WeLearn',
              draft: 'Brouillon d’activité'
            },
            example: {
              title:
                'Exemple de brouillon d’activité : le risque climatique dans un cours d’économie',
              startsFrom: 'Part de l’exemple « Cas issus de la recherche » d’EXPLORER.',
              intention:
                'Les étudiants savent expliquer comment le risque climatique est évalué financièrement, et qui en supporte le coût quand il ne l’est pas.',
              type: 'Jeu de rôle en petits groupes, 90 minutes',
              resourcesLabel: 'Deux ressources WeLearn',
              resource1:
                'Cas issu de la recherche : « Qui paie le risque d’inondation ? Le cas d’une ville côtière »',
              resource2:
                'Ressource pédagogique : plan de cours « Jeu de rôle sur le risque climatique »',
              assessmentLabel: 'Idée d’évaluation',
              assessment:
                'Chaque groupe rédige une recommandation d’une page au conseil, évaluée sur son raisonnement économique et sur la place faite aux personnes qui supportent le risque.'
            },
            note: 'Idée : après la création d’un syllabus, un bouton « Créer une activité pour ce cours » pourrait ouvrir ce parcours avec le cours déjà renseigné.'
          }
        }
      },
      teach: {
        name: 'Enseigner',
        cardQuestion: 'Comment l’utiliser avec mes étudiants ?',
        cardOutcome: 'Vous repartez avec un lien pour votre classe et des idées d’amélioration',
        ask: {
          q1: 'Mes étudiants ont trouvé cette activité trop abstraite. Comment l’améliorer ?',
          q2: 'Comment organiser un débat sur la transition énergétique avec 60 étudiants ?'
        },
        title: 'L’utiliser avec vos étudiants',
        description:
          'Utilisez une activité en classe, faites le point sur son déroulement et partagez ce qui fonctionne.',
        question: 'Comment l’utiliser avec mes étudiants et continuer à l’améliorer ?',
        objective:
          'Repartir avec quelque chose de concret pour votre classe, tirer les leçons de son déroulement et partager ce qui fonctionne avec d’autres enseignants.',
        steps: {
          use: {
            title: 'Utiliser',
            description:
              'Une activité prête pour la classe. Partagez-la avec vos étudiants grâce à un simple lien.'
          },
          reflect: {
            title: 'Faire le point',
            description: 'Ce qui a fonctionné, et ce qu’il faut améliorer la prochaine fois.'
          },
          share: {
            title: 'Partager',
            description: 'Des bonnes pratiques et une communauté d’enseignants.'
          }
        }
      }
    }
  }
};
