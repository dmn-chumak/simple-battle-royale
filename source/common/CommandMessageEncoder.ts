import { CommandMessage } from "./CommandMessage";

export class CommandMessageEncoder
{
	public static encode(message: CommandMessage): string
	{
		return JSON.stringify(message);
	}
}
