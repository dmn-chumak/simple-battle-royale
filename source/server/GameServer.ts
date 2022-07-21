import { b2BodyType } from "@box2d/core";
import { b2CircleShape } from "@box2d/core";
import { b2World } from "@box2d/core";
import * as Express from "express";
import { WebSocketServer } from "ws";
import { WebSocket } from "ws";
import { CommandMessageDecoder } from "../common/CommandMessageDecoder";
import { CommandMessageEncoder } from "../common/CommandMessageEncoder";
import { CommandType } from "../common/CommandType";
import { SERVER_PORT } from "../common/GameConfig";
import { CLIENT_SPEED } from "../common/GameConfig";
import { CLIENT_RADIUS } from "../common/GameConfig";
import { SERVER_FRAME_RATE } from "../common/GameConfig";
import { ChangeDirectionCommand } from "./commands/ChangeDirectionCommand";
import { ChangePositionCommand } from "./commands/ChangePositionCommand";
import { GameClientState } from "./GameClientState";
import { ServerCommandFactory } from "./types/ServerCommandFactory";
import { ServerOutcomeMessageType } from "./types/ServerOutcomeMessageType";

export class GameServer
{
	private _express: Express.Application;
	private _server: WebSocketServer;

	private readonly _commandsMap: ServerCommandFactory;

	private readonly _clients: GameClientState[];
	private _nextIndex: number;
	private readonly _world: b2World;

	private _bot: GameClientState;

	public constructor()
	{
		this._world = b2World.Create({ x: 0, y: 0 });

		this._express = Express();
		this._express.use(Express.static("resource"));

		this._nextIndex = 0;
		this._clients = [];

		const shape = new b2CircleShape(CLIENT_RADIUS);
		const body = this._world.CreateBody({
			type: b2BodyType.b2_dynamicBody,
			position: {
				x: 100 + 600 * Math.random(),
				y: 100 + 300 * Math.random()
			}
		});
		body.SetSleepingAllowed(false);
		body.CreateFixture({ shape });
		body.ResetMassData();

		this._bot = new GameClientState(
			null,
			{
				id: this._nextIndex++,
				color: 0xFFFFFF * Math.random()
			},
			body
		);

		this._clients.push(this._bot);

		this._commandsMap = {
			[CommandType.CL_CHANGE_POSITION]: ChangePositionCommand,
			[CommandType.CL_CHANGE_DIRECTION]: ChangeDirectionCommand
		};

		setInterval(this.updateState.bind(this), SERVER_FRAME_RATE);
	}

	private updateState(): void
	{
		for (const client of this._clients)
		{
			if (client.data.targetX != null)
			{
				client.body.SetTransformXY(
					client.data.targetX,
					client.data.targetY,
					0
				);

				client.data.targetX = null;
				client.data.targetY = null;
			}

			if (client.data.deltaX != null)
			{
				client.body.SetLinearVelocity({
					x: client.data.deltaX * CLIENT_SPEED,
					y: client.data.deltaY * CLIENT_SPEED
				});
			}
		}

		this._bot.body.SetLinearVelocity({
			x: Math.random() * CLIENT_SPEED,
			y: Math.random() * CLIENT_SPEED
		});

		this._world.Step(SERVER_FRAME_RATE, { positionIterations: 3, velocityIterations: 3 });

		this.send({
			type: CommandType.SV_WORLD_UPDATED,
			data: this._clients.map((client) =>
			{
				return {
					id: client.data.id,
					x: client.body.GetPosition().x,
					y: client.body.GetPosition().y
				};
			})
		});
	}

	private socketConnectHandler(socket: WebSocket): void
	{
		const shape = new b2CircleShape(CLIENT_RADIUS);
		const body = this._world.CreateBody({
			type: b2BodyType.b2_dynamicBody,
			position: {
				x: 100 + 600 * Math.random(),
				y: 100 + 300 * Math.random()
			}
		});
		body.SetSleepingAllowed(false);
		body.CreateFixture({ shape });
		body.ResetMassData();

		//-------------------

		const client = new GameClientState(
			socket, {
				id: this._nextIndex++,
				color: 0xFFFFFF * Math.random()
			},
			body
		);

		//-------------------

		socket.on("message", this.socketMessageHandler.bind(this, client));
		socket.on("close", this.socketCloseHandler.bind(this, client));
		console.log(">> Client #" + client.data.id + " connected");

		//-------------------

		client.send({
			type: CommandType.SV_CLIENT_INIT,
			data: {
				clients: this._clients.map(state =>
				{
					return {
						id: state.data.id,
						color: state.data.color,
						x: state.body.GetPosition().x,
						y: state.body.GetPosition().y
					};
				}),
				client: {
					id: client.data.id,
					color: client.data.color,
					x: client.body.GetPosition().x,
					y: client.body.GetPosition().y
				}
			}
		});

		this.send({
			type: CommandType.SV_CLIENT_ADDED,
			data: {
				id: client.data.id,
				color: client.data.color,
				x: client.body.GetPosition().x,
				y: client.body.GetPosition().y
			}
		});

		this._clients.push(client);
	}

	private socketMessageHandler(client: GameClientState, buffer: Buffer): void
	{
		const message = CommandMessageDecoder.decode(buffer.toString("utf-8"));
		const commandType = this._commandsMap[message.type];
		const command = new commandType(message, this, client);

		command.execute();
	}

	private socketCloseHandler(client: GameClientState): void
	{
		this._clients.splice(this._clients.indexOf(client), 1);
		console.log("<< Client #" + client.data.id + " disconnected");

		this.send({
			type: CommandType.SV_CLIENT_REMOVED,
			data: client.data.id
		});
	}

	public start(): void
	{
		const httpServer = this._express.listen(process.env.PORT || SERVER_PORT);

		this._server = new WebSocketServer({ server: httpServer });
		this._server.on("connection", this.socketConnectHandler.bind(this));

		console.log(">> Server started!");
	}

	public send(message: ServerOutcomeMessageType): void
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

	public get clients(): GameClientState[]
	{
		return this._clients;
	}
}
