import { describe, it, expect } from 'vitest';
import type { Document } from '@/types';
import { STUDENT_SPACES } from '@/components/student/spaces';
import {
  LEARNER_SPACES,
  buildDiscoveryRequest,
  buildTutorRequest,
  emptyThread,
  parseDiscovery,
  parseEvidence,
  parseScenarios,
  parseTutorAnswer,
  isUnsure,
  messageKind,
  nonAnswerStreak,
  similarity,
  withoutEcho,
  conversationState,
  currentFocus,
  withoutUnsourcedFigures,
  learnerLanguage,
  isOnlyQuestions,
  relevantDocuments,
  askedTwice,
  isGenericOpening,
  withoutDashes
} from '@/utils/learnerTutor';

const doc = (title: string, content: string, desc = ''): Document =>
  ({
    id: title,
    score: 1,
    payload: {
      document_id: title,
      document_title: title,
      document_url: `https://example.org/${title}`,
      document_sdg: [8],
      document_corpus: 'openalex',
      document_desc: desc,
      document_details: {},
      slice_content: content,
      slice_sdg: null,
      document_lang: 'en'
    }
  }) as unknown as Document;

const thread = {
  ...emptyThread(),
  topic: 'urban heat',
  purpose: 'I want to understand urban heat.'
};

describe('one tutor, with the learning thread as its context', () => {
  it('sends the thread and the recent conversation as Doc 1, the WeLearn documents after it', () => {
    const body = buildTutorRequest(
      'investigate',
      'interpret',
      'What do these sources show?',
      thread,
      [{ role: 'learner', text: 'Cities are hotter at night.' }],
      [doc('Heat islands', 'Night temperatures are higher in dense areas.')],
      'en'
    );
    const [context, source] = body.sources as Document[];
    expect(context.payload.slice_content).toContain('I want to understand urban heat.');
    expect(context.payload.slice_content).toContain('Cities are hotter at night.');
    expect(source.payload.document_title).toBe('Heat islands');
    expect(body.query).toContain('INVESTIGATE');
    expect(body.query).toContain('Ask at most one question');
  });

  it('turns citations into titles and never cites the thread itself', () => {
    const docs = [doc('Heat islands', '')];
    expect(parseTutorAnswer('As [Doc 2] shows, and [Doc 1] says.', docs, 'en')).toBe(
      'As « Heat islands » shows, and says.'
    );
  });
});

describe('evidence: only what the sources really say', () => {
  const study = doc(
    'Growth and happiness',
    'Conforming to the Easterlin paradox, higher income does not always raise happiness over time.',
    'This paper reviews international evidence on income and subjective well-being.'
  );
  const answer = (sources: unknown[]) =>
    JSON.stringify({ sources, set_aside: [{ document: 2, reason: 'other topic' }] });
  const item = (overrides: Record<string, unknown> = {}) => ({
    document: 1,
    says: 'Income growth does not always raise happiness.',
    quote: 'higher income does not always raise happiness over time',
    kind: 'evidence',
    position: 'challenges',
    limits: null,
    ...overrides
  });

  it('keeps a verified excerpt, labels a quote found only in the abstract, drops an invented one', () => {
    const other = doc('Other', 'Unrelated.');
    const parsed = parseEvidence(
      answer([
        item(),
        item({ document: 1, quote: 'This paper reviews international evidence' }),
        item({ document: 2, quote: 'A sentence that is nowhere.' })
      ]),
      [study, other]
    )!;
    expect(parsed.items).toHaveLength(1);
    expect(parsed.items[0]).toMatchObject({ quoteFrom: 'excerpt', position: 'challenges' });
    expect(parsed.setAside[0].reason).toBe('other topic');

    const fromAbstract = parseEvidence(
      answer([item({ quote: 'This paper reviews international evidence on income' })]),
      [study]
    )!;
    expect(fromAbstract.items[0].quoteFrom).toBe('abstract');
  });

  it('drops a summary with a figure the source does not contain', () => {
    const parsed = parseEvidence(answer([item({ says: 'Happiness fell by 40% in 20 years.' })]), [
      study
    ])!;
    expect(parsed.items).toEqual([]);
  });
});

