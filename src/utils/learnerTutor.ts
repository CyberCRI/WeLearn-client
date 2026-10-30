import type { Document } from '@/types';
import { normalise, parseJsonObject, type ReadingLanguage } from '@/utils/courseReading';
import {
  asCleanText,
  cleanCitations,
  cleanQuote,
  fill,
  hasLink,
  hasUnsupportedFigure,
  request,
  withSourceLine
} from '@/utils/connections';

// the learner space's one WeLearn companion, on the existing /qna/chat/answer route: the learning
// thread and the recent conversation go in as Doc 1, real WeLearn documents after it, and the
// instructions in the query (the route has no separate system prompt or documented history format).
// one tutor for every space: only its pedagogical stance and the current request change
// ponytail: a stand-in for a dedicated tutoring endpoint, like the teacher tools

export const LEARNER_SPACES = ['understand', 'investigate', 'envision', 'apply'] as const;
export type LearnerSpace = (typeof LEARNER_SPACES)[number];

export const STARTS = ['exploring', 'question', 'working'] as const;
export type LearnerStart = (typeof STARTS)[number];

export interface Turn {
  role: 'learner' | 'tutor';
  text: string;
  // one of the starting choices the learner clicked, not words of their own
  isChoice?: boolean;
  // a tutor reply that suggests a learning space, and the topic it would carry there
  space?: LearnerSpace;
  topic?: string;
  // what a tutor reply did (its move), what it explained and the key terms of its subject: the
  // conversation's memory within this tab, so WeLearn varies its approach, builds on what it
  // already explained and keeps only the sources that bear on the subject
  move?: Move;
  concepts?: string[];
  focus?: string[];
}

export interface LearningThread {
  start: LearnerStart | null;
  topic: string;
  // the learning purpose the learner confirmed, in their words
  purpose: string;
  // sources the learner chose to keep
  resources: Document[];
  notes: { space: LearnerSpace; text: string }[];
}

export const emptyThread = (): LearningThread => ({
  start: null,
  topic: '',
  purpose: '',
  resources: [],
  notes: []
});

// what the learner asks the tutor for, beyond a free message
export const TUTOR_MODES = [
  'chat',
  'hint',
  'direct',
  'explain',
  'another',
  'example',
  'deeper',
  'connections',
  'check',
  'interpret',
  'compare',
  'conclusion',
  'assumptions',
  'scenario',
  'clarify',
  'evidence',
  'options',
  'feedback'
] as const;
export type TutorMode = (typeof TUTOR_MODES)[number];

const THREAD_TITLE: Record<ReadingLanguage, string> = {
  fr: 'Fil d’apprentissage',
  en: 'Learning thread'
};
const MAX_TURNS = 8;

const threadText = (
  thread: LearningThread,
  turns: Turn[],
  lang: ReadingLanguage,
  material = ''
) => {
  const fr = lang === 'fr';
  const who = (role: Turn['role']) =>
    role === 'learner' ? (fr ? 'Apprenant·e' : 'Learner') : fr ? 'WeLearn' : 'WeLearn';
  return [
    thread.topic && `${fr ? 'Sujet' : 'Topic'} : ${thread.topic}`,
    thread.purpose && `${fr ? 'Intention confirmée' : 'Confirmed purpose'} : ${thread.purpose}`,
    thread.notes.length &&
      `${fr ? 'Notes de l’apprenant·e' : 'Learner’s notes'} :\n${thread.notes.map((note) => `- ${note.text}`).join('\n')}`,
    material &&
      `${fr ? 'Ce que la personne a sous les yeux' : 'What the person is looking at'} :\n${material}`,
    turns.length &&
      `${fr ? 'Conversation récente' : 'Recent conversation'} :\n${turns
        .slice(-MAX_TURNS)
        .map((turn) => `${who(turn.role)} : ${turn.text}`)
        .join('\n')}`
  ]
    .filter(Boolean)
    .join('\n\n');
};

const threadSource = (
  thread: LearningThread,
  turns: Turn[],
  lang: ReadingLanguage,
  material = ''
): Document =>
  ({
    score: 1,
    payload: {
      document_corpus: 'thread',
      document_desc: '',
      document_details: {},
      document_id: crypto.randomUUID(),
      document_lang: lang,
      document_sdg: [],
      document_title: THREAD_TITLE[lang],
      // ponytail: the route requires a url; this one never resolves and is never shown
      document_url: 'https://example.invalid/thread',
      slice_content: threadText(thread, turns, lang, material) || '-',
      slice_sdg: null
    }
  }) as unknown as Document;

const SPACE_ROLE: Record<ReadingLanguage, Record<LearnerSpace | 'start', string>> = {
  fr: {
    start: 'Découverte : aider la personne à trouver ce qui compte pour elle.',
    understand:
      'COMPRENDRE : expliquer clairement avec des exemples concrets, repérer les idées fausses, inviter la personne à reformuler avec ses mots, montrer les liens entre dimensions environnementales, sociales, économiques et politiques.',
    investigate:
      'ENQUÊTER : questionner les affirmations et les hypothèses, aider à évaluer les preuves (qui, quoi, comment, quelles limites), comparer les points de vue, repérer les incertitudes ; la personne construit sa propre conclusion.',
    envision:
      'ENVISAGER : examiner des futurs possibles, leurs hypothèses et moteurs de changement, leurs conséquences pour différents groupes, les incertitudes et les arbitrages ; ce sont des scénarios imaginés, pas des prévisions.',
    apply:
      'APPLIQUER : aider la personne à clarifier ce qu’elle veut accomplir, ce qu’elle sait et ce qui lui manque, ses options, contraintes, parties prenantes et arbitrages, et à améliorer son propre travail.'
  },
  en: {
    start: 'Discovery: help the person find what matters to them.',
    understand:
      'UNDERSTAND: explain clearly with concrete examples, spot misconceptions, invite the person to put things in their own words, show links between environmental, social, economic and political dimensions.',
    investigate:
      'INVESTIGATE: question claims and assumptions, help evaluate evidence (who, what, how, what limits), compare perspectives, identify uncertainties; the person builds their own conclusion.',
    envision:
      'ENVISION: examine possible futures, their assumptions and drivers of change, their consequences for different groups, uncertainties and trade-offs; these are imagined scenarios, not forecasts.',
    apply:
      'APPLY: help the person clarify what they want to achieve, what they know and what is missing, their options, constraints, stakeholders and trade-offs, and improve their own work.'
  }
};

