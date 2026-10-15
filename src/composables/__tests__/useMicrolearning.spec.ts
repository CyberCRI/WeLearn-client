import { reactive } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useMicrolearning } from '../useMicrolearning';
import { basePostAxios } from '@/utils/fetch';
import { flushPromises } from '@vue/test-utils';
import { ScreensEnum } from '@/types/microlearning';

vi.mock('vue-router', () => ({
  useRoute: () => reactive({ query: {} }),
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() })
}));

vi.mock('@/utils/fetch', () => ({
  basePostAxios: vi.fn()
}));

describe('useMicrolearning form answers', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.mocked(basePostAxios).mockResolvedValue({} as Awaited<ReturnType<typeof basePostAxios>>);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('registerFormAnswer', () => {
    it('posts one entry per answer as a string', async () => {
      const { registerFormAnswer } = useMicrolearning();

      await registerFormAnswer({ link: 3, willUse: 'yes' }, 'math_microlearning_pre');

      expect(basePostAxios).toHaveBeenCalledTimes(2);
      expect(basePostAxios).toHaveBeenCalledWith('/metric/form_data', {
        form_name: 'math_microlearning_pre',
        question: 'link',
        answer: '3',
        answer_type: 'text'
      });
      expect(basePostAxios).toHaveBeenCalledWith('/metric/form_data', {
        form_name: 'math_microlearning_pre',
        question: 'willUse',
        answer: 'yes',
        answer_type: 'text'
      });
    });

    it('sends empty answers as empty strings', async () => {
      const { registerFormAnswer } = useMicrolearning();

      await registerFormAnswer(
        { link: 3, willUse: '', feedback: undefined },
        'math_microlearning_pre'
      );

      expect(basePostAxios).toHaveBeenCalledTimes(3);
      expect(basePostAxios).toHaveBeenCalledWith(
        '/metric/form_data',
        expect.objectContaining({ question: 'willUse', answer: '' })
      );
      expect(basePostAxios).toHaveBeenCalledWith(
        '/metric/form_data',
        expect.objectContaining({ question: 'feedback', answer: '' })
      );
    });

    it('records the form as answered in localStorage on success', async () => {
      const { registerFormAnswer } = useMicrolearning();

      await registerFormAnswer({ link: 3 }, 'math_microlearning_pre');

      expect(localStorage.getItem('math_microlearning_pre')).toBe('true');
    });

    it('does not record the form locally when the request fails', async () => {
      vi.mocked(basePostAxios).mockRejectedValue(new Error('network'));
      vi.spyOn(console, 'error').mockImplementation(() => {});
      const { registerFormAnswer } = useMicrolearning();

      const result = await registerFormAnswer({ link: 3 }, 'math_microlearning_pre');

      expect(result).toBeUndefined();
      expect(localStorage.getItem('math_microlearning_pre')).toBeNull();
    });
  });

  describe('startTrail', () => {
    it('submits pre answers under the discipline-prefixed form name', async () => {
      const { selectDiscipline, preAnswers, startTrail } = useMicrolearning();
      selectDiscipline('math');
      preAnswers.confidence = 4;

      startTrail();
      await flushPromises();

      expect(basePostAxios).toHaveBeenCalledWith(
        '/metric/form_data',
        expect.objectContaining({ form_name: 'math_microlearning_pre', question: 'confidence' })
      );
      expect(localStorage.getItem('math_microlearning_pre')).toBe('true');
    });

    it('does not submit anything when no pre answer was given', async () => {
      const { selectDiscipline, preAnswers, startTrail } = useMicrolearning();
      selectDiscipline('math');
      preAnswers.willUse = '';

      startTrail();
      await flushPromises();

      expect(basePostAxios).not.toHaveBeenCalled();
      expect(localStorage.getItem('math_microlearning_pre')).toBeNull();
    });
  });

  describe('goToComplete', () => {
    it('submits post answers under the post form name', async () => {
      const { selectDiscipline, preAnswers, postAnswers, goToComplete } = useMicrolearning();
      selectDiscipline('math');
      preAnswers.confidence = 1;
      postAnswers.confidence = 5;

      goToComplete();
      await flushPromises();

      expect(basePostAxios).toHaveBeenCalledTimes(1);
      expect(basePostAxios).toHaveBeenCalledWith('/metric/form_data', {
        form_name: 'math_microlearning_post',
        question: 'confidence',
        answer: '5',
        answer_type: 'text'
      });
      expect(localStorage.getItem('math_microlearning_post')).toBe('true');
    });

    it('does not submit anything when no post answer was given', async () => {
      const { selectDiscipline, goToComplete } = useMicrolearning();
      selectDiscipline('math');

      goToComplete();
      await flushPromises();

      expect(basePostAxios).not.toHaveBeenCalled();
    });
  });

  describe('goToautoEvalStart', () => {
    it('shows the pre form when it was never submitted', () => {
      const { selectDiscipline, goToautoEvalStart, screen } = useMicrolearning();
      selectDiscipline('math');

      goToautoEvalStart();

      expect(screen.value).toBe(ScreensEnum.autoEvalStart);
    });

    it('goes straight to the trail when the pre form was already submitted', () => {
      localStorage.setItem('math_microlearning_pre', 'true');
      const { selectDiscipline, goToautoEvalStart, screen, step } = useMicrolearning();
      selectDiscipline('math');

      goToautoEvalStart();

      expect(screen.value).toBe(ScreensEnum.trail);
      expect(step.value).toBe(0);
      expect(basePostAxios).not.toHaveBeenCalled();
    });
  });

  describe('nextStep on the last step', () => {
    it('shows the post form when it was never submitted', () => {
      const { selectDiscipline, nextStep, screen, step, currentData } = useMicrolearning();
      selectDiscipline('math');
      step.value = currentData.value!.steps.length - 1;

      nextStep();

      expect(screen.value).toBe(ScreensEnum.autoEvalEnd);
    });

    it('goes straight to the end when the post form was already submitted', () => {
      localStorage.setItem('math_microlearning_post', 'true');
      const { selectDiscipline, nextStep, screen, step, currentData } = useMicrolearning();
      selectDiscipline('math');
      step.value = currentData.value!.steps.length - 1;

      nextStep();

      expect(screen.value).toBe(ScreensEnum.complete);
      expect(basePostAxios).not.toHaveBeenCalled();
    });
  });

  describe('prevStep', () => {
    it('goes back to the briefing from the first step when the pre form is hidden', () => {
      localStorage.setItem('math_microlearning_pre', 'true');
      const { selectDiscipline, goToautoEvalStart, prevStep, screen } = useMicrolearning();
      selectDiscipline('math');
      goToautoEvalStart();

      prevStep();

      expect(screen.value).toBe(ScreensEnum.briefing);
    });
  });

  describe('shouldHideAutoEvalStart', () => {
    it('is false when the pre form was never submitted for the discipline', () => {
      const { selectDiscipline, shouldHideAutoEvalStart } = useMicrolearning();
      selectDiscipline('math');

      expect(shouldHideAutoEvalStart.value).toBe(false);
    });

    it('is true when the pre form was submitted for the discipline', () => {
      localStorage.setItem('math_microlearning_pre', 'true');
      const { selectDiscipline, shouldHideAutoEvalStart } = useMicrolearning();
      selectDiscipline('math');

      expect(shouldHideAutoEvalStart.value).toBe(true);
    });

    it('is scoped to the selected discipline', () => {
      localStorage.setItem('history_microlearning_pre', 'true');
      const { selectDiscipline, shouldHideAutoEvalStart } = useMicrolearning();
      selectDiscipline('math');

      expect(shouldHideAutoEvalStart.value).toBe(false);
    });
  });
});
