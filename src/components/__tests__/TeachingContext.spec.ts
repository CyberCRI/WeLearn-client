import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import TeachingContext from '@/components/tutor/TeachingContext.vue';
import { emptyTeachingContext } from '@/utils/teachingContext';

const mountContext = (props: Record<string, unknown> = {}) =>
  mount(TeachingContext, {
    props: {
      context: emptyTeachingContext(),
      prefilled: [],
      updateContext: vi.fn(),
      ...props
    }
  });

describe('TeachingContext', () => {
  it('passes on quick choices and typed values', async () => {
    const wrapper = mountContext();
    const update = wrapper.props('updateContext');
    await wrapper.find('#context-title').setValue('Macroeconomics');
    await wrapper.find('#context-discipline').setValue('Economics');
    await wrapper.find('#context-level').setValue('l1');
    await wrapper.find('#context-length').setValue('1.5');
    await wrapper.find('#context-type').setValue('lecture');
    await wrapper.find('#context-mode').setValue('HYBRIDE');
    expect(update).toHaveBeenCalledWith('title', 'Macroeconomics');
    expect(update).toHaveBeenCalledWith('discipline', 'Economics');
    expect(update).toHaveBeenCalledWith('level', 'l1');
    expect(update).toHaveBeenCalledWith('sessionLength', 1.5);
    expect(update).toHaveBeenCalledWith('sessionType', 'lecture');
    expect(update).toHaveBeenCalledWith('sessionMode', 'HYBRIDE');
  });

  it('keeps only whole positive numbers of sessions and students, anything else means empty', async () => {
    const wrapper = mountContext();
    const update = wrapper.props('updateContext');
    await wrapper.find('#context-sessions').setValue('12');
    await wrapper.find('#context-size').setValue('0');
    await wrapper.find('#context-sessions').setValue('');
    expect(update).toHaveBeenCalledWith('sessions', 12);
    expect(update).toHaveBeenCalledWith('classSize', null);
    expect(update).toHaveBeenLastCalledWith('sessions', null);
  });

  it('empties the session length when "Choose…" is picked again', async () => {
    const wrapper = mountContext({ context: { ...emptyTeachingContext(), sessionLength: 3 } });
    await wrapper.find('#context-length').setValue('');
    expect(wrapper.props('updateContext')).toHaveBeenCalledWith('sessionLength', null);
  });

  it('asks only for what the syllabus did not give', () => {
    const wrapper = mountContext({
      context: { ...emptyTeachingContext(), sessions: 12, sessionLength: 3 },
      prefilled: ['sessions', 'sessionLength']
    });
    expect(wrapper.find('#context-sessions').exists()).toBe(false);
    expect(wrapper.find('#context-length').exists()).toBe(false);
    expect(wrapper.find('#context-level').exists()).toBe(true);
  });
});
