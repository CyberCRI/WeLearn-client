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
    title: 'Comment WeLearn peut-il soutenir votre enseignement aujourd’hui ?',
    intro: 'Choisissez ce dont vous avez besoin. Vous pouvez commencer où vous voulez.',
    getStarted: 'Commencer',
    open: 'Ouvrir',
    seePreview: 'Voir l’aperçu',
    allSpaces: 'Tous les espaces enseignant',
    preview: 'Aperçu',
    previewNotice: 'Aperçu : cette fonctionnalité est en cours de conception',
    question: 'Votre question',
    objective: 'Objectif',
    spaces: {
      understand: {
        name: 'Comprendre',
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
        search: 'Rechercher des ressources',
        chat: 'Poser une question'
      },
      design: {
        name: 'Concevoir',
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
            note: 'Idée : après la création d’un syllabus, un bouton « Créer une activité pour ce cours » pourrait ouvrir ce parcours avec le cours déjà renseigné.'
          }
        }
      },
      teach: {
        name: 'Enseigner',
        title: 'L’utiliser avec vos étudiants',
        description:
          'Utilisez une activité en classe, faites le point sur son déroulement et partagez ce qui fonctionne.',
        question: 'Comment l’utiliser avec mes étudiants et continuer à l’améliorer ?',
        objective:
          'Repartir avec quelque chose de concret pour votre classe, tirer les leçons de son déroulement et partager ce qui fonctionne avec d’autres enseignants.',
        steps: {
          use: {
            title: 'Utiliser',
            description: 'Une activité prête à l’emploi à partager avec vos étudiants.'
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
