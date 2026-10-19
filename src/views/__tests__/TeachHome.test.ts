import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, RouterLinkStub } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import TeachHome from '../teacher/TeachHome.vue';
import TeachSpace from '../teacher/TeachSpace.vue';
import TeachPreview from '../teacher/TeachPreview.vue';
import {
  TEACHER_SPACES,
  TEACH_STEPS,
  RESEARCH_CASE_SOURCE_URL,
  isPreviewModule
} from '@/components/teacher/teacherSpaces';
import { useChatStore } from '@/stores/chat';
import { useFiltersStore } from '@/stores/filters';
import { useSourcesStore } from '@/stores/sources';

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
  it('shows the four spaces, each opening its own page', () => {
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
});

describe('TeachSpace', () => {
  const mountSpace = (space: string) => {
    params.space = space;
    return mount(TeachSpace, stubs);
  };

  it('understand: three previews and micro-learning', () => {
    expect(linksOf(mountSpace('understand')).slice(1)).toEqual([
      { name: 'teach-preview', params: { space: 'understand', module: 'foundations' } },
      { name: 'teach-preview', params: { space: 'understand', module: 'frameworks' } },
      { name: 'teach-preview', params: { space: 'understand', module: 'teds' } },
      { name: 'micro-learning' }
    ]);
  });

  it('design: the syllabus creator and the activity preview', () => {
    expect(linksOf(mountSpace('design')).slice(1)).toEqual([
      { name: 'tutor' },
      { name: 'teach-preview', params: { space: 'design', module: 'activity' } }
    ]);
  });

  it('explore: each lens pre-selects its sources, then opens search or chat', async () => {
    const sourcesStore = useSourcesStore();
    sourcesStore.sourceCategoryMap = {
      uved: 'teaching_resources',
      ipcc: 'expert_reports',
      hal: 'academic_scientific_publications',
      ted: 'science_communication_and_outreach',
      'data-gouv': 'datasets'
    };
    const wrapper = mountSpace('explore');
    const filtersStore = useFiltersStore();

    expect(wrapper.find('[data-testid="preview-notice"]').exists()).toBe(true);

    await wrapper.find('[data-testid="lens-teach-search"]').trigger('click');
    expect(filtersStore.sourcesFilters).toEqual(['uved']);
    expect(push).toHaveBeenLastCalledWith({ name: 'search-sdg' });

    await wrapper.find('[data-testid="lens-learn-chat"]').trigger('click');
    expect(filtersStore.sourcesFilters).toEqual(['ipcc', 'hal', 'ted']);
    expect(push).toHaveBeenLastCalledWith({ name: 'q-and-a' });
  });

  it('explore: "teach the topic" shows both kinds of results, the case linking to its source', () => {
    const lens = mountSpace('explore').find('[data-testid="lens-teach"]');

    expect(lens.find('[data-testid="results-teachingResources"]').exists()).toBe(true);
    const cases = lens.find('[data-testid="results-researchCases"]');
    expect(cases.text()).toContain('journey.teach.spaces.explore.results.researchCases.sourceNote');
    expect(cases.find('a').attributes('href')).toBe(RESEARCH_CASE_SOURCE_URL);
  });

  it('teach: use, reflect, share, numbered once, marked as preview', () => {
    const wrapper = mountSpace('teach');

    expect(wrapper.find('[data-testid="preview-notice"]').exists()).toBe(true);
    TEACH_STEPS.forEach((step, index) => {
      const title = wrapper.find(`[data-testid="step-${step}"] .space-title`).text();
      expect(title).toBe(`${index + 1}. journey.teach.spaces.teach.steps.${step}.title`);
    });
  });

  it.each(TEACHER_SPACES)(
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

  it('shows the six activity steps, an example draft and the syllabus idea', () => {
    Object.assign(params, { space: 'design', module: 'activity' });
    const wrapper = mount(TeachPreview, stubs);

    expect(wrapper.findAll('[data-testid^="activity-"]')).toHaveLength(6);
    const example = wrapper.find('[data-testid="example-draft"]');
    expect(example.text()).toContain('journey.teach.exampleLabel');
    expect(example.text()).toContain(
      'journey.teach.spaces.design.modules.activity.example.assessment'
    );
    expect(wrapper.text()).toContain('journey.teach.spaces.design.modules.activity.note');
  });

  it('only exists for modules that are still being designed', () => {
    expect(isPreviewModule('understand', 'foundations')).toBe(true);
    expect(isPreviewModule('design', 'activity')).toBe(true);
    expect(isPreviewModule('understand', 'discipline')).toBe(false);
    expect(isPreviewModule('design', 'course')).toBe(false);
    expect(isPreviewModule('design', 'foundations')).toBe(false);
  });
});
