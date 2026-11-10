import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import FlipCard from '../FlipCard.vue';

const card = { verb: 'Model', text: 'Climate models rely on maths.', color: 'ct' };

const mountCard = (flipped: boolean) => mount(FlipCard, { props: { card, flipped } });

describe('FlipCard', () => {
  // a native button gets focus and turns Enter/Space into a click, see e2e/microlearning.spec.ts
  it('is a native toggle button, so the keyboard can reach and flip it', () => {
    const button = mountCard(false).get('button');

    expect(button.attributes('type')).toBe('button');
    expect(button.attributes('tabindex')).toBeUndefined();
    expect(button.attributes('aria-pressed')).toBe('false');
    expect(button.classes()).toEqual(expect.arrayContaining(['flip-card', 'ct']));
  });

  it('emits flip when activated, only while not flipped', async () => {
    const wrapper = mountCard(false);

    await wrapper.get('button').trigger('click');
    expect(wrapper.emitted('flip')).toHaveLength(1);

    await wrapper.setProps({ flipped: true });
    await wrapper.get('button').trigger('click');
    expect(wrapper.emitted('flip')).toHaveLength(1);
  });

  it('follows the flipped state with aria-pressed', async () => {
    const wrapper = mountCard(false);

    await wrapper.setProps({ flipped: true });

    expect(wrapper.get('button').attributes('aria-pressed')).toBe('true');
    expect(wrapper.get('button').classes()).toContain('flipped');
  });

  it('hides the back face from assistive tech until flipped', () => {
    const wrapper = mountCard(false);

    expect(wrapper.get('.front').attributes('aria-hidden')).toBeUndefined();
    expect(wrapper.get('.back').attributes('aria-hidden')).toBe('true');
    expect(wrapper.get('.front').text()).toContain('Model');
    expect(wrapper.get('.front').text()).toContain('learn.discipline.flipCards.clickToDiscover');
  });

  it('hides the front face once flipped, so the verb is read once', () => {
    const wrapper = mountCard(true);

    expect(wrapper.get('.front').attributes('aria-hidden')).toBe('true');
    expect(wrapper.get('.back').attributes('aria-hidden')).toBeUndefined();
    expect(wrapper.get('.back').text()).toContain(card.text);
  });
});
