import { getFromStorage, saveToStorage } from '@/utils/storage';
import type { ModuleId } from '@/types/learn/modules';

// ponytail: browser only, lost on another device. swap these two functions for API calls once the
// backend stores progress per user (POST/GET /learn/progress); callers stay the same
export type ModuleProgress = {
  completedAt?: string;
  // 1–5 self-rating at the start and at the end of the module
  confidenceBefore?: number;
  confidenceAfter?: number;
};

const STORAGE_KEY = 'learnProgress';

const readAll = (): Partial<Record<ModuleId, ModuleProgress>> => getFromStorage(STORAGE_KEY) ?? {};

export const getProgress = (id: ModuleId): ModuleProgress => readAll()[id] ?? {};

export function saveProgress(id: ModuleId, patch: ModuleProgress) {
  const all = readAll();
  saveToStorage(STORAGE_KEY, { ...all, [id]: { ...all[id], ...patch } });
}
