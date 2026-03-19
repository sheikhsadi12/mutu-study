import React from 'react';
import { ScreenType } from '../App';

interface TutorScreenProps {
  folderId: string;
  passageId: string;
  onNavigate: (screen: ScreenType, params?: { folderId?: string; passageId?: string }) => void;
}

export default function TutorScreen({ folderId, passageId, onNavigate }: TutorScreenProps) {
  return (
    <div className="p-4">
      <button onClick={() => onNavigate('passage', { folderId, passageId })} className="mb-4 text-blue-500">
        &larr; Back to Passage
      </button>
      <h1 className="text-2xl font-bold mb-4">AI Tutor</h1>
      <p>Tutor for passage {passageId} in folder {folderId}</p>
    </div>
  );
}
