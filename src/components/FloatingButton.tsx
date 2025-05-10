import React from 'react';
import { Paintbrush } from 'lucide-react';

interface FloatingButtonProps {
  onClick: () => void;
}

const FloatingButton: React.FC<FloatingButtonProps> = ({ onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-all duration-200 pointer-events-auto z-50"
      aria-label="Open GPT Power-Ups"
      title="Open GPT Power-Ups"
    >
      <Paintbrush size={20} />
    </button>
  );
};

export default FloatingButton; 