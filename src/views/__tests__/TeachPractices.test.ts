import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, RouterLinkStub } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import type { TeachingPractice } from '@/types';
import {
  TEACHING_PRACTICES,
  searchPractices,
  contributionMailto,
  CONTRIBUTION_ADDRESS,
  materialLinks
} from '@/utils/teachingPractices';
import TeachPractices from '../teacher/TeachPractices.vue';
import TeachPractice from '../teacher/TeachPractice.vue';
import SharePractice from '../teacher/SharePractice.vue';

const params: Record<string, string> = {};
vi.mock('vue-router', async (importOriginal) => ({
  ...(await importOriginal<typeof import('vue-router')>()),
  useRoute: () => ({ params, query: {} })
}));

const stubs = { global: { stubs: { RouterLink: RouterLinkStub } } };

// a test fixture only, never shown in the app
const fixture: TeachingPractice = {
  id: 'fixture',
  discipline: 'Économie',
  course: 'Macroéconomie',
  level: 'Licence 1',
  topic: 'Les limites du PIB',
  why: 'Pour discuter des indicateurs.',
  approach: 'Un débat structuré à partir de deux rapports.',
  resources: [{ title: 'Rapport', url: 'https://example.org/rapport' }],
  worked: 'Les étudiant·e·s ont débattu.'
};

beforeEach(() => {
  setActivePinia(createPinia());
  TEACHING_PRACTICES.splice(0);
});

describe('TEACH: teaching practices', () => {
  it('ships with no practice, and says so plainly rather than showing examples', () => {
    const wrapper = mount(TeachPractices, stubs);
    expect(wrapper.find('h1').text()).toBe('journey.teach.practices.title');
    expect(wrapper.find('[data-testid="practices-empty"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="practice-search"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="share-practice"]').exists()).toBe(true);
  });

  it('lists approved practices with one search over discipline, topic and approach', async () => {
    TEACHING_PRACTICES.push(fixture);
    const wrapper = mount(TeachPractices, stubs);
    expect(wrapper.findAll('[data-testid="practice"]')).toHaveLength(1);
    await wrapper.find('[data-testid="practice-search"]').setValue('chimie');
    expect(wrapper.findAll('[data-testid="practice"]')).toHaveLength(0);
    expect(searchPractices([fixture], 'débat pib')).toEqual([fixture]);
  });

  it('shows a practice with its sections and a way to adapt it in Activity Design', () => {
    TEACHING_PRACTICES.push(fixture);
    params.id = 'fixture';
    const wrapper = mount(TeachPractice, stubs);
    expect(wrapper.text()).toContain('journey.teach.practices.experience');
    expect(wrapper.find('a[href="https://example.org/rapport"]').exists()).toBe(true);
    const adapt = wrapper
      .findAllComponents(RouterLinkStub)
      .find((link) => link.attributes('data-testid') === 'adapt');
    expect(adapt?.props('to')).toEqual({
      name: 'teach-activity',
      query: { subject: 'Les limites du PIB', students: 'Économie, Licence 1' }
    });
    params.id = 'unknown';
    expect(mount(TeachPractice, stubs).find('[data-testid="practice-not-found"]').exists()).toBe(
      true
    );
  });

  it('prepares a contribution to send by e-mail, without claiming it was sent or published', async () => {
    const wrapper = mount(SharePractice, stubs);
    expect(
      wrapper.find('[data-testid="prepare-contribution"]').attributes('disabled')
    ).toBeDefined();
    for (const key of ['discipline', 'course', 'level', 'topic', 'approach']) {
      await wrapper.find(`[data-testid="practice-${key}"]`).setValue(`${key} réel`);
    }
    await wrapper.find('[data-testid="share-form"]').trigger('submit');
    // sending is not publishing: the three steps are said before sending
    expect(wrapper.findAll('[data-testid^="next-"]').map((step) => step.text())).toEqual([
      'journey.teach.practices.form.next.send',
      'journey.teach.practices.form.next.review',
      'journey.teach.practices.form.next.publish'
    ]);
    expect(wrapper.find('[data-testid="send-contribution"]').text()).toBe(
      'journey.teach.practices.form.send'
    );
    // no success is claimed: after the click, only that the mail client should open
    expect(wrapper.find('[data-testid="mail-opened"]').exists()).toBe(false);
    await wrapper.find('[data-testid="send-contribution"]').trigger('click');
    expect(wrapper.find('[data-testid="mail-opened"]').text()).toBe(
      'journey.teach.practices.form.mailOpened'
    );
    const href = wrapper.find('[data-testid="send-contribution"]').attributes('href')!;
    expect(href.startsWith(`mailto:${CONTRIBUTION_ADDRESS}?subject=`)).toBe(true);
    expect(decodeURIComponent(href)).toContain('approach réel');
  });

  it('encodes the e-mail', () => {
    expect(contributionMailto('Sujet', 'A & B\nC')).toBe(
      `mailto:${CONTRIBUTION_ADDRESS}?subject=Sujet&body=A%20%26%20B%0AC`
    );
  });
});

describe('TEACH: teaching materials', () => {
  const fill = async (wrapper: ReturnType<typeof mount>) => {
    for (const key of ['discipline', 'course', 'level', 'topic', 'approach']) {
      await wrapper.find(`[data-testid="practice-${key}"]`).setValue(`${key} réel`);
    }
  };

  it('takes links to materials, and no file upload WeLearn could not keep', async () => {
    const wrapper = mount(SharePractice, stubs);
    expect(wrapper.find('input[type="file"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="materials-files"]').text()).toBe(
      'journey.teach.practices.form.files'
    );
    await fill(wrapper);
    await wrapper.find('[data-testid="practice-materials"]').setValue('Fiche étudiant·e');
    expect(wrapper.find('[data-testid="materials-invalid"]').exists()).toBe(true);
    expect(
      wrapper.find('[data-testid="prepare-contribution"]').attributes('disabled')
    ).toBeDefined();

    await wrapper
      .find('[data-testid="practice-materials"]')
      .setValue('Fiche étudiant·e – https://example.org/fiche.pdf');
    await wrapper.find('[data-testid="share-form"]').trigger('submit');
    const href = wrapper.find('[data-testid="send-contribution"]').attributes('href')!;
    expect(decodeURIComponent(href)).toContain('https://example.org/fiche.pdf');
    expect(wrapper.find('[data-testid="next-send"]').text()).toBe(
      'journey.teach.practices.form.next.send'
    );
  });

  it('shows the approved materials of a practice', () => {
    TEACHING_PRACTICES.push({
      ...fixture,
      materials: [{ title: 'Fiche', url: 'https://example.org/fiche.pdf' }]
    });
    params.id = 'fixture';
    const wrapper = mount(TeachPractice, stubs);
    expect(wrapper.find('[data-testid="practice-materials"] a').attributes('href')).toBe(
      'https://example.org/fiche.pdf'
    );
  });

  it('separates lines with a link from lines without one', () => {
    expect(materialLinks('A – https://a.org\n\nB')).toEqual({
      links: ['A – https://a.org'],
      invalid: ['B']
    });
  });
});
