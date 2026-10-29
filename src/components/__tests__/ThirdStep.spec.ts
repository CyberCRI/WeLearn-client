import { describe, it, expect, vi, afterEach } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import ThirdStep from '@/components/tutor/ThirdStep.vue';
import { cleanSyllabus } from '@/stores/tutor';

const mountStep = (content: string, props: Record<string, unknown> = {}) => {
  const wrapper = mount(ThirdStep, {
    props: {
      syllabus: { content, source: 'x' },
      giveFeedback: vi.fn(),
      feedbackHistory: [],
      action: vi.fn(),
      updateSyllabus: vi.fn(),
      restart: vi.fn(),
      updateSyllabusInDB: vi.fn(),
      ...props
    }
  });
  // jsdom follows links even inside editable text, a browser doesn't
  wrapper.find('#syllabus').element.addEventListener('click', (e) => e.preventDefault());
  return wrapper;
};

describe('ThirdStep link bubble', () => {
  it('shows an "open" bubble in a new tab when a link is clicked', async () => {
    const wrapper = mountStep('See [paper](https://example.org/a).');
    await wrapper.find('#syllabus a').trigger('click');
    const open = wrapper.find('.link-bubble a');
    expect(open.attributes('href')).toBe('https://example.org/a');
    expect(open.attributes('target')).toBe('_blank');
  });

  it('hides the bubble when clicking plain text', async () => {
    const wrapper = mountStep('See [paper](https://example.org/a).');
    await wrapper.find('#syllabus a').trigger('click');
    await wrapper.find('#syllabus p').trigger('click');
    expect(wrapper.find('.link-bubble').exists()).toBe(false);
  });

  it('never offers non-web links', async () => {
    const wrapper = mountStep('[bad](javascript:alert(1))');
    const link = wrapper.find('#syllabus a');
    if (link.exists()) await link.trigger('click');
    expect(wrapper.find('.link-bubble').exists()).toBe(false);
  });
});

describe('ThirdStep link bubble closing', () => {
  const openBubble = async () => {
    const wrapper = mountStep('See [paper](https://example.org/a).');
    await wrapper.find('#syllabus a').trigger('click');
    return wrapper;
  };

  it('keeps the bubble on mousedown so the syllabus keeps the focus', async () => {
    const wrapper = await openBubble();
    const event = new MouseEvent('mousedown', { cancelable: true });
    wrapper.find('.link-bubble').element.dispatchEvent(event);
    await wrapper.vm.$nextTick();
    expect(event.defaultPrevented).toBe(true);
    expect(wrapper.find('.link-bubble').exists()).toBe(true);
  });

  it('closes the bubble once the link is opened', async () => {
    const wrapper = await openBubble();
    const open = wrapper.find('.link-bubble a');
    // jsdom would try to navigate, a browser opens a new tab
    open.element.addEventListener('click', (e) => e.preventDefault());
    await open.trigger('click');
    expect(wrapper.find('.link-bubble').exists()).toBe(false);
  });

  it('closes the bubble when typing', async () => {
    const wrapper = await openBubble();
    await wrapper.find('#syllabus').trigger('keydown', { key: 'a' });
    expect(wrapper.find('.link-bubble').exists()).toBe(false);
  });
});

