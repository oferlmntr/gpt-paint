import React from 'react';
import { Trash2, Download, Copy, Plane as PaperPlane, Paintbrush, Eraser, Upload } from 'lucide-react';
import { useDrawingContext } from '../context/DrawingContext';
import ColorPicker from './ColorPicker';
import BrushSizeSelector from './BrushSizeSelector';
import { downloadCanvas, copyCanvasToClipboard, sendToChat } from '../utils/canvasUtils';

const Toolbar: React.FC = () => {
  const { 
    canvasRef, 
    clearCanvas, 
    setStatusMessage,
    drawMode,
    setDrawMode
  } = useDrawingContext();

  const handleClear = () => {
    clearCanvas();
    setStatusMessage('Canvas cleared');
    setTimeout(() => setStatusMessage(''), 2000);
  };

  const handleDownload = () => {
    if (canvasRef.current) {
      downloadCanvas(canvasRef.current);
      setStatusMessage('Image downloaded');
      setTimeout(() => setStatusMessage(''), 2000);
    }
  };

  const handleCopy = async () => {
    if (canvasRef.current) {
      setStatusMessage('Copying to clipboard...');
      try {
        await copyCanvasToClipboard(canvasRef.current);
        setStatusMessage('Copied to clipboard');
      } catch (error) {
        setStatusMessage('Failed to copy to clipboard');
        console.error(error);
      }
      setTimeout(() => setStatusMessage(''), 2000);
    }
  };

  const handleSend = async () => {
    if (canvasRef.current) {
      setStatusMessage('Sending to ChatGPT...');
      try {
        await sendToChat(canvasRef.current);
        setStatusMessage('Sent to ChatGPT');
      } catch (error) {
        setStatusMessage('Failed to send to ChatGPT');
        console.error(error);
      }
      setTimeout(() => setStatusMessage(''), 2000);
    }
  };

  const handleUpload = () => {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  return (
    <div className="p-3 border-t border-gray-200 bg-gray-50">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDrawMode('brush')}
            className={`p-2 rounded ${
              drawMode === 'brush' 
                ? 'bg-blue-100 text-blue-600' 
                : 'hover:bg-gray-100 text-gray-700'
            } transition-colors duration-150`}
            aria-label="Brush tool"
            title="Brush"
          >
            <Paintbrush size={18} />
          </button>
          <button
            onClick={() => setDrawMode('eraser')}
            className={`p-2 rounded ${
              drawMode === 'eraser' 
                ? 'bg-blue-100 text-blue-600' 
                : 'hover:bg-gray-100 text-gray-700'
            } transition-colors duration-150`}
            aria-label="Eraser tool"
            title="Eraser"
          >
            <Eraser size={18} />
          </button>
          <button
            onClick={handleUpload}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors duration-150"
            aria-label="Upload image"
            title="Upload image"
          >
            <Upload size={18} />
          </button>
        </div>

        <div className="flex-1">
          <ColorPicker />
        </div>

        <BrushSizeSelector />

        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={handleClear}
            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors duration-150"
            aria-label="Clear canvas"
            title="Clear canvas"
          >
            <Trash2 size={18} />
          </button>
          <button
            onClick={handleCopy}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors duration-150"
            aria-label="Copy to clipboard"
            title="Copy to clipboard"
          >
            <Copy size={18} />
          </button>
          <button
            onClick={handleDownload}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors duration-150"
            aria-label="Download drawing"
            title="Download drawing"
          >
            <Download size={18} />
          </button>
          <button
            onClick={handleSend}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors duration-150"
            aria-label="Send to ChatGPT"
            title="Send to ChatGPT"
          >
            <PaperPlane size={18} />
          </button>
        </div>
      </div>
      <StatusMessage />
    </div>
  );
};

const StatusMessage: React.FC = () => {
  const { statusMessage } = useDrawingContext();
  
  if (!statusMessage) return null;
  
  return (
    <div className="mt-2 text-center">
      <p className="text-xs text-gray-600 animate-fadeIn">{statusMessage}</p>
    </div>
  );
};

export default Toolbar;