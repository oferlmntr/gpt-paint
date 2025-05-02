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
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13"/><path d="m22 2-7 20-4-9-9-4 20-7z"/></svg>
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
          
          // Drawing variables
          let isDrawing = false;
          let drawMode = 'brush';
          let currentColor = '#000000';
          let currentSize = 10;
          
          ctx.lineWidth = currentSize;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.strokeStyle = currentColor;
          
          // Drawing functions
          canvas.addEventListener('mousedown', (e) => {
            isDrawing = true;
            const rect = canvas.getBoundingClientRect();
            ctx.beginPath();
            ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
            console.log('[ChatGPT Drawing Tool] Started drawing');
          });
          
          canvas.addEventListener('mousemove', (e) => {
            if (!isDrawing) return;
            const rect = canvas.getBoundingClientRect();
            ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
            ctx.stroke();
          });
          
          canvas.addEventListener('mouseup', () => {
            if (isDrawing) {
              console.log('[ChatGPT Drawing Tool] Finished drawing');
              isDrawing = false;
            }
          });
          
          canvas.addEventListener('mouseleave', () => {
            if (isDrawing) {
              console.log('[ChatGPT Drawing Tool] Mouse left canvas while drawing');
              isDrawing = false;
            }
          });

          // Toolbar functionality
          // 1. Drawing tools (brush and eraser)
          const brushTool = document.getElementById('brush-tool');
          const eraserTool = document.getElementById('eraser-tool');

          if (brushTool && eraserTool) {
            brushTool.addEventListener('click', () => {
              drawMode = 'brush';
              ctx.strokeStyle = currentColor;
              brushTool.classList.add('active');
              eraserTool.classList.remove('active');
            });

            eraserTool.addEventListener('click', () => {
              drawMode = 'eraser';
              ctx.strokeStyle = '#ffffff'; // White for eraser
              eraserTool.classList.add('active');
              brushTool.classList.remove('active');
            });
          }

          // 2. Color swatches
          const colorSwatches = document.querySelectorAll('.chatgpt-color-swatch');
          colorSwatches.forEach(swatch => {
            swatch.addEventListener('click', () => {
              if (drawMode === 'eraser') return;
              
              const color = (swatch as HTMLElement).dataset.color || '#000000';
              currentColor = color;
              ctx.strokeStyle = color;
              
              // Update active state
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
              ctx.fillStyle = '#ffffff';
              ctx.fillRect(0, 0, canvas.width, canvas.height);
            });
          }

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