describe('scenarios: imagined, contrasted, no invented figures', () => {
  const scenario = (name: string, story = 'Cities adapt slowly.') => ({
    name,
    story,
    assumptions: ['a'],
    drivers: ['d'],
    environment: 'e',
    society: 's',
    benefits: 'b',
    difficulties: 'h',
    uncertainties: ['u'],
    plausibility: 'p'
  });

  it('needs at least two scenarios, and rejects invented figures', () => {
    expect(
      parseScenarios(JSON.stringify({ scenarios: [scenario('A'), scenario('B')] }), [])
    ).toHaveLength(2);
    expect(parseScenarios(JSON.stringify({ scenarios: [scenario('A')] }), [])).toBeNull();
    expect(
      parseScenarios(
        JSON.stringify({ scenarios: [scenario('A', 'Heat deaths rise by 35%.'), scenario('B')] }),
        []
      )
    ).toBeNull();
  });
});

describe('the four spaces', () => {
  it('are the same list for the pages and the tutor', () => {
    expect([...STUDENT_SPACES]).toEqual([...LEARNER_SPACES]);
  });
});

describe('no figure without a source', () => {
  it('asks again when a tutor answer states a figure its documents do not contain', () => {
    const report = doc('Fashion report', 'The industry accounts for 10% of global emissions.');
    const claim = 'Fashion accounts for 10% of global carbon emissions.';
    expect(parseTutorAnswer(claim, [], 'en')).toBeNull();
    expect(parseTutorAnswer(claim, [report], 'en')).toBe(claim);
    expect(parseDiscovery(JSON.stringify({ reply: claim, space: null }), 'en')).toBeNull();
    expect(
      parseDiscovery(JSON.stringify({ reply: claim, space: null }), 'en', [report])?.reply
    ).toBe(claim);
  });
});

describe('a natural, listening tone', () => {
  it('removes em dashes from what the AI writes to learners', () => {
    expect(withoutDashes('Food waste — even at home — matters.')).toBe(
      'Food waste, even at home, matters.'
    );
    expect(parseTutorAnswer('It depends — on the context.', [], 'en')).toBe(
      'It depends, on the context.'
    );
  });

  it('holds a listening reply to a few sentences and one question, a question to an answer', () => {
    const long = Array.from({ length: 70 }, () => 'word').join(' ') + '.';
    const reply = (text: string) => JSON.stringify({ reply: text, space: null });
    expect(parseDiscovery(reply('What do you notice around you?'), 'en', [], 60)?.reply).toBe(
      'What do you notice around you?'
    );
    expect(parseDiscovery(reply(long), 'en', [], 60)).toBeNull();
    expect(parseDiscovery(reply('Is it work? Or home?'), 'en', [], 60)).toBeNull();
    // the retry has more room
    expect(parseDiscovery(reply(long), 'en', [], 120)).not.toBeNull();
  });

  it('tells the AI whether the latest message is a question to answer first', () => {
    const turns = [{ role: 'learner' as const, text: 'What is biodiversity?' }];
    expect(buildDiscoveryRequest('question', thread, turns, 'en', [], true).query).toContain(
      'a question: answer it first'
    );
    expect(buildDiscoveryRequest('exploring', thread, turns, 'en').query).toContain(
      'a statement: choose the move that helps most'
    );
  });
});

describe('a learner who does not know yet', () => {
  it('is recognised, and offered a concrete choice rather than the same open question', () => {
    expect(
      ['I don’t know.', 'not sure', 'Je ne sais pas trop.', 'Aucune idée'].every(isUnsure)
    ).toBe(true);
    expect(
      isUnsure('I don’t know much about soils but I farm maize near Kisumu every season.')
    ).toBe(false);
    const turns = [{ role: 'learner' as const, text: 'I don’t know.' }];
    expect(buildDiscoveryRequest('exploring', thread, turns, 'en').query).toContain(
      'do not ask the same question again'
    );
  });
});

