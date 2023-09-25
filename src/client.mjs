import { bgRed, bgGreen, bgYellow, gray, white } from 'colorette';
import { WebSocket } from 'ws';
export function createClient(ip = '127.0.0.1', port = 8080, username) {
	const ws = new WebSocket(`ws://${ip}:${port}`);
	ws.on('error', () => {
		console.log(bgRed(white('[WS] ERROR')), error);
	});
	ws.on('close', () => {
		console.log(bgYellow(white('[WS]')), 'Closed connection');
	});
	ws.on('message', (message) => {
		const json = JSON.parse(message);
		if (json.type === 'message') {
			console.log(`${json.username} ${gray('>')}`, json.message.toString('utf8'));
		}
	});
	ws.on('open', () => {
		console.log(bgGreen(white('[WS]')), 'WebSocket reconnected');
	});
	function sendMessage(message) {
		ws.send(
			JSON.stringify({
				type: 'message',
				username: username,
				message
			})
		);
	}
	return { ws, sendMessage };
}
