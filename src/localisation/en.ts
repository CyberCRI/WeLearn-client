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
  reload: 'Reload',
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
    steps: {
      documents: 'Documents',
      summary: 'Summary',
      resources: 'Resources',
      syllabus: 'Syllabus'
    },
    documentsStep: {
      title: 'Add your course materials',
      description:
        'Upload 1 to 3 documents your course is based on (articles, book chapters…). WeLearn builds the syllabus from them.',
      dropzone: 'Drop files here or',
      browse: 'browse',
      limits: 'PDF, DOCX or TXT · 5 MB max · up to 3 files',
      hint: 'This feature is in beta: scientific articles and book chapters give the best results.',
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
      action: 'Analyse my documents',
      recap: '{files} · {lang}'
    },
    summaryStep: {
      title: 'Your document summary',
      description:
        "Here's what WeLearn understood from each document. You can adjust it if needed: it guides the search for related resources.",
      noFileName: 'Document {n}',
      action: 'Find related resources',
      recap: 'No document summarized | 1 document summarized | {n} documents summarized'
    },
    resourcesStep: {
      title: 'Choose resources to include',
      description:
        'These WeLearn resources match your documents and help connect your course to the Sustainable Development Goals. Click a resource to select it.',
      selected: 'No resource selected | 1 resource selected | {n} resources selected',
      allHint: 'Nothing selected: WeLearn will use all the resources above.',
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