describe('getting to know the learner, gradually and optionally', () => {
  it('recognises doubt, declining, a question and "I don’t know", in that order', () => {
    expect(messageKind('I don’t understand why I’m supposed to think about sustainability.')).toBe(
      'doubt'
    );
    expect(messageKind('Why should I care about this?', true)).toBe('doubt');
    expect(messageKind('Je ne vois pas en quoi ça me concerne.')).toBe('doubt');
    expect(messageKind('I’d rather not say where I live.')).toBe('declines');
    expect(messageKind('Je préfère ne pas répondre.')).toBe('declines');
    expect(messageKind('Why are cities hotter at night?', true)).toBe('question');
    expect(messageKind('I don’t know.')).toBe('unsure');
    expect(messageKind('I live in Ghana.')).toBe('place');
  });

  it('asks a doubtful learner about their situation instead of explaining sustainability', () => {
    const turns = [
      { role: 'learner' as const, text: 'Why am I supposed to think about sustainability?' }
    ];
    const query = buildDiscoveryRequest(null, thread, turns, 'en', [], true).query;
    expect(query).toContain('it is a fair question; simply say it depends');
    expect(query).toContain('Never ask about their home, habits, daily routine or personal life');
    expect(query).not.toContain('a question: answer it first');
  });
});

describe('a learner who cannot answer: the tutor changes strategy', () => {
  const learner = (text: string) => ({ role: 'learner' as const, text });
  const tutor = (text: string) => ({ role: 'tutor' as const, text });

  it('recognises the many ways of not knowing', () => {
    expect(
      ['idk', 'IDK', 'no clue', 'not really', 'nothing', 'hmm', '?', 'bof', 'je sais pas'].every(
        isUnsure
      )
    ).toBe(true);
    expect(isUnsure('I like football')).toBe(false);
  });

  it('counts non-answers in a row, and stops asking after two', () => {
    const turns = [
      learner('I’m just exploring'),
      tutor('What do you notice around you?'),
      learner('idk'),
      tutor('Is there anything you enjoy?'),
      learner('idk')
    ];
    expect(nonAnswerStreak(turns)).toBe(2);
    expect(nonAnswerStreak(turns.slice(0, 3))).toBe(1);
    const query = buildDiscoveryRequest('exploring', thread, turns.slice(0, 5), 'en').query;
    expect(query).toContain('questions are not helping');
    // its own earlier replies are in the request, not only in Doc 1
    expect(query).toContain('- Is there anything you enjoy?');
  });

  it('refuses a reply that repeats an earlier one, even reworded', () => {
    const earlier = 'Is there something you notice in your daily life that you find interesting?';
    const repeat = JSON.stringify({
      reply: 'Is there something in your daily life that you notice and find interesting?',
      space: null
    });
    const fresh = JSON.stringify({
      reply: 'Here is one example: the price of bread often depends on rain far away.',
      space: null
    });
    expect(
      similarity(
        earlier,
        'Is there something in your daily life that you notice and find interesting?'
      )
    ).toBeGreaterThan(0.8);
    expect(parseDiscovery(repeat, 'en', [], 60, [earlier])).toBeNull();
    expect(parseDiscovery(repeat, 'en', [], undefined, [earlier])).toBeNull();
    expect(parseDiscovery(fresh, 'en', [], 60, [earlier])).not.toBeNull();
  });
});

describe('no repeated question, no generic opening', () => {
  it('refuses a reply whose question was already asked, even after a new example', () => {
    const earlier =
      'Farmers in a dry valley now recycle pond water. Would you like to explore how such systems are set up and who benefits from them?';
    const reply = JSON.stringify({
      reply:
        'Families in a hill town now cook with biogas from farm waste. Would you like to explore how such systems are set up and who benefits from them?',
      space: null
    });
    expect(parseDiscovery(reply, 'en', [], 60, [earlier])).toBeNull();
  });

  it('removes a general statement about a name used as an opening', () => {
    expect(
      isGenericOpening('Brazil is a large country with diverse ecosystems. Where are you?')
    ).toBe(true);
    expect(isGenericOpening('Exploring is a great way to start.')).toBe(true);
    expect(isGenericOpening('That’s a fair question. Where do you live?')).toBe(false);
    expect(isGenericOpening('You live in Brazil. What do you do there?')).toBe(false);
    const reply = JSON.stringify({
      reply: 'Brazil is a large country. What do you do?',
      space: null
    });
    // removed rather than refused, when the reply has more to say
    expect(parseDiscovery(reply, 'en', [], 60)?.reply).toBe('What do you do?');
    expect(parseDiscovery(reply, 'en')?.reply).toBe('What do you do?');
  });
});

