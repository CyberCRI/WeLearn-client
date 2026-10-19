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
    title: 'How can WeLearn support your teaching today?',
    intro: 'Choose what you need. You can start anywhere.',
    getStarted: 'Get started',
    open: 'Open',
    seePreview: 'See the preview',
    allSpaces: 'All teacher spaces',
    preview: 'Preview',
    previewNotice: 'Preview: this feature is being designed',
    question: 'Your question',
    objective: 'Objective',
    spaces: {
      understand: {
        name: 'Understand',
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
        search: 'Search resources',
        chat: 'Ask a question'
      },
      design: {
        name: 'Design',
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
            note: 'Idea: after creating a syllabus, a "Create an activity for this" button could open this flow with the course already filled in.'
          }
        }
      },
      teach: {
        name: 'Teach',
        title: 'Use it with your students',
        description: 'Use an activity in class, reflect on how it went and share what works.',
        question: 'How can I use this with my students and keep improving it?',
        objective:
          'Leave with something concrete for your class, learn from how it went and share what works with other teachers.',
        steps: {
          use: {
            title: 'Use',
            description: 'A classroom-ready activity to share with your students.'
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
