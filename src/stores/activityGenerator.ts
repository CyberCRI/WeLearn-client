import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Document } from '@/types';
import i18n from '@/localisation/i18n';

export type ActivityType =
  | 'debate'
  | 'case_study'
  | 'role_play'
  | 'think_pair_share'
  | 'jigsaw'
  | 'project_based'
  | 'flipped';
export type ClassLevel = 'secondary' | 'undergraduate' | 'graduate';
export type StudentCount = 'small' | 'medium' | 'large' | 'xlarge';
export type ActivityDuration = '30min' | '1h' | '2h' | '3h';

const LEVEL_LABELS: Record<ClassLevel, string> = {
  secondary: 'Secondary (high school)',
  undergraduate: 'Undergraduate',
  graduate: "Graduate (master's / PhD)"
};

const DURATION_LABELS: Record<ActivityDuration, string> = {
  '30min': '30 minutes',
  '1h': '1 hour',
  '2h': '2 hours',
  '3h': '3 hours'
};

const STUDENT_LABELS: Record<StudentCount, string> = {
  small: '≤10 students',
  medium: '11–25 students',
  large: '26–40 students',
  xlarge: '40+ students'
};

const MOCK_SOURCES: Document[] = [
  {
    id: 'act-mock-1',
    score: 0.91,
    payload: {
      document_id: 'act-mock-1',
      document_corpus: 'ipcc',
      document_title: 'Climate Change 2023: Synthesis Report — Summary for Policymakers',
      document_desc:
        'The IPCC Sixth Assessment Cycle Synthesis Report integrates findings on climate science, impacts, adaptation and mitigation pathways.',
      document_url: 'https://www.ipcc.ch/report/ar6/syr/',
      document_sdg: [13, 7, 11],
      document_details: { authors: [], publisher: 'IPCC' },
      slice_content: '',
      slice_sdg: 13,
      document_lang: 'en',
      document_scrape_date: '2023-03-20'
    }
  },
  {
    id: 'act-mock-2',
    score: 0.87,
    payload: {
      document_id: 'act-mock-2',
      document_corpus: 'unesdoc',
      document_title: 'Education for Sustainable Development Goals: Learning Objectives',
      document_desc:
        'UNESCO report outlining key competencies for education in support of the SDGs, with a focus on sustainability and systems thinking.',
      document_url: 'https://unesdoc.unesco.org/ark:/48223/pf0000247444',
      document_sdg: [4, 13, 17],
      document_details: { authors: [], publisher: 'UNESCO' },
      slice_content: '',
      slice_sdg: 4,
      document_lang: 'en',
      document_scrape_date: '2022-09-01'
    }
  },
  {
    id: 'act-mock-3',
    score: 0.83,
    payload: {
      document_id: 'act-mock-3',
      document_corpus: 'hal',
      document_title:
        'Active Learning and Sustainability: Pedagogical Approaches in Higher Education',
      document_desc:
        'This paper reviews active learning strategies for sustainability education, examining effectiveness across disciplines and educational levels.',
      document_url: 'https://hal.science',
      document_sdg: [4, 17],
      document_details: {
        authors: [{ name: 'Martin, F.' }, { name: 'Dupont, L.' }],
        journal: 'Journal of Sustainability Education'
      },
      slice_content: '',
      slice_sdg: 4,
      document_lang: 'en',
      document_scrape_date: '2023-06-15'
    }
  }
];

