// Import the extension CSS
import './extension.css';

// Simple popup script without React
document.addEventListener('DOMContentLoaded', () => {
  console.log('[ChatGPT Drawing Tool] Popup loaded');
  
  const openButton = document.createElement('button');
  openButton.textContent = 'Open Drawing Tool';
  openButton.className = 'popup-open-button';
  openButton.style.cssText = 'width: 100%; background-color: #3b82f6; color: white; padding: 8px 16px; border-radius: 4px; transition: all 0.2s; cursor: pointer; margin-bottom: 16px; border: none; font-weight: 500;';
  
  // When clicked, send message to content script
  openButton.addEventListener('click', () => {
    console.log('[ChatGPT Drawing Tool] Open button clicked');
    
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      console.log('[ChatGPT Drawing Tool] Active tab:', tabs[0]?.url);
      
      if (tabs[0]?.id) {
        console.log('[ChatGPT Drawing Tool] Sending message to tab:', tabs[0].id);
        
        try {
          chrome.tabs.sendMessage(tabs[0].id, { action: 'OPEN_DRAWING_TOOL' }, (response) => {
            if (chrome.runtime.lastError) {
              console.error('[ChatGPT Drawing Tool] Error sending message:', chrome.runtime.lastError);
            } else {
              console.log('[ChatGPT Drawing Tool] Message sent successfully, response:', response);
            }
            window.close(); // Close the popup
          });
        } catch (error) {
          console.error('[ChatGPT Drawing Tool] Error sending message:', error);
          window.close();
        }
      } else {
        console.error('[ChatGPT Drawing Tool] No active tab ID found');
        window.close();
      }
    });
  });
  
  // Create container
  const container = document.createElement('div');
  container.className = 'popup-container';
  container.style.cssText = 'padding: 16px; width: 256px; text-align: center; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;';
  
  // Add heading
  const heading = document.createElement('h1');
  heading.textContent = 'ChatGPT Drawing Tool';
  heading.className = 'popup-heading';
  heading.style.cssText = 'font-size: 1.125rem; font-weight: 600; margin-bottom: 16px; color: #111827;';
  
  // Add description
  const description = document.createElement('p');
  description.textContent = 'Click the brush icon on the bottom right corner of ChatGPT to open the drawing tool.';
  description.className = 'popup-description';
  description.style.cssText = 'font-size: 0.75rem; color: #6b7280; margin-top: 16px;';
  
  // Add version info for debugging
  const version = document.createElement('p');
  version.textContent = `v${chrome.runtime.getManifest().version || '1.0.0'} (${new Date().toISOString().split('T')[0]})`;
  version.className = 'popup-version';
  version.style.cssText = 'font-size: 0.7rem; color: #9ca3af; margin-top: 8px;';
  
  // Assemble the popup
  container.appendChild(heading);
  container.appendChild(openButton);
  container.appendChild(description);
  container.appendChild(version);
  
  // Add to page
  const root = document.getElementById('chatgpt-drawing-tool-popup-root');
  if (root) {
    console.log('[ChatGPT Drawing Tool] Found root element, appending popup content');
    root.appendChild(container);
  } else {
    console.warn('[ChatGPT Drawing Tool] Root element not found, appending to body');
    document.body.appendChild(container);
  }
}); 