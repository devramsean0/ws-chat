import { bgRed, bgGreen, bgYellow, gray, white } from 'colorette';
import { WebSocket } from 'ws';
export function createClient(ip = '127.0.0.1', port = 8080) {
	const ws = new WebSocket(`ws://${ip}:${port}`);
	ws.on('error', () => {
		console.log(bgRed(white('[WS] ERROR')), error);
	});
	ws.on('close', () => {
		console.log(bgYellow(white('[WS]')), 'Closed connection');
	});
	ws.on('message', (message) => {
		console.log(gray('>'), message.toString('utf8'));
	});
	ws.on('open', () => {
		console.log(bgGreen(white('[WS]')), 'WebSocket reconnected');
	});
	function send(message) {
		ws.send(message);
	}
	return { ws, send };
}
