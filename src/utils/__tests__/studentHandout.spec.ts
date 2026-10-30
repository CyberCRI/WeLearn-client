import { describe, it, expect } from 'vitest';
import { buildHandout } from '@/utils/studentHandout';
import type { ActivityResource, ActivitySuggestion } from '@/utils/activityDesign';
import type { Document } from '@/types';

const doc = (title: string): Document =>
  ({
    id: title,
    score: 1,
    payload: {
      document_id: title,
      document_title: title,
      document_url: `https://example.org/${title}`,
      document_sdg: [7],
      document_corpus: 'openalex',
      document_desc: '',
      document_details: {},
      slice_content: '',
      slice_sdg: null,
      document_lang: 'en'
    }
  }) as unknown as Document;

const timber = doc('Timber products');
const resource: ActivityResource = {
  document: timber,
  usefulness: 'Des valeurs.',
  material: 'data',
  isQuantitative: true,
  evidence: 'Wood-based construction consumes 3800 GJ of total energy.'
};

const activity = (overrides: Partial<ActivitySuggestion> = {}): ActivitySuggestion => ({
  title: 'Comparer trois structures',
  approach: 'comparative_data_analysis',
  dataTable: {
    caption: 'Énergie totale',
    columns: ['Structure', 'Énergie (GJ)'],
    rows: [
      ['Bois', '3800'],
      ['Acier', '7350']
    ],
    document: timber,
    context: 'Exemple de bâtiment.',
    reportedFrom: 'APA (2017)',
    isComparable: false
  },
  objective: 'Comparer des valeurs publiées.',
  format: '1 h, en binômes',
  studentInstructions: 'Lisez le tableau et comparez.',
  providedMaterial: null,
  preparation: 'Imprimer le tableau.',
  steps: [
    'Lire les données (15 min).',
    'Comparer (30 min).',
    'L’enseignant·e fait la synthèse (15 min).'
  ],
  studentOutput: 'Une comparaison argumentée.',
  check: 'Les valeurs sont citées avec leurs unités.',
  limitation: 'Un seul bâtiment.',
  assumesMissing: false,
  greencomp: [{ id: 'critical_thinking', how: 'Étape 2 : comparer.' }],
  documents: [timber],
  ...overrides
});

describe('student handout', () => {
  it('keeps the student-facing parts, the verified table and excerpts, in the activity’s language', () => {
    const { text, gaps } = buildHandout(
      activity(),
      [resource],
      'fr',
      'Analyse comparative de données'
    );
    expect(text).toContain('# Comparer trois structures');
    expect(text).toContain('**Méthode :** Analyse comparative de données');
    expect(text).toContain('## Consignes');
    expect(text).toContain('| Bois | 3800 |');
    expect(text).toContain('valeurs rapportées d’après APA (2017)');
    expect(text).toContain('> « Wood-based construction consumes 3800 GJ of total energy. »');
    expect(text).toContain('https://example.org/Timber products#:~:text=');
    // data comes before the excerpts in a data analysis
    expect(text.indexOf('## Données')).toBeLessThan(text.indexOf('## Extraits des sources'));
    expect(gaps).toEqual([]);
  });

  it('leaves out teacher-only parts: preparation, check, limitation, GreenComp, teacher steps', () => {
    const { text } = buildHandout(activity(), [resource], 'fr', '');
    [
      'Imprimer le tableau',
      'cités avec leurs unités',
      'Un seul bâtiment',
      'Étape 2 : comparer',
      'synthèse'
    ].forEach((teacherOnly) => expect(text).not.toContain(teacherOnly));
  });

  it('lists for the teacher what an activity of its kind lacks, without writing it in', () => {
    expect(buildHandout(activity({ dataTable: null }), [resource], 'fr', '').gaps).toEqual([
      'data'
    ]);
    const debate = activity({ approach: 'structured_debate', dataTable: null });
    expect(buildHandout(debate, [resource], 'en', 'Structured debate').gaps).toEqual(['scenario']);
    const withRoles = buildHandout(
      { ...debate, providedMaterial: 'Groupe A : pour. Groupe B : contre.' },
      [resource],
      'en',
      'Structured debate',
      true
    );
    expect(withRoles.gaps).toEqual(['edited']);
    expect(withRoles.text).toContain('## Scenario and roles');
  });
});