function getMockContent(
  subject: string,
  activityType: ActivityType,
  level: ClassLevel,
  students: StudentCount,
  duration: ActivityDuration
): string {
  const lvl = LEVEL_LABELS[level];
  const dur = DURATION_LABELS[duration];
  const stu = STUDENT_LABELS[students];

  if (activityType === 'debate') {
    return `## Structured Debate: ${subject}

**Format:** Structured Debate  |  **Level:** ${lvl}  |  **Duration:** ${dur}  |  **Students:** ${stu}

### Overview

Students debate two opposing positions on a key dimension of **${subject}**, developing argumentation and critical thinking skills while drawing on verified SDG-aligned sources from the WeLearn database.

### Learning Objectives

- Construct and defend evidence-based arguments on contested sustainability questions
- Critically evaluate sources and identify the assumptions behind competing claims
- Practice active listening, structured rebuttal, and perspective-taking

### Materials Needed

- Role cards defining each team's position (distributed one week in advance)
- Timer visible to all participants
- Whiteboard or shared digital document for capturing key arguments

### Steps

**Preparation (before class)**
Divide students into two groups and assign positions. Share the WeLearn sources listed below as preparation reading. Ask students to identify at least two specific data points to support their argument.

**1. Opening statements — 10 min**
Each team presents their opening argument (4–5 min per team). Encourage students to cite specific evidence from their preparation reading.

**2. First rebuttal — 10 min**
Teams respond directly to the opposing team's claims. The instructor moderates to ensure equal speaking time.

**3. Cross-examination — 10 min**
Each team poses 2–3 prepared questions. Students who are not actively debating observe and take notes on the quality of arguments and evidence.

**4. Second rebuttal — 5 min**
A shorter second round focused on the most contested points.

**5. Closing statements — 5 min**
Each team summarises their three strongest points in 2 minutes.

**6. Debrief — 15 min**
Open discussion with the full class: which arguments were most compelling? What evidence was most persuasive? How did the exercise change anyone's thinking?

### Debrief Questions

1. Which position was hardest to argue, and why?
2. What underlying assumptions shape each side of the debate?
3. How does the issue you debated connect to one or more of the 17 SDGs?
4. What would a solution that draws on both positions look like?

### Teacher Notes

Assigning students to positions *opposite* to their stated views builds analytical flexibility and empathy. Protect the debrief time even if earlier stages run over — it is the most pedagogically valuable part of the activity.`;
  }

  if (activityType === 'case_study') {
    return `## Case Study Analysis: ${subject}

**Format:** Case Study  |  **Level:** ${lvl}  |  **Duration:** ${dur}  |  **Students:** ${stu}

### Overview

Students analyse a real-world case connecting **${subject}** to sustainable development, working in small groups to identify key stakeholders, trade-offs, and SDG-aligned responses.

### Learning Objectives

- Apply theoretical knowledge of ${subject} to a concrete, ambiguous real-world scenario
- Identify connections between discipline-specific issues and the SDGs
- Develop collaborative analysis, synthesis, and decision-making skills

### Materials Needed

- Case study document (1–2 pages) distributed in advance
- Stakeholder mapping or SWOT analysis framework handout
- WeLearn sources for background research (see below)

### Steps

**1. Case introduction — 10 min**
Present the scenario: who are the key actors, what is the central tension, and what decision needs to be made? Avoid revealing your own interpretation at this stage.

**2. Small group analysis — 20 min**
Groups of 4–5 students analyse the case using the provided framework, drawing on the WeLearn sources as evidence. Each group should identify: the core problem, affected stakeholders, SDG linkages, and at least two possible courses of action.

**3. Group presentations — 15 min**
Each group presents their findings in 2–3 minutes. Capture points of agreement and divergence on the board.

**4. Full-class synthesis — 10 min**
Guided discussion: what patterns emerged across groups? Where did analyses diverge, and why? What additional information would change the analysis?

**5. Debrief — 10 min**
Discuss what a truly sustainable solution would require — technically, politically, and socially.

### Debrief Questions

1. Which stakeholder perspectives were most difficult to reconcile?
2. What information would you need to make a better-informed recommendation?
3. How does this case illustrate trade-offs between different SDGs?
4. What aspects of this case apply to your own institutional or professional context?

### Teacher Notes

Choose a case with genuine ambiguity — there should be no single "correct" answer. Locally relevant cases (from students' own country, institution, or sector) generate stronger engagement. Avoid cases where the right answer is obvious.`;
  }

  if (activityType === 'role_play') {
    return `## Role Play: Stakeholder Simulation — ${subject}

**Format:** Role Play  |  **Level:** ${lvl}  |  **Duration:** ${dur}  |  **Students:** ${stu}

### Overview

Students embody different stakeholders in a scenario related to **${subject}**, negotiating competing interests and values. This format builds empathy, communication skills, and understanding of the systemic complexity underlying sustainability challenges.

### Learning Objectives

- Understand and articulate perspectives different from one's own on sustainability issues
- Navigate competing interests and values in a structured negotiation context
- Connect stakeholder dynamics to SDG trade-offs and policy complexity

### Materials Needed

- Stakeholder role cards (one per student or pair)
- Scenario briefing document
- Negotiation record sheet for tracking agreements and disagreements
- WeLearn sources for each stakeholder's background reading (see below)

### Steps

**1. Briefing and role assignment — 10 min**
Distribute role cards. Each student (or pair) reads their stakeholder profile, including their interests, constraints, and position on the central issue. Allow time for questions before the simulation begins.

**2. Opening positions — 10 min**
Each stakeholder group presents their position in 1–2 minutes. No interruptions during this phase.

**3. Negotiation rounds — 20–25 min**
Facilitated negotiation in which stakeholders try to build coalitions and reach a workable agreement. Inject new information or constraints if negotiation stalls.

**4. Agreement or impasse — 5 min**
Groups report whether they reached an agreement, a partial agreement, or an impasse, and briefly explain why.

**5. Step out and debrief — 15 min**
Students "step out" of their roles. Open discussion about what it felt like to argue for their assigned position, and what the exercise reveals about the real-world challenge.

### Debrief Questions

1. Whose interests were easiest and hardest to represent? Why?
2. What compromises were most difficult to make?
3. How realistic was the outcome compared to similar real-world situations?
4. How could the SDGs serve as a shared framework for stakeholders with competing interests?

### Teacher Notes

Role play works best when students are assigned roles *different* from their own background or stated opinions. Brief students thoroughly — role cards that are too vague produce shallow performances. Leave ample time for the debrief so students can process their experience.`;
  }

  if (activityType === 'think_pair_share') {
    return `## Think-Pair-Share: ${subject}

**Format:** Think-Pair-Share  |  **Level:** ${lvl}  |  **Duration:** ${dur}  |  **Students:** ${stu}

### Overview

A structured, low-overhead active learning sequence that encourages individual reflection, peer dialogue, and whole-class synthesis around a key question in **${subject}**. Ideal for introducing a concept, surfacing misconceptions, or deepening understanding of a complex topic.

### Learning Objectives

- Activate and articulate prior knowledge and intuitions about ${subject}
- Test and refine understanding through structured peer dialogue
- Contribute to collaborative knowledge construction

### Materials Needed

- Central question(s) displayed on screen or printed
- Timer
- Optional: shared digital document or sticky notes for capturing ideas

### Steps

**1. Introduce the question — 5 min**
Present a single, rich question related to ${subject} and the SDGs. Clarify the task, but avoid framing one response as correct.

**2. Think (individual) — 5–7 min**
Students write down their initial thoughts individually. Encourage them to draw on any relevant knowledge, including the WeLearn sources provided in advance.

**3. Pair — 10 min**
Students discuss in pairs (or groups of 3). The goal is not necessarily to agree but to surface points of convergence and divergence. Each pair should be ready to share one key insight.

**4. Share — 15–20 min**
Pairs share their key insights with the class. Capture patterns, surprising responses, and productive tensions on the board.

**5. Synthesis — 10 min**
Instructor-led synthesis: what did the class collectively produce that no individual could have generated alone? How does this connect to current SDG knowledge and challenges?

### Debrief Questions

1. What surprised you about your partner's perspective?
2. What would it take to resolve the remaining points of disagreement?
3. How has your initial view changed or deepened through the discussion?

### Teacher Notes

The quality of the central question determines the quality of the activity. Avoid questions with a single correct answer. Strong questions are open-ended, genuinely contested, or involve values as well as facts. Consider running 2–3 shorter TPS sequences rather than one long one.`;
  }

  // Generic fallback for jigsaw, project_based, flipped
  const typeLabel = {
    jigsaw: 'Jigsaw',
    project_based: 'Project-Based Learning',
    flipped: 'Flipped Classroom'
  }[activityType as 'jigsaw' | 'project_based' | 'flipped'];

  return `## ${typeLabel}: ${subject}

**Format:** ${typeLabel}  |  **Level:** ${lvl}  |  **Duration:** ${dur}  |  **Students:** ${stu}

### Overview

Students engage with **${subject}** through a ${typeLabel?.toLowerCase()} format, developing both content knowledge and sustainability-oriented competencies, supported by verified resources from the WeLearn database.

### Learning Objectives

- Deepen understanding of ${subject} through active, collaborative engagement
- Connect course content to one or more of the 17 Sustainable Development Goals
- Develop communication, research, and critical thinking skills

### Materials Needed

- Activity briefing sheet for each student
- WeLearn source list (see below)
- Timer and visible agenda

### Steps

**1. Introduction and context — 10 min**
Frame the activity and its connection to ${subject} and the SDGs. Clarify roles, timeline, and expected output.

**2. Research and preparation — 20 min**
Students explore the WeLearn sources provided and gather relevant evidence or examples for their assigned task.

**3. Collaborative work — 20 min**
Students work in small groups to synthesise their research and develop a response, solution, or product as specified in the activity brief.

**4. Presentation and discussion — 15 min**
Groups share their outputs. The class identifies common themes, complementary findings, and unresolved questions.

**5. Debrief — 10 min**
Reflection on both content learned and the process: what worked, what was challenging, and what SDG connections emerged.

### Debrief Questions

1. What was the most significant insight you gained from the WeLearn sources?
2. How does your work in this activity connect to one or more of the SDGs?
3. What questions remain open that you'd like to explore further?

### Teacher Notes

This activity is designed to be adapted to your specific context. Adjust the timing of each step to fit your class format and the depth of the topic.`;
}

