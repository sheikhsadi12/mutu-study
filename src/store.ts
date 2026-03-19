import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Folder, Passage, Theme, ChatMessage, SavedContent, FontSize, LineSpacing } from './types';

interface AppState {
  folders: Folder[];
  theme: Theme;
  isDarkMode: boolean;
  fontFamily: string;
  customFontName: string | null;
  customFontData: string | null;
  customThemeColors: Record<string, string>;
  fontSize: FontSize;
  lineSpacing: LineSpacing;
  addPassageToFolder: (folderId: string, passage: Passage) => void;
  createFolder: (folder: Folder) => void;
  updateFolder: (folderId: string, updates: Partial<Folder>) => void;
  deleteFolder: (folderId: string) => void;
  updateChatHistory: (folderId: string, passageId: string, message: ChatMessage) => void;
  saveContent: (folderId: string, passageId: string, content: SavedContent) => void;
  setTheme: (theme: Theme) => void;
  setIsDarkMode: (isDark: boolean) => void;
  setFontFamily: (font: string) => void;
  setCustomFont: (name: string, data: string) => void;
  setCustomThemeColors: (colors: Record<string, string>) => void;
  setFontSize: (size: FontSize) => void;
  setLineSpacing: (spacing: LineSpacing) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      folders: [],
      theme: 'blue',
      isDarkMode: false,
      fontFamily: 'Inter',
      customFontName: null,
      customFontData: null,
      customThemeColors: {},
      fontSize: 'sm',
      lineSpacing: 'relaxed',
      addPassageToFolder: (folderId, passage) =>
        set((state) => ({
          folders: state.folders.map((f) => {
            if (f.id === folderId) {
              if (f.passages.some(p => p.id === passage.id)) return f;
              return { ...f, passages: [...f.passages, passage] };
            }
            return f;
          }),
        })),
      createFolder: (folder) =>
        set((state) => {
          if (state.folders.some(f => f.id === folder.id)) return state;
          return { folders: [...state.folders, folder] };
        }),
      updateFolder: (folderId, updates) =>
        set((state) => ({
          folders: state.folders.map((f) =>
            f.id === folderId ? { ...f, ...updates } : f
          ),
        })),
      deleteFolder: (folderId) =>
        set((state) => ({
          folders: state.folders.filter((f) => f.id !== folderId),
        })),
      updateChatHistory: (folderId, passageId, message) =>
        set((state) => ({
          folders: state.folders.map((f) =>
            f.id === folderId
              ? {
                  ...f,
                  passages: f.passages.map((p) =>
                    p.id === passageId
                      ? { ...p, chatHistory: [...(p.chatHistory || []), message] }
                      : p
                  ),
                }
              : f
          ),
        })),
      saveContent: (folderId, passageId, content) =>
        set((state) => ({
          folders: state.folders.map((f) =>
            f.id === folderId
              ? {
                  ...f,
                  passages: f.passages.map((p) =>
                    p.id === passageId
                      ? { ...p, savedContent: [...(p.savedContent || []), content] }
                      : p
                  ),
                }
              : f
          ),
        })),
      setTheme: (theme) => set({ theme }),
      setIsDarkMode: (isDark) => set({ isDarkMode: isDark }),
      setFontFamily: (font) => set({ fontFamily: font }),
      setCustomFont: (name, data) => set({ customFontName: name, customFontData: data, fontFamily: 'Custom' }),
      setCustomThemeColors: (colors) => set({ customThemeColors: colors }),
      setFontSize: (size) => set({ fontSize: size }),
      setLineSpacing: (spacing) => set({ lineSpacing: spacing }),
    }),
    {
      name: 'mutu-study-storage',
    }
  )
);
