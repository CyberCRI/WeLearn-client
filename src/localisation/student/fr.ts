// adaptation of en.ts (the source language for student texts)
export const student = {
  bar: {
    title: 'Espace apprenant·e'
  },
  home: {
    title: 'Par où voulez-vous commencer ?',
    intro:
      'Explorez la durabilité, suivez votre curiosité et construisez votre propre compréhension avec WeLearn.',
    getStarted: 'Commencer'
  },
  ask: {
    openSpace: 'Ouvrir {space}',
    title: 'Demandez à WeLearn',
    greeting:
      'Bonjour, je suis WeLearn. Je suis là pour vous aider à explorer la durabilité et à trouver ce qui compte pour vous. Qu’est-ce qui vous amène aujourd’hui ?',
    session:
      'Cette conversation reste seulement dans cet onglet : elle n’est pas enregistrée dans un compte, et disparaît quand vous fermez l’onglet.',
    newConversation: 'Nouvelle conversation'
  },
  starts: {
    exploring: 'Je découvre',
    question: 'J’ai une question',
    working: 'Je travaille sur quelque chose'
  },
  start: {
    placeholder: 'Écrivez votre réponse…'
  },
  space: {
    back: 'Retour à l’espace apprenant·e'
  },
  spaces: {
    understand: {
      name: 'Comprendre',
      title: 'Donner du sens à la durabilité',
      description:
        'Comprendre les notions de durabilité et leurs liens avec le monde qui vous entoure.'
    },
    investigate: {
      name: 'Enquêter',
      title: 'Examiner les preuves et les points de vue',
      description:
        'Examiner des questions, comparer des sources fiables et construire vos propres conclusions.'
    },
    envision: {
      name: 'Envisager',
      title: 'Explorer des futurs possibles',
      description: 'Envisager d’autres futurs, leurs incertitudes et leurs conséquences.'
    },
    apply: {
      name: 'Appliquer',
      title: 'Développer vos propres idées',
      description:
        'Utiliser ce que vous avez appris pour explorer un projet, une question ou un défi concret.'
    }
  },
  thread: {
    title: 'Votre fil d’apprentissage',
    topic: 'Sujet',
    purpose: 'Intention',
    none: 'Pas encore de sujet : commencez une conversation ou saisissez-le ici.',
    topicPlaceholder: 'Sur quoi apprenez-vous ?',
    sources: 'Sources gardées',
    notes: 'Vos notes',
    removeNote: 'Retirer',
    startOver: 'Recommencer',
    session:
      'Gardé seulement dans cet onglet, pour donner du contexte à WeLearn : rien n’est enregistré dans un compte, et tout disparaît quand vous fermez l’onglet ou recommencez.'
  },
  tutor: {
    searching: 'Recherche de sources pertinentes…',
    title: 'Tuteur WeLearn',
    placeholder: 'Demandez, répondez ou réfléchissez à voix haute…',
    send: 'Envoyer',
    thinking: 'WeLearn réfléchit…',
    hint: 'Un indice',
    direct: 'Expliquez-moi directement',
    usedDocs: 'Documents WeLearn cités',
    unavailable: 'L’IA de WeLearn ne répond pas pour le moment. Réessayez dans un instant.',
    error: 'WeLearn n’a pas pu donner de réponse exploitable cette fois. Reformulez ou réessayez.',
    saveNote: 'Garder dans mes notes',
    saved: 'Gardé'
  },
  understand: {
    conceptLabel: 'Quelle notion voulez-vous comprendre ?',
    conceptPlaceholder: 'par exemple : empreinte carbone, biodiversité, transition juste…',
    explain: 'Expliquer',
    another: 'Une autre explication',
    example: 'Un exemple',
    deeper: 'Aller plus loin',
    connections: 'Voir les liens',
    checkTitle: 'Vérifier ma compréhension',
    checkPlaceholder: 'Expliquez-la avec vos mots…',
    check: 'Avoir un retour'
  },
  investigate: {
    questionLabel: 'Quelle question ou affirmation voulez-vous examiner ?',
    placeholder: 'par exemple : la croissance économique améliore-t-elle toujours le bien-être ?',
    find: 'Chercher des preuves',
    searching: 'Recherche dans les sources de WeLearn…',
    reading: 'Lecture de ce que dit vraiment chaque source…',
    none: 'WeLearn n’a trouvé aucune source qui traite directement de cette question. Essayez une question plus précise ou formulée autrement.',
    scope:
      'WeLearn lit le passage renvoyé par la recherche et le résumé, pas le texte intégral. Ouvrez chaque source pour la vérifier.',
    excerpt: 'Extrait vérifié',
    abstract: 'D’après le résumé seulement',
    kinds: {
      evidence: 'Preuve',
      argument: 'Argument',
      background: 'Contexte'
    },
    positions: {
      supports: 'Appuie',
      challenges: 'Contredit',
      nuances: 'Nuance',
      context: 'Contexte'
    },
    limits: 'Limites',
    keep: 'Garder dans mon fil',
    kept: 'Gardée',
    setAside: 'Sources écartées car elles ne traitent pas de cette question : {count}.',
    interpret: 'M’aider à interpréter les preuves',
    compare: 'Comparer les sources gardées',
    conclusionTitle: 'Votre conclusion',
    conclusionPlaceholder:
      'Que concluez-vous à partir de ces sources ? Qu’est-ce qui reste incertain ?',
    conclusion: 'Avoir un retour sur ma conclusion'
  },
  envision: {
    questionLabel: 'Quelle question d’avenir voulez-vous explorer ?',
    placeholder:
      'par exemple : comment les villes pourraient-elles faire face aux fortes chaleurs en 2050 ?',
    develop: 'Développer des scénarios',
    thinking: 'Préparation de quelques scénarios contrastés…',
    notForecast:
      'Ce sont des scénarios imaginés pour raisonner sur le changement et l’incertitude, pas des prévisions.',
    fields: {
      assumptions: 'Hypothèses',
      drivers: 'Moteurs de changement',
      environment: 'Conséquences environnementales',
      society: 'Conséquences sociales',
      benefits: 'Qui pourrait y gagner',
      difficulties: 'Qui pourrait être en difficulté',
      uncertainties: 'Incertitudes',
      plausibility: 'Plus ou moins plausible si…'
    },
    compare: 'M’aider à comparer ces futurs',
    assumptions: 'Examiner les hypothèses',
    myScenarioTitle: 'Votre propre scénario ou comparaison',
    myScenarioPlaceholder: 'Décrivez un futur qui vous semble plausible, ou comparez-en deux…',
    scenario: 'Avoir un retour'
  },
  apply: {
    ownership:
      'WeLearn vous aide à y réfléchir et à améliorer votre travail ; il ne l’écrit pas à votre place.',
    goalLabel: 'Sur quoi travaillez-vous, et que voulez-vous accomplir ?',
    goalPlaceholder:
      'par exemple : réduire le gaspillage alimentaire dans mon quartier, un rapport pour mon travail, un devoir…',
    draftLabel: 'Vos idées ou votre brouillon (facultatif)',
    draftPlaceholder: 'Collez ou écrivez ce que vous avez déjà…',
    clarify: 'Clarifier mon objectif',
    evidence: 'Que me reste-t-il à savoir ?',
    options: 'Options, contraintes et parties prenantes',
    feedback: 'Un retour sur mon brouillon'
  }
};
