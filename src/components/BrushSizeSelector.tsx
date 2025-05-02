import React from 'react';
import { useDrawingContext } from '../context/DrawingContext';

const BrushSizeSelector: React.FC = () => {
  const { brushSize, setBrushSize } = useDrawingContext();
  
  const brushSizes = [2, 5, 10, 15, 20];

  return (
    <div className="flex items-center gap-1">
      {brushSizes.map((size) => (
        <button
          key={size}
          onClick={() => setBrushSize(size)}
          className={`flex items-center justify-center w-6 h-6 rounded hover:bg-gray-100 transition-colors duration-150 ${
            brushSize === size ? 'bg-blue-100' : ''
          }`}
          aria-label={`Set brush size to ${size}px`}
          title={`${size}px`}
        >
          <div 
            className="rounded-full bg-black"
            style={{ 
              width: Math.min(size, 16), 
              height: Math.min(size, 16) 
            }}
          />
        </button>
      ))}
    </div>
  );
};

export default BrushSizeSelector;