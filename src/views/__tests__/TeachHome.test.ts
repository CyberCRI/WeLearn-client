import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, RouterLinkStub } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import TeachHome from '../teacher/TeachHome.vue';
import TeachSpace from '../teacher/TeachSpace.vue';
import TeachPreview from '../teacher/TeachPreview.vue';
import FeatureRow from '@/components/teacher/FeatureRow.vue';
import BookIcon from '@/components/icons/BookIcon.vue';
import NetworkIcon from '@/components/icons/NetworkIcon.vue';
import LinesLeaningIcon from '@/components/icons/LinesLeaningIcon.vue';
import { TEACHER_SPACES, TEACH_STEPS, isPreviewModule } from '@/components/teacher/teacherSpaces';
import { useChatStore } from '@/stores/chat';
import { useFiltersStore } from '@/stores/filters';

const params: Record<string, string> = {};
const push = vi.fn();
vi.mock('vue-router', async (importOriginal) => ({
  ...(await importOriginal<typeof import('vue-router')>()),
  useRoute: () => ({ params }),
  useRouter: () => ({ push })
}));

const stubs = { global: { stubs: { RouterLink: RouterLinkStub } } };
const linksOf = (wrapper: ReturnType<typeof mount>) =>
  wrapper.findAllComponents(RouterLinkStub).map((link) => link.props('to'));

beforeEach(() => {
  setActivePinia(createPinia());
  push.mockClear();
});

describe('TeachHome', () => {
  it('has one title and a short introduction, like the student homepage', () => {
    const wrapper = mount(TeachHome, stubs);

    expect(wrapper.findAll('h1')).toHaveLength(1);
    expect(wrapper.find('h1').text()).toBe('journey.teach.title');
    expect(wrapper.text()).toContain('journey.teach.intro');
  });

  it('shows only the four spaces as cards, each opening its own page', () => {
    const wrapper = mount(TeachHome, stubs);

    expect(TEACHER_SPACES).toEqual(['understand', 'explore', 'design', 'teach']);
    expect(linksOf(wrapper)).toEqual(
      TEACHER_SPACES.map((space) => ({ name: 'teach-space', params: { space } }))
    );
    for (const space of TEACHER_SPACES) {
      const card = wrapper.find(`[data-testid="teacher-space-${space}"]`);
      for (const field of ['name', 'title', 'description']) {
        expect(card.text()).toContain(`journey.teach.spaces.${space}.${field}`);
      }
      expect(card.text()).toContain('journey.teach.getStarted');
    }
  });

  it('has no secondary entry points below the cards (no text box, no other link)', () => {
    const wrapper = mount(TeachHome, stubs);

    expect(wrapper.find('input').exists()).toBe(false);
    expect(wrapper.find('form').exists()).toBe(false);
    expect(wrapper.findAll('[data-testid^="teacher-space-"]')).toHaveLength(4);
  });
});

