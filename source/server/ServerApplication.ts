import bodyParser from "body-parser";
import * as Express from "express";
import { IncomingMessage } from "http";
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
import { Match } from "./db/models/Match";
import { User } from "./db/models/User";
import { sequelize } from "./db/Sequelizer";
import { ServerClient } from "./ServerClient";
import { AVAILABLE_RECIPES } from "./types/AvailableResipes";
import { COMMAND_FACTORY } from "./types/ServerCommandFactory";

export class ServerApplication
{
	public static readonly MAX_PLAYERS_IN_BATTLE: number = 2;

	private readonly _express: Express.Application;
	private readonly _db: DBManager;
	private readonly _battleArenas: BattleArena[];
	private readonly _allClients: ServerClient[];
	private _waitingClients: ServerClient[];

	private _server: WebSocketServer;
	private _timer: NodeJS.Timer;
	private _nextClientIndex: number;

	public constructor()
	{
		this._express = Express();
		this._express.use(Express.static("resource"));
		this._express.use(bodyParser.json());

		this._express.post('/auth', (req, res) => {
			this.processAuth(req.body.login, req.body.pass).then((code: number) => {
				res.status(code).json({});
			});
		});

		this._db = new DBManager();

		this._battleArenas = [];
		this._allClients = [];
		this._waitingClients = [];
		this._nextClientIndex = 0;

		this._server = null;
	}

	private serverFrameHandler = (): void => {
		this._battleArenas.forEach((arena) => {
			for (const client of arena.clients)
			{
				client.player.beforeUpdateFrame();

				while (client.commandsList.length > 0)
				{
					client.commandsList.shift().execute();
				}

				client.player.updateFrame();
			}

			arena.updateFrame();

			this.broadcastMessage({
				type: CommandType.SV_UPDATE_WORLD,
				data: {
					playersMap: arena.getCurrentStateMap()
				}
			}, arena.clients);
		});
	};

	private socketConnectHandler = (socket: WebSocket, request: IncomingMessage): void => {
		const client = new ServerClient(socket, this._nextClientIndex++);
		const userId: string = this.getJsonFromUrl(request.url).userId as string;
		client.userId = userId;
		console.log(`>> Client ${client.index} connected, userId: ${userId}`);

		this._allClients.push(client);
		this._waitingClients.push(client);

		if (this._waitingClients.length >= ServerApplication.MAX_PLAYERS_IN_BATTLE)
		{
			this.startBattle(this._waitingClients);
			this._waitingClients = [];
		}

		socket.on("message", this.socketMessageHandler.bind(this, client));
		socket.on("close", this.socketCloseHandler.bind(this, client));
	};

	private startBattle(clients: ServerClient[]): void
	{
		const userIds: string[] = clients.map((client) => client.userId);
		this._db.createMatch(userIds).then((match: Match) => {
			const newBattleArena = new BattleArena(this, match.matchId);

			for (let index in clients)
			{
				const client = clients[index];
				client.player.enterBattleArena(newBattleArena, client);

				client.sendMessage({
					type: CommandType.SV_INITIALIZE_WORLD,
					data: {
						state: client.player.getCurrentState(),
						playersMap: newBattleArena.getCurrentStateMap(),
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
				}, clients);
			}

			this._battleArenas.push(newBattleArena);
		});
	}

	private socketMessageHandler = (client: ServerClient, buffer: Buffer): void => {
		const message = CommandMessageDecoder.decode(buffer.toString("utf-8"));
		const commandType = COMMAND_FACTORY[message.type];
		const command = new commandType(message, this, client);
		client.commandsList.push(command);
	};

	private socketCloseHandler = (client: ServerClient): void => {
		this._allClients.splice(this._allClients.indexOf(client), 1);
		console.log(`<< Client ${client.index} disconnected`);

		client.player.leaveBattleArena(client);
	};

	protected async processAuth(login: string, pass: string): Promise<number>
	{
		const user: User = await this._db.login(login, pass);
		if (user)
		{
			return 200;
		}
		return 401;
	}

	public broadcastMessage(message: ServerOutcomeMessageType, clients: ServerClient[]): void
	{
		const encoded = CommandMessageEncoder.encode(message);

		for (const client of clients)
		{
			if (client.socket)
			{
				client.socket.send(encoded);
			}
		}
	}

	public start(): void
	{
		sequelize.sync({alter: true}).then(() => {
			const httpServer = this._express.listen(process.env.PORT || SERVER_PORT);

			this._server = new WebSocketServer({server: httpServer});
			this._server.on("connection", this.socketConnectHandler);

			this._timer = setInterval(this.serverFrameHandler, SERVER_FRAME_RATE);
			this.serverFrameHandler();

			console.log(">> Server started!");
		});
	}

	public getJsonFromUrl(url: string): any
	{
		const result = {};
		const query = url.substring(2);
		query.split("&").forEach((part) => {
			const item = part.split("=");
			//@ts-ignore
			result[item[0]] = decodeURIComponent(item[1]);
		});
		return result;
	}
}
