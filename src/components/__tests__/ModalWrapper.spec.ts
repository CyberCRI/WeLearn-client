import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import ModalWrapper from '../ModalWrapper.vue';

describe('ModalWrapper', () => {
  it('closes from the close button, the backdrop and Escape', async () => {
    const onClose = vi.fn();
    const wrapper = mount(ModalWrapper, { props: { isOpen: true, onClose } });

    await wrapper.get('[data-testid="close"]').trigger('click');
    await wrapper.get('.modal-background').trigger('click');
    await wrapper.get('.modal-panel').trigger('keydown', { key: 'Escape' });

    expect(onClose).toHaveBeenCalledTimes(3);
  });

  it('has no close button and ignores Escape without onClose', async () => {
    const wrapper = mount(ModalWrapper, { props: { isOpen: true, size: 'small' } });

    expect(wrapper.find('[data-testid="close"]').exists()).toBe(false);
    await wrapper.get('.modal-panel').trigger('keydown', { key: 'Escape' });
    expect(wrapper.classes()).toContain('is-active');
    expect(wrapper.classes()).toContain('size-small');
  });

  it('ignores backdrop and Escape when not dismissable, but the close button still works', async () => {
    const onClose = vi.fn();
    const wrapper = mount(ModalWrapper, { props: { isOpen: true, onClose, isDismissable: false } });

    await wrapper.get('.modal-background').trigger('click');
    await wrapper.get('.modal-panel').trigger('keydown', { key: 'Escape' });
    expect(onClose).not.toHaveBeenCalled();

    await wrapper.get('[data-testid="close"]').trigger('click');
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
