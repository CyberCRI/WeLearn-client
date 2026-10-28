import { afterEach, describe, expect, it, vi } from 'vitest';
import { scrollToAnchor } from '../navigation';

describe('scrollToAnchor', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('warns and does nothing when the element is missing', () => {
    const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    scrollToAnchor('nowhere');

    expect(consoleWarn).toHaveBeenCalledWith('Element with id "nowhere" not found.');
  });

  it('scrolls the element into view', () => {
    const anchor = document.createElement('div');
    anchor.id = 'anchor';
    // jsdom does not implement scrollIntoView
    anchor.scrollIntoView = vi.fn();
    document.body.appendChild(anchor);

    scrollToAnchor('anchor');

    expect(anchor.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
      inline: 'center'
    });
  });
});
