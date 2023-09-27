import { PrismaClient } from '@prisma/client';
import { WebSocket } from 'ws';

export async function savePersistentMessage(json: any, db: PrismaClient) {
	await db.user.upsert({
		where: {
			username: json.username
		},
		create: {
			username: json.username
		},
		update: {
			username: json.username
		}
	});
	await db.message.create({
		data: {
			userUsername: json.username,
			content: json.message
		}
	});
}

export async function loadPersistentMessages(json: any, ws: WebSocket, db: PrismaClient) {
	const messages = await db.message.findMany({
		take: json.oldMessageCount
	});
	ws.send(
		JSON.stringify({
			type: 'oldMessages',
			messages: messages
		})
	);
}
