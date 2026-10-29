import { afterEach, describe, expect, it, vi } from 'vitest';
import { Document, Packer, Paragraph } from 'docx';
import JSZip from 'jszip';
import {
  createLinkParagraph,
  processBlockquote,
  processCodeBlock,
  processComment,
  processFormattedText,
  processImage,
  processInlineCode,
  processLink,
  processLinkParagraph
} from '@/utils/md-to-docx/helpers';
import { MarkdownConversionError, convertMarkdownToDocx } from '@/utils/md-to-docx/converter';
import type { Style } from '@/utils/md-to-docx/types';

const STYLE: Style = {
  titleSize: 32,
  headingSpacing: 240,
  paragraphSpacing: 120,
  lineSpacing: 1.15
};

// renders the paragraphs into a real .docx and returns its document.xml
const toXml = async (children: Paragraph[]) => {
  const doc = new Document({ sections: [{ children }] });
  const zip = await JSZip.loadAsync(await Packer.toBlob(doc));
  return {
    zip,
    xml: await zip.file('word/document.xml')!.async('string')
  };
};

const textOf = (xml: string) => xml.replace(/<[^>]+>/g, '');

describe('md-to-docx helpers', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('renders a blockquote as an indented italic paragraph with a left border', async () => {
    const { xml } = await toXml([processBlockquote('Quoted text', STYLE)]);

    expect(textOf(xml)).toBe('Quoted text');
    expect(xml).toContain('<w:i/>');
    expect(xml).toMatch(/<w:ind w:left="720"/);
    expect(xml).toMatch(/<w:left w:val="single" w:color="AAAAAA" w:sz="3"/);
    expect(xml).toMatch(/<w:spacing w:before="120" w:after="120"/);
  });

  it('renders a comment as a grey italic paragraph prefixed with "Comment:"', async () => {
    const { xml } = await toXml([processComment('check this', STYLE)]);

    expect(textOf(xml)).toBe('Comment: check this');
    expect(xml).toContain('<w:i/>');
    expect(xml).toContain('<w:color w:val="666666"/>');
  });

  it('renders inline code in a monospace font on a grey background', async () => {
    const { xml } = await toXml([new Paragraph({ children: [processInlineCode('x = 1')] })]);

    expect(textOf(xml)).toBe('x = 1');
    expect(xml).toMatch(/<w:rFonts w:ascii="Courier New"/);
    expect(xml).toContain('<w:color w:val="444444"/>');
    expect(xml).toMatch(/<w:shd [^>]*w:fill="F5F5F5"/);
  });

  it('renders backtick-quoted text as inline code inside formatted text', async () => {
    const { xml } = await toXml([
      new Paragraph({ children: processFormattedText('run `ls` now') })
    ]);

    expect(textOf(xml)).toBe('run ls now');
    expect((xml.match(/Courier New/g) || []).length).toBeGreaterThan(0);
  });

  it('renders a code block with its language, line breaks and leading spaces kept', async () => {
    const { xml } = await toXml([processCodeBlock('if (a) {\n  b();\n}', 'js', STYLE)]);
    const text = textOf(xml);

    expect(text.startsWith('js')).toBe(true);
    expect(text).toContain('if (a) {');
    // leading spaces become non-breaking spaces so Word keeps the indentation
    expect(text).toContain('  b();');
    expect((xml.match(/<w:br\/>/g) || []).length).toBe(3);
    expect(xml).toContain('<w:b/>');
    expect(xml).toMatch(/<w:shd [^>]*w:fill="F5F5F5"/);
  });

  it('renders a code block without a language label', async () => {
    const { xml } = await toXml([processCodeBlock('one line', undefined, STYLE)]);

    expect(textOf(xml)).toBe('one line');
    expect(xml).not.toContain('<w:br/>');
    expect(xml).not.toContain('<w:b/>');
  });

  it('renders a link run as blue underlined text', async () => {
    const { xml } = await toXml([new Paragraph({ children: [processLink('a link')] })]);

    expect(textOf(xml)).toBe('a link');
    expect(xml).toContain('<w:color w:val="0000FF"/>');
    expect(xml).toContain('<w:u w:val="single"/>');
  });

  it.each([
    ['processLinkParagraph', processLinkParagraph('Site', 'https://a.org/x', STYLE)],
    ['createLinkParagraph', createLinkParagraph('Site', 'https://a.org/x')]
  ])('%s produces a real hyperlink to the url', async (_name, paragraph) => {
    const { zip, xml } = await toXml([paragraph]);
    const rels = await zip.file('word/_rels/document.xml.rels')!.async('string');

    expect(textOf(xml)).toBe('Site');
    expect((xml.match(/<w:hyperlink /g) || []).length).toBe(1);
    expect(rels).toContain('Target="https://a.org/x"');
    expect(rels).toContain('TargetMode="External"');
  });

  it('embeds a fetched image centred in its own paragraph', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => undefined);
    const bytes = new Uint8Array([0xff, 0xd8, 0xff, 0xd9]);
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      arrayBuffer: () => Promise.resolve(bytes.buffer)
    });
    vi.stubGlobal('fetch', fetchMock);

    const paragraphs = await processImage('A cat', 'https://img.org/cat.jpg', STYLE);
    const { zip, xml } = await toXml(paragraphs);

    expect(fetchMock).toHaveBeenCalledWith('https://img.org/cat.jpg');
    expect(paragraphs).toHaveLength(1);
    expect(xml).toContain('<w:drawing>');
    expect(xml).toContain('<w:jc w:val="center"/>');
    expect(Object.keys(zip.files).some((name) => name.startsWith('word/media/'))).toBe(true);
  });

  it('falls back to a red placeholder when the image cannot be fetched', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => undefined);
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, status: 404, statusText: 'Not Found' })
    );

    const paragraphs = await processImage('A cat', 'https://img.org/missing.jpg', STYLE);
    const { xml } = await toXml(paragraphs);

    expect(textOf(xml)).toBe('[Image could not be displayed: A cat]');
    expect(xml).toContain('<w:color w:val="FF0000"/>');
    expect(xml).not.toContain('<w:drawing>');
    expect(consoleError).toHaveBeenCalled();
  });
});

describe('MarkdownConversionError', () => {
  it('keeps its name, message and context', () => {
    const error = new MarkdownConversionError('boom', { line: 3 });

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('MarkdownConversionError');
    expect(error.message).toBe('boom');
    expect(error.context).toEqual({ line: 3 });
  });

  it('wraps unexpected failures of the conversion', async () => {
    const result = convertMarkdownToDocx(null as unknown as string);

    await expect(result).rejects.toBeInstanceOf(MarkdownConversionError);
    await expect(result).rejects.toThrow(/^Failed to convert markdown to docx: /);
  });
});
