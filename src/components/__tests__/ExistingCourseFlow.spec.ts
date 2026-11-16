import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import ExistingCourseFlow from '@/components/tutor/ExistingCourseFlow.vue';
import CourseUpload from '@/components/tutor/CourseUpload.vue';
import ReadingProgress from '@/components/tutor/ReadingProgress.vue';
import { useCourseStore } from '@/stores/course';
import type { CourseReadResponse } from '@/types';

vi.mock('@/utils/fetch', () => ({ basePostAxios: vi.fn(), getGuestQuota: vi.fn() }));

const READ = {
  text: 'Ecology',
  is_text_truncated: false,
  is_partial: false,
  reading: { title: 'Ecology', courses_found: [], objectives: [], topics: [], sessions: [] }
} as unknown as CourseReadResponse;
const pdf = new File(['x'], 'syllabus.pdf', { type: 'application/pdf' });

describe('ExistingCourseFlow', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('starts on the upload of the course', () => {
    const wrapper = mount(ExistingCourseFlow);
    expect(wrapper.findComponent(CourseUpload).exists()).toBe(true);
    expect(wrapper.find('#target-2').exists()).toBe(false);
  });

  it('shows the progress while WeLearn reads, and cancels it', async () => {
    const course = useCourseStore();
    course.setFile(pdf);
    course.phase = 'reading';
    const cancel = vi.spyOn(course, 'cancelReading');
    const wrapper = mount(ExistingCourseFlow);

    const progress = wrapper.findComponent(ReadingProgress);
    expect(progress.props('fileName')).toBe('syllabus.pdf');
    expect(progress.props('phase')).toBe('reading');
    expect(wrapper.findComponent(CourseUpload).exists()).toBe(false);
    progress.vm.$emit('cancel');
    expect(cancel).toHaveBeenCalled();
  });

  it('folds the upload once the course is read, and can go back to it', async () => {
    const course = useCourseStore();
    course.setFile(pdf);
    course.reading = READ;
    course.setStep(2);
    const wrapper = mount(ExistingCourseFlow);

    expect(wrapper.find('[data-testid="course-recap"]').text()).toContain('syllabus.pdf');
    expect(wrapper.find('[data-testid="read-title"]').text()).toBe('Ecology');

    await wrapper.find('[data-testid="course-recap"] button').trigger('click');
    expect(course.step).toBe(1);
    expect(wrapper.findComponent(CourseUpload).exists()).toBe(true);
  });
});
