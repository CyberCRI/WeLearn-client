import { microLearning } from './microLearning/fr';
import { authentication } from './authentication/fr';

export const fr = {
  authentication,
  microLearning,
  ':': ' :',
  adaptedTo: 'Adapté à :',
  addBookmark: 'Ajouter aux favoris',
  back: 'Retour',
  bookmarks: 'Favoris',
  cardArticle: {
    seeDetails: 'Voir les détails',
    openArticle: 'Ouvrir l’article',
    addBookmark: 'Ajouter aux favoris',
    removeBookmark: 'Retirer des favoris'
  },
  contactUs: 'Contactez-nous',
  logout: 'Déconnexion',
  login: 'Connexion',
  chat: 'Chat',
  chatInputPlaceholder: 'Poser une question',
  chatNoResults:
    'Aucun résultat avec les filtres actuels. Essayez d’ajuster votre recherche ou de retirer certains filtres.',
  chatProvideValidQuestion: 'Veuillez saisir une question valide.',
  clearBookmarks: 'Supprimer tous les favoris',
  clearChat: 'Effacer la conversation',
  chatError: "Une erreur s'est produite. Veuillez réessayer plus tard.",
  cancel: 'Annuler',
  confirmClearChat: 'Supprimer toute cette conversation ?',
  goToBottom: 'Aller au dernier message',
  clearSearch: 'Effacer la recherche',
  closeSidebar: 'Masquer la barre latérale',
  copied: 'Copié !',
  copy: 'Copier',
  categories: {
    science_communication_and_outreach: 'Vulgarisation scientifique',
    expert_reports: 'Rapports institutionnels',
    academic_scientific_publications: 'Publications scientifiques',
    teaching_resources: 'Ressources éducatives',
    collaborative_and_encyclopedic_knowledge: 'Connaissances collaboratives et encyclopédiques',
    null: 'Non catégorisé'
  },
  corpus: {
    'notre-environnement': 'notre-environnement',
    unesdoc: 'Unesdoc',
    'ird-le-mag': "IRD Le Mag'",
    unccelearn: 'UN CC:e-Learn',
    conversation: 'The Conversation',
    hal: 'HAL',
    ipbes: 'IPBES',
    ipcc: 'GIEC',
    oapen: 'OAPEN',
    'open-edition-books': 'OpenEdition Books',
    openalex: 'OpenAlex',
    'bmj-open': 'BMJ Open',
    peerj: 'PeerJ',
    plos: 'PLOS',
    'press-books': 'Pressbooks',
    ted: 'TED',
    uved: 'UVED',
    'fao-open-knowledge': "Organisation des Nations unies pour l'alimentation et l'agriculture",
    'world-bank-open-knowledge-repository': 'Banque Mondiale',
    wikipedia: 'Wikipedia'
  },
  download: 'Télécharger',
  defaultQueues: [
    "Le changement climatique est-il causé par l'homme ?",
    "L'énergie nucléaire est-elle une solution durable ?",
    'La technologie peut-elle à elle seule résoudre la crise climatique ?',
    'La croissance économique est-elle compatible avec le développement durable ?',
    "Comment l'ingénierie contribue-t-elle à la transition écologique ?",
    "Comment l'architecture contribue-t-elle à la transition écologique ?",
    'Comment les écoles de commerce peuvent-elles enseigner le développement durable sans tomber dans le « greenwashing » ?',
    "Quel rôle joue l'IA dans la transition écologique ?",
    "Taxe carbone ou système de plafonnement et d'échange : quelle est la solution la plus efficace ?",
    'Décroissance ou croissance verte : quelle option est la plus pertinente ?',
    'Nucléaire ou énergies renouvelables : quel est le véritable compromis ?'
  ],
  hintForNewQuestions: 'Voici des questions supplémentaires pour approfondir ce sujet :',
  description:
    'Découvrez des ressources, apprenez et renforcez l’intégration de la durabilité dans vos cours avec l’IA.',
  emptyChatAction: 'Besoin d’inspiration ? Essayez :',
  emptyChatPresentation:
    'Bonjour ! Je suis WeLearn, votre assistant IA pour les ODD. En quoi puis-je vous aider ?',
  error: {
    UNKNOWN_ERROR: {
      title: 'Oups !',
      description: 'Un problème est survenu. Veuillez réessayer.'
    },
    COLL_NOT_FOUND: {
      title: 'Oups !',
      description: 'Cette collection n’est pas encore disponible dans la langue de votre recherche.'
    },
    LANG_NOT_SUPPORTED: {
      title: 'Désolé !',
      description: 'Cette langue n’est pas encore prise en charge.'
    }
  },
  errorModalGeneric: {
    title: 'Désolé, un problème est survenu.',
    message: 'Veuillez réessayer ou recharger la page.',
    action: 'Recharger la page'
  },
  extract: 'Extrait pertinent',
  filterBySource: 'Filtrer par source',
  filterSDG: 'Filtrer par ODD',
  filteredBySDG: 'Filtré par l’ODD : | Filtré par les ODD :',
  genSyllabus: 'Générer le syllabus',
  goToSources: 'Voir les sources',
  goToTop: 'Retour en haut',
  gotIt: 'Compris !',

  helpUser: {
    'q&a': {
      title: 'Utiliser le Chat',
      step1: {
        description:
          'Le Chat WeLearn est un assistant IA spécialisé sur les ODD. Posez-lui vos questions pour obtenir des réponses qui s’appuient sur des sources fiables et vérifiables.'
      },
      step2: {
        description: 'Saisissez une question ou choisissez une suggestion.',
        image: 'chat_2.png'
      },
      step3: {
        description: 'La réponse s’affiche dans le chat.',
        image: 'chat_3.png'
      },
      step4: {
        description: 'Copiez la réponse, ou demandez une reformulation.',
        image: 'chat_4.png'
      },
      step5: {
        description:
          'Pour formuler des réponses sourcées à vos questions, WeLearn effectue une recherche sémantique dans sa base afin d’identifier les ressources les plus pertinentes.'
      },
      step6: {
        description:
          'Les ressources utilisées pour formuler la réponse s’affichent dans la barre latérale. Vous pouvez ouvrir une ressource dans un nouvel onglet.',
        image: 'chat_6.png'
      },
      step7: {
        description: 'Ajoutez une ressource à vos favoris pour la retrouver facilement.',
        image: 'chat_7.png'
      },
      step8: {
        description: 'Filtrez les ressources par ODD et/ou par source pour affiner vos résultats.',
        image: 'chat_8.png'
      }
    },
    search: {
      title: 'Utiliser la fonctionnalité Recherche',
      step1: {
        description:
          'Bienvenue sur la recherche WeLearn ! Trouvez des ressources éducatives sur les Objectifs de développement durable (ODD). Le moteur utilise une recherche sémantique : plus votre requête est longue, meilleurs seront les résultats. Pour en savoir plus sur nos sources et nos critères de sélection, consultez la section À propos.'
      },
      step2: {
        description:
          'Saisissez votre requête ou collez du texte pour trouver des documents pertinents.'
      },
      step3: {
        description: 'Affinez les résultats en filtrant par ODD et/ou par source.'
      }
    },
    syllabus: {
      title: 'Utiliser la fonctionnalité Génération de Syllabus',
      step1: {
        description:
          'Bienvenue sur la Génération de Syllabus sur WeLearn ! Créez un syllabus pour votre cours à partir de vos documents importés et des ressources WeLearn pertinentes. Vous pouvez ajouter des informations sur le cours pour personaliser le syllabus, et affiner le syllabus généré en donnant un retour.'
      },
      step2: {
        description: 'Ajoutez un ou plusieurs documents. Ils serviront à générer le syllabus.'
      },
      step3: {
        description:
          'Ajoutez des informations sur le cours pour adapter le syllabus à votre contexte.'
      },
      step4: {
        description:
          'Sélectionnez des documents parmi les résultats de WeLearn. Si aucun n’est sélectionné, le syllabus sera basé uniquement sur vos documents importés.'
      },
      step5: {
        description: 'Donnez un retour pour affiner et améliorer le syllabus.'
      }
    },
    bookmarks: {
      title: 'Utiliser la fonctionnalité Favoris',
      step1: {
        description:
          'Bienvenue dans les Favoris WeLearn ! Retrouvez les éléments enregistrés depuis vos résultats.'
      },
      step2: {
        description:
          'Cliquez sur l’icône de favori pour enregistrer un résultat ; une fois enregistré, l’icône se remplit.'
      },
      step3: {
        description: 'Cliquez de nouveau sur l’icône de favori pour supprimer le favori.'
      },
      step4: {
        description: 'Supprimez tous les favoris d’un coup en cliquant sur l’icône de corbeille.'
      }
    }
  },
  hideAuthors: 'Masquer les auteurs',
  hideFilters: 'Masquer les filtres',
  hideSources: 'Masquer les sources',
  lang: {
    fr: 'Français',
    en: 'Anglais'
  },
  languages: 'Langues',
  landing: {
    sourceNameTitle: 'Nom de la ressource',
    sourceUrlTitle: 'Lien vers la ressource',
    sourceNumberTitle: 'Nombre de documents',
    sourcesTitle: 'À propos de nos ressources',
    sourcesDescription_1:
      'WeLearn donne accès à un ensemble de ressources ouvertes, fiables et de haute qualité, en lien avec les Objectifs de développement durable (ODD). Ces ressources ont été identifiées grâce à l’analyse à grande échelle de plus de 16 millions de documents en ligne.',
    sourcesDescription_2:
      'L’ensemble des ressources proposées sur la plateforme répond à trois critères de sélection fondamentaux :\nl’ouverture, grâce à l’utilisation de documents en libre accès ;\nla fiabilité, en s’appuyant sur des collections reconnues ;\nla pertinence, garantie par un modèle de classification qui ne retient que les contenus explicitement associés à l’un des 17 ODD.',
    sourcesDescription_3: 'Le tableau ci-dessous présente la répartition des documents par source.',
    slogan: 'L’éducation à la durabilité, facilitée',
    description:
      'Explorez des ressources, apprenez et intégrez la durabilité dans vos cours grâce à l’IA.',
    aboutTitle: 'À propos de WeLearn',
    aboutDescription:
      'WeLearn est une plateforme qui s’appuie sur l’intelligence artificielle pour aider les enseignants à intégrer la durabilité dans leurs cours. Elle repose sur une sélection de ressources ouvertes et fiables liées aux Objectifs de développement durable (ODD), qui alimentent des outils pédagogiques concrets : recherche, assistant questions-réponses, conception de syllabus et micro-learning.',
    partnership:
      'WeLearn est développé par le Learning Planet Institute dans le cadre du projet TEDS (« Transition écologique pour un développement soutenable »), porté conjointement avec la Fondation UVED et CY Cergy Paris Université. TEDS est financé par l’Agence nationale de la recherche au titre de France 2030 et de l’appel à projets « Nouveaux cursus à l’université » (référence ANR-17-NCUN-0016).',
    horizontal: {
      section_one: {
        title: 'Une sélection de savoirs sur la durabilité',
        content:
          'WeLearn propose des contenus ouverts et fiables sur les Objectifs de développement durable (ODD), sélectionnés avec soin parmi des sources reconnues.'
      },
      section_two: {
        title: 'Trouver ce qui compte, rapidement',
        content:
          'Explorez les sujets liés à la durabilité et trouvez rapidement les bonnes ressources grâce au moteur de recherche sémantique de WeLearn.'
      },
      section_three: {
        title: 'Des réponses sourcées et personnalisées',
        content:
          'Échangez avec l’assistant virtuel de WeLearn pour obtenir des réponses précises et référencées, adaptées à votre contexte.'
      }
    },
    vertical: {
      section_one: {
        title: 'Soutenir la durabilité avec l’IA',
        content:
          'Nous plaçons la durabilité au cœur de notre mission et utilisons la technologie pour soutenir un avenir responsable.'
      },
      section_two: {
        title: 'Simplifier l’éducation à la durabilité',
        content:
          'Nous nous engageons à donner aux enseignants du monde entier les moyens d’apprendre et d’enseigner la durabilité.'
      },
      section_three: {
        title: 'Respecter les principes d’une IA responsable',
        content:
          'Nous nous engageons pour une utilisation de l’intelligence artificielle transparente et respectueuse de l’environnement.'
      }
    }
  },
  moreDocuments: 'Explorer d’autres ressources',
  nav: {
    chat: 'Chat',
    search: 'Recherche',
    bookmarks: 'Favoris',
    syllabus: 'Créer un syllabus',
    about: 'À propos',
    help: 'Aide',
    profile: 'Profil',
    microlearning: 'Micro-learning',
    workshopForm: "Formulaire d'atelier"
  },

  next: 'Suivant',
  noBookmarks: 'Aucun favori pour le moment',
  noFiltersSelected: 'Aucun filtre sélectionné',
  noResults: 'Aucun résultat pour cette recherche',
  openSidebar: 'Afficher la barre latérale',
  onboarding: {
    welcome: {
      title: 'Bienvenue sur WeLearn !',
      description:
        "Nous sommes ravis de vous accueillir.</br></br>WeLearn est votre plateforme d'apprentissage alimentée par l’IA, conçue pour vous aider à intégrer la durabilité dans vos cours.",
      help: 'Pour en savoir plus sur chaque fonctionnalité de WeLearn, consultez sa rubrique <strong>Aide</strong> dédiée.',
      action: 'Commencer'
    },
    metricsData: {
      explanation: {
        1: 'Aidez-nous à mieux connaître notre communauté en partageant votre institution et votre rôle. Ces informations sont',
        2: ' facultatives',
        3: ' et utilisées uniquement à des fins statistiques.'
      },
      institutionLabel: 'Institution (université, école, organisation, etc.)',
      institutionPlaceholder: 'Université de Bordeaux',
      roleLabel: 'Rôle (professeur, étudiant, ingénieur pédagogique, etc.)',
      rolePlaceholder: 'Professeur',
      consentLabel: 'Je ne souhaite pas communiquer ces informations.'
    }
  },
  profile: {
    title: 'Mon profil',
    name: 'Nom',
    email: 'E-mail',
    language: 'Langue',
    bookmarksLoginRequired: 'Connectez-vous pour voir vos favoris',
    notAvailable: 'Non disponible',
    notAuthenticated: "Vous n'êtes pas connecté·e."
  },
  reload: 'Recharger',
  clearFilters: 'Effacer tous les filtres',
  filtersSelected: '{n} sélectionné | {n} sélectionnés',
  removeAll: 'Tout effacer',
  removeBookmark: 'Retirer des favoris',
  removeSelection: 'Effacer',
  sdgsAcronym: 'ODD',
  sdgs: {
    1: 'Pas de pauvreté',
    2: 'Faim "zéro"',
    3: 'Bonne santé et bien-être',
    4: 'Éducation de qualité',
    5: 'Égalité entre sexes',
    6: 'Eau propre et assainissement',
    7: 'Énergie propre et d’un coût abordable',
    8: 'Travail décent et croissance économique',
    9: 'Industrie, innovation et infrastructure',
    10: 'Inégalités réduites',
    11: 'Villes et communautés durables',
    12: 'Consommation et production responsables',
    13: 'Mesures relatives à la lutte contre les changements climatiques',
    14: 'Vie aquatique',
    15: 'Vie terrestre',
    16: 'Paix, justice et institutions efficaces',
    17: 'Partenariats pour la réalisation des objectifs'
  },
  search: 'Recherche',
  searchFilters: 'Filtres de recherche',
  searchPlaceholder:
    'Saisissez ou collez un texte ici pour trouver des ressources similaires.\nUn texte plus long donnera de meilleurs résultats.',
  search_sdgs_in_query: 'ODD dans la requête',
  selectAll: 'Tout sélectionner',
  selectSubject: 'Choisir une discipline',
  selectSubjectInfo: 'Sélectionnez une discipline pour adapter les résultats à votre domaine.',
  selectedSource: 'Filtré par source : | Filtré par sources :',
  showFilters: 'Afficher les filtres',
  showMoreAuthors: 'Afficher plus',
  showSources: 'Afficher les sources',

  chatProcessingSteps: {
    fetching_resources: 'Recuperation des ressources depuis la base WeLearn',
    analyzing_resources: 'Analyse des ressources pertinentes',
    generating_answer: 'Generation de votre reponse'
  },

  sources: 'Sources',
  sourcesList: {
    fetching: 'Recherche parmi {docs_nb} documents...',
    formulatingAnswer: 'Préparation de votre réponse...',
    exportBibliography: 'Exporter la bibliographie',
    exportingBibliography: 'Export en cours...'
  },
  terms: 'Politique de confidentialité',
  subjects: {
    Anthropology: 'Anthropologie',
    Arts: 'Arts',
    Biology: 'Biologie',
    Business: 'Gestion',
    Chemistry: 'Chimie',
    Cs: 'Informatique',
    Earth: 'Sciences de la Terre',
    Economics: 'Économie',
    Engineering: 'Ingénierie',
    Geography: 'Géographie',
    History: 'Histoire',
    Law: 'Droit',
    Literature: 'Littérature',
    Math: 'Mathématiques',
    Medicine: 'Médecine',
    Physics: 'Physique',
    Political: 'Sciences politiques',
    Psychology: 'Psychologie',
    Sociology: 'Sociologie',
    Space: 'Science de l’espace',
    Theology: 'Théologie'
  },
  textLengthFeedback: 'Veuillez ajouter davantage de texte pour lancer la recherche.',
  tutor: {
    BIG_FILE: 'La taille du fichier dépasse 5 Mo.',
    BAD_EXTENSION:
      'Type de fichier non pris en charge. Seuls les fichiers PDF, TXT et DOCX sont acceptés.',
    TOO_MANY_FILES: "Vous pouvez ajouter jusqu'à 3 fichiers.",
    edit: 'Modifier',
    collapse: 'Fermer',
    start: {
      question: 'Comment souhaitez-vous commencer ?',
      intro:
        "Adaptez un cours que vous enseignez déjà, ou créez-en un nouveau avec l'accompagnement de WeLearn.",
      yes: 'Adapter un cours existant',
      no: 'Créer un nouveau cours',
      yesHint:
        'Importez votre syllabus et découvrez comment intégrer la durabilité dans votre enseignement.',
      noHint: 'Construisez un cours à partir de vos objectifs pédagogiques, étape par étape.',
      inDevelopment: 'En cours de développement',
      workingNew: "Création d'un nouveau cours",
      newInProgress:
        'Ce parcours est en cours de construction : ses écrans ne sont pas encore disponibles.',
      change: 'Changer',
      changeWarning: 'Changer effacera ce que vous avez ajouté pour ce cours.',
      discard: 'Effacer et changer',
      back: 'Retour aux options de départ',
      backWarning:
        'Revenir en arrière effacera votre syllabus et ce que vous avez ajouté pour ce cours.',
      discardBack: 'Effacer et revenir',
      keepWorking: 'Continuer mon travail'
    },
    course: {
      title: 'Votre cours',
      description: 'Importez votre syllabus pour commencer.',
      dropzone: 'Déposez votre syllabus ici ou',
      limits: 'Un fichier · PDF, DOCX ou TXT · 5 Mo max',
      contextTitle: "Contexte d'enseignement",
      optional: '(facultatif)',
      contextHint:
        'Comment le cours est enseigné. Rempli à partir de votre syllabus quand il le précise ; complétez le reste si vous le souhaitez.',
      fields: {
        title: 'Titre du cours',
        discipline: 'Discipline',
        level: 'Niveau',
        sessions: 'Nombre de séances',
        sessionLength: "Durée d'une séance",
        sessionType: 'Type de séance',
        sessionMode: 'Format',
        classSize: "Nombre d'étudiants"
      },
      disciplinePlaceholder: 'ex. : Économie',
      choose: 'Choisir…',
      readByAi: "Lu par l'IA de WeLearn : à vérifier",
      suggestedByAi:
        'non précisée dans votre syllabus : suggérée par WeLearn à partir du contenu du cours',
      fromSyllabus: 'Lu dans votre syllabus',
      levels: {
        l1: 'Licence 1',
        l2: 'Licence 2',
        l3: 'Licence 3',
        m1: 'Master 1',
        m2: 'Master 2',
        doctorate: 'Doctorat',
        other: 'Autre'
      },
      sessionTypes: {
        lecture: 'Cours magistral',
        tutorial: 'Travaux dirigés',
        practical: 'Travaux pratiques',
        seminar: 'Séminaire',
        project: 'Projet',
        mixed: 'Mixte'
      },
      modes: {
        PRESENTIEL: 'Présentiel',
        DISTANCIEL: 'Distanciel',
        HYBRIDE: 'Hybride'
      },
      aiNotice:
        "WeLearn utilise l'IA pour lire votre syllabus. Vous pourrez vérifier et corriger les informations avant de continuer.",
      noFile: 'Importez un syllabus pour continuer.',
      action: 'Continuer',
      recap: '{file}'
    },
    reading: {
      sending: 'Envoi de votre syllabus',
      sent: 'Syllabus envoyé',
      reading: 'WeLearn lit votre cours',
      elapsed: '{seconds} s',
      cancel: 'Annuler',
      unavailable: {
        title: 'WeLearn est injoignable',
        text: "Votre syllabus n'a pas été lu. Réessayez dans un moment."
      },
      error: {
        title: "WeLearn n'a pas pu lire ce syllabus",
        text: 'Réessayez, ou choisissez un autre fichier.'
      }
    },
    updated: {
      back: 'Retour aux liens avec la durabilité',
      title: 'Votre syllabus mis à jour',
      intro:
        "Prévisualisez votre cours avec les modifications approuvées, ou affichez les modifications seules. Votre syllabus importé n'est pas modifié.",
      approvedCount:
        'aucune modification approuvée | 1 modification approuvée | {n} modifications approuvées',
      noChanges: 'Aucune modification approuvée pour le moment : votre cours est inchangé.',
      changesView:
        'Modifications seules ({n}) | Modifications seules ({n}) | Modifications seules ({n})',
      courseView: 'Cours mis à jour',
      copy: 'Copier les modifications approuvées',
      copied: 'Copié',
      download: 'Télécharger le plan et les modifications (Word)',
      copyHint:
        'Texte brut : chaque modification approuvée, son emplacement, sa raison et ses sources.',
      downloadHint:
        'Document Word : le plan mis à jour de votre cours, puis les modifications approuvées et leurs sources.',
      placementUnknown: 'Emplacement à choisir',
      replaces: 'Remplace :',
      remove: 'Retirer',
      revised: 'Reformulé',
      seeOriginal: "Voir l'original",
      outlineNote:
        "Plan de votre cours tel que vérifié à l'étape 2, avec les modifications approuvées en vert.",
      outlineNoteComplete:
        'Aperçu du document Word : le texte de votre syllabus dans son ordre, avec les modifications approuvées en vert. Vous pouvez reformuler ici une modification approuvée.',
      localNote:
        "Vos choix restent dans cet onglet du navigateur pendant que vous passez d'une étape à l'autre. Ils sont perdus si la page est rechargée, sauf si vous enregistrez un brouillon (en bas de la page) : sinon, téléchargez-les ou copiez-les avant.",
      complete: {
        download: 'Télécharger le syllabus mis à jour (Word)',
        hint: 'Document Word : tout le texte de votre syllabus, avec vos modifications approuvées signalées à leur place.',
        layoutNote:
          "Le document Word reprend le contenu de votre syllabus original et les modifications approuvées, et vous pouvez continuer à le modifier dans Word. La mise en forme peut différer de l'original : tableaux et colonnes apparaissent en texte simple. | Le document Word reprend le contenu de votre syllabus original et les modifications approuvées, et vous pouvez continuer à le modifier dans Word. La mise en forme peut différer de l'original : tableaux et colonnes apparaissent en texte simple. 1 modification n'a pas pu être placée : elle figure à la fin. | Le document Word reprend le contenu de votre syllabus original et les modifications approuvées, et vous pouvez continuer à le modifier dans Word. La mise en forme peut différer de l'original : tableaux et colonnes apparaissent en texte simple. {n} modifications n'ont pas pu être placées : elles figurent à la fin.",
        unavailable:
          "Le texte complet de ce fichier n'a pas pu être vérifié : le document Word contient le plan de votre cours et les modifications approuvées.",
        title: '{title} — syllabus mis à jour',
        note: "Texte complet du syllabus original, avec les modifications approuvées par l'enseignant·e signalées en vert. La mise en page du document original (tableaux, colonnes) n'est pas reproduite ; le fichier importé reste inchangé.",
        change: 'Modification approuvée',
        toPlaceNote:
          "Ces modifications approuvées n'ont pas pu être placées de façon fiable dans le texte ci-dessus : ajoutez-les là où elles conviennent.",
        fileSuffix: 'complet-mis-a-jour'
      },
      atEnd: 'À la fin du document Word, parmi les modifications à placer',
      appendix: {
        choice: 'Ajouter une annexe pédagogique (repères facultatifs)',
        title: 'Annexe pédagogique (facultative)',
        note: "Repères facultatifs liés aux modifications approuvées, pour aider à les enseigner. Ce ne sont ni des objectifs d'apprentissage ni des exigences d'évaluation, et ils ne font pas partie du syllabus."
      },
      export: {
        documentTitle: 'Cours mis à jour',
        note: "Plan de cours mis à jour avec WeLearn à partir du syllabus original et des modifications approuvées par l'enseignant·e. Les parties du syllabus original qui ne figurent pas ici sont inchangées.",
        overview: 'Présentation',
        objectives: "Objectifs d'apprentissage",
        competencies: 'Compétences',
        topics: 'Thèmes principaux',
        outline: 'Plan du cours',
        toPlace: 'Modifications à placer',
        revised: 'Reformulé',
        added: 'Ajout',
        replaces: 'Remplace',
        why: 'Pourquoi',
        sources: 'Sources',
        placement: 'Placement suggéré',
        changesTitle: 'Modifications de durabilité approuvées',
        placementUnknown: 'Emplacement à choisir',
        context: 'contexte seulement',
        fileSuffix: 'mis-a-jour'
      }
    },
    draft: {
      save: 'Enregistrer le brouillon',
      savedAt: 'Brouillon enregistré sur cet appareil à {time}',
      what: 'Que contient le brouillon ?',
      explain:
        "Votre cours tel que vérifié, le texte lu dans votre syllabus (nécessaire au document Word complet), les liens avec la durabilité et les modifications approuvées, avec votre formulation, leurs emplacements et les repères pédagogiques. Il reste dans ce navigateur, sur cet appareil, et n'est envoyé ni à WeLearn ni à personne ; le fichier importé lui-même n'est pas conservé. Toute personne utilisant ce profil de navigateur pourrait l'ouvrir. Il remplace tout brouillon gardé auparavant. Vous pouvez le supprimer à tout moment.",
      keptNote: 'Votre travail est gardé comme brouillon dans ce navigateur, sur cet appareil.',
      foundTitle: 'Brouillon gardé sur cet appareil :',
      found: '{course} ({file}), enregistré le {time}.',
      untitled: 'Cours sans titre',
      resume: 'Reprendre',
      startNew: 'Commencer un nouveau syllabus',
      remove: 'Supprimer le brouillon',
      unusable:
        "Un brouillon gardé sur cet appareil ne peut pas être restauré : il est incomplet, ne correspond pas à son syllabus ou a été enregistré par une version antérieure de WeLearn. Rien n'a été restauré.",
      problem: {
        unavailable:
          'Ce navigateur ne permet pas à WeLearn de garder un brouillon (navigation privée ou stockage bloqué). Téléchargez votre travail avant de partir.',
        full: "Le stockage de ce navigateur est plein : le brouillon n'a pas pu être mis à jour. Téléchargez votre travail avant de partir.",
        invalid: "Le brouillon n'a pas pu être restauré."
      }
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
    },
    additions: {
      title: 'Explorer les liens avec la durabilité',
      intro:
        'WeLearn a identifié des liens possibles avec votre cours. Parcourez les idées et les ressources qui les appuient, puis choisissez celles que vous souhaitez développer.',
      courseChanged:
        "Votre cours a changé à l'étape 2. Vos liens et vos modifications approuvées sont conservés ; une modification dont l'emplacement ne figure plus dans votre cours est signalée.",
      findAgain: 'Chercher de nouveaux liens (les modifications approuvées sont conservées)',
      backToCheck: 'Retour à la vérification du cours',
      thinking: 'Recherche de liens pertinents dans votre cours',
      searching: 'Recherche de ressources dans WeLearn',
      found: '{count} ressources candidates trouvées',
      selecting: 'Sélection des ressources les plus pertinentes pour chaque lien',
      unavailable: "WeLearn n'a pas pu être joint. Réessayez dans un instant.",
      error:
        "WeLearn n'a pas pu proposer de liens cette fois-ci : sa réponse était inutilisable. C'est un problème technique, pas un jugement sur votre cours.",
      retry: 'Réessayer',
      noConnections: "WeLearn n'a trouvé aucun lien avec la durabilité assez solide pour ce cours.",
      noSupport:
        "WeLearn n'a trouvé aucune ressource qui appuie assez bien ses idées. Vous pouvez tout de même les consulter ci-dessous.",
      connectsTo: 'Lien avec',
      placement: 'Placement suggéré',
      objectiveRef: "Objectif d'apprentissage {n}",
      competencyRef: 'Compétence {n}',
      why: 'Pourquoi cela pourrait être utile',
      sources: 'Sources',
      resources: "Ressources à l'appui",
      sourceCount: '1 source à l’appui | {n} sources à l’appui',
      passage: 'Passage retenu',
      unsupported: 'Aucune source à l’appui trouvée dans WeLearn pour cette idée.',
      background: 'Pour aller plus loin ({count})',
      backgroundHint:
        "Un contexte sur l'enjeu de durabilité plus large. Ces lectures ne traitent pas directement cette partie de votre cours et ne constituent pas une preuve pour ce lien.",
      contextTag: 'Pour aller plus loin, pas une preuve directe',
      unchecked:
        "WeLearn n'a pas pu vérifier les ressources de cette idée (un problème technique, pas un jugement sur l'idée).",
      noneReason: 'Raison donnée par WeLearn : {reason}',
      rechecking: 'Nouvelle vérification des ressources de cette idée…',
      leftOut:
        "WeLearn a écarté une idée qu'il a jugée trop lâche pour cette discipline (une analogie, ou un mot employé dans un autre sens). | WeLearn a écarté {n} idées qu'il a jugées trop lâches pour cette discipline (des analogies, ou des mots employés dans un autre sens).",
      unsupportedTitle: 'Idées sans appui solide dans les ressources WeLearn ({count})',
      develop: 'Développer ce lien',
      undo: 'Annuler',
      setAside: 'Pas pour mon cours',
      setAsideTitle: 'Mis de côté ({count})',
      bringBack: 'Remettre',
      acceptedCount:
        'Aucune modification acceptée pour le moment | 1 modification acceptée pour votre syllabus mis à jour | {n} modifications acceptées pour votre syllabus mis à jour',
      toUpdated: 'Continuer vers votre syllabus mis à jour',
      change: {
        thinking: 'WeLearn prépare une modification concrète de votre cours…',
        unavailable: "WeLearn n'a pas pu être joint. Vos choix sont conservés : réessayez.",
        error:
          "WeLearn n'a pas pu proposer de modification cette fois-ci. Vos choix sont conservés : réessayez.",
        title: 'Modification suggérée du syllabus',
        kinds: {
          objective: "Objectif d'apprentissage reformulé",
          topic: 'Ajout à un thème',
          teaching: "Ajustement de l'enseignement",
          assessment: "Modification de l'évaluation"
        },
        original: 'Original',
        topicRef: 'Thème',
        sessionRef: 'Plan du cours',
        type: 'Type de modification',
        whereLabel: 'Où se place-t-elle dans votre cours ? Choisissez…',
        placement: 'Où elle se place',
        revisesObjective: "Reformule l'objectif d'apprentissage {n}",
        revisesCompetency: 'Reformule la compétence {n}',
        revises: 'Reformule',
        afterLine: 'Après « {line} »',
        replacesLine: 'Remplace « {line} »',
        noPlace:
          'Aucun passage unique correspondant dans votre syllabus : elle sera listée à la fin du document Word. Vous pouvez choisir un emplacement.',
        notPlaced: 'Pas encore placée',
        changePlace: "Changer d'emplacement",
        stalePlace:
          "Son emplacement, « {place} », ne figure plus dans votre cours tel que confirmé à l'étape 2. Choisissez où elle se place.",
        staleObjective:
          "L'objectif qu'elle reformule ne figure plus dans votre cours tel que confirmé à l'étape 2. Vérifiez-la, ou gardez l'original.",
        consequence:
          'Accepter enregistre cette modification pour votre syllabus mis à jour. Votre syllabus original reste inchangé.',
        addition: "Nouvel ajout : rien n'est remplacé dans votre cours.",
        suggested: 'Formulation proposée',
        why: 'Pourquoi cela pourrait être utile',
        basedOn: 'Sources et preuves',
        checkTitle: 'Ce que la vérification de cette modification a relevé',
        evidence: {
          strong: 'Appuyée par les sources.',
          strongDetail:
            'Les sources citées appuient directement cette formulation. WeLearn a vérifié les sources, pas la science : relisez-la comme toute suggestion.',
          partial: 'Preuves limitées.',
          partialDefault:
            "Les sources donnent un contexte mais n'appuient pas directement cette formulation.",
          none: 'Non appuyée par les sources WeLearn.',
          noneDefault:
            "Aucune source n'appuie cette formulation : vérifiez-la avant de l'utiliser.",
          unchecked: "Les preuves n'ont pas pu être vérifiées.",
          uncheckedDetail:
            "Un problème technique a empêché la vérification : relisez cette formulation avant de l'utiliser."
        },
        unchecked:
          "Ses affirmations n'ont pas pu être vérifiées dans les ressources (un problème technique) : vérifiez-la avant de l'utiliser.",
        unbackedNames: "Nommé ici mais absent des ressources d'appui direct : {names}.",
        supportTag: {
          partial: 'Appui partiel',
          none: 'Sans appui des ressources WeLearn'
        },
        support: {
          partial:
            "Ces ressources donnent du contexte mais n'appuient pas directement cette modification : vérifiez-la avant de l'utiliser.",
          none: "Non appuyée par des ressources WeLearn : vérifiez-la avant de l'utiliser."
        },
        notes: {
          title: 'Repères pédagogiques (facultatifs)',
          hint: "Pour vous aider à juger cette modification. Ils n'en font pas partie et ne sont pas ajoutés à votre syllabus.",
          learning: 'Apprentissage visé',
          greencomp: 'GreenComp',
          teaching: "Idée d'enseignement",
          check: "Vérifier l'apprentissage"
        },
        accept: 'Accepter',
        keepOriginal: "Garder l'original",
        skip: 'Passer',
        skipped: "Passée : rien n'est ajouté à votre syllabus.",
        saveAndAccept: 'Enregistrer et accepter',
        accepted: 'Acceptée pour votre syllabus mis à jour',
        kept: 'Original conservé : votre cours reste tel quel.'
      }
    },
    check: {
      title: 'Vérifiez votre cours',
      description:
        'Relisez ce que WeLearn a compris de votre syllabus. Vous pouvez tout corriger avant d’explorer les adaptations liées à la durabilité.',
      showSubtopics: 'Afficher les sous-thèmes',
      editField: 'Modifier : {field}',
      editObjective: 'Modifier cet élément',
      outlineName: 'plan du cours',
      hideSubtopics: 'Masquer les sous-thèmes',
      checkedNote:
        "Lu par l'IA de WeLearn et comparé à votre syllabus. Ce qu'il n'a pas retrouvé mot pour mot est signalé pour que vous le vérifiiez.",
      uncheckedNote:
        "Lu par l'IA de WeLearn. WeLearn n'a pas pu lire le texte de ce fichier (un PDF scanné, par exemple) : il n'a donc pas pu comparer ce qu'il a lu à votre syllabus. Vérifiez-le.",
      readingPartial:
        'Certaines informations du cours peuvent manquer. Vérifiez les thèmes et les objectifs identifiés au regard de votre syllabus.',
      notSyllabus:
        "WeLearn n'est pas sûr que ce fichier soit un syllabus (il ressemble à : {type}). Vérifiez ce qu'il a lu, ou revenez en arrière pour ajouter votre syllabus.",
      overviewTitle: 'Votre cours',
      topicsLabel: 'Thèmes principaux',
      noTopics:
        "WeLearn n'a pas trouvé de liste des contenus du cours dans votre syllabus. Ajoutez les thèmes principaux.",
      noTopicsNoText:
        "WeLearn n'a pas pu lire le texte de ce fichier, il n'a donc pas pu trouver ses thèmes. Ajoutez-les ici.",
      addTopic: 'Ajouter un thème',
      removeTopic: 'Retirer {topic}',
      descriptionLabel: 'Description du cours',
      noClearDescription:
        "WeLearn n'a pas pu isoler une description de cours claire. Ajoutez-en une, ou modifiez ce qu'il a lu.",
      seeWhatWasRead: 'Voir ce que WeLearn a lu à la place',
      removedDescription: 'Vous avez retiré la description lue par WeLearn.',
      bringBack: 'La rétablir',
      notFound: 'Non trouvé dans votre syllabus.',
      add: 'Ajouter',
      objectivesTitle: "Objectifs d'apprentissage",
      sortedNote: 'Classés selon le titre sous lequel ils figurent dans votre syllabus.',
      unsortedNote:
        'WeLearn renvoie les objectifs et les compétences en une seule liste : déplacez chaque compétence ou objectif de niveau diplôme dans son groupe.',
      types: {
        syllabus: 'un syllabus',
        course_plan: 'un plan de cours',
        lesson: 'une séance seule',
        partial: "une description partielle d'un cours",
        other: 'un autre type de document',
        article: 'un article',
        unknown: 'incertain',
        none: 'vide'
      },
      groups: {
        objective: 'Objectifs du cours',
        competency: 'Compétences',
        programme: 'Objectifs de niveau diplôme'
      },
      emptyGroup: 'Aucun pour le moment.',
      moveTo: 'Déplacer vers',
      addObjective: 'Ajouter un objectif du cours',
      addCompetency: 'Ajouter une compétence',
      origin: {
        extracted: 'Lu dans votre syllabus',
        unverified: 'Non retrouvé mot pour mot dans votre syllabus : à vérifier',
        unchecked: "Lu par l'IA de WeLearn",
        edited: 'Corrigé par vous',
        added: 'Ajouté par vous'
      },
      edit: 'Modifier',
      save: 'Enregistrer',
      cancel: 'Annuler',
      remove: 'Retirer',
      restore: "Rétablir l'original",
      showMore: 'Afficher tout le texte',
      showLess: 'Afficher moins',
      planTitle: 'Plan de cours de votre syllabus ({n} lignes)',
      notRead:
        "WeLearn n'utilise pas encore vos évaluations ni votre calendrier détaillé. Ils restent dans votre syllabus, sans changement.",
      openOriginal: 'Ouvrir l’original',
      fromDocument: 'Issu de votre syllabus',
      notFoundOverview: 'Non identifié par WeLearn :',
      tag: {
        suggested: 'Suggestion de WeLearn',
        generated: 'Rédigé par WeLearn',
        identified: 'Identifiés par WeLearn',
        check: 'À vérifier'
      },
      noTopicsFound:
        "WeLearn n'a pas identifié de thèmes principaux. Les ajouter aide WeLearn à proposer des liens adaptés à votre cours.",
      addTopics: 'Ajouter les thèmes principaux',
      outlineTitle: 'Plan du cours ({n})',
      outlineHint: 'Une séance, une semaine ou un chapitre par ligne.',
      showAll: 'Afficher les {n} objectifs',
      showFewer: 'Afficher moins',
      editObjectives: 'Modifier les objectifs',
      done: 'Terminé',
      sessions: 'Séances',
      more: 'Plus de détails (facultatif)',
      moreHint:
        'La façon dont le cours est enseigné. N’ajoutez que ce qui compte pour votre cours.',
      overviewLabel: 'Présentation',
      aiSummary: 'Résumé généré par WeLearn à partir de votre syllabus. Relisez-le.',
      topicTitle: 'Thème',
      subtopics: 'Sous-thèmes, séparés par des virgules',
      saveChanges: 'Enregistrer les modifications',
      topicsByAi: "Identifiés par l'IA de WeLearn à partir du contenu de votre cours.",
      pleaseCheck: 'introuvable dans votre syllabus : à vérifier',
      noObjectives:
        "Aucun objectif d'apprentissage explicite n'a été trouvé dans votre syllabus. Vous pouvez continuer avec la description et les thèmes de votre cours, ou ajouter des objectifs si vous le souhaitez.",
      programmeAside: 'Objectifs de la formation mis de côté ({n})',
      programmeAsideHint:
        'Ils concernent toute la formation, pas ce cours : WeLearn ne les utilise pas pour votre cours.',
      moveToCourse: 'Remettre dans les objectifs du cours',
      unsortedTitle: 'À vérifier : objectifs que WeLearn n’a pas pu classer ({n})',
      unsortedHint:
        'Votre syllabus ne dit pas clairement s’ils relèvent de ce cours ou de la formation ou de l’établissement. WeLearn ne les utilise pas tant que vous ne les avez pas classés.',
      sortToCourse: 'Objectif du cours',
      sortAside: 'Pas pour ce cours',
      localNote: 'Vos corrections restent dans cet onglet du navigateur.',
      needObjective: 'Ajoutez une présentation, un thème ou un objectif du cours pour continuer.',
      action: 'Confirmer mon cours',
      recap: 'Aucun objectif du cours | 1 objectif du cours | {n} objectifs du cours',
      recapTopics: 'Aucun thème principal | 1 thème principal | {n} thèmes principaux'
    },
    steps: {
      course: 'Importer le syllabus',
      check: 'Vérifier le cours',
      additions: 'Ajouts de durabilité',
      updated: 'Syllabus mis à jour',
      idea: 'Votre idée de cours',
      proposal: 'La proposition de WeLearn',
      documents: 'Documents',
      summary: 'Résumé',
      resources: 'Ressources',
      syllabus: 'Votre syllabus'
    },
    documentsStep: {
      title: 'Ajoutez votre syllabus ou vos supports de cours',
      description:
        "Importez 1 à 3 documents : votre syllabus actuel, si vous en avez un, et les supports sur lesquels repose votre cours (articles, chapitres d'ouvrage…). WeLearn construit un nouveau syllabus à partir de ceux-ci.",
      dropzone: 'Déposez vos fichiers ici ou',
      browse: 'parcourez',
      limits: 'PDF, DOCX ou TXT · 5 Mo max · 3 fichiers maximum',
      hint: 'Cette fonctionnalité est en bêta.',
      exampleLink: 'Voir un exemple de document',
      removeFile: 'Retirer {name}',
      noFile: 'Ajoutez au moins un document pour continuer.',
      languageLabel: 'Langue du syllabus',
      detailsTitle: 'Parlez-nous de votre cours',
      recommended: 'Fortement recommandé',
      detailsWhy:
        'Plus vous en dites, plus le syllabus sera adapté à votre cours. Sans ces informations, il restera générique.',
      titleLabel: 'Titre du cours',
      titlePlaceholder: 'ex. : Introduction à la sociolinguistique',
      levelLabel: "Niveau d'études",
      levelPlaceholder: 'ex. : Licence 1',
      durationLabel: 'Durée',
      durationPlaceholder: 'ex. : 6 semaines, 2 heures par semaine',
      descriptionLabel: 'Description et objectifs du cours',
      descriptionPlaceholder:
        'ex. : Les étudiants découvrent les concepts clés de la sociolinguistique et apprennent à analyser les usages de la langue dans leur environnement.',
      nudge: 'Sans informations sur le cours, votre syllabus sera générique.',
      addDetails: 'Ajouter des informations',
      continueAnyway: 'Continuer quand même',
      aiNotice: "Vos fichiers sont envoyés à WeLearn pour être analysés par l'IA.",
      action: 'Analyser mes documents',
      recap: '{files} · {lang}'
    },
    summaryStep: {
      title: 'Le résumé de vos documents',
      description:
        "Voici ce que WeLearn a retenu de chaque document. Vous pouvez l'ajuster si besoin : il oriente la recherche de ressources.",
      noFileName: 'Document {n}',
      aiLabel: "Analysé par l'IA de WeLearn",
      action: 'Trouver des ressources',
      recap: 'Aucun document résumé | 1 document résumé | {n} documents résumés'
    },
    resourcesStep: {
      title: 'Choisissez des ressources à intégrer',
      description:
        'Ces ressources WeLearn correspondent à vos documents et aident à relier votre cours aux Objectifs de développement durable. Cliquez sur une ressource pour la sélectionner.',
      selected:
        'Aucune ressource sélectionnée | 1 ressource sélectionnée | {n} ressources sélectionnées',
      allHint: 'Aucune sélection : WeLearn utilisera toutes les ressources ci-dessus.',
      passageLabel: 'Passage qui correspond à vos documents',
      action: 'Générer le syllabus',
      noSources: 'Aucune ressource associée trouvée',
      noSourcesDescription:
        "Vous pouvez tout de même générer un syllabus à partir de vos documents seulement, mais il fera moins de liens avec la durabilité. Pour obtenir des ressources, revenez en arrière et essayez d'autres documents.",
      searchError:
        'La recherche de ressources a échoué. Vous pouvez tout de même générer un syllabus à partir de vos documents.',
      recapAll: 'Toutes les ressources'
    },
    syllabusStep: {
      title: 'Votre syllabus est prêt',
      description:
        'Cliquez sur le texte pour le modifier, demandez des modifications à WeLearn, puis téléchargez-le au format Word.',
      aiLabel: "Rédigé par l'IA de WeLearn. Relisez-le et gardez ce qui convient à votre cours.",
      feedbackLabel: 'Demander des modifications',
      feedbackPlaceholder:
        "ex. : Ajouter une semaine sur l'évaluation, raccourcir la bibliographie, rendre le cours plus pratique…",
      regenerate: 'Régénérer avec mes modifications',
      feedbackError: "Vos modifications n'ont pas pu être appliquées. Veuillez réessayer.",
      feedbackHistory: 'Modifications déjà demandées ({n})',
      openLink: 'Ouvrir',
      download: 'Télécharger (.docx)',
      restart: 'Créer un nouveau syllabus'
    },
    loading: {
      read: {
        title: 'Lecture de votre syllabus',
        description:
          'WeLearn repère la description et les objectifs d\x27apprentissage de votre syllabus.'
      },
      extract: {
        title: 'Lecture de vos documents',
        description: 'WeLearn repère les idées principales de chaque document.'
      },
      search: {
        title: 'Recherche de ressources associées',
        description:
          'WeLearn parcourt sa bibliothèque pour trouver des ressources liées à vos documents.'
      },
      syllabus: {
        title: 'Rédaction de votre syllabus',
        description:
          'WeLearn combine vos documents, les informations du cours et les ressources. Cela peut prendre jusqu’à une minute : merci de ne pas fermer ni recharger la page.'
      },
      feedback: {
        title: 'Application de vos modifications',
        description: 'WeLearn met à jour le syllabus selon votre demande.'
      }
    },
    error: {
      title: 'Un problème est survenu',
      read: 'Impossible de lire votre syllabus.',
      extract: 'Impossible de lire vos documents.',
      search: 'Impossible de rechercher des ressources associées.',
      syllabus: 'Impossible de rédiger le syllabus.',
      kept: 'Vos informations sont conservées.',
      retry: 'Réessayer',
      cancel: 'Annuler'
    },
    // used by the hidden /tutor_test version
    summaries: {
      noFileName: 'Aucun nom de fichier fourni',
      title: 'Résumés des documents importés',
      description:
        'WeLearn a extrait les points clés de vos documents importés pour générer le syllabus.'
    },
    secondStep: {
      title: 'Sélectionnez des ressources additionnelles',
      description:
        "Les ressources ci-dessous sont liées aux Objectifs de développement durable (ODD), et seront utilisées pour intégrer la durabilité dans votre cours. Si aucune ressource additionnelle n'est sélectionnée, le syllabus sera basé uniquement sur vos documents.",
      noSources: 'Aucune ressource en lien avec vos documents n’a été trouvée.',
      noSourcesDescription:
        'Vous pouvez poursuivre uniquement avec vos documents importés, mais l’intégration de la durabilité dans votre syllabus pourrait être limitée.\nPour parcourir des ressources additionnelles différentes, revenez à l’étape précédente pour modifier vos documents importés.'
    }
  },
  microlearning: {
    mainTitle: 'Choisissez un sujet :',
    chooseSdg: "Choisissez l'ODD qui vous intéresse :"
  },
  autoEvaluation: {
    notAtAll: 'Pas vraiment',
    tottally: 'Complètement',
    start: {
      badge: 'Avant de commencer',
      title: 'Deux petites questions',
      subtitle: "30 secondes pour nous aider à mesurer l'apport pédagogique de ce parcours.",
      lockedNotice:
        'Vous avez commencé le parcours : ces réponses sont donc verrouillées. Elles indiquent votre point de départ, ce qui nous permet de mesurer ce qui a changé.'
    },
    end: {
      badge: 'Avant de partir',
      title: 'Un dernier mot',
      subtitle:
        "Les mêmes questions qu'au départ, plus deux autres, pour mesurer ce qui a évolué. Toujours 30 secondes."
    },
    firstQuestion:
      'Je vois clairement le lien entre ma discipline ({discipline}) et la transition écologique.',
    secondQuestion: "Je me sens capable d'intégrer ce sujet dans mon enseignement.",
    willUse: 'Comptez-vous utiliser ce que vous venez de voir dans un prochain cours ?',
    feedback: 'Une remarque à partager avec nous ?'
  },
  previous: 'Précédent',
  previous_page: 'Page précédente',
  next_page: 'Page suivante',
  validate: 'Valider',
  validated: 'Validé',
  edit: 'Modifier',
  save: 'Enregistrer',
  finish: 'Terminer',
  skip: 'Passer cette étape',
  yes: 'Oui',
  maybe: 'Peut-être',
  notForNow: "Pas pour l'instant",
  typeHere: 'Écrivez votre réponse ici',
  courseInformation: 'Informations sur le cours',
  inputMode: 'Mode de saisie',
  inputFile: 'Ajouter un fichier',
  courseMetadataOnly: 'Informations sur le cours uniquement',
  courseMetadataAndDocument: 'Informations sur le cours + document',
  existingSyllabus: 'Syllabus existant',
  discipline: 'Matière',
  disciplinePlaceholder: 'Exemple : Sociolinguistique',
  disciplineExample: 'Exemple : Sociolinguistique',
  topic: 'Thème',
  topicPlaceholder: 'Exemple : Sociolinguistique et justice sociale',
  topicExample: 'Exemple : Sociolinguistique et justice sociale',
  level: 'Niveau d’études',
  levelPlaceholder: 'Exemple : Licence',
  levelExample: 'Exemple : Licence',
  num_sessions: 'Nombre de séances',
  numSessionsPlaceholder: 'Nombre de séances dans le cours',
  numSessionsExample: 'Exemple : 6',
  session_duration: 'Durée d’une séance (en heures)',
  sessionDurationPlaceholder: 'Durée d’une séance en heures',
  sessionDurationExample: 'Exemple : 1,5',
  syllabus_mode: 'Mode de saisie du syllabus',
  session_type: 'Type de séance',
  sessionTypePlaceholder: 'Cours magistral, TD, TP, etc.',
  sessionTypeExample: 'Exemple : Cours magistral',
  class_size: 'Taille de la classe',
  classSizePlaceholder: 'Nombre d’étudiant·es',
  classSizeExample: 'Exemple : 30',
  session_mode: 'Mode de séance',
  inPerson: 'Présentiel',
  remote: 'Distanciel',
  hybrid: 'Hybride',
  output_language: 'Langue de sortie',
  french: 'Français',
  english: 'Anglais',
  PRESENTIEL: 'Présentiel',
  REMOTE: 'Distanciel',
  HYBRID: 'Hybride',
  user_description: 'Description du cours',
  courseDescriptionPlaceholder: 'Ajoutez une brève description pour améliorer le syllabus généré.',
  descriptionExample:
    'Exemple : Ce cours propose une introduction aux grandes questions de la sociolinguistique, en étudiant les liens entre langage et société, les politiques linguistiques, le contact des langues et les méthodes de recherche. Il permet d’acquérir les principales théories, la terminologie de base et les méthodologies du travail de terrain et de l’analyse sociolinguistique.',
  courseDescription: 'Description',
  learningObjectives: 'Objectifs d’apprentissage',
  learningObjectivesSubtitle:
    'Les objectifs d’apprentissage sont des énoncés clairs et concis qui décrivent ce que les étudiant·es devraient savoir, comprendre ou être capable de faire à la fin d’un cours ou d’une leçon.',
  sustainabilityIntegration: 'Intégration de la durabilité',
  sustainabilityIntegrationSubtitle:
    "L'intégration de la durabilité dans un cours consiste à incorporer des concepts, des pratiques et des perspectives liés au développement durable dans le contenu, les activités et les évaluations du cours. Cela peut inclure l'exploration des enjeux environnementaux, sociaux et économiques, ainsi que la promotion de la pensée critique et de la responsabilité envers les générations futures.",
  resourcesUsed: 'Resources utilisées',
  learningOutcomes: 'Résultats d’apprentissage',
  learningOutcomesSubtitle:
    'Les résultats d’apprentissage sont des énoncés spécifiques qui décrivent ce que les étudiant·es devraient être capable de démontrer ou d’accomplir à la fin d’un cours ou d’une leçon. Ils sont mesurables et observables, permettant aux enseignant·es d’évaluer si les objectifs d’apprentissage ont été atteints.',
  competencies: 'Compétences',
  greenCompCompetenciesSubtitle:
    'Les compétences sont un ensemble de connaissances, de savoir-faire et d’attitudes qu’un individu développe et utilise pour accomplir des tâches, résoudre des problèmes et s’adapter à différentes situations. Elles peuvent être techniques, cognitives, sociales ou émotionnelles, et sont essentielles pour réussir dans la vie professionnelle et personnelle.',
  greenCompCompetencies: 'Compétences GreenComp',
  provideFeedback: 'Faites un retours',
  seeConnectionExplanation: "Voir l'explication"
};
