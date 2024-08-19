interface TrackedEventListener {
    type: string;
    listener: EventListenerOrEventListenerObject;
    options?: boolean | AddEventListenerOptions;
  }
  
export interface DocumentWithEventListeners extends Document {
    eventListeners: TrackedEventListener[];
  }
  
export function init() {
    const originalAddEventListener = document.addEventListener;
    const originalRemoveEventListener = document.removeEventListener;
  
    // Extend the document to store event listeners
    (document as DocumentWithEventListeners).eventListeners = [];
  
    document.addEventListener = function(
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | AddEventListenerOptions
    ): void {
      (document as DocumentWithEventListeners).eventListeners.push({ type, listener, options });
      originalAddEventListener.call(document, type, listener, options);
    };
  
    document.removeEventListener = function(
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | EventListenerOptions
    ): void {
      const listeners = (document as DocumentWithEventListeners).eventListeners;
      const index = listeners.findIndex(
        event => event.type === type && event.listener === listener && event.options === options
      );
  
      if (index !== -1) {
        listeners.splice(index, 1);
      }
  
      originalRemoveEventListener.call(document, type, listener, options);
    };
  };
  
export function removeAllEventListeners(): void {
    const docWithListeners = document as DocumentWithEventListeners;
    
    docWithListeners.eventListeners.forEach(({ type, listener, options }) => {
      document.removeEventListener(type, listener, options);
    });
  
    // Clear the array after removing all listeners
    docWithListeners.eventListeners = [];
  }