import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import ChatArea from '@/components/ChatArea.vue';

// jsdom has no layout: give the scroller a content taller than its box
const mountArea = () => {
  const wrapper = mount(ChatArea, { props: { isEmpty: false } });
  const el = wrapper.element as HTMLElement;
  Object.defineProperty(el, 'scrollHeight', { value: 500, configurable: true });
  Object.defineProperty(el, 'clientHeight', { value: 100, configurable: true });
  Object.defineProperty(el, 'scrollTop', { value: 0, writable: true, configurable: true });
  // v-show only toggles the inline style
  const isArrowShown = () =>
    !wrapper.find('.scroll-arrow').attributes('style')?.includes('display: none');
  return { wrapper, el, isArrowShown };
};

describe('ChatArea', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('shows the arrow when scrolled up and scrolls smoothly to the bottom on click', async () => {
    const { wrapper, el, isArrowShown } = mountArea();
    expect(isArrowShown()).toBe(false);

    await wrapper.trigger('scroll');
    expect(isArrowShown()).toBe(true);

    el.scrollTop = 0;
    await wrapper.find('.scroll-arrow').trigger('click');
    expect(el.style.scrollBehavior).toBe('smooth');
    expect(el.scrollTop).toBe(500);

    await wrapper.trigger('scroll');
    expect(isArrowShown()).toBe(false);
  });

  it('stops following new content once the user scrolls with the wheel, until the mouse leaves', async () => {
    const { wrapper, el, isArrowShown } = mountArea();
    await wrapper.trigger('wheel');
    expect(isArrowShown()).toBe(true);

    await wrapper.find('.scroll-arrow').trigger('click');
    expect(el.scrollTop).toBe(0);

    await wrapper.trigger('mouseleave');
    await wrapper.find('.scroll-arrow').trigger('click');
    expect(el.scrollTop).toBe(500);
  });

  it('stops following new content while the user touches the screen', async () => {
    const { wrapper, el } = mountArea();
    await wrapper.trigger('touchstart');
    await wrapper.find('.scroll-arrow').trigger('click');
    expect(el.scrollTop).toBe(0);

    await wrapper.trigger('touchend');
    await wrapper.find('.scroll-arrow').trigger('click');
    expect(el.scrollTop).toBe(500);
  });
});
