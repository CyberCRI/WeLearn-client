import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import AuthPageLayout from '../AuthPageLayout.vue';

const RouterLinkStub = { props: ['to'], template: '<a :href="to"><slot /></a>' };

describe('AuthPageLayout', () => {
  const mountLayout = () =>
    mount(AuthPageLayout, {
      props: { title: 'Create account' },
      slots: { default: '<form id="content" />' },
      global: { stubs: { RouterLink: RouterLinkStub } }
    });

  it('shows the logo as a link back to the chat', () => {
    const link = mountLayout().get('[data-testid="auth-logo-link"]');

    expect(link.attributes('href')).toBe('/');
    expect(link.get('img').attributes('alt')).toBe('authentication.logoAlt');
  });

  it('shows the title as the page heading and the content in the box', () => {
    const wrapper = mountLayout();

    expect(wrapper.get('h1').text()).toBe('Create account');
    expect(wrapper.find('.box #content').exists()).toBe(true);
  });
});