const MODE_ROLE: Record<ReadingLanguage, Record<TutorMode, string>> = {
  fr: {
    chat: 'Réponds à son message.',
    hint: 'Elle est bloquée : donne un indice, sans la réponse complète.',
    direct: 'Elle demande une explication directe : donne-la clairement, sans question en retour.',
    explain:
      'Explique la notion simplement, avec un exemple concret, puis invite-la à la reformuler.',
    another: 'Explique la même notion autrement, sous un autre angle.',
    example:
      'Donne un exemple concret et différent, dans un contexte qui n’est pas forcément européen.',
    deeper: 'Va plus loin : nuances, débats, limites de la notion.',
    connections:
      'Montre deux ou trois liens entre cette notion et d’autres dimensions (environnementale, sociale, économique, politique), et un arbitrage possible.',
    check:
      'Elle explique la notion avec ses mots : dis ce qui est juste, ce qui manque ou est inexact, et une piste pour améliorer, sans réécrire son explication.',
    interpret:
      'Aide-la à interpréter les sources : que montrent-elles vraiment, avec quelles limites ? Pose une question qui fait avancer son raisonnement.',
    compare:
      'Aide-la à comparer les sources ou scénarios : points communs, désaccords, hypothèses différentes.',
    conclusion:
      'Elle propose sa conclusion : dis si elle est appuyée par les sources, ce qui reste incertain, et ce qui la renforcerait, sans l’écrire à sa place.',
    assumptions: 'Aide-la à examiner les hypothèses et les moteurs de changement des scénarios.',
    scenario:
      'Elle propose son propre scénario : aide-la à en préciser les hypothèses, les conséquences, qui y gagne ou en pâtit, et les incertitudes.',
    clarify: 'Aide-la à préciser ce qu’elle cherche à accomplir et pour qui.',
    evidence:
      'Aide-la à voir ce qu’elle sait déjà et quelles informations ou preuves lui manquent.',
    options:
      'Aide-la à examiner des options, leurs contraintes, les parties prenantes et les arbitrages.',
    feedback:
      'Elle partage son travail : donne un retour constructif et précis (forces, points à renforcer, questions), sans réécrire son travail.'
  },
  en: {
    chat: 'Answer their message.',
    hint: 'They are stuck: give a hint, not the full answer.',
    direct: 'They ask for a direct explanation: give it clearly, with no question back.',
    explain:
      'Explain the concept simply, with a concrete example, then invite them to rephrase it.',
    another: 'Explain the same concept differently, from another angle.',
    example: 'Give a concrete, different example, in a context that is not necessarily European.',
    deeper: 'Go deeper: nuances, debates, limits of the concept.',
    connections:
      'Show two or three links between this concept and other dimensions (environmental, social, economic, political), and one possible trade-off.',
    check:
      'They explain the concept in their own words: say what is right, what is missing or inaccurate, and one way to improve, without rewriting their explanation.',
    interpret:
      'Help them interpret the sources: what do they really show, with what limits? Ask one question that moves their reasoning forward.',
    compare:
      'Help them compare the sources or scenarios: common ground, disagreements, different assumptions.',
    conclusion:
      'They propose their conclusion: say whether the sources support it, what remains uncertain, and what would strengthen it, without writing it for them.',
    assumptions: 'Help them examine the scenarios’ assumptions and drivers of change.',
    scenario:
      'They propose their own scenario: help them sharpen its assumptions, consequences, who benefits or loses, and uncertainties.',
    clarify: 'Help them clarify what they are trying to achieve, and for whom.',
    evidence:
      'Help them see what they already know and what information or evidence they still need.',
    options: 'Help them examine options, their constraints, stakeholders and trade-offs.',
    feedback:
      'They share their work: give constructive, precise feedback (strengths, points to strengthen, questions), without rewriting their work.'
  }
};

const TUTOR: Record<ReadingLanguage, string> = {
  fr: `Tu es le compagnon d'apprentissage de WeLearn, pour des personnes du monde entier : curieuses, en études, au travail ou face à une question concrète. Le document 1 décrit leur fil d'apprentissage et la conversation récente ; les documents suivants viennent de la base WeLearn.

Espace : {space}
Demande : {mode}

Règles :
- Approche socratique adaptative : aide la personne à raisonner. Pose au plus une question, seulement si elle fait avancer ; ne réponds pas toujours par une question. Explique directement quand elle le demande, quand elle est bloquée ou pour corriger une erreur.
- Si elle est bloquée, donne d'abord un indice ou un exemple, puis davantage d'aide.
- Ne fais pas son travail à sa place : pas de devoir, de projet ou de conclusion rédigés pour elle.
- Pas de compliments, pas de ton condescendant, pas de morale, pas de formule toute faite, pas de tiret cadratin. Ne reformule pas ses mots : réponds sur le fond. Si elle n'est pas d'accord, discute ses raisons au lieu de céder. Quand plusieurs points de vue ou arbitrages sont légitimes, dis-le.
- Ne suppose ni un contexte européen, ni un parcours universitaire, ni des connaissances préalables. Ne demande pas d'informations personnelles.
- Utilise les documents 2 et suivants seulement pour ce qu'ils disent réellement, et seulement s'ils portent sur la question ; ne cite jamais le document 1 ; n'invente aucune source, aucun chiffre. Si les documents ne suffisent pas, dis-le.
- Distingue ce qui est établi, débattu et incertain.
- Le document 1 est ton contexte, pas une source : n'en parle jamais (ni « document 1 », ni « fil d'apprentissage »), et nomme les autres sources par leur titre.
- Court et naturel : 120 mots au plus, en texte simple, sans titres ni listes sauf si la personne demande une explication détaillée.
- Langue simple et claire : mots courants, phrases courtes, sans expressions imagées ni tournures recherchées ; sans simplifier artificiellement une explication avancée demandée.

Message de la personne : {message}`,
  en: `You are WeLearn's learning companion, for people anywhere in the world: curious, studying, working or facing a concrete question. Document 1 describes their learning thread and the recent conversation; the following documents come from the WeLearn database.

Space: {space}
Request: {mode}

Rules:
- Adaptive Socratic approach: help the person reason. Ask at most one question, only if it moves things forward; do not always answer with a question. Explain directly when they ask, when they are stuck, or to correct a mistake.
- If they are stuck, first give a hint or an example, then more help.
- Do not do their work for them: no assignment, project or conclusion written for them.
- No compliments, no patronising tone, no moralising, no stock phrases, no em dashes. Do not paraphrase their words: respond to the substance. If they disagree, engage with their reasons instead of giving in. When several viewpoints or trade-offs are legitimate, say so.
- Do not assume a European context, a university background or prior knowledge. Do not ask for personal information.
- Use documents 2 onwards only for what they actually say, and only if they bear on the question; never cite document 1; invent no source and no figure. If the documents are not enough, say so.
- Distinguish what is established, debated and uncertain.
- Document 1 is your context, not a source: never mention it (neither "document 1" nor "learning thread"), and name the other sources by their title.
- Short and natural: 120 words at most, plain text, no headings or lists unless the person asks for a detailed explanation.
- Plain, clear language for people who may not be native speakers: familiar words, short sentences, no idioms, phrasal verbs or elaborate expressions; do not oversimplify an advanced explanation they asked for.

The person's message: {message}`
};

// Ask WeLearn for learners: an open-ended conversation with a knowledgeable, curious educator who
// chooses, each time, the move that would help the learner think most (answer, explain, examine
// an assumption, weigh evidence, show a trade-off...). the moves are options, not a sequence: a
// fixed "explain then ask" pattern made every reply look the same, and a long list of
// prohibitions made the model fall back on safe personal questions
export const MOVES = [
  'answer',
  'explain',
  'example',
  'clarify',
  'assumption',
  'evidence',
  'perspective',
  'system',
  'tradeoff',
  'challenge',
  'synthesis'
] as const;
export type Move = (typeof MOVES)[number];

