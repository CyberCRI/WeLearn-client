import type { Feature } from '@/stores/featureFlip';
import type { LearnModuleId } from '@/types/learn/modules';

export type LearnModule = { id: LearnModuleId; to: string; feature: Feature };
type IsFeatureEnabled = (feature: Feature) => boolean;

// order shown on the Learn page, also the "next module" order. nothing is locked.
// each module has its own feature flip: only the enabled ones are listed, numbered and linked
export const MODULES: LearnModule[] = [
  { id: 'foundations', to: '/learn/foundations', feature: 'learnFoundations' },
  { id: 'frameworks', to: '/learn/frameworks', feature: 'learnFrameworks' },
  { id: 'discipline', to: '/learn/discipline', feature: 'learnDiscipline' }
];

// the flip check is passed in, so this file stays free of pinia
export const visibleModules = (isEnabled: IsFeatureEnabled) =>
  MODULES.filter((m) => isEnabled(m.feature));

export const isLearnModule = (id: unknown) => MODULES.some((m) => m.id === id);

export const isModuleVisible = (id: unknown, isEnabled: IsFeatureEnabled) =>
  visibleModules(isEnabled).some((m) => m.id === id);

// pass the visible modules, so "next" never points to a module that is off
export const nextModule = (id: LearnModuleId, modules: LearnModule[] = MODULES) => {
  const index = modules.findIndex((m) => m.id === id);
  return index === -1 ? null : (modules[index + 1] ?? null);
};
