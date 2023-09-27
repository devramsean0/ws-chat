import { WebSocket } from 'ws';
import { bgRed, white } from 'colorette';
import md5 from 'blueimp-md5';
import { PrismaClient } from '@prisma/client';

export async function checkAuth(json: any, authCode: string, ws: WebSocket, db: PrismaClient) {
	if (json.authCode == authCode) {
		const user = await db.user.upsert({
			where: {
				username: json.username
			},
			create: {
				username: json.username,
				password: md5(json.password)
			},
			update: {
				username: json.username
			}
		});
		if (user.password == md5(json.password)) return true;
		else {
			console.log(bgRed(white('[WS] AUTH')), 'Incorrect password supplied, Terminating WS connection');
			ws.send(
				JSON.stringify({
					type: 'authFail',
					step: 'password'
				})
			);
			ws.terminate();
			return false;
		}
	} else {
		console.log(bgRed(white('[WS] AUTH')), 'Incorrect Auth token supplied, Terminating WS connection');
		ws.send(
			JSON.stringify({
				type: 'authFail',
				step: 'authToken'
			})
		);
		ws.terminate();
		return false;
	}
}
