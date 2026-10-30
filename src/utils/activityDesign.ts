import type { Document } from '@/types';
import { normalise, parseJsonObject, type ReadingLanguage } from '@/utils/courseReading';
import {
  MAX_SOURCES,
  asCleanText,
  citedDocuments,
  cleanQuote,
  fill,
  hasLink,
  hasUnsupportedFigure,
  request,
  resourceText,
  withSourceLine,
  type SupportingResource
} from '@/utils/connections';

// "design a learning activity", resource-aware from the start, through the question-answering
// endpoint (/qna/chat/answer):
// 1. search questions for the teaching context (data, a documented case or study, a synthesis);
// 2. the WeLearn documents found are inventoried for what they really contain, and 2-3 activities
//    are suggested from that inventory only (data analysis only with verified data; a study
//    without data -> critical analysis of it; a case -> that case; or a self-contained activity
//    whose scenario WeLearn writes itself);
// 3. the chosen activity, one page, with its verified resources or its own material.
// the code checks what can be checked: an inventoried document has a real link and contains the
// sentence quoted for it; "quantitative" only when that sentence shows values; an idea is dropped
// when it claims data it does not have, or relies on nothing without its own scenario; no figure
// is stated that the resources do not contain; step timings fit the time available; a GreenComp
// competence must name the step that develops it.
// ponytail: a stand-in for dedicated endpoints, like the course design steps

export interface ActivityContext {
  subject: string;
  students: string;
  time: string;
  goal: string;
}

// the internal repertoire of teaching methods: the methods of our GreenComp-related work plus
// three common university methods. a method is named after what students actually do, and some
// have conditions (verified values, a documented case, several sessions, a real partner) checked
// in code below. GreenComp competences are outcomes, not methods
export const APPROACHES = [
  'case_study',
  'systems_mapping',
  'lca_project',
  'critical_analysis',
  'stakeholder_role_play',
  'personal_action_plan',
  'advocacy_campaign',
  'futures_workshop',
  'policy_analysis',
  'reflective_portfolio',
  'community_project',
  'interdisciplinary_project',
  'living_lab',
  'source_analysis',
  'transition_planning',
  'comparative_data_analysis',
  'problem_based_learning',
  'structured_debate'
] as const;
export type ApproachId = (typeof APPROACHES)[number];

const APPROACH_GUIDE: Record<ReadingLanguage, string> = {
  fr: `- case_study (étude de cas) : examiner une situation réelle documentée pour comprendre un problème, interpréter des éléments de preuve, identifier les facteurs en jeu et évaluer des réponses possibles. Seulement avec un cas documenté dans les ressources, ou un cas fictif écrit dans "scenario" et présenté comme tel.
- systems_mapping (cartographie systémique) : représenter visuellement les relations, dépendances et boucles de rétroaction d'un système complexe.
- lca_project (projet d'analyse de cycle de vie) : évaluer des impacts environnementaux sur des étapes du cycle de vie définies, avec unité fonctionnelle, frontières du système et données. Seulement sur plusieurs séances et avec des données vérifiées ; lire ou comparer un article d'ACV n'est PAS un projet d'ACV.
- critical_analysis (analyse critique / déconstruction) : examiner un argument, une politique, un modèle ou une affirmation pour en identifier les preuves, les hypothèses, les valeurs sous-jacentes et les limites.
- stakeholder_role_play (simulation / jeu de rôle des parties prenantes) : représenter différentes parties prenantes, explorer leurs intérêts divergents, négocier ou évaluer des décisions.
- personal_action_plan (plan d'action personnel) : élaborer et examiner de façon critique un plan réaliste de changement de comportement ou de pratique, faisabilité et impact compris. Seulement si c'est pertinent pour les objectifs du cours.
- advocacy_campaign (campagne de plaidoyer) : élaborer une proposition de communication ou de plaidoyer fondée sur des preuves pour un public identifié. Seulement si la communication ou l'engagement citoyen sont réellement visés.
- futures_workshop (atelier de littératie des futurs) : explorer des futurs plausibles alternatifs, questionner les hypothèses, envisager des trajectoires et leurs conséquences.
- policy_analysis (analyse des politiques et de la gouvernance) : étudier comment politiques, réglementations, institutions et rapports de pouvoir influencent les résultats en matière de durabilité.
- reflective_portfolio (pratique réflexive / portfolio) : documenter et examiner de façon critique ses apprentissages, hypothèses, décisions et son évolution dans le temps. Seulement sur plusieurs séances.
- community_project (projet communautaire / action participative) : collaborer avec une communauté réelle ou des acteurs concernés sur un problème défini. Seulement si le contexte mentionne un partenariat réel et plusieurs séances.
- interdisciplinary_project (projet de recherche interdisciplinaire) : intégrer concepts, méthodes ou données de plusieurs disciplines pour étudier une question commune. Seulement sur plusieurs séances.
- living_lab (living lab / co-création) : développer, tester ou affiner des solutions avec des participants concernés dans un contexte réel. Seulement si le contexte mentionne un partenariat réel et plusieurs séances ; un remue-méninges en classe n'est pas un living lab.
- source_analysis (analyse critique des médias et des sources) : évaluer la fiabilité, les preuves, le cadrage, les omissions et les biais possibles de sources d'information.
- transition_planning (planification de la transition socio-écologique) : élaborer ou évaluer une stratégie de transition à l'échelle d'une organisation, d'un territoire ou d'un secteur, en tenant compte des arbitrages, des parties prenantes et de l'incertitude.
- comparative_data_analysis (analyse comparative de données) : interpréter des données chiffrées vérifiées, calculer ou comparer des indicateurs, expliquer les résultats et leurs limites. Seulement avec des valeurs vérifiées dans les ressources.
- problem_based_learning (apprentissage par problème) : étudier un problème défini, identifier les informations nécessaires et construire une réponse argumentée à partir des éléments disponibles.
- structured_debate (débat structuré) : évaluer des positions opposées, étayer ses arguments par des preuves et répondre de façon critique aux alternatives.`,
  en: `- case_study (case study analysis): examine a documented real-world situation to understand a problem, interpret evidence, identify contributing factors and evaluate possible responses. Only with a case documented in the resources, or a fictional case written in "scenario" and presented as such.
- systems_mapping (systems mapping): create a visual representation of relationships, dependencies and feedback loops within a complex system.
- lca_project (life cycle assessment project): assess environmental impacts across defined life-cycle stages, with a functional unit, system boundaries and evidence. Only over several sessions and with verified data; reading or comparing an LCA paper is NOT an LCA project.
- critical_analysis (critical analysis / deconstruction): examine an argument, policy, model or claim to identify its evidence, assumptions, underlying values and limitations.
- stakeholder_role_play (stakeholder simulation / role-play): represent different stakeholders, explore conflicting interests, negotiate or evaluate possible decisions.
- personal_action_plan (personal action plan): develop and critically reflect on a realistic plan for changes in behaviour or practice, considering feasibility and impact. Only where relevant to the course goals.
- advocacy_campaign (advocacy campaign): develop an evidence-based communication or policy-advocacy proposal for an identified audience. Only when communication or civic agency is genuinely aimed at.
- futures_workshop (futures literacy workshop): explore alternative plausible futures, question assumptions, consider pathways and consequences.
- policy_analysis (policy and governance analysis): investigate how policies, regulations, institutions and power relations influence sustainability outcomes.
- reflective_portfolio (reflective practice / portfolio): document and critically examine one's learning, assumptions, decisions and development over time. Only over several sessions.
- community_project (community project / participatory action): collaborate with a real community or relevant actors on a defined problem. Only if the context mentions a real partnership and several sessions.
- interdisciplinary_project (interdisciplinary research project): integrate concepts, methods or evidence from several disciplines to investigate a shared question. Only over several sessions.
- living_lab (living lab / co-creation): develop, test or refine possible solutions with relevant participants in a real context. Only if the context mentions a real partnership and several sessions; a classroom brainstorm is not a living lab.
- source_analysis (critical media / source analysis): evaluate the reliability, evidence, framing, omissions and potential biases of information sources.
- transition_planning (socio-ecological transition planning): develop or assess a transition strategy at organisational, territorial or sectoral level, taking account of trade-offs, stakeholders and uncertainty.
- comparative_data_analysis (comparative data analysis): interpret verified numerical data, calculate or compare indicators, explain the results and their limitations. Only with values verified in the resources.
- problem_based_learning (problem-based learning): investigate a defined problem, identify the information needed and develop a reasoned response from the available evidence.
- structured_debate (structured debate): evaluate opposing positions, support arguments with evidence and respond critically to alternatives.`
};

