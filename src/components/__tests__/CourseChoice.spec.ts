import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import CourseChoice from '@/components/tutor/review/CourseChoice.vue';

describe('CourseChoice', () => {
  it('lists the courses of the document and tells the one picked', async () => {
    const wrapper = mount(CourseChoice, { props: { courses: ['UE 1 Economics', 'UE 2 Law'] } });
    expect(wrapper.text()).toContain('tutor.check.severalCourses');
    const buttons = wrapper.findAll('[data-testid="choose-course"]');
    expect(buttons.map((button) => button.text())).toEqual(['UE 1 Economics', 'UE 2 Law']);
    await buttons[1].trigger('click');
    expect(wrapper.emitted('choose')).toEqual([['UE 2 Law']]);
  });
});
