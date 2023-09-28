import { createServer } from 'http';
import { parse } from 'url';
import { createWSServer } from './WSServer.js';

export function createMainServer(port = 8080, heartbeatTime = 30000, authCode = '') {
	const server = createServer();
	const WSS = createWSServer(port, heartbeatTime, authCode);
	server.on('upgrade', function upgrade(request: any, socket: any, head: any) {
		const { pathname } = parse(request.url);

		switch (pathname) {
			case '/ws':
				WSS.handleUpgrade(request, socket, head, function done(ws) {
					WSS.emit('connection', ws, request);
				});
				return;
			default:
				socket.destroy();
		}
	});

	server.listen(port);
}
