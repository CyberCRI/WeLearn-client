import { describe, it, expect } from 'vitest';
import { ExternalHyperlink, TextRun } from 'docx';
import { processInlineText } from '@/utils/md-to-docx/helpers';
import { convertMarkdownToDocx } from '@/utils/md-to-docx';
import JSZip from 'jszip';

describe('processInlineText', () => {
  it('keeps the text around links and turns every link into a hyperlink', () => {
    const children = processInlineText(
      'Smith (2020). [Paper](https://a.org/x) and https://b.org/y'
    );
    expect(children[0]).toBeInstanceOf(TextRun);
    expect(children.filter((c) => c instanceof ExternalHyperlink)).toHaveLength(2);
  });

  it('understands the HTML links the LLM writes', () => {
    const children = processInlineText(
      'OMS (2021) <a href="https://www.who.int/x" target="_blank">[lien]</a>.'
    );
    expect(children.filter((c) => c instanceof ExternalHyperlink)).toHaveLength(1);
  });

  it('leaves lines without links as formatted text', () => {
    const children = processInlineText('Plain **bold** text');
    expect(children.every((c) => c instanceof TextRun)).toBe(true);
  });

  it('builds a Word file from a syllabus with references', async () => {
    const md =
      '## References\n\n- Smith (2020). [Paper](https://a.org/x)\n- **Doe** (2021). https://b.org/y\n\nSee [site](https://c.org).';
    await expect(convertMarkdownToDocx(md)).resolves.toBeTruthy();
  });

  it('renders headings, tables, separators and links as real Word formatting', async () => {
    // shaped like a syllabus saved after an edit ("| --- |" separators, [[lien]] links)
    const md = [
      '## 5. **Méthodes d’évaluation**',
      '',
      '| Type | Poids | Description |',
      '| --- | --- | --- |',
      '| **Participation** | 10% | Débats sur les ODD |',
      '| **Examen final** | 25% | Ligne 1<br>- Ligne 2 |',
      '',
      '---',
      '',
      '#### **Ouvrages de référence :**',
      '',
      '-   Géopolitique – *Pascal Gauchon* [[lien]](https://www.eyrolles.com/Geopolitique/)',
      '-   Limites à la croissance [[lien]](https://www.clubofrome.org/)'
    ].join('\n');
    const blob = await convertMarkdownToDocx(md);
    const zip = await JSZip.loadAsync(blob);
    const xml = await zip.file('word/document.xml')!.async('string');
    const text = xml.replace(/<[^>]+>/g, '');

    expect((xml.match(/<w:tbl>/g) || []).length).toBe(1);
    expect(text).not.toContain('**');
    expect(text).not.toContain('| ---');
    expect(text).not.toContain('---');
    expect(text).not.toContain('](');
    expect((xml.match(/<w:hyperlink /g) || []).length).toBe(2);
  });
});
