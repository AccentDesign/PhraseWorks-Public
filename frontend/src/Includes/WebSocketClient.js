import { handleError } from '../Utils/ErrorHandler';

let wsInstance = null;
let clientId = null;
let isConnecting = false;

export const initWebSocket = (tabId, onMessage, onOpen, onClose) => {
  clientId = tabId;

  // Prevent multiple concurrent connections (important for StrictMode)
  if (isConnecting) {
    return wsInstance;
  }

  if (!wsInstance || wsInstance.readyState === WebSocket.CLOSED) {
    isConnecting = true;

    try {
      wsInstance = new WebSocket(`ws://localhost:8081?clientId=${clientId}`);

      wsInstance.onopen = () => {
        isConnecting = false;
        // console.log('WebSocket connected', clientId);
        if (onOpen) onOpen();
      };

      wsInstance.onmessage = (event) => {
        if (onMessage) onMessage(event);
      };

      wsInstance.onclose = () => {
        isConnecting = false;
        // console.log('WebSocket disconnected');
        if (onClose) onClose();
        wsInstance = null;
      };

      wsInstance.onerror = async (err) => {
        isConnecting = false;
        try {
          await handleError(err, 'WebSocketClient.onerror');
        } catch (e) {
          console.warn('Error handling WebSocket error:', e);
        }

        // Safely close the connection
        if (wsInstance && wsInstance.readyState === WebSocket.OPEN) {
          try {
            wsInstance.close();
          } catch (e) {
            console.warn('Error closing WebSocket:', e);
          }
        }
        wsInstance = null;
      };
    } catch (error) {
      isConnecting = false;
      console.warn('Failed to create WebSocket connection:', error);
      wsInstance = null;
    }
  }

  return wsInstance;
};

export const getWebSocket = () => wsInstance;
export const getClientId = () => clientId;

export const closeWebSocket = () => {
  if (wsInstance && wsInstance.readyState === WebSocket.OPEN) {
    try {
      wsInstance.close();
    } catch (e) {
      console.warn('Error closing WebSocket:', e);
    }
  }
  wsInstance = null;
  isConnecting = false;
};
