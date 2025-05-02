import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { DrawingProvider } from './context/DrawingContext';

// This file is for the standalone app and will not be used in the extension
// See contentScript.tsx for the extension entry point

// Create a new div for our app
const appRoot = document.createElement('div');
appRoot.id = 'chatgpt-drawing-tool-root';
document.body.appendChild(appRoot);

createRoot(appRoot).render(
  <StrictMode>
    <DrawingProvider>
      <App />
    </DrawingProvider>
  </StrictMode>
);