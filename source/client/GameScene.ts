import { Graphics } from "pixi.js";
import { CommandMessageDecoder } from "../common/CommandMessageDecoder";
import { CommandMessageEncoder } from "../common/CommandMessageEncoder";
import { ClientBodyInitState } from "../common/commands/ClientInitMessage";
import { CommandType } from "../common/CommandType";
import { CLIENT_RADIUS } from "../common/GameConfig";
import { ClientAddedCommand } from "./commands/ClientAddedCommand";
import { ClientInitCommand } from "./commands/ClientInitCommand";
import { ClientRemovedCommand } from "./commands/ClientRemovedCommand";
import { WorldUpdateCommand } from "./commands/WorldUpdateCommand";
import { Scene } from "./Scene";
import { SceneManager } from "./SceneManager";
import { ClientCommandFactory } from "./types/ClientCommandFactory";
import { ClientOutcomeMessageType } from "./types/ClientOutcomeMessageType";

export class GameScene extends Scene
{
	private readonly _commandsMap: ClientCommandFactory;

	private readonly _clients: ClientBodyInitState[];
	private readonly _clientsMap: { [id: number]: Graphics };
	private _client: ClientBodyInitState;

	private _keysMap: { [id: string]: boolean };

	public constructor()
	{
		super();

		this._clientsMap = {};
		this._client = null;
		this._clients = [];

		this._keysMap = {};

		this._commandsMap = {
			[CommandType.SV_CLIENT_ADDED]: ClientAddedCommand,
			[CommandType.SV_CLIENT_INIT]: ClientInitCommand,
			[CommandType.SV_CLIENT_REMOVED]: ClientRemovedCommand,
			[CommandType.SV_WORLD_UPDATED]: WorldUpdateCommand
		};
	}

	public override start(manager: SceneManager): void
	{
		super.start(manager);

		manager.socket.onmessage = (event) =>
		{
			const message = CommandMessageDecoder.decode(event.data);
			const commandType = this._commandsMap[message.type];
			const command = new commandType(message, this);

			command.execute();
		};

		document.body.onkeydown = (event) =>
		{
			this._keysMap[event.code] = true;
		};

		document.body.onkeyup = (event) =>
		{
			this._keysMap[event.code] = false;
		};

		document.body.onmousedown = (event) =>
		{
			this.send({
				type: CommandType.CL_CHANGE_POSITION,
				data: {
					x: event.pageX,
					y: event.pageY
				}
			});
		};
	}

	public override update(delta: number): void
	{
		super.update(delta);

		let deltaX = 0;
		let deltaY = 0;

		if (this._keysMap["ArrowLeft"])
		{
			deltaX = -1;
		}

		if (this._keysMap["ArrowRight"])
		{
			deltaX = 1;
		}

		if (this._keysMap["ArrowUp"])
		{
			deltaY = -1;
		}

		if (this._keysMap["ArrowDown"])
		{
			deltaY = 1;
		}

		this.send({
			type: CommandType.CL_CHANGE_DIRECTION,
			data: {
				deltaX, deltaY
			}
		});
	}

	public send(message: ClientOutcomeMessageType): void
	{
		this._manager.socket.send(CommandMessageEncoder.encode(message));
	}

	public createClient(state: ClientBodyInitState): void
	{
		const graphics = new Graphics();

		graphics.beginFill(state.color);
		graphics.drawCircle(0, 0, CLIENT_RADIUS);
		graphics.endFill();
		graphics.x = state.x;
		graphics.y = state.y;

		this._clients.push(state);
		this._clientsMap[state.id] = graphics;
		this.addChild(graphics);
	}

	public initializeClient(state: ClientBodyInitState): void
	{
		this._client = state;
	}

	public removeClient(id: number): void
	{
		const graphics = this._clientsMap[id];

		if (graphics)
		{
			delete this._clientsMap[id];
			this._clients.splice(this._clients.findIndex(state => state.id === id), 1);
			this.removeChild(graphics);
		}
	}

	public get clients(): ClientBodyInitState[]
	{
		return this._clients;
	}

	public get clientsMap(): { [id: number]: Graphics }
	{
		return this._clientsMap;
	}

	public get client(): ClientBodyInitState
	{
		return this._client;
	}
}
