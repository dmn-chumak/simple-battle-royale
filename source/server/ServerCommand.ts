import { Command } from "../common/Command";
import { CommandMessage } from "../common/CommandMessage";
import { ServerApplication } from "./ServerApplication";
import { ServerClient } from "./ServerClient";

export abstract class ServerCommand<MessageType extends CommandMessage> extends Command<MessageType>
{
	protected readonly _server: ServerApplication;
	protected readonly _client: ServerClient;

	public constructor(message: MessageType, server: ServerApplication, client: ServerClient)
	{
		super(message);

		this._server = server;
		this._client = client;
	}
}
