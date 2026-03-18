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
  const isDarkMode = useStore(state => state.isDarkMode);
  const fontFamily = useStore(state => state.fontFamily);
  const customThemeColors = useStore(state => state.customThemeColors);

  useEffect(() => {
    if (folders.length === 0) {
      createFolder({
        id: 'f1',
        name: 'HSC English',
        emoji: 'Book',
        passages: [SAMPLE_PASSAGE as any]
      });
    }
  }, [folders, createFolder]);

  useEffect(() => {
    const root = document.documentElement;
    
    // Base colors (Light Mode)
    let colors = {
      'primary': '#1A2F5A',
      'secondary': '#3B82F6',
      'accent': '#BFDBFE',
      'bg-main': '#F5F5F7',
      'bg-card': '#FFFFFF',
      'text-main': '#1D1D1F',
      'text-sub': '#6E6E73',
      'border': '#E5E5EA',
      'syn-bg': '#DBEAFE',
      'syn-text': '#1A2F5A',
      'syn-border': '#BFDBFE',
      'ant-bg': '#FEE2E2',
      'ant-text': '#991B1B',
      'ant-border': '#FCA5A5',
    };

    // Apply Dark Mode Backgrounds
    if (isDarkMode) {
      colors = { 
        ...colors, 
        'bg-main': '#000000', 
        'bg-card': '#1C1C1E', 
        'text-main': '#F5F5F7', 
        'text-sub': '#86868B', 
        'border': '#38383A', 
        'syn-bg': '#1E1B4B', 
        'ant-bg': '#1F0F1A' 
      };
    }

    // Apply Theme (Accent Colors)
    if (theme === 'blue') {
      colors['primary'] = isDarkMode ? '#6366F1' : '#1A2F5A';
      colors['syn-text'] = isDarkMode ? '#A78BFA' : '#1A2F5A';
      colors['syn-border'] = isDarkMode ? '#4338CA' : '#BFDBFE';
      colors['ant-text'] = isDarkMode ? '#FB7185' : '#991B1B';
      colors['ant-border'] = isDarkMode ? '#BE123C' : '#FCA5A5';
    } else if (theme === 'minimal') {
      colors['primary'] = isDarkMode ? '#FFFFFF' : '#000000';
      colors['syn-text'] = isDarkMode ? '#60A5FA' : '#0071E3';
      colors['syn-border'] = isDarkMode ? '#2563EB' : '#C1D9F7';
      colors['ant-text'] = isDarkMode ? '#F87171' : '#FF3B30';
      colors['ant-border'] = isDarkMode ? '#DC2626' : '#FFB3AF';
    } else if (theme === 'cyberpunk') {
      colors['primary'] = '#00FFF5';
      colors['syn-text'] = '#00FFF5';
      colors['syn-border'] = '#00FFF566';
      colors['ant-text'] = '#FF00A0';
      colors['ant-border'] = '#FF00A066';
    } else if (theme === 'sakura') {
      colors['primary'] = '#BE185D';
      colors['syn-text'] = '#BE185D';
      colors['syn-border'] = '#FBCFE8';
      colors['ant-text'] = '#7C3AED';
      colors['ant-border'] = '#DDD6FE';
    } else if (theme === 'custom') {
      colors = { ...colors, ...customThemeColors };
    }

    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
    
    // Apply Font Family
    root.style.setProperty('--font-family', `"${fontFamily}", sans-serif`);
    root.style.fontFamily = `"${fontFamily}", sans-serif`;
  }, [theme, isDarkMode, fontFamily, customThemeColors]);

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
