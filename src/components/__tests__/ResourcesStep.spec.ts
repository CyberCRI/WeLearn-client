import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import ResourcesStep from '@/components/tutor/ResourcesStep.vue';
import { useBookmarksStore } from '@/stores/bookmarks';
import type { Document } from '@/types';

const resource = (sliceContent: string | null) =>
  ({
    id: 'r1',
    score: 1,
    payload: {
      document_id: 'd1',
      document_title: 'A resource',
      document_desc: 'About a resource',
      document_corpus: 'hal',
      document_url: 'https://example.org/a',
      document_details: {},
      document_sdg: [4],
      slice_content: sliceContent
    }
  }) as unknown as Document;

const mountStep = (sources: Document[]) =>
  mount(ResourcesStep, {
    props: { sources, appendSource: vi.fn(), selectedSources: [], action: vi.fn() }
  });

describe('ResourcesStep', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('shows the passage that matched under each resource', () => {
    const wrapper = mountStep([resource('GDP leaves out environmental damage.')]);
    expect(wrapper.find('[data-testid="passage"]').text()).toBe(
      'GDP leaves out environmental damage.'
    );
  });

  it('shows no passage when the search sent none', () => {
    const wrapper = mountStep([resource(null)]);
    expect(wrapper.find('[data-testid="passage"]').exists()).toBe(false);
    expect(wrapper.text()).not.toContain('tutor.resourcesStep.passageLabel');
  });

  it('selects a resource with a click or the keyboard', async () => {
    const source = resource(null);
    const wrapper = mountStep([source]);
    await wrapper.find('.source').trigger('click');
    await wrapper.find('.source').trigger('keydown', { key: 'Enter' });
    expect(wrapper.props('appendSource')).toHaveBeenCalledTimes(2);
    expect(wrapper.props('appendSource')).toHaveBeenCalledWith(source);
  });

  it('bookmarks a resource without selecting it', async () => {
    const bookmarks = useBookmarksStore();
    const toggle = vi.spyOn(bookmarks, 'toggleBookmark').mockImplementation(async () => {});
    const source = resource(null);
    const wrapper = mountStep([source]);
    await wrapper.find('[data-testid="toggleBookmark"]').trigger('click');
    expect(toggle).toHaveBeenCalledWith(source);
    expect(wrapper.props('appendSource')).not.toHaveBeenCalled();
  });

  it('bookmarks a resource from its details window', async () => {
    const bookmarks = useBookmarksStore();
    const toggle = vi.spyOn(bookmarks, 'toggleBookmark').mockImplementation(async () => {});
    const source = resource(null);
    const wrapper = mountStep([source]);
    await wrapper.find('[data-testid="card-actions"] .icon-wrapper .icon').trigger('click');
    const bookmarkButtons = wrapper.findAll('[data-testid="toggleBookmark"]');
    await bookmarkButtons[bookmarkButtons.length - 1].trigger('click');
    expect(toggle).toHaveBeenCalledWith(source);
  });

  it('lists a resource that has no id', () => {
    const source = { ...resource(null), id: undefined } as unknown as Document;
    const wrapper = mountStep([source]);
    expect(wrapper.findAll('.source')).toHaveLength(1);
  });

  it('generates the syllabus from the button', async () => {
    const wrapper = mountStep([resource(null)]);
    await wrapper.find('[data-testid="tutor-generate-button"]').trigger('click');
    expect(wrapper.props('action')).toHaveBeenCalled();
  });

  it('says when no resource was found, and when the search failed', () => {
    const wrapper = mount(ResourcesStep, {
      props: {
        sources: [],
        searchError: true,
        appendSource: vi.fn(),
        selectedSources: [],
        action: vi.fn()
      }
    });
    expect(wrapper.text()).toContain('tutor.resourcesStep.noSources');
    expect(wrapper.text()).toContain('tutor.resourcesStep.searchError');
  });
});
