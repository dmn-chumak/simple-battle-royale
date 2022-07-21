import { CommandMessage } from "../CommandMessage";
import { CommandType } from "../CommandType";

export interface ClientRemovedMessage extends CommandMessage
{
	type: CommandType.SV_CLIENT_REMOVED;
	data: number;
}
