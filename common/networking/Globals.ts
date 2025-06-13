import { ClientManager } from './client/ClientManager';
import { ServerDataStore } from './tracking/stores/ServerDataStore';

const CLIENT_TIMEOUT_MS = 10 * 60 * 1000;

export const CLIENT_MANAGER = new ClientManager();
export const SERVER_DATA_STORE = new ServerDataStore();

setInterval(() => {
  CLIENT_MANAGER.cleanupOldClients(CLIENT_TIMEOUT_MS);
}, CLIENT_TIMEOUT_MS);
