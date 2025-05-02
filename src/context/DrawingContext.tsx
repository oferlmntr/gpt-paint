import React, { createContext, useContext, useState, useRef, ReactNode } from 'react';

type DrawMode = 'brush' | 'eraser';

interface DrawingContextType {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  brushColor: string;
  setBrushColor: (color: string) => void;
  brushSize: number;
  setBrushSize: (size: number) => void;
  isDrawing: boolean;
  setIsDrawing: (isDrawing: boolean) => void;
  clearCanvas: () => void;
  statusMessage: string;
  setStatusMessage: (message: string) => void;
  drawMode: DrawMode;
  setDrawMode: (mode: DrawMode) => void;
}

const DrawingContext = createContext<DrawingContextType | undefined>(undefined);

export const DrawingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [brushColor, setBrushColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [isDrawing, setIsDrawing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [drawMode, setDrawMode] = useState<DrawMode>('brush');

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const value = {
    canvasRef,
    brushColor,
    setBrushColor,
    brushSize,
    setBrushSize,
    isDrawing,
    setIsDrawing,
    clearCanvas,
    statusMessage,
    setStatusMessage,
    drawMode,
    setDrawMode,
  };

  return (
    <DrawingContext.Provider value={value}>
      {children}
    </DrawingContext.Provider>
  );
};

export const useDrawingContext = (): DrawingContextType => {
  const context = useContext(DrawingContext);
  if (context === undefined) {
    throw new Error('useDrawingContext must be used within a DrawingProvider');
  }
  return context;
};