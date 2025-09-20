import { WebSocketServer } from 'ws';

export const connectedClients = new Map();

export const createWebSocketServer = () => {
  const wss = new WebSocketServer({ port: 8081 });

  wss.on('connection', (ws, req) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const clientId = url.searchParams.get('clientId');

    if (clientId) {
      connectedClients.set(clientId, ws);
    }

    ws.on('close', () => {
      if (clientId) connectedClients.delete(clientId);
    });
  });

  return wss;
};