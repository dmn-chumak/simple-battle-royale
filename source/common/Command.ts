import { CommandMessage } from "./CommandMessage";

export abstract class Command<MessageType extends CommandMessage>
{
	protected readonly _message: MessageType;

	public abstract execute(): void;

	public constructor(message: MessageType)
	{
		this._message = message;
	}
}