// methods that need several sessions, and those that need a real partner named by the teacher
const LONG_METHODS: ApproachId[] = [
  'lca_project',
  'reflective_portfolio',
  'community_project',
  'interdisciplinary_project',
  'living_lab'
];
const PARTNER_METHODS: ApproachId[] = ['community_project', 'living_lab'];
const SEVERAL_SESSIONS =
  /([2-9]|\d{2})\s*(séances|sessions|semaines|weeks|cours|ateliers|workshops)|semestre|semester|trimestre|term\b|plusieurs séances|several sessions/i;
const PARTNER =
  /partenaire|partenariat|commanditaire|collectivité|association|habitant|partner|client organi[sz]ation|local authorit|municipalit/i;

// what a document really contains, as inventoried
export const MATERIALS = [
  'data',
  'graph',
  'case',
  'study',
  'concept',
  'teaching',
  'report'
] as const;
export type Material = (typeof MATERIALS)[number];

export interface ActivityResource extends SupportingResource {
  material: Material;
  // values students can work with, seen in the quoted sentence
  isQuantitative: boolean;
  evidence: string;
}

export interface ActivityIdea {
  title: string;
  // null only for the teacher's own idea, until the activity names it
  approach: ApproachId | null;
  studentsDo: string;
  duration: string | null;
  why: string;
  // the verified resources it is built on ([] for a self-contained activity)
  resources: ActivityResource[];
  usesData: boolean;
  // the essential scenario or instructions, written by WeLearn, when no resource is used
  scenario: string | null;
  // described by the teacher rather than proposed by WeLearn
  isTeacherIdea?: boolean;
}

// the twelve GreenComp competences (European Commission, 2022)
export const GREENCOMP = [
  'valuing_sustainability',
  'supporting_fairness',
  'promoting_nature',
  'systems_thinking',
  'critical_thinking',
  'problem_framing',
  'futures_literacy',
  'adaptability',
  'exploratory_thinking',
  'political_agency',
  'collective_action',
  'individual_initiative'
] as const;
export type GreenCompId = (typeof GREENCOMP)[number];

// values copied from one verified document, with what they depend on
export interface DataTable {
  caption: string;
  // headers carry the units, e.g. "Énergie totale (GJ)"
  columns: string[];
  rows: string[][];
  document: Document;
  // functional unit, system boundaries, scope, caveats, as the document states them
  context: string;
  // the publication the document takes these values from, when it is not its own result
  reportedFrom: string | null;
  // same basis for every value: only then is a chart drawn
  isComparable: boolean;
}

export interface ActivitySuggestion {
  title: string;
  approach: ApproachId | null;
  dataTable: DataTable | null;
  objective: string | null;
  format: string | null;
  studentInstructions: string | null;
  // essential material written by WeLearn (a scenario, role cards, guiding questions)
  providedMaterial: string | null;
  preparation: string | null;
  steps: string[];
  studentOutput: string | null;
  check: string | null;
  // what the activity cannot do with the materials it has, said plainly
  limitation: string | null;
  // still asks the teacher to produce data the activity does not have
  assumesMissing: boolean;
  greencomp: { id: GreenCompId; how: string }[];
  documents: Document[];
}

const contextText = (context: ActivityContext, lang: ReadingLanguage) => {
  const fr = lang === 'fr';
  return [
    [fr ? 'Ce qui est enseigné' : 'What is taught', context.subject],
    [fr ? 'Étudiant·e·s' : 'Students', context.students],
    [fr ? 'Temps disponible' : 'Time available', context.time],
    [
      fr
        ? 'Ce que les étudiant·e·s doivent apprendre ou faire'
        : 'What students should learn or do',
      context.goal
    ]
  ]
    .filter(([, value]) => value.trim())
    .map(([label, value]) => `${label} : ${value.trim()}`)
    .join('\n');
};

const contextSource = (context: ActivityContext, lang: ReadingLanguage) => ({
  score: 1,
  payload: {
    document_corpus: 'context',
    document_desc: '',
    document_details: {},
    document_id: crypto.randomUUID(),
    document_lang: lang,
    document_sdg: [],
    document_title: lang === 'fr' ? 'Contexte d’enseignement' : 'Teaching context',
    // ponytail: the endpoint requires a url; this one never resolves and is never shown
    document_url: 'https://example.invalid/context',
    slice_content: contextText(context, lang),
    slice_sdg: null
  }
});