describe('ThirdStep feedback', () => {
  const originalScrollIntoView = Element.prototype.scrollIntoView;
  const originalScrollTo = Element.prototype.scrollTo;

  afterEach(() => {
    Element.prototype.scrollIntoView = originalScrollIntoView;
    Element.prototype.scrollTo = originalScrollTo;
  });

  it('lists the feedback already sent', () => {
    const wrapper = mountStep('# Syllabus', { feedbackHistory: ['shorter', 'more labs'] });
    expect(wrapper.findAll('.feedback-history li').map((li) => li.text())).toEqual([
      'shorter',
      'more labs'
    ]);
  });

  it('sends the feedback, clears it and scrolls back to the syllabus start', async () => {
    Element.prototype.scrollIntoView = vi.fn();
    // scrollTo is overloaded, a plain mock only fits one signature
    Element.prototype.scrollTo = vi.fn() as unknown as Element['scrollTo'];
    const giveFeedback = vi.fn().mockResolvedValue(true);
    const wrapper = mountStep('# Syllabus', { giveFeedback });
    const textarea = wrapper.find('#syllabus-feedback');
    await textarea.setValue('more labs');
    await wrapper.find('.feedback button').trigger('click');
    await flushPromises();
    expect(giveFeedback).toHaveBeenCalledWith('more labs');
    expect((textarea.element as HTMLTextAreaElement).value).toBe('');
    expect(wrapper.find('.feedback .has-text-danger').exists()).toBe(false);
    expect(Element.prototype.scrollTo).toHaveBeenCalledWith({ top: 0 });
    expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start'
    });
  });

  it('keeps the text and shows an error when sending fails', async () => {
    const giveFeedback = vi.fn().mockResolvedValue(false);
    const wrapper = mountStep('# Syllabus', { giveFeedback });
    const textarea = wrapper.find('#syllabus-feedback');
    await textarea.setValue('more labs');
    await wrapper.find('.feedback button').trigger('click');
    await flushPromises();
    expect((textarea.element as HTMLTextAreaElement).value).toBe('more labs');
    expect(wrapper.find('.feedback .has-text-danger').exists()).toBe(true);
  });

  it('keeps the text without an error when sending is cancelled', async () => {
    const giveFeedback = vi.fn().mockResolvedValue(undefined);
    const wrapper = mountStep('# Syllabus', { giveFeedback });
    const textarea = wrapper.find('#syllabus-feedback');
    await textarea.setValue('more labs');
    await wrapper.find('.feedback button').trigger('click');
    await flushPromises();
    expect((textarea.element as HTMLTextAreaElement).value).toBe('more labs');
    expect(wrapper.find('.feedback .has-text-danger').exists()).toBe(false);
  });

  it('does not send blank feedback', async () => {
    const giveFeedback = vi.fn();
    const wrapper = mountStep('# Syllabus', { giveFeedback });
    await wrapper.find('#syllabus-feedback').setValue('   ');
    const button = wrapper.find('.feedback button');
    expect(button.attributes('disabled')).toBeDefined();
    await button.trigger('click');
    expect(giveFeedback).not.toHaveBeenCalled();
  });
});

describe('ThirdStep actions', () => {
  it('restarts and downloads the syllabus', async () => {
    const wrapper = mountStep('# Syllabus');
    await wrapper.find('.actions .is-text').trigger('click');
    await wrapper.find('.actions .is-primary').trigger('click');
    expect(wrapper.props('restart')).toHaveBeenCalledTimes(1);
    expect(wrapper.props('action')).toHaveBeenCalledTimes(1);
  });
});

describe('ThirdStep editing keeps the syllabus intact', () => {
  const table = '| Week | Content |\n| --- | --- |\n| 1 | Intro<br>- E-waste<br>- Hubs |';

  it('does not rewrite the syllabus when nothing was typed (e.g. after clicking a link)', async () => {
    const wrapper = mountStep(`${table}\n\nSee [paper](https://example.org/a).`);
    await wrapper.find('#syllabus a').trigger('click');
    await wrapper.find('#syllabus').trigger('blur');
    expect(wrapper.props('updateSyllabus')).not.toHaveBeenCalled();
  });

  it('keeps line breaks inside table cells after an edit, instead of turning them into bullets', async () => {
    const wrapper = mountStep(table);
    const syllabus = wrapper.find('#syllabus');
    await syllabus.trigger('input');
    await syllabus.trigger('blur');
    const saved = (wrapper.props('updateSyllabus') as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(saved).toContain('| 1 | Intro<br>- E-waste<br>- Hubs |');
  });
});

describe('cleanSyllabus', () => {
  it('turns literal "\\n" into <br> in tables and into new lines elsewhere', () => {
    expect(cleanSyllabus('| 1 | a \\n- b |\nText\\nmore')).toBe('| 1 | a <br>- b |\nText\nmore');
  });
});