const DISCOVERY: Record<ReadingLanguage, string> = {
  fr: `Tu es WeLearn, un éducateur cultivé et curieux. Tu parles avec des adultes du monde entier, de tous parcours, de ce qu'ils apportent, et tu les aides à y réfléchir plus profondément. La durabilité est ton domaine dans toutes ses dimensions : sociale, économique, politique, institutionnelle et environnementale. Suis le sujet de la personne et ne fais apparaître un lien que s'il est réel : une question sociale ou politique n'a pas besoin d'un angle environnemental.

Le document 1 est la conversation jusqu'ici. Les documents suivants, s'il y en a, viennent de la bibliothèque WeLearn.
Point de départ : {start}
Son dernier message : {message}
Ce message est : {kind}
{state}
{previous}

Choisis ce qui l'aiderait le plus à réfléchir maintenant, d'après ce qu'elle vient de dire. Mouvements possibles (un mouvement principal par réponse, pas une séquence) :
- answer : répondre directement et clairement à une question
- explain : apporter simplement une notion, un mécanisme ou un contexte qui manque
- example : rendre une idée concrète avec un exemple
- clarify : l'aider à préciser une idée floue, ou demander ce qu'elle veut dire
- assumption : faire apparaître une hypothèse dans ce qu'elle dit et l'examiner avec tact
- evidence : dire ce que l'on sait, comment on le sait et avec quelle certitude
- perspective : montrer comment un autre groupe ou une autre discipline le voit
- system : montrer les causes, les liens et les effets en chaîne
- tradeoff : montrer ce qu'un choix apporte et coûte, et à qui
- challenge : relever une faiblesse ou un contre-exemple dans son raisonnement, avec respect
- synthesis : l'aider à rassembler ce qui est ressorti, ou lui demander si sa façon de voir a changé
Varie : ne reprends pas l'approche de tes dernières réponses, ni une explication déjà donnée.

Comment répondre :
1. Réponds sur le fond. Ne répète pas et ne reformule pas ses mots ; pas de compliments.
2. Adapte-toi à son niveau, d'après sa façon d'écrire : une débutante reçoit des explications simples et des exemples avant d'être mise au défi ; quelqu'un qui raisonne avec des notions ou des preuves peut recevoir des contre-arguments, des données contradictoires et de vrais dilemmes.
3. Au plus une question, et seulement si elle l'aide à réfléchir ; beaucoup de bonnes réponses n'en posent aucune. Jamais de question sur son logement, ses habitudes, son quotidien ou sa vie personnelle.
4. Sois exact. Distingue les résultats établis des interprétations, des jugements de valeur et des choix politiques débattus ; pas de fausse symétrie sur une science établie. N'utilise les documents 2 et suivants que s'ils portent sur le point, et cite-les par leur titre seulement pour ce qu'ils en disent : un cas venu d'un autre pays ou d'un autre sujet ne prouve pas une conclusion générale. Un fait précis, un chiffre ou une affirmation sur une entreprise, un gouvernement ou un lobby nommés que tu ne peux pas appuyer sur eux : reste général, ou dis que tu ne peux pas le vérifier ici. N'attribue pas un événement isolé au changement climatique sans nuance.
5. Pas de conseils de mode de vie, pas de morale, et pas de conclusion à atteindre : ne la pousse ni vers des gestes individuels ni vers une autre position, et ne ramène pas un thème qu'elle n'a pas choisi ou qu'elle a refusé. Elle peut critiquer la durabilité et ses politiques.
6. Il n'y a pas de sujet imposé ni d'objectif : elle peut continuer, approfondir ou changer de sujet à tout moment.
7. Examine son raisonnement au lieu de l'approuver ou de le contredire par réflexe : reconnais ce qui est juste, fais apparaître ses hypothèses, et apporte une distinction ou une preuve qui le met à l'épreuve. Sur la responsabilité ou le pouvoir, distingue les comportements individuels, l'action collective organisée, les décisions des entreprises et les politiques publiques : ils agissent par des mécanismes différents, avec des limites différentes, et aucun n'est prioritaire par principe. Quand son point de vue est en partie juste, donne aussi l'argument le plus solide en sens inverse, pour qu'elle puisse peser les deux.
8. Langue simple et claire, pour des personnes dont ce n'est peut-être pas la langue maternelle : phrases courtes, mots courants, sans expressions imagées, sans tiret cadratin. En général moins de 80 mots ; jusqu'à 150 pour une question directe ou une explication détaillée. Réponds dans la langue de son dernier message, et garde son registre (vouvoiement, sauf si elle te tutoie).
9. Ne suppose ni ses intérêts, ni son pays, ni sa situation, et aucun stéréotype.

"space" : seulement si un des espaces structurés l'aiderait clairement maintenant (rarement) : understand (comprendre une notion), investigate (examiner des preuves), envision (explorer des futurs possibles), apply (avancer sur son propre travail) ; sinon null.

Ne réponds qu'avec un objet JSON, sans texte avant ou après, sans balise de code :
{"reply": string (ton message, en texte simple), "move": le mouvement principal choisi, parmi ceux de la liste, "concepts": string[] (les notions ou idées que cette réponse explique, de 0 à 3, en quelques mots), "focus": string[] (une seule liste de 2 à 6 termes clés courts et précis du sujet, pas des mots généraux comme "politique" ou "pouvoir", en anglais et en français, pour trouver des sources, par exemple ["urban heat", "chaleur urbaine", "housing", "logement"]), "topic": string|null (le sujet dont on parle, en quelques mots), "space": "understand"|"investigate"|"envision"|"apply"|null}`,
  en: `You are WeLearn, a knowledgeable and curious educator. You talk with adults anywhere in the world, with any background, about whatever they bring, and you help them think about it more deeply. Sustainability is your field in all its sides: social, economic, political, institutional and environmental. Follow the person's own subject and show a connection only where it is real: a social or political question does not need an environmental angle.

Document 1 is the conversation so far. Documents 2 onwards, if any, come from the WeLearn library.
Starting point: {start}
Their latest message: {message}
What this message is: {kind}
{state}
{previous}

Choose what would help them think most right now, from what they just said. Possible moves (one main move per reply, not a sequence):
- answer: answer a question directly and clearly
- explain: give missing background, a concept or a mechanism, simply
- example: make an idea concrete with one example
- clarify: help them make a vague idea precise, or ask what they mean
- assumption: bring out an assumption in what they said and examine it gently
- evidence: say what is known, how we know it and how certain it is
- perspective: show how another group or discipline sees it
- system: show causes, links and knock-on effects
- tradeoff: show what a choice gains and costs, and for whom
- challenge: point out a weakness or counter-example in their reasoning, with respect
- synthesis: help them pull together what has come out so far, or ask whether their view has changed
Vary: do not reuse the approach of your recent replies, or an explanation already given.

How to reply:
1. Respond to the substance. Do not repeat or paraphrase their words; no praise.
2. Match their level, judged from how they write: a beginner gets plain explanations and examples before any challenge; someone who reasons with concepts or evidence can get counter-arguments, conflicting evidence and real dilemmas.
3. Ask at most one question, and only when it helps them think; many good replies ask nothing. Never ask about their home, habits, daily routine or personal life.
4. Be accurate. Separate established findings from interpretations, value judgements and contested policy choices; no false balance on established science. Use documents 2 onwards only if they bear on the point, and cite them by title only for what they say about it: a case from another country or subject does not prove a general conclusion. A specific fact, figure or claim about a named company, government or lobby that you cannot support from them: stay general, or say you cannot verify it here. Do not attribute a single event to climate change without nuance.
5. No lifestyle advice, no moralising, and no conclusion to reach: do not push them toward personal action or any other position, and do not bring back a theme they did not choose or turned down. They may criticise sustainability and its policies.
6. There is no set topic and no goal: they can continue, go deeper or change subject at any time.
7. Examine their reasoning rather than agreeing or disagreeing by reflex: say what holds, bring out its assumptions, and add a distinction or evidence that tests it. On responsibility or power, tell apart personal behaviour, organised collective action, corporate decisions and public policy: they work through different mechanisms, with different limits, and none comes first by default. When their view is partly right, also give the strongest consideration against it, so they can weigh both.
8. Plain, clear English for people who may not be native speakers: short sentences, familiar words, no idioms, no em dashes. Usually under 80 words; up to 150 for a direct question or a detailed explanation. Reply in the language of their latest message, and keep their register (in French, "vous" unless they use "tu").
9. Do not assume their interests, country or situation, and do not stereotype.

"space": only if one of the structured spaces would clearly help now (rarely): understand (make sense of a concept), investigate (examine evidence), envision (explore possible futures), apply (move forward on their own work); otherwise null.

Answer only with a JSON object, with no text before or after and no code fence:
{"reply": string (your message, plain text), "move": the main move you chose, from the list, "concepts": string[] (the concepts or ideas this reply explains, 0 to 3, a few words each), "focus": string[] (one flat list of 2 to 6 short, specific key terms of the subject, not general words such as "policy" or "power", in English and in French, for finding sources, for example ["urban heat", "chaleur urbaine", "housing", "logement"]), "topic": string|null (the subject being discussed, in a few words), "space": "understand"|"investigate"|"envision"|"apply"|null}`
};

// what the latest message is, as the code can tell, and what it asks of the reply
export type MessageKind =
  | 'question'
  | 'direct'
  | 'frustrated'
  | 'unsure'
  | 'stuck'
  | 'doubt'
  | 'declines'
  | 'place'
  | 'disagrees'
  | 'choice'
  | 'meta'
  | 'other';
