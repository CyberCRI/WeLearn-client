import { computed, ref } from 'vue';
import i18n from '@/localisation/i18n';
import { useAuthStore } from '@/stores/auth';
import { useConnectionsStore } from '@/stores/connections';
import { useCourseStore } from '@/stores/course';
import { planComplete, validatePlan, type CompleteLabels } from '@/utils/completeSyllabus';
import { buildCourseExport, keepCourseExport, type CourseExport } from '@/utils/courseExport';
import { changesWithNotes, type AppendixLabels } from '@/utils/pedagogicalAppendix';
import { saveSyllabusFile } from '@/utils/syllabusDownload';
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
  const auth = useAuthStore();

  const courseToUpdate = computed(() => course.courseToUpdate);
  const changes = computed(() => store.acceptedChanges);

  const lt = useSyllabusText();

  const kinds = computed(
    () =>
      Object.fromEntries(
        KINDS.map((kind) => [kind, lt(`tutor.additions.change.kinds.${kind}`)])
      ) as Record<AdaptationKind, string>
  );

  const labels = computed<ExportLabels>(() => {
    const at = (key: string) => lt(`tutor.updated.export.${key}`);
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
      added: at('added'),
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
    title: lt('tutor.updated.complete.title', {
      title: courseToUpdate.value.title || labels.value.documentTitle
    }),
    note: lt('tutor.updated.complete.note'),
    change: lt('tutor.updated.complete.change'),
    replaces: labels.value.replaces,
    sources: labels.value.sources,
    toPlace: labels.value.toPlace,
    toPlaceNote: lt('tutor.updated.complete.toPlaceNote'),
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
    title: lt('tutor.updated.appendix.title'),
    note: lt('tutor.updated.appendix.note'),
    learning: lt('tutor.additions.change.notes.learning'),
    greencomp: lt('tutor.additions.change.notes.greencomp'),
    teaching: lt('tutor.additions.change.notes.teaching'),
    check: lt('tutor.additions.change.notes.check'),
    // only the competences cited, so the labels stay plain data
    greencompNames: Object.fromEntries(
      changes.value.flatMap(({ guidance }) =>
        guidance.greencomp
          ? [[guidance.greencomp.id, lt(`tutor.greencomp.${guidance.greencomp.id}`)]]
          : []
      )
    ),
    kinds: kinds.value
  }));

  const fileName = (suffixKey: string) =>
    `${(courseToUpdate.value.title || labels.value.documentTitle)
      .replace(/[^\p{L}\p{N}]+/gu, '-')
      .replace(/^-|-$/g, '')}-${lt(suffixKey)}.docx`;

  const exportOf = (kind: CourseExport['kind'], withAppendix: boolean): CourseExport => {
    const appendix =
      withAppendix && hasNotes.value
        ? { changes: changes.value, labels: appendixLabels.value }
        : null;
    if (kind === 'complete' && completePlan.value) {
      return {
        kind,
        fileName: fileName('tutor.updated.complete.fileSuffix'),
        plan: completePlan.value,
        labels: completeLabels.value,
        appendix
      };
    }
    return {
      kind: 'outline',
      fileName: fileName('tutor.updated.export.fileSuffix'),
      markdown: updatedCourseMarkdown(courseToUpdate.value, changes.value, labels.value),
      appendix
    };
  };

  const isExporting = ref(false);
  const hasExportError = ref(false);
  // a guest is asked to sign up first, the export kept for right after, as from scratch
  const exportWord = async (kind: CourseExport['kind'], withAppendix: boolean) => {
    const courseExport = exportOf(
      kind === 'complete' && isCompleteReady.value ? kind : 'outline',
      withAppendix
    );
    if (auth.isGuest) {
      keepCourseExport(courseExport);
      auth.askToSignUp('download');
      return;
    }
    isExporting.value = true;
    hasExportError.value = false;
    const isSaved = await saveSyllabusFile(
      () => buildCourseExport(courseExport),
      courseExport.fileName
    );
    hasExportError.value = !isSaved;
    isExporting.value = false;
  };

  const isCopied = ref(false);
  const hasCopyError = ref(false);
  const copyChanges = async () => {
    hasCopyError.value = false;
    try {
      await navigator.clipboard.writeText(
        changesText(courseToUpdate.value, changes.value, labels.value)
      );
      isCopied.value = true;
      setTimeout(() => (isCopied.value = false), 2000);
    } catch {
      hasCopyError.value = true;
    }
  };

  return {
    changes,
    lt,
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
