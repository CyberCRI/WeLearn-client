import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import ChangeEvidence from '@/components/tutor/development/ChangeEvidence.vue';
import type { AdaptationProposal } from '@/types';
import { exists, proposal, resource, text } from '@/__tests__/coursePathFixtures';

const mountWith = (overrides: Partial<AdaptationProposal> = {}) =>
  mount(ChangeEvidence, { props: { proposal: proposal(overrides) } });

describe('ChangeEvidence', () => {
  it('says a strong support, with the quotes, and no check notes', () => {
    const wrapper = mountWith();
    expect(exists(wrapper, 'support-strong')).toBe(true);
    expect(text(wrapper, 'evidence-summary')).toContain(
      'tutor.additions.change.evidence.strongDetail'
    );
    expect(text(wrapper, 'change-quote')).toBe('The footprint measures it.');
    expect(exists(wrapper, 'check-notes')).toBe(false);
  });

  it('says a limited support with the first problem the check found, and every point', () => {
    const wrapper = mountWith({
      support: 'partial',
      resources: [resource('direct', null), resource('context', null)],
      checks: {
        status: 'checked',
        problems: ['The figure is not in the sources.', 'Second problem.'],
        unbacked_names: ['IPBES']
      }
    });
    expect(text(wrapper, 'evidence-summary')).toContain('The figure is not in the sources.');
    expect(wrapper.findAll('[data-testid="check-problem"]')).toHaveLength(2);
    expect(text(wrapper, 'check-names')).toBe('tutor.additions.change.unbackedNames');
    // a resource that only gives context says so
    expect(wrapper.findAll('[data-testid="context-tag"]')).toHaveLength(1);
  });

  it('says when the check could not be made', () => {
    const wrapper = mountWith({
      support: 'partial',
      checks: { status: 'unchecked', problems: [], unbacked_names: [] }
    });
    expect(text(wrapper, 'evidence-summary')).toContain(
      'tutor.additions.change.evidence.uncheckedDetail'
    );
    expect(exists(wrapper, 'check-unchecked')).toBe(true);
  });

  it('says when no resource backs the change', () => {
    const wrapper = mountWith({ support: 'none', resources: [], checks: null });
    expect(text(wrapper, 'evidence-summary')).toContain(
      'tutor.additions.change.evidence.noneDefault'
    );
    expect(exists(wrapper, 'no-resource')).toBe(true);
  });
});
