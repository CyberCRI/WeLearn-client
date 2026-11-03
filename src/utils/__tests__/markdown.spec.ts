import { describe, expect, it } from 'vitest';
import { renderMarkdown, sanitizeHtml } from '@/utils/markdown';

const payloads = [
  '<img src=x onerror="alert(1)">',
  '<script>alert(1)</script>',
  '<a href="#" onclick="alert(1)">x</a>',
  '[click](javascript:alert(1))',
  '<iframe src="https://evil.example"></iframe>',
  '<svg onload="alert(1)"></svg>'
];

const toDom = (html: string) => {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div;
};

const hasDanger = (html: string) => {
  const dom = toDom(html);
  const all = Array.from(dom.querySelectorAll('*'));
  return (
    dom.querySelector('script, iframe') !== null ||
    all.some((el) =>
      Array.from(el.attributes).some(
        (attr) => attr.name.startsWith('on') || /^\s*javascript:/i.test(attr.value)
      )
    )
  );
};

describe('renderMarkdown', () => {
  it.each(payloads)('strips scripts and event handlers from %s', (payload) => {
    expect(hasDanger(renderMarkdown(`Answer\n\n${payload}`))).toBe(false);
    expect(hasDanger(renderMarkdown(payload, { externalLinks: true }))).toBe(false);
  });

  it('keeps headings, lists, tables and line breaks', () => {
    const dom = toDom(
      renderMarkdown('# Title\n\n- one\n- two\n\n| a | b |\n| - | - |\n| 1 | x<br>y |')
    );
    expect(dom.querySelector('h1')?.textContent).toBe('Title');
    expect(dom.querySelectorAll('li')).toHaveLength(2);
    expect(dom.querySelector('table td br')).not.toBeNull();
  });

  it('opens links in a new tab when asked', () => {
    const link = toDom(
      renderMarkdown('[paper](https://example.org)', { externalLinks: true })
    ).querySelector('a');
    expect(link?.getAttribute('href')).toBe('https://example.org');
    expect(link?.getAttribute('target')).toBe('_blank');
    expect(link?.getAttribute('rel')).toContain('noopener');
  });

  it('leaves links in place otherwise', () => {
    const link = toDom(renderMarkdown('[paper](https://example.org)')).querySelector('a');
    expect(link?.getAttribute('target')).toBeNull();
  });
});

describe('sanitizeHtml', () => {
  it.each(payloads)('strips scripts and event handlers from %s', (payload) => {
    expect(hasDanger(sanitizeHtml(payload))).toBe(false);
  });

  it('keeps safe markup', () => {
    expect(sanitizeHtml('<p><strong>ok</strong></p>')).toBe('<p><strong>ok</strong></p>');
  });
});
