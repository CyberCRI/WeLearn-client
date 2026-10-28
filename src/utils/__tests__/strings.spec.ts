import { afterEach, describe, expect, it, vi } from 'vitest';
import { chatSplitEffect, idToLabel } from '../strings';
import type { ChatMessage } from '@/types';

describe('idToLabel', () => {
  it('replaces every hyphen with a space', () => {
    expect(idToLabel('world-bank-open-knowledge-repository')).toBe(
      'world bank open knowledge repository'
    );
  });

  it('leaves an id without hyphens unchanged', () => {
    expect(idToLabel('openalex')).toBe('openalex');
  });
});

describe('chatSplitEffect', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('appends the answer to the message word by word', () => {
    vi.useFakeTimers();
    const message = { role: 'assistant', content: '' } as ChatMessage;

    expect(chatSplitEffect('hello big world', message)).toBeNull();
    expect(message.content).toBe('');

    vi.advanceTimersByTime(25);
    expect(message.content).toBe('hello ');

    vi.runAllTimers();
    expect(message.content).toBe('hello big world');
  });
});
