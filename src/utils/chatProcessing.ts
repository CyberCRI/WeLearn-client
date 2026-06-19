import type { ChatProcessingMetadata } from '@/types';

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

const normalizeProcessingStep = (value: unknown): string | undefined => {
  if (typeof value !== 'string') {
    return undefined;
  }

  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[-\s]+/g, '_');

  if (!normalized) {
    return undefined;
  }

  if (['fetching_resources', 'analyzing_resources', 'generating_answer'].includes(normalized)) {
    return normalized;
  }

  return undefined;
};

const toProcessingMetadata = (value: unknown): ChatProcessingMetadata | null => {
  if (!isRecord(value)) {
    return null;
  }

  const rawStatus = typeof value.status === 'string' ? value.status.trim().toLowerCase() : '';
  const statusAsStep = normalizeProcessingStep(rawStatus);
  const step =
    normalizeProcessingStep(value.step) ?? (rawStatus === 'processing' ? undefined : statusAsStep);

  const isProcessingEvent = rawStatus === 'processing' || Boolean(step);
  if (!isProcessingEvent) {
    return null;
  }

  if (!step) {
    return null;
  }

  return {
    status: 'processing',
    step
  };
};

export const extractProcessingMetadata = (parsed: unknown): ChatProcessingMetadata | null => {
  if (!isRecord(parsed)) {
    return null;
  }

  return (
    toProcessingMetadata(parsed) ??
    toProcessingMetadata(parsed.data) ??
    toProcessingMetadata(parsed.meta) ??
    toProcessingMetadata(parsed.metadata)
  );
};