function getMockContentFr(
  subject: string,
  activityType: ActivityType,
  level: ClassLevel,
  students: StudentCount,
  duration: ActivityDuration
): string {
  const lvl = { secondary: 'Secondaire', undergraduate: 'Licence', graduate: 'Master / Doctorat' }[
    level
  ];
  const dur = { '30min': '30 minutes', '1h': '1 heure', '2h': '2 heures', '3h': '3 heures' }[
    duration
  ];
  const stu = {
    small: '≤10 étudiant·es',
    medium: '11–25 étudiant·es',
    large: '26–40 étudiant·es',
    xlarge: '40+ étudiant·es'
  }[students];

  if (activityType === 'debate') {
    return `## Débat structuré : ${subject}

**Format :** Débat structuré  |  **Niveau :** ${lvl}  |  **Durée :** ${dur}  |  **Effectif :** ${stu}

### Vue d'ensemble

Les étudiant·es défendent deux positions opposées sur un enjeu clé lié à **${subject}**, en développant des compétences d'argumentation et de pensée critique à partir de ressources vérifiées alignées sur les ODD.

### Objectifs pédagogiques

- Construire et défendre des arguments fondés sur des sources dans le cadre d'un débat sur la durabilité
- Évaluer de manière critique les sources et identifier les hypothèses sous-jacentes aux positions adverses
- Pratiquer l'écoute active, la réfutation structurée et la prise de perspective

### Matériel nécessaire

- Fiches de rôle définissant la position de chaque équipe (distribuées une semaine à l'avance)
- Minuteur visible de tou·tes les participant·es
- Tableau ou document partagé pour noter les arguments clés

### Déroulé

**Préparation (avant le cours)**
Diviser les étudiant·es en deux groupes et leur attribuer une position. Partager les ressources WeLearn listées ci-dessous en lecture préparatoire. Demander à chaque étudiant·e d'identifier au moins deux données concrètes pour étayer son argument.

**1. Discours d'ouverture — 10 min**
Chaque équipe présente son argument introductif (4–5 min par équipe). Encourager les références à des données précises issues de la lecture préparatoire.

**2. Première réfutation — 10 min**
Les équipes répondent directement aux arguments de l'équipe adverse. L'enseignant·e modère et veille à l'équité du temps de parole.

**3. Questions croisées — 10 min**
Chaque équipe pose 2–3 questions préparées. Les étudiant·es qui n'interviennent pas observent et prennent des notes sur la qualité des arguments et des preuves avancées.

**4. Deuxième réfutation — 5 min**
Un second tour plus court, centré sur les points les plus controversés.

**5. Discours de clôture — 5 min**
Chaque équipe résume ses trois arguments les plus solides en 2 minutes.

**6. Bilan — 15 min**
Discussion ouverte avec l'ensemble de la classe : quels arguments ont été les plus convaincants ? Quelles preuves ont été les plus persuasives ? Le débat a-t-il fait évoluer certaines positions ?

### Questions de bilan

1. Quelle position a été la plus difficile à défendre, et pourquoi ?
2. Quelles hypothèses sous-tendent chaque camp du débat ?
3. Comment la question débattue s'articule-t-elle avec un ou plusieurs ODD ?
4. À quoi ressemblerait une solution qui s'appuierait sur les deux positions ?

### Notes pour l'enseignant·e

Attribuer aux étudiant·es des positions *contraires* à leurs opinions déclarées développe la flexibilité analytique et l'empathie. Préserver le temps de bilan même si les étapes précédentes débordent — c'est la phase pédagogiquement la plus précieuse de l'activité.`;
  }

  if (activityType === 'case_study') {
    return `## Étude de cas : ${subject}

**Format :** Étude de cas  |  **Niveau :** ${lvl}  |  **Durée :** ${dur}  |  **Effectif :** ${stu}

### Vue d'ensemble

Les étudiant·es analysent un cas réel mettant en lien **${subject}** et le développement durable, en travaillant en petits groupes pour identifier les parties prenantes, les compromis et les réponses alignées sur les ODD.

### Objectifs pédagogiques

- Appliquer des connaissances théoriques sur ${subject} à un scénario réel et ambigu
- Identifier les liens entre les enjeux disciplinaires et les ODD
- Développer des compétences d'analyse collaborative, de synthèse et de prise de décision

### Matériel nécessaire

- Document de cas (1–2 pages) distribué à l'avance
- Fiche méthode : cartographie des parties prenantes ou analyse SWOT
- Ressources WeLearn pour la recherche documentaire (voir ci-dessous)

### Déroulé

**1. Introduction au cas — 10 min**
Présenter le scénario : qui sont les acteurs clés, quelle est la tension centrale, quelle décision doit être prise ? Éviter de livrer sa propre interprétation à ce stade.

**2. Analyse en petits groupes — 20 min**
Des groupes de 4–5 étudiant·es analysent le cas à l'aide de la fiche méthode, en s'appuyant sur les ressources WeLearn. Chaque groupe identifie : le problème central, les parties prenantes concernées, les liens avec les ODD et au moins deux pistes d'action.

**3. Présentations des groupes — 15 min**
Chaque groupe présente ses conclusions en 2–3 minutes. Noter les points de convergence et de divergence au tableau.

**4. Synthèse collective — 10 min**
Discussion guidée : quels schémas ont émergé entre les groupes ? Où les analyses ont-elles divergé, et pourquoi ? Quelles informations supplémentaires changeraient l'analyse ?

**5. Bilan — 10 min**
Discuter de ce qu'impliquerait une solution véritablement durable — sur le plan technique, politique et social.

### Questions de bilan

1. Quels points de vue de parties prenantes ont été les plus difficiles à concilier ?
2. Quelles informations vous manqueraient pour formuler une recommandation plus éclairée ?
3. Comment ce cas illustre-t-il les compromis entre différents ODD ?
4. Quels aspects de ce cas s'appliquent à votre propre contexte institutionnel ou professionnel ?

### Notes pour l'enseignant·e

Choisir un cas avec une vraie ambiguïté — il ne doit pas exister de réponse unique correcte. Les cas localement pertinents génèrent un engagement plus fort. Éviter les cas où la réponse correcte est évidente.`;
  }

  if (activityType === 'role_play') {
    return `## Jeu de rôle : Simulation de parties prenantes — ${subject}

**Format :** Jeu de rôle  |  **Niveau :** ${lvl}  |  **Durée :** ${dur}  |  **Effectif :** ${stu}

### Vue d'ensemble

Les étudiant·es incarnent différentes parties prenantes dans un scénario lié à **${subject}**, en négociant des intérêts et des valeurs en tension. Ce format développe l'empathie, les compétences en communication et la compréhension de la complexité systémique des défis de durabilité.

### Objectifs pédagogiques

- Comprendre et exprimer des points de vue différents du sien sur des enjeux de durabilité
- Naviguer entre des intérêts et des valeurs concurrents dans un contexte de négociation structurée
- Relier les dynamiques entre parties prenantes aux compromis entre ODD et à la complexité des politiques publiques

### Matériel nécessaire

- Fiches de rôle pour chaque partie prenante (une par étudiant·e ou par binôme)
- Document de contexte du scénario
- Feuille de suivi de négociation (accords et désaccords)
- Ressources WeLearn pour la lecture préparatoire de chaque rôle (voir ci-dessous)

### Déroulé

**1. Briefing et attribution des rôles — 10 min**
Distribuer les fiches de rôle. Chaque étudiant·e lit le profil de sa partie prenante : ses intérêts, ses contraintes et sa position sur l'enjeu central. Laisser du temps pour les questions avant de commencer.

**2. Positions d'ouverture — 10 min**
Chaque groupe de parties prenantes présente sa position en 1–2 minutes. Pas d'interruption pendant cette phase.

**3. Tours de négociation — 20–25 min**
Négociation facilitée dans laquelle les parties prenantes cherchent à former des coalitions et à parvenir à un accord viable. Injecter de nouvelles informations ou contraintes si la négociation s'enlise.

**4. Accord ou impasse — 5 min**
Les groupes indiquent s'ils ont abouti à un accord, un accord partiel ou une impasse, et expliquent brièvement pourquoi.

**5. Sortie du rôle et bilan — 15 min**
Les étudiant·es « sortent » de leurs rôles. Discussion ouverte sur ce qu'il a été ressorti d'avoir défendu la position assignée, et sur ce que l'exercice révèle du défi réel.

### Questions de bilan

1. Quels intérêts ont été les plus faciles et les plus difficiles à représenter ? Pourquoi ?
2. Quels compromis ont été les plus difficiles à accepter ?
3. À quel point le résultat était-il réaliste par rapport à des situations similaires dans la réalité ?
4. Comment les ODD pourraient-ils servir de cadre commun à des parties prenantes aux intérêts divergents ?

### Notes pour l'enseignant·e

Le jeu de rôle fonctionne mieux lorsque les étudiant·es se voient attribuer des rôles *différents* de leur propre milieu ou de leurs opinions déclarées. Briefer soigneusement les étudiant·es — des fiches de rôle trop vagues produisent des performances superficielles. Laisser suffisamment de temps pour le bilan.`;
  }

  if (activityType === 'think_pair_share') {
    return `## Think-Pair-Share : ${subject}

**Format :** Think-Pair-Share  |  **Niveau :** ${lvl}  |  **Durée :** ${dur}  |  **Effectif :** ${stu}

### Vue d'ensemble

Une séquence d'apprentissage actif structurée et peu contraignante qui favorise la réflexion individuelle, le dialogue entre pairs et la synthèse collective autour d'une question clé liée à **${subject}**. Idéale pour introduire un concept, faire émerger des représentations ou approfondir la compréhension d'un sujet complexe.

### Objectifs pédagogiques

- Activer et formuler ses connaissances et intuitions préalables sur ${subject}
- Tester et affiner sa compréhension par un dialogue structuré avec ses pairs
- Contribuer à la construction collective du savoir

### Matériel nécessaire

- Question(s) centrale(s) affichée(s) à l'écran ou imprimée(s)
- Minuteur
- Optionnel : document partagé ou post-its pour collecter les idées

### Déroulé

**1. Présentation de la question — 5 min**
Soumettre une question riche en lien avec ${subject} et les ODD. Clarifier la consigne sans orienter vers une réponse correcte.

**2. Think (individuel) — 5–7 min**
Les étudiant·es notent leurs réflexions individuellement, en mobilisant leurs connaissances et les ressources WeLearn fournies en amont.

**3. Pair — 10 min**
Discussion en binôme (ou en groupe de 3). L'objectif n'est pas nécessairement de s'accorder, mais de faire émerger points de convergence et de divergence. Chaque binôme doit être prêt à partager une idée clé.

**4. Share — 15–20 min**
Les binômes partagent leurs idées avec la classe. Repérer les récurrences, les réponses inattendues et les tensions productives au tableau.

**5. Synthèse — 10 min**
Synthèse guidée : qu'a produit collectivement la classe qu'aucun individu n'aurait pu générer seul·e ? Comment cela s'articule-t-il avec les connaissances actuelles sur les ODD ?

### Questions de bilan

1. Qu'est-ce qui vous a surpris·e dans la perspective de votre partenaire ?
2. Que faudrait-il pour résoudre les points de désaccord persistants ?
3. Comment votre point de vue initial a-t-il évolué au fil de la discussion ?

### Notes pour l'enseignant·e

La qualité de la question centrale détermine la qualité de l'activité. Éviter les questions à réponse unique. Les meilleures questions sont ouvertes, véritablement contestées, ou mêlent valeurs et faits. Envisager 2–3 séquences TPS courtes plutôt qu'une seule longue si le créneau le permet.`;
  }

  const typeLabel = {
    jigsaw: 'Jigsaw',
    project_based: 'Apprentissage par projet',
    flipped: 'Classe inversée'
  }[activityType as 'jigsaw' | 'project_based' | 'flipped'];

  return `## ${typeLabel} : ${subject}

**Format :** ${typeLabel}  |  **Niveau :** ${lvl}  |  **Durée :** ${dur}  |  **Effectif :** ${stu}

### Vue d'ensemble

Les étudiant·es abordent **${subject}** dans un format ${typeLabel?.toLowerCase()}, en développant des connaissances disciplinaires et des compétences orientées vers la durabilité, avec l'appui de ressources vérifiées issues de la base WeLearn.

### Objectifs pédagogiques

- Approfondir la compréhension de ${subject} par une démarche active et collaborative
- Relier le contenu du cours à un ou plusieurs Objectifs de développement durable
- Développer des compétences en communication, en recherche et en pensée critique

### Matériel nécessaire

- Fiche descriptive de l'activité pour chaque étudiant·e
- Liste de ressources WeLearn (voir ci-dessous)
- Minuteur et ordre du jour visible

### Déroulé

**1. Introduction et mise en contexte — 10 min**
Présenter l'activité et son lien avec ${subject} et les ODD. Clarifier les rôles, le calendrier et le livrable attendu.

**2. Recherche et préparation — 20 min**
Les étudiant·es explorent les ressources WeLearn fournies et collectent des exemples ou des preuves pertinents pour leur tâche.

**3. Travail collaboratif — 20 min**
Les étudiant·es travaillent en petits groupes pour synthétiser leurs recherches et produire une réponse ou un livrable selon la description de l'activité.

**4. Présentation et discussion — 15 min**
Les groupes présentent leurs travaux. La classe identifie les thèmes communs, les apports complémentaires et les questions non résolues.

**5. Bilan — 10 min**
Réflexion sur les apprentissages et sur le processus : ce qui a bien fonctionné, ce qui a été difficile et les liens avec les ODD qui ont émergé.

### Questions de bilan

1. Quel enseignement tiré des ressources WeLearn vous a le plus marqué·e ?
2. Comment votre travail dans cette activité s'articule-t-il avec un ou plusieurs ODD ?
3. Quelles questions restent ouvertes et mériteraient d'être approfondies ?

### Notes pour l'enseignant·e

Ce modèle est conçu pour être adapté à votre contexte. Ajustez la durée de chaque étape en fonction de votre format de cours et de la profondeur souhaitée sur le sujet.`;
}

