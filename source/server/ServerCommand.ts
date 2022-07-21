import { Command } from "../common/Command";
import { CommandMessage } from "../common/CommandMessage";
import { GameClientState } from "./GameClientState";
import { GameServer } from "./GameServer";

export abstract class ServerCommand<MessageType extends CommandMessage> extends Command<MessageType>
{
	protected readonly _client: GameClientState;
	protected readonly _server: GameServer;

	public constructor(message: MessageType, server: GameServer, client: GameClientState)
	{
		super(message);

		this._client = client;
		this._server = server;
	}
}
