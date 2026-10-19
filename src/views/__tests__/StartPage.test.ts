import { describe, it, expect } from 'vitest';
import { mount, RouterLinkStub } from '@vue/test-utils';
import StartPage from '../StartPage.vue';
import { fr } from '@/localisation/fr';
import { en } from '@/localisation/en';

const mountPage = () =>
  mount(StartPage, {
    global: {
      stubs: { RouterLink: RouterLinkStub, StudentBar: true, FooterComponent: true }
    }
  });

describe('StartPage', () => {
  it('sends teachers to /teach and students to /learn', () => {
    const links = mountPage().findAllComponents(RouterLinkStub);

    expect(links.map((link) => link.props('to'))).toEqual([{ name: 'teach' }, { name: 'learn' }]);
  });

  it('shows the title, line and button of each choice', () => {
    const wrapper = mountPage();

    for (const choice of ['teaching', 'learning']) {
      const card = wrapper.find(`[data-testid="choice-${choice}"]`);
      for (const field of ['title', 'description', 'action']) {
        expect(card.text()).toContain(`journey.entry.${choice}.${field}`);
      }
    }
  });

  it('has every entry and teacher-space text in both French and English', () => {
    const keys = (texts: object, prefix = ''): string[] =>
      Object.entries(texts).flatMap(([key, value]) =>
        typeof value === 'object' ? keys(value, `${prefix}${key}.`) : [`${prefix}${key}`]
      );

    expect(keys(fr.journey).sort()).toEqual(keys(en.journey).sort());
  });
});