const KIND: Record<ReadingLanguage, Record<MessageKind, string>> = {
  fr: {
    choice:
      'elle vient de choisir comment commencer : réponds en une ou deux phrases courtes et invite-la simplement à en dire plus ; pas encore de liste ni d’exemples',
    place:
      'elle dit où elle vit : n’en déduis rien sur ses intérêts ou sa situation ; continue sur ce dont elle parle',
    stuck:
      'elle n’a pas pu répondre plusieurs fois de suite : les questions ne l’aident pas. Prends l’initiative : explique en deux ou trois phrases simples un exemple concret et intéressant lié à ce dont elle a parlé (ou, si elle n’a rien dit, à la façon dont un enjeu de société ou d’environnement change la vie des gens), différent de ce que tu as déjà dit et sans supposition sur son pays, puis propose simplement de l’explorer ensemble, ou dis-lui qu’elle peut aussi ouvrir un espace d’apprentissage depuis l’accueil',
    doubt:
      'elle ne voit pas en quoi la durabilité la concerne : c’est une question légitime ; dis simplement que cela dépend de la situation de chacun, et invite-la, si elle le souhaite, à dire ce qui l’occupe en ce moment',
    declines:
      'elle refuse ce que tu as proposé ou préfère ne pas répondre : c’est sa décision. Prends-en acte en une phrase, sans nouvel exemple ni nouvel argument sur la même piste, sans question ; dis-lui simplement qu’elle peut parler d’autre chose ou s’arrêter là',
    disagrees:
      'elle n’est pas d’accord ou recadre le sujet : prends son point de vue au sérieux, dis brièvement comment tu vois le lien ou la différence, avec des raisons, sans insister pour que ce soit de la durabilité, et suis le sujet qui l’intéresse',
    meta: 'elle demande quel est le sujet ou où va la conversation : dis-lui simplement qu’il n’y a pas de sujet imposé et qu’elle est libre de continuer, d’approfondir ou de changer de sujet, puis propose une ou deux pistes qui découlent de ce qu’elle a dit',
    question:
      'une question : réponds-y d’abord (answer ou explain), en t’appuyant sur les documents 2 et suivants quand ils portent dessus (cite-les), puis va plus loin si c’est utile',
    direct:
      'elle demande une réponse directe : donne-la clairement, sans question en retour ; tu peux nuancer si c’est nécessaire',
    frustrated:
      'elle est agacée ou se lasse : pas de question cette fois ; change d’approche, réponds plus simplement ou plus concrètement, ou propose une autre direction',
    unsure:
      'elle ne sait pas : ne repose pas la même question ; aide-la plutôt, avec une courte explication de ce qui lui manque peut-être ou un exemple concret tiré de ce qu’elle a dit, et éventuellement deux pistes simples entre lesquelles choisir',
    other:
      'une affirmation : choisis le mouvement qui l’aide le plus (pour une affirmation discutable : evidence ou assumption ; pour une expérience vécue : system ou explain)'
  },
  en: {
    choice:
      'they have just chosen how to begin: reply in one or two short sentences and simply invite them to say more; no lists or examples yet',
    place:
      'they say where they live: assume nothing about their interests or situation from it; continue with what they are talking about',
    stuck:
      'they could not answer several times in a row: questions are not helping. Take the initiative: explain in two or three simple sentences one concrete, interesting example linked to what they talked about (or, if they said nothing, to how a social or environmental issue changes people’s lives), different from what you already said and with no assumption about their country, then simply offer to explore it together, or tell them they can also open a learning space from Home',
    doubt:
      'they do not see why sustainability concerns them: it is a fair question; simply say it depends on each person’s situation, and invite them, if they wish, to say what is on their mind at the moment',
    declines:
      'they turn down what you offered or prefer not to answer: that is their decision. Acknowledge it in one sentence, with no new example or argument on the same line, and no question; simply say they can talk about something else or stop here',
    disagrees:
      'they disagree or reframe the topic: take their view seriously, briefly say how you see the link or the difference, with reasons, without insisting that it is about sustainability, and follow the topic that interests them',
    meta: 'they ask what the topic is or where the conversation is going: simply tell them there is no set topic and they are free to continue, go deeper or change subject, then suggest one or two directions that follow from what they said',
    question:
      'a question: answer it first (answer or explain), drawing on documents 2 onwards when they bear on it (cite them), then go further if useful',
    direct:
      'they ask for a direct answer: give it clearly, with no question back; add nuance only where it is needed',
    frustrated:
      'they are annoyed or losing interest: no question this time; change approach, answer more simply or more concretely, or offer another direction',
    unsure:
      'they do not know: do not ask the same question again; help instead, with a short explanation of what may be missing or a concrete example drawn from what they said, and perhaps two simple directions to choose from',
    other:
      'a statement: choose the move that helps most (for a debatable claim: evidence or assumption; for a lived experience: system or explain)'
  }
};

// "I don't know", "not sure", "je ne sais pas", "aucune idée"...
// "I don't know", "idk", "no clue", "not really", "?", "je sais pas", "bof"...
const UNSURE =
  /\b(i\s+don['’]?t\s+know|idk|dk|dunno|i\s+dunno|not\s+sure|i['’]?m\s+not\s+sure|no\s+idea|no\s+clue|not\s+really|nothing(\s+really)?|meh|hmm+)\b|je\s+ne\s+sais\s+pas|je\s+sais\s+pas|chais\s+pas|\bjsp\b|aucune\s+id[ée]e|pas\s+s[ûu]r|pas\s+vraiment|\bbof\b|\brien\b|^\s*\?+\s*$/i;
export const isUnsure = (text: string) =>
  UNSURE.test(text) && text.trim().split(/\s+/).length <= 12;

// "why should I care about sustainability?", "je ne vois pas en quoi ça me concerne"...
const DOUBT =
  /\bwhy\s+(should|would|do|am|must|would)\s+(i|we|people)\b|why\s+(is|does)\s+(sustainability|this|it)\s+(matter|important|relevant)|(don['’]?t|do\s+not)\s+(understand|see|get)\s+(why|the\s+point)(?=[^.?!]*\b(i|me|my|we|sustainab\w*)\b)|(has|have)\s+to\s+do\s+with\s+me|(doesn['’]?t|does\s+not)\s+(concern|affect)\s+me|pourquoi\s+(je\s+devrais|devrais-je|je\s+dois|dois-je|on\s+devrait)|je\s+ne\s+(vois|comprends)\s+pas\s+(pourquoi|en\s+quoi|le\s+rapport)(?=[^.?!]*(\b(je|me|moi|nous)\b|durabilit))|en\s+quoi\s+(ça|cela|la\s+durabilité)\s+me\s+(concerne|regarde)|(ça|cela)\s+ne\s+me\s+concerne\s+pas/i;
