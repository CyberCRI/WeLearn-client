import i18n from '@/localisation/i18n';
import { useLearnerStore } from '@/stores/learner';
import type { LearnerSpace, TutorMode } from '@/utils/learnerTutor';

// what every space does with the shared tutor: a free message, a hint or a direct explanation
// (on the learner's last message, or the topic), and a request from one of its own buttons,
// shown in the conversation by the button's label
export const useSpaceTutor = (space: LearnerSpace) => {
  const store = useLearnerStore();
  const { t } = i18n.global;

  const send = (text: string) => store.ask(space, 'chat', text);

  const help = (mode: 'hint' | 'direct') => {
    const lastLearner = [...store.turnsOf(space)].reverse().find((turn) => turn.role === 'learner');
    store.ask(space, mode, lastLearner?.text || store.thread.topic, t(`student.tutor.${mode}`));
  };

  const request = (mode: TutorMode, message: string, label: string) =>
    store.ask(space, mode, message, message && label !== message ? `${label} — ${message}` : label);

  return { store, send, help, request };
};
