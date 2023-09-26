import { bgRed, bgGreen, bgYellow, gray, white, bgWhite, black } from 'colorette';
import { WebSocket } from 'ws';
export function createClient(ip = '127.0.0.1', port = 8080, username: string, authCode = '') {
	const ws = new WebSocket(`ws://${ip}:${port}`);
	ws.on('error', (error) => {
		console.log(bgRed(white('[WS] ERROR')), error);
	});
	ws.on('close', () => {
		console.log(bgYellow(white('[WS]')), 'Closed connection');
	});
	ws.on('message', (message) => {
		const str = message.toString();
		const json = JSON.parse(str);
		if (json.type === 'message') {
			console.log(`${json.username} ${gray('>')}`, json.message.toString('utf8'));
		} else if (json.type === 'authFail') {
			console.log(bgRed(white('[WS]')), 'Your Auth Token is incoreect');
			ws.terminate();
		} else if (json.type === 'join/leave') {
			console.log(bgWhite(black(`A user has ${json.status}`)));
		}
	});
	ws.on('open', () => {
		console.log(bgGreen(white('[WS]')), 'WebSocket reconnected');
	});
	function sendMessage(message: String) {
		ws.send(
			JSON.stringify({
				type: 'message',
				username: username,
				message,
				authCode
			})
		);
	}
	return { ws, sendMessage };
}
