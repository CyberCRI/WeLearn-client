import { Document, Paragraph, TextRun, AlignmentType, PageOrientation, Packer, Table } from 'docx';
import { type Options, type Style, headingConfigs } from './types';
import {
  processHeading,
  processTable,
  processListItem,
  processBlockquote,
  processComment,
  processFormattedText,
  collectTables,
  processCodeBlock,
  processLinkParagraph,
  processImage
} from './helpers';

const defaultStyle: Style = {
  titleSize: 32,
  headingSpacing: 240,
  paragraphSpacing: 240,
  lineSpacing: 1.15
};

const defaultOptions: Options = {
  documentType: 'document',
  style: defaultStyle
};

export { type Options, type TableData } from './types';

/**
 * Custom error class for markdown conversion errors
 * @extends Error
 * @param message - The error message
 * @param context - The context of the error
 */
export class MarkdownConversionError extends Error {
  constructor(
    message: string,
    public context?: any
  ) {
    super(message);
    this.name = 'MarkdownConversionError';
  }
}

/**
 * Convert Markdown to Docx
 * @param markdown - The Markdown string to convert
 * @param options - The options for the conversion
 * @returns A Promise that resolves to a Blob containing the Docx file
 * @throws {MarkdownConversionError} If conversion fails
 */
export async function convertMarkdownToDocx(
  markdown: string,
  options: Options = defaultOptions
): Promise<Blob> {
  try {
    const { style = defaultStyle, documentType = 'document' } = options;
    const docChildren: (Paragraph | Table)[] = [];
    const lines = markdown.split('\n');
    let inList = false;
    let listItems: Paragraph[] = [];
    let inCodeBlock = false;
    let codeBlockContent = '';
    let codeBlockLanguage: string | undefined;
    let tableIndex = 0;
    const tables = collectTables(lines);

    for (let i = 0; i < lines.length; i++) {
      try {
        const line = lines[i].trim();

        // Skip empty lines
        if (!line) {
          if (inCodeBlock) {
            codeBlockContent += '\n';
          }
          if (inList) {
            docChildren.push(...listItems);
            listItems = [];
            inList = false;
          }
          docChildren.push(new Paragraph({}));
          continue;
        }

        // Handle code blocks
        if (line.startsWith('```')) {
          if (!inCodeBlock) {
            // Start of code block
            inCodeBlock = true;
            codeBlockLanguage = line.slice(3).trim() || undefined;
            codeBlockContent = '';
          } else {
            // End of code block
            inCodeBlock = false;
            docChildren.push(processCodeBlock(codeBlockContent.trim(), codeBlockLanguage, style));
            codeBlockContent = '';
            codeBlockLanguage = undefined;
          }
          continue;
        }

        if (inCodeBlock) {
          codeBlockContent += (codeBlockContent ? '\n' : '') + line;
          continue;
        }

        // Process headings
        if (line.startsWith('#')) {
          const match = line.match(/^#+/);
          if (match) {
            const level = match[0].length;
            if (level >= 1 && level <= 5) {
              if (inList) {
                docChildren.push(...listItems);
                listItems = [];
                inList = false;
              }
              docChildren.push(processHeading(line, headingConfigs[level], style, documentType));
              continue;
            }
            // Graceful degradation for unsupported heading levels
            console.warn(
              `Warning: Heading level ${level} is not supported. Converting to regular paragraph.`
            );
          }
        }

        // Handle tables
        if (line.startsWith('|') && line.endsWith('|')) {
          if (i + 1 < lines.length && lines[i + 1].includes('|-')) {
            if (inList) {
              docChildren.push(...listItems);
              listItems = [];
              inList = false;
            }

            if (tableIndex < tables.length) {
              try {
                docChildren.push(processTable(tables[tableIndex], documentType));
                const tableRowCount = 2 + tables[tableIndex].rows.length;
                i += tableRowCount - 1;
                tableIndex++;
                continue;
              } catch (error) {
                console.warn(
                  `Warning: Failed to process table at line ${i + 1}. Converting to regular text.`
                );
                // Fallback to regular text
                docChildren.push(
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: line.replace(/\|/g, '').trim(),
                        color: '000000'
                      })
                    ]
                  })
                );
                continue;
              }
            }
          }
        }

        // Handle lists
        if (line.startsWith('- ') || line.startsWith('* ')) {
          inList = true;
          const listText = line.replace(/^[\s-*]+/, '').trim();

          // Check if there's a bold section on the next line
          let boldText = '';
          if (i + 1 < lines.length && lines[i + 1].trim().startsWith('**')) {
            boldText = lines[i + 1].trim().replace(/\*\*/g, '');
            i++;
          }

          listItems.push(processListItem({ text: listText, boldText }, style));
          continue;
        }

        // Handle numbered lists
        if (/^\s*\d+\.\s/.test(line)) {
          inList = true;
          const listText = line.replace(/^\s*\d+\.\s/, '').trim();
          listItems.push(processListItem({ text: listText, isNumbered: true }, style));
          continue;
        }

        // Handle blockquotes
        if (line.startsWith('> ')) {
          if (inList) {
            docChildren.push(...listItems);
            listItems = [];
            inList = false;
          }
          const quoteText = line.replace(/^>\s*/, '').trim();
          docChildren.push(processBlockquote(quoteText, style));
          continue;
        }

        // Handle comments
        if (line.startsWith('COMMENT:')) {
          if (inList) {
            docChildren.push(...listItems);
            listItems = [];
            inList = false;
          }
          const commentText = line.replace(/^COMMENT:\s*/, '').trim();
          docChildren.push(processComment(commentText, style));
          continue;
        }

        // Handle images
        const imageMatch = line.match(/!\[([^\]]*)\]\(([^)]+)\)/);
        if (imageMatch) {
          const [, altText, imageUrl] = imageMatch;

          // Process images synchronously to ensure they're fully loaded
          try {
            const imageParagraphs = await processImage(altText, imageUrl, style);
            docChildren.push(...imageParagraphs);
          } catch (error) {
            console.error(
              `Error in image processing: ${error instanceof Error ? error.message : String(error)}`
            );
            docChildren.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: `[Image could not be loaded: ${altText}]`,
                    italics: true,
                    color: 'FF0000'
                  })
                ],
                alignment: AlignmentType.CENTER
              })
            );
          }
          continue;
        }

        // Handle links - make sure this is after image handling
        const linkMatch = line.match(/^(?!.*!\[).*\[([^\]]+)\]\(([^)]+)\)/);
        if (linkMatch) {
          const [, text, url] = linkMatch;
          docChildren.push(processLinkParagraph(text, url, style));
          continue;
        }

        // Regular paragraph text with special formatting
        if (!inList) {
          try {
            docChildren.push(
              new Paragraph({
                children: processFormattedText(line),
                spacing: {
                  before: style.paragraphSpacing,
                  after: style.paragraphSpacing,
                  line: style.lineSpacing * 240
                }
              })
            );
          } catch (error) {
            // Fallback to plain text if formatting fails
            console.warn(
              `Warning: Failed to process text formatting at line ${i + 1}. Using plain text.`
            );
            docChildren.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: line,
                    color: '000000'
                  })
                ],
                spacing: {
                  before: style.paragraphSpacing,
                  after: style.paragraphSpacing,
                  line: style.lineSpacing * 240
                }
              })
            );
          }
        }
      } catch (error) {
        // Log error and continue with next line
        console.warn(
          `Warning: Failed to process line ${i + 1}: ${
            error instanceof Error ? error.message : 'Unknown error'
          }. Skipping line.`
        );
        continue;
      }
    }

    // Handle any remaining code block
    if (inCodeBlock && codeBlockContent) {
      docChildren.push(processCodeBlock(codeBlockContent.trim(), codeBlockLanguage, style));
    }

    // Add any remaining list items
    if (inList && listItems.length > 0) {
      docChildren.push(...listItems);
    }

    // Create the document with appropriate settings
    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 1440,
                right: 1080,
                bottom: 1440,
                left: 1080
              },
              size: {
                orientation: PageOrientation.PORTRAIT
              }
            }
          },
          children: docChildren
        }
      ],
      styles: {
        paragraphStyles: [
          {
            id: 'Title',
            name: 'Title',
            basedOn: 'Normal',
            next: 'Normal',
            quickFormat: true,
            run: {
              size: style.titleSize,
              bold: true,
              color: '000000'
            },
            paragraph: {
              spacing: {
                after: 240,
                line: 1.15 * 240
              },
              alignment: AlignmentType.CENTER
            }
          },
          {
            id: 'Heading1',
            name: 'Heading 1',
            basedOn: 'Normal',
            next: 'Normal',
            quickFormat: true,
            run: {
              size: 32,
              bold: true,
              color: '000000'
            },
            paragraph: {
              spacing: {
                before: 360,
                after: 240
              },
              outlineLevel: 1
            }
          },
          {
            id: 'Heading2',
            name: 'Heading 2',
            basedOn: 'Normal',
            next: 'Normal',
            quickFormat: true,
            run: {
              size: 28,
              bold: true,
              color: '000000'
            },
            paragraph: {
              spacing: {
                before: 320,
                after: 160
              },
              outlineLevel: 2
            }
          },
          {
            id: 'Heading3',
            name: 'Heading 3',
            basedOn: 'Normal',
            next: 'Normal',
            quickFormat: true,
            run: {
              size: 24,
              bold: true,
              color: '000000'
            },
            paragraph: {
              spacing: {
                before: 280,
                after: 120
              },
              outlineLevel: 3
            }
          },
          {
            id: 'Heading4',
            name: 'Heading 4',
            basedOn: 'Normal',
            next: 'Normal',
            quickFormat: true,
            run: {
              size: 20,
              bold: true,
              color: '000000'
            },
            paragraph: {
              spacing: {
                before: 240,
                after: 120
              },
              outlineLevel: 4
            }
          },
          {
            id: 'Heading5',
            name: 'Heading 5',
            basedOn: 'Normal',
            next: 'Normal',
            quickFormat: true,
            run: {
              size: 18,
              bold: true,
              color: '000000'
            },
            paragraph: {
              spacing: {
                before: 220,
                after: 100
              },
              outlineLevel: 5
            }
          },
          {
            id: 'Strong',
            name: 'Strong',
            run: {
              bold: true
            }
          }
        ]
      }
    });

    return await Packer.toBlob(doc);
  } catch (error) {
    if (error instanceof MarkdownConversionError) {
      throw error;
    }
    throw new MarkdownConversionError(
      `Failed to convert markdown to docx: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
      { originalError: error }
    );
  }
}
