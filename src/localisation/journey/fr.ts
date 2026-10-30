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
      workingNew: 'Vous partez de zéro',
      change: 'Modifier',
      changeWarning:
        'Changer de parcours effacera votre syllabus et ce que vous avez relu jusqu’ici dans cet onglet.',
      discard: 'Effacer et changer',
      keepWorking: 'Continuer',
      newCourse:
        'La conception d’un nouveau cours à partir de zéro est en cours de développement. Elle n’est pas encore disponible.'
    },
    scratch: {
      brief: {
        title: 'Votre idée de cours',
        intro:
          'Quelques mots suffisent. WeLearn vous propose un cours que vous pourrez garder, modifier ou retirer élément par élément.',
        idea: 'Que souhaitez-vous enseigner ?',
        ideaPlaceholder:
          'Par exemple : une introduction à l’économie de l’environnement pour des étudiant·e·s de première année',
        disciplineLevel: 'Discipline et niveau des étudiant·e·s',
        disciplineLevelPlaceholder: 'Par exemple : Économie, Licence 1',
        format: 'Durée ou format',
        formatPlaceholder: 'Par exemple : 10 séances de 2 h',
        goals: 'Objectifs particuliers ou intérêts en matière de durabilité',
        goalsPlaceholder:
          'Par exemple : que les étudiant·e·s sachent lire de façon critique des données climatiques',
        optional: '(facultatif)',
        notice: 'Votre demande sera envoyée à WeLearn pour une analyse par IA.',
        submit: 'Proposer un cours',
        retry: 'Réessayer'
      },
      drafting: 'WeLearn prépare une proposition de cours à partir de votre demande…',
      unavailable: {
        title: 'WeLearn n’a pas pu être joint',
        text: 'Aucun cours n’a été proposé. Veuillez réessayer dans un instant.'
      },
      error: {
        title: 'WeLearn n’a pas pu proposer de cours cette fois-ci',
        text: 'Veuillez réessayer ou reformuler votre demande.'
      },
      review: {
        title: 'Votre proposition de cours',
        intro:
          'Proposée par WeLearn à partir de votre demande. Gardez, modifiez ou retirez ce que vous voulez avant que WeLearn cherche des ressources.',
        yourBrief: 'Votre demande',
        purpose: 'Finalité du cours',
        activities: 'Activités d’apprentissage',
        assessment: 'Évaluation',
        opportunities: 'Pistes de durabilité',
        opportunitiesHint:
          'Là où la durabilité peut approfondir le cours. WeLearn cherche des ressources pour celles que vous gardez.',
        keep: 'Garder',
        remove: 'Retirer'
      },
      summary: {
        title: 'Votre proposition de cours',
        intro:
          'Proposée par WeLearn et façonnée par vos choix. Modifiez-la dans son ensemble, puis copiez-la.',
        objectives: 'Objectifs d’apprentissage',
        topics: 'Contenus principaux',
        structure: 'Structure des séances',
        activities: 'Activités d’apprentissage',
        assessment: 'Évaluation',
        sustainability: 'Intégration de la durabilité',
        resources: 'Ressources WeLearn :',
        activity: 'Activité :',
        edit: 'Modifier la proposition',
        restore: 'Rétablir la proposition',
        copy: 'Copier la proposition',
        copied: 'Copié'
      }
    },
    practices: {
      title: 'Voir comment d’autres enseignent la durabilité',
      intro:
        'Découvrez comment des enseignant·e·s du supérieur intègrent la durabilité dans leurs cours, avec des exemples concrets, des ressources et des retours d’expérience à adapter.',
      search: 'Rechercher par discipline, thème ou approche pédagogique',
      noMatch: 'Aucune pratique ne correspond à cette recherche.',
      emptyTitle: 'Aucune pratique pédagogique n’a encore été partagée.',
      emptyText:
        'Cette collection s’enrichira des contributions d’enseignant·e·s du supérieur : des pratiques réelles, relues avant d’apparaître ici.',
      share: 'Partager une pratique pédagogique',
      back: 'Pratiques pédagogiques',
      notFound: 'Cette pratique pédagogique est introuvable.',
      context: 'Contexte d’enseignement',
      connection: 'Lien avec la durabilité',
      approach: 'Démarche pédagogique',
      resources: 'Ressources',
      experience: 'Retour d’expérience',
      worked: 'Ce qui a fonctionné',
      challenges: 'Difficultés',
      adaptations: 'Adaptations',
      adapt: 'Adapter cette approche',
      materials: 'Supports pédagogiques',
      form: {
        title: 'Partager une pratique pédagogique',
        intro:
          'Décrivez ce que vous avez réellement fait avec vos étudiant·e·s. Vous envoyez votre contribution à l’équipe WeLearn, qui la relit ; elle n’est publiée dans cet espace qu’après relecture et avec votre autorisation. Le partage est volontaire.',
        discipline: 'Discipline',
        course: 'Cours',
        level: 'Niveau des étudiant·e·s',
        topic: 'Le thème de durabilité intégré, et pourquoi',
        approach: 'Ce que vous avez fait avec vos étudiant·e·s',
        resources: 'Ressources utilisées',
        lessons: 'Ce que vous en retenez ou changeriez',
        optional: 'facultatif',
        materials: 'Supports pédagogiques',
        materialsHelp:
          'Partagez les documents ou ressources utilisés dans cette pratique (syllabus, consignes, fiches étudiant·e·s, diaporamas, études de cas, jeux de données…). N’incluez que des supports que vous avez le droit de partager, sans informations personnelles sur vos étudiant·e·s.',
        materialsPlaceholder: 'Un lien par ligne, par exemple : Fiche étudiant·e – https://…',
        materialsInvalid: 'Ces lignes ne contiennent pas de lien web :',
        files:
          'Pour partager des fichiers (PDF, DOCX, PPTX, XLSX), joignez-les au message à l’étape suivante : WeLearn ne peut pas encore enregistrer de fichiers.',
        prepare: 'Relire ma contribution',
        subject: 'WeLearn – contribution d’une pratique pédagogique',
        send: 'Envoyer à WeLearn pour relecture',
        reviewTitle: 'Relisez votre contribution',
        privacy:
          'Vérifiez qu’elle ne contient aucune information personnelle sur vos étudiant·e·s (noms, notes, travaux identifiables).',
        nextTitle: 'Ce qui se passe ensuite',
        next: {
          send: 'Vous l’envoyez depuis votre messagerie à l’équipe WeLearn ({address}). Joignez-y vos fichiers (PDF, DOCX, PPTX, XLSX) si vous en avez : WeLearn ne peut pas encore les enregistrer.',
          review: 'L’équipe WeLearn la relit et peut vous recontacter.',
          publish:
            'Votre texte et vos supports ne sont publiés dans cet espace qu’après relecture et avec votre autorisation. Envoyer ne veut pas dire publier.'
        },
        mailOpened:
          'Votre messagerie devrait s’ouvrir avec votre contribution. Elle n’est envoyée que lorsque vous envoyez ce message, et elle n’est pas publiée. Si rien ne s’ouvre, copiez-la et envoyez-la à {address}.',
        long: 'Votre contribution est longue : si le message paraît incomplet dans votre messagerie, copiez-la et collez-la dans un e-mail à {address}.',
        copy: 'Copier',
        copied: 'Copié',
        edit: 'Modifier'
      }
    },
    activity: {
      intro:
        'Décrivez votre contexte d’enseignement : WeLearn vous propose quelques idées d’activité, cherche des ressources pour celle que vous choisissez et prépare une activité d’une page.',
      contextLabel: 'Votre contexte :',
      context: {
        fromCourse: 'Contexte repris de votre cours « {title} ». Modifiez-le si besoin.',
        subject: 'Qu’enseignez-vous ?',
        subjectPlaceholder: 'Par exemple : les limites du PIB comme mesure du bien-être',
        students: 'Étudiant·e·s : discipline et niveau',
        studentsPlaceholder: 'Par exemple : Économie, Licence 1',
        time: 'Temps disponible',
        timePlaceholder: 'Par exemple : une séance de 1 h 30',
        goal: 'Que souhaitez-vous que les étudiant·e·s apprennent ou fassent ?',
        goalPlaceholder:
          'Par exemple : comparer le PIB à un autre indicateur et en discuter les limites',
        notice: 'Votre contexte sera envoyé à WeLearn pour une analyse par IA.',
        submit: 'Proposer des idées d’activité'
      },
      ideas: {
        title: 'Idées d’activité',
        intro:
          'Proposées par WeLearn. Choisissez-en une, demandez d’autres idées ou décrivez la vôtre.',
        choose: 'Choisir cette idée',
        preferredType: 'D’autres idées (facultatif : un type d’activité que vous préférez)',
        preferredTypePlaceholder: 'Par exemple : débat, analyse de données, étude de cas',
        other: 'Proposer d’autres idées',
        ownIdea: 'Ou décrivez votre propre idée',
        ownIdeaPlaceholder:
          'Par exemple : les étudiant·e·s comparent deux indicateurs de développement régional en petits groupes',
        useOwnIdea: 'Développer mon idée',
        planning: 'Préparation des recherches pour votre contexte',
        searching: 'Recherche de ressources dans WeLearn',
        found: '{count} ressources trouvées',
        thinking: 'Vérification de leur contenu et proposition d’activités qu’elles permettent',
        basedOn: 'S’appuie sur :',
        methodNotice: {
          needsPartner:
            '« {method} » n’est pas proposé : il suppose un partenaire réel (association, collectivité, entreprise…) et plusieurs séances, que le contexte ne mentionne pas. Précisez-les dans le contexte si vous en avez.',
          needsSessions:
            '« {method} » n’est pas proposé : il demande plusieurs séances, et le temps indiqué est d’une seule séance. Les idées ci-dessous tiennent dans ce temps.',
          needsData:
            '« {method} » n’est pas proposé : il suppose des chiffres vérifiés, et les ressources trouvées n’en contiennent pas d’exploitables.',
          needsCase:
            '« {method} » n’est pas proposé : il suppose un cas documenté, et les ressources trouvées n’en contiennent pas.',
          notSupported:
            '« {method} » n’a pas pu être proposé avec les ressources trouvées ; voici les approches réalisables.'
        },
        noRelevant:
          'WeLearn n’a trouvé aucun document qui traite directement de ce sujet. Les activités ci-dessous ne s’appuient sur aucun document : leur matériel est écrit par WeLearn.',
        selfContained: 'Activité autonome : WeLearn rédige le scénario et les consignes.',
        none: 'Aucune activité n’a pu s’appuyer sur les ressources trouvées. Décrivez votre propre idée ou modifiez votre contexte.',
        unavailable: 'WeLearn n’a pas pu être joint. Veuillez réessayer dans un instant.',
        error: 'WeLearn n’a pas pu proposer d’idées cette fois-ci. Veuillez réessayer.'
      },
      result: {
        chosen: 'Idée choisie :',
        otherIdea: 'Choisir une autre idée',
        searching: 'Recherche de ressources dans WeLearn',
        found: '{count} ressources candidates trouvées',
        selecting: 'Sélection des ressources réellement utilisables pour cette activité',
        writing: 'Préparation de l’activité',
        unavailable: 'WeLearn n’a pas pu être joint. Veuillez réessayer dans un instant.',
        error: 'WeLearn n’a pas pu préparer cette activité cette fois-ci.',
        note: 'Brouillon proposé par WeLearn. Modifiez-le dans son ensemble, puis copiez-le.',
        objective: 'Objectif d’apprentissage',
        format: 'Durée et format',
        preparation: 'Préparation',
        steps: 'Étapes',
        studentInstructions: 'Consignes aux étudiant·e·s',
        tryAnother: 'Essayer une autre approche',
        data: 'Données',
        dataContext: 'Contexte',
        dataSource: 'Source',
        reportedFrom: 'valeurs rapportées d’après {source}',
        notComparable: 'valeurs non établies sur la même base : pas de graphique',
        providedMaterial: 'Matériel fourni par WeLearn',
        studentOutput: 'Ce que produisent les étudiant·e·s',
        limitation: 'Limite',
        missingMaterials: 'Matériel nécessaire introuvable dans WeLearn :',
        assumes:
          'Cette version suppose encore que vous fournissiez des données que WeLearn n’a pas trouvées.',
        check: 'Comment vérifier les apprentissages',
        greencomp: 'Compétences GreenComp travaillées',
        resources: 'Ressources à l’appui',
        noResources:
          'WeLearn n’a trouvé dans sa base aucune ressource réellement utilisable pour cette activité. L’activité s’appuie sur ce que vous fournirez.',
        edit: 'Modifier l’activité',
        copy: 'Copier l’activité',
        copied: 'Copié',
        restore: 'Rétablir le brouillon',
        otherFormat: 'Un autre format ?',
        otherFormatPlaceholder: 'Par exemple : plus court, à distance, en grand groupe',
        rewrite: 'Proposer une autre version'
      },
      materials: {
        data: 'Données',
        graph: 'Graphique ou tableau',
        case: 'Cas documenté',
        study: 'Étude',
        concept: 'Notions',
        teaching: 'Support pédagogique',
        report: 'Rapport'
      },
      handout: {
        create: 'Créer la fiche étudiant·e',
        title: 'Fiche étudiant·e',
        intro:
          'Créée uniquement à partir de cette activité : ses consignes, son matériel, ses données et extraits de sources vérifiés. Relisez-la et modifiez-la avant de la distribuer.',
        gapsTitle: 'Avant de la distribuer :',
        gaps: {
          instructions: 'L’activité ne contient pas de consignes pour les étudiant·e·s.',
          data: 'Cette analyse de données n’a pas de tableau vérifié : les étudiant·e·s n’ont pas de chiffres sur lesquels travailler.',
          scenario:
            'Le scénario, le cas ou les rôles nécessaires aux étudiant·e·s ne sont pas rédigés.',
          sources: 'L’activité n’a ni source ni matériel pour les étudiant·e·s.',
          assumes: 'L’activité suppose des données qu’elle ne fournit pas.',
          edited: 'Vous avez modifié l’activité : reportez vos modifications dans la fiche.'
        },
        copy: 'Copier',
        copied: 'Copié',
        download: 'Télécharger (.docx)',
        recreate: 'Recréer à partir de l’activité'
      },
      approaches: {
        case_study: 'Étude de cas',
        systems_mapping: 'Cartographie systémique',
        lca_project: 'Projet d’analyse de cycle de vie (ACV)',
        critical_analysis: 'Analyse critique',
        stakeholder_role_play: 'Jeu de rôle des parties prenantes',
        personal_action_plan: 'Plan d’action personnel',
        advocacy_campaign: 'Campagne de plaidoyer',
        futures_workshop: 'Atelier de littératie des futurs',
        policy_analysis: 'Analyse des politiques et de la gouvernance',
        reflective_portfolio: 'Portfolio réflexif',
        community_project: 'Projet avec une communauté',
        interdisciplinary_project: 'Projet de recherche interdisciplinaire',
        living_lab: 'Living lab / co-création',
        source_analysis: 'Analyse critique des sources',
        transition_planning: 'Planification de la transition',
        comparative_data_analysis: 'Analyse comparative de données',
        problem_based_learning: 'Apprentissage par problème',
        structured_debate: 'Débat structuré'
      },
      greencomp: {
        valuing_sustainability: 'Valoriser la durabilité',
        supporting_fairness: 'Défendre l’équité',
        promoting_nature: 'Promouvoir la nature',
        systems_thinking: 'Pensée systémique',
        critical_thinking: 'Pensée critique',
        problem_framing: 'Cadrage des problèmes',
        futures_literacy: 'Littératie des futurs',
        adaptability: 'Adaptabilité',
        exploratory_thinking: 'Pensée exploratoire',
        political_agency: 'Capacité d’action politique',
        collective_action: 'Action collective',
        individual_initiative: 'Initiative individuelle'
      }
    },
    adapt: {
      title: 'Adapter mon cours existant',
      intro:
        'Partez de votre syllabus. WeLearn le lit, puis vous vérifiez et corrigez ce qu’il a compris avant toute autre étape.',
      aiRead: 'Analysé par l’IA de WeLearn',
      upload: {
        title: 'Votre syllabus',
        dropzone: 'Déposez ici votre syllabus ou plan de cours, ou',
        browse: 'parcourez vos fichiers',
        limits: 'Un fichier · PDF, DOCX, XLSX ou TXT · 5 Mo maximum',
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
          BAD_EXTENSION: 'Utilisez un fichier PDF, DOCX, XLSX ou TXT.'
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
      choose: {
        title: 'Sur quel cours souhaitez-vous travailler ?',
        intro: '{name} contient plusieurs cours. Choisissez-en un : WeLearn ne lira que celui-ci.',
        oneCourse: 'Il s’agit d’un seul cours : continuer avec tout le document'
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
        overviewKeys: {
          title: 'Titre',
          discipline: 'Discipline',
          level: 'Niveau',
          topics: 'Principaux thèmes'
        },
        materialLabel: 'Support',
        materialTypes: {
          syllabus: 'Syllabus de cours',
          course_plan: 'Plan de cours ou de semestre',
          lesson: 'Séance ou leçon unique',
          partial: 'Description partielle d’un cours',
          other: 'Autre support pédagogique'
        },
        correct: 'Corriger',
        fromDocument: 'Issu de votre document',
        aboutReading: 'À propos de cette lecture',
        editObjectives: 'Modifier les objectifs',
        done: 'Terminé',
        focusCourse: 'Cours choisi dans le document : {title}',
        notFoundOverview: 'Introuvable dans votre document :',
        notFilledOverview: 'Pas encore renseigné :',
        emptyReading: 'WeLearn n’a trouvé aucune information de cours dans ce fichier.',
        dropped:
          'WeLearn a écarté {count} élément(s) qu’il n’a pas retrouvé(s) mot pour mot dans votre syllabus.',
        textCut: 'Ce document est long : seule sa première partie a été lue.',
        sessions: 'Séances',
        description: 'Description issue de votre document',
        showMore: 'Afficher tout le texte',
        showLess: 'Afficher moins',
        objectives: 'Objectifs d’apprentissage',
        programmeHint:
          'Les objectifs listés sous un titre de diplôme ou de formation sont mis à part. Vous pouvez déplacer chaque objectif d’un groupe à l’autre.',
        markProgramme: 'Objectif de la formation',
        programmeTitle: 'Objectifs de la formation',
        unmarkProgramme: 'Remettre dans les objectifs du cours',
        origin: {
          extracted: 'Issu de votre document',
          suggested: 'Proposé par WeLearn',
          extractedExample: 'Issu de l’exemple',
          edited: 'Corrigé par vous',
          added: 'Ajouté par vous'
        },
        notFound: 'Introuvable dans votre document.',
        noObjectives: 'Aucun objectif d’apprentissage n’a été trouvé dans votre document.',
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
          assessment: 'Évaluation'
        },
        localNote:
          'Vos modifications restent dans cet onglet du navigateur. Elles ne sont ni enregistrées ni envoyées.',
        confirm: 'Confirmer et explorer les liens avec la durabilité',
        confirmed:
          'Cours confirmé dans cet onglet. Prochaine étape, les liens avec la durabilité : bientôt disponible.',
        startOver: 'Recommencer'
      },
      connections: {
        courseLabel: 'Votre enseignement',
        review: 'Revoir',
        title: 'Liens avec la durabilité',
        intro:
          'Suggestions appuyées par l’IA, à partir de ressources trouvées dans la base WeLearn. Votre support d’origine n’est pas modifié.',
        thinking: 'Recherche de liens pertinents dans votre cours',
        searching: 'Recherche de ressources à l’appui dans WeLearn',
        found: '{count} ressources candidates trouvées',
        selecting: 'Sélection des ressources les plus pertinentes',
        unavailable: 'WeLearn n’a pas pu être joint. Veuillez réessayer dans un instant.',
        error: 'WeLearn n’a pas pu proposer de liens cette fois-ci.',
        retry: 'Réessayer',
        noResources:
          'WeLearn n’a trouvé aucune ressource assez proche de cet enseignement pour proposer un lien.',
        noConnections:
          'WeLearn n’a trouvé aucun lien appuyé par des ressources assez solides. Vous pouvez revoir votre enseignement et réessayer.',
        where: 'Où',
        wholeCourse: 'Votre enseignement dans son ensemble',
        why: 'Pourquoi c’est pertinent',
        how: 'Comment l’utiliser',
        resources: 'Ressources à l’appui',
        designActivity: 'Concevoir une activité d’apprentissage pour ce cours',
        setAside: 'Écarter',
        undo: 'Rétablir',
        setAsideTitle: 'Écartés ({count})',
        develop: 'Développer cette adaptation',
        adaptation: {
          developing: 'WeLearn prépare une activité courte',
          note: 'Brouillon proposé par WeLearn, en ajout à votre enseignement : rien n’est remplacé dans votre support d’origine.',
          placement: 'Où l’intégrer',
          objective: 'Objectif d’apprentissage',
          duration: 'Durée',
          steps: 'Étapes',
          studentTask: 'Ce que font les étudiant·e·s',
          check: 'Comment vérifier les apprentissages',
          resources: 'Ressources',
          edit: 'Modifier l’adaptation',
          restore: 'Rétablir le brouillon',
          copy: 'Copier l’adaptation',
          copied: 'Copié',
          unavailable: 'WeLearn n’a pas pu être joint.',
          error: 'WeLearn n’a pas pu préparer cette adaptation.'
        }
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
        title: 'Voir comment d’autres enseignent la durabilité',
        pageTitle: 'L’utiliser avec vos étudiants',
        intro:
          'Utilisez une activité en classe, faites le point sur son déroulement et partagez ce qui fonctionne.',
        description:
          'Découvrez des expériences, des ressources et des approches d’enseignement réelles, partagées par des enseignant·e·s du supérieur.',
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
