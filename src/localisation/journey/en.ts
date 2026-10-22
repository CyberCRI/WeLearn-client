// texts for the entry page (/start) and the teacher space (/teach);
// English is the source language, fr.ts is an adaptation
export const journey = {
  entry: {
    title: 'Welcome to WeLearn',
    intro: 'How will you use WeLearn today?',
    teaching: {
      title: "I'm teaching",
      description: 'Bring sustainability into the courses you teach.',
      action: 'Open the teacher space'
    },
    learning: {
      title: "I'm learning",
      description: 'Build your understanding of sustainability and apply it to your studies.',
      action: 'Open the student space'
    }
  },
  teach: {
    title: 'Where would you like to start?',
    intro:
      'Explore sustainability, discover relevant resources, and use WeLearn AI to support your teaching.',
    teds: {
      title: 'Supporting TEDS courses',
      intro:
        'TEDS courses introduce students to the ecological transition for sustainable development. WeLearn will help you prepare one, theme by theme.',
      question: 'How can WeLearn help me prepare a TEDS course?',
      objective:
        'Prepare a TEDS course with resources, real cases and activities on its main themes, adapted to your students.',
      themesTitle: 'The main themes',
      themeList: {
        climate: 'Climate',
        biodiversity: 'Biodiversity',
        resources: 'Resources',
        justTransition: 'Just transition'
      },
      howTitle: 'How WeLearn will support you',
      how: {
        understand:
          'Understand what is expected of a TEDS course and how it meets your discipline.',
        explore: 'Find research, reports and real cases for each theme.',
        design: 'Get an AI draft of your syllabus and activities, which you review and adapt.',
        teach: 'Share activities with your students and improve them after class.'
      }
    },
    ai: {
      draft: 'AI draft',
      adapted: 'AI-adapted from documents'
    },
    getStarted: 'Get started',
    open: 'Open',
    seePreview: 'See the preview',
    allSpaces: 'All teacher spaces',
    preview: 'Preview',
    previewNotice: 'Preview: this feature is being designed',
    question: 'Your question',
    objective: 'Objective',
    designNote: 'Design note',
    exampleLabel: 'Example · written for this prototype, not from WeLearn’s sources',
    ask: {
      title: 'Ask WeLearn',
      intro: 'At every stage, the WeLearn assistant answers your questions. Try one:',
      sourcesNote: 'Answers come from WeLearn’s library of sustainability resources, with sources.'
    },
    courseStart: {
      question: 'Do you already have a course?',
      yes: 'Yes, I have a course',
      no: "No, I'm starting from scratch",
      working: 'Working from an existing course',
      change: 'Change',
      changeWarning:
        'Changing will discard your syllabus and what you have reviewed so far in this tab.',
      discard: 'Discard and change',
      keepWorking: 'Keep working',
      newCourse:
        'Planning a new course from scratch is still being designed. It is not available yet.'
    },
    adapt: {
      title: 'Adapt my existing course',
      intro:
        'Start from your syllabus. WeLearn reads it, then you check and correct what it understood before anything else happens.',
      aiRead: 'Read by AI',
      upload: {
        title: 'Your syllabus',
        dropzone: 'Drop your syllabus or course outline here, or',
        browse: 'browse',
        limits: 'One file · PDF, DOCX or TXT · 5 MB max',
        remove: 'Remove {name}',
        languageLabel: 'Course language',
        notice: 'Your syllabus will be sent to WeLearn for AI analysis.',
        read: 'Read my syllabus',
        retry: 'Try again',
        or: 'or',
        example: 'Try with an example syllabus',
        exampleHint: 'A demonstration with a fictional course. Nothing is sent or analysed by AI.',
        pasteToggle: 'Or paste your own syllabus text',
        pasteLabel: 'Your syllabus or course description',
        pasteUse: 'Use my text',
        pasteHint:
          'Your text stays in this browser tab. It is not sent or analysed by AI: you fill in your course from it.',
        errors: {
          BIG_FILE: 'This file is larger than 5 MB.',
          BAD_EXTENSION: 'Use a PDF, DOCX or TXT file.'
        }
      },
      reading: {
        sending: 'Uploading your syllabus',
        sent: 'Syllabus uploaded',
        reading: 'Reading your course information',
        review: 'Ready for your review',
        elapsed: '{seconds} s',
        cancel: 'Cancel'
      },
      unavailable: {
        title: 'WeLearn could not be reached',
        text: 'Your syllabus was not analysed. Please try again in a moment.'
      },
      error: {
        title: 'WeLearn could not read this syllabus',
        text: 'Please try again, or choose another file.'
      },
      review: {
        exampleBanner: 'Demonstration: a fictional example syllabus. Nothing was analysed by AI.',
        pastedBanner:
          'Your pasted text stays in this browser tab. It was not sent or analysed by AI: fill in your course from it.',
        pastedName: 'Pasted text',
        notFilled: 'Not filled in yet.',
        noObjectivesYet: 'No learning objectives added yet.',
        original: 'Original document',
        originalNote: 'Kept unchanged on your device.',
        openOriginal: 'Open the original',
        title: 'Let’s check your course',
        intro:
          'WeLearn has identified information from your syllabus. Review it before exploring sustainability connections.',
        showDocument: 'Show the text',
        detected: {
          syllabus: 'Recognised as a syllabus',
          article: 'This looks like an article, not a syllabus',
          unknown: 'WeLearn is not sure this is a syllabus',
          none: 'No text could be read from this file'
        },
        notSyllabusHint: 'For the best results, upload your syllabus or course outline.',
        overview: 'Course overview',
        overviewKeys: {
          title: 'Course title',
          disciplineLevel: 'Discipline and level',
          topics: 'Main topics'
        },
        description: 'Description from your syllabus',
        showMore: 'Show full text',
        showLess: 'Show less',
        objectives: 'Learning objectives',
        programmeHint:
          'Some syllabi also list degree or programme objectives. Mark them so they stay apart from this course’s own.',
        markProgramme: 'Programme-level',
        programmeTitle: 'Programme-level objectives (marked by you)',
        unmarkProgramme: 'Move back to course objectives',
        origin: {
          extracted: 'From your syllabus',
          extractedExample: 'From the example',
          edited: 'Corrected by you',
          added: 'Added by you'
        },
        notFound: 'Not found in your syllabus.',
        noObjectives: 'No learning objectives were found in your syllabus.',
        add: 'Add',
        edit: 'Edit',
        save: 'Save',
        cancel: 'Cancel',
        remove: 'Remove',
        showOriginal: 'Show original',
        hideOriginal: 'Hide original',
        restore: 'Restore original',
        addObjective: 'Add a learning objective',
        more: 'More details (optional)',
        moreHint: 'WeLearn does not read these yet. Add only what matters for your course.',
        extras: {
          workload: 'Workload (hours, ECTS)',
          sessions: 'Sessions or topics',
          assessment: 'Assessment'
        },
        localNote: 'Your changes stay in this browser tab. They are not saved or sent.',
        confirm: 'Confirm course',
        confirmed:
          'Course confirmed in this tab. Next step, sustainability connections, is coming soon.',
        startOver: 'Start over'
      },
      example: {
        fileName: 'example-syllabus-microeconomics.txt',
        document:
          'EXAMPLE SYLLABUS (fictional, written for this prototype)\n\nIntroduction to Microeconomics\nFirst year, Bachelor · 5 ECTS · 12 sessions of 3 hours\n\nCourse description\nThis course introduces the basic tools of microeconomic analysis. Students study how households and firms make decisions and how markets allocate resources.\n\nLearning outcomes\nBy the end of the course, students will be able to:\n1. Explain the law of supply and demand.\n2. Calculate and interpret price elasticity.\n3. Analyse market equilibrium and the effects of taxes.\n\nSession plan\nSessions 1–2: Supply and demand\nSessions 3–4: Elasticity\nSessions 5–8: Market equilibrium and taxes\nSessions 9–12: Market failures\n\nAssessment\nMidterm exam 40%, group project 20%, final exam 40%.',
        description:
          'This course introduces the basic tools of microeconomic analysis. Students study how households and firms make decisions and how markets allocate resources.',
        objectives: {
          o1: 'Explain the law of supply and demand.',
          o2: 'Calculate and interpret price elasticity.',
          o3: 'Analyse market equilibrium and the effects of taxes.'
        }
      }
    },
    spaces: {
      understand: {
        name: 'Understand',
        title: 'Why sustainability matters for your teaching',
        pageTitle: 'Why sustainability matters for your teaching',
        intro:
          'Understand sustainability education and discover how it connects to what you teach.',
        description: 'Learn the essentials of sustainability and how they connect to your subject.',
        modules: {
          foundations: {
            title: 'Sustainability foundations',
            summary: 'Understand key sustainability concepts, ESD and TEDS in higher education.',
            question: 'What do we actually mean by sustainability and ecological transition?',
            objective:
              'Build a shared basic understanding of sustainability, the ecological transition and education for sustainable development.'
          },
          frameworks: {
            title: 'Sustainability frameworks',
            summary: 'Discover the SDGs and GreenComp, and how they can inform your teaching.',
            question: 'What are the SDGs and GreenComp, and why do they matter for teaching?',
            objective:
              'Get to know the main frameworks without reading long and often abstract official documents.'
          },
          teds: {
            title: 'Sustainability in higher education (TEDS)',
            summary:
              'Why sustainability is part of higher education, especially the French TEDS expectations.',
            question: 'Why am I being asked to integrate this into my teaching?',
            objective:
              'Understand the higher education context, especially the French TEDS expectations.'
          },
          discipline: {
            title: 'Sustainability in your discipline',
            summary:
              'Explore meaningful connections between sustainability and the subjects you teach.',
            question: 'What does any of this have to do with my discipline?',
            objective: 'See how your discipline already connects to sustainability.'
          }
        }
      },
      explore: {
        name: 'Explore',
        ask: {
          q1: 'Find case studies on water management I could use in class.',
          q2: 'What does recent research say about plastic pollution in rivers?'
        },
        title: 'Find resources for what you teach',
        pageTitle: 'Find resources for what you teach',
        intro:
          'Explore research, reliable knowledge and teaching materials relevant to your subject.',
        description: 'Discover research and teaching materials relevant to your course.',
        question:
          'What sustainability knowledge, examples and teaching resources can support what I already teach?',
        objective:
          'Discover credible academic, institutional and teaching resources connected to your course, and how they can serve your teaching.',
        lenses: {
          learn: {
            title: 'Learn about a topic',
            description: 'Find research, reports and reliable explanations.'
          },
          teach: {
            title: 'Find teaching materials',
            description: 'Discover cases, activities and educational resources.'
          }
        },
        results: {
          title: 'Two kinds of teaching materials',
          note: 'Invented examples showing what results will look like. They are not live search results.',
          teachingResources: {
            title: 'Teaching resources',
            description: 'Ready-made materials from educational sources.',
            exampleTitle: 'Climate risk role-play: a ready-made lesson plan',
            exampleMeta: 'Lesson plan · educational source',
            exampleDescription:
              'A 90-minute role-play in which students negotiate how a region adapts to more frequent floods.'
          },
          researchCases: {
            title: 'Cases from research',
            description:
              'Teaching material extracted by AI from scientific and institutional documents.',
            exampleTitle: 'Who pays for flood risk? A coastal city case',
            exampleMeta: 'Case study',
            exampleDescription:
              'Students act as a city council weighing flood defences, insurance and planned relocation for a coastal district.',
            sourceNote:
              'Invented example. A real version would be AI-adapted from a document such as the',
            source: 'IPCC Sixth Assessment Report, Working Group II (2022)'
          }
        },
        search: 'Search resources'
      },
      design: {
        name: 'Design',
        title: 'Bring sustainability into your teaching',
        pageTitle: 'Bring sustainability into your teaching',
        intro:
          'Adapt a course or develop a learning activity that connects sustainability to what you teach.',
        description: 'Adapt a course or develop a learning activity.',
        modules: {
          course: {
            title: 'Design your course',
            summary: 'Create a new course or adapt an existing one to integrate sustainability.',
            question:
              'How can I create or adapt my course to meaningfully integrate sustainability?',
            objective:
              'Structure sustainability in a new or existing course: content, learning objectives, competences, teaching approaches and assessment.'
          },
          activity: {
            title: 'Design an activity',
            summary: 'Develop a learning activity that connects sustainability to what you teach.',
            question:
              'How can I turn a sustainability connection into a meaningful activity for my students?',
            objective:
              'Create a learning activity that links your subject to sustainability learning objectives, with suitable teaching methods.',
            intro:
              'Turn a sustainability connection into a meaningful activity for your students, in three parts.',
            parts: {
              context: {
                title: 'Teaching context and sustainability connection',
                text: 'Start from what you teach: your discipline, your students’ level and the sustainability question your course connects to.'
              },
              intention: {
                title: 'Learning intention',
                text: 'Say what your students should be able to do by the end of the activity.'
              },
              develop: {
                title: 'Developing and reviewing an activity',
                text: 'Choose a type of activity and resources from WeLearn, then review and adapt a draft before using it with your students.'
              }
            },
            steps: {
              context: 'Teaching context',
              connection: 'Sustainability connection',
              intention: 'Learning intention',
              type: 'Activity type'
            },
            example: {
              title: 'Example: climate risk in an economics course',
              context: 'Economics, second-year bachelor students',
              connection: 'Climate risk, and who bears its cost',
              draftLabel: 'Activity draft',
              startsFrom: 'Starts from the “Cases from research” example in EXPLORE.',
              intention:
                'Students can explain how climate risk is priced, and who bears the cost when it is not.',
              type: 'Role-play in small groups, 90 minutes',
              resourcesLabel: 'Two WeLearn resources',
              resource1: 'Case from research: “Who pays for flood risk? A coastal city case”',
              resource2: 'Teaching resource: “Climate risk role-play” lesson plan',
              assessmentLabel: 'Assessment idea',
              assessment:
                'Each group writes a one-page recommendation to the council, assessed on its economic reasoning and on how it treats the people who bear the risk.'
            },
            note: 'Later, this could start from a course prepared in “Design your course”, with your teaching context already filled in.'
          }
        }
      },
      teach: {
        name: 'Teach',
        ask: {
          q1: 'My students found this activity too abstract. How can I improve it?',
          q2: 'How can I run a debate on the energy transition with 60 students?'
        },
        title: 'Use it with your students',
        pageTitle: 'Use it with your students',
        intro: 'Use an activity in class, reflect on how it went and share what works.',
        description: 'Put activities into practice and reflect on what works.',
        question: 'How can I use this with my students and keep improving it?',
        objective:
          'Leave with something concrete for your class, learn from how it went and share what works with other teachers.',
        steps: {
          use: {
            title: 'Use',
            description:
              'A classroom-ready activity. Share it with your class through a simple link.'
          },
          reflect: {
            title: 'Reflect',
            description: 'What worked, and what to improve next time.'
          },
          share: {
            title: 'Share',
            description: 'Best practices and a community of teachers.'
          }
        }
      }
    }
  }
};
