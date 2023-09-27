# WS-CHAT

A low resources chat service that communicates over Websockets

## Setup

### Installimg the libary

#### Yarn

`yarn global add @devramsean0/ws-chat`

#### NPM

`npm install -g @devramsean0/ws-chat`

### Setting up a server

To setup a server in it's most basic form run the command:
`ws-chat server`
Alternatively you can replicate [docker-compose.yml](https://github.com/devramsean0/ws-chat/blob/main/docker-compose.yml) Subsituting in your own build args after git cloning (`git clone https://github.com/devramsean0/ws-chat.git`) this repository
To change the port to listen on add the argument
`--port <port>`
To set an authCode add the argument `--authCode <code>`
To change the time between each Ping check add the argument `--heartbeatTime <time in ms>`

### Setting up a client

To connect a client to a server running locally run the command `ws-chat client --username <a username>`
To connect a client to a remote server add the following argument `--ip <server IP / Domain>`
To connect to a server running on a different port to 8080 add the following argument `--port <port>`
To connect to a server with an auth code set add the following argument
`--authCode <code provided by server admin>`

## Message Schema

This is the object that carries all custom data over the WS

### `type == "message"`

```json
{
    "type": "message",
    "username": string,
    "message": message,
    "authCode": string,
    "password": md5String
}
```

### `type == "authFail"`

```json
{
	"type": "authFail",
	"step": "password | authToken"
}
```

### `type == "authREQ"`

````json
{
    "type": "authREQ",
    "authCode": string,
    "password": string,
    "username": string,
    "oldMessageCount": number,
}

### `type = "join/leave"`

```json
{
    "type": "join/leave",
    "status": "joined" | "left" | "reconnected"
}
````

**Thanks to [kyranet/tiny-chat](https://github.com/kyranet/tiny-chat/) for the inspiration behind this project**
