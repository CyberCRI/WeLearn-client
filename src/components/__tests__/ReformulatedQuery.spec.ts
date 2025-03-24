import { describe, expect, it } from 'vitest';
import ReformulatedQueryVue from '../ReformulatedQuery.vue';
import { mount } from '@vue/test-utils';

describe('ReformulatedQuery', () => {
  it('should render the reformulated query', () => {
    const wrapper = mount(ReformulatedQueryVue, {
      props: {
        query: 'I am the reformulated query'
      }
    });

    expect(wrapper.text()).toContain('I am the reformulated query');
  });
});
