import { afterEach, describe, expect, it } from 'vitest';
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
