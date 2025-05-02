import React, { useState, useRef, useEffect } from 'react';
import { X, Minimize2, ChevronUp, Move } from 'lucide-react';
import Canvas from './Canvas';
import Toolbar from './Toolbar';
import { useDrawingContext } from '../context/DrawingContext';
import { useDraggable } from '../hooks/useDraggable';
import { useResizable } from '../hooks/useResizable';

interface DrawingPanelProps {
  onClose: () => void;
}

const DrawingPanel: React.FC<DrawingPanelProps> = ({ onClose }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const resizeHandleRef = useRef<HTMLDivElement>(null);
  const { canvasRef, clearCanvas } = useDrawingContext();
  
  const { position } = useDraggable(panelRef, headerRef);
  const { size } = useResizable(panelRef, resizeHandleRef);

  useEffect(() => {
    // Initialize position in the center of the screen
    if (panelRef.current && position.x === 0 && position.y === 0) {
      const initialX = (window.innerWidth - panelRef.current.offsetWidth) / 2;
      const initialY = (window.innerHeight - panelRef.current.offsetHeight) / 2;
      panelRef.current.style.transform = `translate(${initialX}px, ${initialY}px)`;
    }
  }, [position]);

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <>
      {/* Semi-transparent overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 pointer-events-auto"
        onClick={onClose}
      />
      
      <div 
        ref={panelRef}
        className={`absolute bg-white bg-opacity-95 rounded-lg shadow-xl pointer-events-auto border border-gray-200 transition-all duration-300 transform`}
        style={{
          width: isMinimized ? 'auto' : '80vw',
          height: isMinimized ? 'auto' : '80vh',
          maxWidth: '1600px',
          maxHeight: '1000px',
          overflow: 'hidden',
        }}
      >
        <div 
          ref={headerRef}
          className="flex items-center justify-between p-3 bg-gray-100 rounded-t-lg cursor-move border-b border-gray-200"
        >
          <div className="flex items-center gap-2">
            <Move size={16} className="text-gray-500" />
            <span className="text-sm font-medium">Drawing Tool</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={toggleMinimize}
              className="p-1.5 rounded hover:bg-gray-200 transition-colors duration-200"
              aria-label={isMinimized ? "Expand" : "Minimize"}
            >
              <Minimize2 size={16} className="text-gray-600" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded hover:bg-gray-200 transition-colors duration-200"
              aria-label="Close"
            >
              <X size={16} className="text-gray-600" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            <div className="p-4 flex-grow" style={{ height: 'calc(100% - 110px)' }}>
              <Canvas />
            </div>
            <Toolbar />
            <div 
              ref={resizeHandleRef}
              className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize"
              style={{
                backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.2) 1px, transparent 1px)',
                backgroundSize: '3px 3px',
                backgroundPosition: 'bottom right',
                backgroundRepeat: 'no-repeat',
                padding: '8px'
              }}
            />
          </>
        )}
      </div>
    </>
  );
};

export default DrawingPanel;