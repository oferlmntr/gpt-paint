import React, { useState, useEffect } from 'react';
import DrawingPanel from './components/DrawingPanel';
import FloatingButton from './components/FloatingButton';

// Define interface for extension message structure
interface ExtensionMessage {
  action: string;
  [key: string]: unknown; // Allow additional properties
}

function App() {
  const [isDrawingPanelVisible, setIsDrawingPanelVisible] = useState(false);

  const toggleDrawingPanel = () => {
    setIsDrawingPanelVisible(!isDrawingPanelVisible);
  };

  // Handle extension messages (for Chrome extension only)
  useEffect(() => {
    // Check if we're in a browser extension environment
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
      const messageListener = (message: ExtensionMessage) => {
        if (message.action === 'OPEN_DRAWING_TOOL') {
          setIsDrawingPanelVisible(true);
        }
      };
      
      chrome.runtime.onMessage.addListener(messageListener);
      
      return () => {
        chrome.runtime.onMessage.removeListener(messageListener);
      };
    }
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-50">
      {isDrawingPanelVisible ? (
        <DrawingPanel onClose={() => setIsDrawingPanelVisible(false)} />
      ) : (
        <FloatingButton onClick={toggleDrawingPanel} />
      )}
    </div>
  );
}

export default App;