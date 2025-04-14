export { Paragraph, Table } from 'docx';

export interface Style {
  titleSize: number;
  headingSpacing: number;
  paragraphSpacing: number;
  lineSpacing: number;
}

export interface Options {
  documentType?: 'document' | 'report';
  style?: Style;
}

export interface TableData {
  headers: string[];
  rows: string[][];
}

export interface ProcessedContent {
  children: any[];
  skipLines: number;
}

export interface HeadingConfig {
  level: number;
  size: number;
  style?: string;
  alignment?: any;
}

export interface ListItemConfig {
  text: string;
  boldText?: string;
  isNumbered?: boolean;
}

export const defaultStyle: Style = {
  titleSize: 32,
  headingSpacing: 240,
  paragraphSpacing: 240,
  lineSpacing: 1.15
};

export const headingConfigs: Record<number, HeadingConfig> = {
  1: { level: 1, size: 32, style: 'Title', alignment: 'CENTER' },
  2: { level: 2, size: 28, style: 'Heading2' },
  3: { level: 3, size: 24 },
  4: { level: 4, size: 20 },
  5: { level: 5, size: 18 }
};
