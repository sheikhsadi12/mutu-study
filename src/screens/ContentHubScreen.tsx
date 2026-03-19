import React from 'react';
import { ScreenType } from '../App';

interface ContentHubScreenProps {
  folderId: string;
  passageId: string;
  onNavigate: (screen: ScreenType, params?: { folderId?: string; passageId?: string }) => void;
}

export default function ContentHubScreen({ folderId, passageId, onNavigate }: ContentHubScreenProps) {
  return (
    <div className="p-4">
      <button onClick={() => onNavigate('passage', { folderId, passageId })} className="mb-4 text-blue-500">
        &larr; Back to Passage
      </button>
      <h1 className="text-2xl font-bold mb-4">Content Hub</h1>
      <p>Content Hub for passage {passageId} in folder {folderId}</p>
    </div>
  );
}
