import { bgBlue, bgGreen, bgWhite, bgYellow, bgRed, black, white, gray, red } from 'colorette';
import { WebSocket, WebSocketServer } from 'ws';
export function createServer(port = 8080, heartbeatTime = 30000, authCode = '') {
	const wss = new WebSocketServer({ port });
	const clients = new Set();

	// WSS implementation
	wss.on('listening', () => {
		console.log(bgBlue(white('[WSS]')), `Listening on port ${port}`);
	});
	wss.on('error', (error) => {
		console.log(bgRed(white('[WSS] ERROR')), error);
	});
	wss.on('connection', (ws) => {
		console.log(bgGreen(white('[WS]')), 'Recieved new connection');
		clients.add(ws);
		broadcast(
			JSON.stringify({
				type: 'join/leave',
				status: 'joined'
			}),
			ws
		);
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
		ws.on('message', (message) => {
			const str = message.toString();
			const json = JSON.parse(str.toString());
			if (json.type === 'message') {
				if (json.authCode == authCode) {
					broadcast(message, ws);
					console.log(bgWhite(black('[WS] MESSAGE')), `${json.username} ${gray('>')} ${json.message.toString('utf8')}`);
				} else {
					console.log(bgRed(white('[WS] AUTH')), 'Incorrect Auth token supplied, Terminating WS connection');
					ws.send(
						JSON.stringify({
							type: 'authFail'
						})
					);
				}
			}
		});
		ws.on('open', () => {
			console.log(bgGreen(white('[WS]')), 'WebSocket reconnected');
			clients.add(ws);
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
}
