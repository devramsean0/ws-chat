import { bgBlue, bgGreen, bgWhite, bgYellow, black, white, gray } from "colorette";
import { WebSocketServer } from "ws";
export function createServer(port = 8080) {
    const wss = new WebSocketServer({ port })
    const clients = new Set();

    // WSS implementation
    wss.on('listening', () => {
        console.log(bgBlue(white('[WSS]')), `Listening on port ${port}`)
    })
    wss.on('error', (error) => {
        console.log(bgRed(white('[WSS] ERROR')), error)
    })
    wss.on('connection', (ws) => {
        console.log(bgGreen(white('[WS]')), 'Recieved new connection')
        clients.add(ws);

        ws.on('close', () => {
            console.log(bgYellow(white('[WS]')), 'Closed connection')
            clients.delete(ws)
        })
        ws.on('error', (error) => {
            console.log(bgRed(white('[WS] ERROR')), error)
        })
        ws.on('message', (message) => {
            console.log(bgWhite(black('[WS] MESSAGE')), `${gray('>')} ${message.toString('utf8')}`)
            broadcast(message, ws)
        })
        ws.on('open', () => {
            console.log(bgGreen(white('[WS]')), 'WebSocket reconnected')
            clients.add(ws)
        })
    })
    function broadcast(message, source) {
		for (const client of clients) {
			if (client === source) continue;
			client.send(message, (error) => {
				if (error) console.error(red('[WS]'), 'Error while sending message:', error);
			});
		}
	}

	return { wss, broadcast };
}