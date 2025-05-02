/**
 * Finds the ChatGPT input element in the DOM
 * This may need to be updated if ChatGPT's DOM structure changes
 */
export const findChatInput = (): HTMLElement | null => {
  // Try different selectors that might find the ChatGPT input
  // These selectors might need to be updated if ChatGPT's UI changes
  
  // Try finding by common attributes of the main textarea
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
  
  // If none of the selectors match, try a more general approach
  // by looking for a textarea within the chat interface
  const possibleChatContainers = [
    document.querySelector('#__next'), // Next.js root
    document.querySelector('.chat-container'),
    document.querySelector('[data-testid="chat-container"]'),
    document.querySelector('main')
  ];
  
  for (const container of possibleChatContainers) {
    if (!container) continue;
    
    // Look for a textarea or div[role="textbox"] in the container
    const textarea = container.querySelector('textarea, div[role="textbox"]');
    if (textarea) {
      return textarea as HTMLElement;
    }
  }
  
  return null;
};

/**
 * Checks if the current page is ChatGPT
 */
export const isChatGPTPage = (): boolean => {
  const url = window.location.href;
  return url.includes('chat.openai.com') || url.includes('chatgpt.com');
};