export const useActivityStore = defineStore('activity', () => {
  const subject = ref('');
  const level = ref<ClassLevel>('undergraduate');
  const activityType = ref<ActivityType>('debate');
  const studentCount = ref<StudentCount>('medium');
  const duration = ref<ActivityDuration>('1h');

  const isGenerating = ref(false);
  const generatingPhase = ref<1 | 2>(1);
  const hasGenerated = ref(false);
  const displayedContent = ref('');
  const sources = ref<Document[]>([]);

  const canGenerate = computed(() => subject.value.trim().length > 0);

  let _interval: ReturnType<typeof setInterval> | null = null;

  const generate = async () => {
    if (!canGenerate.value || isGenerating.value) return;

    if (_interval) clearInterval(_interval);
    hasGenerated.value = false;
    displayedContent.value = '';
    sources.value = [];
    isGenerating.value = true;
    generatingPhase.value = 1;

    await new Promise((r) => setTimeout(r, 1800));
    generatingPhase.value = 2;

    const isFr = i18n.global.locale.value === 'fr';
    const fullContent = isFr
      ? getMockContentFr(
          subject.value,
          activityType.value,
          level.value,
          studentCount.value,
          duration.value
        )
      : getMockContent(
          subject.value,
          activityType.value,
          level.value,
          studentCount.value,
          duration.value
        );

    let index = 0;
    const chunkSize = 10;

    _interval = setInterval(() => {
      index = Math.min(index + chunkSize, fullContent.length);
      displayedContent.value = fullContent.slice(0, index);

      if (index >= fullContent.length) {
        if (_interval) clearInterval(_interval);
        isGenerating.value = false;
        hasGenerated.value = true;
        sources.value = MOCK_SOURCES;
      }
    }, 20);
  };

  const reset = () => {
    if (_interval) clearInterval(_interval);
    hasGenerated.value = false;
    isGenerating.value = false;
    displayedContent.value = '';
    sources.value = [];
  };

  return {
    subject,
    level,
    activityType,
    studentCount,
    duration,
    isGenerating,
    generatingPhase,
    hasGenerated,
    displayedContent,
    sources,
    canGenerate,
    generate,
    reset
  };
});