describe('no push for a precise place', () => {
  it('asks again, on the first attempt, when the reply asks for a city or part of the country', () => {
    const reply = (text: string) => JSON.stringify({ reply: text, space: null });
    expect(parseDiscovery(reply('What part of the country are you in?'), 'en', [], 60)).toBeNull();
    expect(parseDiscovery(reply('Quelle ville habitez-vous ?'), 'fr', [], 60)).toBeNull();
    expect(parseDiscovery(reply('What do you do there?'), 'en', [], 60)).not.toBeNull();
  });
});

describe('a learner who says where they live, or keeps not knowing', () => {
  it('recognises a place just given, and tells the tutor not to ask for more', () => {
    expect(messageKind('I live in Brazil.')).toBe('place');
    expect(messageKind('Je vis au Vietnam.')).toBe('place');
    const turns = [{ role: 'learner' as const, text: 'I live in Brazil.' }];
    expect(buildDiscoveryRequest(null, thread, turns, 'en').query).toContain(
      'assume nothing about their interests or situation from it'
    );
  });

  it('asks again for an example with no offer when the learner is stuck', () => {
    const example = JSON.stringify({
      reply: 'In Cape Town, water limits changed daily life for everyone.',
      space: null
    });
    expect(parseDiscovery(example, 'en', [], 60, [], true)).toBeNull();
    expect(parseDiscovery(example, 'en', [], 60, [], false)).not.toBeNull();
  });
});

describe('an open conversation', () => {
  it('reads a reply, its topic and an optional space, with no learning purpose', () => {
    expect(
      parseDiscovery(
        JSON.stringify({ reply: 'What made you curious?', topic: null, space: null }),
        'en'
      )
    ).toEqual({
      reply: 'What made you curious?',
      topic: null,
      space: null,
      move: null,
      concepts: [],
      focus: []
    });
    expect(
      parseDiscovery(
        JSON.stringify({
          reply: 'Evidence would help here.',
          topic: 'school funding',
          space: 'investigate'
        }),
        'en'
      )
    ).toMatchObject({
      reply: 'Evidence would help here.',
      topic: 'school funding',
      space: 'investigate'
    });
    expect(parseDiscovery('Sorry.', 'en')).toBeNull();
  });

  it('asks the AI to understand the concern first, without forcing an environmental reading', () => {
    const turns = [
      { role: 'learner' as const, text: 'There are protests about our high schools.' }
    ];
    const query = buildDiscoveryRequest(null, thread, turns, 'en').query;
    expect(query).toContain('a social or political question does not need an environmental angle');
    expect(query).toContain('There is no set topic and no goal');
    expect(query).toContain('Their latest message: There are protests about our high schools.');
    expect(query).not.toContain('"purpose"');
  });
});

describe('a tutor that contributes, not an interviewer', () => {
  it('recognises a learner who disagrees or reframes the topic', () => {
    expect(messageKind('This is not about sustainability.')).toBe('disagrees');
    expect(messageKind('This is political.')).toBe('disagrees');
    expect(messageKind('Je ne suis pas d’accord.')).toBe('disagrees');
    const turns = [{ role: 'learner' as const, text: 'This is political.' }];
    expect(buildDiscoveryRequest(null, thread, turns, 'en').query).toContain(
      'briefly say how you see the link or the difference'
    );
  });

  it('removes a first sentence that only echoes the learner, when more follows', () => {
    expect(
      withoutEcho(
        'So you’re saying this is political. Public schools are funded by political choices, which also shape who gets good conditions.',
        'This is political.'
      )
    ).toBe(
      'Public schools are funded by political choices, which also shape who gets good conditions.'
    );
    expect(
      withoutEcho(
        'Some classrooms are cold and there are not enough teachers. Staffing is set by budgets.',
        'Some classrooms are cold and there are not enough teachers.'
      )
    ).toBe('Staffing is set by budgets.');
    expect(withoutEcho('Budgets decide staffing. What do you think?', 'It is political.')).toBe(
      'Budgets decide staffing. What do you think?'
    );
  });

  it('asks the AI to contribute knowledge, with a question only when it helps', () => {
    const turns = [{ role: 'learner' as const, text: 'Teachers are leaving.' }];
    const query = buildDiscoveryRequest(null, thread, turns, 'en').query;
    expect(query).toContain('one main move per reply, not a sequence');
    expect(query).toContain('many good replies ask nothing');
    expect(query).toContain('a statement: choose the move that helps most');
    expect(query).not.toContain('listen and reply briefly');
  });
});

