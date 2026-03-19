import React from 'react';
import { ScreenType } from '../App';

interface AddCodeScreenProps {
  onNavigate: (screen: ScreenType, params?: { folderId?: string; passageId?: string }) => void;
}

export default function AddCodeScreen({ onNavigate }: AddCodeScreenProps) {
  return (
    <div className="p-4">
      <button onClick={() => onNavigate('home')} className="mb-4 text-blue-500">
        &larr; Back Home
      </button>
      <h1 className="text-2xl font-bold mb-4">Add Code</h1>
      <p>Enter a code to join a class or add content.</p>
    </div>
  );
}
