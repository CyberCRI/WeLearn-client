import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import TutorPage from '../TutorPage.vue';
import { createPinia, setActivePinia } from 'pinia';
import { nextTick } from 'vue';
import { useTutorStore } from '@/stores/tutor';
import type { Document } from '@/types';

describe('TutorPage', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('renders initial tutor flow content', () => {
    const wrapper = mount(TutorPage);

    expect(wrapper.text()).toContain('tutor.syllabusSteps');
    expect(wrapper.text()).toContain('tutor.firstStep.title');
    expect(wrapper.text()).toContain('tutor.summaries.title');

    expect(wrapper.find('[data-testid="file-input"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="tutor-summaries-title"]').exists()).toBe(true);

    expect(wrapper.text()).not.toContain('tutor.secondStep.title');
    expect(wrapper.text()).not.toContain('tutor.openDatasetsIdeas.title');
  });

  it('shows resource selection and dataset suggestions at step 3 with datasets below resources', async () => {
    const store = useTutorStore();

    const mockDocument: Document = {
      id: 'doc-1',
      score: 0.92,
      payload: {
        document_id: 'doc-1',
        document_corpus: 'plos',
        document_title: 'Mock resource title',
        document_desc: 'Mock resource description',
        document_url: 'https://example.org/resource',
        document_sdg: [3, 13],
        document_details: {
          authors: [{ name: 'Author One' }],
          source: 'PLOS'
        },
        slice_content: 'mock content',
        slice_sdg: 3,
        document_lang: 'en',
        document_scrape_date: '2026-01-01'
      }
    };

    store.tutorSearch = {
      extracts: [],
      nb_results: 1,
      documents: [mockDocument]
    };
    store.summaries = ['covid hospital eau'];
    store.setStep(3);

    const wrapper = mount(TutorPage);
    await nextTick();

    expect(wrapper.text()).toContain('tutor.secondStep.title');
    expect(wrapper.text()).toContain('tutor.openDatasetsIdeas.title');

    const html = wrapper.html();
    expect(html.indexOf('tutor.secondStep.title')).toBeLessThan(
      html.indexOf('tutor.openDatasetsIdeas.title')
    );

    expect(wrapper.findAll('.source').length).toBe(1);
    const datasetCards = wrapper.findAll('.dataset-card');
    expect(datasetCards.length).toBeGreaterThan(0);
    expect(wrapper.text()).toContain('Urgences hospitalières et SOS Medecins - COVID-19');

    await datasetCards[0].trigger('click');
    await nextTick();
    expect(wrapper.findAll('.dataset-card')[0].classes()).toContain('selected');

    await wrapper.findAll('.dataset-card')[0].trigger('click');
    await nextTick();
    expect(wrapper.findAll('.dataset-card')[0].classes()).not.toContain('selected');
  });
});
