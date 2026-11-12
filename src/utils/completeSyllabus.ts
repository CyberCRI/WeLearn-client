import { BorderStyle, Document, Packer, Paragraph, TextRun } from 'docx';
import { core, normalise } from '@/utils/courseCheck';
import type { ApprovedChange, CourseToUpdate } from '@/utils/updatedSyllabus';

// the complete updated syllabus: every line of the syllabus's own text, in its order, with the
// teacher's approved changes added where they belong. nothing of the original is rewritten,
// dropped or moved: a change goes in only after a passage of the syllabus it is tied to that
// appears exactly once; a revised objective keeps its original visible (struck), its new wording
// right after. a change with no such place waits in a section of its own. the plan is checked
// before any document is offered: if it lost or altered anything, there is no complete version.
// the text is the syllabus's text as read in the browser, so its layout (tables, columns) is not
// kept: the document says so

export type CompleteEntry =
  | { type: 'line'; text: string; isReplaced: boolean }
  | { type: 'change'; change: ApprovedChange; action: 'insert' | 'replace'; anchor: string };

export interface CompletePlan {
  entries: CompleteEntry[];
  // approved changes with no verified place in the text
  toPlace: ApprovedChange[];
}

// below this, a text is too short to stand for a whole syllabus (a scan, an empty export)
const MIN_LETTERS = 300;
// an anchor shorter than this is too common to place anything reliably
const MIN_ANCHOR = 6;
// a schedule entry is a few lines (title, date, teacher, activities): never more than this
const MAX_ENTRY = 8;

export const lineStarts = (lines: string[]) => {
  const starts: number[] = [];
  let joined = '';
  lines.forEach((line) => {
    starts.push(joined.length);
    joined += normalise(line);
  });
  return { joined, starts };
};

// the lines a passage of the syllabus covers, when it appears exactly once; null otherwise
export const locate = (lines: string[], passage: string | null | undefined) => {
  const needle = passage ? core(passage) : '';
  if (needle.length < MIN_ANCHOR) return null;
  const { joined, starts } = lineStarts(lines);
  const first = joined.indexOf(needle);
  if (first < 0 || joined.indexOf(needle, first + 1) >= 0) return null;
  const lineAt = (offset: number) => {
    let line = starts.length - 1;
    while (line > 0 && starts[line] > offset) line--;
    return line;
  };
  return { start: lineAt(first), end: lineAt(first + needle.length - 1) };
};

// the passages of the syllabus a change may be tied to, most precise first. a session line
// ("Semaine du 15/12 – CM7 « Évaluation »") is tried by its title, then its label, then whole
const sessionAnchors = (line: string) => {
  const cut = line.indexOf(' – ');
  return cut >= 0 ? [line.slice(cut + 3), line.slice(0, cut), line] : [line];
};

// a course part as step 2 may word it, with a closing aside the syllabus does not have
// ("Bilans énergétiques (cas des procédés réactifs)"): the part without it is tried too
const withoutAside = (part: string) => part.replace(/\s*\([^()]*\)\s*$/, '').trim();
const withVariants = (anchors: string[]) =>
  anchors.flatMap((anchor) => {
    const shorter = withoutAside(anchor);
    return shorter && shorter !== anchor ? [anchor, shorter] : [anchor];
  });

export const anchorsFor = (change: ApprovedChange, course: CourseToUpdate): string[] => {
  if (change.kind === 'objective' && change.original) return [change.original];
  const place = change.placement;
  if (!place) return [];
  const topic = course.topics.find(({ title }) => title === place);
  if (topic) {
    // a short topic name can appear several times (schedule, bibliography): the one session of
    // the outline naming it is tried too, by its title
    const naming = course.sessions.filter((line) =>
      normalise(line).includes(normalise(topic.title))
    );
    // several sessions mention it: the one titled by it, when there is exactly one
    const titled = naming.filter((line) => core(sessionAnchors(line)[0]) === core(topic.title));
    const one = naming.length === 1 ? naming[0] : titled.length === 1 ? titled[0] : null;
    const session = one ? sessionAnchors(one) : [];
    return withVariants(
      [topic.source, topic.title, ...session].filter((anchor): anchor is string => !!anchor)
    );
  }
  if (course.sessions.includes(place)) return sessionAnchors(place);
  return withVariants([place]);
};

