import { describe, it, expect, vi, beforeEach } from 'vitest';
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import AdaptCourse from '../teacher/AdaptCourse.vue';
import { useCourseDesignStore } from '@/stores/courseDesign';
import { basePostAxios } from '@/utils/fetch';

vi.mock('@/utils/fetch', () => ({
  basePostAxios: vi.fn()
}));

const mountPage = () => mount(AdaptCourse, { global: { stubs: { RouterLink: RouterLinkStub } } });

beforeEach(() => {
  setActivePinia(createPinia());
  window.history.replaceState({}, '', '/');
  // jsdom has no object URLs; the page uses one to open the teacher's file locally
  URL.createObjectURL = vi.fn(() => 'blob:local-file');
  URL.revokeObjectURL = vi.fn();
});

describe('AdaptCourse', () => {
  it('starts with the upload and the notice, without the demo paths', () => {
    const wrapper = mountPage();

    expect(wrapper.find('h1').text()).toBe('journey.teach.adapt.title');
    expect(wrapper.find('[data-testid="send-notice"]').text()).toBe(
      'journey.teach.adapt.upload.notice'
    );
    expect(wrapper.find('[data-testid="read-button"]').attributes('disabled')).toBeDefined();
    expect(wrapper.find('[data-testid="example-button"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="paste-toggle"]').exists()).toBe(false);
  });

  it('offers the example and pasted text only for local testing (?demo=true)', () => {
    // demo paths (example, pasted text) are only shown with ?demo=true
    window.history.replaceState({}, '', '/?demo=true');
    const wrapper = mountPage();

    expect(wrapper.find('[data-testid="example-button"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="paste-toggle"]').exists()).toBe(true);
  });

  it('shows the example clearly labelled, with its original, and no AI label', async () => {
    // demo paths (example, pasted text) are only shown with ?demo=true
    window.history.replaceState({}, '', '/?demo=true');
    const wrapper = mountPage();
    await wrapper.find('[data-testid="example-button"]').trigger('click');

    expect(wrapper.find('[data-testid="example-banner"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="original"]').text()).toContain(
      'journey.teach.adapt.example.document'
    );
    expect(wrapper.find('[data-testid="ai-label"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="detected"]').exists()).toBe(false);
    expect(wrapper.findAll('[data-testid="objective"]')).toHaveLength(3);
    expect(wrapper.find('[data-testid="local-note"]').text()).toBe(
      'journey.teach.adapt.review.localNote'
    );
  });

  it('pasted text is shown as the original, labelled as not analysed, with an empty course', async () => {
    // demo paths (example, pasted text) are only shown with ?demo=true
    window.history.replaceState({}, '', '/?demo=true');
    const wrapper = mountPage();
    await wrapper.find('[data-testid="paste-input"]').setValue('Syllabus: Environmental law.');
    await wrapper.find('[data-testid="paste-button"]').trigger('click');

    expect(wrapper.find('[data-testid="pasted-banner"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="original"]').text()).toContain(
      'Syllabus: Environmental law.'
    );
    expect(wrapper.find('[data-testid="ai-label"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="description"]').text()).toContain(
      'journey.teach.adapt.review.notFilled'
    );
    expect(wrapper.findAll('[data-testid="objective"]')).toHaveLength(0);
  });

  it('a correction is tagged as the teacher’s and can show the original', async () => {
    // demo paths (example, pasted text) are only shown with ?demo=true
    window.history.replaceState({}, '', '/?demo=true');
    const wrapper = mountPage();
    await wrapper.find('[data-testid="example-button"]').trigger('click');

    const description = wrapper.find('[data-testid="description"]');
    await description.find('button').trigger('click');
    await description.find('textarea').setValue('My corrected description.');
    await description.find('button.is-primary').trigger('click');

    expect(description.find('[data-testid="origin-edited"]').exists()).toBe(true);
    expect(description.text()).toContain('My corrected description.');
    expect(description.text()).toContain('journey.teach.adapt.review.showOriginal');
  });

  it('a real reading shows the AI label and what was detected', async () => {
    const store = useCourseDesignStore();
    store.setFile(new File(['x'], 'syllabus.txt', { type: 'text/plain' }));
    store.source = 'upload';
    store.extraction = {
      detected_document_type: 'article',
      confidence: 0.9,
      summary: 'An article.',
      description: null,
      objectives: [],
      reasoning: null
    };
    store.status = 'ready';
    const wrapper = mountPage();

    expect(wrapper.find('[data-testid="ai-label"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="detected"]').text()).toContain(
      'journey.teach.adapt.review.detected.article'
    );
    expect(wrapper.find('[data-testid="description"]').text()).toContain(
      'journey.teach.adapt.review.notFound'
    );
  });

  it('a real syllabus: "let\'s check your course", a subtle AI mark, no detection line', () => {
    const store = useCourseDesignStore();
    store.setFile(new File(['x'], 'syllabus.pdf', { type: 'application/pdf' }));
    store.source = 'upload';
    store.extraction = {
      detected_document_type: 'syllabus',
      confidence: 0.99,
      summary: null,
      description: 'A description.',
      objectives: ['Explain GDP.'],
      reasoning: null
    };
    store.description = {
      value: 'A description.',
      origin: 'extracted',
      original: 'A description.'
    };
    store.objectives = [{ value: 'Explain GDP.', origin: 'extracted', original: 'Explain GDP.' }];
    store.status = 'ready';
    const wrapper = mountPage();

    expect(wrapper.text()).toContain('journey.teach.adapt.review.title');
    expect(wrapper.text()).toContain('journey.teach.adapt.review.intro');
    expect(wrapper.find('[data-testid="original"]').text()).toContain('syllabus.pdf');
    expect(wrapper.find('[data-testid="ai-label"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="detected"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="confirm-button"]').text()).toBe(
      'journey.teach.adapt.review.confirm'
    );
  });

  it('the overview is never filled by WeLearn: only what the teacher adds, marked as theirs', async () => {
    useCourseDesignStore().loadExample();
    const wrapper = mountPage();
    const title = () => wrapper.find('[data-testid="overview-title"]');

    ['title', 'disciplineLevel', 'topics'].forEach((key) =>
      expect(wrapper.find(`[data-testid="overview-${key}"]`).classes()).toContain('is-missing')
    );
    await title().find('button').trigger('click');
    await title().find('textarea').setValue('Introduction à la macroéconomie');
    await title().find('.is-primary').trigger('click');

    expect(title().text()).toContain('Introduction à la macroéconomie');
    expect(title().find('[data-testid="origin-added"]').exists()).toBe(true);
  });

  it('a description is shown as a preview; "show full text" only when it is really cut', async () => {
    useCourseDesignStore().loadExample();
    // jsdom has no layout: pretend the text is taller than its 4-line preview
    const scroll = vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockReturnValue(400);
    const client = vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(100);
    const wrapper = mountPage();
    await flushPromises();
    const text = () => wrapper.find('[data-testid="description"] [data-testid="field-text"]');

    expect(text().classes()).toContain('is-preview');
    await wrapper.find('[data-testid="expand"]').trigger('click');
    expect(text().classes()).not.toContain('is-preview');

    scroll.mockRestore();
    client.mockRestore();
  });

  it('a description that fits its preview has no "show full text"', async () => {
    useCourseDesignStore().loadExample();
    const wrapper = mountPage();
    await flushPromises();

    expect(wrapper.find('[data-testid="expand"]').exists()).toBe(false);
  });

  it('the teacher marks a programme-level objective; it is kept unchanged and can be moved back', async () => {
    const store = useCourseDesignStore();
    store.loadExample();
    const wrapper = mountPage();
    const first = store.objectives[0].value;

    await wrapper.find('[data-testid="mark-programme"]').trigger('click');
    expect(wrapper.findAll('[data-testid="objective"]')).toHaveLength(2);
    expect(wrapper.find('[data-testid="programme-objective"]').text()).toContain(first);
    expect(store.objectives[0]).toMatchObject({ value: first, origin: 'extracted' });

    await wrapper.find('[data-testid="unmark-programme"]').trigger('click');
    expect(wrapper.findAll('[data-testid="objective"]')).toHaveLength(3);
    expect(wrapper.find('[data-testid="programme"]').exists()).toBe(false);
  });

  it('while reading, shows only the real steps and no result', () => {
    const store = useCourseDesignStore();
    store.setFile(new File(['x'], 'syllabus.txt', { type: 'text/plain' }));
    store.status = 'reading';
    store.readingStartedAt = Date.now();
    const wrapper = mountPage();

    expect(wrapper.find('[data-testid="step-sending"]').text()).toContain(
      'journey.teach.adapt.reading.sent'
    );
    expect(wrapper.find('[data-testid="step-reading"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="course"]').exists()).toBe(false);
  });

  it('marks a step done only when it really is: upload first, then reading; review never here', () => {
    const store = useCourseDesignStore();
    store.setFile(new File(['x'], 'syllabus.txt', { type: 'text/plain' }));
    store.status = 'uploading';
    store.uploadProgress = 40;
    const wrapper = mountPage();

    const sending = () => wrapper.find('[data-testid="step-sending"]');
    expect(sending().classes()).toContain('is-active');
    expect(sending().text()).not.toContain('✓');
    expect(wrapper.find('[data-testid="step-reading"]').classes()).toContain('is-pending');
    expect(wrapper.find('[data-testid="step-review"]').classes()).toContain('is-pending');

    store.status = 'reading';
    store.readingStartedAt = Date.now();
    return wrapper.vm.$nextTick().then(() => {
      expect(sending().classes()).toContain('is-done');
      expect(wrapper.find('[data-testid="step-reading"]').classes()).toContain('is-active');
      expect(wrapper.find('[data-testid="step-review"]').classes()).toContain('is-pending');
    });
  });

  it('shows no warning before a request, and an honest one after a real request fails', async () => {
    vi.mocked(basePostAxios).mockRejectedValue({ code: 'ERR_NETWORK' });
    const wrapper = mountPage();
    expect(wrapper.find('[data-testid^="problem-"]').exists()).toBe(false);

    const store = useCourseDesignStore();
    store.setFile(new File(['x'], 'syllabus.txt', { type: 'text/plain' }));
    await store.readSyllabus();
    await wrapper.vm.$nextTick();

    expect(wrapper.find('[data-testid="problem-unavailable"]').text()).toContain(
      'journey.teach.adapt.unavailable.title'
    );
    expect(wrapper.find('[data-testid="course"]').exists()).toBe(false);
    // the same button now retries, with the file still selected
    expect(wrapper.find('[data-testid="read-button"]').text()).toBe(
      'journey.teach.adapt.upload.retry'
    );
  });

  it('does not show a warning left from an earlier visit', () => {
    const store = useCourseDesignStore();
    store.status = 'unavailable';
    const wrapper = mountPage();

    expect(wrapper.find('[data-testid^="problem-"]').exists()).toBe(false);
    expect(store.status).toBe('idle');
  });
});
