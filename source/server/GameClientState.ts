import { b2Body } from "@box2d/core";
import { WebSocket } from "ws";
import { ClientStateData } from "../common/ClientStateData";
import { CommandMessageEncoder } from "../common/CommandMessageEncoder";
import { ServerOutcomeMessageType } from "./types/ServerOutcomeMessageType";

export class GameClientState
{
	private readonly _socket: WebSocket;
	private readonly _data: ClientStateData;
	private readonly _body: b2Body;

	public constructor(socket: WebSocket, data: ClientStateData, body: b2Body)
	{
		this._socket = socket;
		this._data = data;
		this._body = body;
	}

	public send(message: ServerOutcomeMessageType): void
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

	public get data(): ClientStateData
	{
		return this._data;
	}

	public get body(): b2Body
	{
		return this._body;
	}
}
