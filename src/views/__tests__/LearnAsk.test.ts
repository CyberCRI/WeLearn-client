import { describe, it, expect, vi } from 'vitest';
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import LearnAsk from '../student/LearnAsk.vue';
import ChatBuble from '@/components/ChatBuble.vue';
import ChatInput from '@/components/ChatInput.vue';
import ChatQueuesPills from '@/components/ChatQueuesPills.vue';
import { useChatStore } from '@/stores/chat';
import { basePostAxios } from '@/utils/fetch';
import { en } from '@/localisation/en';

vi.mock('vue-router', async (importOriginal) => ({
  ...(await importOriginal<typeof import('vue-router')>()),
  onBeforeRouteLeave: vi.fn(),
  useRouter: () => ({ push: vi.fn() })
}));
vi.mock('@/utils/fetch', () => ({ basePostAxios: vi.fn(), getSearch: vi.fn() }));

const mountPage = () => {
  sessionStorage.clear();
  setActivePinia(createPinia());
  return mount(LearnAsk, {
    global: {
      stubs: { RouterLink: RouterLinkStub }
    }
  });
};

describe('LearnAsk', () => {
  // the starters as Ask WeLearn's pills: the labels the learner sees (texts from en.ts)
  const STARTERS = [
    en.student.starts.exploring,
    en.student.starts.question,
    en.student.starts.working
  ];
  const bubbles = (wrapper: ReturnType<typeof mountPage>) =>
    wrapper.findAllComponents(ChatBuble).map((bubble) => ({
      isLearner: bubble.props('isUSer'),
      text: bubble.props('message')
    }));

  it('opens in Ask WeLearn’s chat with the greeting and the three starters as pills', async () => {
    const wrapper = mountPage();
    await flushPromises();
    expect(bubbles(wrapper)).toEqual([{ isLearner: false, text: en.student.ask.greeting }]);
    expect(
      wrapper
        .findComponent(ChatQueuesPills)
        .findAll('.message')
        .map((m) => m.text())
    ).toEqual(STARTERS);
    expect(wrapper.findComponent(ChatInput).exists()).toBe(true);
  });

  it('turns a starter into the learner’s first message, and the starters give way', async () => {
    vi.mocked(basePostAxios).mockResolvedValue({
      status: 200,
      data: { answer: JSON.stringify({ reply: 'What are you curious about?', purpose: null }) }
    } as any);
    const wrapper = mountPage();
    await flushPromises();
    await wrapper.findComponent(ChatQueuesPills).findAll('.card')[0].trigger('click');
    await flushPromises();
    expect(bubbles(wrapper)).toEqual([
      { isLearner: false, text: en.student.ask.greeting },
      { isLearner: true, text: STARTERS[0] },
      { isLearner: false, text: 'What are you curious about?' }
    ]);
    expect(wrapper.findComponent(ChatQueuesPills).exists()).toBe(false);
  });

  it('keeps what the learner types apart from Ask WeLearn’s own input', async () => {
    vi.mocked(basePostAxios).mockResolvedValue({
      status: 200,
      data: { answer: JSON.stringify({ reply: 'Tell me more.', purpose: null }) }
    } as any);
    const wrapper = mountPage();
    await flushPromises();
    await wrapper.find('textarea').setValue('I work on a farm.');
    expect(useChatStore().chatInput).toBe('');
    await wrapper.find('textarea').trigger('keydown', { key: 'Enter' });
    await flushPromises();
    expect(bubbles(wrapper).at(-2)).toEqual({ isLearner: true, text: 'I work on a farm.' });
    expect((wrapper.find('textarea').element as HTMLTextAreaElement).value).toBe('');
  });
});
