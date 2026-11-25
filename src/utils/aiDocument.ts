import { Footer, Paragraph, TextRun, type IPropertiesOptions } from 'docx';
import i18n from '@/localisation/i18n';

// a word file an AI helped write says so twice: in a footer on every page for the reader, and in
// the file's properties for software (the AI Act asks generated text to be marked both ways)
export const AI_GENERATED_PROPERTIES = [
  { name: 'AIGenerated', value: 'true' },
  { name: 'AIGeneratedBy', value: 'WeLearn' }
];

export const withAiMark = (options: IPropertiesOptions): IPropertiesOptions => {
  const notice = i18n.global.t('aiNotice.document');
  const footer = new Footer({
    children: [
      new Paragraph({ children: [new TextRun({ text: notice, italics: true, size: 16 })] })
    ]
  });
  return {
    ...options,
    creator: 'WeLearn',
    description: notice,
    keywords: 'AI-generated',
    customProperties: AI_GENERATED_PROPERTIES,
    sections: options.sections.map((section) => ({ ...section, footers: { default: footer } }))
  };
};