// semantic search matches the words of the question: questions about documents ("a case study
// on...", "where to find...") bring back any text that talks about case studies. the queries
// therefore describe the content itself, and the key concepts let the results be checked
const QUERIES: Record<ReadingLanguage, string> = {
  fr: `Le document fourni (Doc 1) décrit le contexte d'enseignement d'un·e enseignant·e du supérieur. Prépare une recherche dans une base de documents sur la durabilité.

1. "concepts" : les 2 à 4 objets précis nommés par le sujet, qu'un document doit mentionner pour en traiter (par exemple, pour « effets du glyphosate et des néonicotinoïdes sur les pollinisateurs » : glyphosate, néonicotinoïde, pollinisateur). Jamais une notion générale (durabilité, environnement, impact, matériau, bâtiment, émissions) ni un type d'analyse. Chaque concept est un objet distinct, avec sa forme française, sa forme anglaise et ses synonymes courants (un ou deux mots, en minuscules, au singulier) ; "core" : true pour ceux sans lesquels un document ne traite pas du sujet.
2. "period" : si le sujet porte sur une période historique, ses années de début et de fin ; sinon null.
3. "source_types" : les types de sources adaptés à la discipline et à la tâche, parmi academic_scientific_publications, expert_reports, teaching_resources, datasets, science_communication_and_outreach (par exemple des travaux d'historien·ne·s pour l'histoire, des études et données techniques pour l'ingénierie, des rapports d'institutions publiques pour les politiques).
4. "queries" : 3 descriptions du contenu recherché, de 8 à 20 mots chacune, qui nomment ces notions et le type d'information utile au cours (par exemple émissions de CO2, consommation d'énergie, coûts, effets sur la santé, politiques). Pas de question, et aucun mot sur le genre de document (document, étude de cas, ressource, synthèse, où trouver). La 1re en anglais sur le cœur du sujet ; la 2e en anglais, avec une autre formulation ou un aspect précis ; la 3e en français.

Ne réponds qu'avec un objet JSON, sans texte avant ou après, sans balise de code, sans lien :
{"concepts": [{"fr": string, "en": string, "synonyms": string[], "core": boolean}], "period": null | {"from": number, "to": number}, "source_types": string[], "queries": [string, string, string]}`,
  en: `The provided document (Doc 1) describes a university teacher's teaching context. Prepare a search in a database of sustainability documents.

1. "concepts": the 2 to 4 precise objects named by the subject, which a document must mention to address it (for example, for "effects of glyphosate and neonicotinoids on pollinators": glyphosate, neonicotinoid, pollinator). Never a general notion (sustainability, environment, impact, material, building, emissions) nor a kind of analysis. Each concept is a separate object, with its French form, its English form and its common synonyms (one or two words, lower case, singular); "core": true for those without which a document does not address the subject.
2. "period": if the subject is about a historical period, its start and end years; otherwise null.
3. "source_types": the kinds of sources suited to the discipline and the task, among academic_scientific_publications, expert_reports, teaching_resources, datasets, science_communication_and_outreach (for example historians' work for history, technical studies and data for engineering, public institutions' reports for policies).
4. "queries": 3 descriptions of the content sought, 8 to 20 words each, naming these notions and the kind of information useful to the course (for example CO2 emissions, energy use, costs, health effects, policies). No question, and no word about the kind of document (document, case study, resource, review, where to find). The 1st on the core of the subject; the 2nd with another wording or a precise aspect; the 3rd in French.

Answer only with a JSON object, with no text before or after, no code fence and no link:
{"concepts": [{"fr": string, "en": string, "synonyms": string[], "core": boolean}], "period": null | {"from": number, "to": number}, "source_types": string[], "queries": [string, string, string]}`
};

const IDEAS: Record<ReadingLanguage, string> = {
  fr: `Tu aides un·e enseignant·e de l'enseignement supérieur à concevoir une activité d'apprentissage à partir des ressources réellement disponibles.

Contexte :
{context}

Les documents fournis (Doc 1 à Doc {count}) viennent de la base WeLearn ; la première ligne de chacun indique sa source.

1. Inventaire : mets dans "rejected", avec la raison en quelques mots, seulement les documents qui portent sur un autre objet que le sujet (ils n'ont en commun que le thème général, la discipline ou quelques mots). Un document qui traite d'une partie du sujet, d'un autre pays, dans une autre langue, ou sans données reste dans l'inventaire, selon ce qu'il contient. Pour chaque document retenu, indique ce qu'il CONTIENT vraiment dans le texte fourni, pas ce que son titre laisse supposer : des données chiffrées ("data"), un graphique ou tableau ("graph"), un cas documenté ("case"), une étude avec sa méthode et ses résultats ("study"), un contenu conceptuel ("concept"), un support pédagogique ("teaching") ou un rapport ("report"). Recopie mot pour mot une phrase du document qui le montre, dans sa langue d'origine, sans la traduire. "quantitative" : true seulement si cette phrase contient des valeurs que les étudiant·e·s peuvent exploiter.

2. Activités : propose 2 ou 3 activités pédagogiquement solides, adaptées à la discipline, au niveau, à l'objectif et au temps disponible, fondées sur ce que l'inventaire permet réellement :
- une analyse de données seulement si un document "quantitative" fournit des valeurs comparables adaptées à la tâche ;
- une étude sans données comparables : analyse critique de cette étude (question, méthode, résultats, limites) ;
- un cas documenté : étude de ce cas précis ;
- un contenu conceptuel : activité conceptuelle ou de résolution de problème ;
- une activité sans document est possible si tu écris toi-même le scénario ou les consignes essentielles dans "scenario".
Pour chaque activité, choisis la méthode pédagogique de ce répertoire qui décrit exactement ce que font les étudiant·e·s, en respectant ses conditions, et non le terme le plus prestigieux (une analyse d'une heure d'un article d'ACV est critical_analysis ou comparative_data_analysis, pas lca_project ; un exercice court n'est pas un projet). Titre précis, propre à l'activité. Les compétences GreenComp ne sont pas des méthodes :
{approaches}
Ne force pas la variété, n'invente aucune ressource, ne suppose pas qu'un document contient ce que le texte fourni ne montre pas. Scientifiquement juste : ne réduis pas une comparaison à un seul critère quand la discipline en exige plusieurs. Relie à la durabilité seulement quand c'est pertinent.{extra}

Ne réponds qu'avec un objet JSON, sans texte avant ou après, sans balise de code, sans lien :
{"rejected": [{"document": number, "reason": string}], "inventory": [{"document": number, "contains": "data"|"graph"|"case"|"study"|"concept"|"teaching"|"report", "what": string (ce qu'il contient, une phrase), "quantitative": boolean, "evidence": string}], "ideas": [{"title": string (court), "approach": string (un identifiant du répertoire), "students_do": string (une ou deux phrases sur ce que font concrètement les étudiant·e·s), "duration": string, "why": string (pourquoi cette approche sert l'objectif avec ces ressources, une phrase), "documents": number[] (documents de l'inventaire utilisés, [] si aucun), "uses_data": boolean, "scenario": string|null}]}`,
  en: `You help a university teacher design a learning activity from the resources that are really available.

Context:
{context}

The provided documents (Doc 1 to Doc {count}) come from the WeLearn database; the first line of each gives its source.

1. Inventory: put in "rejected", with the reason in a few words, only the documents about another object than the subject (they share only the general theme, the discipline or a few words). A document that addresses part of the subject, another country, is in another language, or has no data stays in the inventory, according to what it contains. For each kept document, state what it REALLY CONTAINS in the provided text, not what its title suggests: figures ("data"), a graph or table ("graph"), a documented case ("case"), a study with its method and results ("study"), conceptual content ("concept"), teaching material ("teaching") or a report ("report"). Copy word for word one sentence of the document that shows it, in its original language, without translating it. "quantitative": true only if that sentence contains values students can work with.

2. Activities: suggest 2 or 3 pedagogically sound activities, suited to the discipline, level, goal and time available, built on what the inventory really allows:
- data analysis only if a "quantitative" document provides comparable values suited to the task;
- a study without comparable data: critical analysis of that study (question, method, results, limitations);
- a documented case: a study of that specific case;
- conceptual content: a conceptual or problem-solving activity;
- an activity without any document is possible if you write the essential scenario or instructions yourself in "scenario".
For each activity, choose the teaching method from this repertoire that describes exactly what students do, respecting its conditions, rather than the most prestigious term (a one-hour analysis of an LCA paper is critical_analysis or comparative_data_analysis, not lca_project; a short exercise is not a project). A specific title, proper to the activity. GreenComp competences are not methods:
{approaches}
Do not force variety, invent no resource, do not assume a document contains what the provided text does not show. Scientifically sound: do not reduce a comparison to one criterion when the discipline requires several. Connect to sustainability only when relevant.{extra}

Answer only with a JSON object, with no text before or after, no code fence and no link:
{"rejected": [{"document": number, "reason": string}], "inventory": [{"document": number, "contains": "data"|"graph"|"case"|"study"|"concept"|"teaching"|"report", "what": string (what it contains, one sentence), "quantitative": boolean, "evidence": string}], "ideas": [{"title": string (short), "approach": string (an identifier from the repertoire), "students_do": string (one or two sentences on what students concretely do), "duration": string, "why": string (why this approach serves the goal with these resources, one sentence), "documents": number[] (inventory documents used, [] if none), "uses_data": boolean, "scenario": string|null}]}`
};

