import { afterEach, describe, expect, it, vi } from 'vitest';
import { mount, type VueWrapper } from '@vue/test-utils';
import type { Component } from 'vue';
import ConceptExplorer from '../ConceptExplorer.vue';
import DimensionsDiagram from '../DimensionsDiagram.vue';
import SortActivity from '../SortActivity.vue';
import TimelineStep from '../TimelineStep.vue';
import SdgMap from '../SdgMap.vue';
import GreenCompMap from '../GreenCompMap.vue';
import WorkedExample from '../WorkedExample.vue';
import MythCheck from '../MythCheck.vue';
import { getModuleContent } from '@/learn/modules';
import type { ModuleId, SortStep } from '@/types/learn/modules';
import { track } from '@/utils/analytics';

vi.mock('@/utils/analytics', () => ({ track: vi.fn() }));

const STEP_COMPONENTS: Record<string, Component> = {
  concepts: ConceptExplorer,
  dimensions: DimensionsDiagram,
  sort: SortActivity,
  timeline: TimelineStep,
  sdgs: SdgMap,
  greencomp: GreenCompMap,
  example: WorkedExample,
  myth: MythCheck
};

const STEPS = (['foundations', 'frameworks'] as ModuleId[]).flatMap((moduleId) =>
  getModuleContent(moduleId, 'en').steps.map((step) => ({ moduleId, step }))
);

// clicks every button once, re-reading the list as the step re-renders
async function clickEverything(wrapper: VueWrapper) {
  for (let i = 0; i < 60; i++) {
    const buttons = wrapper.findAll('button');
    if (i >= buttons.length) break;
    await buttons[i].trigger('click');
  }
}

describe('Learn step components', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it.each(STEPS.map((s) => [`${s.moduleId}/${s.step.id}`, s] as const))(
    '%s renders and can be explored',
    async (_, { moduleId, step }) => {
      const wrapper = mount(STEP_COMPONENTS[step.type], {
        props: { step, moduleId }
      });

      expect(wrapper.text()).not.toBe('');
      await clickEverything(wrapper);
      wrapper.unmount();
    }
  );

  it('sorting: wrong bin gives a hint, right bins finish the activity', async () => {
    const step = getModuleContent('foundations', 'en').steps.find(
      (s): s is SortStep => s.type === 'sort'
    )!;
    const wrapper = mount(SortActivity, { props: { step, moduleId: 'foundations' } });
    const binButton = (id: string) => wrapper.find(`[data-bin="${id}"]`);

    const first = step.cards[0];
    const wrongBin = step.bins.find((b) => b.id !== first.bin)!;
    await wrapper.find('.pool button').trigger('click');
    await binButton(wrongBin.id).trigger('click');
    expect(wrapper.text()).toContain('learn.module.notQuite');

    for (const card of step.cards) {
      const button = wrapper.findAll('.pool button').find((b) => b.text() === card.text)!;
      await button.trigger('click');
      await binButton(card.bin).trigger('click');
    }

    expect(wrapper.emitted('done')).toHaveLength(1);
    expect(track).toHaveBeenCalledWith('Learn Sort Completed', {
      module: 'foundations',
      stepId: step.id,
      firstTryCount: step.cards.length - 1,
      total: step.cards.length
    });
  });
});
