import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { clearSavedForms, useEvalForms } from '../useEvalForms';
import { basePostAxios } from '@/utils/fetch';

vi.mock('@/utils/fetch', () => ({ basePostAxios: vi.fn() }));

describe('useEvalForms storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.mocked(basePostAxios).mockReset();
  });

  it('keeps what was saved under a common prefix', async () => {
    vi.mocked(basePostAxios).mockResolvedValue({} as never);
    const { registerFormAnswer, isFormSubmitted } = useEvalForms();

    await registerFormAnswer({ link: 3 }, 'syllabus_v2_pre');

    expect(localStorage.getItem('evalForm:syllabus_v2_pre')).toBe('true');
    expect(localStorage.getItem('syllabus_v2_pre')).toBeNull();
    expect(useEvalForms().isFormSubmitted('syllabus_v2_pre')).toBe(true);
    expect(isFormSubmitted('math_microlearning_post')).toBe(false);
  });

  // older versions used the bare form name
  it('moves a form saved by an older version under the prefix on first read', () => {
    localStorage.setItem('math_microlearning_pre', 'true');
    localStorage.setItem('syllabus_v2_post', JSON.stringify(['link']));
    const { isFormSubmitted, getSavedForm } = useEvalForms();

    expect(isFormSubmitted('math_microlearning_pre')).toBe(true);
    expect(getSavedForm('syllabus_v2_post')).toEqual(['link']);

    expect(localStorage.getItem('math_microlearning_pre')).toBeNull();
    expect(localStorage.getItem('evalForm:math_microlearning_pre')).toBe('true');
    expect(localStorage.getItem('syllabus_v2_post')).toBeNull();
    expect(localStorage.getItem('evalForm:syllabus_v2_post')).toBe('["link"]');
  });

  it('reads no other key as a form', () => {
    localStorage.setItem('language', JSON.stringify(true));

    expect(useEvalForms().isFormSubmitted('language')).toBe(false);
    expect(localStorage.getItem('language')).toBe('true');
  });

  it('clears every form, old or new, and nothing else', () => {
    localStorage.setItem('evalForm:syllabus_v2_pre', 'true');
    localStorage.setItem('evalForm:history_microlearning_post', '["link"]');
    localStorage.setItem('math_microlearning_pre', 'true');
    localStorage.setItem('syllabus_v2_post', 'true');
    localStorage.setItem('language', 'fr');
    localStorage.setItem('chatThreadId', 'thread-1');

    clearSavedForms();

    expect(Object.keys({ ...localStorage }).sort()).toEqual(['chatThreadId', 'language']);
  });
});
