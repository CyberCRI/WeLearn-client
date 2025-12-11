import { defineStore } from 'pinia';
import { convertMarkdownToDocx, downloadDocx } from '@/utils/md-to-docx';
import _isequal from 'lodash.isequal';
import { type Ref, ref } from 'vue';
import { type Document, type TutorSearch, type TutorSyllabus } from '@/types';
import { postAxios } from '@/utils/fetch';
import i18n from '@/localisation/i18n';

export const useTutorStore = defineStore('tutor', () => {
  const tutorSearch: Ref<TutorSearch | undefined> = ref(undefined);
  const syllabi: Ref<{ content: string; source: string } | undefined> = ref(undefined);
  const newFilesToSearch: Ref<Record<string, File>> = ref({});
  const searchedFiles: Ref<File[]> = ref([]);
  const isLoading: Ref<boolean> = ref(false);
  const step: Ref<number> = ref(1);
  const hasNewSearch: Ref<boolean> = ref(false);
  const level: Ref<string> = ref('');
  const duration: Ref<string> = ref('');
  const description: Ref<string> = ref('');
  const courseTitle: Ref<string> = ref('');
  const selectedSources: Ref<Document[]> = ref([]);

  const goBack = () => (step.value = step.value - 1);
  const goNext = () => (step.value = step.value + 1);
  const setStep = (newStep: number) => (step.value = newStep);

  // ERROR STATES
  const shouldRetryAction: Ref<boolean> = ref(false);
  const hasSearchError: Ref<boolean> = ref(false);
  const reloadError: Ref<boolean> = ref(false);
  const hasSyllabusError: Ref<boolean> = ref(false);
  const fileError: Ref<{ state: boolean; reason: 'BIG_FILE' | 'BAD_EXTENSION' | null }> = ref({
    state: false,
    reason: null
  });

  const addFile = (e: any, input_id: string) => {
    const targetFile = e.target.files[0];

    if (targetFile && targetFile.size > 5 * 1024 * 1024) {
      fileError.value = {
        state: true,
        reason: 'BIG_FILE'
      };
      return;
    }

    if (
      targetFile &&
      !(
        targetFile.type === 'application/pdf' ||
        targetFile.type.startsWith('text/') ||
        targetFile.type ===
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      )
    ) {
      fileError.value = {
        state: true,
        reason: 'BAD_EXTENSION'
      };
      return;
    }

    newFilesToSearch.value = {
      ...newFilesToSearch.value,
      [input_id]: targetFile
    };

    fileError.value = {
      state: false,
      reason: null
    };
  };

  const removeFile = (input_id: string) => {
    if (newFilesToSearch.value[input_id]) {
      delete newFilesToSearch.value[input_id];
    }
    fileError.value = {
      state: false,
      reason: null
    };
  };

  // const summaries = ref<[string]>([
  //   "Global warming, a subset of climate change, refers to the long-term rise in the average temperature of the Earth's climate system, primarily caused by human activities such as fossil fuel burning, deforestation, and certain agricultural and industrial practices that release greenhouse gases. These gases trap heat in the lower atmosphere, leading to various environmental impacts like desert expansion, increased frequency of heat waves and wildfires, accelerated Arctic warming, glacier retreat, and sea ice decline. Climate change also affects biodiversity, forcing species to relocate or face extinction, and poses significant threats to human societies, including increased flooding, extreme heat, food and water scarcity, disease, economic loss, and potential human migration and conflict. Even with efforts to minimize future warming, some effects will persist for centuries, including ocean heating, acidification, and sea-level rise. The Paris Agreement aims to limit global warming to well below 2°C, but current pledges still project a rise of about 2.8°C by the end of the century. There is widespread support for climate action, with most countries aiming to stop emitting carbon dioxide. Strategies include phasing out fossil fuels, conserving energy, switching to clean energy sources, and removing carbon from the atmosphere through methods like reforestation and carbon-storing farming practices.",
  //   "The article discusses the XL-Sum dataset, a large-scale multilingual abstractive summarization dataset containing 1 million professionally annotated article-summary pairs from BBC, covering 44 languages. The dataset is designed to address the lack of high-quality datasets for low-resource languages in abstractive summarization. XL-Sum introduces the first publicly available summarization dataset for many languages and achieves competitive results in both multilingual and low-resource summarization tasks. The dataset is created using a custom crawler and a set of heuristics to extract high-quality summaries from BBC articles. Evaluations show that the summaries are highly abstractive, concise, and of high quality, with minimal redundancy. The mT5 model fine-tuned on XL-Sum achieves state-of-the-art results, demonstrating the dataset's effectiveness in abstractive summarization across multiple languages."
  // ]);

  const summaries = ref<[string]>([]);

  const updateSummary = (index, content) => {
    summaries.value[index] = content;
  };

  const getFilesContent = async (arg: File[]) => {
    isLoading.value = true;
    shouldRetryAction.value = false;
    const formData = new FormData();
    arg.forEach((file) => {
      if (file) {
        formData.append('files', file);
      }
    });
    try {
      const resp = await postAxios('/tutor/files/content', formData, {
        headers: { 'content-type': 'multipart/form-data' }
      });
      // if (resp.data.status === 204) {
      //
      // }
      console.log(resp.data);
      const summaries = resp.data.extracts.reduce((acc, curr) => {
        acc = [...acc, curr.summary];
      }, []);
      console.log(summaries);
      summaries.value = summaries;
    } catch (error: any) {
      console.error('Error during tutor search:', error);
    } finally {
      isLoading.value = false;
    }
  };

  const retrieveTutorSearch = async (arg: File[]) => {
    isLoading.value = true;

    try {
<<<<<<< HEAD
      const resp = await postAxios('/tutor/search', summaries);
      if (resp.status === 204) {
        shouldRetryAction.value = true;
      } else {
        tutorSearch.value = resp.data;
        hasSearchError.value = false;
        isLoading.value = false;
        shouldRetryAction.value = false;

        goNext();
      }
||||||| parent of 4780a21 (wip)
      const resp = await postAxios('/tutor/search', summaries);
      tutorSearch.value = resp.data;
      hasSearchError.value = false;
=======
      const resp = await postAxios('/tutor/search_extracts', { summaries: summaries.value });
      tutorSearch.value = resp.data;
      hasSearchError.value = false;
>>>>>>> 4780a21 (wip)
    } catch (error: any) {
      console.error('Error during tutor search:', error);
      hasSearchError.value = true;
      if (error.code === 'ERR_NETWORK') {
        reloadError.value = true;
      }
    } finally {
      setStep(3);
      searchedFiles.value = arg;
    }
  };

  const appendSource = (source: Document) => {
    const sourceExists =
      selectedSources.value && selectedSources.value.some((s) => s.id === source.id);
    if (!sourceExists) {
      selectedSources.value.push(source);
    } else {
      selectedSources.value = selectedSources.value.filter((s) => s.id !== source.id);
    }
  };

  const handleSummaryFiles = async () => {
    reloadError.value = false;
    selectedSources.value = [];
    const arg = Object.values(newFilesToSearch.value).filter((e) => e);
    if (!arg.length) {
      console.error('No files selected');
      return;
    }

    if (_isequal(searchedFiles.value, arg)) {
      hasNewSearch.value = false;
      goNext();
      return;
    }

    tutorSearch.value = undefined;
    await getFilesContent(arg);
    hasNewSearch.value = true;

    goNext();
  };

  const handleSearch = async () => {
    reloadError.value = false;
    selectedSources.value = [];
    const arg = Object.values(newFilesToSearch.value).filter((e) => e);
    if (!arg.length) {
      console.error('No files selected');
      return;
    }

    if (_isequal(searchedFiles.value, arg) && !shouldRetryAction.value) {
      hasNewSearch.value = false;
      goNext();
      return;
    }

    tutorSearch.value = undefined;
    await retrieveTutorSearch(arg);
    hasNewSearch.value = true;
  };

  const retrieveSyllabus = async () => {
    if (!tutorSearch.value) {
      throw new Error('Body is empty');
    }
    isLoading.value = true;
    try {
      console.log(selectedSources.value.length);
      const resp = await postAxios(`/tutor/syllabus?lang=${i18n.global.locale.value}`, {
        ...tutorSearch.value,
        documents: selectedSources.value,
        ...(courseTitle.value && { course_title: courseTitle.value }),
        ...(level.value && { level: level.value }),
        ...(duration.value && { duration: duration.value }),
        ...(description.value && { description: description.value })
      });

      const data = resp.data as TutorSyllabus;

      //keep only the syllabus from pedagogical engineer
      syllabi.value = data.syllabus.filter(({ source }) =>
        source.toLowerCase().includes('pedagogicalengineer')
      )[0];
      hasSyllabusError.value = false;
    } catch (error) {
      console.error('Error during syllabus retrieval:', error);
      hasSyllabusError.value = true;
    } finally {
      isLoading.value = false;
    }
  };

  const handleCreateSyllabus = async () => {
    if (
      !tutorSearch.value ||
      (!tutorSearch.value.documents.length && !searchedFiles.value.length)
    ) {
      console.error('No documents found');
      return;
    }

    if (!hasNewSearch.value) {
      goNext();
      return;
    }

    await retrieveSyllabus();
    hasNewSearch.value = false;
    goNext();
  };

  const giveFeedback = async (feedback: string) => {
    if (!tutorSearch.value || !syllabi.value) {
      throw new Error('Body is empty');
    }

    isLoading.value = true;

    try {
      const resp = await postAxios('/tutor/syllabus/feedback', {
        feedback: feedback,
        syllabus: [syllabi.value],
        ...tutorSearch.value,
        documents: selectedSources.value
      });

      syllabi.value = resp.data.syllabus[0];
    } catch (error) {
      console.error('Error during feedback submission:', error);
    } finally {
      isLoading.value = false;
    }
  };

  const handleDownloadSyllabus = async () => {
    if (!syllabi.value || !syllabi.value.content) {
      console.error('No syllabi available for download');
      return;
    }
    const docxContent = await convertMarkdownToDocx(syllabi.value.content);
    downloadDocx(docxContent, 'syllabus.docx');
  };

  return {
    step,
    goBack,
    goNext,
    setStep,
    syllabi,
    addFile,
    removeFile,
    fileError,
    reloadError,
    handleSearch,
    retrieveTutorSearch,
    tutorSearch,
    appendSource,
    retrieveSyllabus,
    updateSummary,
    handleCreateSyllabus,
    hasSearchError,
    hasSyllabusError,
    isLoading,
    searchedFiles,
    giveFeedback,
    handleDownloadSyllabus,
    courseTitle,
    selectedSources,
    level,
    duration,
<<<<<<< HEAD
    shouldRetryAction,
    description
||||||| parent of 3cf4dbb (feat(syllabus): adds interactive summaries)
    description
=======
    description,
    handleSummaryFiles,
    summaries,
    newFilesToSearch
>>>>>>> 3cf4dbb (feat(syllabus): adds interactive summaries)
  };
});