describe('varied replies: no echo, not always a question, a simple first reply', () => {
  const learner = (text: string, isChoice = false) => ({
    role: 'learner' as const,
    text,
    isChoice
  });
  const tutor = (text: string) => ({ role: 'tutor' as const, text });

  it('removes "When you say..." as an echo', () => {
    expect(
      withoutEcho(
        'When you say this is political, you mean it is about power. Schools are funded by public choices.',
        'This is political.'
      )
    ).toBe('Schools are funded by public choices.');
  });

  it('after two replies ending with a question, the next first attempt must not end with one', () => {
    const turns = [tutor('Why?'), learner('Because.'), tutor('And then?')];
    expect(askedTwice(turns)).toBe(true);
    const reply = JSON.stringify({
      reply: 'Schools depend on budgets. Who decides them?',
      space: null
    });
    // the closing question is dropped, the contribution stays
    expect(parseDiscovery(reply, 'en', [], 80, [], false, '', false)?.reply).toBe(
      'Schools depend on budgets.'
    );
    expect(parseDiscovery(reply, 'en', [], 80, [], false, '', true)?.reply).toBe(
      'Schools depend on budgets. Who decides them?'
    );
    // a reply that is only a question is asked for again
    const onlyQuestion = JSON.stringify({ reply: 'Who decides the budgets?', space: null });
    expect(parseDiscovery(onlyQuestion, 'en', [], 80, [], false, '', false)).toBeNull();
  });

  it('answers a clicked starter simply', () => {
    const query = buildDiscoveryRequest(
      'exploring',
      thread,
      [learner('I’m just exploring', true)],
      'en'
    ).query;
    expect(query).toContain('they have just chosen how to begin');
  });
});

describe('a question about the conversation itself', () => {
  it('recognises "Is this the topic?" and tells the AI the learner is free to go on or change', () => {
    expect(messageKind('Is this the topic?', true)).toBe('meta');
    expect(messageKind('C’est ça le sujet ?', true)).toBe('meta');
    expect(messageKind('Why are summers hotter in cities?', true)).toBe('question');
    const turns = [{ role: 'learner' as const, text: 'Is this the topic?' }];
    const query = buildDiscoveryRequest(null, thread, turns, 'en', [], true).query;
    expect(query).toContain('ask what the topic is or where the conversation is going');
    expect(query).toContain('they can continue, go deeper or change subject at any time');
  });
});

