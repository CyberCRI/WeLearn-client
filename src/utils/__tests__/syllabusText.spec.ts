import { describe, it, expect } from 'vitest';
import { docxText, fileKind, xlsxText } from '@/utils/syllabusText';

describe('fileKind', () => {
  it('recognises the accepted files by type or, without one, by extension', () => {
    expect(fileKind(new File([''], 'a.pdf', { type: 'application/pdf' }))).toBe('pdf');
    expect(fileKind(new File([''], 'plan.xlsx', { type: '' }))).toBe('xlsx');
    expect(fileKind(new File([''], 'cours.docx', { type: '' }))).toBe('docx');
    expect(fileKind(new File([''], 'notes.txt', { type: 'text/plain' }))).toBe('text');
    expect(fileKind(new File([''], 'image.png', { type: 'image/png' }))).toBeNull();
  });
});

describe('docxText', () => {
  it('keeps one line per paragraph, with tabs and xml characters', () => {
    const xml =
      '<w:body><w:p><w:r><w:t>Droit &amp; société</w:t></w:r></w:p><w:p><w:r><w:t xml:space="preserve">Séance 1</w:t><w:tab/><w:t>Le contrat</w:t></w:r></w:p><w:p></w:p></w:body>';
    expect(docxText(xml)).toBe('Droit & société\nSéance 1\tLe contrat');
  });
});

describe('xlsxText', () => {
  it('writes each sheet as rows of cells, from shared and inline strings and numbers', () => {
    const shared =
      '<sst><si><t>Semaine</t></si><si><t>Thème</t></si><si><r><t>Les </t></r><r><t>coûts</t></r></si></sst>';
    const sheet =
      '<sheetData><row r="1"><c r="A1" t="s"><v>0</v></c><c r="B1" t="s"><v>1</v></c></row>' +
      '<row r="2"><c r="A2"><v>4</v></c><c r="B2" t="s"><v>2</v></c><c r="C2" s="1"/></row>' +
      '<row r="3"><c r="A3" t="inlineStr"><is><t>Examen</t></is></c></row></sheetData>';
    expect(
      xlsxText(
        [
          { name: 'Planning', xml: sheet },
          { name: 'Vide', xml: '<sheetData/>' }
        ],
        shared
      )
    ).toBe('# Planning\nSemaine | Thème\n4 | Les coûts\nExamen');
  });
});
