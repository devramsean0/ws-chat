# WS-CHAT

A low resources chat service that communicates over Websockets

## Message Schema

This is the object that carries all custom data over the WS

### `type == "message"`

```json
{
    "type": "message",
    "username": string,
    "password": message,
    "authCode": string
}
```

### `type == "authFail"`

```json
{
	"type": "authFail"
}
```

### `type = "join/leave"

```json
{
    "type": "join/leave",
    "status": "joined" | "left" | "reconnected"
}
```

**Thanks to [kyranet/tiny-chat](https://github.com/kyranet/tiny-chat/) for the inspiration behind this project**
