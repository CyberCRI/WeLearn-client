import { beforeEach, describe, expect, it } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import LimitedAccessModal from '../LimitedAccessModal.vue';
import { useAccountAccessStore } from '@/stores/accountAccess';

describe('LimitedAccessModal', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
  });

  it('is hidden until a limited account comes in', async () => {
    const wrapper = mount(LimitedAccessModal);
    expect(wrapper.find('[data-testid="limited-access"]').exists()).toBe(false);

    const store = useAccountAccessStore();
    store.access = { limited: true, access_until: '2027-05-20', days_left: 184 };
    store.isNoticeOpen = true;
    await flushPromises();

    expect(wrapper.text()).toContain('authentication.limitedAccess.title');
    expect(wrapper.text()).toContain('authentication.limitedAccess.message');
  });

  it('has a message without the date when it is not known', async () => {
    const store = useAccountAccessStore();
    store.access = { limited: true };
    store.isNoticeOpen = true;

    const wrapper = mount(LimitedAccessModal);

    expect(wrapper.text()).toContain('authentication.limitedAccess.messageWithoutDate');
  });

  it('closes on "I understand"', async () => {
    const store = useAccountAccessStore();
    store.access = { limited: true, access_until: '2027-05-20', days_left: 184 };
    store.isNoticeOpen = true;
    const wrapper = mount(LimitedAccessModal);

    await wrapper.get('[data-testid="limited-access-ok"]').trigger('click');

    expect(store.isNoticeOpen).toBe(false);
    expect(wrapper.find('[data-testid="limited-access"]').exists()).toBe(false);
  });
});
