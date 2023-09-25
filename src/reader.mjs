import { createInterface } from "readline"
export function createInput(send, ws) {
    const reader = createInterface({
		input: process.stdin,
		output: undefined
	});
	reader.on('line', (line) => {
		send(line);
	});

	ws.on('close', () => reader.close());
}