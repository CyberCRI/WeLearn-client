import { beforeEach, describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import BookmarkErrorNotice from '../BookmarkErrorNotice.vue';
import { useBookmarksStore } from '@/stores/bookmarks';

describe('BookmarkErrorNotice', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('shows nothing without a bookmark error', () => {
    const wrapper = mount(BookmarkErrorNotice);

    expect(wrapper.find('[data-testid="bookmarkError"]').exists()).toBe(false);
  });

  it('shows the bookmark error', async () => {
    const wrapper = mount(BookmarkErrorNotice);

    useBookmarksStore().hasBookmarkError = true;
    await wrapper.vm.$nextTick();

    const notice = wrapper.find('[data-testid="bookmarkError"]');
    expect(notice.attributes('role')).toBe('alert');
    expect(notice.text()).toContain('bookmarkError.title');
    expect(notice.text()).toContain('bookmarkError.description');
  });

  it('closes the error', async () => {
    const store = useBookmarksStore();
    store.hasBookmarkError = true;
    store.errorCode = 'UNKNOWN_ERROR';
    const wrapper = mount(BookmarkErrorNotice);

    await wrapper.find('[data-testid="closeBookmarkError"]').trigger('click');

    expect(store.hasBookmarkError).toBe(false);
    expect(store.errorCode).toBe('');
    expect(wrapper.find('[data-testid="bookmarkError"]').exists()).toBe(false);
  });
});
