import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import ThirdStep from '@/components/tutor/ThirdStep.vue';
import { cleanSyllabus } from '@/stores/tutor';

const mountStep = (content: string) =>
  mount(ThirdStep, {
    props: {
      syllabus: { content, source: 'x' },
      giveFeedback: vi.fn(),
      feedbackHistory: [],
      action: vi.fn(),
      updateSyllabus: vi.fn(),
      restart: vi.fn(),
      updateSyllabusInDB: vi.fn()
    }
  });

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
