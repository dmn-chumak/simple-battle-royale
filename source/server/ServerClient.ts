import { WebSocket } from "ws";
import { Command } from "../common/Command";
import { CommandMessageEncoder } from "../common/CommandMessageEncoder";
import { Player } from "./battle/Player";
import { ServerOutcomeMessageType } from "../common/ServerOutcomeMessageType";
import { ClientOutcomeMessageType } from "../common/ClientOutcomeMessageType";

export class ServerClient
{
	private readonly _socket: WebSocket;
	private readonly _commandsList: Command<ClientOutcomeMessageType>[];
	private readonly _index: number;
	private readonly _player: Player;
	private _userId: string;

	public constructor(socket: WebSocket, index: number)
	{
		this._player = new Player(index);
		this._commandsList = [];
		this._index = index;
		this._socket = socket;
	}

	public sendMessage(message: ServerOutcomeMessageType): void
	{
		if (this._socket)
		{
			this._socket.send(CommandMessageEncoder.encode(message));
		}
	}

	public get socket(): WebSocket
	{
		return this._socket;
	}

	public get commandsList(): Command<ClientOutcomeMessageType>[]
	{
		return this._commandsList;
	}

	public get index(): number
	{
		return this._index;
	}

	public get player(): Player
	{
		return this._player;
	}

	public get userId(): string
	{
		return this._userId;
	}

	public set userId(value: string)
	{
		this._userId = value;
	}
}
