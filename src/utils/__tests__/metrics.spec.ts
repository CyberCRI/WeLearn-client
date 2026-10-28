import { afterEach, describe, expect, it, vi } from 'vitest';
import { addTheConversationTrackerScript, updateClickedDocument } from '../metrics';
import { basePostAxios } from '@/utils/fetch';

vi.mock('@/utils/fetch', () => ({
  basePostAxios: vi.fn()
}));

describe('updateClickedDocument', () => {
  afterEach(() => {
    vi.mocked(basePostAxios).mockReset();
  });

  it('requires a document id', async () => {
    await expect(updateClickedDocument('', 'message')).rejects.toThrow('Document ID is required');
  });

  it('requires a message id', async () => {
    await expect(updateClickedDocument('doc', '')).rejects.toThrow('Message ID is required');
  });

  it('posts the trimmed ids and returns the response data', async () => {
    vi.mocked(basePostAxios).mockResolvedValue({ data: 'ok' } as Awaited<
      ReturnType<typeof basePostAxios>
    >);

    const result = await updateClickedDocument(' doc ', ' message ');

    expect(basePostAxios).toHaveBeenCalledWith('/metric/clicked_document', {
      doc_id: 'doc',
      message_id: 'message'
    });
    expect(result).toBe('ok');
  });
});

describe('addTheConversationTrackerScript', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('adds the tracker script for the given content', () => {
    addTheConversationTrackerScript('12345');

    const tracker = document.getElementById('theconversation_tracker_hook') as HTMLScriptElement;
    expect(tracker.src).toBe('https://theconversation.com/javascripts/lib/content_tracker_hook.js');
    expect(tracker.dataset.counter).toBe('https://counter.theconversation.com/content/12345/count');
    expect(tracker.async).toBe(true);
  });

  it.each(['load', 'error'])('removes the script on %s', (eventName) => {
    addTheConversationTrackerScript('12345');
    const tracker = document.getElementById('theconversation_tracker_hook') as HTMLScriptElement;

    tracker.dispatchEvent(new Event(eventName));

    expect(document.getElementById('theconversation_tracker_hook')).toBeNull();
  });
});
