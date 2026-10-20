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
    identity: 'Teaching sustainability, supported by AI and grounded in research.',
    fastLane: {
      title: 'What are you teaching?',
      subtitle:
        'WeLearn’s AI suggests resources, real cases and activity ideas from a library of research and teaching material, always with sources. You decide what to use.',
      inputLabel: 'What you teach',
      placeholder: 'First-year economics, introduction to markets',
      examples: 'Examples:',
      chips: {
        law: 'Law, contracts',
        biology: 'Biology, ecosystems',
        engineering: 'Engineering, materials'
      },
      button: 'Find ideas',
      empty: 'Enter what you teach first.',
      question:
        'I teach {subject}. Suggest resources, a real case and an activity idea to integrate sustainability.'
    },
    teds: {
      entry: 'Teaching a TEDS course?',
      themes: 'Climate, biodiversity, resources, just transition',
      start: 'Start here',
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
    chooseTitle: 'Or choose what you need',
    journeyNav: 'Teacher space',
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
    spaces: {
      understand: {
        name: 'Understand',
        cardQuestion: 'What does sustainability have to do with my discipline?',
        cardOutcome: 'You leave with a clear picture for your field',
        ask: {
          q1: 'What does sustainability mean for my discipline?',
          q2: 'What do the SDGs and GreenComp expect from university teachers?'
        },
        title: 'Why sustainability matters for your teaching',
        description:
          'Four short modules on what sustainability means and how it meets your discipline.',
        modules: {
          foundations: {
            title: 'Sustainability foundations',
            question: 'What do we actually mean by sustainability and ecological transition?',
            objective:
              'Build a shared basic understanding of sustainability, the ecological transition and education for sustainable development.'
          },
          frameworks: {
            title: 'Key frameworks: SDGs and GreenComp',
            question: 'What are the SDGs and GreenComp, and why do they matter for teaching?',
            objective:
              'Get to know the main frameworks without reading long and often abstract official documents.'
          },
          teds: {
            title: 'Sustainability in higher education (TEDS)',
            question: 'Why am I being asked to integrate this into my teaching?',
            objective:
              'Understand the higher education context, especially the French TEDS expectations.'
          },
          discipline: {
            title: 'Sustainability in your discipline',
            question: 'What does any of this have to do with my discipline?',
            objective: 'See how your discipline already connects to sustainability.'
          }
        }
      },
      explore: {
        name: 'Explore',
        cardQuestion: 'Where can I find good material for my course?',
        cardOutcome: 'You leave with resources and real cases',
        ask: {
          q1: 'Find case studies on water management I could use in class.',
          q2: 'What does recent research say about plastic pollution in rivers?'
        },
        title: 'Find resources for what you teach',
        description:
          'Research and teaching resources connected to your course, seen through two lenses.',
        question:
          'What sustainability knowledge, examples and teaching resources can support what I already teach?',
        objective:
          'Discover credible academic, institutional and teaching resources connected to your course, and how they can serve your teaching.',
        lenses: {
          learn: {
            title: 'Learn about the topic',
            description:
              'Research, reports and science communication, to feel confident about the content.'
          },
          teach: {
            title: 'Teach the topic',
            description:
              'Educational resources, activities and case studies, to turn the content into teaching.'
          }
        },
        results: {
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
        cardQuestion: 'How do I build this into my course?',
        cardOutcome: 'You leave with a syllabus or activity draft',
        ask: {
          q1: 'Help me create an activity on climate risk for my economics course.',
          q2: 'How can I assess systems thinking in a student group project?'
        },
        title: 'Build it into your course',
        description: 'Design your course, or turn a sustainability connection into an activity.',
        modules: {
          course: {
            title: 'Design your course',
            question:
              'How can I create or adapt my course to meaningfully integrate sustainability?',
            objective:
              'Structure sustainability in a new or existing course: content, learning objectives, competences, teaching approaches and assessment.'
          },
          activity: {
            title: 'Design an activity',
            question:
              'How can I turn a sustainability connection into a meaningful activity for my students?',
            objective:
              'Create a learning activity that links your subject to sustainability learning objectives, with suitable teaching methods.',
            steps: {
              context: 'Teaching context',
              connection: 'Sustainability connection',
              intention: 'Learning intention',
              type: 'Activity type',
              resources: 'Resources from WeLearn',
              draft: 'Activity draft'
            },
            example: {
              title: 'Example activity draft: climate risk in an economics course',
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
            note: 'Idea: after creating a syllabus, a "Create an activity for this" button could open this flow with the course already filled in.'
          }
        }
      },
      teach: {
        name: 'Teach',
        cardQuestion: 'How do I use it with my students?',
        cardOutcome: 'You leave with a class link and ideas to improve',
        ask: {
          q1: 'My students found this activity too abstract. How can I improve it?',
          q2: 'How can I run a debate on the energy transition with 60 students?'
        },
        title: 'Use it with your students',
        description: 'Use an activity in class, reflect on how it went and share what works.',
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
