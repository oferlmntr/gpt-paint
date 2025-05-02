import { findChatInput } from './domUtils';

/**
 * Downloads the canvas content as a PNG image
 */
export const downloadCanvas = (canvas: HTMLCanvasElement) => {
  const link = document.createElement('a');
  link.download = `drawing-${new Date().toISOString().slice(0, 10)}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
};

/**
 * Copies the canvas content to the clipboard
 */
export const copyCanvasToClipboard = async (canvas: HTMLCanvasElement) => {
  return new Promise<void>((resolve, reject) => {
    canvas.toBlob(async (blob) => {
      if (!blob) {
        reject(new Error('Canvas is empty'));
        return;
      }
      
      try {
        // Use the newer Clipboard API if available
        if (navigator.clipboard && navigator.clipboard.write) {
          const data = [new ClipboardItem({ [blob.type]: blob })];
          await navigator.clipboard.write(data);
        } else {
          // Fallback for browsers that don't support ClipboardItem
          const img = document.createElement('img');
          img.src = canvas.toDataURL('image/png');
          
          const div = document.createElement('div');
          div.contentEditable = 'true';
          div.appendChild(img);
          
          document.body.appendChild(div);
          
          // Select the div content
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
        }
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  });
};

/**
 * Sends the canvas content to ChatGPT as an attachment
 */
export const sendToChat = async (canvas: HTMLCanvasElement) => {
  return new Promise<void>(async (resolve, reject) => {
    try {
      const blob = await new Promise<Blob | null>((blobResolve) => {
        canvas.toBlob((b) => blobResolve(b));
      });
      
      if (!blob) {
        reject(new Error('Failed to create blob from canvas'));
        return;
      }
      
      // Find the ChatGPT input element
      const chatInput = findChatInput();
      
      if (!chatInput) {
        reject(new Error('ChatGPT input not found'));
        return;
      }
      
      // Create a file from the blob
      const file = new File([blob], 'drawing.png', { type: 'image/png' });
      
      // Create a DataTransfer object to prepare the file for the drop
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      
      // Create and dispatch custom events to trigger file upload
      const dropEvent = new DragEvent('drop', {
        bubbles: true,
        cancelable: true,
        dataTransfer
      });
      
      chatInput.dispatchEvent(dropEvent);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};