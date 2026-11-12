// the text of an uploaded syllabus, read in the browser: WeLearn reads the course from it, and
// what it extracted is checked against it. plain text; word (docx), a zip of xml unzipped with the
// browser's own DecompressionStream; pdf with unpdf (pdf.js), as in the "design your course"
// prototype. a pdf without a text layer (a scan) gives no text: it is never treated as checked

export const DOCX_TYPE = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

export const PDF_TYPE = 'application/pdf';

export const isCheckable = (file: File) =>
  file.type.startsWith('text/') || file.type === DOCX_TYPE || file.type === PDF_TYPE;

// under this many letters, a pdf has no real text layer (a scan, or images of text)
const MIN_PDF_LETTERS = 50;

const pdfText = async (buffer: ArrayBuffer) => {
  // loaded only when needed: pdf.js is large
  const { extractText, getDocumentProxy } = await import('unpdf');
  const pdf = await getDocumentProxy(new Uint8Array(buffer));
  const { text } = await extractText(pdf, { mergePages: true });
  return (text.match(/\p{L}/gu) || []).length >= MIN_PDF_LETTERS ? text : null;
};

// FileReader rather than file.text() / arrayBuffer(), which jsdom (unit tests) does not have
const readAs = <T extends 'text' | 'buffer'>(file: Blob, kind: T) =>
  new Promise<T extends 'text' ? string : ArrayBuffer>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as T extends 'text' ? string : ArrayBuffer);
    reader.onerror = () => reject(reader.error);
    if (kind === 'text') reader.readAsText(file);
    else reader.readAsArrayBuffer(file);
  });

const inflateRaw = async (data: Uint8Array) => {
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(data);
      controller.close();
    }
  }).pipeThrough(new DecompressionStream('deflate-raw'));
  return new Uint8Array(await new Response(stream).arrayBuffer());
};

// one file of a zip archive, found through the archive's central directory
export const unzipEntry = async (buffer: ArrayBuffer, name: string): Promise<Uint8Array | null> => {
  const bytes = new Uint8Array(buffer);
  const view = new DataView(buffer);
  // the end-of-central-directory record sits in the last 64 KB (its comment can be that long)
  let end = -1;
  for (let i = bytes.length - 22; i >= Math.max(0, bytes.length - 65557); i--) {
    if (view.getUint32(i, true) === 0x06054b50) {
      end = i;
      break;
    }
  }
  if (end < 0) return null;
  const count = view.getUint16(end + 10, true);
  let entry = view.getUint32(end + 16, true);
  const decoder = new TextDecoder();
  for (let i = 0; i < count; i++) {
    if (view.getUint32(entry, true) !== 0x02014b50) return null;
    const method = view.getUint16(entry + 10, true);
    const size = view.getUint32(entry + 20, true);
    const nameLength = view.getUint16(entry + 28, true);
    const extraLength = view.getUint16(entry + 30, true);
    const commentLength = view.getUint16(entry + 32, true);
    const local = view.getUint32(entry + 42, true);
    const entryName = decoder.decode(bytes.subarray(entry + 46, entry + 46 + nameLength));
    if (entryName === name) {
      const start =
        local + 30 + view.getUint16(local + 26, true) + view.getUint16(local + 28, true);
      const data = bytes.subarray(start, start + size);
      if (method === 0) return data;
      if (method === 8) return inflateRaw(data);
      return null;
    }
    entry += 46 + nameLength + extraLength + commentLength;
  }
  return null;
};

// the paragraphs of word/document.xml, one per line (tabs and breaks kept as spaces)
export const docxText = (xml: string) => {
  const doc = new DOMParser().parseFromString(xml, 'application/xml');
  const paragraphs = Array.from(doc.getElementsByTagNameNS('*', 'p'));
  return paragraphs
    .map((paragraph) =>
      Array.from(paragraph.getElementsByTagNameNS('*', '*'))
        .map((node) =>
          node.localName === 't'
            ? node.textContent || ''
            : ['tab', 'br'].includes(node.localName)
              ? ' '
              : ''
        )
        .join('')
    )
    .join('\n');
};

// null when the format cannot be read here, or the file could not be read
export const readDocumentText = async (file: File): Promise<string | null> => {
  try {
    if (file.type.startsWith('text/')) return await readAs(file, 'text');
    if (file.type === PDF_TYPE) return await pdfText(await readAs(file, 'buffer'));
    if (file.type !== DOCX_TYPE || typeof DecompressionStream === 'undefined') return null;
    const xml = await unzipEntry(await readAs(file, 'buffer'), 'word/document.xml');
    return xml ? docxText(new TextDecoder().decode(xml)) : null;
  } catch {
    return null;
  }
};
