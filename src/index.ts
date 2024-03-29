#! /usr/bin/env node
import { defineCommand, runMain } from 'citty';
import { createMainServer } from './server.js';
import { createClient } from './client.js';
import { createInput } from './reader.js';

const main = defineCommand({
	meta: {
		name: 'ws-chat',
		version: 'v1.0.0',
		description: 'A low resources chat service that communicates over Websockets'
	},
	subCommands: {
		server: {
			meta: {
				description: 'Start the Server'
			},
			args: {
				port: {
					valueHint: '8080',
					description: 'The port to listen for WS connections on'
				},
				heartbeatTime: {
					valueHint: 30000,
					description: 'The Time between Heartbeat, lower is sometimes better'
				},
				authCode: {
					valueHint: 'yourAuthCode',
					description: 'The auth code for the server (if AuthCode is empty, auth is disabled)'
				}
			},
			run({ args }) {
				createMainServer(
					args.port && Number(args.port),
					args.heartbeatTime && Number(args.heartbeatTime),
					args.authCode && String(args.authCode)
				);
			}
		},
		client: {
			meta: {
				description: 'Start a Client'
			},
			args: {
				ip: {
					valueHint: '127.0.0.1',
					description: 'The IP to connect to'
				},
				port: {
					valueHint: '8080',
					description: 'The port to connect to the WS on'
				},
				username: {
					valueHint: 'YourUsername',
					description: 'The username you want to use',
					required: true
				},
				authCode: {
					valueHint: 'YourAuthCode',
					description: 'The auth code of the server'
				},
				oldMessageCount: {
					valueHint: 100,
					description: 'How many old messages to return'
				},
				password: {
					valueHint: 'password1234',
					description: 'The password to be assigned to your username',
					required: true
				}
			},
			run({ args }) {
				const { ws, sendMessage } = createClient(
					args.ip && String(args.ip),
					args.port && Number(args.port),
					args.username && String(args.username),
					args.authCode && String(args.authCode),
					args.oldMessageCount && Number(args.oldMessageCount),
					args.password && String(args.password)
				);
				createInput(sendMessage, ws);
			}
		}
	}
});
runMain(main);

export * from './server.js';
export * from './client.js';
export * from './reader.js';
