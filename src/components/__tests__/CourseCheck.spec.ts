import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import CourseCheck from '@/components/tutor/CourseCheck.vue';
import TeachingContext from '@/components/tutor/TeachingContext.vue';
import { useTutorStore } from '@/stores/tutor';
import { fromSyllabus } from '@/utils/courseCheck';

const mountCheck = () => mount(CourseCheck, { props: { action: vi.fn() } });

const readCourse = () => {
  const store = useTutorStore();
  store.detectedType = 'syllabus';
  store.documentText = 'the syllabus text';
  store.courseDescription = fromSyllabus('This course presents macroeconomics.', 'verified');
  store.courseObjectives = [
    fromSyllabus('Define GDP.', 'verified', 'objective'),
    fromSyllabus('Explain inflation.', 'unverified', 'objective'),
    fromSyllabus('Work in a team.', 'verified', 'competency')
  ];
  return store;
};

const group = (wrapper: ReturnType<typeof mountCheck>, name: string) =>
  wrapper.find(`[data-testid="group-${name}"]`);

// the objectives' editors open on request
const editObjectives = async (wrapper: ReturnType<typeof mountCheck>) => {
  await wrapper.find('[data-testid="edit-objectives"]').trigger('click');
};

describe('CourseCheck (screen "Check your course")', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('shows the objectives as a plain list, competencies apart, the unverified marked', () => {
    readCourse();
    const wrapper = mountCheck();
    expect(wrapper.find('[data-testid="description"]').text()).toContain(
      'This course presents macroeconomics.'
    );
    const items = (name: string) =>
      wrapper
        .findAll(`[data-testid="list-${name}"] [data-testid="objective-item"]`)
        .map((item) => item.text().replace(/\s+/g, ' '));
    expect(items('objective')).toEqual([
      'Define GDP.',
      'Explain inflation. (tutor.check.pleaseCheck)'
    ]);
    // competencies folded apart
    expect(items('competency')).toEqual(['Work in a team.']);
    expect(wrapper.find('[data-testid="list-competency"]').element.tagName).toBe('DETAILS');
    // no editing controls, no permanent verification note until needed
    expect(wrapper.find('[data-testid="objective"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="ai-label"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="not-syllabus"]').exists()).toBe(false);
  });

  it('keeps degree-level objectives aside, out of the review, and can bring one back', async () => {
    const store = readCourse();
    store.courseObjectives.push(fromSyllabus('Think like an economist.', 'verified', 'programme'));
    const wrapper = mountCheck();
    expect(wrapper.text()).not.toContain('Think like an economist.');
    await editObjectives(wrapper);
    expect(group(wrapper, 'objective').findAll('[data-testid="objective"]')).toHaveLength(2);
    expect(group(wrapper, 'competency').findAll('[data-testid="objective"]')).toHaveLength(1);
    expect(group(wrapper, 'programme').text()).toContain('Think like an economist.');
    await wrapper.find('[data-testid="move-to-course"]').trigger('click');
    expect(store.courseObjectives[3].group).toBe('objective');
    await wrapper.find('[data-testid="done-objectives"]').trigger('click');
    expect(wrapper.findAll('[data-testid="list-objective"] li')).toHaveLength(3);
  });

  it('says plainly when the file could not be compared', () => {
    readCourse().documentText = null;
    expect(mountCheck().find('[data-testid="ai-label"]').text()).toBe('tutor.check.uncheckedNote');
  });

  it("shows the AI's short overview, labelled, when the syllabus has no clear description", async () => {
    const store = readCourse();
    store.courseDescription = null;
    store.courseSummary = { ...fromSyllabus('A course on GDP.', 'unchecked'), isSummary: true };
    const wrapper = mountCheck();
    expect(wrapper.find('[data-testid="summary"]').text()).toContain('A course on GDP.');
    // no origin label in the normal view: the page says it shows what WeLearn understood
    expect(wrapper.find('[data-testid="summary-note"]').exists()).toBe(false);
    expect(store.courseSummary?.isSummary).toBe(true);
    await wrapper.find('[data-testid="summary"] [data-testid="edit-field"]').trigger('click');
    await wrapper.find('[data-testid="field-editor"]').setValue('A course on growth.');
    await wrapper.find('[data-testid="save-field"]').trigger('click');
    expect(store.courseSummary).toMatchObject({ value: 'A course on growth.', origin: 'edited' });
    expect(wrapper.find('[data-testid="summary-note"]').exists()).toBe(false);
    await wrapper.find('[data-testid="restore-field"]').trigger('click');
    expect(store.courseSummary?.value).toBe('A course on GDP.');
  });

  it('shows the topics the AI named, their subtopics one click away, saying once they are its own', async () => {
    const store = readCourse();
    store.courseTopics = [
      { ...fromSyllabus('Le PIB', 'verified'), isSummary: true, subtopics: ['Mesure'] },
      { ...fromSyllabus('Croissance', 'unverified'), isSummary: true }
    ];
    const wrapper = mountCheck();
    const topics = wrapper
      .findAll('[data-testid="topic"]')
      .map((t) => t.text().replace(/\s+/g, ' '));
    // titles first; the subtopics, all of them, on request
    expect(topics[0]).toBe('Le PIB');
    await wrapper.find('[data-testid="toggle-subtopics"]').trigger('click');
    expect(wrapper.find('[data-testid="subtopics"]').text()).toBe('Mesure');
    expect(wrapper.find('[data-testid="toggle-subtopics"]').text()).toBe(
      'tutor.check.hideSubtopics'
    );
    // a topic WeLearn could not ground stays marked to check; no other origin label
    expect(topics[1]).toContain('Croissance');
    expect(wrapper.find('[data-testid="topic-note"]').text()).toBe('tutor.check.tag.check ⓘ');
    expect(wrapper.find('[data-testid="topic-note"]').attributes('title')).toBe(
      'tutor.check.pleaseCheck'
    );
    expect(wrapper.find('[data-testid="topics-note"]').exists()).toBe(false);
  });

  it('says when a long syllabus was read only in part', () => {
    const store = readCourse();
    expect(mountCheck().find('[data-testid="reading-partial"]').exists()).toBe(false);
    store.isReadingPartial = true;
    expect(mountCheck().find('[data-testid="reading-partial"]').text()).toBe(
      'tutor.check.readingPartial'
    );
  });

  it('accepts a course plan, and names what else the file looks like', () => {
    const store = readCourse();
    store.detectedType = 'course_plan';
    expect(mountCheck().find('[data-testid="not-syllabus"]').exists()).toBe(false);
    store.detectedType = 'lesson';
    expect(mountCheck().find('[data-testid="not-syllabus"]').text()).toBe(
      'tutor.check.notSyllabus'
    );
  });

  it('warns when the file does not look like a syllabus', () => {
    readCourse().detectedType = 'article';
    expect(mountCheck().find('[data-testid="not-syllabus"]').exists()).toBe(true);
  });

  it('never shows a description that holds more than a description; it stays in the store', () => {
    const store = readCourse();
    const long = 'Pour rappels : PRL. Intitulé du cours : Macro. Plan de cours : Chapitre 1.';
    store.courseDescription = fromSyllabus(long, 'unverified');
    const wrapper = mountCheck();
    expect(wrapper.text()).not.toContain(long);
    expect(wrapper.find('[data-testid="add-overview-description"]').exists()).toBe(true);
    expect(store.courseDescription?.value).toBe(long);
    // with a summary, the summary is the overview
    store.courseSummary = { ...fromSyllabus('A course on GDP.', 'unchecked'), isSummary: true };
    expect(mountCheck().find('[data-testid="summary"]').text()).toContain('A course on GDP.');
  });

  it('corrects topics and subtopics in place, adds and removes, saves or cancels at once', async () => {
    const store = readCourse();
    store.courseTopics = [
      { ...fromSyllabus('Inflation', 'verified'), subtopics: ['Mesure', 'Causes'] },
      fromSyllabus('Dette', 'verified')
    ];
    const wrapper = mountCheck();
    expect(wrapper.find('[data-testid="topic-title"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="remove-topic"]').exists()).toBe(false);

    // cancel brings everything back
    await wrapper.find('[data-testid="edit-topics"]').trigger('click');
    await wrapper.find('[data-testid="topic-title"]').setValue('Changed');
    await wrapper.find('[data-testid="cancel-topics"]').trigger('click');
    expect(store.courseTopics.map((topic) => topic.value)).toEqual(['Inflation', 'Dette']);

    await wrapper.find('[data-testid="edit-topics"]').trigger('click');
    const titles = wrapper.findAll('[data-testid="topic-title"]');
    expect((titles[0].element as HTMLInputElement).value).toBe('Inflation');
    expect(
      (wrapper.find('[data-testid="topic-subtopics"]').element as HTMLInputElement).value
    ).toBe('Mesure, Causes');
    await titles[0].setValue("L'inflation");
    await wrapper.find('[data-testid="topic-subtopics"]').setValue('Mesure, Effets ,');
    await wrapper.findAll('[data-testid="remove-topic"]')[1].trigger('click');
    await wrapper.find('[data-testid="add-topic"]').trigger('click');
    await wrapper.findAll('[data-testid="topic-title"]')[1].setValue('Croissance');
    await wrapper.find('[data-testid="save-topics"]').trigger('submit');
    expect(store.courseTopics).toEqual([
      expect.objectContaining({
        value: "L'inflation",
        original: 'Inflation',
        origin: 'edited',
        subtopics: ['Mesure', 'Effets']
      }),
      { value: 'Croissance', origin: 'added', subtopics: [] }
    ]);
    expect(wrapper.find('[data-testid="topic-title"]').exists()).toBe(false);
  });

  it('says in one line what WeLearn did not identify, each added on request', async () => {
    const store = readCourse();
    const wrapper = mountCheck();
    const missing = wrapper.find('[data-testid="overview-missing"]');
    expect(missing.text()).toContain('tutor.check.notFoundOverview');
    // missing topics are said in their own row, with why they matter
    expect(wrapper.find('[data-testid="no-topics"]').text()).toBe('tutor.check.noTopicsFound');
    await missing.find('[data-testid="add-overview-title"]').trigger('click');
    await wrapper.find('#context-title').setValue('Macro');
    expect(store.teachingContext.title).toBe('Macro');
    await wrapper.find('[data-testid="add-topics"]').trigger('click');
    expect(wrapper.find('[data-testid="topic-title"]').exists()).toBe(true);
  });

  it('shows the course outline folded and correctable, unless it only repeats the topics', async () => {
    const store = readCourse();
    store.courseTopics = [fromSyllabus('GDP', 'verified'), fromSyllabus('Inflation', 'verified')];
    store.coursePlan = ['Week 1 – GDP', 'Week 2 – Inflation'];
    expect(mountCheck().find('[data-testid="course-plan"]').exists()).toBe(false);

    store.coursePlan = ['Week 1 – GDP', 'Week 2', 'Week 3 – Inflation'];
    const wrapper = mountCheck();
    const outline = wrapper.find('[data-testid="course-plan"]');
    expect(outline.element.tagName).toBe('DETAILS');
    expect(outline.findAll('li').map((li) => li.text())).toEqual(store.coursePlan);
    await outline.find('[data-testid="edit-outline"]').trigger('click');
    await wrapper
      .find('[data-testid="outline-editor"]')
      .setValue('Week 1 – GDP\n\nWeek 2 – Growth');
    await wrapper.find('[data-testid="save-outline"]').trigger('submit');
    expect(store.coursePlan).toEqual(['Week 1 – GDP', 'Week 2 – Growth']);
  });

  it('shows the first objectives of a long list, all of them on request', async () => {
    const store = readCourse();
    store.courseObjectives = Array.from({ length: 8 }, (_, i) =>
      fromSyllabus(`Objective ${i + 1}.`, 'verified', 'objective')
    );
    const wrapper = mountCheck();
    expect(wrapper.findAll('[data-testid="list-objective"] li')).toHaveLength(5);
    await wrapper.find('[data-testid="show-all-objectives"]').trigger('click');
    expect(wrapper.findAll('[data-testid="list-objective"] li')).toHaveLength(8);
  });

  it('shows a suggested discipline plainly, the suggestion kept in the store', () => {
    const store = readCourse();
    store.teachingContext = { ...store.teachingContext, discipline: 'Gestion' };
    store.aiSuggested = ['discipline'];
    const wrapper = mountCheck();
    expect(
      wrapper.find('[data-testid="overview-discipline"] [data-testid="overview-value"]').text()
    ).toBe('Gestion');
    expect(wrapper.find('[data-testid="ai-suggested"]').exists()).toBe(false);
    expect(store.aiSuggested).toEqual(['discipline']);
  });

  it('shows the discipline with a capital, keeping the stored wording, and a calm note', () => {
    const store = readCourse();
    store.teachingContext = { ...store.teachingContext, discipline: 'économie' };
    store.isReadingPartial = true;
    const wrapper = mountCheck();
    expect(
      wrapper.find('[data-testid="overview-discipline"] [data-testid="overview-value"]').text()
    ).toBe('Économie');
    expect(store.teachingContext.discipline).toBe('économie');
    expect(wrapper.find('[data-testid="reading-partial"]').classes()).toContain('note');
  });

  it('says what is missing', () => {
    const wrapper = mountCheck();
    expect(wrapper.find('[data-testid="add-overview-description"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="no-objectives"]').text()).toBe('tutor.check.noObjectives');
    expect(wrapper.find('[data-testid="edit-objectives"]').text()).toBe('tutor.check.addObjective');
  });

  it("applies the teacher's corrections", async () => {
    const store = readCourse();
    const wrapper = mountCheck();
    await editObjectives(wrapper);
    const first = wrapper.findAll('[data-testid="objective"]')[0];
    await first.find('[data-testid="edit-field"]').trigger('click');
    await first.find('[data-testid="field-editor"]').setValue('Define GDP and its limits.');
    await first.find('[data-testid="save-field"]').trigger('click');
    expect(store.courseObjectives[0]).toMatchObject({
      value: 'Define GDP and its limits.',
      origin: 'edited'
    });
    await wrapper.find('[data-testid="done-objectives"]').trigger('click');
    expect(wrapper.find('[data-testid="item-note"]').text()).toBe('(tutor.check.origin.edited)');
    await editObjectives(wrapper);
    await wrapper.find('[data-testid="restore-field"]').trigger('click');
    expect(store.courseObjectives[0].value).toBe('Define GDP.');

    const description = wrapper.find('[data-testid="description"]');
    await description.find('[data-testid="edit-field"]').trigger('click');
    await description.find('[data-testid="field-editor"]').setValue('About macroeconomics.');
    await description.find('[data-testid="save-field"]').trigger('click');
    await description.find('[data-testid="restore-field"]').trigger('click');
    expect(store.courseDescription?.value).toBe('This course presents macroeconomics.');
  });

  it('adds an objective or a competency in its group, and removes an added one', async () => {
    const store = readCourse();
    const wrapper = mountCheck();
    await editObjectives(wrapper);
    for (const name of ['objective', 'competency']) {
      const add = wrapper.find(`[data-testid="add-${name}"]`);
      await add.find('[data-testid="add-field"]').trigger('click');
      await add.find('[data-testid="field-editor"]').setValue(`New ${name}.`);
      await add.find('[data-testid="save-field"]').trigger('click');
    }
    expect(store.courseObjectives.slice(3).map((field) => field.group)).toEqual([
      'objective',
      'competency'
    ]);
    await group(wrapper, 'competency')
      .findAll('[data-testid="objective"]')[1]
      .find('[data-testid="remove-field"]')
      .trigger('click');
    expect(store.courseObjectives).toHaveLength(4);
  });

  it('asks the teacher to sort what WeLearn could not place, never counting it as the course’s', async () => {
    const store = readCourse();
    store.courseObjectives.push(
      fromSyllabus('Read critically.', 'verified', 'unsorted'),
      fromSyllabus('Work in groups.', 'verified', 'unsorted')
    );
    const wrapper = mountCheck();
    const unsorted = wrapper.find('[data-testid="group-unsorted"]');
    expect(unsorted.findAll('[data-testid="unsorted-item"]')).toHaveLength(2);
    expect(wrapper.findAll('[data-testid="list-objective"] li')).toHaveLength(2);
    expect(store.courseOnlyObjectives).toHaveLength(2);

    await unsorted.findAll('[data-testid="sort-to-course"]')[0].trigger('click');
    expect(store.courseObjectives[3].group).toBe('objective');
    await wrapper.find('[data-testid="sort-aside"]').trigger('click');
    expect(store.courseObjectives[4].group).toBe('programme');
    expect(wrapper.find('[data-testid="group-unsorted"]').exists()).toBe(false);
  });

  it('lets a course without explicit objectives continue, with its topics or overview', async () => {
    const store = useTutorStore();
    store.detectedType = 'syllabus';
    store.documentText = 'the syllabus text';
    store.courseTopics = [fromSyllabus('Incentives', 'verified')];
    const wrapper = mountCheck();
    expect(wrapper.find('[data-testid="no-objectives"]').text()).toBe('tutor.check.noObjectives');
    expect(wrapper.find('[data-testid="need-objective"]').exists()).toBe(false);
    await wrapper.find('[data-testid="confirm-course"]').trigger('click');
    expect(wrapper.props('action')).toHaveBeenCalled();

    // an overview alone is enough too
    store.courseTopics = [];
    store.courseSummary = {
      ...fromSyllabus('A course on incentives.', 'unchecked'),
      isSummary: true
    };
    expect(
      mountCheck().find('[data-testid="confirm-course"]').attributes('disabled')
    ).toBeUndefined();

    // nothing at all: the teacher is told what to add
    store.courseSummary = null;
    const empty = mountCheck();
    expect(empty.find('[data-testid="confirm-course"]').attributes('disabled')).toBeDefined();
    expect(empty.find('[data-testid="need-objective"]').text()).toBe('tutor.check.needObjective');
  });

  it('continues only with a course objective or competency', async () => {
    const store = useTutorStore();
    store.courseObjectives = [fromSyllabus('Graduates master economics.', 'verified', 'programme')];
    const wrapper = mountCheck();
    expect(wrapper.find('[data-testid="confirm-course"]').attributes('disabled')).toBeDefined();
    expect(wrapper.find('[data-testid="need-objective"]').exists()).toBe(true);
    await editObjectives(wrapper);
    await wrapper.find('[data-testid="move-to-course"]').trigger('click');
    await wrapper.find('[data-testid="confirm-course"]').trigger('click');
    expect(wrapper.props('action')).toHaveBeenCalled();
  });

  it('shows what the syllabus states in the course card, the teaching context folded below', async () => {
    const store = readCourse();
    store.teachingContext = { ...store.teachingContext, title: 'Macro', level: 'l1', sessions: 12 };
    store.prefilled = ['title', 'level', 'sessions'];
    store.aiFilled = ['title'];
    const wrapper = mountCheck();
    const value = (key: string) =>
      wrapper.find(`[data-testid="overview-${key}"] [data-testid="overview-value"]`).text();
    expect(value('title')).toBe('Macro');
    expect(value('level')).toBe('tutor.course.levels.l1');
    // read by the AI but not found word for word: a short note, its explanation on demand
    expect(wrapper.find('[data-testid="ai-filled"]').text()).toBe('tutor.check.tag.check ⓘ');
    expect(wrapper.find('[data-testid="ai-filled"]').attributes('title')).toBe(
      'tutor.course.readByAi'
    );
    expect(wrapper.find('[data-testid="add-overview-discipline"]').exists()).toBe(true);

    await wrapper
      .find('[data-testid="overview-title"] [data-testid="edit-overview"]')
      .trigger('click');
    expect((wrapper.find('#context-title').element as HTMLInputElement).value).toBe('Macro');
    await wrapper.find('[data-testid="done-overview"]').trigger('click');
    expect(wrapper.find('#context-title').exists()).toBe(false);

    // the teaching context is not asked here; what was read stays in the store
    expect(wrapper.findAllComponents(TeachingContext)).toHaveLength(0);
    expect(wrapper.find('#context-sessions').exists()).toBe(false);
    expect(store.teachingContext.sessions).toBe(12);
  });

  it('edits with small pencil buttons that say what they edit, and still corrects everything', async () => {
    const store = readCourse();
    store.courseTopics = [{ ...fromSyllabus('Le PIB', 'verified'), isSummary: true }];
    const wrapper = mountCheck();
    const pencils = ['edit-topics', 'edit-objectives'].map((id) =>
      wrapper.find(`[data-testid="${id}"]`)
    );
    pencils.forEach((pencil) => {
      expect(pencil.element.tagName).toBe('BUTTON');
      expect(pencil.attributes('aria-label')).toBe('tutor.check.editField');
      expect(pencil.find('svg').exists()).toBe(true);
    });
    // no repeated "Edit" text links in the default view
    expect(wrapper.text()).not.toContain('tutor.check.edit ');
    await pencils[0].trigger('click');
    expect(wrapper.find('[data-testid="topic-draft"]').exists()).toBe(true);
  });
});
