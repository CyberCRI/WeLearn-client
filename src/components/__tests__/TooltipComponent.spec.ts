import { describe, it, expect, vi, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import TooltipComponent from '../TooltipComponent.vue';

// the tooltip anchors on its parent element: mount it inside one
const Host = defineComponent({
  render: () => h('button', { class: 'anchor' }, [h(TooltipComponent, { tooltipText: 'Hello' })])
});

describe('TooltipComponent', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('places itself inside the window when its parent is hovered, hides on leave', async () => {
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      cb(0);
      return 0;
    });
    const wrapper = mount(Host, { attachTo: document.body, global: { stubs: { teleport: true } } });
    const tip = wrapper.get('.tooltip').element as HTMLElement;
    expect(tip.textContent).toBe('Hello');

    await wrapper.get('.anchor').trigger('mouseenter');
    // no room above a 0px-high anchor at the top of the page: it drops below, kept 8px from the edge
    expect(tip.style.visibility).toBe('visible');
    expect(tip.style.top).toBe('6px');
    expect(tip.style.left).toBe('8px');

    await wrapper.get('.anchor').trigger('mouseleave');
    expect(tip.style.visibility).toBe('');
    wrapper.unmount();
  });
});