describe('choosing the next move, not always a question', () => {
  const learner = (text: string) => ({ role: 'learner' as const, text });
  const tutor = (text: string, extra = {}) => ({ role: 'tutor' as const, text, ...extra });

  it('recognises a request for a direct answer and frustration with questions', () => {
    expect(messageKind('Just tell me, is nuclear power low-carbon?', true)).toBe('direct');
    expect(messageKind('Donnez-moi la réponse.')).toBe('direct');
    expect(messageKind('Stop asking me questions.')).toBe('frustrated');
    expect(messageKind('Trop de questions !')).toBe('frustrated');
    expect(messageKind('Why are cities hotter at night?', true)).toBe('question');
    const query = buildDiscoveryRequest(
      null,
      thread,
      [learner('Stop asking me questions.')],
      'en'
    ).query;
    expect(query).toContain('no question this time; change approach');
    expect(
      buildDiscoveryRequest(null, thread, [learner('Just tell me the answer.')], 'en').query
    ).toContain('give it clearly, with no question back');
  });

  it('reads the move, the concepts explained and the key terms, ignoring anything else', () => {
    const parsed = parseDiscovery(
      JSON.stringify({
        reply: 'Dense streets keep heat at night.',
        move: 'system',
        concepts: ['urban heat island', 42],
        focus: ['urban heat', 'îlot de chaleur'],
        topic: 'heat in cities',
        space: null
      }),
      'en'
    );
    expect(parsed).toMatchObject({
      move: 'system',
      concepts: ['urban heat island'],
      focus: ['urban heat', 'îlot de chaleur']
    });
    const unknown = parseDiscovery(JSON.stringify({ reply: 'Fine.', move: 'lecture' }), 'en');
    expect(unknown?.move).toBeNull();
  });

  it('remembers what was explained and how WeLearn replied, and suggests a synthesis later', () => {
    const turns = [
      learner('Summers are hot here.'),
      tutor('Cities keep heat.', { move: 'explain', concepts: ['urban heat island'] }),
      learner('I cannot afford air conditioning.'),
      tutor('Housing quality matters.', { move: 'system', concepts: ['heat and housing'] })
    ];
    const state = conversationState(turns, 'en');
    expect(state).toContain('Already explained in this conversation');
    expect(state).toContain('urban heat island ; heat and housing');
    expect(state).toContain('Your recent moves: explain, system');
    expect(state).not.toContain('synthesis');
    expect(buildDiscoveryRequest(null, thread, turns, 'en').query).toContain(state);
    const long = [...turns, ...['a', 'b', 'c'].map((text) => learner(`I think ${text}.`))];
    expect(conversationState(long, 'en')).toContain('a short synthesis');
  });

  it('keeps only the documents that mention the subject, once the subject has key terms', () => {
    const heat = doc('Urban heat island and housing', 'Cities stay warmer at night.');
    const medical = doc('Statin therapy outcomes', 'Patients were followed for five years.');
    const turns = [tutor('Cities keep heat.', { focus: ['urban heat', 'heatwave'] })];
    expect(currentFocus(turns)).toEqual(['urban heat', 'heatwave']);
    expect(relevantDocuments([heat, medical], currentFocus(turns))).toEqual([heat]);
    // no key terms yet: nothing to judge by, the instructions decide
    expect(relevantDocuments([heat, medical], [])).toEqual([heat, medical]);
  });

  it('does not leave a dangling "But" when an echo is removed', () => {
    expect(
      withoutEcho(
        'So you’re using cold showers. But did you know roofs matter too?',
        'I use cold showers.'
      )
    ).toBe('Did you know roofs matter too?');
  });
});

describe('real conversations: what the first live run showed', () => {
  it('keeps a short direct answer even when it uses the learner’s words', () => {
    expect(
      withoutEcho(
        'Yes, decoupling is far too slow. Most cuts are relative.',
        'Is decoupling not far too slow?'
      )
    ).toBe('Yes, decoupling is far too slow. Most cuts are relative.');
    expect(
      withoutEcho('Oui, c’est grave. Les salaires sont très bas.', 'Est-ce vraiment si grave ?')
    ).toBe('Oui, c’est grave. Les salaires sont très bas.');
  });

  it('does not take "I don’t understand why we talk about X" for a doubt about sustainability', () => {
    expect(messageKind('Je ne comprends pas pourquoi on parle autant de la fast fashion.')).toBe(
      'other'
    );
    expect(messageKind('Je ne vois pas en quoi ça me concerne.')).toBe('doubt');
  });

  it('accepts a figure written "0.5" from a source that writes "0,5", and drops only unsourced sentences at the end', () => {
    const french = doc('Pathologie liée à la chaleur', 'une hausse de 0,5 °C de la peau');
    const reply = JSON.stringify({ reply: 'Skin warms by 0.5°C first. Then it adapts.' });
    expect(parseDiscovery(reply, 'en', [french])?.reply).toBe(
      'Skin warms by 0.5°C first. Then it adapts.'
    );
    const invented =
      'Older people need 3.2°C more. Their bodies react later. They notice heat less.';
    expect(parseDiscovery(JSON.stringify({ reply: invented }), 'en', [french])).toBeNull();
    expect(
      parseDiscovery(
        JSON.stringify({ reply: invented }),
        'en',
        [french],
        undefined,
        [],
        false,
        '',
        true,
        true
      )?.reply
    ).toBe('Their bodies react later. They notice heat less.');
    expect(withoutUnsourcedFigures('It rose 4.5%. It is debated. Few agree.', [])).toBe(
      'It is debated. Few agree.'
    );
    // only fragments would be left: nothing is kept
    expect(withoutUnsourcedFigures('It rose 4.5%. Then 3.2%. So it is.', [])).toBe('');
  });
});

