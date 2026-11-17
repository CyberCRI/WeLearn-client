import type {
  ConceptsStructure,
  DimensionsStructure,
  ExampleStructure,
  GreenCompStructure,
  MythStructure,
  ModuleContent,
  ModuleStructure,
  ModuleText,
  SdgsStructure,
  SortStructure,
  Step,
  StepStructure,
  StepText,
  TimelineStructure
} from '@/types/learn/modules';

// the structure is `as const`: copy its readonly lists into the mutable ones the components get
const copy = <T>(list: readonly T[]): T[] => [...list];

type Text<S extends StepStructure> = StepText<S>;
// greenComp: text of the module's greencomp step, where example options take their names from
function buildStep(
  s: StepStructure,
  t: Text<StepStructure>,
  greenComp?: Text<GreenCompStructure>
): Step {
  const base = {
    id: s.id,
    title: t.title,
    short: t.short,
    instruction: t.instruction,
    cite: t.cite
  };
  switch (s.type) {
    case 'concepts': {
      const x = t as Text<ConceptsStructure>;
      return {
        ...base,
        type: s.type,
        items: s.items.map((item) => ({ id: item.id, ...x.items[item.id] })),
        map: s.map.map((row, i) => ({ ids: copy(row.ids), arrows: x.map[i].arrows }))
      };
    }
    case 'dimensions': {
      const x = t as Text<DimensionsStructure>;
      return {
        ...base,
        type: s.type,
        examples: s.examples.map((e) => ({ id: e.id, ...x.examples[e.id] })),
        closing: x.closing
      };
    }
    case 'sort': {
      const x = t as Text<SortStructure>;
      return {
        ...base,
        type: s.type,
        bins: s.bins.map((b) => ({ id: b.id, label: x.bins[b.id] })),
        cards: s.cards.map((c) => ({ id: c.id, bin: c.bin, ...x.cards[c.id] })),
        closing: x.closing
      };
    }
    case 'timeline': {
      const x = t as Text<TimelineStructure>;
      return {
        ...base,
        type: s.type,
        events: s.events.map((e, i) => ({ year: e.year, ...x.events[i] })),
        closing: x.closing,
        closingCite: x.closingCite,
        note: x.note
      };
    }
    case 'sdgs': {
      const x = t as Text<SdgsStructure>;
      return {
        ...base,
        type: s.type,
        explanation: x.explanation,
        ps: s.ps.map((p) => ({ id: p.id, label: x.ps[p.id], goals: copy(p.goals) })),
        psCite: x.psCite,
        focus: { goal: s.focus.goal, linked: copy(s.focus.linked), ...x.focus },
        note: x.note
      };
    }
    case 'greencomp': {
      const x = t as Text<GreenCompStructure>;
      return {
        ...base,
        type: s.type,
        explanation: x.explanation,
        areas: s.areas.map((a) => ({
          id: a.id,
          name: x.areas[a.id].name,
          competences: a.competences.map((c) => x.areas[a.id].competences[c])
        })),
        note: x.note,
        noteCite: x.noteCite,
        attribution: x.attribution
      };
    }
    case 'example': {
      const x = t as Text<ExampleStructure>;
      if (!greenComp) throw new Error(`step ${s.id}: an example step needs a greencomp step`);
      return {
        ...base,
        type: s.type,
        challenge: x.challenge,
        sdg: { goal: s.sdg.goal, text: x.sdg.text },
        question: x.question,
        options: s.options.map((o) => {
          const area = greenComp.areas[o.area];
          return {
            id: o.id,
            intention: x.options[o.id].intention,
            competence: area.competences[o.competence].name,
            area: area.name
          };
        }),
        lesson: x.lesson
      };
    }
    case 'myth': {
      const x = t as Text<MythStructure>;
      return {
        ...base,
        type: s.type,
        statements: s.statements.map((st, i) => ({ ...x.statements[i], answer: st.answer }))
      };
    }
  }
}

// merges a module's structure with its text in one language
export function buildModule<S extends ModuleStructure>(
  structure: S,
  text: ModuleText<S>
): ModuleContent {
  const { steps, ...intro } = text;
  // `text` was checked against this exact structure where it is declared: here it is read by id
  const stepTexts = steps as unknown as Record<string, Text<StepStructure>>;
  const textOf = (id: string) => stepTexts[id];
  const gc = structure.steps.find((s) => s.type === 'greencomp');
  const greenComp = gc && (textOf(gc.id) as Text<GreenCompStructure>);
  return {
    ...intro,
    takeaways: copy(intro.takeaways),
    steps: structure.steps.map((s) => buildStep(s, textOf(s.id), greenComp))
  };
}