export const planComplete = (
  text: string,
  course: CourseToUpdate,
  changes: ApprovedChange[]
): CompletePlan => {
  const lines = text.split(/\r?\n/);
  // a schedule entry ("CM6 « Management organisationnel »", then its date and teacher) starts with
  // one of the outline's session labels: an addition to it goes after the whole entry, before the
  // next entry or heading, so the entry is never split
  // an untitled session ("TD6") is its own label
  const labels = course.sessions
    .map((line) => normalise(line.includes(' – ') ? line.slice(0, line.indexOf(' – ')) : line))
    .filter((label) => label.length >= 2 && label.length <= 30);
  const startsEntry = (line: string) => labels.some((label) => normalise(line).startsWith(label));
  const entryEnd = (start: number, end: number) => {
    if (!startsEntry(lines[start])) return end;
    let last = end;
    while (
      last + 1 < lines.length &&
      last - start < MAX_ENTRY &&
      lines[last + 1].trim() &&
      !startsEntry(lines[last + 1]) &&
      !looksLikeHeading(lines[last + 1])
    ) {
      last++;
    }
    return last;
  };
  const after = new Map<number, Extract<CompleteEntry, { type: 'change' }>[]>();
  const replaced = new Set<number>();
  const toPlace: ApprovedChange[] = [];
  changes.forEach((change) => {
    const found = anchorsFor(change, course)
      .map((anchor) => ({ anchor, range: locate(lines, anchor) }))
      .find(({ range }) => range);
    if (!found?.range) {
      toPlace.push(change);
      return;
    }
    const isReplace = change.kind === 'objective' && !!change.original;
    if (isReplace) {
      for (let line = found.range.start; line <= found.range.end; line++) replaced.add(line);
    }
    const entry = {
      type: 'change' as const,
      change,
      action: isReplace ? ('replace' as const) : ('insert' as const),
      anchor: found.anchor
    };
    // a revised objective stays where its original is; an addition after the entry it belongs to
    const at = isReplace ? found.range.end : entryEnd(found.range.start, found.range.end);
    after.set(at, [...(after.get(at) || []), entry]);
  });
  const entries: CompleteEntry[] = [];
  lines.forEach((line, index) => {
    entries.push({ type: 'line', text: line, isReplaced: replaced.has(index) });
    entries.push(...(after.get(index) || []));
  });
  return { entries, toPlace };
};

// where the document puts each change: after which line of the syllabus, or instead of which
// objective; a change missing from the map waits at the end of the document
export type InsertionPoint = { action: 'insert' | 'replace'; line: string };
export const insertionPoints = (plan: CompletePlan) => {
  const points = new Map<number, InsertionPoint>();
  let last = '';
  plan.entries.forEach((entry) => {
    if (entry.type === 'line') {
      if (entry.text.trim()) last = entry.text.trim();
      return;
    }
    points.set(entry.change.connectionId, {
      action: entry.action,
      line: entry.action === 'replace' ? entry.anchor : last
    });
  });
  return points;
};
// one change, before it is accepted: the same plan, so the same place as the export
export const insertionPoint = (text: string, course: CourseToUpdate, change: ApprovedChange) =>
  insertionPoints(planComplete(text, course, [change])).get(change.connectionId) || null;

