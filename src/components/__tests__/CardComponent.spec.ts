import { afterEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import CardComponent from '../CardComponent.vue';

const trackerId = 'theconversation_tracker_hook';

const mountCard = (corpus: string, externalId?: string) =>
  mount(CardComponent, {
    props: {
      title: 'Tracked article',
      corpus,
      description: 'Article description',
      url: 'https://theconversation.com/article-with-different-url-id-999999',
      externalId,
      sdg: [],
      details: { authors: [] },
      toggleBookmark: () => undefined,
      isBookmarked: false,
      slice: 'Relevant excerpt'
    }
  });

afterEach(() => {
  document.getElementById(trackerId)?.remove();
});

describe('CardComponent conversation tracking', () => {
  it('loads the tracker only after a conversation excerpt is opened', async () => {
    const wrapper = mountCard('conversation', '210865');
    const excerpt = wrapper.get('details');

    expect(document.getElementById(trackerId)).toBeNull();

    (excerpt.element as HTMLDetailsElement).open = true;
    await excerpt.trigger('toggle');

    const tracker = document.getElementById(trackerId) as HTMLScriptElement;
    expect(tracker.src).toBe('https://theconversation.com/javascripts/lib/content_tracker_hook.js');
    expect(tracker.dataset.counter).toBe(
      'https://counter.theconversation.com/content/210865/count'
    );
    expect(tracker.async).toBe(true);
  });

  it('does not load the tracker for excerpts from another corpus', async () => {
    const wrapper = mountCard('plos', '210865');
    const excerpt = wrapper.get('details');

    (excerpt.element as HTMLDetailsElement).open = true;
    await excerpt.trigger('toggle');

    expect(document.getElementById(trackerId)).toBeNull();
  });

  it('does not load the tracker when a conversation document has no external ID', async () => {
    const wrapper = mountCard('conversation');
    const excerpt = wrapper.get('details');

    (excerpt.element as HTMLDetailsElement).open = true;
    await excerpt.trigger('toggle');

    expect(document.getElementById(trackerId)).toBeNull();
  });
});

describe('CardComponent corpus label', () => {
  const mountWithSubCorpus = (subCorpus?: string | null) =>
    mount(CardComponent, {
      props: {
        title: 'Article',
        corpus: 'hal',
        subCorpus,
        description: 'Article description',
        url: 'https://example.org',
        sdg: [],
        details: { authors: [] },
        toggleBookmark: () => undefined,
        isBookmarked: false
      }
    });

  it('shows the sub corpus as the source, via the corpus', () => {
    expect(mountWithSubCorpus('theses').get('.corpus').text()).toBe('corpus.theses via corpus.hal');
  });

  it('falls back to the corpus when there is no sub corpus', () => {
    expect(mountWithSubCorpus(null).get('.corpus').text()).toBe('corpus.hal');
  });
});

describe('CardComponent authors', () => {
  const authors = Array.from({ length: 12 }, (_, index) => ({ name: `Author ${index + 1}` }));
  const mountWithAuthors = () =>
    mount(CardComponent, {
      props: {
        title: 'Article',
        corpus: 'hal',
        description: 'Article description',
        url: 'https://example.org',
        sdg: [],
        details: { authors },
        toggleBookmark: () => undefined,
        isBookmarked: false
      }
    });

  it('shows the first ten authors and reveals or hides the others on click', async () => {
    const wrapper = mountWithAuthors();
    const toggle = wrapper.get('.authors .is-underlined');

    expect(wrapper.findAll('.more-authors')).toHaveLength(0);
    expect(wrapper.get('.authors').text()).toContain('Author 10');
    expect(wrapper.get('.authors').text()).not.toContain('Author 11');
    expect(toggle.text()).toBe('showMoreAuthors');

    await toggle.trigger('click');

    expect(wrapper.findAll('.more-authors')).toHaveLength(2);
    expect(wrapper.get('.authors').text()).toContain('Author 12');
    expect(wrapper.get('.authors .is-underlined').text()).toBe('hideAuthors');

    await wrapper.get('.authors .is-underlined').trigger('click');

    expect(wrapper.findAll('.more-authors')).toHaveLength(0);
  });
});

describe('CardComponent title link', () => {
  it('records the document metrics when the title is clicked', async () => {
    const docMetrics = vi.fn().mockResolvedValue(undefined);
    const wrapper = mount(CardComponent, {
      props: {
        title: 'Article',
        corpus: 'hal',
        description: 'Article description',
        url: 'https://example.org',
        sdg: [],
        details: { authors: [] },
        toggleBookmark: () => undefined,
        isBookmarked: false,
        id: 'doc-1',
        docMetrics
      }
    });

    await wrapper.get('.card-header-title a').trigger('click');

    expect(docMetrics).toHaveBeenCalledWith('doc-1');
  });
});
