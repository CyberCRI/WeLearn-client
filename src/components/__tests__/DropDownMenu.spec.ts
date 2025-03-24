import { mount } from '@vue/test-utils';
import DropDownMenu from '../DropDownMenu.vue';
import { describe, it, expect } from 'vitest';

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
});
