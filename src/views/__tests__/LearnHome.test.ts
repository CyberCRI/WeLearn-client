import { describe, it, expect, vi } from 'vitest';
import { mount, RouterLinkStub } from '@vue/test-utils';
import LearnHome from '../student/LearnHome.vue';
import SpaceCard from '@/components/SpaceCard.vue';
import { STUDENT_SPACES } from '@/components/student/spaces';
import { fr } from '@/localisation/fr';
import { en } from '@/localisation/en';

vi.mock('vue-router', async (importOriginal) => ({
  ...(await importOriginal<typeof import('vue-router')>()),
  onBeforeRouteLeave: vi.fn()
}));

const mountPage = () => mount(LearnHome, { global: { stubs: { RouterLink: RouterLinkStub } } });

describe('LearnHome', () => {
  it('is built like the teacher homepage: a title, an intro and one card per learner space', () => {
    const wrapper = mountPage();
    expect(wrapper.find('h1').text()).toBe('student.home.title');
    expect(wrapper.text()).toContain('student.home.intro');
    const cards = wrapper.findAllComponents(SpaceCard);
    expect(cards.map((card) => card.props('to'))).toEqual(
      STUDENT_SPACES.map((space) => ({ name: 'learn-space', params: { space } }))
    );
    expect(cards.map((card) => card.props('title'))).toEqual(
      STUDENT_SPACES.map((space) => `student.spaces.${space}.title`)
    );
    expect(cards.every((card) => card.props('actionText') === 'student.home.getStarted')).toBe(
      true
    );
  });

  it('has every student text in both French and English', () => {
    const keys = (texts: object, prefix = ''): string[] =>
      Object.entries(texts).flatMap(([key, value]) =>
        typeof value === 'object' ? keys(value, `${prefix}${key}.`) : [`${prefix}${key}`]
      );

    expect(keys(fr.student).sort()).toEqual(keys(en.student).sort());
  });
});
