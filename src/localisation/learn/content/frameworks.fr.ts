// text of the learn module "Sustainability frameworks" in French, keyed by the ids of its structure
import type { FRAMEWORKS } from '@/learn/modules/frameworks';
import type { ModuleText } from '@/types/learn/modules';

export const frameworks: ModuleText<typeof FRAMEWORKS> = {
  title: 'Les référentiels de la durabilité',
  subtitle: 'Voyez à quoi servent les ODD et le GreenComp.',
  duration: '≈ 5 min',
  hook: 'Vous avez sans doute déjà vu les icônes colorées des Objectifs de développement durable (ODD) et entendu parler du GreenComp, le référentiel européen des compétences en durabilité. Ce ne sont pas des listes à cocher concurrentes : ils répondent à deux questions différentes.',
  goal: 'En cinq minutes environ, vous allez voir à quoi servent les ODD et le GreenComp, et comment ils se complètent quand vous concevez un cours.',
  confidenceBefore:
    'À ce stade, à quel point voyez-vous clairement la différence entre les ODD et le GreenComp ?',
  confidenceAfter:
    'Et maintenant, à quel point voyez-vous clairement la différence entre les ODD et le GreenComp ?',
  takeaways: [
    'Les ODD décrivent les enjeux de durabilité que vos étudiant·es abordent.',
    'Le GreenComp décrit les compétences développées en les abordant.',
    'Ce sont des références pour éclairer vos choix, pas des listes à cocher.',
    'Le lien entre un ODD et une compétence dépend de ce que font réellement les étudiant·es.'
  ],
  steps: {
    sdgs: {
      title: 'Les ODD : quels enjeux ?',
      short: 'ODD',
      instruction:
        'Regroupez les 17 objectifs selon les cinq P cités par l’Agenda 2030 (un regroupement courant, non officiel), puis voyez comment les objectifs sont liés.',
      cite: [{ src: 'agenda', loc: 'préambule ; §55' }],
      explanation:
        'Les 17 ODD font partie de l’Agenda 2030 de l’ONU. Ils couvrent des enjeux environnementaux, sociaux et économiques, et l’Agenda les décrit comme « intégrés et indissociables ».',
      ps: {
        people: 'Humanité',
        planet: 'Planète',
        prosperity: 'Prospérité',
        peace: 'Paix',
        partnership: 'Partenariats'
      },
      psCite: [{ src: 'agenda', loc: 'préambule' }],
      focus: {
        button: 'Voir les liens de l’ODD 12',
        text: 'Exemple : la mode éphémère (fast fashion). La consommation responsable (12) est liée aux mauvaises conditions de travail (travail décent, 8 ; inégalités, 10) et à l’accumulation des déchets dans les villes (11). Agir sur un objectif a des effets sur les autres.',
        cite: [{ src: 'greencomp', loc: 'p. 21' }]
      },
      note: 'Les ODD vous aident à repérer les enjeux qu’un cours peut aborder. Ce ne sont ni une méthode pédagogique ni un référentiel de compétences.'
    },
    greencomp: {
      title: 'GreenComp : quelles compétences ?',
      short: 'GreenComp',
      instruction: 'Ouvrez chaque domaine pour voir ses trois compétences.',
      cite: [{ src: 'greencomp', loc: 'tableau 1, p. 14–15' }],
      explanation:
        'Le GreenComp est le référentiel européen des compétences en durabilité. Il décrit ce que les apprenant·es peuvent devenir capables de faire, en quatre domaines interconnectés de trois compétences chacun.',
      areas: {
        values: {
          name: 'Incarner les valeurs de la durabilité',
          competences: {
            'valuing-sustainability': {
              name: 'Accorder de la valeur à la durabilité',
              line: 'Réfléchir à ses valeurs personnelles et à la façon dont elles orientent ses actions.'
            },
            'supporting-fairness': {
              name: 'Encourager l’équité',
              line: 'Favoriser l’équité et la justice pour les générations actuelles et à venir.'
            },
            'promoting-nature': {
              name: 'Promouvoir la nature',
              line: 'Reconnaître que l’humain fait partie de la nature et respecter les autres espèces.'
            }
          }
        },
        complexity: {
          name: 'S’ouvrir à la complexité dans la durabilité',
          competences: {
            'systems-thinking': {
              name: 'Pensée systémique',
              line: 'Aborder un problème sous tous ses angles, dans le temps, l’espace et son contexte.'
            },
            'critical-thinking': {
              name: 'Pensée critique',
              line: 'Évaluer les informations et les arguments, et remettre en question les présupposés.'
            },
            'problem-framing': {
              name: 'Cadrage des problèmes',
              line: 'Formuler les défis comme des problèmes de durabilité et en définir la portée.'
            }
          }
        },
        futures: {
          name: 'Envisager des avenirs durables',
          competences: {
            'futures-literacy': {
              name: 'Littératie des futurs',
              line: 'Imaginer d’autres futurs possibles et les étapes pour y parvenir.'
            },
            adaptability: { name: 'Adaptabilité', line: 'Gérer les transitions et l’incertitude.' },
            'exploratory-thinking': {
              name: 'Pensée exploratoire',
              line: 'Combiner les disciplines, la créativité et l’expérimentation.'
            }
          }
        },
        acting: {
          name: 'Agir pour la durabilité',
          competences: {
            'political-agency': {
              name: 'Agentivité politique',
              line: 'S’orienter dans le système politique, identifier les responsabilités et exiger des politiques efficaces.'
            },
            'collective-action': {
              name: 'Action collective',
              line: 'Agir pour le changement avec les autres.'
            },
            'individual-initiative': {
              name: 'Initiative individuelle',
              line: 'Identifier son propre potentiel et agir pour contribuer.'
            }
          }
        }
      },
      note: 'Le GreenComp n’est pas prescriptif : c’est une référence, pas une liste à cocher. Un cours peut se concentrer sur les quelques compétences qui correspondent à ce que font vos étudiant·es ; les 12 ont vocation à être développées sur l’ensemble d’un parcours.',
      noteCite: [{ src: 'greencomp', loc: 'p. 15, 30' }],
      attribution: 'Adapté de Bianchi, Pisiotis et Cabrera Giraldez (2022), GreenComp, CC BY 4.0.'
    },
    sort: {
      title: 'Enjeu ou compétence ?',
      short: 'Quiz',
      instruction:
        'Chaque élément est-il un enjeu de durabilité (ODD) ou quelque chose que les apprenant·es deviennent capables de faire (GreenComp) ?',
      bins: { sdg: 'Un enjeu → ODD', gc: 'Une compétence → GreenComp' },
      cards: {
        f1: {
          text: 'L’accès à l’eau potable',
          feedback: 'Oui : un enjeu (ODD 6).',
          hint: 'est-ce un problème du monde, ou une capacité ?'
        },
        f2: {
          text: 'Voir un problème comme un système d’interactions',
          feedback: 'Oui : la pensée systémique, une compétence du GreenComp.',
          hint: 'est-ce quelque chose que les apprenant·es deviennent capables de faire ?'
        },
        f3: {
          text: 'Réduire les inégalités entre les pays',
          feedback: 'Oui : un enjeu (ODD 10).',
          hint: 'est-ce un problème du monde, ou une capacité ?'
        },
        f4: {
          text: 'Imaginer d’autres futurs possibles et la façon d’y parvenir',
          feedback: 'Oui : la littératie des futurs, une compétence du GreenComp.',
          hint: 'est-ce quelque chose que les apprenant·es deviennent capables de faire ?'
        },
        f5: {
          text: 'Le changement climatique et ses impacts',
          feedback: 'Oui : un enjeu (ODD 13).',
          hint: 'est-ce un problème du monde, ou une capacité ?'
        },
        f6: {
          text: 'Agir avec d’autres pour faire advenir un changement',
          feedback: 'Oui : l’action collective, une compétence du GreenComp.',
          hint: 'est-ce quelque chose que les apprenant·es deviennent capables de faire ?'
        }
      }
    },
    example: {
      title: 'Les utiliser ensemble',
      short: 'Exemple',
      instruction: 'Partez d’un thème de cours et posez deux questions.',
      challenge: 'L’utilisation responsable des ressources',
      sdg: { text: 'Peut se rattacher à l’ODD 12 : Consommation et production responsables' },
      question:
        'Et maintenant, que vont réellement faire les étudiant·es ? Choisissez une intention d’apprentissage :',
      options: {
        systems: {
          intention:
            'Les étudiant·es analysent les relations entre l’utilisation des ressources, les procédés de production, les déchets et les impacts environnementaux.'
        },
        futures: {
          intention:
            'Les étudiant·es imaginent à quoi pourrait ressembler un campus zéro déchet en 2040, et les étapes pour y arriver.'
        },
        collective: {
          intention:
            'Les étudiant·es organisent un repair café sur le campus avec des partenaires locaux.'
        }
      },
      lesson:
        'Même ODD, compétences différentes : la compétence dépend de ce que les étudiant·es apprennent et font. Il n’existe pas de correspondance fixe ODD ↔ GreenComp.'
    },
    myth: {
      title: 'Vrai ou faux ?',
      short: 'Idées reçues',
      statements: [
        {
          text: 'Ajouter des logos ODD à mon syllabus suffit à en faire un cours d’EDD.',
          feedback:
            'Faux. Associer un ODD à un cours ne change pas ce que les étudiant·es apprennent. L’éducation au développement durable (EDD) porte sur ce qu’elle les rend capables de comprendre et de faire.'
        },
        {
          text: 'Un cours devrait développer les 12 compétences du GreenComp.',
          feedback:
            'Faux. Le GreenComp n’est pas prescriptif : un cours peut se concentrer sur les quelques compétences qui lui correspondent.',
          cite: [{ src: 'greencomp', loc: 'p. 15, 30' }]
        },
        {
          text: 'Les ODD et le GreenComp peuvent être utilisés ensemble.',
          feedback:
            'Vrai. Les ODD aident à cadrer l’enjeu, et le GreenComp aide à cadrer ce que les étudiant·es développent en y travaillant.'
        }
      ]
    }
  }
};
