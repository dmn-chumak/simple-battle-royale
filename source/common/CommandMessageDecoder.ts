import { CommandMessage } from "./CommandMessage";

export class CommandMessageDecoder
{
	public static decode(message: string): CommandMessage
	{
		return JSON.parse(message);
	}
}
