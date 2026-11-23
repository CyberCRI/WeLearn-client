import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { flushPromises } from '@vue/test-utils';
import { POST_FORM, PRE_FORM, useSyllabusEvalStore } from '../syllabusEval';
import { basePostAxios } from '@/utils/fetch';

vi.mock('@/utils/fetch', () => ({ basePostAxios: vi.fn() }));

const sent = () => vi.mocked(basePostAxios).mock.calls.map(([, body]) => body);
const stored = (form: string) => JSON.parse(localStorage.getItem(form) || 'null');
// a new visit: the store as the next page load creates it
const nextVisit = () => {
  setActivePinia(createPinia());
  return useSyllabusEvalStore();
};

describe('syllabus self-evaluation store', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('featurePreview', JSON.stringify(['syllabusV2']));
    vi.mocked(basePostAxios).mockReset();
    vi.mocked(basePostAxios).mockResolvedValue({} as never);
    setActivePinia(createPinia());
  });
  afterEach(() => localStorage.clear());

  it('asks "before" once: the answers sent to the research metrics, then never again', async () => {
    const evaluation = useSyllabusEvalStore();
    expect(evaluation.isPreDue).toBe(true);

    evaluation.preAnswers.link = 2;
    evaluation.preAnswers.confidence = 4;
    evaluation.submitPre();
    expect(evaluation.isPreDue).toBe(false);
    await flushPromises();

    expect(sent()).toEqual([
      { form_name: PRE_FORM, question: 'link', answer: '2', answer_type: 'text' },
      { form_name: PRE_FORM, question: 'confidence', answer: '4', answer_type: 'text' }
    ]);
    expect(stored(PRE_FORM)).toBe(true);
    expect(nextVisit().isPreDue).toBe(false);
  });

  it('counts a skipped form as done, nothing sent', () => {
    const evaluation = useSyllabusEvalStore();
    evaluation.preAnswers.link = 2;

    evaluation.skipPre();
    evaluation.skipPost();

    expect(basePostAxios).not.toHaveBeenCalled();
    expect(evaluation.preAnswers).toEqual({});
    const next = nextVisit();
    expect(next.isPreDue).toBe(false);
    expect(next.isPostDue).toBe(false);
  });

  it('sends "after" with the path it was answered on', async () => {
    const evaluation = useSyllabusEvalStore();
    evaluation.postAnswers.willUse = 'yes';

    evaluation.submitPost('existing');
    await flushPromises();

    expect(sent()).toEqual([
      { form_name: POST_FORM, question: 'willUse', answer: 'yes', answer_type: 'text' },
      { form_name: POST_FORM, question: 'path', answer: 'existing', answer_type: 'text' }
    ]);
    expect(nextVisit().isPostDue).toBe(false);
  });

  it('asks again next time the answers that could not be saved', async () => {
    vi.mocked(basePostAxios).mockRejectedValue(new Error('network'));
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const evaluation = useSyllabusEvalStore();
    evaluation.preAnswers.link = 2;

    evaluation.submitPre();
    await flushPromises();

    expect(evaluation.isPreDue).toBe(false);
    expect(nextVisit().isPreDue).toBe(true);
  });

  it('shows "after" only once the syllabus is downloaded', () => {
    const evaluation = useSyllabusEvalStore();
    expect(evaluation.isPostDue).toBe(true);
    expect(evaluation.isPostShown).toBe(false);

    evaluation.offerPost();
    expect(evaluation.isPostShown).toBe(true);

    evaluation.skipPost();
    expect(evaluation.isPostShown).toBe(false);
  });

  it('never asks without the syllabusV2 flag', () => {
    localStorage.removeItem('featurePreview');
    const evaluation = nextVisit();

    expect(evaluation.isPreDue).toBe(false);
    expect(evaluation.isPostDue).toBe(false);
  });
});
