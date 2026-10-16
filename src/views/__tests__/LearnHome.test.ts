import { describe, it, expect, vi } from 'vitest';
import { mount, RouterLinkStub } from '@vue/test-utils';
import LearnHome from '../student/LearnHome.vue';
import { STUDENT_SPACES } from '@/components/student/spaces';
import { fr } from '@/localisation/fr';
import { en } from '@/localisation/en';

vi.mock('vue-router', async (importOriginal) => ({
  ...(await importOriginal<typeof import('vue-router')>()),
  onBeforeRouteLeave: vi.fn()
}));

const mountPage = () =>
  mount(LearnHome, {
    global: {
      stubs: { RouterLink: RouterLinkStub, StudentBar: true, FooterComponent: true }
    }
  });

describe('LearnHome', () => {
  it('shows one card per space, in order, each opening its own space', () => {
    const links = mountPage().findAllComponents(RouterLinkStub);

    expect(links.map((link) => link.props('to'))).toEqual(
      STUDENT_SPACES.map((space) => ({ name: 'learn-space', params: { space } }))
    );
  });

  it('shows the label, title, description and button of each space', () => {
    const wrapper = mountPage();

    for (const space of STUDENT_SPACES) {
      const card = wrapper.find(`[data-testid="space-card-${space}"]`);
      for (const field of ['name', 'title', 'description']) {
        expect(card.text()).toContain(`student.spaces.${space}.${field}`);
      }
      expect(card.text()).toContain('student.home.getStarted');
    }
  });

  it('has every student text in both French and English', () => {
    const keys = (texts: object, prefix = ''): string[] =>
      Object.entries(texts).flatMap(([key, value]) =>
        typeof value === 'object' ? keys(value, `${prefix}${key}.`) : [`${prefix}${key}`]
      );

    expect(keys(fr.student).sort()).toEqual(keys(en.student).sort());
  });
});
