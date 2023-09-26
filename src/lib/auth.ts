import { WebSocket } from 'ws';
import { bgRed, white } from 'colorette';

export function checkAuth(json: any, authCode: string, ws: WebSocket) {
	if (json.authCode == authCode) return true;
	else {
		console.log(bgRed(white('[WS] AUTH')), 'Incorrect Auth token supplied, Terminating WS connection');
		ws.send(
			JSON.stringify({
				type: 'authFail'
			})
		);
		ws.terminate();
		return false;
	}
}