// the checks before a document is called complete: every original line kept, in order and
// unchanged; every approved change present exactly once, placed or waiting to be placed
export const validatePlan = (text: string, changes: ApprovedChange[], plan: CompletePlan) => {
  const lines = text.split(/\r?\n/);
  const kept = plan.entries.flatMap((entry) => (entry.type === 'line' ? [entry.text] : []));
  const isTextKept = kept.length === lines.length && kept.every((line, i) => line === lines[i]);
  const ids = [
    ...plan.entries.flatMap((entry) =>
      entry.type === 'change' ? [entry.change.connectionId] : []
    ),
    ...plan.toPlace.map((change) => change.connectionId)
  ];
  const isEveryChangeOnce =
    ids.length === changes.length &&
    changes.every(({ connectionId }) => ids.filter((id) => id === connectionId).length === 1);
  const letters = (text.match(/\p{L}/gu) || []).length;
  return isTextKept && isEveryChangeOnce && letters >= MIN_LETTERS;
};

export interface CompleteLabels {
  title: string;
  note: string;
  change: string;
  replaces: string;
  sources: string;
  toPlace: string;
  toPlaceNote: string;
  kinds: Record<ApprovedChange['kind'], string>;
  // said after a resource that only gives context ("context only")
  context?: string;
}

// a heading of the syllabus as its text shows it: a short line in capitals (the word document and
// its preview both use it)
export const looksLikeHeading = (line: string) => {
  const letters = line.replace(/[^\p{L}]/gu, '');
  return letters.length >= 4 && line.length <= 80 && letters === letters.toUpperCase();
};

const GREEN = '1E8A5A';

// the resources a change relies on, in one line, as the document and its preview show them
export const sourcesLine = (change: ApprovedChange, labels: CompleteLabels) =>
  change.resources.length
    ? `${labels.sources} : ${change.resources
        .map(({ document, role }) => {
          const source = [document.payload.document_title, document.payload.document_url]
            .filter(Boolean)
            .join(' — ');
          return role && labels.context ? `${source} (${labels.context})` : source;
        })
        .join(' ; ')}`
    : '';

const changeParagraphs = (change: ApprovedChange, labels: CompleteLabels) => [
  new Paragraph({
    border: { left: { style: BorderStyle.SINGLE, size: 18, color: GREEN, space: 8 } },
    indent: { left: 240 },
    spacing: { before: 120 },
    children: [
      new TextRun({
        text: `${labels.change} · ${labels.kinds[change.kind]} : `,
        bold: true,
        color: GREEN
      }),
      new TextRun({ text: change.text })
    ]
  }),
  ...(change.resources.length
    ? [
        new Paragraph({
          border: { left: { style: BorderStyle.SINGLE, size: 18, color: GREEN, space: 8 } },
          indent: { left: 240 },
          spacing: { after: 120 },
          children: [
            new TextRun({
              text: sourcesLine(change, labels),
              italics: true,
              size: 18
            })
          ]
        })
      ]
    : [])
];

// appendix: paragraphs added after the syllabus (the optional pedagogical appendix)
export const completeSyllabusDocx = (
  plan: CompletePlan,
  labels: CompleteLabels,
  appendix: Paragraph[] = []
) => {
  const children: Paragraph[] = [
    new Paragraph({ children: [new TextRun({ text: labels.title, bold: true, size: 28 })] }),
    new Paragraph({
      spacing: { after: 240 },
      children: [new TextRun({ text: labels.note, italics: true, size: 18, color: '666666' })]
    })
  ];
  plan.entries.forEach((entry) => {
    if (entry.type === 'line') {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: entry.text,
              bold: looksLikeHeading(entry.text),
              strike: entry.isReplaced
            })
          ]
        })
      );
    } else {
      children.push(...changeParagraphs(entry.change, labels));
    }
  });
  if (plan.toPlace.length) {
    children.push(
      new Paragraph({
        spacing: { before: 360 },
        children: [new TextRun({ text: labels.toPlace, bold: true, size: 24 })]
      }),
      new Paragraph({
        children: [new TextRun({ text: labels.toPlaceNote, italics: true, size: 18 })]
      }),
      ...plan.toPlace.flatMap((change) => changeParagraphs(change, labels))
    );
  }
  children.push(...appendix);
  return Packer.toBlob(
    new Document({
      sections: [{ properties: {}, children }],
      styles: { default: { document: { run: { font: 'Calibri', size: 22 } } } }
    })
  );
};
