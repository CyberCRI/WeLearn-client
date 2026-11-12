import { Paragraph, TextRun } from 'docx';
import type { GreenCompId } from '@/utils/greencomp';
import type { ApprovedChange } from '@/utils/updatedSyllabus';

// the optional pedagogical appendix of the word exports: the notes attached to the changes the
// teacher accepted (intended learning, GreenComp, a teaching idea, a way to check learning), on
// request only. it comes after the syllabus, clearly labelled as optional guidance: the notes are
// not learning objectives or assessment requirements, and nothing of them goes into the syllabus

export interface AppendixLabels {
  title: string;
  note: string;
  learning: string;
  greencomp: string;
  teaching: string;
  check: string;
  greencompNames: Record<GreenCompId, string>;
  kinds: Record<ApprovedChange['kind'], string>;
}

// the accepted changes that carry at least one note
export const changesWithNotes = (changes: ApprovedChange[]) =>
  changes.filter(
    ({ guidance }) =>
      !!guidance &&
      !!(guidance.learning || guidance.greencomp || guidance.teaching || guidance.check)
  );

// each change's notes as label / text pairs, in a fixed order
const noteLines = (change: ApprovedChange, labels: AppendixLabels) => {
  const { guidance } = change;
  if (!guidance) return [];
  return [
    [labels.learning, guidance.learning],
    [
      labels.greencomp,
      guidance.greencomp
        ? `${labels.greencompNames[guidance.greencomp.id]} — ${guidance.greencomp.how}`
        : null
    ],
    [labels.teaching, guidance.teaching],
    [labels.check, guidance.check]
  ].filter((pair): pair is [string, string] => !!pair[1]);
};

export const appendixMarkdown = (changes: ApprovedChange[], labels: AppendixLabels) => {
  const noted = changesWithNotes(changes);
  if (!noted.length) return '';
  return [
    '',
    `## ${labels.title}`,
    '',
    `_${labels.note}_`,
    ...noted.flatMap((change) => [
      '',
      `**${labels.kinds[change.kind]} :** ${change.text}`,
      '',
      ...noteLines(change, labels).map(([label, text]) => `- ${label} : ${text}`)
    ])
  ].join('\n');
};

export const appendixParagraphs = (changes: ApprovedChange[], labels: AppendixLabels) => {
  const noted = changesWithNotes(changes);
  if (!noted.length) return [];
  return [
    new Paragraph({
      spacing: { before: 480 },
      children: [new TextRun({ text: labels.title, bold: true, size: 24 })]
    }),
    new Paragraph({
      spacing: { after: 120 },
      children: [new TextRun({ text: labels.note, italics: true, size: 18 })]
    }),
    ...noted.flatMap((change) => [
      new Paragraph({
        spacing: { before: 200 },
        children: [
          new TextRun({ text: `${labels.kinds[change.kind]} : `, bold: true }),
          new TextRun({ text: change.text })
        ]
      }),
      ...noteLines(change, labels).map(
        ([label, text]) =>
          new Paragraph({
            indent: { left: 360 },
            children: [
              new TextRun({ text: `${label} : `, bold: true, size: 20 }),
              new TextRun({ text, size: 20 })
            ]
          })
      )
    ])
  ];
};
