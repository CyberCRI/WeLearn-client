import { describe, it, expect } from 'vitest';
import { reactive } from 'vue';
import { mount } from '@vue/test-utils';
import AutoEvaluationStart from '../AutoEvaluationStart.vue';
import AutoEvaluationEnd from '../AutoEvaluationEnd.vue';
import type { EvalAnswers } from '@/types/learn/discipline';

describe.each([
  [
    'AutoEvaluationStart',
    AutoEvaluationStart,
    { locked: false, linkQuestion: 'link' },
    { link: 1, confidence: 1 }
  ],
  [
    'AutoEvaluationEnd',
    AutoEvaluationEnd,
    { linkQuestion: 'link' },
    { link: 1, confidence: 1, willUse: 'yes', feedback: 'feedback' }
  ]
])('%s', (_, component, props, expected) => {
  const mountForm = (answers: EvalAnswers = {}) =>
    mount(component, { props: { ...props, answers } });

  it('fills the shared answers object in place', async () => {
    const answers = reactive<EvalAnswers>({});
    const wrapper = mountForm(answers);

    // the first button of each scale, then the free-text field when there is one
    for (const field of wrapper.findAll('.questionAndScale')) {
      const button = field.find('button.scaleValue');
      if (button.exists()) await button.trigger('click');
      else await field.get('textarea').setValue('feedback');
    }

    expect(answers).toEqual(expected);
  });

  it('emits start on next and back on previous', async () => {
    const wrapper = mountForm();

    await wrapper.get('.btn-primary').trigger('click');
    await wrapper.get('.btn-secondary').trigger('click');

    expect(wrapper.emitted('start')).toHaveLength(1);
    expect(wrapper.emitted('back')).toHaveLength(1);
    expect(wrapper.emitted('skip')).toBeUndefined();
  });

  // skip must not submit, so it is a separate event
  it('emits skip, not start, on skip', async () => {
    const wrapper = mountForm();

    await wrapper.get('.skip-link').trigger('click');

    expect(wrapper.emitted('skip')).toHaveLength(1);
    expect(wrapper.emitted('start')).toBeUndefined();
  });
});

describe('AutoEvaluationStart once the trail was seen', () => {
  it('shows the locked notice and cannot be skipped', () => {
    const wrapper = mount(AutoEvaluationStart, {
      props: { locked: true, linkQuestion: 'link', answers: {} }
    });

    expect(wrapper.text()).toContain('autoEvaluation.start.lockedNotice');
    expect(wrapper.find('.skip-link').exists()).toBe(false);
  });
});

describe('the self-evaluation of another feature', () => {
  it('asks its own questions, and the start one can have no way back', () => {
    const start = mount(AutoEvaluationStart, {
      props: {
        locked: false,
        linkQuestion: 'my link',
        showBack: false,
        nextLabel: 'next',
        answers: {}
      }
    });
    const end = mount(AutoEvaluationEnd, {
      props: { linkQuestion: 'my link', willUseQuestion: 'my will use', answers: {} }
    });

    expect(start.text()).toContain('my link');
    expect(start.find('.btn-secondary').exists()).toBe(false);
    expect(end.text()).toContain('my link');
    expect(end.text()).toContain('my will use');
  });
});