const IDEAS_EXTRA: Record<
  ReadingLanguage,
  { type: string; avoid: string; none: string; otherThan: string }
> = {
  fr: {
    otherThan:
      "\nL'enseignant·e veut une autre approche que : {methods}. Propose des méthodes différentes de celles-ci, réalisables dans ce contexte ; pour chacune, ce que font les étudiant·e·s, le matériel et le rendu changent vraiment, pour le même sujet et le même objectif.",
    none: '\nAucun document de la base ne traite directement de ce sujet ; le seul document fourni est le contexte. Laisse l\'inventaire vide et propose seulement des activités autonomes, avec leur scénario ou leurs consignes essentielles dans "scenario".',
    type: "\nL'enseignant·e préfère ce type d'activité : {type}. Propose-le si les ressources le permettent.",
    avoid: '\nPropose des activités différentes de celles-ci : {titles}.'
  },
  en: {
    otherThan:
      '\nThe teacher wants another approach than: {methods}. Suggest methods different from these, feasible in this context; for each, what students do, the material and the output really change, for the same subject and goal.',
    none: '\nNo document of the database directly addresses this subject; the only provided document is the context. Leave the inventory empty and suggest only self-contained activities, with their scenario or essential instructions in "scenario".',
    type: '\nThe teacher prefers this type of activity: {type}. Suggest it if the resources allow it.',
    avoid: '\nSuggest activities different from these: {titles}.'
  }
};

const ACTIVITY: Record<ReadingLanguage, string> = {
  fr: `Tu aides un·e enseignant·e de l'enseignement supérieur à préparer une activité prête à l'emploi, d'environ une page.

Contexte :
{context}

Activité choisie : {title}
Approche : {approach}
Ce que font les étudiant·e·s : {studentsDo}
{materials}{format}

Règles :
- Utilise seulement ce que les ressources vérifiées contiennent ; une analyse de données seulement sur les données vérifiées. Ne demande pas à l'enseignant·e de créer, préparer ou chercher des données ou des documents.
- Écris toi-même, dans "provided_material", tout matériel indispensable qui n'est pas dans les ressources (scénario, cas fictif présenté comme tel, rôles, questions guides) ; 150 mots au plus, sans tableau ; sinon null.
- L'activité tient en une page : moins de 450 mots au total.
- Ne rattache jamais des valeurs à une autre date, un autre pays, une autre population ou un autre contexte que ceux du document ; si les données ne permettent pas la tâche, change la tâche ou n'utilise pas ces chiffres.
- Si l'activité utilise des valeurs chiffrées d'un document vérifié, présente-les dans "data_table" (sinon null) : valeurs recopiées telles quelles d'un seul document, unités dans les en-têtes, et dans "context" l'unité fonctionnelle, le périmètre, le contexte et les réserves que le document indique. Si le document cite ces valeurs d'une autre publication, indique-la dans "reported_from". "comparable" : true seulement si toutes les valeurs sont établies sur la même base. Ne présente jamais des valeurs propres à un contexte comme un classement universel.
- Méthode : garde la méthode indiquée ("approach" = son identifiant, {approaches}) et rends cohérents l'objectif, les étapes, les ressources et la vérification avec elle ; si ses conditions ne sont pas réunies (données vérifiées, cas documenté, séances, partenaire réel), écris-le dans "limitation" sans prétendre le contraire.
- Scientifiquement juste et au niveau des étudiant·e·s : pas de simplification trompeuse, pas d'équations inutiles, aucun chiffre absent des documents, aucune ressource inventée. Si une limite demeure, écris-la dans "limitation".
- 3 ou 4 étapes, chacune avec sa durée entre parenthèses, par exemple "(15 min)" ; le total ne dépasse pas le temps disponible.
- Des consignes courtes adressées aux étudiant·e·s.
- GreenComp (des résultats d'apprentissage, pas des méthodes) : seulement si la tâche des étudiant·e·s développe clairement une ou deux de ces compétences, en nommant l'étape concernée (par exemple "Étape 2 : ...") ; sinon []. Compétences : {greencomp}.

Ne réponds qu'avec un objet JSON, sans texte avant ou après, sans balise de code, sans lien :
{"title": string, "approach": string, "objective": string (une phrase), "format": string (durée et organisation), "steps": string[], "student_instructions": string (2 à 4 phrases adressées aux étudiant·e·s), "provided_material": string|null, "preparation": string (ce que l'enseignant·e prépare, court), "student_output": string, "check": string (une vérification simple), "limitation": string|null, "greencomp": [{"id": string, "how": string}], "data_table": null | {"caption": string, "columns": string[], "rows": string[][], "document": number, "context": string, "reported_from": string|null, "comparable": boolean}, "documents": number[]}`,
  en: `You help a university teacher prepare a ready-to-use activity of about one page.

Context:
{context}

Chosen activity: {title}
Approach: {approach}
What students do: {studentsDo}
{materials}{format}

Rules:
- Only use what the verified resources contain; data analysis only on verified data. Do not ask the teacher to create, prepare or look for data or documents.
- Write yourself, in "provided_material", any essential material that is not in the resources (a scenario, a fictional case presented as such, roles, guiding questions); 150 words at most, no table; otherwise null.
- The activity fits on one page: under 450 words in total.
- Never attach values to another date, country, population or context than the document's; if the data do not allow the task, change the task or leave these figures out.
- If the activity uses figures from a verified document, present them in "data_table" (otherwise null): values copied as they are from one document, units in the headers, and in "context" the functional unit, system boundaries, context and caveats the document states. If the document quotes these values from another publication, name it in "reported_from". "comparable": true only if all values are established on the same basis. Never present context-specific values as a universal ranking.
- Method: keep the stated method ("approach" = its identifier, {approaches}) and make the objective, steps, resources and check coherent with it; if its conditions are not met (verified data, documented case, sessions, real partner), say so in "limitation" without pretending otherwise.
- Scientifically sound and at the students' level: no misleading simplification, no needless equations, no figure missing from the documents, no invented resource. If a limitation remains, write it in "limitation".
- 3 or 4 steps, each with its duration in brackets, for example "(15 min)"; the total does not exceed the time available.
- Short instructions addressed to the students.
- GreenComp (learning outcomes, not methods): only if the students' task clearly develops one or two of these competences, naming the step concerned (for example "Step 2: ..."); otherwise []. Competences: {greencomp}.

Answer only with a JSON object, with no text before or after, no code fence and no link:
{"title": string, "approach": string, "objective": string (one sentence), "format": string (duration and organisation), "steps": string[], "student_instructions": string (2 to 4 sentences addressed to students), "provided_material": string|null, "preparation": string (what the teacher prepares, short), "student_output": string, "check": string (a simple check), "limitation": string|null, "greencomp": [{"id": string, "how": string}], "data_table": null | {"caption": string, "columns": string[], "rows": string[][], "document": number, "context": string, "reported_from": string|null, "comparable": boolean}, "documents": number[]}`
};

