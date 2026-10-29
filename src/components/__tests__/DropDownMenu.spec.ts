import { mount } from '@vue/test-utils';
import DropDownMenu from '../DropDownMenu.vue';
import { describe, it, expect, afterEach } from 'vitest';
import type { VueWrapper } from '@vue/test-utils';

describe('DropDownMenu', () => {
  it('renders correctly', () => {
    const wrapper = mount(DropDownMenu, {
      propsData: {
        title: 'title'
      }
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('renders correctly with the items slot and click on dropdown element', async () => {
    const wrapper = mount(DropDownMenu, {
      propsData: {
        title: 'title'
      },
      slots: {
        items: '<div>Item 1</div><div>Item 2</div>'
      }
    });
    await wrapper.find('.selection').trigger('click');
    expect(wrapper.html()).toMatchSnapshot();
    expect(wrapper.find('.options').exists()).toBe(true);
  });

  describe('visibility', () => {
    let wrapper: VueWrapper;

    const mountMenu = (closeOnClick = false) =>
      mount(DropDownMenu, {
        props: { title: 'title', closeOnClick },
        slots: { itemsList: '<div class="item">Item 1</div>' },
        attachTo: document.body
      });

    afterEach(() => {
      wrapper.unmount();
    });

    it('toggles the options when the title is clicked twice', async () => {
      wrapper = mountMenu();

      await wrapper.get('.selection').trigger('click');
      expect(wrapper.find('.options').exists()).toBe(true);
      expect(wrapper.find('.opened').exists()).toBe(true);

      await wrapper.get('.selection').trigger('click');
      expect(wrapper.find('.options').exists()).toBe(false);
    });

    it('closes when clicking outside of it', async () => {
      wrapper = mountMenu();
      await wrapper.get('.selection').trigger('click');

      document.body.click();
      await wrapper.vm.$nextTick();

      expect(wrapper.find('.options').exists()).toBe(false);
    });

    it('stays open when clicking an item unless closeOnClick is set', async () => {
      wrapper = mountMenu();
      await wrapper.get('.selection').trigger('click');

      await wrapper.get('.item').trigger('click');

      expect(wrapper.find('.options').exists()).toBe(true);
    });

    it('closes when clicking an item with closeOnClick', async () => {
      wrapper = mountMenu(true);
      await wrapper.get('.selection').trigger('click');

      await wrapper.get('.item').trigger('click');

      expect(wrapper.find('.options').exists()).toBe(false);
    });
  });
});
