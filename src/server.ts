import { bgBlue, bgGreen, bgWhite, bgYellow, bgRed, black, white, gray, red } from 'colorette';
import { WebSocket, WebSocketServer } from 'ws';
import { checkAuth } from './lib/auth.js';
import { PrismaClient } from '@prisma/client';
import { loadPersistentMessages, savePersistentMessage } from './lib/persistentMessages.js';
export function createServer(port = 8080, heartbeatTime = 30000, authCode = '') {
	const wss = new WebSocketServer({ port });
	const clients = new Set();
	(async () => {
		// DB
		const db = new PrismaClient();
		await db.$connect();
		// WSS implementation
		wss.on('listening', async () => {
			console.log(bgBlue(white('[WSS]')), `Listening on port ${port}`);
		});
		wss.on('error', (error) => {
			console.log(bgRed(white('[WSS] ERROR')), error);
		});
		wss.on('connection', (ws) => {
			console.log(bgGreen(white('[WS]')), 'Recieved new connection');
			//clients.add(ws);
			//broadcast(
			//	JSON.stringify({
			//		type: 'join/leave',
			//		status: 'joined'
			//	}),
			//	ws
			//);
			// @ts-ignore
			ws.alive = true;

			ws.on('close', () => {
				console.log(bgYellow(white('[WS]')), 'Closed connection');
				clients.delete(ws);
				broadcast(
					JSON.stringify({
						type: 'join/leave',
						status: 'left'
					}),
					ws
				);
			});
			ws.on('error', (error) => {
				console.log(bgRed(white('[WS] ERROR')), error);
			});
			ws.on('message', async (message) => {
				const str = message.toString();
				const json = JSON.parse(str);
				if (json.type === 'message') {
					if (checkAuth(json, authCode, ws)) {
						await savePersistentMessage(json, db);
						broadcast(message, ws);
						console.log(bgWhite(black('[WS] MESSAGE')), `${json.username} ${gray('>')} ${json.message.toString('utf8')}`);
					}
				} else if (json.type === 'authREQ') {
					if (checkAuth(json, authCode, ws)) {
						await loadPersistentMessages(json, ws, db);
						clients.add(ws);
						broadcast(
							JSON.stringify({
								type: 'join/leave',
								status: 'joined'
							}),
							ws
						);
						console.log(bgBlue(white('[WS]')), 'Successfully Authenticated WebSocket');
					}
				}
			});
			ws.on('open', () => {
				console.log(bgGreen(white('[WS]')), 'WebSocket reconnected');
				//clients.add(ws);
				broadcast(
					JSON.stringify({
						type: 'join/leave',
						status: 'reconnected'
					}),
					ws
				);
			});
			ws.on('pong', () => {
				// @ts-ignore
				ws.alive = true;
				console.log(bgGreen(white('[WS]')), `WebSocket responded to ping`);
			});
		});
		function broadcast(message: any, source: WebSocket) {
			for (const client of clients) {
				const typedClient: any = client;
				if (client === source) continue;
				if (typedClient.alive == false) continue;
				typedClient.send(message, (error: Error) => {
					if (error) console.error(red('[WS]'), 'Error while sending message:', error);
				});
			}
		}
		// Heartbeat
		setInterval(function ping() {
			wss.clients.forEach(function each(ws: WebSocket) {
				// @ts-ignore
				if (ws.alive === false) return clients.delete(ws);
				// @ts-ignore
				ws.alive = false;
				ws.ping();
				return;
			});
		}, heartbeatTime);
		return { wss, broadcast };
	})();
}