describe('the second live run', () => {
  it('reads a short French message as French', () => {
    expect(
      learnerLanguage('Je ne comprends pas pourquoi on parle autant de la fast fashion.', 'en')
    ).toBe('fr');
    expect(learnerLanguage('Why do some people suffer more from heat?', 'fr')).toBe('en');
    expect(learnerLanguage('idk', 'en')).toBe('en');
  });

  it('needs a whole key term, not one word of it, to keep a document', () => {
    const forest = doc('Boreal forest dynamics', 'Tree growth and mortality set the pace.');
    const decoupling = doc('Green growth', 'Decoupling of emissions from economic growth.');
    expect(relevantDocuments([forest, decoupling], ['economic growth', 'decoupling'])).toEqual([
      decoupling
    ]);
  });
});

describe('a refusal is respected, and an argument is examined', () => {
  const learner = (text: string) => ({ role: 'learner' as const, text });
  const tutor = (text: string) => ({ role: 'tutor' as const, text });

  it('takes "no" for a refusal, not for not knowing, and does not take the initiative after it', () => {
    expect(['no', 'No.', 'nope', 'Non merci', 'not interested'].map((t) => messageKind(t))).toEqual(
      ['declines', 'declines', 'declines', 'declines', 'declines']
    );
    expect(messageKind('idk')).toBe('unsure');
    const turns = [
      learner('Why should I sacrifice when the rich pollute far more?'),
      tutor('Would you like to look at how clothing choices add up?'),
      learner('not really'),
      tutor('Shall we look at one example?'),
      learner('no')
    ];
    // one "not really", then a refusal: no streak of not knowing
    expect(nonAnswerStreak(turns)).toBe(0);
    const query = buildDiscoveryRequest(null, thread, turns, 'en').query;
    expect(query).toContain('that is their decision');
    expect(query).toContain('no new example or argument on the same line');
    expect(query).not.toContain('Take the initiative');
  });

  it('asks the AI to examine the reasoning and to tell levels of responsibility apart', () => {
    const query = buildDiscoveryRequest(
      null,
      thread,
      [learner('Governments and big companies should act, not me.')],
      'en'
    ).query;
    expect(query).toContain(
      'Examine their reasoning rather than agreeing or disagreeing by reflex'
    );
    expect(query).toContain(
      'personal behaviour, organised collective action, corporate decisions and public policy'
    );
    expect(query).toContain('do not bring back a theme they did not choose or turned down');
    expect(query).toContain('claim about a named company, government or lobby');
  });
});

describe('a claim gets a contribution, and its strongest counter-consideration', () => {
  it('recognises disagreement, an accusation of bias and frustration', () => {
    expect(messageKind('I do not agree, you are biased.')).toBe('disagrees');
    expect(messageKind('Vous êtes partial.')).toBe('disagrees');
    expect(messageKind('This is frustrating.')).toBe('frustrated');
  });

  it('tells a reply made only of questions from one that contributes', () => {
    expect(isOnlyQuestions('What makes you think renewables cannot scale?')).toBe(true);
    expect(isOnlyQuestions('Why? And how?')).toBe(true);
    expect(isOnlyQuestions('Costs of solar fell sharply. What makes you doubt it?')).toBe(false);
  });

  it('asks for the strongest consideration against a partly right view, and no stretched source', () => {
    const query = buildDiscoveryRequest(
      null,
      thread,
      [{ role: 'learner' as const, text: 'We need stronger policies, not individual guilt.' }],
      'en'
    ).query;
    expect(query).toContain('also give the strongest consideration against it');
    expect(query).toContain(
      'a case from another country or subject does not prove a general conclusion'
    );
  });
});
