import { bgRed, bgGreen, bgYellow, gray, white, bgWhite, black, blue } from 'colorette';
import { WebSocket } from 'ws';
import md5 from 'blueimp-md5';
export function createClient(ip = '127.0.0.1', port = 8080, username: string, authCode = '', oldMessageCount = 100, password: string) {
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
		switch (json.type) {
			case 'message':
				console.log(`${json.username} ${gray('>')}`, json.message.toString('utf8'));
				return;
			case 'authFail':
				console.log(bgRed(white('[WS]')), 'Your Auth Token is incoreect');
				ws.terminate();
				return;
			case 'join/leave':
				console.log(bgWhite(black(`A user has ${json.status}`)));
				return;
			case 'oldMessages':
				json.messages.forEach((val: { content: string; userUsername: string }) => {
					console.log(`${blue('[OLD SESSION]')} ${val.userUsername} ${gray('>')}`, val.content);
				});
				return;
			default:
		}
	});
	ws.on('open', () => {
		console.log(bgGreen(white('[WS]')), 'WebSocket connected - passing Auth details');
		ws.send(
			JSON.stringify({
				type: 'authREQ',
				authCode,
				username,
				oldMessageCount,
				password: md5(password)
			})
		);
	});
	function sendMessage(message: String) {
		ws.send(
			JSON.stringify({
				type: 'message',
				username: username,
				message,
				authCode,
				password: md5(password)
			})
		);
	}
	return { ws, sendMessage };
}
