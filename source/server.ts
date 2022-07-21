import { WebSocketServer } from "ws";
import { SERVER_PORT } from "./common/GameConfig";
import { SERVER_HOST } from "./common/GameConfig";
import { GameServer } from "./server/GameServer";

const server = new GameServer();

server.start(
	new WebSocketServer({
		host: SERVER_HOST,
		port: SERVER_PORT
	})
);
