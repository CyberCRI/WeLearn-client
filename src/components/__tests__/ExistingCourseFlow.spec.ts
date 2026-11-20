import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import ExistingCourseFlow from '@/components/tutor/ExistingCourseFlow.vue';
import CourseUpload from '@/components/tutor/CourseUpload.vue';
import ReadingProgress from '@/components/tutor/ReadingProgress.vue';
import CourseReview from '@/components/tutor/review/CourseReview.vue';
import SustainabilityAdditions from '@/components/tutor/SustainabilityAdditions.vue';
import TutorStepsBar from '@/components/tutor/TutorStepsBar.vue';
import UpdatedSyllabus from '@/components/tutor/updated/UpdatedSyllabus.vue';
import { useCourseStore } from '@/stores/course';
import type { CourseReadResponse } from '@/types';

// the connections are asked for on screen 3; they never answer here
vi.mock('@/utils/fetch', () => ({
  basePostAxios: vi.fn(() => new Promise(() => {})),
  getGuestQuota: vi.fn()
}));

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
    expect(wrapper.findComponent(CourseReview).exists()).toBe(true);

    await wrapper.find('[data-testid="course-recap"] button').trigger('click');
    expect(course.step).toBe(1);
    expect(wrapper.findComponent(CourseUpload).exists()).toBe(true);
  });

  it('folds the confirmed course into a recap, reopened from it or from the step bar', async () => {
    const course = useCourseStore();
    course.setFile(pdf);
    course.reading = READ;
    course.teachingContext = { ...course.teachingContext, title: 'Ecology' };
    course.courseTopics = [{ value: 'Soils', origin: 'extracted' }];
    course.setStep(3);
    const wrapper = mount(ExistingCourseFlow);

    const recap = wrapper.find('[data-testid="review-recap"]');
    expect(recap.text()).toContain('Ecology');
    expect(recap.text()).toContain('tutor.check.recapTopics');
    expect(wrapper.findComponent(CourseReview).exists()).toBe(false);
    expect(wrapper.find('#target-3').findComponent(SustainabilityAdditions).exists()).toBe(true);

    await recap.find('button').trigger('click');
    expect(course.step).toBe(2);
    expect(wrapper.findComponent(CourseReview).exists()).toBe(true);

    course.setStep(3);
    wrapper.findComponent(TutorStepsBar).vm.$emit('select', 2);
    expect(course.step).toBe(2);
  });

  it('shows the progress in the review while one course of several is read again', () => {
    const course = useCourseStore();
    course.setFile(pdf);
    course.reading = READ;
    course.setStep(2);
    course.phase = 'sending';
    const wrapper = mount(ExistingCourseFlow);

    expect(wrapper.find('#target-2').findComponent(ReadingProgress).exists()).toBe(true);
    expect(wrapper.findComponent(CourseReview).exists()).toBe(false);
  });

  it('shows the updated syllabus on screen 4, the connections folded above it', async () => {
    const course = useCourseStore();
    course.setFile(pdf);
    course.reading = READ;
    course.setStep(4);
    const wrapper = mount(ExistingCourseFlow);

    expect(wrapper.find('#target-4').findComponent(UpdatedSyllabus).exists()).toBe(true);
    expect(wrapper.findComponent(SustainabilityAdditions).exists()).toBe(false);
    const recap = wrapper.find('[data-testid="additions-recap"]');
    expect(recap.text()).toContain('tutor.additions.selectedCount');

    await recap.find('button').trigger('click');
    expect(course.step).toBe(3);
    expect(wrapper.findComponent(SustainabilityAdditions).exists()).toBe(true);
  });
});
