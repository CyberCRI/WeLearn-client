import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import ResourcesStep from '@/components/tutor/ResourcesStep.vue';
import CardSimpleComponent from '@/components/CardSimpleComponent.vue';
import DatasetSimpleComponent from '@/components/DatasetSimpleComponent.vue';
import type { Document } from '@/types';

const doc = (id: string, sliceContent?: string) =>
  ({
    id,
    score: 1,
    payload: {
      slice_content: sliceContent,
      document_id: `doc-${id}`,
      document_title: `Title ${id}`,
      document_desc: `Description ${id}`,
      document_corpus: 'corpus',
      document_url: 'https://example.org',
      document_sdg: [],
      document_details: {}
    }
  }) as unknown as Document;

const mountStep = (sources: Document[], selectedSources: Document[]) =>
  mount(ResourcesStep, {
    props: { sources, selectedSources, appendSource: vi.fn(), action: vi.fn() },
    global: { stubs: { CardSimpleComponent: true, Card: true, ModalWrapper: true } }
  });

describe('ResourcesStep', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  afterEach(() => {
    localStorage.removeItem('featurePreview');
  });

  it('shows no matched passage while the syllabusV2 flag is off', () => {
    const wrapper = mountStep([doc('1', 'A matched passage')], []);
    expect(wrapper.find('[data-testid="passage"]').exists()).toBe(false);
    expect(wrapper.find('.passage-label').exists()).toBe(false);
  });

  it('shows the passage the search matched under each resource when the flag is on', () => {
    localStorage.setItem('featurePreview', JSON.stringify(['syllabusV2']));
    const wrapper = mountStep([doc('1', 'A matched passage'), doc('2')], []);

    const rows = wrapper.findAll('.source');
    expect(rows[0].find('.passage-label').text()).toBe('tutor.resourcesStep.passageLabel');
    expect(rows[0].find('[data-testid="passage"]').text()).toBe('A matched passage');
    // nothing to show without a passage
    expect(rows[1].find('[data-testid="passage"]').exists()).toBe(false);
    expect(rows[1].find('.passage-label').exists()).toBe(false);
  });

  it('ticks a source selected as another copy of the same document', () => {
    // the store keeps its own objects, they are not the ones in the list
    const wrapper = mountStep([doc('1'), doc('2')], [doc('2')]);

    const rows = wrapper.findAll('.source');
    expect(rows.map((r) => r.attributes('aria-checked'))).toEqual(['false', 'true']);
    expect(rows[1].classes()).toContain('selected');
    expect((rows[1].find('input').element as HTMLInputElement).checked).toBe(true);
    expect((rows[0].find('input').element as HTMLInputElement).checked).toBe(false);
  });

  it('ticks nothing when the selection is from another result', () => {
    const wrapper = mountStep([doc('1'), doc('2')], [doc('3')]);

    expect(wrapper.findAll('.source[aria-checked="true"]')).toHaveLength(0);
  });

  it('toggles a source on click', async () => {
    const sources = [doc('1')];
    const wrapper = mountStep(sources, []);

    await wrapper.find('.source').trigger('click');

    expect(wrapper.props('appendSource')).toHaveBeenCalledWith(sources[0]);
  });

  it('shows dataset-specific empty and action states', () => {
    const wrapper = mount(ResourcesStep, {
      props: {
        kind: 'datasets',
        sources: [],
        selectedSources: [],
        appendSource: vi.fn(),
        action: vi.fn()
      },
      global: { stubs: { CardSimpleComponent: true, Card: true, ModalWrapper: true } }
    });
    expect(wrapper.text()).toContain('tutor.datasetsStep.noSources');
    expect(wrapper.get('[data-testid="tutor-generate-button"]').text()).toContain(
      'tutor.datasetsStep.action'
    );
  });

  it('shows dataset selection and invokes the action', async () => {
    const action = vi.fn();
    const wrapper = mount(ResourcesStep, {
      props: {
        kind: 'datasets',
        sources: [doc('1')],
        selectedSources: [],
        appendSource: vi.fn(),
        action
      },
      global: { stubs: { CardSimpleComponent: true, Card: true, ModalWrapper: true } }
    });
    expect(wrapper.findComponent(DatasetSimpleComponent).exists()).toBe(true);
    expect(wrapper.findComponent(CardSimpleComponent).exists()).toBe(false);
    const datasetCard = wrapper.findComponent(DatasetSimpleComponent);
    expect(datasetCard.props('description')).toBe('Description 1');
    expect(datasetCard.find('.description').text()).toBe('Description 1');
    expect(wrapper.text()).toContain('tutor.datasetsStep.description');
    expect(wrapper.text()).toContain('tutor.datasetsStep.noneHint');
    await wrapper.get('[data-testid="tutor-generate-button"]').trigger('click');
    expect(action).toHaveBeenCalledOnce();
  });
});