describe('TeachSpace', () => {
  const mountSpace = (space: string) => {
    params.space = space;
    return mount(TeachSpace, stubs);
  };

  it('understand: three cards (two previews and micro-learning), the TEDS card no longer listed', () => {
    const wrapper = mountSpace('understand');

    expect(wrapper.find('h1 + p').text()).toBe('journey.teach.spaces.understand.intro');
    expect(linksOf(wrapper).slice(1)).toEqual([
      { name: 'teach-preview', params: { space: 'understand', module: 'foundations' } },
      { name: 'teach-preview', params: { space: 'understand', module: 'frameworks' } },
      { name: 'micro-learning' }
    ]);
    expect(wrapper.find('[data-testid="module-teds"]').exists()).toBe(false);
    for (const module of ['foundations', 'frameworks', 'discipline']) {
      expect(wrapper.find(`[data-testid="module-${module}"]`).text()).toContain(
        `journey.teach.spaces.understand.modules.${module}.summary`
      );
    }
  });

  it('design: its own heading and intro, course design and activity design entries', () => {
    const wrapper = mountSpace('design');

    expect(wrapper.find('h1').text()).toBe('journey.teach.spaces.design.pageTitle');
    expect(wrapper.find('h1 + p').text()).toBe('journey.teach.spaces.design.intro');
    expect(linksOf(wrapper).slice(1)).toEqual([
      { name: 'teach-course' },
      { name: 'teach-activity' }
    ]);
    // no "AI draft" badges on these cards; the activity is a real feature now, no "Preview" badge
    expect(wrapper.find('[data-testid="module-course"] [data-testid="ai-label"]').exists()).toBe(
      false
    );
    const activity = wrapper.find('[data-testid="module-activity"]');
    expect(activity.text()).not.toContain('journey.teach.preview');
    expect(activity.find('[data-testid="ai-label"]').exists()).toBe(false);
  });

  it('understand and design show their features as rows, not cards', () => {
    for (const [space, count] of [
      ['design', 2],
      ['understand', 3]
    ] as const) {
      const wrapper = mountSpace(space);
      expect(wrapper.findAll('.feature-row')).toHaveLength(count);
      expect(wrapper.find('.space-card').exists()).toBe(false);
    }
  });

  it('understand: a book for foundations, connections for frameworks, discipline unchanged', () => {
    const rows = mountSpace('understand').findAllComponents(FeatureRow);
    expect(rows.map((row) => row.props('icon'))).toEqual([BookIcon, NetworkIcon, LinesLeaningIcon]);
    expect(rows[1].props('title')).toBe('journey.teach.spaces.understand.modules.frameworks.title');
  });

  it('teach: use, reflect, share, numbered once, marked as preview', () => {
    const wrapper = mountSpace('teach');

    expect(wrapper.find('[data-testid="preview-notice"]').exists()).toBe(true);
    TEACH_STEPS.forEach((step, index) => {
      const title = wrapper.find(`[data-testid="step-${step}"] .space-title`).text();
      expect(title).toBe(`${index + 1}. journey.teach.spaces.teach.steps.${step}.title`);
    });
  });

  it.each(['understand', 'design'])('%s: no Ask WeLearn panel below the cards', (space) => {
    expect(mountSpace(space).find('[data-testid="ask-panel"]').exists()).toBe(false);
  });

  it.each(['teach'])(
    '%s: the Ask WeLearn panel clears source filters and opens the chat with the question',
    async (space) => {
      const wrapper = mountSpace(space);
      const chatStore = useChatStore();
      const filtersStore = useFiltersStore();
      filtersStore.sourcesFilters = ['uved'];

      expect(wrapper.find('[data-testid="ask-panel"]').text()).toContain(
        'journey.teach.ask.sourcesNote'
      );
      await wrapper.find('[data-testid="ask-q1"]').trigger('click');
      expect(filtersStore.sourcesFilters).toEqual([]);
      expect(chatStore.chatInput).not.toBe('');
      expect(push).toHaveBeenLastCalledWith({ name: 'q-and-a' });
    }
  );
});

describe('TeachPreview', () => {
  it('shows the preview notice, with the question and objective in a design note', () => {
    Object.assign(params, { space: 'understand', module: 'teds' });
    const note = mount(TeachPreview, stubs).find('[data-testid="design-note"]');

    expect(note.text()).toContain('journey.teach.spaces.understand.modules.teds.question');
    expect(note.text()).toContain('journey.teach.spaces.understand.modules.teds.objective');
  });

  it('activity: three parts with the matching example pieces, no design note, still a preview', () => {
    Object.assign(params, { space: 'design', module: 'activity' });
    const wrapper = mount(TeachPreview, stubs);
    const texts = 'journey.teach.spaces.design.modules.activity';

    expect(wrapper.find('[data-testid="design-note"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="preview-notice"]').exists()).toBe(true);
    expect(wrapper.text()).toContain('journey.teach.exampleLabel');

    const parts = wrapper.findAll('[data-testid^="activity-"]');
    expect(parts.map((part) => part.find('h3').text())).toEqual([
      `${texts}.parts.context.title`,
      `${texts}.parts.intention.title`,
      `${texts}.parts.develop.title`
    ]);
    expect(wrapper.find('[data-testid="example-context"]').text()).toContain(
      `${texts}.example.connection`
    );
    const develop = wrapper.find('[data-testid="example-develop"]');
    expect(develop.text()).toContain(`${texts}.example.resource2`);
    expect(develop.text()).toContain(`${texts}.example.assessment`);
    expect(wrapper.text()).toContain(`${texts}.note`);
  });

  it('only exists for modules that are still being designed', () => {
    expect(isPreviewModule('understand', 'foundations')).toBe(true);
    expect(isPreviewModule('design', 'activity')).toBe(false);
    expect(isPreviewModule('understand', 'discipline')).toBe(false);
    expect(isPreviewModule('design', 'course')).toBe(false);
    expect(isPreviewModule('design', 'foundations')).toBe(false);
    // no longer listed on the UNDERSTAND page, but its preview page and route are kept
    expect(isPreviewModule('understand', 'teds')).toBe(true);
  });
});