export const buildQueriesRequest = (context: ActivityContext, lang: ReadingLanguage) =>
  request(QUERIES[lang], [contextSource(context, lang)], lang);

export const buildIdeasRequest = (
  context: ActivityContext,
  candidates: Document[],
  lang: ReadingLanguage,
  options: { type?: string; avoid?: string[]; otherThan?: string[] } = {}
) => {
  const hasNone = !candidates.length;
  const extra = [
    hasNone ? IDEAS_EXTRA[lang].none : '',
    options.otherThan?.length
      ? fill(IDEAS_EXTRA[lang].otherThan, { methods: options.otherThan.join(', ') })
      : '',
    options.type?.trim() ? fill(IDEAS_EXTRA[lang].type, { type: options.type.trim() }) : '',
    options.avoid?.length
      ? fill(IDEAS_EXTRA[lang].avoid, { titles: options.avoid.join(' ; ') })
      : ''
  ].join('');
  return request(
    fill(IDEAS[lang], {
      context: contextText(context, lang),
      count: String(Math.min(candidates.length, MAX_SOURCES)),
      approaches: APPROACH_GUIDE[lang],
      extra
    }),
    // the endpoint needs a source: without any relevant document, the context is the only one
    hasNone ? [contextSource(context, lang)] : candidates.map(withSourceLine),
    lang
  );
};

export const buildActivityRequest = (
  context: ActivityContext,
  idea: ActivityIdea,
  lang: ReadingLanguage,
  formatRequest = ''
) => {
  const fr = lang === 'fr';
  const values = fr ? 'valeurs exploitables' : 'usable values';
  const materials = idea.resources.length
    ? `${fr ? 'Ressources vérifiées (documents fournis)' : 'Verified resources (provided documents)'} :\n${idea.resources
        .map(
          (resource, index) =>
            `Doc ${index + 1} (${resource.material}${resource.isQuantitative ? `, ${values}` : ''}) : ${resource.usefulness}`
        )
        .join('\n')}`
    : fr
      ? 'Aucune ressource vérifiée : ne cite aucun document, rapport ou source précise ; écris toi-même le matériel indispensable.'
      : 'No verified resource: do not cite any document, report or specific source; write the essential material yourself.';
  const scenario = idea.scenario
    ? `\n${fr ? 'Scénario prévu' : 'Planned scenario'} : ${idea.scenario}`
    : '';
  const format = formatRequest.trim()
    ? `\n${fr ? 'Format souhaité par l’enseignant·e' : 'Format the teacher wants'} : ${formatRequest.trim()}\n`
    : '';
  return request(
    fill(ACTIVITY[lang], {
      context: contextText(context, lang),
      title: idea.title,
      approach: idea.approach || (fr ? 'à choisir dans la liste' : 'to choose from the list'),
      approaches: APPROACHES.join(', '),
      studentsDo: idea.studentsDo,
      materials: `\n${materials}${scenario}\n`,
      format,
      greencomp: GREENCOMP.join(', ')
    }),
    idea.resources.map((resource) => resource.document),
    lang
  );
};

const asText = (value: unknown): string | null =>
  typeof value === 'string' && value.trim() ? value.trim() : null;

const MAX_QUERIES = 3;

export interface SearchPlan {
  queries: string[];
  // each key concept with its forms (french, english, synonyms)
  concepts: string[][];
  // for each concept: a document that does not mention it does not address the subject
  core: boolean[];
  // the historical period the subject is about, in years
  period: [number, number] | null;
  // the collection categories suited to the discipline and the task
  sourceTypes: string[];
}

export const SOURCE_TYPES = [
  'academic_scientific_publications',
  'expert_reports',
  'teaching_resources',
  'datasets',
  'science_communication_and_outreach'
];

const MAX_CONCEPTS = 4;
const MAX_FORMS = 8;

export const parseQueries = (answer: string): SearchPlan | null => {
  const data = parseJsonObject(answer);
  // the endpoint adds "[Doc 1]" citations, sometimes as links: they are not part of the question
  const queries = (Array.isArray(data?.queries) ? data.queries : [])
    .map((query: unknown) =>
      asText(
        typeof query === 'string'
          ? query.replace(/<a\s[^>]*>.*?<\/a>/gi, '').replace(/\[Doc \d+\]/gi, '')
          : null
      )
    )
    .filter((query: string | null): query is string => !!query)
    .slice(0, MAX_QUERIES);
  if (!queries.length) return null;
  const kept = (Array.isArray(data?.concepts) ? data.concepts : [])
    .map((concept: any) => ({
      core: concept?.core === true,
      forms: (Array.isArray(concept)
        ? concept
        : typeof concept === 'object' && concept
          ? [concept.fr, concept.en, ...(Array.isArray(concept.synonyms) ? concept.synonyms : [])]
          : [concept]
      )
        .map((form: unknown) => asText(form)?.toLowerCase())
        .filter((form: string | undefined): form is string => !!form && form.length > 2)
    }))
    // a list of every notion at once is not a concept: it would let any document through
    .filter(({ forms }: { forms: string[] }) => forms.length && forms.length <= MAX_FORMS)
    .slice(0, MAX_CONCEPTS);
  const from = Number(data?.period?.from);
  const to = Number(data?.period?.to);
  return {
    queries,
    concepts: kept.map(({ forms }: { forms: string[] }) => forms),
    core: kept.map(({ core }: { core: boolean }) => core),
    period: Number.isInteger(from) && Number.isInteger(to) && from <= to ? [from, to] : null,
    sourceTypes: (Array.isArray(data?.source_types) ? data.source_types : []).filter(
      (type: unknown) => SOURCE_TYPES.includes(type as string)
    )
  };
};

export interface RejectedCandidate {
  document: Document;
  reason: string;
}

// how many key concepts a document must mention: all of them when there are one or two, at
// least half otherwise (a document on two of three compared materials still helps)
const conceptsNeeded = (concepts: string[][]) =>
  concepts.length <= 2 ? concepts.length : Math.ceil(concepts.length / 2);

