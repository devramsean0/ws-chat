import { createInterface } from 'readline';
export function createInput(send: any, ws: any) {
	const reader = createInterface({
		input: process.stdin,
		output: undefined
	});
	reader.on('line', (line) => {
		send(line);
	});

	ws.on('close', () => reader.close());
}
