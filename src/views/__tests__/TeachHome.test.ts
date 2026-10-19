import { describe, it, expect, vi } from 'vitest';
import { mount, RouterLinkStub } from '@vue/test-utils';
import TeachHome from '../teacher/TeachHome.vue';
import TeachSpace from '../teacher/TeachSpace.vue';
import TeachPreview from '../teacher/TeachPreview.vue';
import { TEACHER_SPACES, isPreviewModule } from '@/components/teacher/teacherSpaces';

const params: Record<string, string> = {};
vi.mock('vue-router', async (importOriginal) => ({
  ...(await importOriginal<typeof import('vue-router')>()),
  useRoute: () => ({ params })
}));

const stubs = { global: { stubs: { RouterLink: RouterLinkStub } } };
const linksOf = (wrapper: ReturnType<typeof mount>) =>
  wrapper.findAllComponents(RouterLinkStub).map((link) => link.props('to'));

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
    const links = linksOf(mountSpace('understand')).slice(1);

    expect(links).toEqual([
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

  it('explore: two lenses, each leading to search and chat, marked as preview', () => {
    const wrapper = mountSpace('explore');

    expect(wrapper.find('[data-testid="preview-notice"]').exists()).toBe(true);
    expect(wrapper.findAll('[data-testid^="lens-"]')).toHaveLength(2);
    expect(linksOf(wrapper).slice(1)).toEqual([
      { name: 'search-sdg' },
      { name: 'q-and-a' },
      { name: 'search-sdg' },
      { name: 'q-and-a' }
    ]);
  });

  it('teach: use, reflect, share, marked as preview', () => {
    const wrapper = mountSpace('teach');

    expect(wrapper.find('[data-testid="preview-notice"]').exists()).toBe(true);
    for (const step of ['use', 'reflect', 'share']) {
      expect(wrapper.find(`[data-testid="step-${step}"]`).text()).toContain(
        `journey.teach.spaces.teach.steps.${step}.title`
      );
    }
  });
});

describe('TeachPreview', () => {
  it('shows the question, the objective and the preview notice', () => {
    Object.assign(params, { space: 'understand', module: 'teds' });
    const text = mount(TeachPreview, stubs).text();

    expect(text).toContain('journey.teach.previewNotice');
    expect(text).toContain('journey.teach.spaces.understand.modules.teds.question');
    expect(text).toContain('journey.teach.spaces.understand.modules.teds.objective');
  });

  it('shows the six activity steps and the syllabus idea', () => {
    Object.assign(params, { space: 'design', module: 'activity' });
    const wrapper = mount(TeachPreview, stubs);

    expect(wrapper.findAll('[data-testid^="activity-"]')).toHaveLength(6);
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
