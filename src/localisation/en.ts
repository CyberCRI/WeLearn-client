import { microLearning } from './microLearning/en';
import { authentication } from './authentication/en';

export const en = {
  authentication,
  microLearning,
  ':': ':',
  adaptedTo: 'Adapted to:',
  addBookmark: 'Add to bookmarks',
  back: 'Back',
  bookmarks: 'Bookmarks',
  cardArticle: {
    seeDetails: 'See details',
    openArticle: 'Open article',
    addBookmark: 'Add to bookmarks',
    removeBookmark: 'Remove from bookmarks'
  },
  contactUs: 'Contact us',
  logout: 'Log out',
  login: 'Log in',
  chat: 'Chat',
  chatInputPlaceholder: 'Ask a question',
  chatNoResults:
    'No results with the current filters. Try adjusting your search or removing some filters.',
  chatProvideValidQuestion: 'Please enter a valid question.',
  clearBookmarks: 'Clear bookmarks',
  clearChat: 'Clear chat',
  chatError: 'Something went wrong. Please try again later.',
  cancel: 'Cancel',
  confirmClearChat: 'Delete this whole conversation?',
  goToBottom: 'Scroll to latest message',
  clearSearch: 'Clear search',
  closeSidebar: 'Hide sidebar',
  copied: 'Copied!',
  copy: 'Copy',
  categories: {
    science_communication_and_outreach: 'Science Communication',
    expert_reports: 'Institutional Reports',
    academic_scientific_publications: 'Scientific Publications',
    teaching_resources: 'Educational Resources',
    collaborative_and_encyclopedic_knowledge: 'Collaborative and Encyclopedic Knowledge',
    null: 'Uncategorized'
  },
  corpus: {
    'notre-environnement': 'notre-environnement',
    unesdoc: 'Unesdoc',
    'ird-le-mag': "IRD Le Mag'",
    unccelearn: 'UN CC:e-Learn',
    conversation: 'The Conversation',
    hal: 'HAL',
    ipbes: 'IPBES',
    ipcc: 'IPCC',
    oapen: 'OAPEN',
    'open-edition-books': 'OpenEdition Books',
    openalex: 'OpenAlex',
    'bmj-open': 'BMJ Open',
    peerj: 'PeerJ',
    plos: 'PLOS',
    'press-books': 'Pressbooks',
    ted: 'TED',
    uved: 'UVED',
    'fao-open-knowledge': 'Food and Agriculture Organization of the United Nations',
    'world-bank-open-knowledge-repository': 'World Bank',
    wikipedia: 'Wikipedia'
  },
  download: 'Download',
  defaultQueues: [
    'Is nuclear energy a sustainable solution?',
    'Is climate change caused by humans?',
    'Can technology alone solve the climate crisis?',
    'Is economic growth compatible with sustainability?',
    'How does engineering contribute to the ecological transition?',
    'How does architecture contribute to the ecological transition?',
    'How can business schools teach sustainability without greenwashing?',
    'What role does AI play in the ecological transition?',
    'Carbon tax vs. cap-and-trade: which works better?',
    ' Degrowth or green growth: which makes more sense?',
    " Nuclear vs. renewables: what's the real trade-off?"
  ],
  hintForNewQuestions: 'Here are some additional questions to explore this topic further:',
  description:
    'Explore resources, learn, and boost sustainability integration in your courses with AI.',
  emptyChatAction: 'Try asking me:',
  emptyChatPresentation: 'Hello! I’m WeLearn, your AI assistant for the SDGs. How can I help?',
  error: {
    UNKNOWN_ERROR: {
      title: 'Oops!',
      description: 'Something went wrong. Please try again.'
    },
    COLL_NOT_FOUND: {
      title: 'Oops!',
      description: 'This collection isn’t available in the language of your search yet.'
    },
    LANG_NOT_SUPPORTED: {
      title: 'Sorry!',
      description: 'This language isn’t supported yet.'
    }
  },
  errorModalGeneric: {
    title: 'Sorry, something went wrong.',
    message: 'Please try again or reload the page.',
    action: 'Reload page'
  },
  extract: 'Relevant excerpt',
  filterBySource: 'Filter by source',
  filterSDG: 'Filter by SDG',
  filteredBySDG: 'Filtered by SDG: | Filtered by SDGs:',
  genSyllabus: 'Generate syllabus',
  goToSources: 'View sources',
  goToTop: 'Back to top',
  gotIt: 'Got it!',

  helpUser: {
    'q&a': {
      title: 'Using the Chat feature',
      step1: {
        description:
          'Welcome to WeLearn Chat! Ask our SDG-focused AI assistant about sustainable development. Answers are grounded in curated, reliable sources.'
      },
      step2: {
        description: 'Type your own question or choose a suggested question.',
        image: 'chat_2.png'
      },
      step3: {
        description: 'Your answer will appear in the chat.',
        image: 'chat_3.png'
      },
      step4: {
        description: 'Copy the answer or have it rephrased.',
        image: 'chat_4.png'
      },
      step5: {
        description:
          'For each question, WeLearn runs a semantic search to find the most relevant documents in our database and generate a sourced answer.'
      },
      step6: {
        description:
          'You have access to the cited sources. Click any source to open it in a new tab.',
        image: 'chat_6.png'
      },
      step7: {
        description: 'You can also add a bookmark to save the answer for later.',
        image: 'chat_7.png'
      },
      step8: {
        description: 'Filter results by SDGs and/or sources to refine your search.',
        image: 'chat_8.png'
      }
    },
    search: {
      title: 'Using the Search feature',
      step1: {
        description:
          'Welcome to WeLearn Search! Find educational resources on the Sustainable Development Goals (SDGs). The search uses a semantic engine; the longer your query, the better the results. Learn more about our sources and selection criteria in the About section.'
      },
      step2: {
        description: 'Type your query or paste some text to find relevant documents.'
      },
      step3: {
        description: 'Refine results by filtering by SDGs and/or sources.'
      }
    },
    syllabus: {
      title: 'Using the Syllabus Generation feature',
      step1: {
        description:
          'Welcome to WeLearn Syllabus Generation! Create a syllabus for your course based on your uploaded documents and relevant documents from WeLearn’s resources. You can add course details to personalise the syllabus, and refine the generated syllabus by providing feedback.'
      },
      step2: {
        description: 'Add one or more documents. These will be used to generate the syllabus.'
      },
      step3: {
        description: 'Add course details to personalise the generated syllabus to your context.'
      },
      step4: {
        description:
          'Select documents from the WeLearn results to include. If none are selected, the syllabus will be based only on your uploaded documents.'
      },
      step5: {
        description: 'Provide feedback to refine and improve the syllabus.'
      }
    },
    bookmarks: {
      title: 'Using the Bookmarks feature',
      step1: {
        description: 'Welcome to WeLearn Bookmarks! Revisit items you saved from previous results.'
      },
      step2: {
        description:
          'Click the bookmark icon to save a result; once saved, the icon appears filled.'
      },
      step3: {
        description: 'Click the bookmark icon again to remove a bookmark.'
      },
      step4: {
        description: 'Remove all bookmarks at once by clicking the trash icon.'
      }
    }
  },
  hideAuthors: 'Hide authors',
  hideFilters: 'Hide filters',
  hideSources: 'Hide sources',
  lang: {
    fr: 'French',
    en: 'English'
  },
  languages: 'Languages',
  landing: {
    sourceNameTitle: 'Resource name',
    sourceUrlTitle: 'Resource link',
    sourceNumberTitle: 'Number of documents',
    sourcesTitle: 'About our resources',
    sourcesDescription_1:
      'WeLearn provides access to a curated collection of open, reliable, and high-quality resources related to the Sustainable Development Goals (SDGs). These resources were identified through a large-scale analysis of more than 16 million online documents.',
    sourcesDescription_2:
      'All resources on the platform meet three core selection criteria:\nopenness, through the use of open-access documents;\nreliability, by drawing on recognized and trusted collections; and\nrelevance, ensured by a classification model that only retains content explicitly linked to one of the 17 SDGs.',
    sourcesDescription_3: 'The table below shows how documents are distributed by source.',

    slogan: 'Sustainability education made easy',
    description: 'Explore resources, learn, and use AI to bring sustainability into your courses.',
    aboutTitle: 'About WeLearn',
    aboutDescription:
      'WeLearn is an AI-powered platform that helps educators bring sustainability into their teaching. It draws on a curated collection of open, reliable resources linked to the Sustainable Development Goals (SDGs) and uses them to power practical teaching tools: search, a Q&A assistant, syllabus design, and micro-learning.',
    partnership:
      'WeLearn is developed by the Learning Planet Institute as part of the TEDS project (“Ecological Transition for Sustainable Development”), jointly led with the UVED Foundation and CY Cergy Paris University. TEDS is funded by the French National Research Agency under France 2030 and the “New University Curricula” call for projects (ref. ANR-17-NCUN-0016).',
    horizontal: {
      section_one: {
        title: 'Curated knowledge on sustainability',
        content:
          'WeLearn features open, reliable content on the Sustainable Development Goals (SDGs), carefully selected from trusted sources.'
      },
      section_two: {
        title: 'Find what matters, fast',
        content:
          'Explore sustainability topics and quickly find the right resources with WeLearn’s semantic search engine.'
      },
      section_three: {
        title: 'Sourced answers, tailored to you',
        content:
          'Chat with the WeLearn virtual assistant to get precise, referenced answers adapted to your context.'
      }
    },
    vertical: {
      section_one: {
        title: 'Supporting sustainability with AI',
        content:
          'We place sustainability at the heart of our mission, using technology to support a responsible future.'
      },
      section_two: {
        title: 'Simplifying sustainability education',
        content:
          'We are dedicated to empowering educators worldwide to learn and teach about sustainability.'
      },
      section_three: {
        title: 'Upholding responsible AI principles',
        content:
          'We are committed to a transparent and eco-conscious use of artificial intelligence.'
      }
    }
  },
  moreDocuments: 'Explore more documents',
  nav: {
    chat: 'Chat',
    search: 'Search',
    bookmarks: 'Bookmarks',
    syllabus: 'Create a syllabus',
    about: 'About',
    help: 'Help',
    profile: 'Profile',
    microlearning: 'Micro-learning',
    workshopForm: 'Workshop Form'
  },

  next: 'Next',
  noBookmarks: 'No bookmarks yet',
  noFiltersSelected: 'No filters selected',
  noResults: 'No results for this search',
  openSidebar: 'Open sidebar',
  onboarding: {
    welcome: {
      title: 'Welcome to WeLearn!',
      description:
        'We’re excited to have you on board. WeLearn is your AI-powered learning platform designed to support you in integrating sustainability into your courses.',
      help: "You can learn more about WeLearn's features in the <strong>Help</strong> section of the navigation bar.",
      action: 'Let’s start!'
    },
    metricsData: {
      explanation: {
        1: 'Help us better understand our community by sharing your institution and role. This information is',
        2: ' optional',
        3: ' and used for statistical purposes only.'
      },
      institutionLabel: 'Institution (university, organization, etc.)',
      institutionPlaceholder: 'University of Bordeaux',
      roleLabel: 'Role (professor, student, etc.)',
      rolePlaceholder: 'Professor',
      consentLabel: 'I do not wish to share this information.'
    }
  },
  profile: {
    title: 'My profile',
    name: 'Name',
    email: 'Email',
    language: 'Language',
    bookmarksLoginRequired: 'Log in to see your bookmarks',
    notAvailable: 'Not available',
    notAuthenticated: 'You are not logged in.'
  },
  reload: 'Reload',
  clearFilters: 'Clear all filters',
  filtersSelected: '{n} selected',
  removeAll: 'Clear all',
  removeBookmark: 'Remove bookmark',
  removeSelection: 'Clear',
  sdgsAcronym: 'SDGs',
  sdgs: {
    1: 'No Poverty',
    2: 'Zero Hunger',
    3: 'Good Health and Well-Being',
    4: 'Quality Education',
    5: 'Gender Equality',
    6: 'Clean Water and Sanitation',
    7: 'Affordable and Clean Energy',
    8: 'Decent Work and Economic Growth',
    9: 'Industry, Innovation and Infrastructure',
    10: 'Reduced Inequalities',
    11: 'Sustainable Cities and Communities',
    12: 'Responsable Consumption and Production',
    13: 'Climate Action',
    14: 'Life Below Water',
    15: 'Life on Land',
    16: 'Peace, Justice and Strong Institutions',
    17: 'Partnerships for the Goals'
  },
  search: 'Search',
  searchFilters: 'Search filters',
  searchPlaceholder: 'Enter or paste text here.\nLonger texts yield better results.',
  search_sdgs_in_query: 'SDGs in query',
  selectAll: 'Select all',
  selectSubject: 'Choose a discipline',
  selectSubjectInfo: 'Select a discipline to tailor results to your field.',
  selectedSource: 'Filtered by source: | Filtered by sources:',
  showFilters: 'Show filters',
  showMoreAuthors: 'Show more',
  showSources: 'Show sources',

  chatProcessingSteps: {
    fetching_resources: 'Getting resources from WeLearn database',
    analyzing_resources: 'Analyzing relevant resources',
    generating_answer: 'Generating your answer'
  },

  sources: 'Sources',
  sourcesList: {
    fetching: 'Searching across {docs_nb} documents...',
    formulatingAnswer: 'Preparing your answer...',
    exportBibliography: 'Export bibliography',
    exportingBibliography: 'Exporting...'
  },
  terms: 'Privacy Policy',
  subjects: {
    Anthropology: 'Anthropology',
    Arts: 'Arts',
    Biology: 'Biology',
    Business: 'Business',
    Chemistry: 'Chemistry',
    Cs: 'Computer Science',
    Earth: 'Earth Science',
    Economics: 'Economics',
    Engineering: 'Engineering',
    Geography: 'Geography',
    History: 'History',
    Law: 'Law',
    Literature: 'Literature',
    Math: 'Mathematics',
    Medicine: 'Medicine',
    Physics: 'Physics',
    Political: 'Political Science',
    Psychology: 'Psychology',
    Sociology: 'Sociology',
    Space: 'Space Science',
    Theology: 'Theology'
  },
  textLengthFeedback: 'Please add more text to improve search results.',
  tutor: {
    BIG_FILE: 'File size exceeds 5 MB.',
    BAD_EXTENSION: 'File type not supported. Only PDF, TXT, and DOCX files are allowed.',
    TOO_MANY_FILES: 'You can add up to 3 files.',
    edit: 'Edit',
    collapse: 'Close',
    start: {
      question: 'How would you like to start?',
      intro: "Adapt a course you already teach, or create a new one with WeLearn's guidance.",
      yes: 'Adapt an existing course',
      no: 'Create a new course',
      yesHint:
        'Upload your syllabus and explore how to integrate sustainability into your teaching.',
      noHint: 'Develop a course from your teaching goals, step by step.',
      inDevelopment: 'In development',
      workingNew: 'Creating a new course',
      newInProgress: 'This path is still being built: its screens are not available yet.',
      change: 'Change',
      changeWarning: 'Changing will discard what you have added for this course.',
      discard: 'Discard and change',
      back: 'Back to starting options',
      backWarning: 'Going back will discard your syllabus and what you have added for this course.',
      discardBack: 'Discard and go back',
      keepWorking: 'Keep working'
    },
    course: {
      title: 'Your course',
      description: 'Upload your syllabus to get started.',
      dropzone: 'Drop your syllabus here or',
      limits: 'One file · PDF, DOCX or TXT · 5 MB max',
      contextTitle: 'Teaching context',
      optional: '(optional)',
      contextHint:
        'How the course is taught. Filled in from your syllabus where it says so; complete the rest if you wish.',
      fields: {
        title: 'Course title',
        discipline: 'Discipline',
        level: 'Level',
        sessions: 'Number of sessions',
        sessionLength: 'Session length',
        sessionType: 'Session type',
        sessionMode: 'Format',
        classSize: 'Number of students'
      },
      disciplinePlaceholder: 'e.g. Economics',
      choose: 'Choose…',
      readByAi: 'Read by WeLearn AI: please check',
      suggestedByAi: 'not stated in your syllabus: suggested by WeLearn from the course content',
      fromSyllabus: 'From your syllabus',
      levels: {
        l1: 'Bachelor, year 1',
        l2: 'Bachelor, year 2',
        l3: 'Bachelor, year 3',
        m1: 'Master, year 1',
        m2: 'Master, year 2',
        doctorate: 'Doctorate',
        other: 'Other'
      },
      sessionTypes: {
        lecture: 'Lecture',
        tutorial: 'Tutorial',
        practical: 'Practical or lab',
        seminar: 'Seminar',
        project: 'Project',
        mixed: 'Mixed'
      },
      modes: {
        PRESENTIEL: 'In person',
        DISTANCIEL: 'Remote',
        HYBRIDE: 'Hybrid'
      },
      aiNotice:
        "WeLearn uses AI to read your syllabus. You'll be able to review and correct the information before continuing.",
      noFile: 'Upload a syllabus to continue.',
      action: 'Continue',
      recap: '{file}'
    },
    reading: {
      sending: 'Sending your syllabus',
      sent: 'Syllabus sent',
      reading: 'WeLearn is reading your course',
      elapsed: '{seconds} s',
      cancel: 'Cancel',
      unavailable: {
        title: 'WeLearn could not be reached',
        text: 'Your syllabus was not read. Please try again in a moment.'
      },
      error: {
        title: 'WeLearn could not read this syllabus',
        text: 'Please try again, or choose another file.'
      }
    },
    updated: {
      back: 'Back to sustainability connections',
      title: 'Your updated syllabus',
      intro:
        'Preview your course with the changes you approved, or list the changes alone. Your uploaded syllabus is not changed.',
      approvedCount: 'no approved change | 1 approved change | {n} approved changes',
      noChanges: 'No change approved yet: your course is unchanged.',
      changesView: 'Changes only ({n}) | Changes only ({n}) | Changes only ({n})',
      courseView: 'Updated course',
      copy: 'Copy approved changes',
      copied: 'Copied',
      download: 'Download outline and changes (Word)',
      copyHint: 'Plain text: each approved change, where it belongs, why, and its sources.',
      downloadHint:
        'Word document: your updated course outline, then the approved changes with their sources.',
      placementUnknown: 'Placement to choose',
      replaces: 'Replaces:',
      remove: 'Remove',
      revised: 'Revised',
      seeOriginal: 'See the original',
      outlineNote:
        'Outline of your course as checked in step 2, with the approved changes in green.',
      outlineNoteComplete:
        'Preview of the Word document: your syllabus text in its order, with the approved changes in green. You can edit an approved change here.',
      localNote:
        'Your choices stay in this browser tab while you move between steps. They are lost if the page is reloaded, unless you save a draft (at the bottom of the page): otherwise download or copy them first.',
      complete: {
        download: 'Download updated syllabus (Word)',
        hint: 'Word document: all the text of your syllabus, with your approved changes marked where they belong.',
        layoutNote:
          'The Word document includes your original syllabus content and approved changes, and you can keep editing it in Word. Formatting may differ from the original: tables and columns appear as plain text. | The Word document includes your original syllabus content and approved changes, and you can keep editing it in Word. Formatting may differ from the original: tables and columns appear as plain text. 1 change could not be placed and is listed at the end. | The Word document includes your original syllabus content and approved changes, and you can keep editing it in Word. Formatting may differ from the original: tables and columns appear as plain text. {n} changes could not be placed and are listed at the end.',
        unavailable:
          'The full text of this file could not be checked, so the Word document contains your course outline and approved changes.',
        title: '{title} — updated syllabus',
        note: 'Complete text of the original syllabus, with the changes approved by the teacher marked in green. The layout of the original document (tables, columns) is not reproduced; the uploaded file itself is unchanged.',
        change: 'Approved change',
        toPlaceNote:
          'These approved changes could not be placed reliably in the text above: add them where they fit.',
        fileSuffix: 'complete-updated'
      },
      atEnd: 'At the end of the Word document, among the changes to place',
      appendix: {
        choice: 'Add a pedagogical appendix (optional notes)',
        title: 'Pedagogical appendix (optional)',
        note: 'Optional notes linked to the approved changes, to help with teaching them. They are not learning objectives or assessment requirements, and they are not part of the syllabus.'
      },
      export: {
        documentTitle: 'Updated course',
        note: 'Updated course outline built with WeLearn from the original syllabus and the changes approved by the teacher. Parts of the original syllabus that are not listed here are unchanged.',
        overview: 'Overview',
        objectives: 'Learning objectives',
        competencies: 'Competencies',
        topics: 'Main topics',
        outline: 'Course outline',
        toPlace: 'Changes to place',
        revised: 'Revised',
        added: 'Added',
        replaces: 'Replaces',
        why: 'Why',
        sources: 'Sources',
        placement: 'Suggested placement',
        changesTitle: 'Approved sustainability changes',
        placementUnknown: 'Placement to choose',
        context: 'context only',
        fileSuffix: 'updated'
      }
    },
    draft: {
      save: 'Save draft',
      savedAt: 'Draft saved on this device at {time}',
      what: 'What is kept?',
      explain:
        'Your course as checked, the text read from your syllabus (needed for the complete Word document), the sustainability connections and the changes you approved, with your wording, places and notes. It stays in this browser on this device and is not sent to WeLearn or anyone else; the uploaded file itself is not kept. Anyone using this browser profile could open it. It replaces any draft kept before. You can remove it at any time.',
      keptNote: 'Your work is kept as a draft in this browser on this device.',
      foundTitle: 'Draft kept on this device:',
      found: '{course} ({file}), saved {time}.',
      untitled: 'Untitled course',
      resume: 'Resume',
      startNew: 'Start a new syllabus',
      remove: 'Remove the draft',
      unusable:
        'A draft kept on this device cannot be restored: it is incomplete, does not match its syllabus, or was saved by an earlier version of WeLearn. Nothing was restored.',
      problem: {
        unavailable:
          'This browser does not let WeLearn keep a draft (private browsing or blocked storage). Download your work before leaving.',
        full: "This browser's storage is full: the draft could not be updated. Download your work before leaving.",
        invalid: 'The draft could not be restored.'
      }
    },
    greencomp: {
      valuing_sustainability: 'Valuing sustainability',
      supporting_fairness: 'Supporting fairness',
      promoting_nature: 'Promoting nature',
      systems_thinking: 'Systems thinking',
      critical_thinking: 'Critical thinking',
      problem_framing: 'Problem framing',
      futures_literacy: 'Futures literacy',
      adaptability: 'Adaptability',
      exploratory_thinking: 'Exploratory thinking',
      political_agency: 'Political agency',
      collective_action: 'Collective action',
      individual_initiative: 'Individual initiative'
    },
    additions: {
      title: 'Explore sustainability connections',
      intro:
        'WeLearn has identified possible connections to your course. Review the ideas and supporting resources, then choose which ones you want to develop.',
      courseChanged:
        'Your course changed in step 2. Your connections and approved changes are kept; a change whose place is no longer in your course is marked.',
      findAgain: 'Look for new connections (approved changes are kept)',
      backToCheck: 'Back to course review',
      thinking: 'Looking for meaningful connections in your course',
      searching: 'Searching WeLearn for supporting resources',
      found: '{count} candidate resources found',
      selecting: 'Selecting the most relevant resources for each connection',
      unavailable: 'WeLearn could not be reached. Please try again in a moment.',
      error:
        'WeLearn could not suggest connections this time: its answer could not be used. This is a technical problem, not a judgement on your course.',
      retry: 'Try again',
      noConnections:
        'WeLearn found no sustainability connection strong enough to suggest for this course.',
      noSupport:
        'WeLearn found no resource that supports its ideas well enough. You can still look at them below.',
      connectsTo: 'Connects to',
      placement: 'Suggested placement',
      objectiveRef: 'Learning objective {n}',
      competencyRef: 'Competency {n}',
      why: 'Why this could be useful',
      sources: 'Sources',
      resources: 'Supporting resources',
      sourceCount: '1 supporting source | {n} supporting sources',
      passage: 'Passage it was chosen for',
      unsupported: 'No supporting source found in WeLearn for this idea.',
      background: 'Related reading ({count})',
      backgroundHint:
        'Background on the wider sustainability issue. These do not treat this part of your course directly and are not evidence for this connection.',
      contextTag: 'Related reading, not direct evidence',
      unchecked:
        'WeLearn could not check resources for this idea (a technical problem, not a judgement on the idea).',
      noneReason: 'WeLearn’s reason: {reason}',
      rechecking: 'Checking resources for this idea again…',
      leftOut:
        'WeLearn left out one idea it judged too loose for this discipline (an analogy, or a word used in another sense). | WeLearn left out {n} ideas it judged too loose for this discipline (analogies, or words used in another sense).',
      unsupportedTitle: 'Ideas without strong support from WeLearn resources ({count})',
      develop: 'Develop this connection',
      undo: 'Undo',
      setAside: 'Not for my course',
      setAsideTitle: 'Set aside ({count})',
      bringBack: 'Bring back',
      acceptedCount:
        'No change accepted yet | 1 change accepted for your updated syllabus | {n} changes accepted for your updated syllabus',
      toUpdated: 'Continue to your updated syllabus',
      change: {
        thinking: 'WeLearn is preparing a concrete change for your course…',
        unavailable: 'WeLearn could not be reached. Your choices are kept: try again.',
        error: 'WeLearn could not propose a change this time. Your choices are kept: try again.',
        title: 'Suggested syllabus change',
        kinds: {
          objective: 'Revised learning objective',
          topic: 'Addition to a topic',
          teaching: 'Teaching adjustment',
          assessment: 'Assessment change'
        },
        original: 'Original',
        topicRef: 'Topic',
        sessionRef: 'Course outline',
        type: 'Type of change',
        whereLabel: 'Where does this fit in your course? Choose…',
        placement: 'Where it fits',
        revisesObjective: 'Revises learning objective {n}',
        revisesCompetency: 'Revises competency {n}',
        revises: 'Revises',
        afterLine: 'After “{line}”',
        replacesLine: 'Replaces “{line}”',
        noPlace:
          'No single matching passage in your syllabus: it will be listed at the end of the Word document. You can choose a place.',
        notPlaced: 'Not placed yet',
        changePlace: 'Change place',
        stalePlace:
          'Its place, “{place}”, is no longer in your course as confirmed in step 2. Choose where it goes.',
        staleObjective:
          'The objective it revises is no longer in your course as confirmed in step 2. Check it, or keep the original.',
        consequence:
          'Accepting saves this change for your updated syllabus. Your original syllabus stays unchanged.',
        addition: 'New addition: nothing in your course is replaced.',
        suggested: 'Suggested wording',
        why: 'Why this could be useful',
        basedOn: 'Sources and evidence',
        checkTitle: 'What the check of this change found',
        evidence: {
          strong: 'Supported by the sources.',
          strongDetail:
            'The cited sources directly back this wording. WeLearn checked the sources, not the science: review it as you would any suggestion.',
          partial: 'Evidence is limited.',
          partialDefault: 'The sources give context but do not directly support this wording.',
          none: 'Not supported by WeLearn sources.',
          noneDefault: 'No source backs this wording: check it before using it.',
          unchecked: 'Evidence could not be checked.',
          uncheckedDetail:
            'A technical problem stopped the check: review this wording before using it.'
        },
        unchecked:
          'Its claims could not be checked against the resources (a technical problem): check it before using it.',
        unbackedNames: 'Named here but not found in a directly supporting resource: {names}.',
        supportTag: {
          partial: 'Partly supported',
          none: 'Not supported by WeLearn resources'
        },
        support: {
          partial:
            'These resources give context but do not directly support this change: check it before using it.',
          none: 'Not supported by WeLearn resources: check it before using it.'
        },
        notes: {
          title: 'Pedagogical notes (optional)',
          hint: 'To help you weigh this change. They are not part of it and are not added to your syllabus.',
          learning: 'Intended student learning',
          greencomp: 'GreenComp',
          teaching: 'Teaching idea',
          check: 'Checking learning'
        },
        accept: 'Accept',
        keepOriginal: 'Keep original',
        skip: 'Skip',
        skipped: 'Skipped: nothing is added to your syllabus.',
        saveAndAccept: 'Save and accept',
        accepted: 'Accepted for your updated syllabus',
        kept: 'Original kept: your course stays as it is.'
      }
    },
    check: {
      title: 'Check your course',
      description:
        'Review what WeLearn understood from your syllabus. You can correct anything before exploring sustainability adaptations.',
      showSubtopics: 'Show subtopics',
      editField: 'Edit: {field}',
      editObjective: 'Edit this item',
      outlineName: 'course outline',
      hideSubtopics: 'Hide subtopics',
      checkedNote:
        'Read by WeLearn AI and compared with your syllabus. Anything it could not find word for word is marked for you to check.',
      uncheckedNote:
        'Read by WeLearn AI. WeLearn could not read the text of this file (a scanned PDF, for example), so it could not compare what it read with your syllabus: please check it.',
      readingPartial:
        'Some course information may be missing. Please check the extracted topics and objectives against your syllabus.',
      notSyllabus:
        'WeLearn is not sure this file is a syllabus (it looks like: {type}). Check what it read, or go back and add your syllabus.',
      overviewTitle: 'Your course',
      topicsLabel: 'Main topics',
      noTopics: 'WeLearn found no list of course contents in your syllabus. Add the main topics.',
      noTopicsNoText:
        'WeLearn could not read the text of this file, so it could not find its topics. Add them here.',
      addTopic: 'Add a topic',
      removeTopic: 'Remove {topic}',
      descriptionLabel: 'Course description',
      noClearDescription:
        "WeLearn couldn't isolate a clear course description. Add one, or edit what it read.",
      seeWhatWasRead: 'See what WeLearn read instead',
      removedDescription: 'You removed the description WeLearn read.',
      bringBack: 'Bring it back',
      notFound: 'Not found in your syllabus.',
      add: 'Add',
      objectivesTitle: 'Learning objectives',
      sortedNote: 'Sorted by the heading they sit under in your syllabus.',
      unsortedNote:
        'WeLearn returns objectives and competencies as one list: move each competency or degree-level objective to its group.',
      types: {
        syllabus: 'a syllabus',
        course_plan: 'a course plan',
        lesson: 'a single lesson',
        partial: 'a partial course description',
        other: 'another kind of document',
        article: 'an article',
        unknown: 'unclear',
        none: 'empty'
      },
      groups: {
        objective: 'Course objectives',
        competency: 'Competencies',
        programme: 'Degree-level objectives'
      },
      emptyGroup: 'None yet.',
      moveTo: 'Move to',
      addObjective: 'Add a course objective',
      addCompetency: 'Add a competency',
      origin: {
        extracted: 'From your syllabus',
        unverified: 'Not found word for word in your syllabus: please check',
        unchecked: 'Read by WeLearn AI',
        edited: 'Corrected by you',
        added: 'Added by you'
      },
      edit: 'Edit',
      save: 'Save',
      cancel: 'Cancel',
      remove: 'Remove',
      restore: 'Restore original',
      showMore: 'Show full text',
      showLess: 'Show less',
      planTitle: 'Course plan in your syllabus ({n} lines)',
      notRead:
        "WeLearn doesn't use your assessment or detailed schedule yet. They stay in your syllabus, unchanged.",
      localNote: 'Your corrections stay in this browser tab.',
      openOriginal: 'Open the original',
      fromDocument: 'From your syllabus',
      notFoundOverview: 'Not identified by WeLearn:',
      tag: {
        suggested: 'Suggested by WeLearn',
        generated: 'Written by WeLearn',
        identified: 'Identified by WeLearn',
        check: 'To check'
      },
      noTopicsFound:
        'WeLearn did not identify main topics. Adding them helps WeLearn suggest connections that fit your course.',
      addTopics: 'Add main topics',
      outlineTitle: 'Course outline ({n})',
      outlineHint: 'One session, week or chapter per line.',
      showAll: 'Show all {n} objectives',
      showFewer: 'Show fewer',
      editObjectives: 'Edit the objectives',
      done: 'Done',
      sessions: 'Sessions',
      more: 'More details (optional)',
      moreHint: 'How the course is taught. Add only what matters for your course.',
      overviewLabel: 'Overview',
      aiSummary: 'Summary generated by WeLearn from your syllabus. Please review.',
      topicTitle: 'Topic',
      subtopics: 'Subtopics, separated by commas',
      saveChanges: 'Save changes',
      topicsByAi: 'Identified by WeLearn AI from your course content.',
      pleaseCheck: 'not found in your syllabus: please check',
      noObjectives:
        'No explicit learning objectives were found in your syllabus. You can continue using your course description and topics, or add objectives if you wish.',
      programmeAside: 'Degree-level objectives kept aside ({n})',
      programmeAsideHint:
        'They concern the whole degree, not this course: WeLearn does not use them for your course.',
      moveToCourse: 'Move to course objectives',
      unsortedTitle: 'To check: objectives WeLearn could not place ({n})',
      unsortedHint:
        'Your syllabus does not say clearly whether these belong to this course or to the wider programme or institution. WeLearn does not use them until you sort them.',
      sortToCourse: 'Course objective',
      sortAside: 'Not for this course',
      needObjective: 'Add a course overview, a topic or an objective to continue.',
      action: 'Confirm my course',
      recap: 'No course objective | 1 course objective | {n} course objectives',
      recapTopics: 'No main topic | 1 main topic | {n} main topics'
    },
    steps: {
      course: 'Upload syllabus',
      check: 'Review course',
      additions: 'Sustainability additions',
      updated: 'Updated syllabus',
      idea: 'Your course idea',
      proposal: "WeLearn's proposal",
      documents: 'Documents',
      summary: 'Summary',
      resources: 'Resources',
      syllabus: 'Your syllabus'
    },
    documentsStep: {
      title: 'Add your syllabus or course materials',
      description:
        'Upload 1 to 3 documents: your current syllabus, if you have one, and the materials your course is based on (articles, book chapters…). WeLearn builds a new syllabus from them.',
      dropzone: 'Drop files here or',
      browse: 'browse',
      limits: 'PDF, DOCX or TXT · 5 MB max · up to 3 files',
      hint: 'This feature is in beta.',
      exampleLink: 'See an example document',
      removeFile: 'Remove {name}',
      noFile: 'Add at least one document to continue.',
      languageLabel: 'Syllabus language',
      detailsTitle: 'Tell us about your course',
      recommended: 'Strongly recommended',
      detailsWhy:
        'The more you tell us, the better the syllabus fits your course. Without these details it will stay generic.',
      titleLabel: 'Course title',
      titlePlaceholder: 'e.g. Introduction to sociolinguistics',
      levelLabel: 'Level of study',
      levelPlaceholder: 'e.g. First-year undergraduate',
      durationLabel: 'Duration',
      durationPlaceholder: 'e.g. 6 weeks, 2 hours per week',
      descriptionLabel: 'Course description and goals',
      descriptionPlaceholder:
        'e.g. Students discover the key concepts of sociolinguistics and learn to analyse language use in their own community.',
      nudge: 'Without course details, your syllabus will be generic.',
      addDetails: 'Add details',
      continueAnyway: 'Continue anyway',
      aiNotice: 'Your files are sent to WeLearn for AI analysis.',
      action: 'Analyse my documents',
      recap: '{files} · {lang}'
    },
    summaryStep: {
      title: 'Your document summary',
      description:
        "Here's what WeLearn understood from each document. You can adjust it if needed: it guides the search for related resources.",
      noFileName: 'Document {n}',
      aiLabel: 'Analysed by WeLearn AI',
      action: 'Find related resources',
      recap: 'No document summarized | 1 document summarized | {n} documents summarized'
    },
    resourcesStep: {
      title: 'Choose resources to include',
      description:
        'These WeLearn resources match your documents and help connect your course to the Sustainable Development Goals. Click a resource to select it.',
      selected: 'No resource selected | 1 resource selected | {n} resources selected',
      allHint: 'Nothing selected: WeLearn will use all the resources above.',
      passageLabel: 'Passage that matches your documents',
      action: 'Generate syllabus',
      noSources: 'No related resources found',
      noSourcesDescription:
        'You can still generate a syllabus from your documents only, but it will make fewer links to sustainability. To get resources, go back and try other documents.',
      searchError:
        'The search for resources failed. You can still generate a syllabus from your documents.',
      recapAll: 'All resources'
    },
    syllabusStep: {
      title: 'Your syllabus is ready',
      description:
        'Click the text to edit it, ask WeLearn for changes, then download it as a Word file.',
      aiLabel: 'Written by WeLearn AI. Review it and keep what fits your course.',
      feedbackLabel: 'Ask for changes',
      feedbackPlaceholder:
        'e.g. Add a week on assessment methods, shorten the reading list, make it more hands-on…',
      regenerate: 'Regenerate with my changes',
      feedbackError: "Your changes couldn't be applied. Please try again.",
      feedbackHistory: 'Changes you already requested ({n})',
      openLink: 'Open',
      download: 'Download (.docx)',
      restart: 'Start a new syllabus'
    },
    loading: {
      read: {
        title: 'Reading your syllabus',
        description: 'WeLearn is finding the description and learning objectives in your syllabus.'
      },
      extract: {
        title: 'Reading your documents',
        description: 'WeLearn is identifying the main ideas of each document.'
      },
      search: {
        title: 'Searching for related resources',
        description:
          'WeLearn is looking through its library for resources that match your documents.'
      },
      syllabus: {
        title: 'Writing your syllabus',
        description:
          "WeLearn is combining your documents, course details and resources. This can take up to a minute: please don't close or reload this page."
      },
      feedback: {
        title: 'Applying your changes',
        description: 'WeLearn is updating the syllabus based on your request.'
      }
    },
    error: {
      title: 'Something went wrong',
      read: "We couldn't read your syllabus.",
      extract: "We couldn't read your documents.",
      search: "We couldn't search for related resources.",
      syllabus: "We couldn't write the syllabus.",
      kept: 'Your inputs are kept.',
      retry: 'Try again',
      cancel: 'Cancel'
    },
    // used by the hidden /tutor_test version
    summaries: {
      noFileName: 'No file name provided',
      title: 'Uploaded documents summaries',
      description:
        'WeLearn has extracted the following summaries from your uploaded documents. You can review them before proceeding to the next step.'
    },
    secondStep: {
      title: 'Select additional resources',
      description:
        'The resources below relate to the Sustainable Development Goals (SDGs), and will be used to integrate sustainability into your course. If no additional resources are selected, the syllabus will be generated based on your reference documents only.',
      noSources: 'No resources related to your documents were found.',
      noSourcesDescription:
        'You can proceed with your uploaded documents only, but sustainability integration in the generated syllabus may be limited.\nTo explore more resources, return to the previous step to modify your uploaded documents.'
    }
  },
  microlearning: {
    mainTitle: 'Choose a subject:',
    chooseSdg: 'Choose an SDG:'
  },
  autoEvaluation: {
    notAtAll: 'Not really',
    tottally: 'Completely',
    start: {
      badge: 'Before you begin',
      title: 'Two quick questions',
      subtitle:
        'This takes 30 seconds and helps us measure the educational impact of this learning journey.',
      lockedNotice:
        "You've started the journey, so these answers are now locked. They record where you started, which is how we measure what changed."
    },
    end: {
      badge: 'Before you go',
      title: 'One last thing',
      subtitle:
        'The same questions as at the start, plus two more, so we can see what has changed. It only takes 30 seconds.'
    },
    firstQuestion:
      'I clearly see the connection between my discipline ({discipline}) and sustainability.',
    secondQuestion: 'I feel confident bringing this topic into my teaching.',
    willUse: 'Do you plan to use what you have learned in an upcoming class?',
    feedback: "Is there anything else you'd like to tell us?"
  },
  previous: 'Previous',
  previous_page: 'Previous page',
  next_page: 'Next page',
  validate: 'Validate',
  validated: 'Validated',
  edit: 'Edit',
  save: 'Save',
  finish: 'Finish',
  skip: 'Skip this step',
  yes: 'Yes',
  maybe: 'Maybe',
  notForNow: 'Not for now',
  typeHere: 'Type your answer here',
  courseInformation: 'Course information',
  inputMode: 'Input mode',
  inputFile: 'Input file',
  courseMetadataOnly: 'Course metadata only',
  courseMetadataAndDocument: 'Course metadata and document',
  existingSyllabus: 'Existing syllabus',
  discipline: 'Discipline',
  disciplinePlaceholder: 'Example: Sociology',
  disciplineExample: 'Example: Sociology',
  topic: 'Topic',
  topicPlaceholder: 'Example: Sociolinguistics and social justice',
  topicExample: 'Example: Sociolinguistics and social justice',
  level: 'Level of study',
  levelPlaceholder: 'Example: Undergraduate',
  levelExample: 'Example: Undergraduate',
  num_sessions: 'Number of sessions',
  numSessionsPlaceholder: 'Number of sessions in the course',
  numSessionsExample: 'Example: 6',
  session_duration: 'Session duration (in hours)',
  sessionDurationPlaceholder: 'Duration of a session in hours',
  sessionDurationExample: 'Example: 1.5',
  syllabus_mode: 'Syllabus input mode',
  session_type: 'Session type',
  sessionTypePlaceholder: 'Lecture, Tutorial, Lab, etc.',
  sessionTypeExample: 'Example: Lecture',
  class_size: 'Class size',
  classSizePlaceholder: 'Number of students',
  classSizeExample: 'Example: 30',
  session_mode: 'Session mode',
  inPerson: 'In-person',
  remote: 'Remote',
  hybrid: 'Hybrid',
  PRESENTIEL: 'In-person',
  REMOTE: 'Remote',
  HYBRID: 'Hybrid',
  output_language: 'Output language',
  french: 'French',
  english: 'English',
  user_description: 'Course description',
  courseDescriptionPlaceholder: 'Add a brief description to improve the generated syllabus.',
  descriptionExample:
    'Example: This course provides an introduction to key questions in sociolinguistics, exploring the relationship between language and society, language policies, language contact, and research methods. It introduces the main theories, basic terminology, and methodologies of fieldwork and sociolinguistic analysis.',
  courseDescription: 'Description',
  learningObjectives: 'Learning objectives',
  learningObjectivesSubtitle:
    'Learning objectives are specific statements that describe what students should be able to demonstrate or accomplish by the end of a course or lesson. They are measurable and observable, allowing instructors to assess whether the learning goals have been achieved.',
  sustainabilityIntegration: 'Sustainability integration',
  sustainabilityIntegrationSubtitle:
    'Integrating sustainability into a course involves incorporating concepts, practices, and perspectives related to sustainable development into the course content, activities, and assessments. This may include exploring environmental, social, and economic issues, as well as promoting critical thinking and responsibility towards future generations.',
  learningOutcomes: 'Learning outcomes',
  learningOutcomesSubtitle:
    'Learning outcomes are specific statements that describe what students should be able to demonstrate or accomplish by the end of a course or lesson. They are measurable and observable, allowing instructors to assess whether the learning goals have been achieved.',
  competencies: 'Competencies',
  greenCompCompetenciesSubtitle:
    'Competencies are a set of knowledge, skills, and attitudes that an individual develops and uses to perform tasks, solve problems, and adapt to different situations. They can be technical, cognitive, social, or emotional, and are essential for success in professional and personal life.',
  greenCompCompetencies: 'GreenComp Competencies',
  provideFeedback: 'Provide a feedback',
  resourcesUsed: 'Resources used',
  seeConnectionExplanation: 'Connection explanation'
};
