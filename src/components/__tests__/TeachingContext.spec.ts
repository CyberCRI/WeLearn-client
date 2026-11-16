import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import TeachingContext from '@/components/tutor/TeachingContext.vue';
import { emptyTeachingContext } from '@/utils/teachingContext';

const ALL = [
  'title',
  'discipline',
  'level',
  'sessions',
  'sessionLength',
  'sessionType',
  'sessionMode',
  'classSize'
];

const mountContext = (props: Record<string, unknown> = {}) =>
  mount(TeachingContext, {
    props: {
      context: emptyTeachingContext(),
      prefilled: [],
      updateContext: vi.fn(),
      keys: ALL,
      ...props
    } as never
  });

describe('TeachingContext', () => {
  it('passes on quick choices and typed values', async () => {
    const wrapper = mountContext();
    const update = wrapper.props('updateContext');
    await wrapper.find('#context-title').setValue('Macroeconomics');
    await wrapper.find('#context-discipline').setValue('Economics');
    await wrapper.find('#context-level').setValue('l1');
    await wrapper.find('#context-sessionLength').setValue('1.5');
    await wrapper.find('#context-sessionType').setValue('lecture');
    await wrapper.find('#context-sessionMode').setValue('HYBRIDE');
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
    await wrapper.find('#context-classSize').setValue('0');
    await wrapper.find('#context-sessions').setValue('');
    expect(update).toHaveBeenCalledWith('sessions', 12);
    expect(update).toHaveBeenCalledWith('classSize', null);
    expect(update).toHaveBeenLastCalledWith('sessions', null);
  });

  it('empties the session length when "Choose…" is picked again', async () => {
    const wrapper = mountContext({ context: { ...emptyTeachingContext(), sessionLength: 3 } });
    await wrapper.find('#context-sessionLength').setValue('');
    expect(wrapper.props('updateContext')).toHaveBeenCalledWith('sessionLength', null);
  });

  it('shows the teaching context by default, framed, and only the given fields otherwise', () => {
    const framed = mount(TeachingContext, {
      props: { context: emptyTeachingContext(), prefilled: [], updateContext: vi.fn() }
    });
    expect(framed.find('h2').exists()).toBe(true);
    expect(framed.find('#context-title').exists()).toBe(false);
    expect(framed.find('#context-classSize').exists()).toBe(true);

    const plain = mountContext({ keys: ['title', 'level'], isPlain: true });
    expect(plain.find('h2').exists()).toBe(false);
    expect(plain.findAll('.field')).toHaveLength(2);
  });

  it('marks values read from the syllabus once, with their line on hover', () => {
    const wrapper = mountContext({
      context: { ...emptyTeachingContext(), level: 'l1', sessions: 12 },
      prefilled: ['level', 'sessions'],
      evidence: { level: 'L 1- S1' }
    });
    const marks = wrapper.findAll('[data-testid="prefilled"]');
    expect(marks).toHaveLength(2);
    expect(marks[0].attributes('title')).toBe('L 1- S1');
    expect((wrapper.find('#context-sessions').element as HTMLInputElement).value).toBe('12');
  });

  it('marks values the AI read but that are not word for word in the syllabus, for checking', () => {
    const wrapper = mountContext({
      context: { ...emptyTeachingContext(), discipline: 'Economics' },
      aiFilled: ['discipline']
    });
    expect(wrapper.find('[data-testid="ai-filled"]').text()).toBe('tutor.course.readByAi');
    expect(wrapper.find('[data-testid="prefilled"]').exists()).toBe(false);
  });
});
