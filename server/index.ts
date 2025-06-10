import { createContext } from '@/api/common';
import { appRouter } from '@/api/router/root';
import { applyWSSHandler } from '@trpc/server/adapters/ws';
import * as ws from 'ws';

const wss = new ws.Server({
  port: 3001,
});
/// source: https://trpc.io/docs/server/websockets
const handler = applyWSSHandler({
  wss,
  router: appRouter,
  createContext: createContext,
  // Enable heartbeat messages to keep connection open (disabled by default)
  keepAlive: {
    enabled: true,
    // server ping message interval in milliseconds
    pingMs: 30000,
    // connection is terminated if pong message is not received in this many milliseconds
    pongWaitMs: 5000,
  },
  onError: error => {
    console.trace(error.error);
  },
});

wss.on('connection', ws => {
  ws.once('close', () => {
    console.log(`➖➖ Connection (${wss.clients.size})`);
  });
});

console.log('✅ WebSocket Server listening on ws://localhost:3001');
process.on('SIGTERM', () => {
  console.log('SIGTERM');
  handler.broadcastReconnectNotification();
  wss.close();
});
