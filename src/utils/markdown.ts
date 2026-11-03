import DOMPurify from 'dompurify';
import { marked } from 'marked';

// marked passes raw HTML through, and the markdown comes from the LLM, documents or user edits,
// so every string that ends up in a v-html must go through here first
export const sanitizeHtml = (html: string): string =>
  // target is dropped by default, external links need it
  DOMPurify.sanitize(html, { ADD_ATTR: ['target'] });

const externalLinkRenderer = new marked.Renderer();
const defaultLink = externalLinkRenderer.link;
externalLinkRenderer.link = (href, title, text) => {
  const html = defaultLink.call(externalLinkRenderer, href, title, text);
  return html.replace(/^<a /, '<a target="_blank" rel="noopener noreferrer nofollow" ');
};

export const renderMarkdown = (
  markdown: string,
  { externalLinks = false }: { externalLinks?: boolean } = {}
): string => {
  const html = marked.parse(markdown, {
    async: false,
    ...(externalLinks && { renderer: externalLinkRenderer })
  }) as string;
  return sanitizeHtml(html);
};
