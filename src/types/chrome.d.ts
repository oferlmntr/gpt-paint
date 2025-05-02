/**
 * Type declaration for Chrome API
 * This is already provided by @types/chrome, but we include it here for reference
 */

interface Chrome {
  runtime: {
    onMessage: {
      addListener: (callback: (message: any, sender: any, sendResponse: any) => void) => void;
      removeListener: (callback: (message: any, sender: any, sendResponse: any) => void) => void;
    };
  };
  tabs: {
    query: (queryInfo: { active: boolean; currentWindow: boolean }, callback: (tabs: { id?: number }[]) => void) => void;
    sendMessage: (tabId: number, message: any) => void;
  };
} 