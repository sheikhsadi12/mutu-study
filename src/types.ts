export interface Word {
  id: string;
  word: string;
  type: 'syn' | 'ant';
  pos: string;
  bn: string;
  pron?: string;
  exEn?: string;
  exBn?: string;
  items: [string, string, string][]; // [en, pron, bn]
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface SavedContent {
  id: string;
  type: 'quiz' | 'summary' | 'flashcard' | 'mindmap' | 'audio';
  label: string;
  content: any; // JSON data for the content
  date: number;
}

export interface Passage {
  id: string;
  passageNo: string;
  board: string;
  year: string;
  en: string;
  bn: string;
  words: Word[];
  chatHistory: ChatMessage[];
  savedContent: SavedContent[];
}

export type FolderVisualTheme = 'classic' | 'glass' | 'minimal' | 'color-card' | 'book-style';

export interface Folder {
  id: string;
  name: string;
  emoji: string;
  color?: string;
  visualTheme?: FolderVisualTheme;
  gradient?: string;
  passages: Passage[];
}

export type Theme = 'blue' | 'dark' | 'minimal' | 'cyberpunk' | 'sakura' | 'custom';
export type FontSize = 'sm' | 'base' | 'lg' | 'xl';
export type LineSpacing = 'normal' | 'relaxed' | 'loose';

export interface CustomThemeColors {
  primary?: string;
  secondary?: string;
  accent?: string;
  bg?: string;
  cardBg?: string;
  text?: string;
  subtext?: string;
  border?: string;
  synC?: string;
  synBg?: string;
  synBorder?: string;
  antC?: string;
  antBg?: string;
  antBorder?: string;
}
