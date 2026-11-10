import { computed } from 'vue';
import i18n from '@/localisation/i18n';
import { foundations } from './modules/foundations';
import { frameworks } from './modules/frameworks';
import type { LearnModuleId, ModuleContent, ModuleId } from '@/types/learn/modules';

// ponytail: local list and content until the API serves them (GET /learn/modules, GET /learn/modules/{id}).
// only this file should change then: components get content through getModuleContent / useModuleContent

// order shown on the Learn page, also the "next module" order. nothing is locked.
export const MODULES: { id: LearnModuleId; to: string }[] = [
  { id: 'foundations', to: '/learn/foundations' },
  { id: 'frameworks', to: '/learn/frameworks' },
  { id: 'discipline', to: '/learn/discipline' }
];

const CONTENT: Record<ModuleId, { en: ModuleContent; fr: ModuleContent }> = {
  foundations,
  frameworks
};

export const isModuleId = (id: unknown): id is ModuleId =>
  typeof id === 'string' && Object.prototype.hasOwnProperty.call(CONTENT, id);

export const getModuleContent = (id: ModuleId, locale: string): ModuleContent =>
  CONTENT[id][locale === 'en' ? 'en' : 'fr'];

export const useModuleContent = (id: () => ModuleId) =>
  computed(() => getModuleContent(id(), i18n.global.locale.value));

// title, subtitle and duration of any module on the Learn page. the discipline module has no
// typed content file: its card text lives in i18n (learn.cards.discipline)
export function getModuleCard(id: LearnModuleId, locale: string) {
  if (isModuleId(id)) {
    const { title, subtitle, duration } = getModuleContent(id, locale);
    return { title, subtitle, duration };
  }
  const { t } = i18n.global;
  return {
    title: t(`learn.cards.${id}.title`),
    subtitle: t(`learn.cards.${id}.subtitle`),
    duration: t(`learn.cards.${id}.duration`)
  };
}

export const nextModule = (id: LearnModuleId) =>
  MODULES[MODULES.findIndex((m) => m.id === id) + 1] ?? null;
