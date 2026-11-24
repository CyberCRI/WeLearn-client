import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import AiNotice from '../AiNotice.vue';

describe('AiNotice', () => {
  it.each(['chat', 'syllabus'] as const)('says the %s is written by an AI', (feature) => {
    const wrapper = mount(AiNotice, { props: { feature } });
    expect(wrapper.find('[data-testid="ai-generated-notice"]').text()).toBe(`aiNotice.${feature}`);
  });
});
