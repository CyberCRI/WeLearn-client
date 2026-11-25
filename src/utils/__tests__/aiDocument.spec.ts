import { describe, it, expect } from 'vitest';
import { convertMarkdownToDocx } from '@/utils/md-to-docx';
import { completeSyllabusDocx, planComplete, type CompleteLabels } from '@/utils/completeSyllabus';
import type { CourseToUpdate } from '@/types';
import { readDocx } from './readDocx';

const LABELS: CompleteLabels = {
  title: 'Syllabus',
  note: 'Note.',
  change: 'Modification',
  sources: 'Sources',
  toPlace: 'À placer',
  toPlaceNote: 'À placer.',
  kinds: { objective: 'O', topic: 'T', teaching: 'E', assessment: 'A' }
};
const COURSE: CourseToUpdate = {
  title: 'Gestion',
  discipline: null,
  level: null,
  overview: null,
  topics: [],
  objectives: [],
  competencies: [],
  sessions: []
};

const BUILDERS = {
  'the syllabus made from markdown': () => convertMarkdownToDocx('# Cours\n\nUn paragraphe.'),
  'the complete updated syllabus': () =>
    completeSyllabusDocx(planComplete('CONTENU\nUne ligne.', COURSE, []), LABELS)
};

describe('the AI mark on word exports', () => {
  it.each(Object.entries(BUILDERS))(
    '%s says it was written with an AI, on the page and in its properties',
    async (_, build) => {
      const docx = await readDocx(await build());
      const footer = docx.paths.find((path) => /^word\/footer\d*\.xml$/.test(path));

      expect(footer).toBeDefined();
      expect(docx.read(footer!)).toContain('IA de WeLearn');
      expect(docx.read('word/document.xml')).toContain('w:footerReference');

      const core = docx.read('docProps/core.xml');
      expect(core).toContain('<dc:creator>WeLearn</dc:creator>');
      expect(core).toContain('AI-generated');
      expect(core).toContain('IA de WeLearn');

      const custom = docx.read('docProps/custom.xml');
      expect(custom).toMatch(/name="AIGenerated"[^>]*>\s*<vt:lpwstr>true<\/vt:lpwstr>/);
      expect(custom).toContain('name="AIGeneratedBy"');
    }
  );
});
