// Import the extension CSS
import './extension.css';

// Immediately invoked function to avoid global scope pollution
(function() {
  console.log('[ChatGPT Drawing Tool] Content script loaded!');
  
  // Check if we're on a ChatGPT page
  if (window.location.href.includes('chat.openai.com') || window.location.href.includes('chatgpt.com')) {
    console.log('[ChatGPT Drawing Tool] ChatGPT page detected, initializing drawing tool...');
    
    // Create a new div for our app
    const appRoot = document.createElement('div');
    appRoot.id = 'chatgpt-drawing-tool-root';
    document.body.appendChild(appRoot);

    // Load CSS manually (as a fallback)
    const loadCSS = (href: string) => {
      return new Promise<void>((resolve, reject) => {
        // Check if CSS is already loaded
        if (document.querySelector(`link[href="${href}"]`)) {
          console.log(`[ChatGPT Drawing Tool] CSS already loaded: ${href}`);
          resolve();
          return;
        }

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.onload = () => {
          console.log(`[ChatGPT Drawing Tool] CSS loaded successfully: ${href}`);
          resolve();
        };
        link.onerror = () => {
          console.error(`[ChatGPT Drawing Tool] Failed to load CSS: ${href}`);
          reject(new Error(`Failed to load CSS: ${href}`));
        };
        document.head.appendChild(link);
      });
    };

    // Inject the button
    const injectFloatingButton = () => {
      console.log('[ChatGPT Drawing Tool] Injecting floating button...');
      const button = document.createElement('button');
      button.id = 'chatgpt-drawing-tool-button';
      button.className = 'chatgpt-drawing-tool-button';
      button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18.37 2.63 14 7l-1.74-1.74a1 1 0 0 0-1.42 0L2.63 13.47a1 1 0 0 0 0 1.42L7 19.25l.8.8a1 1 0 0 0 1.42 0l8.2-8.2a1 1 0 0 0 0-1.42L16 9l4.37-4.37a1 1 0 0 0-1.42-1.42 1 1 0 0 0-.58.28Z"/></svg>';
      button.title = 'Open drawing tool';
      document.body.appendChild(button);

      // Inject RTL button if possible
      injectRTLButton();

      // Toggle panel when clicked
      button.addEventListener('click', () => {
        console.log('[ChatGPT Drawing Tool] Button clicked');
        const existing = document.getElementById('chatgpt-drawing-panel');
        if (existing) {
          console.log('[ChatGPT Drawing Tool] Closing existing panel');
          existing.remove();
          // Show the button again
          const floatingButton = document.getElementById('chatgpt-drawing-tool-button');
          if (floatingButton) {
            floatingButton.style.display = 'flex';
          } else {
            // If button was removed, recreate it
            injectFloatingButton();
          }
        } else {
          console.log('[ChatGPT Drawing Tool] Opening drawing panel');
          // Hide the button completely by removing it
          button.remove();
          injectDrawingPanel();
        }
      });

      // Listen for messages from popup
      if (chrome?.runtime?.onMessage) {
        console.log('[ChatGPT Drawing Tool] Setting up message listener');
        chrome.runtime.onMessage.addListener((message) => {
          console.log('[ChatGPT Drawing Tool] Received message:', message);
          if (message.action === 'OPEN_DRAWING_TOOL') {
            const existing = document.getElementById('chatgpt-drawing-panel');
            if (!existing) {
              console.log('[ChatGPT Drawing Tool] Opening drawing panel via message');
              const button = document.getElementById('chatgpt-drawing-tool-button');
              if (button) {
                button.remove();
              }
              injectDrawingPanel();
            }
            return true; // Indicate we handled the message
          }
        });
      } else {
        console.warn('[ChatGPT Drawing Tool] Chrome runtime not available, popup functionality disabled');
      }
    };

    // Helper to inject RTL button next to Share button
    function injectRTLButton() {
      console.log('[ChatGPT Drawing Tool] Injecting RTL button...');
      const shareButton = document.querySelector('button[data-testid="share-chat-button"]');
      if (!shareButton) return;
      if (document.getElementById('rtl-toggle-button')) return;
      const rtlButton = document.createElement('button');
      rtlButton.id = 'rtl-toggle-button';
      rtlButton.className = shareButton.className;
      rtlButton.setAttribute('aria-label', 'Toggle RTL');
      rtlButton.innerHTML = '<div class="flex w-full items-center justify-center gap-2">RTL</div>';
      rtlButton.style.marginRight = '8px';
      if (shareButton.parentNode) {
        shareButton.parentNode.insertBefore(rtlButton, shareButton);
      }
      rtlButton.addEventListener('click', () => {
        const assistantMessages = Array.from(document.querySelectorAll('[data-message-author-role="assistant"]'));
        if (assistantMessages.length === 0) {
          console.log('[GPT Power-Ups] RTL Button: No assistant messages found');
          return;
        }
        const lastMessage = assistantMessages[assistantMessages.length - 1] as HTMLElement;
        const currentDir = lastMessage.style.direction;
        lastMessage.style.direction = currentDir === 'rtl' ? 'ltr' : 'rtl';
        lastMessage.style.textAlign = currentDir === 'rtl' ? 'left' : 'right';
        console.log(`[GPT Power-Ups] RTL Button: Toggled direction to ${lastMessage.style.direction}`);
      });
    }

    // Inject the drawing panel
    const injectDrawingPanel = () => {
      console.log('[ChatGPT Drawing Tool] Injecting drawing panel...');
      const panel = document.createElement('div');
      panel.id = 'chatgpt-drawing-panel';
      panel.innerHTML = `
        <div class="chatgpt-drawing-panel-overlay"></div>
        <div class="chatgpt-drawing-panel">
          <div class="chatgpt-drawing-panel-header">
            <div class="chatgpt-drawing-panel-title">Drawing Tool</div>
            <button id="close-drawing-panel" class="chatgpt-drawing-panel-close" aria-label="Close">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
          <div class="chatgpt-drawing-panel-content">
            <div class="chatgpt-drawing-canvas-container">
              <canvas id="drawing-canvas" class="chatgpt-drawing-canvas"></canvas>
              <div class="chatgpt-drawing-hint" style="display: none;">Tip: You can paste images (Ctrl+V) or use the selection tool to move parts of your drawing</div>
            </div>
          </div>
          <div class="chatgpt-drawing-panel-toolbar">
            <div class="chatgpt-drawing-tools">
              <div class="chatgpt-drawing-tool-group">
                <button id="brush-tool" class="chatgpt-toolbar-button active" title="Brush">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18.37 2.63 14 7l-1.74-1.74a1 1 0 0 0-1.42 0L2.63 13.47a1 1 0 0 0 0 1.42L7 19.25l.8.8a1 1 0 0 0 1.42 0l8.2-8.2a1 1 0 0 0 0-1.42L16 9l4.37-4.37a1 1 0 0 0-1.42-1.42 1 1 0 0 0-.58.28Z"/></svg>
                </button>
                <button id="eraser-tool" class="chatgpt-toolbar-button" title="Eraser">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"/><path d="M22 21H7"/><path d="m5 11 9 9"/></svg>
                </button>
                <button id="selection-tool" class="chatgpt-toolbar-button" title="Selection (Cut: Ctrl+X, Copy: Ctrl+C, Paste: Ctrl+V, Delete: Del, Cancel: Esc)" style="display: none;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 2v20"/><path d="M2 4h20"/><path d="M2 20h20"/><path d="M20 2v20"/><path d="m8 9 3-3 3 3"/><path d="M11 6v12"/></svg>
                </button>
                <button id="upload-image" class="chatgpt-toolbar-button" title="Upload image">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                </button>
                <input type="file" id="image-upload-input" accept="image/*" style="display: none;" />
              </div>
              
              <div class="chatgpt-color-picker">
                <div class="chatgpt-color-swatch" data-color="#000000" style="background-color: #000000"></div>
                <div class="chatgpt-color-swatch" data-color="#ffffff" style="background-color: #ffffff; border: 1px solid #e5e7eb;"></div>
                <div class="chatgpt-color-swatch" data-color="#ff0000" style="background-color: #ff0000"></div>
                <div class="chatgpt-color-swatch" data-color="#00ff00" style="background-color: #00ff00"></div>
                <div class="chatgpt-color-swatch" data-color="#0000ff" style="background-color: #0000ff"></div>
                <div class="chatgpt-color-swatch" data-color="#ffff00" style="background-color: #ffff00"></div>
                <div class="chatgpt-color-swatch" data-color="#ff00ff" style="background-color: #ff00ff"></div>
                <div class="chatgpt-color-swatch" data-color="#00ffff" style="background-color: #00ffff"></div>
                <div class="chatgpt-color-swatch" data-color="#ff9900" style="background-color: #ff9900"></div>
                <div class="chatgpt-color-swatch" data-color="#9900ff" style="background-color: #9900ff"></div>
              </div>
              
              <div class="chatgpt-brush-size-selector">
                <button class="chatgpt-brush-size-button" data-size="2"><div class="chatgpt-brush-size-preview" style="width: 2px; height: 2px;"></div></button>
                <button class="chatgpt-brush-size-button" data-size="5"><div class="chatgpt-brush-size-preview" style="width: 5px; height: 5px;"></div></button>
                <button class="chatgpt-brush-size-button active" data-size="10"><div class="chatgpt-brush-size-preview" style="width: 10px; height: 10px;"></div></button>
                <button class="chatgpt-brush-size-button" data-size="15"><div class="chatgpt-brush-size-preview" style="width: 15px; height: 15px;"></div></button>
                <button class="chatgpt-brush-size-button" data-size="20"><div class="chatgpt-brush-size-preview" style="width: 20px; height: 20px;"></div></button>
              </div>
              
              <div class="chatgpt-drawing-actions">
                <button id="clear-canvas" class="chatgpt-drawing-action-button" title="Clear canvas">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                </button>
                <button id="copy-canvas" class="chatgpt-drawing-action-button" title="Copy to clipboard">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                </button>
                <button id="download-canvas" class="chatgpt-drawing-action-button" title="Download drawing">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                </button>
                <button id="send-to-chat" class="chatgpt-drawing-action-button primary" title="Send to ChatGPT">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48" fill="none" stroke="none"><g transform="translate(0.000000,48.000000) scale(0.100000,-0.100000)" fill="currentColor"><path d="M149 370 c-23 -22 -45 -40 -49 -40 -4 0 -13 -14 -20 -31 -10 -24 -11 -38 -2 -63 7 -18 12 -45 12 -60 0 -35 41 -76 77 -76 15 0 37 -7 47 -15 35 -26 73 -18 117 25 23 22 45 40 49 40 4 0 13 14 20 31 10 24 11 38 2 63 -7 18 -12 45 -12 60 0 35 -41 76 -77 76 -15 0 -37 7 -47 15 -35 26 -73 18 -117 -25z m99 11 c10 -6 4 -14 -22 -29 -34 -20 -36 -24 -36 -72 0 -73 -24 -62 -28 13 -2 46 1 60 18 77 21 21 46 25 68 11z m102 -41 c18 -18 28 -50 16 -50 -3 0 -21 9 -40 21 l-35 20 -47 -27 c-41 -24 -46 -25 -42 -8 4 22 73 64 106 64 12 0 31 -9 42 -20z m-210 -64 c0 -39 3 -45 30 -56 38 -16 55 -36 37 -43 -21 -8 -97 41 -108 70 -7 19 -6 32 6 49 23 36 35 29 35 -20z m238 -40 c12 -23 11 -31 -2 -52 -24 -36 -36 -29 -36 21 0 25 -3 45 -7 45 -5 0 -23 9 -42 21 -27 16 -31 23 -20 29 19 13 90 -30 107 -64z m-117 34 c25 -14 24 -46 -1 -60 -43 -23 -84 35 -42 59 21 13 20 13 43 1z m57 -83 c2 -46 -1 -60 -18 -77 -21 -21 -46 -25 -68 -11 -10 6 -4 14 22 29 34 20 36 24 36 72 0 73 24 62 28 -13z m-47 -21 c-20 -24 -88 -49 -116 -42 -24 6 -55 50 -43 61 3 3 22 -4 41 -15 l36 -22 43 26 c41 24 62 20 39 -8z"></path></g></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(panel);

      // Make the panel draggable
      const panelElement = panel.querySelector('.chatgpt-drawing-panel') as HTMLElement;
      const headerElement = panel.querySelector('.chatgpt-drawing-panel-header') as HTMLElement;
      
      if (panelElement && headerElement) {
        console.log('[ChatGPT Drawing Tool] Setting up drag functionality');
        let isDragging = false;
        let offsetX = 0;
        let offsetY = 0;

        headerElement.addEventListener('mousedown', (e) => {
          isDragging = true;
          const rect = panelElement.getBoundingClientRect();
          offsetX = e.clientX - rect.left;
          offsetY = e.clientY - rect.top;
          console.log('[ChatGPT Drawing Tool] Started dragging panel');
        });

        document.addEventListener('mousemove', (e) => {
          if (isDragging) {
            panelElement.style.transform = 'none';
            panelElement.style.top = `${e.clientY - offsetY}px`;
            panelElement.style.left = `${e.clientX - offsetX}px`;
          }
        });

        document.addEventListener('mouseup', () => {
          if (isDragging) {
            console.log('[ChatGPT Drawing Tool] Stopped dragging panel');
            isDragging = false;
          }
        });
      } else {
        console.warn('[ChatGPT Drawing Tool] Panel or header element not found, dragging disabled');
      }

      // Close button functionality
      const closeBtn = document.getElementById('close-drawing-panel');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          console.log('[ChatGPT Drawing Tool] Close button clicked');
          panel.remove();
          // Reinject the floating button when panel is closed
          injectFloatingButton();
        });
      } else {
        console.warn('[ChatGPT Drawing Tool] Close button not found');
      }

      // Setup canvas and drawing functionality
      const canvas = document.getElementById('drawing-canvas') as HTMLCanvasElement;
      if (canvas) {
        console.log('[ChatGPT Drawing Tool] Setting up canvas');
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Set canvas dimensions
          const resizeCanvas = () => {
            const container = canvas.parentElement;
            if (container) {
              canvas.width = container.clientWidth;
              canvas.height = container.clientHeight;
              ctx.fillStyle = '#ffffff';
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              console.log(`[ChatGPT Drawing Tool] Canvas resized to ${canvas.width}x${canvas.height}`);
            }
          };
          
          resizeCanvas();
          window.addEventListener('resize', resizeCanvas);
          
          // Show the tip briefly on startup
          const drawingHint = document.querySelector('.chatgpt-drawing-hint') as HTMLElement;
          if (drawingHint) {
            drawingHint.style.display = 'block';
            setTimeout(() => {
              drawingHint.style.display = 'none';
            }, 3000); // Hide after 3 seconds
          }
          
          // Drawing variables
          let isDrawing = false;
          let drawMode = 'brush';  // Default mode is brush
          let currentColor = '#000000';
          let currentSize = 10;
          
          // Selection variables
          let isSelecting = false;
          let isMovingSelection = false;
          let selectionStart = { x: 0, y: 0 };
          let selectionEnd = { x: 0, y: 0 };
          let selectionRect = { x: 0, y: 0, width: 0, height: 0 };
          let selectionImageData: ImageData | null = null;
          const selectionOffset = { x: 0, y: 0 };
          
          // Create a temporary canvas for selection operations
          const tempCanvas = document.createElement('canvas');
          const tempCtx = tempCanvas.getContext('2d');

          // Set up initial drawing state
          ctx.lineWidth = currentSize;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.strokeStyle = currentColor;
          
          // Drawing functions
          canvas.addEventListener('mousedown', (e) => {
            // Prevent event from being handled twice
            e.preventDefault();
            
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            console.log(`[ChatGPT Drawing Tool] Mouse down, mode: ${drawMode}, at x:${x}, y:${y}`);
            
            if (drawMode === 'selection') {
              // If we have an active selection and clicked inside it
              if (selectionImageData && 
                  x >= selectionRect.x && x <= selectionRect.x + selectionRect.width &&
                  y >= selectionRect.y && y <= selectionRect.y + selectionRect.height) {
                // Start moving the selection
                isMovingSelection = true;
                canvas.style.cursor = 'move';
                console.log('[ChatGPT Drawing Tool] Moving existing selection');
              } else {
                // Start a new selection
                isSelecting = true;
                // Clear any previous selection
                clearSelection();
                selectionStart = { x, y };
                selectionEnd = { x, y };
                console.log('[ChatGPT Drawing Tool] Starting new selection', { isSelecting });
              }
            } else {
              // Regular drawing behavior
              isDrawing = true;
              ctx.beginPath();
              ctx.moveTo(x, y);
            }
          });
          
          canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            if (drawMode === 'selection') {
              if (isSelecting) {
                // Update selection rectangle
                selectionEnd = { x, y };
                drawSelectionRect();
                
                // Log selection rect dimensions for debugging
                const width = Math.abs(selectionEnd.x - selectionStart.x);
                const height = Math.abs(selectionEnd.y - selectionStart.y);
                if (width > 10 || height > 10) {
                  console.log(`[ChatGPT Drawing Tool] Drawing selection with width: ${width}, height: ${height}, isSelecting: ${isSelecting}`);
                }
              } else if (isMovingSelection && selectionImageData) {
                // Move the selection
                moveSelection(x, y);
              } else if (selectionImageData && 
                        x >= selectionRect.x && x <= selectionRect.x + selectionRect.width &&
                        y >= selectionRect.y && y <= selectionRect.y + selectionRect.height) {
                // Hovering over the selection
                canvas.style.cursor = 'move';
              } else {
                canvas.style.cursor = 'crosshair';
              }
            } else if (isDrawing) {
              // Regular drawing behavior
              ctx.lineTo(x, y);
              ctx.stroke();
            }
          });
          
          canvas.addEventListener('mouseup', (e) => {
            console.log(`[ChatGPT Drawing Tool] Mouse up, drawMode: ${drawMode}, isSelecting: ${isSelecting}, isMovingSelection: ${isMovingSelection}`);
            
            if (drawMode === 'selection') {
              if (isSelecting) {
                // Finalize selection
                isSelecting = false;
                
                // Calculate the selection rectangle (normalized)
                const minX = Math.min(selectionStart.x, selectionEnd.x);
                const minY = Math.min(selectionStart.y, selectionEnd.y);
                const width = Math.abs(selectionEnd.x - selectionStart.x);
                const height = Math.abs(selectionEnd.y - selectionStart.y);
                
                console.log(`[ChatGPT Drawing Tool] Finalizing selection: width=${width}, height=${height}`);
                
                // Only create a selection if it has some size
                if (width > 3 && height > 3) {
                  selectionRect = { x: minX, y: minY, width, height };
                  
                  // Save the selection image data
                  selectionImageData = ctx.getImageData(minX, minY, width, height);
                  console.log('[ChatGPT Drawing Tool] Selection created:', selectionRect);
                  
                  // Mark the selection area
                  drawSelectionBorder();
                } else {
                  // Selection is too small, clear it
                  console.log('[ChatGPT Drawing Tool] Selection too small, clearing');
                  clearSelection();
                }
              } else if (isMovingSelection) {
                // Finalize the move
                isMovingSelection = false;
                canvas.style.cursor = 'crosshair';
                console.log('[ChatGPT Drawing Tool] Finalized moving selection');
              }
            } else if (isDrawing) {
              // End drawing
              isDrawing = false;
            }
          });
          
          canvas.addEventListener('mouseleave', () => {
            if (isDrawing) {
              isDrawing = false;
            }
            if (isSelecting) {
              isSelecting = false;
            }
          });
          
          // Helper function to clear selection
          const clearSelection = () => {
            if (selectionImageData) {
              // Redraw the image to remove selection rectangle
              redrawCanvas();
              selectionImageData = null;
            }
            
            isSelecting = false;
            isMovingSelection = false;
            selectionRect = { x: 0, y: 0, width: 0, height: 0 };
            canvas.style.cursor = 'crosshair';
          };
          
          // Helper function to redraw the canvas without selection markings
          const redrawCanvas = () => {
            // This is needed to redraw the canvas without the selection borders
            const fullImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            ctx.putImageData(fullImageData, 0, 0);
          };
          
          // Helper function to draw selection rectangle while dragging
          const drawSelectionRect = () => {
            // Redraw to clear previous temp rectangle
            redrawCanvas();
            
            // Calculate rectangle dimensions
            const minX = Math.min(selectionStart.x, selectionEnd.x);
            const minY = Math.min(selectionStart.y, selectionEnd.y);
            const width = Math.abs(selectionEnd.x - selectionStart.x);
            const height = Math.abs(selectionEnd.y - selectionStart.y);
            
            // Only draw if we have a meaningful selection size
            if (width < 1 || height < 1) return;
            
            // Draw rectangle with a more visible style
            ctx.save();
            
            // First draw a solid border
            ctx.strokeStyle = '#0066ff';
            ctx.lineWidth = 2;
            ctx.setLineDash([]);
            ctx.strokeRect(minX, minY, width, height);
            
            // Then overlay with a dotted pattern for better visibility
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1;
            ctx.setLineDash([4, 4]);
            ctx.strokeRect(minX, minY, width, height);
            
            ctx.restore();
          };
          
          // Helper function to draw selection border around final selection
          const drawSelectionBorder = () => {
            ctx.save();
            
            // First draw a solid border
            ctx.strokeStyle = '#0066ff';
            ctx.lineWidth = 2;
            ctx.setLineDash([]);
            ctx.strokeRect(
              selectionRect.x, 
              selectionRect.y, 
              selectionRect.width, 
              selectionRect.height
            );
            
            // Then overlay with a dotted pattern for better visibility
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1;
            ctx.setLineDash([4, 4]);
            ctx.strokeRect(
              selectionRect.x, 
              selectionRect.y, 
              selectionRect.width, 
              selectionRect.height
            );
            
            // Draw handles at corners
            const handleSize = 8;
            ctx.fillStyle = '#ffffff';
            ctx.strokeStyle = '#0066ff';
            ctx.setLineDash([]);
            ctx.lineWidth = 1.5;
            
            // Draw 8 handles (corners and midpoints)
            const handles = [
              { x: selectionRect.x, y: selectionRect.y }, // top-left
              { x: selectionRect.x + selectionRect.width / 2, y: selectionRect.y }, // top-middle
              { x: selectionRect.x + selectionRect.width, y: selectionRect.y }, // top-right
              { x: selectionRect.x, y: selectionRect.y + selectionRect.height / 2 }, // middle-left
              { x: selectionRect.x + selectionRect.width, y: selectionRect.y + selectionRect.height / 2 }, // middle-right
              { x: selectionRect.x, y: selectionRect.y + selectionRect.height }, // bottom-left
              { x: selectionRect.x + selectionRect.width / 2, y: selectionRect.y + selectionRect.height }, // bottom-middle
              { x: selectionRect.x + selectionRect.width, y: selectionRect.y + selectionRect.height } // bottom-right
            ];
            
            handles.forEach(handle => {
              ctx.fillRect(
                handle.x - handleSize / 2, 
                handle.y - handleSize / 2, 
                handleSize, 
                handleSize
              );
              ctx.strokeRect(
                handle.x - handleSize / 2, 
                handle.y - handleSize / 2, 
                handleSize, 
                handleSize
              );
            });
            
            ctx.restore();
          };
          
          // Helper function to move the selection
          const moveSelection = (x: number, y: number) => {
            if (!selectionImageData) return;
            
            // Calculate new position
            const newX = x - selectionOffset.x;
            const newY = y - selectionOffset.y;
            
            // Redraw the canvas without the selection
            redrawCanvas();
            
            // Draw the selection at the new position
            ctx.putImageData(selectionImageData, newX, newY);
            
            // Update selection rectangle
            selectionRect = { 
              x: newX, 
              y: newY, 
              width: selectionRect.width, 
              height: selectionRect.height 
            };
            
            // Draw selection border
            drawSelectionBorder();
          };
          
          // Toolbar functionality
          // 1. Drawing tools (brush and eraser)
          const brushTool = document.getElementById('brush-tool');
          const eraserTool = document.getElementById('eraser-tool');
          const selectionTool = document.getElementById('selection-tool');

          if (brushTool && eraserTool && selectionTool) {
            brushTool.addEventListener('click', () => {
              console.log('[ChatGPT Drawing Tool] Switching to brush mode');
              drawMode = 'brush';
              ctx.strokeStyle = currentColor;
              canvas.style.cursor = 'crosshair';
              
              // Clear any active selection
              clearSelection();
              
              // Update active state
              brushTool.classList.add('active');
              eraserTool.classList.remove('active');
              selectionTool.classList.remove('active');
            });

            eraserTool.addEventListener('click', () => {
              console.log('[ChatGPT Drawing Tool] Switching to eraser mode');
              drawMode = 'eraser';
              ctx.strokeStyle = '#ffffff'; // White for eraser
              canvas.style.cursor = 'crosshair';
              
              // Clear any active selection
              clearSelection();
              
              // Update active state
              eraserTool.classList.add('active');
              brushTool.classList.remove('active');
              selectionTool.classList.remove('active');
            });
            
            selectionTool.addEventListener('click', () => {
              console.log('[ChatGPT Drawing Tool] Switching to selection mode');
              drawMode = 'selection';
              canvas.style.cursor = 'crosshair';
              
              // Update active state
              selectionTool.classList.add('active');
              brushTool.classList.remove('active');
              eraserTool.classList.remove('active');
              
              // Show a toast message to help users understand how to use the selection tool
              showToast('Click and drag to select an area');
            });
          }

          // 2. Color swatches
          const colorSwatches = document.querySelectorAll('.chatgpt-color-swatch');
          colorSwatches.forEach(swatch => {
            swatch.addEventListener('click', () => {
              // Switch to brush mode when clicking a color
              if (drawMode !== 'brush') {
                drawMode = 'brush';
                
                // Clear any active selection
                clearSelection();
                
                // Update tool button states
                if (brushTool && eraserTool && selectionTool) {
                  brushTool.classList.add('active');
                  eraserTool.classList.remove('active');
                  selectionTool.classList.remove('active');
                }
                
                // Update cursor
                canvas.style.cursor = 'crosshair';
                
                console.log('[ChatGPT Drawing Tool] Switched to brush mode via color swatch');
              }
              
              const color = (swatch as HTMLElement).dataset.color || '#000000';
              currentColor = color;
              ctx.strokeStyle = color;
              
              // Update active state of color swatches
              colorSwatches.forEach(s => s.classList.remove('active'));
              swatch.classList.add('active');
            });
          });

          // 3. Brush size buttons
          const brushSizeButtons = document.querySelectorAll('.chatgpt-brush-size-button');
          brushSizeButtons.forEach(button => {
            button.addEventListener('click', () => {
              const size = parseInt((button as HTMLElement).dataset.size || '10', 10);
              currentSize = size;
              ctx.lineWidth = size;
              
              // Update active state
              brushSizeButtons.forEach(b => b.classList.remove('active'));
              button.classList.add('active');
            });
          });

          // 4. Action buttons
          // Clear canvas
          const clearButton = document.getElementById('clear-canvas');
          if (clearButton) {
            clearButton.addEventListener('click', () => {
              clearSelection();
              ctx.fillStyle = '#ffffff';
              ctx.fillRect(0, 0, canvas.width, canvas.height);
            });
          }

          // Upload image button and file handling
          const uploadButton = document.getElementById('upload-image');
          const fileInput = document.getElementById('image-upload-input') as HTMLInputElement;
          
          if (uploadButton && fileInput) {
            uploadButton.addEventListener('click', () => {
              fileInput.click();
            });
            
            fileInput.addEventListener('change', () => {
              if (fileInput.files && fileInput.files[0]) {
                const file = fileInput.files[0];
                
                if (/^image\//.test(file.type)) {
                  const reader = new FileReader();
                  
                  reader.onload = (e) => {
                    if (e.target && e.target.result) {
                      const img = new Image();
                      img.onload = () => {
                        // Clear canvas and draw the image
                        drawImageOnCanvas(img);
                      };
                      img.src = e.target.result as string;
                    }
                  };
                  
                  reader.readAsDataURL(file);
                } else {
                  showToast('Please select an image file');
                }
              }
            });
          }
          
          // Handle paste from clipboard
          document.addEventListener('paste', (e) => {
            // Only capture paste events when the panel is visible
            const panel = document.getElementById('chatgpt-drawing-panel');
            if (!panel) return;
            
            if (e.clipboardData) {
              const items = e.clipboardData.items;
              
              for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                  const blob = items[i].getAsFile();
                  if (blob) {
                    const reader = new FileReader();
                    
                    reader.onload = (e) => {
                      if (e.target && e.target.result) {
                        const img = new Image();
                        img.onload = () => {
                          // Clear canvas and draw the image
                          drawImageOnCanvas(img);
                        };
                        img.src = e.target.result as string;
                      }
                    };
                    
                    reader.readAsDataURL(blob);
                    e.preventDefault();
                    break;
                  }
                }
              }
            }
          });
          
          // Helper function to draw image on canvas
          const drawImageOnCanvas = (img: HTMLImageElement) => {
            // Calculate dimensions to maintain aspect ratio
            let width = img.width;
            let height = img.height;
            const maxWidth = canvas.width - 20; // Leave some margin
            const maxHeight = canvas.height - 20;
            
            if (width > maxWidth) {
              const ratio = maxWidth / width;
              width = maxWidth;
              height = height * ratio;
            }
            
            if (height > maxHeight) {
              const ratio = maxHeight / height;
              height = maxHeight;
              width = width * ratio;
            }
            
            // Draw the image centered on canvas
            const x = (canvas.width - width) / 2;
            const y = (canvas.height - height) / 2;
            
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, x, y, width, height);
            
            showToast('Image added to canvas');
          };

          // Add drag and drop support for images
          canvas.addEventListener('dragover', (e) => {
            e.preventDefault();
            canvas.classList.add('drag-over');
          });
          
          canvas.addEventListener('dragleave', () => {
            canvas.classList.remove('drag-over');
          });
          
          canvas.addEventListener('drop', (e) => {
            e.preventDefault();
            canvas.classList.remove('drag-over');
            
            if (e.dataTransfer && e.dataTransfer.files.length > 0) {
              const file = e.dataTransfer.files[0];
              
              if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                
                reader.onload = (e) => {
                  if (e.target && e.target.result) {
                    const img = new Image();
                    img.onload = () => {
                      drawImageOnCanvas(img);
                    };
                    img.src = e.target.result as string;
                  }
                };
                
                reader.readAsDataURL(file);
              } else {
                showToast('Please drop an image file');
              }
            }
          });

          // Copy to clipboard
          const copyButton = document.getElementById('copy-canvas');
          if (copyButton) {
            copyButton.addEventListener('click', async () => {
              try {
                const blob = await new Promise<Blob | null>(resolve => {
                  canvas.toBlob(blob => resolve(blob));
                });
                
                if (blob) {
                  // Use modern clipboard API if available
                  if (navigator.clipboard && navigator.clipboard.write) {
                    const data = [new ClipboardItem({ [blob.type]: blob })];
                    await navigator.clipboard.write(data);
                    showToast('Copied to clipboard');
                  } else {
                    // Fallback method
                    const img = document.createElement('img');
                    img.src = canvas.toDataURL('image/png');
                    
                    const div = document.createElement('div');
                    div.contentEditable = 'true';
                    div.appendChild(img);
                    
                    document.body.appendChild(div);
                    
                    const range = document.createRange();
                    range.selectNodeContents(div);
                    
                    const selection = window.getSelection();
                    if (selection) {
                      selection.removeAllRanges();
                      selection.addRange(range);
                      document.execCommand('copy');
                      selection.removeAllRanges();
                    }
                    
                    document.body.removeChild(div);
                    showToast('Copied to clipboard');
                  }
                }
              } catch (error) {
                console.error('[ChatGPT Drawing Tool] Error copying to clipboard:', error);
                showToast('Failed to copy to clipboard');
              }
            });
          }

          // Download drawing
          const downloadButton = document.getElementById('download-canvas');
          if (downloadButton) {
            downloadButton.addEventListener('click', () => {
              const link = document.createElement('a');
              link.download = `drawing-${new Date().toISOString().slice(0, 10)}.png`;
              link.href = canvas.toDataURL('image/png');
              link.click();
              showToast('Image downloaded');
            });
          }

          // Send to ChatGPT
          const sendButton = document.getElementById('send-to-chat');
          if (sendButton) {
            sendButton.addEventListener('click', async () => {
              try {
                // Create a blob from the canvas
                const blob = await new Promise<Blob | null>(resolve => {
                  canvas.toBlob(blob => resolve(blob));
                });
                
                if (blob) {
                  // Find the ChatGPT textarea
                  const chatInput = findChatInput();
                  
                  if (chatInput) {
                    // Create a file from the blob
                    const file = new File([blob], 'drawing.png', { type: 'image/png' });
                    
                    // Create a DataTransfer
                    const dataTransfer = new DataTransfer();
                    dataTransfer.items.add(file);
                    
                    // Dispatch drop event
                    const dropEvent = new DragEvent('drop', {
                      bubbles: true,
                      cancelable: true,
                      dataTransfer
                    });
                    
                    chatInput.dispatchEvent(dropEvent);
                    showToast('Image sent to ChatGPT');
                    
                    // Close the drawing panel after sending to ChatGPT
                    const panel = document.getElementById('chatgpt-drawing-panel');
                    if (panel) {
                      console.log('[ChatGPT Drawing Tool] Closing panel after sending to ChatGPT');
                      panel.remove();
                      // Reinject the floating button
                      injectFloatingButton();
                    }
                  } else {
                    showToast('ChatGPT input not found');
                  }
                }
              } catch (error) {
                console.error('[ChatGPT Drawing Tool] Error sending to ChatGPT:', error);
                showToast('Failed to send to ChatGPT');
              }
            });
          }

          // Add keyboard event to handle cutting, copying, pasting
          document.addEventListener('keydown', (e) => {
            // Only handle when selection is active and panel is visible
            const panel = document.getElementById('chatgpt-drawing-panel');
            if (!panel || !selectionImageData) return;
            
            // Handle Escape to cancel selection
            if (e.key === 'Escape') {
              clearSelection();
              return;
            }
            
            // Check for Ctrl+X (cut), Ctrl+C (copy), Ctrl+V (paste), Delete
            if (e.ctrlKey || e.metaKey) {
              switch (e.key.toLowerCase()) {
                case 'x': // Cut
                  // Store selection in temp canvas
                  tempCanvas.width = selectionRect.width;
                  tempCanvas.height = selectionRect.height;
                  tempCtx?.putImageData(selectionImageData, 0, 0);
                  
                  // Clear selection area on main canvas
                  ctx.fillStyle = '#ffffff';
                  ctx.fillRect(
                    selectionRect.x, 
                    selectionRect.y, 
                    selectionRect.width, 
                    selectionRect.height
                  );
                  
                  clearSelection();
                  e.preventDefault();
                  break;
                  
                case 'c': // Copy
                  // Store selection in temp canvas
                  tempCanvas.width = selectionRect.width;
                  tempCanvas.height = selectionRect.height;
                  tempCtx?.putImageData(selectionImageData, 0, 0);
                  e.preventDefault();
                  break;
                  
                case 'v': // Paste at selection position (if available)
                  if (tempCtx) {
                    const imageData = tempCtx.getImageData(
                      0, 0, tempCanvas.width, tempCanvas.height
                    );
                    
                    // Paste at current selection position or center if no selection
                    const x = selectionRect.x || (canvas.width - tempCanvas.width) / 2;
                    const y = selectionRect.y || (canvas.height - tempCanvas.height) / 2;
                    
                    // Clear previous selection
                    clearSelection();
                    
                    // Draw pasted image
                    ctx.putImageData(imageData, x, y);
                    
                    // Create new selection for pasted content
                    selectionRect = { 
                      x, y, 
                      width: tempCanvas.width, 
                      height: tempCanvas.height 
                    };
                    selectionImageData = imageData;
                    drawSelectionBorder();
                  }
                  e.preventDefault();
                  break;
              }
            } else if (e.key === 'Delete') {
              // Delete selection
              ctx.fillStyle = '#ffffff';
              ctx.fillRect(
                selectionRect.x, 
                selectionRect.y, 
                selectionRect.width, 
                selectionRect.height
              );
              
              clearSelection();
              e.preventDefault();
            }
          });
        } else {
          console.error('[ChatGPT Drawing Tool] Failed to get canvas context');
        }
      } else {
        console.error('[ChatGPT Drawing Tool] Canvas element not found');
      }
    };

    // Helper function to find ChatGPT input
    const findChatInput = (): HTMLElement | null => {
      // Try different selectors that might find the ChatGPT input
      const selectors = [
        'textarea[placeholder="Send a message"]',
        'textarea[data-id="root"]',
        'textarea.chat-input',
        'div[role="textbox"]',
        '.chat-input-textarea'
      ];
      
      for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element) {
          return element as HTMLElement;
        }
      }
      
      // Try a more general approach
      const possibleChatContainers = [
        document.querySelector('#__next'),
        document.querySelector('.chat-container'),
        document.querySelector('[data-testid="chat-container"]'),
        document.querySelector('main')
      ];
      
      for (const container of possibleChatContainers) {
        if (!container) continue;
        
        const textarea = container.querySelector('textarea, div[role="textbox"]');
        if (textarea) {
          return textarea as HTMLElement;
        }
      }
      
      return null;
    };

    // Helper function to show a toast message
    const showToast = (message: string) => {
      const toast = document.createElement('div');
      toast.className = 'chatgpt-drawing-toast';
      toast.textContent = message;
      document.body.appendChild(toast);
      
      // Auto remove after 3 seconds
      setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => {
          document.body.removeChild(toast);
        }, 300);
      }, 3000);
    };

    // Try to load external CSS first, then fall back to injected styles
    try {
      if (chrome?.runtime?.getURL) {
        // Try to load the generated CSS file
        loadCSS(chrome.runtime.getURL('assets/style.css'))
          .then(() => {
            injectFloatingButton();
          })
          .catch(err => {
            console.warn('[ChatGPT Drawing Tool] Could not load style.css, trying alternative...', err);
            // Try index.css as fallback
            loadCSS(chrome.runtime.getURL('assets/index.css'))
              .then(() => {
                injectFloatingButton();
              })
              .catch(err => {
                console.error('[ChatGPT Drawing Tool] Failed to load CSS:', err);
                // Inject the button anyway as a fallback
                injectFloatingButton();
              });
          });
      } else {
        console.warn('[ChatGPT Drawing Tool] Chrome runtime not available, using default styling');
        injectFloatingButton();
      }
    } catch (error) {
      console.error('[ChatGPT Drawing Tool] Error during initialization:', error);
      // Try to inject button anyway
      try {
        injectFloatingButton();
      } catch (e) {
        console.error('[ChatGPT Drawing Tool] Fatal error, could not inject button:', e);
      }
    }
  } else {
    console.log('[ChatGPT Drawing Tool] Not a ChatGPT page, extension inactive');
  }
})(); 