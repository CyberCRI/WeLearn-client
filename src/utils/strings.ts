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