// the key concepts a document does not mention, in the text that can be read: its title, the
// passage the search returned and its abstract (the full text is not available)
export const missingConcepts = (document: Document, concepts: string[][]) => {
  const { document_title, slice_content, document_desc } = document.payload;
  const text = normalise(`${document_title} ${slice_content} ${document_desc || ''}`);
  // a form of several words also counts through its main words ("fine particle" -> "particle")
  const variants = (form: string) => [
    form,
    ...(form.includes(' ') ? form.split(/[\s'’-]+/).filter((word) => word.length >= 5) : [])
  ];
  return concepts.filter(
    (forms) => !forms.flatMap(variants).some((form) => text.includes(normalise(form)))
  );
};

// a historical subject: the readable text names a year of the period (give or take a generation)
// or its century ("XIXe siècle", "19th century"); a document about another time is not evidence
const PERIOD_MARGIN = 25;
const ROMAN = [
  '',
  'I',
  'II',
  'III',
  'IV',
  'V',
  'VI',
  'VII',
  'VIII',
  'IX',
  'X',
  'XI',
  'XII',
  'XIII',
  'XIV',
  'XV',
  'XVI',
  'XVII',
  'XVIII',
  'XIX',
  'XX',
  'XXI'
];
const ORDINAL = [
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  'seventeenth',
  'eighteenth',
  'nineteenth',
  'twentieth',
  'twenty-first'
];
export const isInPeriod = (document: Document, [from, to]: [number, number]) => {
  const { document_title, slice_content, document_desc } = document.payload;
  const raw = `${document_title} ${slice_content} ${document_desc || ''}`;
  const years = (raw.match(/\b1\d{3}\b|\b20\d{2}\b/g) || []).map(Number);
  if (years.some((year) => year >= from - PERIOD_MARGIN && year <= to + PERIOD_MARGIN)) return true;
  const text = normalise(raw);
  const centuries = [...new Set([Math.floor(from / 100) + 1, Math.floor(to / 100) + 1])];
  return centuries.some(
    (century) =>
      text.includes(`${ROMAN[century] || ''}esiècle`.toLowerCase()) ||
      text.includes(`${ROMAN[century] || ''}ᵉsiècle`.toLowerCase()) ||
      text.includes(`${century}thcentury`) ||
      text.includes(`${century}th-century`) ||
      (!!ORDINAL[century] && text.includes(`${ORDINAL[century]}century`))
  );
};

export interface SelectionOptions {
  core?: boolean[];
  period?: [number, number] | null;
  // the collection categories to prefer, and each collection's category
  sourceTypes?: string[];
  categoryOf?: (corpus: string) => string | undefined;
}

// the documents found by the search questions: those that do not mention the subject's key
// concepts (all of its core ones), or not its period, are set aside; the others are ranked by how
// many concepts they mention, then by whether their collection suits the discipline, then by
// their places in every question's results
// (reciprocal rank fusion: scores of different questions are not comparable, so one question's
// weak first result does not outrank a document several questions place high)
const RANK_OFFSET = 10;
export const selectCandidates = (
  results: Document[][],
  concepts: string[][],
  options: SelectionOptions = {}
) => {
  const { core = [], period = null, sourceTypes = [], categoryOf = () => undefined } = options;
  const isPreferred = (document: Document) =>
    sourceTypes.includes(categoryOf(document.payload.document_corpus) || '') ? 1 : 0;
  const found = new Map<string, { document: Document; rank: number }>();
  results.forEach((docs) =>
    docs.forEach((document, index) => {
      const known = found.get(document.payload.document_id);
      found.set(document.payload.document_id, {
        document: known?.document || document,
        rank: (known?.rank || 0) + 1 / (RANK_OFFSET + index + 1)
      });
    })
  );
  const ranked = [...found.values()]
    .map((item) => ({ ...item, missing: missingConcepts(item.document, concepts) }))
    .sort(
      (a, b) =>
        a.missing.length - b.missing.length ||
        isPreferred(b.document) - isPreferred(a.document) ||
        b.rank - a.rank
    );
  const needed = conceptsNeeded(concepts);
  const accepted: Document[] = [];
  const rejected: RejectedCandidate[] = [];
  ranked.forEach(({ document, missing }) => {
    const missingCore = concepts.filter((forms, index) => core[index] && missing.includes(forms));
    if (missingCore.length) {
      rejected.push({
        document,
        reason: `missing core: ${missingCore.map((forms) => forms[0]).join(', ')}`
      });
    } else if (period && !isInPeriod(document, period)) {
      rejected.push({ document, reason: `outside ${period[0]}-${period[1]}` });
    } else if (concepts.length - missing.length < needed) {
      rejected.push({
        document,
        reason: `missing: ${missing.map((forms) => forms[0]).join(', ')}`
      });
    } else if (accepted.length >= MAX_SOURCES) {
      rejected.push({ document, reason: 'ranked lower' });
    } else {
      accepted.push(document);
    }
  });
  return { accepted, rejected };
};

// one more search when too few documents pass: the key concepts themselves, in their first
// (french) and last (english) forms
export const conceptQueries = (concepts: string[][]) =>
  [
    ...new Set([
      concepts.map((forms) => forms[0]).join(' '),
      concepts.map((forms) => forms[forms.length - 1]).join(' ')
    ])
  ].filter((query) => query.trim());

// the documents the ideas answer sets aside as off the subject, with its reason
export const parseRejected = (answer: string, candidates: Document[]): RejectedCandidate[] => {
  const data = parseJsonObject(answer);
  const given = candidates.slice(0, MAX_SOURCES);
  return (Array.isArray(data?.rejected) ? data.rejected : [])
    .map((item: any) => ({
      document: Number.isInteger(item?.document) ? given[item.document - 1] : undefined,
      reason: asText(item?.reason) || ''
    }))
    .filter((item: { document?: Document }): item is RejectedCandidate => !!item.document);
};

// a sentence that shows values: a number, or words that name a table, a graph or data
const SHOWS_DATA = /\d|tableau|graphique|figure|données|statisti|table|chart|graph|data/i;
const MAX_IDEAS = 3;
const MAX_RESOURCES = 3;

// a quote is in the document word for word; one shortened with an ellipsis ("[...]", "…") or
// joining sentences that are not next to each other, when each of its pieces is
const ELLIPSIS = /\[\s*(?:\.\.\.|…)\s*\]|\.\.\.|…/;
const SENTENCE_END = /(?<=[.!?])\s+(?=[A-ZÀ-Ý«"])/;
const isQuoted = (quote: string, document: Document) => {
  const text = resourceText([document]);
  const pieces = quote
    .split(ELLIPSIS)
    .flatMap((piece) => piece.split(SENTENCE_END))
    .map((piece) => cleanQuote(piece) || '')
    .filter((piece) => piece.trim());
  return !!pieces.length && pieces.every((piece) => text.includes(normalise(piece)));
};

// the verified inventory and the ideas built on it; null when the answer is unusable
export const parseIdeas = (
  answer: string,
  candidates: Document[],
  context?: ActivityContext,
  onLeftOut?: (approach: ApproachId, reason: Infeasibility) => void
): ActivityIdea[] | null => {
  const data = parseJsonObject(answer);
  if (!data || !Array.isArray(data.ideas)) return null;
  const given = candidates.slice(0, MAX_SOURCES);

  // what each document really contains, kept only when its quote is in its text
  const inventory = new Map<number, ActivityResource>();
  (Array.isArray(data.inventory) ? data.inventory : []).forEach((item: any) => {
    const n = item?.document;
    if (!Number.isInteger(n) || n < 1 || n > given.length || inventory.has(n)) return;
    const document = given[n - 1];
    const what = asCleanText(item?.what, given);
    const evidence = cleanQuote(item?.evidence);
    if (!what || !evidence || !hasLink(document)) return;
    if (!isQuoted(evidence, document)) return;
    if (hasUnsupportedFigure(what, [document])) return;
    const isQuantitative = item?.quantitative === true && SHOWS_DATA.test(evidence);
    let material: Material = MATERIALS.includes(item?.contains) ? item.contains : 'concept';
    // data or a graph is only claimed when the quote shows values
    if ((material === 'data' || material === 'graph') && !isQuantitative) material = 'study';
    inventory.set(n, { document, usefulness: what, material, isQuantitative, evidence });
  });

  return data.ideas
    .map((item: any): ActivityIdea | null => {
      const title = asCleanText(item?.title, given);

      const studentsDo = asCleanText(item?.students_do, given);
      const why = asCleanText(item?.why, given);
      if (!title || !studentsDo || !why) return null;
      const resources = [...new Set<number>(Array.isArray(item?.documents) ? item.documents : [])]
        .map((n) => inventory.get(n))
        .filter((resource): resource is ActivityResource => !!resource)
        .slice(0, MAX_RESOURCES);
      const usesData = item?.uses_data === true;
      const scenario = asCleanText(item?.scenario, given);
      // data analysis needs verified values; an activity on nothing needs its own scenario
      if (usesData && !resources.some((resource) => resource.isQuantitative)) return null;
      if (!resources.length && !scenario) return null;
      // an idea that relies on a document it was not verified with is not offered
      if (mentionsUnverified(`${title} ${studentsDo} ${why}`, given, resources)) return null;
      // a method the answer did not name from the repertoire is named from the resources; one
      // whose conditions are not met is not offered at all, rather than mislabelled
      const named = item?.approach as ApproachId;
      const approach = APPROACHES.includes(named) ? named : approachFrom(usesData, resources);
      const reason = whyInfeasible(approach, resources, context, scenario);
      if (reason) {
        onLeftOut?.(approach, reason);
        return null;
      }
      return {
        title,
        approach,
        studentsDo,
        duration: asCleanText(item?.duration, given),
        why,
        resources,
        usesData,
        scenario: resources.length ? null : scenario
      };
    })
    .filter((idea: ActivityIdea | null): idea is ActivityIdea => !!idea)
    .slice(0, MAX_IDEAS);
};

// documents an idea names, by number ("documents 2 et 6") or by title, that are not among its
// verified resources
const DOCUMENT_NUMBERS = /\bdoc(?:ument)?s?\s+(\d+(?:\s*(?:,|et|and|&)\s*\d+)*)/gi;
const mentionsUnverified = (text: string, given: Document[], resources: ActivityResource[]) => {
  const used = new Set(resources.map((resource) => resource.document));
  const numbers = [...text.matchAll(DOCUMENT_NUMBERS)].flatMap((match) =>
    (match[1].match(/\d+/g) || []).map(Number)
  );
  if (numbers.some((n) => given[n - 1] && !used.has(given[n - 1]))) return true;
  const said = normalise(text);
  return given.some((document) => {
    const title = normalise(document.payload.document_title).slice(0, 40);
    // a long title anywhere; any title when cited as « title » (as citations are cleaned)
    const isNamed = (title.length >= 15 && said.includes(title)) || said.includes(`"${title}`);
    return !used.has(document) && isNamed;
  });
};

// a method the answer did not name from the repertoire: what the resources make students do
const approachFrom = (usesData: boolean, resources: ActivityResource[]): ApproachId => {
  if (usesData && resources.some((resource) => resource.isQuantitative)) {
    return 'comparative_data_analysis';
  }
  if (resources.some((resource) => resource.material === 'case')) return 'case_study';
  if (resources.length) return 'critical_analysis';
  return 'problem_based_learning';
};

export type Infeasibility = 'needsPartner' | 'needsSessions' | 'needsData' | 'needsCase';

// what the teaching context itself rules out: a real partner named by the teacher, several sessions
export const contextInfeasibility = (
  approach: ApproachId,
  context: ActivityContext
): Infeasibility | null => {
  if (PARTNER_METHODS.includes(approach) && !PARTNER.test(Object.values(context).join(' '))) {
    return 'needsPartner';
  }
  const minutes = availableMinutes(context.time);
  const isLong = SEVERAL_SESSIONS.test(context.time) || (minutes !== null && minutes >= 360);
  return LONG_METHODS.includes(approach) && !isLong ? 'needsSessions' : null;
};

// the practical conditions a method needs: verified values to compare or assess, a documented
// case (or WeLearn's own fictional one), and what the context allows; null when they are met
export const whyInfeasible = (
  approach: ApproachId,
  resources: ActivityResource[],
  context?: ActivityContext,
  scenario: string | null = null
): Infeasibility | null => {
  const hasValues = resources.some((resource) => resource.isQuantitative);
  const hasCase = resources.some((resource) => resource.material === 'case');
  if ((approach === 'comparative_data_analysis' || approach === 'lca_project') && !hasValues) {
    return 'needsData';
  }
  if (approach === 'case_study' && !hasCase && !(scenario && !resources.length)) return 'needsCase';
  return context ? contextInfeasibility(approach, context) : null;
};

export const isFeasible = (...args: Parameters<typeof whyInfeasible>) => !whyInfeasible(...args);

// the method a teacher names in their own words ("un projet avec une communauté"), from the
// methods' labels in each language
export const approachFromText = (
  text: string,
  labels: Record<string, string[]>
): ApproachId | null => {
  const said = normalise(text);
  if (!said) return null;
  return (
    APPROACHES.find((approach) =>
      [approach, ...(labels[approach] || [])].some((label) => {
        const name = normalise(label.split(/[/(]/)[0]);
        return name.length > 3 && (said.includes(name) || name.includes(said));
      })
    ) || null
  );
};

// the teacher's own idea: developed with the verified resources found for the context
export const teacherIdea = (text: string, resources: ActivityResource[]): ActivityIdea => ({
  title: text.trim().split(/[.\n]/)[0].slice(0, 120),
  approach: null,
  studentsDo: text.trim(),
  duration: null,
  why: '',
  resources: resources.slice(0, MAX_RESOURCES),
  usesData: false,
  scenario: null,
  isTeacherIdea: true
});

// "1 h 30", "90 min", "2h", "une séance de 2 heures" -> minutes; null when unclear
export const availableMinutes = (time: string) => {
  const text = time.toLowerCase();
  const hours = text.match(/(\d+(?:[.,]\d+)?)\s*h(?:eures?|ours?)?\s*(\d{1,2})?/);
  if (hours) return Math.round(parseFloat(hours[1].replace(',', '.')) * 60) + Number(hours[2] || 0);
  const minutes = text.match(/(\d+)\s*min/);
  return minutes ? Number(minutes[1]) : null;
};

// the durations written in the steps, "(15 min)" or "(1 h)"
const stepsMinutes = (steps: string[]) =>
  steps.reduce((total, step) => {
    const minutes = step.match(/\((\d+)\s*min/i);
    const hours = step.match(/\((\d+(?:[.,]\d+)?)\s*h/i);
    if (minutes) return total + Number(minutes[1]);
    if (hours) return total + Math.round(parseFloat(hours[1].replace(',', '.')) * 60);
    return total;
  }, 0);

// asking the teacher to prepare, create or find data or a graph (in French or English)
const ASKS_FOR_DATA =
  /(préparer|créer|construire|fournir|collecter|rassembler|chercher|sélectionner|prepare|create|build|provide|collect|compile|find|select)[^.]{0,80}(données|dataset|data|jeu de|tableau de valeurs|graphique|graph)/i;

const MAX_STEPS = 4;
// a few minutes of tolerance for rounding
const TIME_TOLERANCE = 5;

// null when unusable: no title or steps, a figure the resources do not contain, steps that do
// not fit the time available, or (when `isStrict`) data the teacher would have to produce although
// the idea has no verified data; on a retry that last case is kept and flagged
// numbers compared by their digits only: "105 000", "105,000" and "105000" are the same value
const digitGroups = (text: string) =>
  (text.match(/\d(?:[\d\s\u202f.,]*\d)?/g) || []).map((group) => group.replace(/\D/g, ''));

// a citation such as "(APA 2017)" or "(Dupont et al., 2019)"
const CITATION =
  /\(([A-Z][\w&.'-]*(?:\s+(?:[A-Z][\w&.'-]*|et al\.|and|&))*),?\s+((?:19|20)\d{2}[a-z]?)\)/;

// the table, kept only when every value is in its document's text and its context is stated;
// 'invalid' when a table was given but does not pass. the publication the values come from is
// read from the document when it cites one right after them
const parseDataTable = (raw: any, given: Document[]): DataTable | null | 'invalid' => {
  if (!raw || typeof raw !== 'object') return null;
  const n = raw.document;
  const document = Number.isInteger(n) && n >= 1 && n <= given.length ? given[n - 1] : null;
  let columns = (Array.isArray(raw.columns) ? raw.columns : []).map(asText);
  let rows = (Array.isArray(raw.rows) ? raw.rows : []).map((row: unknown) =>
    (Array.isArray(row) ? row : []).map((cell) => asText(String(cell ?? '')) || '')
  );
  const context = asCleanText(raw.context, given);
  const caption = asCleanText(raw.caption, given);
  if (
    !document ||
    !context ||
    !caption ||
    columns.length < 2 ||
    columns.some((c: string | null) => !c)
  )
    return 'invalid';
  if (
    !rows.length ||
    rows.length > 8 ||
    rows.some((row: string[]) => row.length !== columns.length)
  )
    return 'invalid';
  const text = `${document.payload.document_title} ${document.payload.slice_content}`;
  const available = new Set(digitGroups(text));
  // a column with a value the document does not contain (a recalculated or invented figure) is
  // left out; the table stands if a label column and a verified column of values remain
  const kept = columns
    .map((_: string | null, index: number) => index)
    .filter((index: number) =>
      rows.every((row: string[]) => digitGroups(row[index]).every((value) => available.has(value)))
    );
  const hasValues = (index: number) => rows.some((row: string[]) => digitGroups(row[index]).length);
  // the label column (what each row is: a material, a country, a year) is the document's too,
  // and so is any year or number in a header
  if (!kept.includes(0) || kept.length < 2 || !kept.some(hasValues)) return 'invalid';
  if (digitGroups(columns.join(' ')).some((value) => !available.has(value))) return 'invalid';
  // the caption and context describe the document's values: a number they add (a surface, a
  // building size from the activity's own scenario) would misdescribe them
  if (digitGroups(`${caption} ${context}`).some((value) => !available.has(value))) return 'invalid';
  columns = kept.map((index: number) => columns[index]);
  rows = rows.map((row: string[]) => kept.map((index: number) => row[index]));
  const values = rows.flatMap((row: string[]) => row.flatMap(digitGroups));
  // the publication the document takes these values from: as the answer names it when the
  // document really cites it, otherwise as cited right after the first value
  let reportedFrom = asCleanText(raw.reported_from, given);
  if (reportedFrom && !normalise(text).includes(normalise(reportedFrom))) reportedFrom = null;
  if (!reportedFrom) {
    const first = values[0].split('').join('[\\s\\u202f.,]?');
    const at = text.search(new RegExp(first));
    const cited = at === -1 ? null : text.slice(at, at + 400).match(CITATION);
    if (cited) reportedFrom = `${cited[1]} (${cited[2]})`;
  }
  return {
    caption,
    columns: columns as string[],
    rows,
    document,
    context,
    reportedFrom,
    isComparable: raw.comparable === true
  };
};

// the chosen idea's method stands (the teacher may have chosen it); for the teacher's own idea,
// the method the answer names, when its conditions are met, otherwise one named from the resources
const activityApproach = (
  named: unknown,
  context: ActivityContext | undefined,
  options: { approach?: ApproachId | null; resources?: ActivityResource[] }
): ApproachId | null => {
  if (options.approach) return options.approach;
  if (!APPROACHES.includes(named as ApproachId)) return null;
  if (!options.resources) return named as ApproachId;
  return isFeasible(named as ApproachId, options.resources, context)
    ? (named as ApproachId)
    : approachFrom(true, options.resources);
};

export const parseActivity = (
  answer: string,
  documents: Document[],
  context?: ActivityContext,
  options: {
    hasData?: boolean;
    isStrict?: boolean;
    approach?: ApproachId | null;
    resources?: ActivityResource[];
  } = {}
): ActivitySuggestion | null => {
  const data = parseJsonObject(answer);
  const given = documents.slice(0, MAX_SOURCES);
  const clean = (value: unknown) => asCleanText(value, given);
  const title = clean(data?.title);
  const steps = (Array.isArray(data?.steps) ? data.steps : [])
    .map(clean)
    .filter((step: string | null): step is string => !!step)
    .slice(0, MAX_STEPS);
  if (!title || !steps.length) return null;
  const texts = [
    title,
    ...steps,
    data.preparation,
    data.student_instructions,
    data.provided_material,
    data.student_output,
    data.check
  ]
    .filter((text) => typeof text === 'string')
    .join(' ');
  // no figure that a resource does not contain (durations and group sizes are not checked)
  if (hasUnsupportedFigure(texts, given)) return null;
  const assumesMissing =
    !options.hasData && ASKS_FOR_DATA.test(`${data.preparation || ''} ${steps.join(' ')}`);
  if (assumesMissing && options.isStrict) return null;
  const limit = context ? availableMinutes(context.time) : null;
  if (limit && stepsMinutes(steps) > limit + TIME_TOLERANCE) return null;
  // a table that does not pass is asked for again once, then left out
  const table = parseDataTable(data.data_table, given);
  if (table === 'invalid' && options.isStrict) return null;
  // a competence counts only when it names a step of the activity
  const namesStep = (how: string) => {
    const step = how.match(/(?:étape|step)\s*(\d)/i);
    return !!step && Number(step[1]) >= 1 && Number(step[1]) <= steps.length;
  };
  const greencomp = (Array.isArray(data.greencomp) ? data.greencomp : [])
    .map((item: any) => ({ id: asText(item?.id), how: clean(item?.how) }))
    .filter(
      (item: { id: string | null; how: string | null }): item is { id: GreenCompId; how: string } =>
        GREENCOMP.includes(item.id as GreenCompId) && !!item.how && namesStep(item.how)
    )
    .slice(0, 2);
  return {
    title,
    approach: activityApproach(data.approach, context, options),
    dataTable: table === 'invalid' ? null : table,
    objective: clean(data.objective),
    format: clean(data.format),
    studentInstructions: clean(data.student_instructions),
    providedMaterial: clean(data.provided_material),
    preparation: clean(data.preparation),
    steps,
    studentOutput: clean(data.student_output),
    check: clean(data.check),
    limitation: clean(data.limitation),
    assumesMissing,
    greencomp,
    documents: citedDocuments(data.documents, given)
  };
};
