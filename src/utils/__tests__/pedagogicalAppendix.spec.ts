import { describe, expect, it } from 'vitest';
import {
  appendixMarkdown,
  appendixParagraphs,
  changesWithNotes,
  type AppendixLabels
} from '@/utils/pedagogicalAppendix';
import { approvedChange } from '@/__tests__/coursePathFixtures';

const LABELS = {
  title: 'Annexe pédagogique',
  note: 'Pistes facultatives.',
  learning: 'Apprentissage visé',
  greencomp: 'GreenComp',
  teaching: 'Idée pédagogique',
  check: 'Vérifier les acquis',
  greencompNames: { systems_thinking: 'Pensée systémique' },
  kinds: { objective: 'Objectif', topic: 'Thème', teaching: 'Enseignement', assessment: 'Éval' }
} satisfies AppendixLabels;

const NOTED = approvedChange(1, {
  guidance: {
    learning: 'Comparer des indicateurs.',
    greencomp: { id: 'systems_thinking', how: 'Relie économie et nature.' },
    teaching: null,
    check: 'Un quiz court.'
  }
});
const PLAIN = approvedChange(2, {});

describe('the pedagogical appendix', () => {
  it('keeps only the changes that carry a note', () => {
    expect(changesWithNotes([PLAIN, NOTED])).toEqual([NOTED]);
  });

  it('writes the notes after the syllabus, GreenComp by its name, and skips empty ones', () => {
    const markdown = appendixMarkdown([NOTED, PLAIN], LABELS);
    expect(markdown).toContain('## Annexe pédagogique');
    expect(markdown).toContain('_Pistes facultatives._');
    expect(markdown).toContain('**Thème :** Changement 1.');
    expect(markdown).toContain('- Apprentissage visé : Comparer des indicateurs.');
    expect(markdown).toContain('- GreenComp : Pensée systémique — Relie économie et nature.');
    expect(markdown).toContain('- Vérifier les acquis : Un quiz court.');
    expect(markdown).not.toContain('Idée pédagogique');
    expect(markdown).not.toContain('Changement 2.');
  });

  it('adds nothing when no change has a note', () => {
    expect(appendixMarkdown([PLAIN], LABELS)).toBe('');
    expect(appendixParagraphs([PLAIN], LABELS)).toEqual([]);
  });

  it('gives the word paragraphs: title, note, then each change and its notes', () => {
    // title + note + the change + its 3 notes
    expect(appendixParagraphs([NOTED, PLAIN], LABELS)).toHaveLength(6);
  });
});
