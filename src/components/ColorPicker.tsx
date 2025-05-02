import React from 'react';
import { useDrawingContext } from '../context/DrawingContext';

const ColorPicker: React.FC = () => {
  const { brushColor, setBrushColor, drawMode } = useDrawingContext();
  
  const colors = [
    '#000000', // Black
    '#ffffff', // White
    '#ff0000', // Red
    '#00ff00', // Green
    '#0000ff', // Blue
    '#ffff00', // Yellow
    '#ff00ff', // Magenta
    '#00ffff', // Cyan
    '#ff9900', // Orange
    '#9900ff', // Purple
  ];

  const handleColorChange = (color: string) => {
    if (drawMode === 'brush') {
      setBrushColor(color);
    }
  };

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {colors.map((color) => (
        <button
          key={color}
          onClick={() => handleColorChange(color)}
          className={`w-6 h-6 rounded-full border hover:scale-110 transition-transform duration-150 ${
            brushColor === color ? 'ring-2 ring-blue-500 ring-offset-1' : 'ring-1 ring-gray-300'
          }`}
          style={{ 
            backgroundColor: color,
            cursor: drawMode === 'eraser' ? 'not-allowed' : 'pointer',
            opacity: drawMode === 'eraser' ? 0.5 : 1
          }}
          disabled={drawMode === 'eraser'}
          aria-label={`Select ${color} color`}
        />
      ))}
    </div>
  );
};

export default ColorPicker;