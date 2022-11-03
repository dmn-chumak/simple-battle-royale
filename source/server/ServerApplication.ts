import * as Express from "express";
import { WebSocket } from "ws";
import { WebSocketServer } from "ws";

import { CommandMessageDecoder } from "../common/CommandMessageDecoder";
import { CommandMessageEncoder } from "../common/CommandMessageEncoder";
import { CommandType } from "../common/CommandType";
import { SERVER_FRAME_RATE } from "../common/GameConfig";
import { SERVER_PORT } from "../common/GameConfig";
import { ServerOutcomeMessageType } from "../common/ServerOutcomeMessageType";
import { BattleArena } from "./battle/BattleArena";
import { DBManager } from "./db/DBManager";
import { sequelize } from "./db/Sequelizer";
import { ServerClient } from "./ServerClient";
import { AVAILABLE_RECIPES } from "./types/AvailableResipes";
import { COMMAND_FACTORY } from "./types/ServerCommandFactory";

export class ServerApplication
{
	private readonly _express: Express.Application;
	private readonly _db: DBManager;
	private readonly _battleArena: BattleArena;
	private readonly _clients: ServerClient[];

	private _server: WebSocketServer;
	private _timer: NodeJS.Timer;
	private _nextClientIndex: number;

	public constructor()
	{
		this._express = Express();
		this._express.use(Express.static("resource"));

		this._db = new DBManager();

		this._battleArena = new BattleArena(this);
		this._clients = [];
		this._nextClientIndex = 0;

		this._server = null;
	}

	private serverFrameHandler = (): void =>
	{
		for (const client of this._clients)
		{
			client.player.beforeUpdateFrame();

			while (client.commandsList.length > 0)
			{
				client.commandsList.shift().execute();
			}

			client.player.updateFrame();
		}

		this._battleArena.updateFrame();

		this.broadcastMessage({
			type: CommandType.SV_UPDATE_WORLD,
			data: {
				playersMap: this._battleArena.getCurrentStateMap()
			}
		});
	};

	private socketConnectHandler = (socket: WebSocket): void =>
	{
		const client = new ServerClient(socket, this._nextClientIndex++);
		console.log(`>> Client ${ client.index } connected`);

		client.player.enterBattleArena(this._battleArena);

		socket.on("message", this.socketMessageHandler.bind(this, client));
		socket.on("close", this.socketCloseHandler.bind(this, client));

		client.sendMessage({
			type: CommandType.SV_INITIALIZE_WORLD,
			data: {
				state: client.player.getCurrentState(),
				playersMap: this._battleArena.getCurrentStateMap(),
				recipes: AVAILABLE_RECIPES,
				index: client.index
			}
		});

		this.broadcastMessage({
			type: CommandType.SV_APPEND_PLAYER,
			data: {
				state: client.player.getCurrentState(),
				index: client.index
			}
		});

		this._clients.push(client);
	};

	private socketMessageHandler = (client: ServerClient, buffer: Buffer): void =>
	{
		const message = CommandMessageDecoder.decode(buffer.toString("utf-8"));
		const commandType = COMMAND_FACTORY[message.type];
		const command = new commandType(message, this, client);
		client.commandsList.push(command);
	};

	private socketCloseHandler = (client: ServerClient): void =>
	{
		this._clients.splice(this._clients.indexOf(client), 1);
		console.log(`<< Client ${ client.index } disconnected`);

		client.player.leaveBattleArena();

		this.broadcastMessage({
			type: CommandType.SV_REMOVE_PLAYER,
			data: {
				index: client.index
			}
		});
	};

	public broadcastMessage(message: ServerOutcomeMessageType): void
	{
		const encoded = CommandMessageEncoder.encode(message);

		for (const client of this._clients)
		{
			if (client.socket)
			{
				client.socket.send(encoded);
			}
		}
	}

	public start(): void
	{
		sequelize.sync({ alter: true }).then(() =>
		{
			const httpServer = this._express.listen(process.env.PORT || SERVER_PORT);
			this._server = new WebSocketServer({ server: httpServer });
			this._server.on("connection", this.socketConnectHandler);

			this._timer = setInterval(this.serverFrameHandler, SERVER_FRAME_RATE);
			this.serverFrameHandler();

			console.log(">> Server started!");
		});
	}

	public get battleArena(): BattleArena
	{
		return this._battleArena;
	}

	public get clients(): ServerClient[]
	{
		return this._clients;
	}

	public get db(): DBManager
	{
		return this._db;
	}
}
