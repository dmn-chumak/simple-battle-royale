import { CommandMessage } from "../CommandMessage";
import { CommandType } from "../CommandType";
import { ClientBodyInitState } from "./ClientInitMessage";

export interface ClientAddedMessage extends CommandMessage
{
	type: CommandType.SV_CLIENT_ADDED;
	data: ClientBodyInitState;
}
