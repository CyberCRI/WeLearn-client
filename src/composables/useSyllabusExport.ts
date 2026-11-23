import { computed, ref } from 'vue';
import i18n from '@/localisation/i18n';
import { useConnectionsStore } from '@/stores/connections';
import { useCourseStore } from '@/stores/course';
import { planComplete, validatePlan, type CompleteLabels } from '@/utils/completeSyllabus';
import { changesWithNotes, type AppendixLabels } from '@/utils/pedagogicalAppendix';
import { exportSyllabus, type SyllabusExport } from '@/utils/syllabusDownload';
import { track } from '@/utils/analytics';
import { changesText, updatedCourseMarkdown, type ExportLabels } from '@/utils/updatedSyllabus';
import type { AdaptationKind } from '@/types';

const KINDS: AdaptationKind[] = ['objective', 'topic', 'teaching', 'assessment'];

// a text in the syllabus's language (chosen on upload), whatever the interface's
export const useSyllabusText = () => {
  const course = useCourseStore();
  return (key: string, named: Record<string, unknown> = {}) =>
    i18n.global.t(key, named, { locale: course.language });
};

// the updated syllabus and its exports: the course as confirmed, the accepted changes, and the
// word documents made from them, in the syllabus's language whatever the interface's. the
// complete version (the syllabus's whole text, the changes in place) is offered only when that
// text is whole and the plan keeps every line and every change; the outline stands in otherwise
export const useSyllabusExport = () => {
  const course = useCourseStore();
  const store = useConnectionsStore();

  const courseToUpdate = computed(() => course.courseToUpdate);
  const changes = computed(() => store.acceptedChanges);

  const syllabusT = useSyllabusText();

  const kinds = computed(
    () =>
      Object.fromEntries(
        KINDS.map((kind) => [kind, syllabusT(`tutor.additions.change.kinds.${kind}`)])
      ) as Record<AdaptationKind, string>
  );

  const labels = computed<ExportLabels>(() => {
    const at = (key: string) => syllabusT(`tutor.updated.export.${key}`);
    return {
      documentTitle: at('documentTitle'),
      note: at('note'),
      overview: at('overview'),
      objectives: at('objectives'),
      competencies: at('competencies'),
      topics: at('topics'),
      outline: at('outline'),
      toPlace: at('toPlace'),
      revised: at('revised'),
      replaces: at('replaces'),
      why: at('why'),
      sources: at('sources'),
      placement: at('placement'),
      changesTitle: at('changesTitle'),
      placementUnknown: at('placementUnknown'),
      context: at('context'),
      kinds: kinds.value
    };
  });

  const completeLabels = computed<CompleteLabels>(() => ({
    title: syllabusT('tutor.updated.complete.title', {
      title: courseToUpdate.value.title || labels.value.documentTitle
    }),
    note: syllabusT('tutor.updated.complete.note'),
    change: syllabusT('tutor.updated.complete.change'),
    sources: labels.value.sources,
    toPlace: labels.value.toPlace,
    toPlaceNote: syllabusT('tutor.updated.complete.toPlaceNote'),
    context: labels.value.context,
    kinds: kinds.value
  }));

  const completePlan = computed(() =>
    course.wholeText ? planComplete(course.wholeText, courseToUpdate.value, changes.value) : null
  );
  const isCompleteReady = computed(
    () =>
      !!course.wholeText &&
      !!completePlan.value &&
      validatePlan(course.wholeText, changes.value, completePlan.value)
  );

  // the optional pedagogical appendix: offered only when an accepted change carries notes
  const hasNotes = computed(() => changesWithNotes(changes.value).length > 0);
  const appendixLabels = computed<AppendixLabels>(() => ({
    title: syllabusT('tutor.updated.appendix.title'),
    note: syllabusT('tutor.updated.appendix.note'),
    learning: syllabusT('tutor.additions.change.notes.learning'),
    greencomp: syllabusT('tutor.additions.change.notes.greencomp'),
    teaching: syllabusT('tutor.additions.change.notes.teaching'),
    check: syllabusT('tutor.additions.change.notes.check'),
    // only the competences cited, so the labels stay plain data
    greencompNames: Object.fromEntries(
      changes.value.flatMap(({ guidance }) =>
        guidance.greencomp
          ? [[guidance.greencomp.id, syllabusT(`tutor.greencomp.${guidance.greencomp.id}`)]]
          : []
      )
    ),
    kinds: kinds.value
  }));

  const fileName = (suffixKey: string) =>
    `${(courseToUpdate.value.title || labels.value.documentTitle)
      .replace(/[^\p{L}\p{N}]+/gu, '-')
      .replace(/^-|-$/g, '')}-${syllabusT(suffixKey)}.docx`;

  // the word document asked for: the complete syllabus when it is ready, the outline otherwise
  const exportOf = (choice: 'complete' | 'outline', withAppendix: boolean): SyllabusExport => {
    const appendix =
      withAppendix && hasNotes.value
        ? { changes: changes.value, labels: appendixLabels.value }
        : null;
    if (choice === 'complete' && isCompleteReady.value && completePlan.value) {
      return {
        kind: 'complete',
        fileName: fileName('tutor.updated.complete.fileSuffix'),
        plan: completePlan.value,
        labels: completeLabels.value,
        appendix
      };
    }
    return {
      kind: 'markdown',
      fileName: fileName('tutor.updated.export.fileSuffix'),
      markdown: updatedCourseMarkdown(courseToUpdate.value, changes.value, labels.value),
      appendix
    };
  };

  const isExporting = ref(false);
  const hasExportError = ref(false);
  // the same download as from scratch: a guest is asked to sign up first
  const exportWord = async (choice: 'complete' | 'outline', withAppendix: boolean) => {
    isExporting.value = true;
    hasExportError.value = false;
    try {
      const syllabus = exportOf(choice, withAppendix);
      track('Updated Syllabus Exported', {
        changesCount: changes.value.length,
        hasAppendix: syllabus.appendix !== null,
        document: syllabus.kind === 'complete' ? 'complete' : 'outline'
      });
      hasExportError.value = !(await exportSyllabus(syllabus));
    } catch (error) {
      console.error('Error while preparing the word document:', error);
      hasExportError.value = true;
    } finally {
      isExporting.value = false;
    }
  };

  const isCopied = ref(false);
  const hasCopyError = ref(false);
  let copiedTimer: ReturnType<typeof setTimeout> | undefined;
  const copyChanges = async () => {
    hasCopyError.value = false;
    try {
      await navigator.clipboard.writeText(
        changesText(courseToUpdate.value, changes.value, labels.value)
      );
      isCopied.value = true;
      // a second copy shows "copied" for its own 2 seconds
      clearTimeout(copiedTimer);
      copiedTimer = setTimeout(() => (isCopied.value = false), 2000);
    } catch {
      hasCopyError.value = true;
    }
  };

  return {
    changes,
    syllabusT,
    kinds,
    completeLabels,
    completePlan,
    isCompleteReady,
    hasNotes,
    isExporting,
    hasExportError,
    exportWord,
    isCopied,
    hasCopyError,
    copyChanges
  };
};
