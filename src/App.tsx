import { useState, useEffect } from 'react';
import PhoneLayout from './components/PhoneLayout';
import HomeScreen from './screens/HomeScreen';
import FolderScreen from './screens/FolderScreen';
import PassageScreen from './screens/PassageScreen';
import TutorScreen from './screens/TutorScreen';
import ContentHubScreen from './screens/ContentHubScreen';
import AddCodeScreen from './screens/AddCodeScreen';
import SettingsScreen from './screens/SettingsScreen';
import { useStore } from './store';
import { SAMPLE_PASSAGE } from './data/sample';

export type ScreenType = 'home' | 'folder' | 'passage' | 'tutor' | 'contentHub' | 'addCode' | 'settings';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
  const [activePassageId, setActivePassageId] = useState<string | null>(null);
  
  const folders = useStore(state => state.folders);
  const createFolder = useStore(state => state.createFolder);
  const theme = useStore(state => state.theme);
  const customThemeColors = useStore(state => state.customThemeColors);

  useEffect(() => {
    if (folders.length === 0) {
      createFolder({
        id: 'f1',
        name: 'HSC English',
        emoji: '📚',
        passages: [SAMPLE_PASSAGE as any]
      });
    }
  }, [folders, createFolder]);

  useEffect(() => {
    const root = document.documentElement;
    
    let colors = {
      primary: '#1A2F5A',
      secondary: '#3B82F6',
      accent: '#BFDBFE',
      bg: '#F0F4FF',
      cardBg: '#FFFFFF',
      text: '#1A2F5A',
      subtext: '#64748B',
      border: '#DBEAFE',
      synC: '#1A2F5A',
      synBg: '#DBEAFE',
      synBorder: '#BFDBFE',
      antC: '#991B1B',
      antBg: '#FEE2E2',
      antBorder: '#FCA5A5',
    };

    if (theme === 'dark') {
      colors = { ...colors, primary: '#6366F1', bg: '#0F0F1A', cardBg: '#1A1A2E', text: '#E2E8F0', subtext: '#94A3B8', border: '#2D2D4E', synC: '#A78BFA', synBg: '#1E1B4B', synBorder: '#4338CA', antC: '#FB7185', antBg: '#1F0F1A', antBorder: '#BE123C' };
    } else if (theme === 'minimal') {
      colors = { ...colors, primary: '#000000', bg: '#F5F5F7', cardBg: '#FFFFFF', text: '#1D1D1F', subtext: '#6E6E73', border: '#D2D2D7', synC: '#0071E3', synBg: '#EBF5FF', synBorder: '#C1D9F7', antC: '#FF3B30', antBg: '#FFF0EF', antBorder: '#FFB3AF' };
    } else if (theme === 'cyberpunk') {
      colors = { ...colors, primary: '#00FFF5', bg: '#0A0A0F', cardBg: '#13131F', text: '#00FFF5', subtext: '#7FFFF4', border: '#00FFF533', synC: '#00FFF5', synBg: '#001A1A', synBorder: '#00FFF566', antC: '#FF00A0', antBg: '#1A001A', antBorder: '#FF00A066' };
    } else if (theme === 'sakura') {
      colors = { ...colors, primary: '#BE185D', bg: '#FFF0F6', cardBg: '#FFFFFF', text: '#831843', subtext: '#9D174D', border: '#FBCFE8', synC: '#BE185D', synBg: '#FDF2F8', synBorder: '#FBCFE8', antC: '#7C3AED', antBg: '#F5F3FF', antBorder: '#DDD6FE' };
    } else if (theme === 'custom') {
      colors = { ...colors, ...customThemeColors };
    }

    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
  }, [theme, customThemeColors]);

  const navigate = (screen: ScreenType, params?: { folderId?: string, passageId?: string }) => {
    if (params?.folderId) setActiveFolderId(params.folderId);
    if (params?.passageId) setActivePassageId(params.passageId);
    setCurrentScreen(screen);
  };

  return (
    <PhoneLayout>
      {currentScreen === 'home' && <HomeScreen onNavigate={navigate} />}
      {currentScreen === 'folder' && <FolderScreen folderId={activeFolderId!} onNavigate={navigate} />}
      {currentScreen === 'passage' && <PassageScreen folderId={activeFolderId!} passageId={activePassageId!} onNavigate={navigate} />}
      {currentScreen === 'tutor' && <TutorScreen folderId={activeFolderId!} passageId={activePassageId!} onNavigate={navigate} />}
      {currentScreen === 'contentHub' && <ContentHubScreen folderId={activeFolderId!} passageId={activePassageId!} onNavigate={navigate} />}
      {currentScreen === 'addCode' && <AddCodeScreen onNavigate={navigate} />}
      {currentScreen === 'settings' && <SettingsScreen onNavigate={navigate} />}
    </PhoneLayout>
  );
}
