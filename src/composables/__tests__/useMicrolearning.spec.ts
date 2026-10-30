import { nextTick, reactive } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useMicrolearning } from '../useMicrolearning';
import { basePostAxios } from '@/utils/fetch';
import { flushPromises } from '@vue/test-utils';
import { ScreensEnum } from '@/types/microlearning';
import { track } from '@/utils/analytics';

// one route per test, so a test can change the query like a browser back/forward would
const routing = vi.hoisted(() => ({
  route: { query: {} } as { query: Record<string, string> },
  push: null as unknown as ReturnType<typeof vi.fn>
}));

vi.mock('vue-router', () => ({
  useRoute: () => routing.route,
  useRouter: () => ({ push: routing.push, replace: vi.fn() })
}));

vi.mock('@/utils/fetch', () => ({
  basePostAxios: vi.fn()
}));

vi.mock('@/utils/analytics', () => ({ track: vi.fn() }));

describe('useMicrolearning form answers', () => {
  beforeEach(() => {
    localStorage.clear();
    routing.route = reactive({ query: {} });
    routing.push = vi.fn();
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

  describe('analytics', () => {
    it('tracks the start, each step and the end of a trail', () => {
      const { selectDiscipline, startTrail, nextStep, postAnswers, goToComplete } =
        useMicrolearning();
      selectDiscipline('math');

      startTrail();
      nextStep();
      postAnswers.confidence = 5;
      goToComplete();

      expect(track).toHaveBeenCalledWith('Microlearning Started', { discipline: 'math' });
      expect(track).toHaveBeenCalledWith('Microlearning Step Completed', {
        discipline: 'math',
        stepIndex: 0
      });
      expect(track).toHaveBeenCalledWith('Microlearning Completed', {
        discipline: 'math',
        hasPreEval: false,
        hasPostEval: true
      });
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

  describe('navigation', () => {
    it('goes back to the trail', () => {
      const { selectDiscipline, backToTrail, screen } = useMicrolearning();
      selectDiscipline('math');

      backToTrail();

      expect(screen.value).toBe(ScreensEnum.trail);
    });

    it('restarts from the welcome screen and forgets the progress', () => {
      const { selectDiscipline, startTrail, nextStep, flipCard, restart, ...state } =
        useMicrolearning();
      selectDiscipline('math');
      state.preAnswers.confidence = 2;
      startTrail();
      nextStep();
      flipCard(0);

      restart();

      expect(state.screen.value).toBe(ScreensEnum.welcome);
      expect(state.disc.value).toBeNull();
      expect(state.current_disc.value).toBeNull();
      expect(state.step.value).toBe(0);
      expect(state.flippedCards.value).toEqual([]);
      expect(state.preAnswers).toEqual({});
      expect(state.preLocked.value).toBe(false);
    });

    it('pushes the screen and step to the url', async () => {
      routing.route.query = { lang: 'en' };
      const { selectDiscipline, startTrail } = useMicrolearning();
      selectDiscipline('math');
      startTrail();
      await nextTick();

      expect(routing.push).toHaveBeenLastCalledWith({
        query: { lang: 'en', disc: 'math', screen: ScreensEnum.trail, step: '0' }
      });
    });
  });

  describe('flipCard', () => {
    it('reveals each card once and never hides it again', () => {
      const { flipCard, flippedCards } = useMicrolearning();

      flipCard(1);
      flipCard(0);
      flipCard(1);

      expect(flippedCards.value).toEqual([1, 0]);
    });
  });

  describe('chooseActivity', () => {
    it('stores the chosen activity and can clear it', () => {
      const { selectDiscipline, chooseActivity, actChoice, chosenActivity } = useMicrolearning();
      selectDiscipline('math');

      chooseActivity({ apport: 0, act: 0 });

      expect(actChoice.value).toEqual({ apport: 0, act: 0 });
      expect(chosenActivity.value).not.toBeNull();

      chooseActivity(null);

      expect(actChoice.value).toBeNull();
      expect(chosenActivity.value).toBeNull();
    });
  });

  describe('url query (applyQuery)', () => {
    it('restores the discipline, screen and step from the url', async () => {
      const { disc, screen, step } = useMicrolearning();

      routing.route.query = { disc: 'math', screen: ScreensEnum.trail, step: '2' };
      await nextTick();

      expect(disc.value).toBe('math');
      expect(screen.value).toBe(ScreensEnum.trail);
      expect(step.value).toBe(2);
    });

    it('clamps the step to the trail length', async () => {
      const { step, currentData } = useMicrolearning();

      routing.route.query = { disc: 'math', screen: ScreensEnum.trail, step: '999' };
      await nextTick();

      expect(step.value).toBe(currentData.value!.steps.length - 1);
    });

    it('starts at the first step when the step is not a number', async () => {
      const { step, screen } = useMicrolearning();

      routing.route.query = { disc: 'math', screen: ScreensEnum.briefing, step: 'abc' };
      await nextTick();

      expect(screen.value).toBe(ScreensEnum.briefing);
      expect(step.value).toBe(0);
    });

    it.each([
      ['an unknown discipline', { disc: 'astrology', screen: 'trail' }],
      ['an unknown screen', { disc: 'math', screen: 'nowhere' }],
      ['no screen', { disc: 'math' }]
    ])('goes back to the welcome screen for %s', async (_, query) => {
      const { selectDiscipline, screen } = useMicrolearning();
      selectDiscipline('math');
      await nextTick();

      routing.route.query = query;
      await nextTick();

      expect(screen.value).toBe(ScreensEnum.welcome);
    });
  });
});
