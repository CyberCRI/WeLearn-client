import { microLearning } from './microLearning/fr';
export const fr = {
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
  chat: 'Chat',
  chatInputPlaceholder: 'Poser une question',
  chatNoResults:
    'Aucun résultat avec les filtres actuels. Essayez d’ajuster votre recherche ou de retirer certains filtres.',
  chatProvideValidQuestion: 'Veuillez saisir une question valide.',
  clearBookmarks: 'Supprimer tous les favoris',
  clearChat: 'Effacer la conversation',
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
    steps: {
      documents: 'Documents',
      summary: 'Résumé',
      resources: 'Ressources',
      syllabus: 'Syllabus'
    },
    documentsStep: {
      title: 'Ajoutez vos supports de cours',
      description:
        "Importez 1 à 3 documents sur lesquels repose votre cours (articles, chapitres d'ouvrage…). WeLearn construit le syllabus à partir de ceux-ci.",
      dropzone: 'Déposez vos fichiers ici ou',
      browse: 'parcourez',
      limits: 'PDF, DOCX ou TXT · 5 Mo max · 3 fichiers maximum',
      hint: "Cette fonctionnalité est en bêta : les articles scientifiques et les chapitres d'ouvrage donnent les meilleurs résultats.",
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
      action: 'Analyser mes documents',
      recap: '{files} · {lang}'
    },
    summaryStep: {
      title: 'Le résumé de vos documents',
      description:
        "Voici ce que WeLearn a retenu de chaque document. Vous pouvez l'ajuster si besoin : il oriente la recherche de ressources.",
      noFileName: 'Document {n}',
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
