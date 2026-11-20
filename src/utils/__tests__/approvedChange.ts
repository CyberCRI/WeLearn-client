import type { ApprovedChange } from '@/types';

// an accepted change for the updated-syllabus specs: id n becomes connection "n"
export const approvedChange = (id: number, values: Partial<ApprovedChange>): ApprovedChange => ({
  connectionId: String(id),
  connection: `Lien ${id}`,
  kind: 'topic',
  placement: null,
  original: null,
  suggested: `Changement ${id}.`,
  text: `Changement ${id}.`,
  why: '',
  support: 'strong',
  resources: [],
  guidance: { learning: null, greencomp: null, teaching: null, check: null },
  checks: null,
  ...values
});