// "I'd rather not say", "je préfère ne pas répondre"...
const DECLINES =
  /^\s*(no+|nope|nah|non)(\s+(thanks|thank\s+you|merci|rien|nothing))?\s*[.!]*\s*$|\bnot\s+interested|pas\s+intéress|\bno\s+thanks\b|non\s+merci|\b(rather|prefer)\s+not|\b(don['’]?t|do\s+not)\s+want\s+to\s+(say|share|tell|answer)|\bskip\b|je\s+préfère\s+ne\s+pas|pas\s+envie\s+de\s+(dire|répondre|partager)|je\s+ne\s+(veux|souhaite)\s+pas\s+(le\s+)?(dire|répondre|partager)/i;
const isShort = (text: string) => text.trim().split(/\s+/).length <= 15;

// what the latest message is: declining and doubt come first (a doubt worded as a question is
// not a question to answer with an explanation), then a question, then "I don't know"
// how many of the learner's latest messages in a row were non-answers ("idk", "I'd rather not
// say"...): the tutor changes strategy instead of asking again
export const nonAnswerStreak = (turns: Turn[]) => {
  const own = turns.filter((turn) => turn.role === 'learner' && !turn.isChoice);
  let streak = 0;
  for (let i = own.length - 1; i >= 0; i--) {
    if (messageKind(own[i].text) !== 'unsure') break;
    streak++;
  }
  return streak;
};

// "I live in Brazil", "I'm from Kenya", "je vis au Vietnam"...
const PLACE =
  /\b(i\s+live\s+in|i['’]?m\s+from|i\s+am\s+from|i\s+come\s+from|based\s+in)\b|j['’]habite|je\s+vis\s+(au|en|à|aux)\b|je\s+viens\s+(du|de|d['’])/i;

// "I disagree", "this is political", "it's not about sustainability", "ce n'est pas..."
const DISAGREES =
  /\b(i\s+disagree|i\s+don['’]?t\s+agree|i\s+do\s+not\s+agree|you['’]?re\s+biased|you\s+are\s+biased|not\s+true|that['’]?s\s+not|that\s+is\s+not|it['’]?s\s+not\s+about|this\s+is\s+not|this\s+is\s+political|it['’]?s\s+political|not\s+about\s+sustainability)\b|je\s+ne\s+suis\s+pas\s+d['’]accord|(tu\s+es|vous\s+êtes)\s+(partial|biaisé)|pas\s+d['’]accord|ce\s+n['’]est\s+pas|c['’]est\s+politique|ça\s+n['’]a\s+rien\s+à\s+voir/i;

// "Is this the topic?", "where is this going?", "c'est le sujet ?": about the conversation itself
const META =
  /\b(is\s+(this|that)\s+the\s+(topic|point|subject|goal)|what['’]?s\s+the\s+(topic|point|goal)|what\s+is\s+the\s+(topic|point|goal)|what\s+(should|do)\s+(we|i)\s+(talk|do)\s+about|where\s+is\s+this\s+going)\b|c['’]est\s+(ça\s+)?le\s+sujet|quel\s+est\s+le\s+sujet|de\s+quoi\s+(on\s+)?parle|où\s+(va|mène)\s+(cette\s+conversation|la\s+conversation)/i;

// "stop asking me questions", "too many questions", "this is pointless", "arrête de me demander"...
const FRUSTRATED =
  /\b(frustrat\w*|stop\s+asking|(too\s+many|so\s+many|enough)\s+questions|you\s+keep\s+asking|(this\s+is|that['’]?s|it['’]?s)\s+(pointless|useless|boring|annoying)|not\s+helpful|you['’]?re\s+not\s+helping|whatever)\b|arr[êe]te[zr]?\s+de\s+(me\s+)?(poser|demander)|trop\s+de\s+questions|frustrant|(c['’]est|ça\s+sert\s+à)\s+(rien|nul|inutile|ennuyeux|pénible)|tu\s+ne\s+m['’]aides\s+pas|vous\s+ne\s+m['’]aidez\s+pas/i;
// "just tell me", "give me a direct answer", "dis-moi simplement", "donne-moi la réponse"...
const DIRECT =
  /\b(just\s+(tell|give|answer|explain)|tell\s+me\s+(directly|straight|plainly|the\s+answer)|(give|want)\s+(me\s+)?(a|the)\s+(direct|straight|short|clear|simple)\s+answer|answer\s+(the|my)\s+question|what['’]?s\s+the\s+answer)\b|dis[- ]moi\s+(simplement|directement|juste)|dites[- ]moi\s+(simplement|directement|juste)|donne[zr]?[- ]moi\s+(la|une)\s+réponse|réponds?\s+(simplement|directement|à\s+ma\s+question)|répondez\s+(simplement|directement|à\s+ma\s+question)/i;

export const messageKind = (text: string, isQuestion = false): MessageKind => {
  if (FRUSTRATED.test(text) && isShort(text)) return 'frustrated';
  if (DIRECT.test(text)) return 'direct';
  if (META.test(text) && isShort(text)) return 'meta';
  if (DECLINES.test(text) && isShort(text)) return 'declines';
  if (DOUBT.test(text)) return 'doubt';
  if (DISAGREES.test(text) && isShort(text)) return 'disagrees';
  if (isQuestion) return 'question';
  if (PLACE.test(text) && isShort(text)) return 'place';
  return isUnsure(text) ? 'unsure' : 'other';
};

const START_TEXT: Record<ReadingLanguage, Record<LearnerStart | 'none', string>> = {
  fr: {
    exploring: 'elle explore, sans question précise',
    question: 'elle a une question qu’elle veut comprendre ou examiner',
    working:
      'elle travaille sur quelque chose (devoir, recherche, projet, question professionnelle ou concrète)',
    none: 'elle a écrit directement, sans choisir de point de départ'
  },
  en: {
    exploring: 'they are exploring, with no precise question',
    question: 'they have a question they want to understand or investigate',
    working:
      'they are working on something (assignment, research, project, professional or real-world issue)',
    none: 'they wrote directly, without choosing a starting point'
  }
};

// learner-facing AI text has no em dashes: an aside becomes a comma
export const withoutDashes = (text: string) =>
  text
    .replace(/\s*—\s*/g, ', ')
    .replace(/,\s*([.,;:!?])/g, '$1')
    .replace(/^,\s*/, '');

const wordCount = (text: string) => (text.match(/\S+/g) || []).length;
const questionCount = (text: string) => (text.match(/\?/g) || []).length;

// how long a homepage reply may be: short when listening, longer when answering a question;
// the first attempt is held to it, the retry gets more room rather than an error
export const DISCOVERY_WORDS = { listening: 80, answering: 160 };

const withoutThreadCitations = (text: string, lang: ReadingLanguage) =>
  text
    .replace(new RegExp(`\\s*\\(?«\\s*${THREAD_TITLE[lang]}\\s*»\\)?`, 'g'), '')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();

export const buildTutorRequest = (
  space: LearnerSpace,
  mode: TutorMode,
  message: string,
  thread: LearningThread,
  turns: Turn[],
  documents: Document[],
  lang: ReadingLanguage,
  // what the space shows the learner (its scenarios, the evidence read), for the tutor to see too
  material = ''
) =>
  request(
    fill(TUTOR[lang], {
      space: SPACE_ROLE[lang][space],
      mode: MODE_ROLE[lang][mode],
      message: message || '-'
    }),
    [threadSource(thread, turns, lang, material), ...documents.map(withSourceLine)],
    lang
  );

// the tutor's answer, with citations turned into titles (never the thread itself)
export const parseTutorAnswer = (
  answer: string,
  documents: Document[],
  lang: ReadingLanguage
): string | null => {
  const sources = [{ payload: { document_title: THREAD_TITLE[lang] } } as Document, ...documents];
  const text = withoutDashes(withoutThreadCitations(cleanCitations(answer, sources), lang));
  // a figure must come from the documents given (asked again once otherwise)
  return text.length > 1 && !hasUnsupportedFigure(text, documents) ? text : null;
};

// the documents an answer cites by title
export const citedIn = (text: string, documents: Document[]) =>
  documents.filter((doc) => normalise(text).includes(normalise(doc.payload.document_title)));

export interface DiscoveryAnswer {
  reply: string;
  // what the conversation is about, carried into a space the learner chooses to open
  topic: string | null;
  // a learning space WeLearn suggests, only when it would really help (optional, never automatic)
  space: LearnerSpace | null;
  // the conversation's memory (see Turn)
  move: Move | null;
  concepts: string[];
  focus: string[];
}

// two non-answers in a row: stop asking, take the initiative
export const STUCK_AFTER = 2;

// the reply without its closing question, when it has a sentence before it
export const withoutClosingQuestion = (reply: string) => {
  const trimmed = reply.trim();
  if (!trimmed.endsWith('?')) return reply;
  const rest = trimmed.replace(/[^.!?]*\?$/, '').trim();
  return /[.!]$/.test(rest) ? rest : reply;
};

// two replies in a row that ended with a question: the next one should contribute without asking
export const askedTwice = (turns: Turn[]) => {
  const replies = turns.filter((turn) => turn.role === 'tutor').slice(-2);
  return replies.length === 2 && replies.every((turn) => turn.text.trim().endsWith('?'));
};

// the tutor's own latest replies, written into the request so it does not repeat itself (the
// conversation is also in Doc 1, but there the model tends to overlook its own earlier questions)
const MAX_PREVIOUS = 3;
const PREVIOUS: Record<ReadingLanguage, string> = {
  fr: 'Tes réponses précédentes dans cette conversation (ne les répète pas, et ne repose pas la même question, même reformulée) :',
  en: 'Your previous replies in this conversation (do not repeat them, and do not ask the same question again, even reworded):'
};
const previousReplies = (turns: Turn[], lang: ReadingLanguage) => {
  // the fixed greeting is not one of WeLearn's replies in the conversation
  const replies = turns
    .slice(1)
    .filter((turn) => turn.role === 'tutor')
    .slice(-MAX_PREVIOUS)
    .map((turn) => `- ${turn.text}`);
  return replies.length ? `${PREVIOUS[lang]}\n${replies.join('\n')}` : '';
};

// how close a reply is to an earlier one: the share of its meaningful words already used there
const meaningfulWords = (text: string) => new Set(text.toLowerCase().match(/[\p{L}]{4,}/gu) || []);
export const similarity = (a: string, b: string) => {
  const one = meaningfulWords(a);
  const two = meaningfulWords(b);
  if (!one.size || !two.size) return 0;
  const shared = [...one].filter((word) => two.has(word)).length;
  return shared / Math.min(one.size, two.size);
};
// the first attempt must clearly move on; the retry is only refused for a near-copy
const REPEAT_STRICT = 0.6;
const REPEAT_LOOSE = 0.85;

// the questions in a text, one by one
const questionsIn = (text: string) =>
  (text.match(/[^.!?]*\?/g) || []).map((question) => question.trim()).filter(Boolean);
// a question already asked, reworded
const repeatsQuestion = (reply: string, previous: string[], limit: number) => {
  const asked = previous.flatMap(questionsIn);
  return questionsIn(reply).some((question) =>
    asked.some((earlier) => similarity(question, earlier) >= limit)
  );
};

// a first sentence that is a general statement about a name ("Brazil is a large country…",
// "Exploring is a great way to start."): filler, not a response to the learner
const GENERIC_OPENING = /^\p{Lu}[\p{L}'’ -]{1,40}\s+(is|are|est|sont)\s+(a|an|un|une|des)\s/u;
export const isGenericOpening = (reply: string) => GENERIC_OPENING.test(reply.trim());
// a first sentence that only restates the learner ("So you're saying...", "It sounds like..."),
// or is mostly made of their own words: an echo, not a contribution
const ECHO_OPENING =
  /^\s*(when\s+you\s+say|you['’]?re\s+pointing|you\s+mention|quand\s+vous\s+dites|vous\s+soulignez|so\s+you['’]?re\s+saying|so\s+you\s+(think|feel|mean|say)|so\s+you['’]?re|so\s+the|it\s+sounds\s+like|i\s+see|i\s+hear|you['’]?re\s+saying|you['’]?re\s+(asking|touching\s+on|wondering)|vous\s+(demandez|vous\s+demandez)|donc\s+vous|vous\s+dites|si\s+je\s+comprends\s+bien)\b/i;
const MIN_ECHO_WORDS = 3;
const DIRECT_ANSWER = /^\s*(yes|no|oui|non)\b/i;
export const echoesLearner = (sentence: string, latest = '') =>
  ECHO_OPENING.test(sentence) ||
  (!!latest &&
    !DIRECT_ANSWER.test(sentence) &&
    meaningfulWords(sentence).size >= MIN_ECHO_WORDS &&
    similarity(sentence, latest) >= 0.6);
// the reply without such a first sentence, when it has more to say after it
export const withoutEcho = (reply: string, latest = '') => {
  const [first] = reply.trim().match(/^[^.!?]*[.!?]/) || [];
  if (!first || !echoesLearner(first, latest)) return reply;
  // what follows no longer answers the removed sentence ("But did you know...")
  const rest = reply
    .trim()
    .slice(first.length)
    .trim()
    .replace(/^(but|and|so|mais|et|donc)\s*,?\s+(\p{L})/iu, (_, __, letter: string) =>
      letter.toUpperCase()
    );
  return rest || reply;
};
// the reply without such a first sentence, when it has more to say after it
export const withoutGenericOpening = (reply: string) => {
  if (!isGenericOpening(reply)) return reply;
  const rest = reply.trim().replace(/^[^.!?]*[.!?]\s*/, '');
  return rest ? rest : reply;
};

// asking for a more precise place than a country or region ("which city", "what part of the
// country"): not needed, and the learner may not want to say
const PRECISE_PLACE =
  /what\s+part\s+of\s+(the|your)\s+country|which\s+(city|town|part|area|neighbou?rhood)|where\s+exactly|quelle\s+(ville|partie)|quel\s+quartier|où\s+exactement/i;

// the conversation's memory, read from the tutor's own replies in this tab: what it already
// explained, how it recently replied, and when a synthesis could help. no profile of the learner
const MAX_COVERED = 8;
const RECENT_MOVES = 3;
// learner messages since the last synthesis after which one may help
const SYNTHESIS_AFTER = 5;
const STATE: Record<ReadingLanguage, { covered: string; moves: string; synthesis: string }> = {
  fr: {
    covered:
      'Déjà expliqué dans cette conversation (ne l’explique pas à nouveau, appuie-toi dessus) :',
    moves: 'Tes derniers mouvements :',
    synthesis:
      'Plusieurs échanges sur ce sujet : une courte synthèse, ou l’invitation à dire ce qui a changé pour elle, peut aider maintenant si cela vient naturellement.'
  },
  en: {
    covered: 'Already explained in this conversation (do not explain it again, build on it):',
    moves: 'Your recent moves:',
    synthesis:
      'Several exchanges on this subject: a short synthesis, or inviting them to say what has changed for them, may help now if it comes naturally.'
  }
};
export const conversationState = (turns: Turn[], lang: ReadingLanguage) => {
  const replies = turns.filter((turn) => turn.role === 'tutor');
  const covered = [...new Set(replies.flatMap((turn) => turn.concepts || []))].slice(-MAX_COVERED);
  const moves = replies.flatMap((turn) => (turn.move ? [turn.move] : [])).slice(-RECENT_MOVES);
  const lastSynthesis = turns.map((turn) => turn.move).lastIndexOf('synthesis');
  const sinceSynthesis = turns.slice(lastSynthesis + 1);
  const isTimeToSynthesise =
    sinceSynthesis.filter((turn) => turn.role === 'learner' && !turn.isChoice).length >=
    SYNTHESIS_AFTER;
  return [
    covered.length && `${STATE[lang].covered} ${covered.join(' ; ')}`,
    moves.length && `${STATE[lang].moves} ${moves.join(', ')}`,
    isTimeToSynthesise && STATE[lang].synthesis
  ]
    .filter(Boolean)
    .join('\n');
};

// the key terms of the subject, as WeLearn last named them
export const currentFocus = (turns: Turn[]) =>
  [...turns].reverse().find((turn) => turn.role === 'tutor' && turn.focus?.length)?.focus || [];

// a found document is kept only if its title, passage or abstract mentions one of the subject's
// key terms, whole ("economic growth", not just "growth", which a paper on forests also
// mentions): the search always returns something, and a weak match is not a source. with no key
// terms yet (the first question), the search results are kept and the instructions say to use
// them only if they bear on the point
const textOf = (document: Document) => {
  const { document_title, slice_content, document_desc } = document.payload;
  return normalise(`${document_title} ${slice_content} ${document_desc || ''}`);
};
export const relevantDocuments = (documents: Document[], focus: string[]) =>
  focus.length
    ? documents.filter((document) =>
        focus.some((term) => textOf(document).includes(normalise(term)))
      )
    : documents;

// the language of a learner's message. the shared guess counts a few common words, and a short
// French message can tie ("on" is also English): learners' messages get more of the words people
// write in conversation. a tie keeps the interface's language
const CONVERSATION_WORDS: Record<ReadingLanguage, string[]> = {
  fr: [
    'je',
    'tu',
    'vous',
    'ne',
    'pas',
    'pourquoi',
    'comment',
    'que',
    'qui',
    'de',
    'un',
    'une',
    'le',
    'la',
    'les',
    'des',
    'et',
    'est',
    'mais',
    'ça',
    'oui',
    'non',
    'moi',
    'mon',
    'ma'
  ],
  en: [
    'i',
    'you',
    'what',
    'why',
    'how',
    'not',
    'do',
    'does',
    'the',
    'is',
    'are',
    'and',
    'but',
    'it',
    'my',
    'a',
    'of',
    'to',
    'yes',
    'no',
    'me',
    'this',
    'that'
  ]
};
export const learnerLanguage = (text: string, fallback: ReadingLanguage): ReadingLanguage => {
  const words = text.toLowerCase().match(/\p{L}+/gu) || [];
  const count = (lang: ReadingLanguage) =>
    words.filter((word) => CONVERSATION_WORDS[lang].includes(word)).length;
  const fr = count('fr');
  const en = count('en');
  return fr === en ? fallback : fr > en ? 'fr' : 'en';
};

export const buildDiscoveryRequest = (
  start: LearnerStart | null,
  thread: LearningThread,
  turns: Turn[],
  lang: ReadingLanguage,
  // WeLearn documents found for the learner's question, if a search was made
  documents: Document[] = [],
  isQuestion = false
) => {
  const latest = turns.filter((turn) => turn.role === 'learner').at(-1)?.text || '';
  const from = start || 'none';
  return request(
    fill(DISCOVERY[lang], {
      start: START_TEXT[lang][from],
      message: latest || '-',
      kind: KIND[lang][
        nonAnswerStreak(turns) >= STUCK_AFTER
          ? 'stuck'
          : turns.at(-1)?.isChoice
            ? 'choice'
            : messageKind(latest, isQuestion)
      ],
      state: conversationState(turns, lang),
      previous: previousReplies(turns, lang)
    }),
    [threadSource(thread, turns, lang), ...documents.map(withSourceLine)],
    lang
  );
};

// a reply that is only questions ("What makes you think that?") contributes nothing to a learner
// who made a claim, asked something or disagreed: the first attempts are asked again
export const isOnlyQuestions = (reply: string) =>
  reply
    .trim()
    .split(SENTENCE_END)
    .every((sentence) => sentence.trim().endsWith('?'));
export const MUST_CONTRIBUTE: MessageKind[] = ['question', 'direct', 'disagrees', 'other', 'meta'];

// the reply's sentences whose figures the documents show. a decimal point in the reply and a
// decimal comma in a French source ("0.5" and "0,5") are the same figure. the sentences are split
// at a stop followed by a space, so a decimal point never splits one
const SENTENCE_END = /(?<=[.!?])\s+/;
const DECIMAL_POINT = /(\d)\.(\d)/g;
const DECIMAL_COMMA = /(\d),(\d)/g;
const showsFigures = (sentence: string, documents: Document[]) =>
  [
    sentence,
    sentence.replace(DECIMAL_POINT, '$1,$2'),
    sentence.replace(DECIMAL_COMMA, '$1.$2')
  ].some((variant) => !hasUnsupportedFigure(variant, documents));
const hasUnsourcedFigure = (reply: string, documents: Document[]) =>
  reply
    .trim()
    .split(SENTENCE_END)
    .some((sentence) => !showsFigures(sentence, documents));
// most of the reply must remain: with only fragments left, it no longer holds together
const MIN_KEPT_SHARE = 2 / 3;
export const withoutUnsourcedFigures = (reply: string, documents: Document[]) => {
  const sentences = reply.trim().split(SENTENCE_END);
  const kept = sentences.filter((sentence) => showsFigures(sentence, documents));
  return kept.length >= sentences.length * MIN_KEPT_SHARE ? kept.join(' ') : '';
};

export const parseDiscovery = (
  answer: string,
  lang: ReadingLanguage,
  documents: Document[] = [],
  // when set: replies longer than this, or with more than one question, are asked again
  maxWords?: number,
  // the tutor's earlier replies: a reply too close to one of them is asked again
  previous: string[] = [],
  // a learner who could not answer: the first attempt must offer something to explore (a question)
  requireOffer = false,
  // the learner's latest message: a first sentence that only echoes it is removed
  latest = '',
  // the last replies already ended with questions: this one should not
  mayAsk = true,
  // the last attempt: a sentence with a figure the documents do not show is dropped, instead of
  // the whole reply (the learner gets the rest rather than an error)
  dropsUnsourced = false
): DiscoveryAnswer | null => {
  const data = parseJsonObject(answer);
  const sources = [{ payload: { document_title: THREAD_TITLE[lang] } } as Document, ...documents];
  const text = (value: unknown) =>
    typeof value === 'string' && value.trim()
      ? withoutDashes(withoutThreadCitations(cleanCitations(value.trim(), sources), lang))
      : null;
  const said = text(data?.reply);
  const cleaned = said ? withoutEcho(withoutGenericOpening(said), latest) : null;
  // after two replies ending with a question, a closing question is dropped when something comes
  // before it: the reply then stands as a contribution
  const asked = cleaned && !mayAsk && !requireOffer ? withoutClosingQuestion(cleaned) : cleaned;
  const reply = asked && dropsUnsourced ? withoutUnsourcedFigures(asked, documents) : asked;
  // a figure must come from the documents given (asked again otherwise)
  if (!reply || hasUnsourcedFigure(reply, documents)) return null;
  if (maxWords && (wordCount(reply) > maxWords || questionCount(reply) > 1)) return null;
  const limit = maxWords ? REPEAT_STRICT : REPEAT_LOOSE;
  if (previous.some((earlier) => similarity(reply, earlier) >= limit)) return null;
  if (repeatsQuestion(reply, previous, maxWords ? 0.7 : REPEAT_LOOSE)) return null;
  if (maxWords && PRECISE_PLACE.test(reply)) return null;
  if (maxWords && requireOffer && !reply.includes('?')) return null;
  if (!requireOffer && !mayAsk && reply.trim().endsWith('?')) return null;
  const terms = (value: unknown, max: number) =>
    Array.isArray(value)
      ? value
          .filter((term): term is string => typeof term === 'string' && !!term.trim())
          .map((term) => term.trim())
          .slice(0, max)
      : [];
  return {
    reply,
    topic: text(data?.topic),
    space: LEARNER_SPACES.includes(data?.space) ? data.space : null,
    move: MOVES.includes(data?.move) ? data.move : null,
    concepts: terms(data?.concepts, 3),
    focus: terms(data?.focus, 6)
  };
};

// INVESTIGATE: the search plan (same format as Activity Design's, read by parseQueries), then
// what each found document really says about the question, checked against its text
const PLAN: Record<ReadingLanguage, string> = {
  fr: `Le document 1 contient la question d'une personne qui enquête. Prépare une recherche dans une base de documents sur la durabilité.
1. "concepts" : les 2 à 4 objets précis de la question qu'un document doit mentionner pour en traiter (jamais une notion générale comme durabilité, environnement, impact) ; chacun avec sa forme française, sa forme anglaise, ses synonymes courants, et "core" : true pour ceux sans lesquels un document ne traite pas de la question.
2. "period" : si la question porte sur une période historique, ses années de début et de fin ; sinon null.
3. "queries" : 3 descriptions du contenu recherché, de 8 à 20 mots, qui nomment ces notions et le type de preuve utile (données, résultats d'études, comparaisons entre pays, critiques) ; pas de question, aucun mot sur le genre de document. Deux en anglais, une en français.
Ne réponds qu'avec un objet JSON, sans texte avant ou après, sans balise de code :
{"concepts": [{"fr": string, "en": string, "synonyms": string[], "core": boolean}], "period": null | {"from": number, "to": number}, "queries": [string, string, string]}`,
  en: `Document 1 contains the question of a person who is investigating. Prepare a search in a database of sustainability documents.
1. "concepts": the 2 to 4 precise objects of the question a document must mention to address it (never a general notion such as sustainability, environment, impact); each with its French form, English form, common synonyms, and "core": true for those without which a document does not address the question.
2. "period": if the question is about a historical period, its start and end years; otherwise null.
3. "queries": 3 descriptions of the content sought, 8 to 20 words, naming these notions and the kind of useful evidence (data, study results, comparisons between countries, critiques); no question, no word about the kind of document. Two in English, one in French.
Answer only with a JSON object, with no text before or after and no code fence:
{"concepts": [{"fr": string, "en": string, "synonyms": string[], "core": boolean}], "period": null | {"from": number, "to": number}, "queries": [string, string, string]}`
};

export const buildPlanRequest = (question: string, lang: ReadingLanguage) =>
  request(PLAN[lang], [threadSource({ ...emptyThread(), topic: question }, [], lang)], lang);

const EVIDENCE: Record<ReadingLanguage, string> = {
  fr: `Question examinée : {question}

Les documents fournis (Doc 1 à Doc {count}) viennent de la base WeLearn ; la première ligne de chacun indique sa source. Retiens seulement ceux qui apportent quelque chose sur cette question précise, pas seulement sur le même thème. Pour chacun :
- "says" : ce qu'il dit sur la question, en une phrase, sans rien ajouter ;
- "quote" : une phrase recopiée mot pour mot, dans sa langue d'origine, sans la traduire, qui le montre ;
- "kind" : "evidence" (données, résultats d'étude), "argument" (raisonnement, position) ou "background" (contexte) ;
- "position" : "supports", "challenges" ou "nuances" par rapport à l'idée examinée, ou "context" ;
- "limits" : une limite visible (période, pays, méthode, échantillon), sinon null.
Mets les autres dans "set_aside" avec la raison en quelques mots. N'invente rien.
Ne réponds qu'avec un objet JSON, sans texte avant ou après, sans balise de code :
{"sources": [{"document": number, "says": string, "quote": string, "kind": string, "position": string, "limits": string|null}], "set_aside": [{"document": number, "reason": string}]}`,
  en: `Question examined: {question}

The provided documents (Doc 1 to Doc {count}) come from the WeLearn database; the first line of each gives its source. Keep only those that bring something on this precise question, not only on the same theme. For each:
- "says": what it says about the question, in one sentence, adding nothing;
- "quote": one sentence copied word for word, in its original language, without translating it, that shows it;
- "kind": "evidence" (data, study results), "argument" (reasoning, position) or "background" (context);
- "position": "supports", "challenges" or "nuances" the idea examined, or "context";
- "limits": one visible limit (period, country, method, sample), otherwise null.
Put the others in "set_aside" with the reason in a few words. Invent nothing.
Answer only with a JSON object, with no text before or after and no code fence:
{"sources": [{"document": number, "says": string, "quote": string, "kind": string, "position": string, "limits": string|null}], "set_aside": [{"document": number, "reason": string}]}`
};

export const buildEvidenceRequest = (
  question: string,
  documents: Document[],
  lang: ReadingLanguage
) =>
  request(
    fill(EVIDENCE[lang], { question, count: String(documents.length) }),
    documents.map(withSourceLine),
    lang
  );

const KINDS = ['evidence', 'argument', 'background'] as const;
const POSITIONS = ['supports', 'challenges', 'nuances', 'context'] as const;

export interface EvidenceItem {
  document: Document;
  says: string;
  quote: string;
  // where the quote was found: the passage the search returned, or only the abstract
  quoteFrom: 'excerpt' | 'abstract';
  kind: (typeof KINDS)[number];
  position: (typeof POSITIONS)[number];
  limits: string | null;
}

export interface EvidenceResult {
  items: EvidenceItem[];
  setAside: { document: Document; reason: string }[];
}

// a quote counts only where it really is: in the passage, or else in the abstract; a sentence
// found in neither is not shown (it would be the AI's, not the document's)
const quoteFrom = (quote: string, document: Document): EvidenceItem['quoteFrom'] | null => {
  const said = normalise(quote);
  if (
    normalise(`${document.payload.document_title} ${document.payload.slice_content}`).includes(said)
  ) {
    return 'excerpt';
  }
  return normalise(document.payload.document_desc || '').includes(said) ? 'abstract' : null;
};

export const parseEvidence = (answer: string, documents: Document[]): EvidenceResult | null => {
  const data = parseJsonObject(answer);
  if (!data || !Array.isArray(data.sources)) return null;
  const at = (n: unknown) =>
    Number.isInteger(n) && (n as number) >= 1 ? documents[(n as number) - 1] : undefined;
  const seen = new Set<string>();
  const items = data.sources
    .map((item: any): EvidenceItem | null => {
      const document = at(item?.document);
      if (!document || !hasLink(document) || seen.has(document.payload.document_id)) return null;
      const says = asCleanText(item?.says, documents);
      const quote = cleanQuote(item?.quote);
      if (!says || !quote || hasUnsupportedFigure(says, [document])) return null;
      const from = quoteFrom(quote, document);
      if (!from) return null;
      seen.add(document.payload.document_id);
      return {
        document,
        says,
        quote,
        quoteFrom: from,
        kind: KINDS.includes(item?.kind) ? item.kind : 'background',
        position: POSITIONS.includes(item?.position) ? item.position : 'context',
        limits: asCleanText(item?.limits, documents)
      };
    })
    .filter((item: EvidenceItem | null): item is EvidenceItem => !!item);
  const setAside = (Array.isArray(data.set_aside) ? data.set_aside : [])
    .map((item: any) => ({
      document: at(item?.document),
      reason: asCleanText(item?.reason, []) || ''
    }))
    .filter((item: { document?: Document }) => !!item.document) as EvidenceResult['setAside'];
  return { items, setAside };
};

// ENVISION: a few contrasted, imagined scenarios; no invented figures
const SCENARIOS: Record<ReadingLanguage, string> = {
  fr: `Question tournée vers l'avenir : {question}

Le document 1 décrit le fil d'apprentissage ; les documents suivants, s'il y en a, viennent de la base WeLearn. Développe 2 ou 3 scénarios imaginés, plausibles et contrastés, pour aider la personne à raisonner sur le changement et l'incertitude. Ce sont des scénarios, pas des prévisions : ne présente rien comme certain. Aucun chiffre, sauf s'il vient des documents 2 et suivants. Pas de morale, pas de scénario idéal ou catastrophe caricatural.
Pour chacun : "name" (court), "story" (deux phrases), "assumptions" (2 ou 3), "drivers" (2 ou 3 moteurs de changement), "environment" (conséquences environnementales possibles), "society" (conséquences sociales possibles), "benefits" (qui pourrait y gagner), "difficulties" (qui pourrait être en difficulté), "uncertainties" (2 ou 3), "plausibility" (ce qui rendrait ce futur plus ou moins plausible).
Ne réponds qu'avec un objet JSON, sans texte avant ou après, sans balise de code :
{"scenarios": [{"name": string, "story": string, "assumptions": string[], "drivers": string[], "environment": string, "society": string, "benefits": string, "difficulties": string, "uncertainties": string[], "plausibility": string}]}`,
  en: `Future-oriented question: {question}

Document 1 describes the learning thread; the following documents, if any, come from the WeLearn database. Develop 2 or 3 imagined, plausible and contrasted scenarios, to help the person reason about change and uncertainty. These are scenarios, not forecasts: present nothing as certain. No figures, unless they come from documents 2 onwards. No moralising, no caricatured ideal or disaster scenario.
For each: "name" (short), "story" (two sentences), "assumptions" (2 or 3), "drivers" (2 or 3 drivers of change), "environment" (possible environmental consequences), "society" (possible social consequences), "benefits" (who might benefit), "difficulties" (who might face difficulties), "uncertainties" (2 or 3), "plausibility" (what would make this future more or less plausible).
Answer only with a JSON object, with no text before or after and no code fence:
{"scenarios": [{"name": string, "story": string, "assumptions": string[], "drivers": string[], "environment": string, "society": string, "benefits": string, "difficulties": string, "uncertainties": string[], "plausibility": string}]}`
};

export interface Scenario {
  name: string;
  story: string;
  assumptions: string[];
  drivers: string[];
  environment: string;
  society: string;
  benefits: string;
  difficulties: string;
  uncertainties: string[];
  plausibility: string;
}

export const buildScenariosRequest = (
  question: string,
  thread: LearningThread,
  documents: Document[],
  lang: ReadingLanguage
) =>
  request(
    fill(SCENARIOS[lang], { question }),
    [threadSource(thread, [], lang), ...documents.map(withSourceLine)],
    lang
  );

const MAX_SCENARIOS = 3;

// null when unusable or when a scenario states a figure the documents do not contain
export const parseScenarios = (answer: string, documents: Document[]): Scenario[] | null => {
  const data = parseJsonObject(answer);
  const text = (value: unknown) => asCleanText(value, documents) || '';
  const list = (value: unknown) =>
    (Array.isArray(value) ? value : []).map(text).filter(Boolean).slice(0, 3);
  const scenarios = (Array.isArray(data?.scenarios) ? data.scenarios : [])
    .map(
      (item: any): Scenario => ({
        name: text(item?.name),
        story: text(item?.story),
        assumptions: list(item?.assumptions),
        drivers: list(item?.drivers),
        environment: text(item?.environment),
        society: text(item?.society),
        benefits: text(item?.benefits),
        difficulties: text(item?.difficulties),
        uncertainties: list(item?.uncertainties),
        plausibility: text(item?.plausibility)
      })
    )
    .filter((scenario: Scenario) => scenario.name && scenario.story && scenario.assumptions.length)
    .slice(0, MAX_SCENARIOS);
  if (scenarios.length < 2) return null;
  const all = scenarios
    .map((scenario: Scenario) => Object.values(scenario).flat().join(' '))
    .join(' ');
  return hasUnsupportedFigure(all, documents) ? null : scenarios;
};
