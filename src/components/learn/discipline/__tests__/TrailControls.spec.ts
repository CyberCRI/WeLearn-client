import { afterEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import WelcomeScreen from '../WelcomeScreen.vue';
import TrailHeader from '../TrailHeader.vue';
import TrailScreen from '../TrailScreen.vue';
import { DATA } from '@/learn/modules/discipline';

const disciplines = [
  { id: 'math', name: 'Maths' },
  { id: 'physics', name: 'Physics' }
];

describe('WelcomeScreen', () => {
  it('starts only once a discipline is chosen, with that discipline', async () => {
    const wrapper = mount(WelcomeScreen, { props: { disciplines } });
    const start = wrapper.get('.btn-primary');

    expect(start.attributes('disabled')).toBeDefined();

    const cards = wrapper.findAll('.discipline-card');
    await cards[1].trigger('click');

    expect(cards[1].classes()).toContain('selected');
    expect(start.attributes('disabled')).toBeUndefined();

    await start.trigger('click');
    expect(wrapper.emitted('select')).toEqual([['physics']]);
  });
});

describe('TrailHeader', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  const mountHeader = () =>
    mount(TrailHeader, {
      props: { discipline: disciplines[0], currentStep: 1, totalSteps: 4 }
    });

  it('restarts only when the user confirms', async () => {
    const confirm = vi.spyOn(window, 'confirm').mockReturnValueOnce(false);
    const wrapper = mountHeader();

    await wrapper.get('.back-button').trigger('click');
    expect(wrapper.emitted('restart')).toBeUndefined();

    confirm.mockReturnValueOnce(true);
    await wrapper.get('.back-button').trigger('click');
    expect(wrapper.emitted('restart')).toHaveLength(1);
    expect(confirm).toHaveBeenCalledTimes(2);
  });
});

describe('TrailScreen', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  const discipline = DATA.fr.math;

  // the step after the flip cards needs no action before moving on
  const mountScreen = (step: number) =>
    mount(TrailScreen, {
      props: {
        disciplineMeta: disciplines[0],
        discipline,
        step,
        flipDone: false,
        flippedCards: [],
        chosenActivity: null,
        reflectionAnswers: [],
        progress: 0
      },
      global: { stubs: { TrailNavigation: false } }
    });

  it('passes previous and restart up from the navigation and the header', async () => {
    const wrapper = mountScreen(1);

    wrapper.findComponent(TrailHeader).vm.$emit('restart');
    wrapper.findComponent({ name: 'TrailNavigation' }).vm.$emit('back');
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted('restart')).toHaveLength(1);
    expect(wrapper.emitted('previous')).toHaveLength(1);
  });

  it('does not move on from the flip cards until every card is flipped', async () => {
    const wrapper = mountScreen(0);

    wrapper.findComponent({ name: 'TrailNavigation' }).vm.$emit('next');
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('next')).toBeUndefined();

    await wrapper.setProps({ flipDone: true });
    wrapper.findComponent({ name: 'TrailNavigation' }).vm.$emit('next');
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('next')).toHaveLength(1);
  });
});
