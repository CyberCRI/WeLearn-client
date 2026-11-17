import type { ChatMessage } from '@/types';

export const chatSplitEffect = (answer: string, currentAssistantPrompt: ChatMessage) => {
  const timeOuts = answer.split(/(?=[ ])|(?<=[ ])/).map((letter, index) => {
    setTimeout(() => {
      currentAssistantPrompt.content += letter;
    }, 25 * index);
  });

  timeOuts?.forEach((id) => {
    clearTimeout(id as unknown as number);
  });

  return null;
};

// fallback label for an id with no translation: 'bmj-open' → 'bmj open'
export const idToLabel = (id: string) => id.replace(/-/g, ' ');

// for display only: "économie" shows as "Économie"; the stored text keeps the syllabus's wording
export const capitalise = (text: string) =>
  text ? text.charAt(0).toLocaleUpperCase() + text.slice(1) : text;
