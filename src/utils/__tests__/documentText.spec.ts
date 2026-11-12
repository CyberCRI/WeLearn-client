import { describe, it, expect, vi } from 'vitest';
import {
  DOCX_TYPE,
  docxText,
  isCheckable,
  readDocumentText,
  unzipEntry
} from '@/utils/documentText';

// pdf.js does not run in jsdom: the pdf reader answers what a real pdf would give
const pdf = vi.hoisted(() => ({ text: '' }));
vi.mock('unpdf', () => ({
  getDocumentProxy: vi.fn(async () => ({})),
  extractText: vi.fn(async () => ({ totalPages: 1, text: pdf.text }))
}));

const WORD_XML = `<?xml version="1.0" encoding="UTF-8"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>
<w:p><w:r><w:t>Objectifs pédagogiques :</w:t></w:r></w:p>
<w:p><w:r><w:t xml:space="preserve">o Comprendre leur </w:t></w:r><w:r><w:t>définition.</w:t></w:r></w:p>
<w:p><w:r><w:t>A</w:t></w:r><w:r><w:tab/><w:t>B</w:t></w:r></w:p>
</w:body></w:document>`;

const deflateRaw = async (data: Uint8Array) => {
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(data);
      controller.close();
    }
  }).pipeThrough(new CompressionStream('deflate-raw'));
  return new Uint8Array(await new Response(stream).arrayBuffer());
};

// a minimal zip with one file, stored (method 0) or compressed (method 8)
const zip = async (name: string, content: string, method: 0 | 8) => {
  const nameBytes = new TextEncoder().encode(name);
  const raw = new TextEncoder().encode(content);
  const data = method === 8 ? await deflateRaw(raw) : raw;
  const local = new Uint8Array(30 + nameBytes.length + data.length);
  const lv = new DataView(local.buffer);
  lv.setUint32(0, 0x04034b50, true);
  lv.setUint16(8, method, true);
  lv.setUint32(18, data.length, true);
  lv.setUint32(22, raw.length, true);
  lv.setUint16(26, nameBytes.length, true);
  local.set(nameBytes, 30);
  local.set(data, 30 + nameBytes.length);
  const central = new Uint8Array(46 + nameBytes.length);
  const cv = new DataView(central.buffer);
  cv.setUint32(0, 0x02014b50, true);
  cv.setUint16(10, method, true);
  cv.setUint32(20, data.length, true);
  cv.setUint32(24, raw.length, true);
  cv.setUint16(28, nameBytes.length, true);
  cv.setUint32(42, 0, true);
  central.set(nameBytes, 46);
  const end = new Uint8Array(22);
  const ev = new DataView(end.buffer);
  ev.setUint32(0, 0x06054b50, true);
  ev.setUint16(8, 1, true);
  ev.setUint16(10, 1, true);
  ev.setUint32(12, central.length, true);
  ev.setUint32(16, local.length, true);
  const all = new Uint8Array(local.length + central.length + end.length);
  all.set(local);
  all.set(central, local.length);
  all.set(end, local.length + central.length);
  return all;
};

describe('documentText', () => {
  it('can check text, word and pdf files', () => {
    expect(isCheckable(new File([''], 'a.txt', { type: 'text/plain' }))).toBe(true);
    expect(isCheckable(new File([''], 'a.docx', { type: DOCX_TYPE }))).toBe(true);
    expect(isCheckable(new File([''], 'a.pdf', { type: 'application/pdf' }))).toBe(true);
    expect(isCheckable(new File([''], 'a.png', { type: 'image/png' }))).toBe(false);
  });

  it('turns word paragraphs into lines, tabs into spaces', () => {
    expect(docxText(WORD_XML)).toBe('Objectifs pédagogiques :\no Comprendre leur définition.\nA B');
  });

  it('unzips a stored or compressed file, and finds nothing that is not there', async () => {
    for (const method of [0, 8] as const) {
      const archive = await zip('word/document.xml', 'hello', method);
      const found = await unzipEntry(archive.buffer, 'word/document.xml');
      expect(new TextDecoder().decode(found!)).toBe('hello');
      expect(await unzipEntry(archive.buffer, 'other.xml')).toBeNull();
    }
    expect(await unzipEntry(new Uint8Array(30).buffer, 'word/document.xml')).toBeNull();
  });

  it('reads the text of a txt and a docx syllabus', async () => {
    expect(await readDocumentText(new File(['Objectifs'], 'a.txt', { type: 'text/plain' }))).toBe(
      'Objectifs'
    );
    const docx = await zip('word/document.xml', WORD_XML, 8);
    expect(await readDocumentText(new File([docx], 'a.docx', { type: DOCX_TYPE }))).toContain(
      'Comprendre leur définition.'
    );
  });

  it('reads the text layer of a pdf, and gives none for a scan', async () => {
    const file = new File(['%PDF'], 'a.pdf', { type: 'application/pdf' });
    pdf.text = 'Objectifs pédagogiques :\no Comprendre leur définition et leur mesure.';
    expect(await readDocumentText(file)).toBe(pdf.text);
    // a scan has no text layer, at most a few stray characters
    pdf.text = ' 1 \n 2 ';
    expect(await readDocumentText(file)).toBeNull();
  });

  it('gives no text for a damaged word file', async () => {
    const broken = new File(['not a zip'], 'a.docx', { type: DOCX_TYPE });
    expect(await readDocumentText(broken)).toBeNull();
  });
});
