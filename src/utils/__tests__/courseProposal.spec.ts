import { describe, it, expect } from 'vitest';
import { buildProposalRequest, parseProposal } from '@/utils/courseProposal';

const brief = {
  idea: 'Une introduction à la macroéconomie',
  disciplineLevel: 'Économie, L1',
  format: '',
  goals: 'Les limites du PIB'
};

describe('buildProposalRequest', () => {
  it('sends the brief as the only source, without its empty answers', () => {
    const request = buildProposalRequest(brief, 'fr');
    const content = request.sources[0].payload.slice_content;
    expect(content).toContain('Idée de cours : Une introduction à la macroéconomie');
    expect(content).toContain('Discipline et niveau : Économie, L1');
    expect(content).not.toContain('Durée ou format');
    expect(request.query).toContain('Pas de chiffres, de statistiques ni de références');
  });
});

describe('parseProposal', () => {
  const proposal = (overrides: Record<string, unknown> = {}) =>
    JSON.stringify({
      title: 'Macroéconomie et transition',
      purpose: 'Comprendre les grands agrégats <a href="x">[Doc 1]</a>.',
      discipline: 'Économie',
      level: 'L1',
      objectives: ['Définir le PIB.', '', 'Expliquer le chômage.'],
      topics: ['Le PIB', 'Le chômage'],
      sessions: ['Séance 1 : Le PIB', 'Séance 2 : Le chômage'],
      activities: ['Étude de cas', 'Débat', 'Lecture', 'Quiz', 'De trop'],
      assessment: ['Examen écrit'],
      sustainability: [
        {
          title: 'Les limites du PIB',
          anchor: 'Le PIB',
          why: 'Le PIB ne mesure pas le bien-être.',
          how: 'Débat.',
          queries: ['limites du PIB', 'beyond GDP', 'de trop']
        },
        { title: 'Ailleurs', anchor: 'Un thème inventé', why: 'a', how: 'b', queries: ['q'] },
        { title: 'Sans recherche', anchor: 'Le PIB', why: 'a', how: 'b', queries: [] }
      ],
      ...overrides
    });

  it('reads a proposal, cleaned of the endpoint’s markup and within its limits', () => {
    const parsed = parseProposal(proposal())!;
    expect(parsed.title).toBe('Macroéconomie et transition');
    expect(parsed.purpose).toBe('Comprendre les grands agrégats.');
    expect(parsed.objectives).toEqual(['Définir le PIB.', 'Expliquer le chômage.']);
    expect(parsed.activities).toHaveLength(4);
    expect(parsed.opportunities.map((o) => o.title)).toEqual(['Les limites du PIB', 'Ailleurs']);
    expect(parsed.opportunities[0].queries).toEqual(['limites du PIB', 'beyond GDP']);
    // a place that is not a proposed topic or session is not kept
    expect(parsed.opportunities[1].anchor).toBeNull();
  });

  it('needs a title, objectives and topics', () => {
    expect(parseProposal(proposal({ objectives: [] }))).toBeNull();
    expect(parseProposal(proposal({ title: '' }))).toBeNull();
    expect(parseProposal('Désolé.')).toBeNull();
  });
});
