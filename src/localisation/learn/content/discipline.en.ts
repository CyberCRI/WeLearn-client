// text of the learn module "Sustainability in your discipline" in English, per discipline.
// flip.statement, flip.closing and activities.feedback are not shown by the current screens
import type { DISCIPLINES } from '@/learn/modules/discipline';
import type { DisciplinesText } from '@/types/learn/discipline';

export const discipline: DisciplinesText<typeof DISCIPLINES> = {
  math: {
    flip: {
      statement: 'You are already teaching the tools of the ecological transition.',
      closing:
        "All of this is already part of your discipline. You don't need to add new content; you just need to make the connection visible to your students."
    },
    contributions: [
      {
        verb: 'Measuring and representing',
        text: "You teach students to read, analyze, and visualize data, which is exactly how we track issues like climate change and biodiversity loss. For example, analyzing how France's CO₂ emissions have changed over several decades.",
        activities: [
          {
            title: 'Analyzing local temperatures',
            desc: 'Students work with real historical temperature data to identify trends and key variables, using statistical tools they already know.'
          },
          {
            title: 'Critiquing a climate data visualization',
            desc: 'Give students two graphs that show the same climate data in different ways. They analyze what each one highlights and what it hides.'
          }
        ]
      },
      {
        verb: 'Modeling',
        text: 'Simulating climate change or predicting how ecosystems behave relies on mathematical models, and you teach students to reason this way. For example, modeling how a city adapts to rising temperatures and flood risk.',
        activities: [
          {
            title: 'Modeling how a city responds to rising sea levels',
            desc: 'Students build a simple model of how a city responds to rising sea levels, using differential equations or functions they already know.'
          },
          {
            title: 'Simulating the spread of an invasive species',
            desc: 'Using real data on an invasive species, students model and predict its population growth with exponential or logistic functions.'
          }
        ]
      },
      {
        verb: 'Optimizing',
        text: 'Using resources and energy efficiently is central to sustainability, and you teach the tools for solving these problems. For example, working out how to distribute electricity across a smart grid to minimize losses.',
        activities: [
          {
            title: 'Optimizing renewable energy distribution',
            desc: 'Students solve an optimization problem: how to distribute electricity from solar panels across a neighborhood while minimizing losses and costs.'
          },
          {
            title: 'Comparing two transportation systems',
            desc: 'Students use math to compare two ways of getting around (private car vs. public transit) on energy use, travel time, and emissions. The result is a multi-criteria optimization problem.'
          }
        ]
      },
      {
        verb: 'Supporting decision-making',
        text: "Sustainability policy depends on indicators to guide political and economic decisions, and you teach students to build and interpret them. For example, calculating a product's carbon footprint across its entire life cycle.",
        activities: [
          {
            title: 'Comparing the carbon footprint of two lifestyles',
            desc: 'Students compare the carbon footprints of two students with different lifestyles in terms of transportation, food, and energy use. They get real numbers using math they already know.'
          },
          {
            title: 'Building a sustainability indicator',
            desc: "Students design a simple index to assess a region's sustainability, choosing their variables and justifying how they weight them. Students see how much complexity hides behind every indicator."
          }
        ]
      }
    ],
    competences: {
      intro:
        'Studying sustainability through mathematics helps your students build skills that go well beyond calculation. Here are the most significant ones.',
      featured: [
        {
          name: 'Critical thinking',
          concrete:
            "Students learn to question the parameters behind a climate model: why this data and not other data? What are the model's limits and uncertainties?"
        },
        {
          name: 'Interdisciplinary thinking',
          concrete:
            'By combining mathematics and climate science, students see why IPCC uncertainty ranges are expressed as probabilities and how different disciplines work together to build knowledge.'
        },
        {
          name: 'Responsibility and ethics',
          concrete:
            'Students examine what a model can and cannot tell us, and where the line falls between what is effective, what is likely, and what is desirable in climate policy.'
        }
      ],
      also: [
        'Modeling social-ecological systems',
        'Carrying out statistical and probabilistic analysis',
        'Solving differential equations',
        'Turning real-world problems into equations',
        'Assessing data reliability',
        'Reasoning through scenarios',
        'Communicating complex results'
      ]
    },
    activities: {
      feedback:
        'Great idea. You can fit this activity into an existing lesson without changing your curriculum.'
    },
    reflection: {
      sub: "You've just seen how mathematics connects to sustainability. Now take a moment to think about how this applies to your own teaching.",
      prompts: [
        {
          q: 'Which concept that you teach could you connect to sustainability?',
          placeholder: 'For example: exponential functions, probability, data analysis'
        },
        {
          q: 'How could you make this connection in your next class?',
          placeholder: 'For example: swapping a generic example for real climate data'
        }
      ],
      resourceTitle: 'Mathematics & Ecological Transition'
    }
  },
  history: {
    flip: {
      statement: 'History already helps us understand the challenges of the ecological transition.',
      closing:
        'Your discipline provides a systemic, critical, and contextualized perspective on the ecological transition.'
    },
    contributions: [
      {
        verb: 'Understanding',
        text: 'History traces how societies and their environments have shaped each other over the long term.',
        activities: [
          {
            title: 'Analyzing industrial archives',
            desc: 'Students study archives from the Industrial Revolution to examine its environmental impact.'
          },
          {
            title: 'Studying an environmental disaster',
            desc: 'Analyze a major disaster (an oil spill, an industrial accident) as a window onto the tensions between economics, politics, and the environment.'
          }
        ]
      },
      {
        verb: 'Analyzing',
        text: 'It uncovers how societies have responded, or failed to respond, to environmental challenges.',
        activities: [
          {
            title: 'Comparing how two societies managed their resources',
            desc: 'Compare two societies that faced resource pressures: ancient Rome, which overexploited its farmland, and a society that managed the transition successfully.'
          },
          {
            title: 'Debate: was the Industrial Revolution an ecological disaster?',
            desc: '“Was the Industrial Revolution destined to become an environmental disaster?” Students build their arguments from historical sources.'
          }
        ]
      },
      {
        verb: 'Shedding light',
        text: "It draws lessons from the past to inform today's policy choices.",
        activities: [
          {
            title: 'Connecting past and present',
            desc: "Students trace the historical roots of a current environmental issue and suggest lessons for today's policies."
          },
          {
            title: 'Writing a futures narrative',
            desc: 'Students write a short story about the future based on the historical trends they have identified. It shows how much shared narratives matter.'
          }
        ]
      },
      {
        verb: 'Contextualizing',
        text: "It traces the historical roots of today's environmental issues.",
        activities: [
          {
            title: 'Building a timeline of human pressure on the environment',
            desc: 'Students map the major milestones in the growing human impact on the environment.'
          },
          {
            title: 'Analyzing an SDG through history',
            desc: 'Choose one of the UN Sustainable Development Goals and trace its historical roots. It gives students a historical way into the SDGs.'
          }
        ]
      }
    ],
    competences: {
      intro:
        'Studying sustainability through history helps your students build essential skills. Here are the most significant ones.',
      featured: [
        {
          name: 'Critical thinking',
          concrete:
            'Students learn to identify and cross-check different types of sources on past environmental crises.'
        },
        {
          name: 'Systems thinking',
          concrete:
            'By drawing on several disciplines, students grasp how societies and their environments interact in complex ways.'
        },
        {
          name: 'Civic awareness',
          concrete:
            'Students think through their individual and collective responsibility for the changes ahead.'
        }
      ],
      also: [
        'Identifying sources in environmental history',
        'Analyzing social and environmental change',
        'Placing events in time and space',
        'Comparing historical periods',
        'Proposing solutions'
      ]
    },
    activities: { feedback: 'Perfect. You can add this activity directly to an existing lesson.' },
    reflection: {
      sub: "You've just seen how history connects to sustainability. Now take a moment to think about how this applies to your own teaching.",
      prompts: [
        {
          q: 'Which period or event in your course has the clearest environmental dimension?',
          placeholder: 'For example: the Industrial Revolution, decolonization, major disasters'
        },
        {
          q: 'How could you bring this dimension into your next class?',
          placeholder:
            'For example: adding a question about the environmental impact of an event you already cover'
        }
      ],
      resourceTitle: 'History & Ecological Transition'
    }
  },
  economics: {
    flip: {
      statement: 'You are already teaching the tools of the ecological transition.',
      closing:
        'Economics offers many ways to connect sustainability, prosperity, and social justice.'
    },
    contributions: [
      {
        verb: 'Diagnosing',
        text: 'Economics puts a price on environmental damage and weighs the benefits of managing resources sustainably.',
        activities: [
          {
            title: 'Calculating the cost of climate inaction',
            desc: 'Students use data from the Stern Review to compare the economic cost of climate inaction with the cost of mitigation policies.'
          },
          {
            title: 'Analyzing the externalities of an industry',
            desc: 'Identify and quantify the negative externalities of an industry, such as pollution and biodiversity loss. Who pays these costs, and how?'
          }
        ]
      },
      {
        verb: 'Regulating',
        text: 'It designs economic instruments, such as taxes and subsidies, that reduce environmental impact.',
        activities: [
          {
            title: 'Debate: carbon taxes',
            desc: '“Under what conditions can a carbon tax be both fair and effective?” Students argue different positions using economic data and fairness criteria.'
          },
          {
            title: 'Simulating a climate negotiation (COP)',
            desc: 'Students play different countries in a climate negotiation, applying the concepts of public goods, externalities, and trade-offs between development and mitigation.'
          }
        ]
      },
      {
        verb: 'Modeling',
        text: 'It builds alternative models: the circular economy, degrowth, ecological economics, and planetary boundaries.',
        activities: [
          {
            title: 'Modeling a circular economy',
            desc: "Using François Grosse's mathematical conditions (recycling rates, growth rates), students test whether an economy can truly become circular."
          },
          {
            title: 'Building a net-zero pathway',
            desc: 'Students develop an economic pathway to carbon neutrality by 2050, identifying the key levers and constraints.'
          }
        ]
      },
      {
        verb: 'Decision-making',
        text: 'It provides decision-making tools that make sustainability attractive economically and socially.',
        activities: [
          {
            title: 'Running a cost-benefit analysis of a climate policy',
            desc: 'Assess the costs and benefits of a measure to cut greenhouse gas emissions, using the Nordhaus model, for example.'
          },
          {
            title: 'Designing a sustainable local development project',
            desc: 'In this interdisciplinary project, students design a sustainable local community that balances environmental, social, and economic constraints, then defend their choices.'
          }
        ]
      }
    ],
    competences: {
      intro:
        'Studying sustainability through economics helps your students build essential analytical and critical skills. Here are the most significant ones.',
      featured: [
        {
          name: 'Systems thinking',
          concrete:
            'Students build planetary boundaries into their economic analysis, taking an interdisciplinary view that goes beyond standard models.'
        },
        {
          name: 'Foresight analysis',
          concrete:
            'Students unpack the economic assumptions behind different transition scenarios and anticipate how stakeholders might respond to environmental policies.'
        },
        {
          name: 'Capacity to act',
          concrete:
            'Students apply cost-benefit analysis to real climate policies and assess how effective environmental taxes are.'
        }
      ],
      also: [
        'Critically analyzing economic models',
        'Assessing life-cycle costs',
        'Connecting climate justice and inequality',
        'Modeling the impact of public policy',
        'Assessing alternative regulatory approaches'
      ]
    },
    activities: {
      feedback:
        'Excellent idea. This activity links the economic tools you teach directly to real-world challenges.'
    },
    reflection: {
      sub: "You've just seen how economics connects to sustainability. Now take a moment to think about how this applies to your own teaching.",
      prompts: [
        {
          q: 'Which economic concept from your course connects most naturally to sustainability?',
          placeholder: 'For example: externalities, public goods, cost-benefit analysis'
        },
        {
          q: 'How could you add a sustainability angle to one of your existing lessons?',
          placeholder:
            'For example: replacing a generic example with a real environmental policy case'
        }
      ],
      resourceTitle: 'Economics & Ecological Transition'
    }
  },
  law: {
    flip: {
      statement: 'Law is central to the ecological transition.',
      closing:
        'Law makes decision-making orderly, democratic, and transparent, serving the public interest while respecting planetary boundaries.'
    },
    contributions: [
      {
        verb: 'Defining',
        text: 'Law establishes the core principles of environmental protection: prevention, precaution, non-regression, and the polluter-pays principle.',
        activities: [
          {
            title: "Analyzing France's Charter for the Environment",
            desc: "Students study France's Charter for the Environment. What rights and duties does it establish? Where does it fall short? How effective is it?"
          },
          {
            title: 'Comparing environmental principles in European and national law',
            desc: 'Identify how the precautionary and polluter-pays principles are applied differently at each level of governance.'
          }
        ]
      },
      {
        verb: 'Regulating',
        text: 'It governs human activities to limit their impact, from urban planning and industry to agriculture, mining, and transportation.',
        activities: [
          {
            title: 'Case study: testing a project against environmental law',
            desc: 'Analyze whether a development project (a wind farm, mine, or highway) is lawful under environmental law and the constitution.'
          },
          {
            title: 'Reading and analyzing an environmental law',
            desc: 'Examine a recent piece of environmental legislation to identify how it works, where it falls short, and what stands in the way of implementing it.'
          }
        ]
      },
      {
        verb: 'Holding accountable',
        text: 'It resolves disputes, penalizes environmental harm, and establishes frameworks for environmental liability.',
        activities: [
          {
            title: 'Analyzing a real case of environmental damage',
            desc: 'Study a real case of environmental damage to see how the law handles harm and compensation.'
          },
          {
            title: 'Role-play: competing land uses',
            desc: 'Students take on the roles of different stakeholders in an environmental dispute (farmers, NGOs, local authorities, the national government) to see the legal tensions involved.'
          }
        ]
      },
      {
        verb: 'Governing',
        text: 'It organizes public participation in environmental decisions and defines the responsibilities of public authorities.',
        activities: [
          {
            title: 'Simulating a public consultation on the environment',
            desc: 'Stage a mock public hearing on a project so students weigh opposing views and see how environmental democracy works.'
          },
          {
            title: 'Drafting a mock bill',
            desc: 'Students draft a bill or amendments on an environmental issue, learning how the legislative process works and what compromises it requires.'
          }
        ]
      }
    ],
    competences: {
      intro:
        'Studying sustainability through law helps your students build essential analytical and civic skills. Here are the most significant ones.',
      featured: [
        {
          name: 'Critical analysis',
          concrete:
            'Students interpret an energy or climate law and sort out what falls under national, European, and international law.'
        },
        {
          name: 'Systems thinking',
          concrete:
            'Students see law as a tool for social change and understand how environmental law connects to other areas of law.'
        },
        {
          name: 'Collective action',
          concrete:
            'Students use legal arguments to make the case for environmental protection in real situations.'
        }
      ],
      also: [
        'Identifying key constitutional principles',
        'Understanding liability frameworks',
        'Exploring environmental democracy',
        'Assessing whether projects are constitutional',
        'Mastering legal methodology',
        'Drafting a legal opinion collaboratively'
      ]
    },
    activities: {
      feedback: 'Very good. This activity links legal mechanisms directly to real-life situations.'
    },
    reflection: {
      sub: "You've just seen how law connects to sustainability. Now take a moment to think about how this applies to your own teaching.",
      prompts: [
        {
          q: 'Which legal principle from your course has the most direct environmental application?',
          placeholder:
            'For example: civil liability, the precautionary principle, fundamental rights'
        },
        {
          q: 'How could you use a real environmental case in your next class?',
          placeholder: 'For example: studying a recent court decision, analyzing a current law'
        }
      ],
      resourceTitle: 'Law & Ecological Transition'
    }
  },
  philosophy: {
    flip: {
      statement:
        'Philosophy is already grappling with the challenges of the ecological transition.',
      closing:
        'Philosophy prepares students for the ethical, political, and existential choices the ecological transition raises, and helps shape informed, responsible citizens.'
    },
    contributions: [
      {
        verb: 'Questioning',
        text: 'Philosophy questions the goals of progress and development and examines the cultural assumptions of modernity.',
        activities: [
          {
            title: 'Writing an essay on progress and its limits',
            desc: '“Can technological progress solve the ecological crisis?” A classic philosophical question made urgent by the climate crisis.'
          },
          {
            title: 'Analyzing a text on modernity and the environment',
            desc: 'Read and discuss an excerpt from Hans Jonas, Dominique Bourg, or Bruno Latour. Students sharpen their textual analysis skills on authors who address environmental issues directly.'
          }
        ]
      },
      {
        verb: 'Examining ethics',
        text: 'It looks at the ethical principles behind individual and collective choices and clarifies our responsibility to future generations.',
        activities: [
          {
            title: 'Debate: intergenerational responsibility',
            desc: '“Do we have moral obligations to future generations?” Students explore Rawls, Jonas, and theories of climate justice in a structured debate.'
          },
          {
            title: 'Writing an ethical charter',
            desc: "In groups, students write an ethical charter for an institution (a university, company, or city) facing a specific environmental challenge. It's a hands-on exercise in applied ethics."
          }
        ]
      },
      {
        verb: 'Critiquing',
        text: 'It challenges the dualisms of nature versus culture and human versus non-human, and explores the values that shape how we relate to nature.',
        activities: [
          {
            title: 'Studying veganism as a philosophical case',
            desc: 'Approach veganism not just as a lifestyle choice but as a philosophical test case: which ethical frameworks does it challenge, and what moral foundations does it reveal?'
          },
          {
            title: 'Critiquing the nature/culture dualism',
            desc: 'Using texts by Latour or Descola, students deconstruct the divide between nature and culture and explore what it means for the ecological crisis.'
          }
        ]
      },
      {
        verb: 'Imagining',
        text: 'It asks what an ecological democracy would require and how we might live alongside other forms of life, human and non-human.',
        activities: [
          {
            title: 'Discussing climate justice',
            desc: 'Bring philosophy and geography together around a single question: who suffers most from climate change, and who bears the greatest responsibility? Is that fair?'
          },
          {
            title: 'Designing an ecological democracy',
            desc: "Students define the conditions for a democracy that respects planetary boundaries and gives future generations a voice. It's an exercise in political philosophy."
          }
        ]
      }
    ],
    competences: {
      intro:
        'Studying sustainability through philosophy helps your students build essential reasoning and argumentation skills. Here are the most significant ones.',
      featured: [
        {
          name: 'Problem framing',
          concrete:
            'Students ask fundamental questions about our responsibility to future generations, the intrinsic value of nature, and the meaning of progress.'
        },
        {
          name: 'Critical thinking',
          concrete:
            'Students distinguish knowledge from opinion and question assumptions, especially the grand narratives of progress and growth.'
        },
        {
          name: 'Civic reflection',
          concrete:
            'Students distinguish and connect the dimensions of responsibility: individual, collective, historical, intergenerational, moral, and legal.'
        }
      ],
      also: [
        'Analyzing concepts',
        'Building rigorous arguments',
        'Interpreting philosophical texts',
        'Placing theories in context',
        'Debating and disagreeing constructively',
        'Connecting knowledge across disciplines'
      ]
    },
    activities: {
      feedback:
        'Well chosen. This activity connects philosophy to questions your students actually face.'
    },
    reflection: {
      sub: "You've just seen how philosophy connects to sustainability. Now take a moment to think about how this applies to your own teaching.",
      prompts: [
        {
          q: 'Which concept from your course connects most directly to an environmental issue?',
          placeholder: 'For example: responsibility, justice, progress, nature, the common good'
        },
        {
          q: 'How could you bring an example or text about sustainability into your next class?',
          placeholder:
            'For example: replacing a classic example with a current environmental situation'
        }
      ],
      resourceTitle: 'Philosophy & Ecological Transition'
    }
  },
  psychology: {
    flip: {
      statement: 'Psychology helps explain the human side of the ecological transition.',
      closing:
        'Psychology helps bridge the gap between knowledge and action by taking seriously what people perceive and feel in the face of ecological challenges.'
    },
    contributions: [
      {
        verb: 'Understanding',
        text: 'Psychology analyzes how people perceive and imagine environmental risks, and how they relate to the places the transition affects.',
        activities: [
          {
            title: 'Analyzing perceptions of climate risk',
            desc: 'Students use a social-psychology lens to examine how different populations perceive climate risk, identifying cognitive and cultural biases.'
          },
          {
            title: 'Comparing eco-anxiety across cultural contexts',
            desc: 'Compare how eco-anxiety is experienced in different cultural and regional contexts. Students analyze first-hand accounts and apply psychological frameworks.'
          }
        ]
      },
      {
        verb: 'Regulating',
        text: 'It helps people understand and manage the emotions that environmental change brings: eco-anxiety, solastalgia, and feelings of loss or helplessness.',
        activities: [
          {
            title: 'Debate: is eco-anxiety a disorder or an appropriate response?',
            desc: '“Is eco-anxiety a condition to be treated or a healthy psychological response to climate change?” Students hold a structured debate grounded in scientific evidence.'
          },
          {
            title: 'Analyzing the cognitive mechanisms behind eco-anxiety',
            desc: 'Using anonymized first-hand accounts, students identify the cognitive and emotional mechanisms involved in eco-anxiety and suggest ways to support those affected.'
          }
        ]
      },
      {
        verb: 'Mobilizing',
        text: 'It identifies psychological barriers to change and points to levers for action: social norms, green nudges, and identity.',
        activities: [
          {
            title: 'Designing a green nudge campaign',
            desc: 'Students apply psychological theories (social norms, the theory of planned behavior) to design an awareness campaign on a university campus.'
          },
          {
            title: 'Observing and analyzing eco-friendly behavior',
            desc: 'Observe recycling habits or food choices in real-life settings, interview people about their motivations, and apply social-psychology frameworks.'
          }
        ]
      },
      {
        verb: 'Supporting',
        text: 'It supports psychological sustainability by helping people stay active and constructive despite environmental anxiety.',
        activities: [
          {
            title: 'Designing psychological support for the climate crisis',
            desc: 'Design a psychological support campaign, informed by research on eco-anxiety, for people affected by climate disasters.'
          },
          {
            title: 'Role-play: persuading a cognitively vulnerable group',
            desc: 'Students must persuade a cognitively vulnerable group to engage in the transition to sustainability, for example in response to rising sea levels in a coastal city.'
          }
        ]
      }
    ],
    competences: {
      intro:
        'Studying sustainability through psychology helps your students build essential analytical and applied skills. Here are the most significant ones.',
      featured: [
        {
          name: 'Complex systems thinking',
          concrete:
            'Students identify the links between emotions, pro-environmental behavior, and sustainability policies, and see how complex our views of the environment can be.'
        },
        {
          name: 'Critical analysis',
          concrete:
            'Students understand what underlies environmental discourse and behavior, and recognize where they themselves stand on these issues.'
        },
        {
          name: 'Capacity to drive change',
          concrete:
            'Students design strategies for change and help people turn vulnerability and anxiety into action and resilience.'
        }
      ],
      also: [
        'Understanding human behavior in times of transition',
        'Designing and evaluating strategies for change',
        'Communicating to inform and engage',
        'Analyzing decision-making mechanisms',
        'Analyzing social representations and everyday beliefs'
      ]
    },
    activities: {
      feedback:
        'Good choice. This activity links psychology directly to situations your students experience or observe.'
    },
    reflection: {
      sub: "You've just seen how psychology connects to sustainability. Now take a moment to think about how this applies to your own teaching.",
      prompts: [
        {
          q: 'Which psychological concept from your course is most meaningful when applied to environmental behavior?',
          placeholder:
            'For example: theory of planned behavior, cognitive biases, social representations'
        },
        {
          q: 'How could you make this connection in your next class?',
          placeholder:
            'For example: applying a theoretical framework to a real environmental behavior your students have observed'
        }
      ],
      resourceTitle: 'Psychology & Ecological Transition'
    }
  },
  geography: {
    flip: {
      statement: 'Geography is essential to the ecological transition.',
      closing:
        'Without a geographic grounding in the specific character of places and societies, the ecological transition cannot work. Your discipline is essential.'
    },
    contributions: [
      {
        verb: 'Locating and mapping',
        text: 'You teach students to read spatial dynamics, which is exactly the skill needed to map climate vulnerabilities, pollution flows, and environmental inequalities at different scales.',
        activities: [
          {
            title: "Mapping an area's climate vulnerabilities",
            desc: 'Students build a map of high-risk zones (flooding, drought, heatwaves) at the local or regional scale by combining climate and social data.'
          },
          {
            title: 'Comparing ecological footprints across countries',
            desc: 'Students compare national ecological footprints: who consumes the most, and who suffers the most? They then link the data to inequalities in development.'
          }
        ]
      },
      {
        verb: 'Understanding places',
        text: 'Geography examines how societies and their environments interact, such as how a coastal city adapts to rising sea levels, for example, or how a rural area manages the energy transition.',
        activities: [
          {
            title: 'Studying an eco-district or transition-town project',
            desc: 'Students analyze a real sustainable urban project (for example, the Confluence district in Lyon or Bottière-Chénaie in Nantes): its stakeholders, challenges, trade-offs, and limits.'
          },
          {
            title: 'Analyzing how shrinking snow cover affects mountain tourism',
            desc: 'Students study a mountain area (the Alps, the Pyrenees) facing declining snowfall. How is the local economy diversifying? Where does it meet resistance? Who has a stake?'
          }
        ]
      },
      {
        verb: 'Decoding policies',
        text: 'You teach students to analyze stakeholders and public decisions. The transition demands exactly that: knowing who decides, at what level, and with what effects on local communities.',
        activities: [
          {
            title: 'Simulating a COP-style negotiation on a local resource',
            desc: 'Students play different stakeholders (national government, local authorities, NGOs, businesses, citizens) negotiating the sustainable management of a shared resource: water, forests, or coastline.'
          },
          {
            title: 'Analyzing a sustainable land-use policy',
            desc: 'Students examine a local land-use plan or regional planning framework through a sustainability lens. What are its goals? Where does it contradict itself?'
          }
        ]
      },
      {
        verb: 'Examining inequalities',
        text: 'Geography explores social and spatial inequalities, which the ecological crisis deepens. Who is most vulnerable? Who has access to resources? Who bears the brunt of climate change?',
        activities: [
          {
            title: 'Case study: environmental justice',
            desc: 'Students analyze a place where a polluting industrial site borders disadvantaged communities. Who decided where the site would go? Who bears the consequences? What recourse do residents have?'
          },
          {
            title: 'Mapping climate migration',
            desc: 'Using real data, students map migration driven by climate disasters and analyze differences in vulnerability between the Global North and South.'
          }
        ]
      }
    ],
    competences: {
      intro:
        'Studying sustainability through geography helps your students build essential analytical and civic skills. Here are the most significant ones.',
      featured: [
        {
          name: 'Reading and making maps',
          concrete:
            "Students map an area's climate vulnerabilities, pinpointing high-risk zones and the populations exposed to extreme weather."
        },
        {
          name: 'Critical thinking',
          concrete:
            'Students untangle complex issues, such as conflicts over water use or tensions between tourism development and coastal protection.'
        },
        {
          name: 'Thinking across scales',
          concrete:
            'Students link local decisions (such as an eco-district project) to national and global dynamics (climate policy, climate-driven migration).'
        }
      ],
      also: [
        'Identifying stakeholders and local dynamics',
        'Analyzing spatial dynamics',
        'Working across time and spatial scales',
        'Making the case for a project',
        'Using digital and mapping tools',
        'Seeing how global issues play out locally'
      ]
    },
    activities: {
      feedback:
        'Good choice. This activity applies geographical tools directly to real local issues.'
    },
    reflection: {
      sub: "You've just seen how geography connects to sustainability. Now take a moment to think about how this applies to your own teaching.",
      prompts: [
        {
          q: 'Which place or spatial dynamic in your course connects most clearly to sustainability?',
          placeholder: 'For example: urban dynamics, rural areas, coastlines, regional inequalities'
        },
        {
          q: 'How could you bring a sustainability-related map or case study into your next class?',
          placeholder:
            'For example: adding a climate vulnerability map to an existing lesson on land-use planning'
        }
      ],
      resourceTitle: 'Geography & Ecological Transition'
    }
  },
  health: {
    flip: {
      statement: 'Health sciences have a central part to play in the ecological transition.',
      closing:
        'Health is a common language across disciplines and a concrete way into discussing how humans and their environment depend on each other.'
    },
    contributions: [
      {
        verb: 'Identifying risks',
        text: 'You teach students to assess how environmental exposures affect health: excess deaths during heatwaves, for example, or respiratory diseases linked to air pollution.',
        activities: [
          {
            title: 'Case study: how a heatwave affects public health',
            desc: 'Students analyze data from a real heatwave (deaths, hospital admissions, vulnerable groups) and identify health responses and prevention strategies.'
          },
          {
            title: 'Analyzing an air pollution episode',
            desc: "Using real data (from the WHO or Airparif, the Paris region's air quality monitor), students assess the health effects of a pollution spike and how exposure varies across neighborhoods and populations."
          }
        ]
      },
      {
        verb: 'Analyzing policies',
        text: 'Health sciences help measure the co-benefits of climate policy. Eating less meat, for instance, improves health and cuts emissions. Your students learn to think in systems.',
        activities: [
          {
            title: 'Assessing the health benefits and risks of a climate policy',
            desc: 'Students analyze a sustainability policy (active mobility, lower meat consumption, urban greening) in terms of its health benefits and risks.'
          },
          {
            title: 'Analyzing environmental health strategies',
            desc: "Students examine national and international strategies (France's National Environmental Health Plan, WHO, One Health). What are their goals and tools? How effective are they in supporting the transition to sustainability?"
          }
        ]
      },
      {
        verb: 'Strengthening resilience',
        text: 'Shifting from treatment to prevention is one of the biggest challenges in environmental health, and a mindset students can build from the very start of their training.',
        activities: [
          {
            title: 'Carrying out an environmental health audit on campus',
            desc: 'Students carry out an environmental health audit of their campus (air quality, access to green space, food, transportation), then link the findings to environmental justice.'
          },
          {
            title: 'Role-play: an environmental health issue',
            desc: 'Students play different stakeholders (healthcare professionals, elected officials, NGOs, researchers, citizens) and debate an environmental health issue such as pesticides, pollution, or heatwaves.'
          }
        ]
      },
      {
        verb: 'Reducing the footprint',
        text: 'Healthcare itself is a source of emissions. Your students can design more sustainable medical practices: recycling reagents, eco-designing care, and improving energy efficiency.',
        activities: [
          {
            title: 'Designing more sustainable medical practices',
            desc: 'Students identify ways to reduce the environmental footprint of a hospital unit: recycling, energy efficiency, responsible purchasing, and eco-designed medical equipment.'
          },
          {
            title: 'Communicating the links between health and sustainability',
            desc: 'In groups, students create a poster, podcast, or explainer video for a general audience on how a health issue connects to sustainability.'
          }
        ]
      }
    ],
    competences: {
      intro:
        'Studying sustainability through health sciences helps your students build essential clinical, systems-thinking, and civic skills. Here are the most significant ones.',
      featured: [
        {
          name: 'One Health approach',
          concrete:
            'Students learn to see human health as closely tied to the health of ecosystems and other species, for example by analyzing how global warming drives the spread of vector-borne diseases.'
        },
        {
          name: 'Interdisciplinary thinking',
          concrete:
            "Students combine medicine, ecology, psychology, and sociology to analyze the environmental factors that shape a region's health."
        },
        {
          name: 'Critical thinking',
          concrete:
            'Students distinguish political and media narratives from established science in environmental health, and build ethical reasoning skills for questions of health justice.'
        }
      ],
      also: [
        'Describing how environment and health interact',
        'Analyzing the ecological and social determinants of health',
        'Understanding environmental and health justice issues',
        'Leading change in the health sector',
        'Making recommendations on risk prevention',
        'Contributing to public education and awareness'
      ]
    },
    activities: {
      feedback:
        'Great choice. This activity links clinical skills directly to real environmental issues.'
    },
    reflection: {
      sub: "You've just seen how health sciences connect to sustainability. Now take a moment to think about how this applies to your own teaching.",
      prompts: [
        {
          q: 'Which link between health and the environment could you bring into your next class?',
          placeholder: 'For example: pollution and respiratory disease, mental health and climate'
        },
        {
          q: 'How could you use sustainability as a context for learning in your course?',
          placeholder: 'For example: using climate-related epidemiological data in a clinical case'
        }
      ],
      resourceTitle: 'Health & Ecological Transition'
    }
  },
  staps: {
    flip: {
      statement:
        "Sports science sits where today's health, social, and environmental challenges meet.",
      closing:
        'Sports science trains professionals who can adapt sports practices to ecological constraints, organize more sustainable events, and support change within the sports sector.'
    },
    contributions: [
      {
        verb: 'Understanding climate impacts',
        text: 'Physical activity and sport depend heavily on environmental conditions. Your students learn how the body adapts to extreme heat, air pollution, and severe weather.',
        activities: [
          {
            title: 'Adapting training to heat',
            desc: "Students study real physiological data on heat adaptation and design training protocols suited to today's climate conditions."
          },
          {
            title: 'Case study: mountain sports and shrinking snow cover',
            desc: 'Students analyze how climate change affects a mountain sport such as skiing or mountaineering. How will practices, infrastructure, and business models need to adapt?'
          }
        ]
      },
      {
        verb: 'Building resilience',
        text: "Better fitness can help people cope with certain environmental stresses. Your students learn to design programs suited to today's climate conditions.",
        activities: [
          {
            title: 'Designing a PE program adapted to climate conditions',
            desc: 'Students design a PE unit around a real environmental constraint (a heatwave, poor air quality), with learning objectives, adaptations, and monitoring indicators.'
          },
          {
            title: 'Analyzing the health and climate co-benefits of active mobility',
            desc: "Students calculate and compare the health effects and CO₂ emissions of different ways of getting to a sports facility. It's a hands-on exercise in systems analysis."
          }
        ]
      },
      {
        verb: 'Reducing the footprint',
        text: 'Sport relies heavily on infrastructure, equipment, and travel. Your students can learn to design more sustainable, responsible ways to play and train.',
        activities: [
          {
            title: 'Assessing the sustainability of the Olympic Games',
            desc: 'Using official reports and real data, students assess the environmental footprint of the Olympic Games and propose indicators and ways to reduce it.'
          },
          {
            title: 'Designing a low-impact sporting event',
            desc: 'Students plan a sporting event built around sustainability criteria (transportation, food, waste, accessibility) and define their own sustainability indicators.'
          }
        ]
      },
      {
        verb: 'Educating for global health',
        text: 'Sports science promotes respect, cooperation, and commitment. It offers a way to explore the links between human and environmental health.',
        activities: [
          {
            title: 'Debate: sports performance and planetary boundaries',
            desc: '“Is the pursuit of sports performance compatible with planetary boundaries?” Students argue different positions using economic, health, and environmental data.'
          },
          {
            title: 'Running an awareness initiative at a sports club',
            desc: 'Students design and run a sustainability awareness campaign at a local sports club or association.'
          }
        ]
      }
    ],
    competences: {
      intro:
        'Studying sustainability through sports science helps your students build essential disciplinary and transferable skills. Here are the most significant ones.',
      featured: [
        {
          name: 'Systems thinking',
          concrete:
            'Students describe how health, climate, sports facilities, and the sports economy interact, for example by analyzing how rising temperatures affect training and performance.'
        },
        {
          name: 'Critical analysis',
          concrete:
            'Students examine sport in an era of planetary boundaries, identifying and interpreting the environmental performance indicators of a sports facility or event.'
        },
        {
          name: 'Design skills',
          concrete:
            'Students design a PE or training program that accounts for climate hazards (heatwaves, air quality, flooding) and uses resources responsibly.'
        }
      ],
      also: [
        'Defining sustainability indicators for sporting events',
        'Organizing fair, responsible, low-impact sporting events',
        'Designing a nutrition plan that is both optimal and sustainable',
        'Explaining how climate risks affect athletic performance',
        'Connecting urban planning, mobility, and sport',
        'Carrying out integrated assessments of a local area'
      ]
    },
    activities: {
      feedback:
        'Good choice. This activity links sports science skills directly to real environmental challenges.'
    },
    reflection: {
      sub: "You've just seen how sports science connects to sustainability. Now take a moment to think about how this applies to your own teaching.",
      prompts: [
        {
          q: 'Which sport or lesson in your course could include a sustainability angle?',
          placeholder:
            "For example: a PE class adapted to hot weather, an analysis of a sports facility's footprint"
        },
        {
          q: 'How could you use sustainability as a context for learning in your course?',
          placeholder:
            'For example: using real data from a sporting event to build disciplinary skills'
        }
      ],
      resourceTitle: 'Sports Science & Ecological Transition'
    }
  },
  letters: {
    flip: {
      statement:
        'The humanities and literature have an essential role to play in the ecological transition.',
      closing:
        'Literature and the humanities train citizens who can think about, express, and narrate the world differently, which is essential to transforming how we live.'
    },
    contributions: [
      {
        verb: 'Analyzing worldviews',
        text: 'You teach students to read texts and discourse, which is exactly what it takes to understand the worldviews that led us to overexploit the planet, and to imagine other ways of living on Earth.',
        activities: [
          {
            title: 'Analyzing a body of literature about nature',
            desc: 'Students study excerpts ranging from naturalist writing to climate fiction to trace how ideas of progress, nature, and the planet have changed.'
          },
          {
            title: 'Decoding how we talk about ecology',
            desc: 'Using examples from advertising, politics, and the media, students identify rhetorical strategies around sustainability, including greenwashing.'
          }
        ]
      },
      {
        verb: 'Making sense of the crisis',
        text: 'The ecological crisis is hard to put into words. Literature gives us ways to name, think through, and give shape to ecological upheaval, and to see through greenwashing.',
        activities: [
          {
            title: 'Rewriting a text for the climate era',
            desc: "Students rewrite an excerpt from a literary classic to add a contemporary ecological dimension. This stylistic exercise also puts the original's cultural assumptions under scrutiny."
          },
          {
            title: 'Studying eco-literature authors',
            desc: 'Students study writers of ecological literature (Thoreau, Le Clézio, Tesson, Giono). How do language and style convey a relationship with nature? What new literary genres are emerging?'
          }
        ]
      },
      {
        verb: 'Imagining futures',
        text: 'Through fiction, poetry, theater, and climate science fiction, literature helps us think about social change and craft new shared stories about how we live alongside other species.',
        activities: [
          {
            title: 'Imagining a sustainable or devastated society through writing',
            desc: "Students write a short story set in a society that has made the transition to sustainability, or one that has failed to. It's an exercise in imagining the future through fiction."
          },
          {
            title: 'Bringing literature and science together in an interdisciplinary project',
            desc: 'Working with science colleagues, students write a literary text (essay, story, poem) that puts scientific knowledge in dialogue with how we imagine the climate crisis.'
          }
        ]
      },
      {
        verb: 'Fostering critical citizens',
        text: 'Your students learn to analyze how advertising, the media, and politicians talk about ecology, and to form their own informed views on these issues.',
        activities: [
          {
            title: 'Analyzing a political speech on ecology',
            desc: 'Students dissect a recent political speech on sustainability. What figures of speech, unstated assumptions, and framing does it use? A rhetorical and civic analysis.'
          },
          {
            title: 'Reading and discussing a text in a natural setting',
            desc: 'Students read and discuss a literary text tied to a nearby natural setting, pairing reading with a sensory experience of the environment. It works well as part of a partnership with a cultural or community organization.'
          }
        ]
      }
    ],
    competences: {
      intro:
        'Studying sustainability through literature and the humanities helps your students build essential literary, critical, and civic skills. Here are the most significant ones.',
      featured: [
        {
          name: 'Critical and contextual reading',
          concrete:
            'Students analyze the historical and social context of a work about nature and uncover the values and ideologies behind environmental stories.'
        },
        {
          name: 'Critical thinking',
          concrete:
            'Students examine advertising and political messaging on ecology, telling greenwashing apart from scientifically grounded claims.'
        },
        {
          name: 'Expression and creativity',
          concrete:
            'Students use literature and language to express emotions, values, and visions of the future in response to the climate crisis, turning complex knowledge into accessible stories.'
        }
      ],
      also: [
        'Analyzing a literary work or a speech',
        'Writing an essay or commentary on a sustainability issue',
        'Writing a comparative analysis of texts',
        'Experimenting with creative writing about the natural world',
        'Creating new stories that can drive social change',
        'Spotting opportunities to collaborate across disciplines'
      ]
    },
    activities: {
      feedback:
        'Good choice. This activity applies literary tools to questions your students actually live with and read about.'
    },
    reflection: {
      sub: "You've just seen how the humanities connect to sustainability. Now take a moment to think about how this applies to your own teaching.",
      prompts: [
        {
          q: 'Which work or author in your course connects most directly to ecological issues?',
          placeholder:
            'For example: Zola and industry, Le Clézio and our relationship with nature, climate dystopias'
        },
        {
          q: 'How could you bring an ecological angle into your next literature class?',
          placeholder:
            'For example: adding a question about how nature is imagined in a work already on your syllabus'
        }
      ],
      resourceTitle: 'Humanities & Ecological Transition'
    }
  },
  ecology: {
    flip: {
      statement: 'Scientific ecology provides the foundational knowledge for the transition.',
      closing:
        "Ecology provides essential knowledge for understanding today's environmental crises. By studying the living world, it also drives progress and innovation for the transition."
    },
    contributions: [
      {
        verb: 'Describing and understanding',
        text: 'Ecology studies how living organisms interact with their environment. You teach students how ecosystems are structured and how they function, whether human activity has shaped them heavily or only lightly.',
        activities: [
          {
            title: 'Carrying out a field-based ecological assessment',
            desc: 'Students carry out an ecological assessment of a local site (a river, forest, soil, or grassland) using the observation and measurement methods they have learned in class.'
          },
          {
            title: 'Building a biodiversity atlas',
            desc: 'Students survey biodiversity across their campus or neighborhood, map the species they observe, and analyze what influences their presence.'
          }
        ]
      },
      {
        verb: 'Assessing and predicting',
        text: 'Your students learn to assess how resilient or vulnerable ecosystems are to human pressure, identify tipping points, and model how they change.',
        activities: [
          {
            title: 'Modeling the effects of a disturbance on an ecosystem',
            desc: 'Starting from a real-world scenario (road construction, river pollution, an invasive species), students model the cascading effects on the ecosystem.'
          },
          {
            title: 'Comparing farming practices by their ecosystem benefits',
            desc: 'Students compare conventional farming and agroecology on criteria such as biodiversity, soil quality, and ecosystem services. A multi-criteria analysis.'
          }
        ]
      },
      {
        verb: 'Proposing solutions',
        text: 'Ecology offers ways to drive change: agroecology, urban ecology, nature-based solutions, biomimicry. Your students learn to design concrete action plans.',
        activities: [
          {
            title: 'Drafting an action plan for a local area',
            desc: 'For an area under heavy pressure (urban sprawl, pollution, drought), students draft an action plan and spell out the trade-offs involved.'
          },
          {
            title: 'Designing a nature-based solution',
            desc: 'Students identify a local environmental problem (urban heat island, stormwater runoff, pollinator decline) and design a solution inspired by how ecosystems work.'
          }
        ]
      },
      {
        verb: 'Informing decisions',
        text: 'Ecological knowledge is essential to sound public policy. Your students learn to explain complex scientific data to decision-makers and non-specialists.',
        activities: [
          {
            title: 'Role-play: a land management controversy',
            desc: 'In a role-play, students use scientific data to debate how to manage a contested area or issue (wolf reintroduction, loss of open land to development, wetland management).'
          },
          {
            title: 'Analyzing how a sector scenario accounts for biodiversity',
            desc: 'Students analyze how biodiversity is (or is not) built into a real agricultural, energy, or urban planning scenario, and suggest improvements.'
          }
        ]
      }
    ],
    competences: {
      intro:
        'Studying sustainability through ecology helps your students build essential analytical and practical skills. Here are the most significant ones.',
      featured: [
        {
          name: 'Systems analysis',
          concrete:
            'Students describe an ecosystem as a network of interactions, trace cascading responses to disturbance, and explain the concepts of resilience and irreversibility.'
        },
        {
          name: 'Critical analysis',
          concrete:
            'Students identify the natural and human factors that drive ecosystem dynamics and recognize the strengths and limits of data collection and modeling tools.'
        },
        {
          name: 'Taking action',
          concrete:
            'Students propose action plans to conserve or restore biodiversity and draw on nature to design mitigation and adaptation solutions.'
        }
      ],
      also: [
        'Explaining what drives genetic and species diversity',
        'Applying population and community ecology',
        'Understanding ecosystem services and nature-based solutions',
        'Anticipating the consequences of biodiversity loss',
        'Linking ecology with other disciplines to describe social-ecological systems',
        'Identifying reliable sources of ecological information'
      ]
    },
    activities: {
      feedback:
        'Excellent choice. This activity ties ecological concepts directly to real-world field situations.'
    },
    reflection: {
      sub: "You've just seen how ecology connects to sustainability. Now take a moment to think about how this applies to your own teaching.",
      prompts: [
        {
          q: 'Which ecological concept from your course applies most directly to a sustainability issue?',
          placeholder: 'For example: ecosystem resilience, ecosystem services, population dynamics'
        },
        {
          q: 'How could you bring fieldwork or a real-world case related to sustainability into your next class?',
          placeholder:
            'For example: using a disturbed local ecosystem as a case study for a modeling class'
        }
      ],
      resourceTitle: 'Ecology & Ecological Transition'
    }
  },
  art: {
    flip: {
      statement: 'Art plays a unique and vital role in the ecological transition.',
      closing:
        'Art stirs emotions, transforms how we imagine the world, questions how we live, and brings people together around shared stories and experiences. Its contributions to the ecological transition are many and irreplaceable.'
    },
    contributions: [
      {
        verb: 'Shifting perspectives',
        text: 'Art stirs emotions and helps us feel the beauty and fragility of nature, or the violence of environmental change, more deeply. Your students learn to build ecological awareness through aesthetic experience.',
        activities: [
          {
            title: 'Analyzing ecological artworks (eco-art, land art)',
            desc: 'Students analyze works by artists engaged with ecological issues (Andy Goldsworthy, Agnes Denes, Olafur Eliasson). How does each work challenge the way we relate to nature?'
          },
          {
            title: 'Creating a sound piece from field recordings',
            desc: "Students record sounds in different places, from heavily altered to nearly untouched environments, and compose a sound piece. It's an exercise in paying close sensory attention to the environment and how it is changing."
          }
        ]
      },
      {
        verb: 'Creating new stories',
        text: 'Art invents stories, images, and symbols that inspire action and open up new possibilities. Your students learn to create works that change how we collectively imagine the world.',
        activities: [
          {
            title: 'Creating comic pages about sustainability',
            desc: 'In multidisciplinary groups, students create comic pages that teach a sustainability issue, combining visual storytelling with scientific knowledge.'
          },
          {
            title: 'Sharing science through slam poetry',
            desc: 'Invite a slam poet, or have students write their own slam poem, on a sustainability issue. Students practice turning scientific knowledge into a shared artistic performance.'
          }
        ]
      },
      {
        verb: 'Trying new approaches',
        text: 'Art explores other ways of inhabiting a place, reusing materials, and working with living systems. Your students can rethink their relationship with objects, waste, and technology.',
        activities: [
          {
            title: 'Creating with reclaimed materials',
            desc: 'Students create a visual artwork using only salvaged or natural materials. The workshop explores our relationship with materials, waste, and resources in artistic practice.'
          },
          {
            title: 'Exploring ecosomatic practices and environmental awareness',
            desc: 'Movement-based exercises (dance, theater) invite students to sense the natural world within themselves and pay closer attention to their surroundings. The approach sits at the crossroads of dance, theater, and ecology.'
          }
        ]
      },
      {
        verb: 'Encouraging participation',
        text: 'Art brings people together and sparks reactions through collective projects such as murals, performances, and installations. Your students learn to create tools that bring people together and open a dialogue about sustainability.',
        activities: [
          {
            title: 'Staging forum theater on a sustainability issue',
            desc: "Run a forum theater session built around a sustainability scenario. Students perform, then audience members step in. Augusto Boal's method is a powerful way to raise awareness."
          },
          {
            title: 'Organizing an ecological arts festival or week',
            desc: 'Organize a week-long program of performances, screenings, workshops, exhibitions, and talks. Student groups produce an artistic piece in the format of their choice.'
          }
        ]
      }
    ],
    competences: {
      intro:
        'Studying sustainability through the arts helps your students build essential creative, critical, and civic skills. Here are the most significant ones.',
      featured: [
        {
          name: 'Critical analysis of artworks',
          concrete:
            'Students explore how artists address ecological issues in different cultural contexts and trace how artistic attitudes toward nature and the built environment have changed over time.'
        },
        {
          name: 'Creativity and innovation',
          concrete:
            'Students try out new materials (recycled, natural, sustainable) and experiment with low-impact or collaborative art forms tied to sustainability issues.'
        },
        {
          name: 'Critical and ethical thinking',
          concrete:
            'Students analyze the tensions between art, consumer society, and sustainability, and question the environmental impact of their own artistic practice (transportation, exhibitions, distribution).'
        }
      ],
      also: [
        'Representing the complexity of ecological issues',
        'Imagining new ways of seeing and representing the world',
        'Leading collective art projects that build engagement',
        'Contributing to ecological awareness initiatives through the arts',
        'Turning complex issues into sensory, accessible forms',
        'Using art to bring people together and share knowledge'
      ]
    },
    activities: {
      feedback:
        'Excellent. This activity brings artistic creation and ecological awareness together in a way you can use right away.'
    },
    reflection: {
      sub: "You've just seen how the arts connect to sustainability. Now take a moment to think about how this applies to your own teaching.",
      prompts: [
        {
          q: 'Which art form in your course could take an ecological issue as its material or subject?',
          placeholder:
            'For example: a creative workshop on the natural world, an analysis of ecological artworks'
        },
        {
          q: 'How could you turn sustainability into a space for artistic experimentation in your course?',
          placeholder: 'For example: requiring sustainable materials in your next creative workshop'
        }
      ],
      resourceTitle: 'Art & Ecological Transition'
    }
  },
  polsci: {
    flip: {
      statement:
        'Political science is essential for understanding and guiding the ecological transition.',
      closing:
        'The ecological transition is above all a political issue, because it is about how societies organize themselves, make decisions, weigh trade-offs, and change. Your discipline speaks directly to these questions.'
    },
    contributions: [
      {
        verb: 'Understanding governance',
        text: 'Who decides, at what level, and how? You teach students to identify the levels of governance (local, national, international) and the stakeholders involved in sustainability decisions.',
        activities: [
          {
            title: 'Simulating an international climate negotiation (COP)',
            desc: 'Students represent different countries in a climate negotiation. They feel the pull between cooperation and conflict firsthand as they negotiate commitments based on their national interests.'
          },
          {
            title: 'Analyzing the multi-level governance of a climate policy',
            desc: "Students examine how a climate policy (for example, France's Climate and Resilience Law) links European, national, and local levels, and identify the stakeholders, tensions, and room to maneuver."
          }
        ]
      },
      {
        verb: 'Analyzing power relations',
        text: 'The transition to sustainability exposes conflicts of interest among economic, political, and social groups. Your students learn to unpack the trade-offs around natural resources and environmental justice.',
        activities: [
          {
            title: 'Case study: conflicts over a natural resource',
            desc: 'Students analyze a real conflict over the use of a resource (water, energy, farmland, coastline). Who are the stakeholders? What are their interests? What regulations apply?'
          },
          {
            title: 'Debate: North–South climate justice',
            desc: '“Do developed countries bear a special responsibility for the global transition to sustainability?” A structured debate grounded in data on historical responsibility and current vulnerability.'
          }
        ]
      },
      {
        verb: 'Evaluating public policy',
        text: 'Designing, evaluating, and comparing sustainability policies means asking which instruments to use (taxes, regulations, subsidies) and what works or fails in a given context. That is core to your discipline.',
        activities: [
          {
            title: 'Evaluating the effectiveness of carbon pricing',
            desc: "Using real cases (Sweden's carbon tax, the EU carbon market), students analyze what makes a market-based instrument succeed or fail."
          },
          {
            title: 'Comparing the same sustainability policy in two countries',
            desc: 'Students compare the same sustainability policy (building renovation, transportation, energy) in two countries: contexts, instruments, results, and lessons learned.'
          }
        ]
      },
      {
        verb: 'Analyzing ecological democracy',
        text: 'Your students learn to distinguish and analyze the forms of democracy at work in the transition, such as participatory and deliberative democracy, and to understand the role of citizen movements and new models of shared governance.',
        activities: [
          {
            title: "Analyzing France's Citizens' Convention for Climate",
            desc: "Students study the process and outcomes of France's Citizens' Convention for Climate. How does deliberative democracy work in practice? Which proposals were adopted, and why?"
          },
          {
            title: 'Debate: are democracy and climate urgency compatible?',
            desc: '“Can democratic timelines keep pace with the urgency of the climate crisis?” A philosophical and political debate on the tension between legitimacy and effectiveness.'
          }
        ]
      }
    ],
    competences: {
      intro:
        'Studying sustainability through political science helps your students build essential analytical and civic skills. Here are the most significant ones.',
      featured: [
        {
          name: 'Public policy analysis',
          concrete:
            'Students design and evaluate sustainability policies, compare instruments (carbon taxes, emissions trading, regulation), and identify what works in which context.'
        },
        {
          name: 'Critical analysis of political narratives',
          concrete:
            'Students identify the narratives, beliefs, and ideologies that shape political decisions on sustainability (green growth versus degrowth) and examine the visions of society behind collective choices.'
        },
        {
          name: 'Citizenship and engagement',
          concrete:
            'Students learn about the role of citizen movements and new models of shared governance, and build the capacity to take part in democratic debate on ecological issues.'
        }
      ],
      also: [
        'Identifying stakeholders in multi-level governance',
        'Analyzing power relations between political, economic, and social stakeholders',
        'Understanding how international negotiations work (COP, SDGs)',
        'Connecting environmental justice, social justice, and development',
        'Studying transitions through a Global North–South lens',
        'Analyzing sustainability policy instruments'
      ]
    },
    activities: {
      feedback:
        'Good choice. This activity applies political science tools directly to current sustainability issues.'
    },
    reflection: {
      sub: "You've just seen how political science connects to sustainability. Now take a moment to think about how this applies to your own teaching.",
      prompts: [
        {
          q: 'Which concept or case from your course connects most directly to an environmental governance issue?',
          placeholder:
            'For example: public policy, participatory democracy, international relations'
        },
        {
          q: 'How could you bring a real environmental policy case into your next class?',
          placeholder:
            'For example: analyzing a recent climate policy decision, simulating an international negotiation'
        }
      ],
      resourceTitle: 'Political Science & Ecological Transition'
    }
  },
  physics: {
    flip: {
      statement: 'Physics is fundamental to the ecological transition.',
      closing:
        'Physics explains how the planet works, provides the tools for low-carbon solutions, and gives you the means to measure their limits. All of this is already part of your discipline; the point is to make it visible.'
    },
    contributions: [
      {
        verb: 'Understanding the Earth system',
        text: "You teach students about the Earth's radiation balance, the greenhouse effect, and atmospheric and ocean circulation. This is the foundation for understanding climate change, identifying tipping points, and forecasting extreme weather.",
        activities: [
          {
            title: 'Building a simplified radiation balance of the Earth',
            desc: "Students use the radiation laws they already know to calculate the Earth's equilibrium temperature with and without the greenhouse effect, and to see how rising CO₂ concentrations change the result."
          },
          {
            title: 'Analyzing ocean circulation data',
            desc: 'Using real data (temperature, salinity, sea level), students identify how the ocean stores heat and how its circulation changes with climate change.'
          }
        ]
      },
      {
        verb: 'Developing sustainable energy',
        text: 'Harnessing wind, solar radiation, or geothermal heat, storing energy, and optimizing smart grids: these are physics problems your students learn to solve.',
        activities: [
          {
            title: 'Comparing ways of generating electricity',
            desc: 'Students calculate the power, efficiency, and emissions of several technologies (wind, solar, nuclear, gas) and discuss the physical constraints of each.'
          },
          {
            title: 'Studying the performance of a solar cell',
            desc: 'Students use the current–voltage characteristic of a solar cell to determine its efficiency and identify the factors that limit it.'
          }
        ]
      },
      {
        verb: 'Designing sustainable materials',
        text: 'Materials built for a changing climate, recycling processes, and alternatives to critical or finite materials: materials physics is a major lever for the transition.',
        activities: [
          {
            title: 'Comparing the life cycle of two materials',
            desc: 'Students compare two materials (for example, two insulation materials) on manufacturing energy, performance, and end of life, to discuss what makes a choice truly sustainable.'
          },
          {
            title: 'Finding alternatives to a critical material',
            desc: 'Students identify a critical or finite material in a technology (battery, magnet) and discuss alternative processes, their performance, and their limits.'
          }
        ]
      },
      {
        verb: 'Taking a critical view',
        text: 'With orders of magnitude and models, physics lets us assess the limits of some technological solutions and make the case for sufficiency.',
        activities: [
          {
            title: 'Using orders of magnitude to estimate emission cuts in a sector',
            desc: 'Students calculate how much several levers can realistically deliver (efficiency, new propulsion technologies, sufficiency) to cut emissions from transportation or aviation.'
          },
          {
            title: 'Assessing the physical footprint of digital technology',
            desc: 'Students estimate the energy and materials used by an everyday digital activity (streaming, data storage) and debate what technological solutions can and cannot solve.'
          }
        ]
      }
    ],
    competences: {
      intro:
        'Studying sustainability through physics helps your students build skills that go well beyond calculation. Here are the most significant ones.',
      featured: [
        {
          name: 'Systems thinking',
          concrete:
            'Students connect climate, energy, resources, and technology, identify feedback loops in biophysical systems, and consider the full life cycle of a material or process.'
        },
        {
          name: 'Critical analysis',
          concrete:
            'Students produce a risk–benefit analysis of a technological solution, question the assumptions behind a model, assess uncertainty, and weigh efficiency against sufficiency.'
        },
        {
          name: 'Scientific responsibility and engagement',
          concrete:
            'Students reflect on how the technologies they study are used and on what scientific and technical choices mean for society, and see themselves as future contributors to the transition.'
        }
      ],
      also: [
        'Linking climate, energy, resources, and technology',
        'Thinking in terms of material life cycles',
        'Combining physics with economics, biology, and the social sciences',
        'Understanding sociotechnical systems',
        'Engaging with other disciplines',
        'Weighing ethical questions'
      ]
    },
    activities: {
      feedback:
        'Very good. This activity applies physics tools directly to real sustainability challenges.'
    },
    reflection: {
      sub: "You've just seen how physics connects to sustainability. Now take a moment to think about how this applies to your own teaching.",
      prompts: [
        {
          q: 'Which chapter of your course connects most directly to an energy or climate issue?',
          placeholder: 'For example: thermodynamics, radiation, waves, fluid mechanics'
        },
        {
          q: 'How could you bring a sustainability-related order-of-magnitude calculation into your next class?',
          placeholder: 'For example: estimating the solar panel area needed to power a building'
        }
      ],
      resourceTitle: 'Physics & Ecological Transition'
    }
  },
  anthropology: {
    flip: {
      statement: 'Anthropology helps us understand the human side of the ecological transition.',
      closing:
        "Anthropology helps shape policies and actions grounded in people's lives, for a fair and effective ecological transition."
    },
    contributions: [
      {
        verb: 'Revealing the diversity of relationships with nature',
        text: 'You teach your students that relationships between humans and non-humans vary across cultural, geographical, and historical contexts. Other ways of inhabiting the world exist, and so do other values placed on nature.',
        activities: [
          {
            title: 'Comparing two conceptions of nature',
            desc: 'Using excerpts from ethnographies, students analyze two societies with contrasting relationships with nature. They identify what each conception means for how people inhabit the world and use resources.'
          },
          {
            title: 'Analyzing the values attached to biodiversity',
            desc: 'Students examine how different groups (residents, scientists, NGOs, land managers) value the same species or protected area, and why those values sometimes clash.'
          }
        ]
      },
      {
        verb: 'Understanding local and Indigenous knowledge',
        text: 'Plants, animals, the rhythms of nature: your students discover how this knowledge is produced and passed on, and what it can contribute to fields such as agroecology or ecosystem conservation.',
        activities: [
          {
            title: 'Studying a case of knowledge co-production',
            desc: 'Students analyze an example where Indigenous and scientific knowledge were brought together to respond to global change: who produced what, how the different kinds of knowledge interacted, and what difficulties arose.'
          },
          {
            title: 'Discussing the role of traditional knowledge in a project',
            desc: 'Students examine an environmental management or restoration project and discuss how to include local knowledge, under what conditions, and with what ethical precautions.'
          }
        ]
      },
      {
        verb: 'Describing ways of life',
        text: 'Social organization, governance, techniques, environmental knowledge: your students learn to observe how societies live with their environment and how they adapt to global change.',
        activities: [
          {
            title: 'Running a mini-survey on how people use a place',
            desc: 'Students carry out a few interviews or observations with people who use a place (community garden, river, coastline) to describe their practices, their knowledge, and their relationship with the environment.'
          },
          {
            title: 'Analyzing how a way of life adapts to global change',
            desc: 'Drawing on a field case studied in class, students describe how the social organization and techniques of a community change in response to environmental change.'
          }
        ]
      },
      {
        verb: 'Opening up other perspectives',
        text: 'Anthropology invites us to step back from ideas of growth, progress, and development, and lends legitimacy to other goals such as sufficiency or “living well.”',
        activities: [
          {
            title: 'Debate: growth, sufficiency, or living well?',
            desc: 'Drawing on societies studied in class, students debate what progress and development mean, and what other paths could look like.'
          },
          {
            title: 'Questioning your own fieldwork practices',
            desc: 'Students identify the ecological impact of a fieldwork project (travel, tools, methods) and suggest adjustments, while examining their own stance as researchers.'
          }
        ]
      }
    ],
    competences: {
      intro:
        'Studying sustainability through anthropology helps your students build essential analytical, dialogue, and ethical skills. Here are the most significant ones.',
      featured: [
        {
          name: 'Analysis of how people represent nature',
          concrete:
            'Students describe the diversity of relationships with the natural world, interpret the beliefs, stories, and value systems associated with nature, and analyze how they shape ways of life.'
        },
        {
          name: 'Supporting change and fostering dialogue',
          concrete:
            'Students identify the social barriers to and drivers of engagement with ecological issues, translate complex knowledge for different audiences, and bring local knowledge into decision-making.'
        },
        {
          name: 'Ethical and responsible fieldwork',
          concrete:
            'Students use participant observation, interviews, and ethnographic surveys, and examine their own position, their biases, and historical power imbalances.'
        }
      ],
      also: [
        'Defining different types of knowledge (local, academic)',
        'Questioning development models and discourses',
        'Seeing how ecological, social, economic, and political factors interact',
        'Facilitating dialogue between stakeholders with different interests',
        'Collaborating with other disciplines',
        'Getting involved in action research'
      ]
    },
    activities: {
      feedback:
        'Good choice. This activity applies the tools of anthropology directly to real sustainability situations.'
    },
    reflection: {
      sub: "You've just seen how anthropology connects to sustainability. Now take a moment to think about how this applies to your own teaching.",
      prompts: [
        {
          q: 'Which society, field case, or author from your course best illuminates how people relate to nature?',
          placeholder:
            'For example: a field case studied in class, the nature/culture divide, Indigenous knowledge'
        },
        {
          q: 'How could you bring ecological questions into your next class?',
          placeholder:
            'For example: adding a question on local knowledge or on the values attached to biodiversity'
        }
      ],
      resourceTitle: 'Anthropology & Ecological Transition'
    }
  }
};
