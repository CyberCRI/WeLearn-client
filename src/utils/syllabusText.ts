// the text of the teaching material, read in the browser: pdf (unpdf), plain text, word (docx)
// and excel (xlsx). docx and xlsx are zip files of xml: jszip (already used by the docx export)
// opens them, and only their text is kept. other formats return null and keep the basic reading

export const DOCX_TYPE = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
export const XLSX_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

const decodeXml = (text: string) =>
  text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&amp;/g, '&');

// the text runs of an xml fragment (<w:t>, <t>), in order
const runs = (xml: string, tag: string) =>
  [...xml.matchAll(new RegExp(`<${tag}(?:\\s[^>]*)?>([^<]*)</${tag}>`, 'g'))]
    .map((match) => decodeXml(match[1]))
    .join('');

const openZip = async (file: File) => {
  const { default: JSZip } = await import('jszip');
  return JSZip.loadAsync(await file.arrayBuffer());
};

// one line per paragraph (table cells are paragraphs too)
export const docxText = (documentXml: string) =>
  documentXml
    .split(/<\/w:p>/)
    .map((paragraph) => runs(paragraph.replace(/<w:tab\/>/g, '<w:t>\t</w:t>'), 'w:t').trim())
    .filter(Boolean)
    .join('\n');

// one line per row, cells separated by " | ", one block per sheet with its name.
// ponytail: dates stay as excel stores them (day numbers): reading cell formats is not done
export const xlsxText = (sheets: { name: string; xml: string }[], sharedStringsXml: string) => {
  const shared = [...sharedStringsXml.matchAll(/<si>([\s\S]*?)<\/si>/g)].map((match) =>
    runs(match[1], 't')
  );
  return sheets
    .map(({ name, xml }) => {
      const rows = [...xml.matchAll(/<row[^>]*>([\s\S]*?)<\/row>/g)]
        .map((row) =>
          [...row[1].matchAll(/<c([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)]
            .map(([, attributes, content = '']) => {
              if (/t="s"/.test(attributes)) {
                const index = Number(content.match(/<v>(\d+)<\/v>/)?.[1]);
                return Number.isNaN(index) ? '' : shared[index] || '';
              }
              if (/t="inlineStr"/.test(attributes)) return runs(content, 't');
              return decodeXml(content.match(/<v>([^<]*)<\/v>/)?.[1] || '');
            })
            .map((cell) => cell.trim())
            .filter(Boolean)
            .join(' | ')
        )
        .filter(Boolean);
      return rows.length ? [`# ${name}`, ...rows].join('\n') : '';
    })
    .filter(Boolean)
    .join('\n\n');
};

// the kind of file, from its type or, when the browser gives none, its extension
export type FileKind = 'pdf' | 'docx' | 'xlsx' | 'text';
export const fileKind = (file: File): FileKind | null => {
  const extension = file.name.split('.').pop()?.toLowerCase();
  if (file.type === 'application/pdf' || extension === 'pdf') return 'pdf';
  if (file.type === DOCX_TYPE || extension === 'docx') return 'docx';
  if (file.type === XLSX_TYPE || extension === 'xlsx') return 'xlsx';
  if (file.type.startsWith('text/') || extension === 'txt') return 'text';
  return null;
};

export const readSyllabusText = async (file: File): Promise<string | null> => {
  const kind = fileKind(file);
  if (kind === 'pdf') {
    // loaded only when needed: pdf.js is large
    const { extractText, getDocumentProxy } = await import('unpdf');
    const pdf = await getDocumentProxy(new Uint8Array(await file.arrayBuffer()));
    const { text } = await extractText(pdf, { mergePages: true });
    return text;
  }
  if (kind === 'docx') {
    const zip = await openZip(file);
    const xml = await zip.file('word/document.xml')?.async('string');
    return xml ? docxText(xml) : null;
  }
  if (kind === 'xlsx') {
    const zip = await openZip(file);
    const workbook = (await zip.file('xl/workbook.xml')?.async('string')) || '';
    const names = [...workbook.matchAll(/<sheet [^>]*name="([^"]*)"/g)].map((m) => decodeXml(m[1]));
    const sheetFiles = Object.keys(zip.files)
      .filter((path) => /^xl\/worksheets\/sheet\d+\.xml$/.test(path))
      .sort((a, b) => Number(a.match(/\d+/)?.[0]) - Number(b.match(/\d+/)?.[0]));
    const sheets = await Promise.all(
      sheetFiles.map(async (path, index) => ({
        name: names[index] || `Sheet ${index + 1}`,
        xml: await zip.file(path)!.async('string')
      }))
    );
    const shared = (await zip.file('xl/sharedStrings.xml')?.async('string')) || '';
    return xlsxText(sheets, shared);
  }
  if (kind === 'text') return file.text();
  return null;
};
