import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Folder, Passage, Theme, ChatMessage, SavedContent } from './types';

interface AppState {
  folders: Folder[];
  theme: Theme;
  customThemeColors: Record<string, string>;
  addPassageToFolder: (folderId: string, passage: Passage) => void;
  createFolder: (folder: Folder) => void;
  updateChatHistory: (folderId: string, passageId: string, message: ChatMessage) => void;
  saveContent: (folderId: string, passageId: string, content: SavedContent) => void;
  setTheme: (theme: Theme) => void;
  setCustomThemeColors: (colors: Record<string, string>) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      folders: [],
      theme: 'blue',
      customThemeColors: {},
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
      setCustomThemeColors: (colors) => set({ customThemeColors: colors }),
    }),
    {
      name: 'mutu-study-storage',
    }
  )
);
