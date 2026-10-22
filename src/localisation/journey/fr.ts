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
    title: 'Par où voulez-vous commencer ?',
    intro:
      'Explorez la durabilité, découvrez des ressources pertinentes et utilisez l’IA de WeLearn pour soutenir votre enseignement.',
    teds: {
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
    courseStart: {
      question: 'Avez-vous déjà un cours ?',
      yes: 'Oui, j’ai un cours',
      no: 'Non, je pars de zéro',
      working: 'Vous partez d’un cours existant',
      change: 'Modifier',
      changeWarning:
        'Changer de parcours effacera votre syllabus et ce que vous avez relu jusqu’ici dans cet onglet.',
      discard: 'Effacer et changer',
      keepWorking: 'Continuer',
      newCourse:
        'La conception d’un nouveau cours à partir de zéro est en cours de développement. Elle n’est pas encore disponible.'
    },
    adapt: {
      title: 'Adapter mon cours existant',
      intro:
        'Partez de votre syllabus. WeLearn le lit, puis vous vérifiez et corrigez ce qu’il a compris avant toute autre étape.',
      aiRead: 'Lu par l’IA',
      upload: {
        title: 'Votre syllabus',
        dropzone: 'Déposez ici votre syllabus ou plan de cours, ou',
        browse: 'parcourez vos fichiers',
        limits: 'Un fichier · PDF, DOCX ou TXT · 5 Mo maximum',
        remove: 'Retirer {name}',
        languageLabel: 'Langue du cours',
        notice: 'Votre syllabus sera envoyé à WeLearn pour une analyse par l’IA.',
        read: 'Lire mon syllabus',
        retry: 'Réessayer',
        or: 'ou',
        example: 'Essayer avec un exemple de syllabus',
        exampleHint:
          'Une démonstration avec un cours fictif. Rien n’est envoyé ni analysé par l’IA.',
        pasteToggle: 'Ou collez le texte de votre syllabus',
        pasteLabel: 'Votre syllabus ou la description de votre cours',
        pasteUse: 'Utiliser mon texte',
        pasteHint:
          'Votre texte reste dans cet onglet du navigateur. Il n’est ni envoyé ni analysé par l’IA : vous remplissez votre cours à partir de lui.',
        errors: {
          BIG_FILE: 'Ce fichier dépasse 5 Mo.',
          BAD_EXTENSION: 'Utilisez un fichier PDF, DOCX ou TXT.'
        }
      },
      reading: {
        sending: 'Envoi de votre syllabus',
        sent: 'Syllabus envoyé',
        reading: 'Lecture des informations de votre cours',
        review: 'Prêt pour votre relecture',
        elapsed: '{seconds} s',
        cancel: 'Annuler'
      },
      unavailable: {
        title: 'WeLearn n’a pas pu être joint',
        text: 'Votre syllabus n’a pas été analysé. Veuillez réessayer dans un instant.'
      },
      error: {
        title: 'WeLearn n’a pas pu lire ce syllabus',
        text: 'Veuillez réessayer ou choisir un autre fichier.'
      },
      review: {
        exampleBanner:
          'Démonstration : un exemple de syllabus fictif. Rien n’a été analysé par l’IA.',
        pastedBanner:
          'Votre texte collé reste dans cet onglet du navigateur. Il n’a été ni envoyé ni analysé par l’IA : remplissez votre cours à partir de lui.',
        pastedName: 'Texte collé',
        notFilled: 'Pas encore renseigné.',
        noObjectivesYet: 'Aucun objectif d’apprentissage ajouté pour le moment.',
        original: 'Document original',
        originalNote: 'Conservé tel quel sur votre appareil.',
        openOriginal: 'Ouvrir l’original',
        title: 'Vérifions votre cours',
        intro:
          'WeLearn a repéré des informations dans votre syllabus. Relisez-les avant d’explorer les liens avec la durabilité.',
        showDocument: 'Afficher le texte',
        detected: {
          syllabus: 'Reconnu comme un syllabus',
          article: 'Ce document ressemble à un article, pas à un syllabus',
          unknown: 'WeLearn n’est pas sûr qu’il s’agisse d’un syllabus',
          none: 'Aucun texte n’a pu être lu dans ce fichier'
        },
        notSyllabusHint:
          'Pour de meilleurs résultats, déposez votre syllabus ou votre plan de cours.',
        overview: 'Aperçu du cours',
        overviewKeys: {
          title: 'Titre du cours',
          disciplineLevel: 'Discipline et niveau',
          topics: 'Principaux thèmes'
        },
        description: 'Description issue de votre syllabus',
        showMore: 'Afficher tout le texte',
        showLess: 'Afficher moins',
        objectives: 'Objectifs d’apprentissage',
        programmeHint:
          'Certains syllabus listent aussi des objectifs du diplôme ou de la formation. Signalez-les pour les distinguer des objectifs propres à ce cours.',
        markProgramme: 'Objectif de la formation',
        programmeTitle: 'Objectifs de la formation (signalés par vous)',
        unmarkProgramme: 'Remettre dans les objectifs du cours',
        origin: {
          extracted: 'Issu de votre syllabus',
          extractedExample: 'Issu de l’exemple',
          edited: 'Corrigé par vous',
          added: 'Ajouté par vous'
        },
        notFound: 'Introuvable dans votre syllabus.',
        noObjectives: 'Aucun objectif d’apprentissage n’a été trouvé dans votre syllabus.',
        add: 'Ajouter',
        edit: 'Modifier',
        save: 'Enregistrer',
        cancel: 'Annuler',
        remove: 'Retirer',
        showOriginal: 'Voir l’original',
        hideOriginal: 'Masquer l’original',
        restore: 'Rétablir l’original',
        addObjective: 'Ajouter un objectif d’apprentissage',
        more: 'Plus de détails (facultatif)',
        moreHint:
          'WeLearn ne lit pas encore ces éléments. N’ajoutez que ce qui compte pour votre cours.',
        extras: {
          workload: 'Volume horaire (heures, ECTS)',
          sessions: 'Séances ou thèmes',
          assessment: 'Évaluation'
        },
        localNote:
          'Vos modifications restent dans cet onglet du navigateur. Elles ne sont ni enregistrées ni envoyées.',
        confirm: 'Confirmer le cours',
        confirmed:
          'Cours confirmé dans cet onglet. Prochaine étape, les liens avec la durabilité : bientôt disponible.',
        startOver: 'Recommencer'
      },
      example: {
        fileName: 'exemple-syllabus-microeconomie.txt',
        document:
          'EXEMPLE DE SYLLABUS (fictif, rédigé pour ce prototype)\n\nIntroduction à la microéconomie\nLicence 1 · 5 ECTS · 12 séances de 3 heures\n\nDescription du cours\nCe cours présente les outils de base de l’analyse microéconomique. Les étudiants étudient comment les ménages et les entreprises prennent leurs décisions et comment les marchés allouent les ressources.\n\nAcquis d’apprentissage\nÀ la fin du cours, les étudiants seront capables de :\n1. Expliquer la loi de l’offre et de la demande.\n2. Calculer et interpréter l’élasticité-prix.\n3. Analyser l’équilibre de marché et les effets des taxes.\n\nPlan des séances\nSéances 1–2 : offre et demande\nSéances 3–4 : élasticité\nSéances 5–8 : équilibre de marché et taxes\nSéances 9–12 : défaillances de marché\n\nÉvaluation\nExamen de mi-semestre 40 %, projet de groupe 20 %, examen final 40 %.',
        description:
          'Ce cours présente les outils de base de l’analyse microéconomique. Les étudiants étudient comment les ménages et les entreprises prennent leurs décisions et comment les marchés allouent les ressources.',
        objectives: {
          o1: 'Expliquer la loi de l’offre et de la demande.',
          o2: 'Calculer et interpréter l’élasticité-prix.',
          o3: 'Analyser l’équilibre de marché et les effets des taxes.'
        }
      }
    },
    spaces: {
      understand: {
        name: 'Comprendre',
        title: 'Pourquoi la durabilité compte pour votre enseignement',
        pageTitle: 'Pourquoi la durabilité compte pour votre enseignement',
        intro:
          'Comprenez l’éducation à la durabilité et découvrez son lien avec ce que vous enseignez.',
        description: 'Découvrez l’essentiel de la durabilité et son lien avec votre discipline.',
        modules: {
          foundations: {
            title: 'Les fondamentaux de la durabilité',
            summary:
              'Comprendre les notions clés de la durabilité, l’EDD et la TEDS dans l’enseignement supérieur.',
            question: 'Qu’entend-on vraiment par durabilité et transition écologique ?',
            objective:
              'Construire une compréhension commune de base de la durabilité, de la transition écologique et de l’éducation au développement durable.'
          },
          frameworks: {
            title: 'Cadres de référence en durabilité',
            summary:
              'Découvrir les ODD et GreenComp, et comment ils peuvent éclairer votre enseignement.',
            question:
              'Que sont les ODD et GreenComp, et pourquoi comptent-ils pour l’enseignement ?',
            objective:
              'Découvrir les principaux cadres sans lire de longs documents officiels, souvent abstraits.'
          },
          teds: {
            title: 'La durabilité dans l’enseignement supérieur (TEDS)',
            summary:
              'Pourquoi la durabilité fait partie de l’enseignement supérieur, en particulier les attentes françaises en matière de TEDS.',
            question: 'Pourquoi me demande-t-on d’intégrer cela dans mon enseignement ?',
            objective:
              'Comprendre le contexte de l’enseignement supérieur, en particulier les attentes françaises en matière de TEDS.'
          },
          discipline: {
            title: 'La durabilité dans votre discipline',
            summary:
              'Explorer des liens pertinents entre la durabilité et les matières que vous enseignez.',
            question: 'Quel est le rapport avec ma discipline ?',
            objective: 'Voir comment votre discipline est déjà liée à la durabilité.'
          }
        }
      },
      explore: {
        name: 'Explorer',
        ask: {
          q1: 'Trouve des études de cas sur la gestion de l’eau que je pourrais utiliser en cours.',
          q2: 'Que dit la recherche récente sur la pollution plastique des rivières ?'
        },
        title: 'Trouver des ressources pour vos cours',
        pageTitle: 'Trouver des ressources pour vos cours',
        intro:
          'Explorez des travaux de recherche, des connaissances fiables et des supports pédagogiques en lien avec votre discipline.',
        description:
          'Découvrez des ressources scientifiques et pédagogiques adaptées à votre cours.',
        question:
          'Quelles connaissances, quels exemples et quelles ressources pédagogiques sur la durabilité peuvent enrichir ce que j’enseigne déjà ?',
        objective:
          'Découvrir des ressources académiques, institutionnelles et pédagogiques fiables liées à votre cours, et voir comment elles peuvent servir votre enseignement.',
        lenses: {
          learn: {
            title: 'Se documenter sur un sujet',
            description:
              'Trouvez des travaux de recherche, des rapports et des explications fiables.'
          },
          teach: {
            title: 'Trouver des supports pédagogiques',
            description: 'Découvrez des cas, des activités et des ressources éducatives.'
          }
        },
        results: {
          title: 'Deux types de supports pédagogiques',
          note: 'Exemples inventés pour montrer à quoi ressembleront les résultats. Ce ne sont pas des résultats de recherche réels.',
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
        title: 'Intégrer la durabilité dans votre enseignement',
        pageTitle: 'Intégrer la durabilité dans votre enseignement',
        intro:
          'Adaptez un cours ou concevez une activité d’apprentissage qui relie la durabilité à ce que vous enseignez.',
        description: 'Adaptez un cours ou concevez une activité d’apprentissage.',
        modules: {
          course: {
            title: 'Concevoir votre cours',
            summary:
              'Créez un nouveau cours ou adaptez un cours existant pour y intégrer la durabilité.',
            question:
              'Comment créer ou adapter mon cours pour y intégrer la durabilité de façon pertinente ?',
            objective:
              'Structurer la durabilité dans un cours nouveau ou existant : contenus, objectifs d’apprentissage, compétences, approches pédagogiques et évaluation.'
          },
          activity: {
            title: 'Concevoir une activité',
            summary:
              'Concevez une activité d’apprentissage qui relie la durabilité à ce que vous enseignez.',
            question:
              'Comment transformer un lien avec la durabilité en une activité qui a du sens pour mes étudiants ?',
            objective:
              'Créer une activité d’apprentissage qui relie votre matière à des objectifs d’apprentissage en durabilité, avec des méthodes pédagogiques adaptées.',
            intro:
              'Transformez un lien avec la durabilité en une activité qui a du sens pour vos étudiants, en trois temps.',
            parts: {
              context: {
                title: 'Contexte d’enseignement et lien avec la durabilité',
                text: 'Partez de ce que vous enseignez : votre discipline, le niveau de vos étudiants et la question de durabilité à laquelle votre cours se rattache.'
              },
              intention: {
                title: 'Intention d’apprentissage',
                text: 'Précisez ce que vos étudiants doivent savoir faire à la fin de l’activité.'
              },
              develop: {
                title: 'Concevoir et relire une activité',
                text: 'Choisissez un type d’activité et des ressources de WeLearn, puis relisez et adaptez un brouillon avant de l’utiliser avec vos étudiants.'
              }
            },
            steps: {
              context: 'Contexte d’enseignement',
              connection: 'Lien avec la durabilité',
              intention: 'Intention d’apprentissage',
              type: 'Type d’activité'
            },
            example: {
              title: 'Exemple : le risque climatique dans un cours d’économie',
              context: 'Économie, étudiants de deuxième année de licence',
              connection: 'Le risque climatique, et qui en supporte le coût',
              draftLabel: 'Brouillon d’activité',
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
            note: 'Plus tard, ce parcours pourrait partir d’un cours préparé dans « Concevoir votre cours », avec votre contexte d’enseignement déjà renseigné.'
          }
        }
      },
      teach: {
        name: 'Enseigner',
        ask: {
          q1: 'Mes étudiants ont trouvé cette activité trop abstraite. Comment l’améliorer ?',
          q2: 'Comment organiser un débat sur la transition énergétique avec 60 étudiants ?'
        },
        title: 'L’utiliser avec vos étudiants',
        pageTitle: 'L’utiliser avec vos étudiants',
        intro:
          'Utilisez une activité en classe, faites le point sur son déroulement et partagez ce qui fonctionne.',
        description: 'Mettez les activités en pratique et faites le point sur ce qui fonctionne.',
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
