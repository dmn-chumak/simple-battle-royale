import { CommandMessage } from "../CommandMessage";
import { CommandType } from "../CommandType";
import { ClientBodyState } from "./WorldUpdatedMessage";

export interface ClientBodyInitState extends ClientBodyState
{
	color: number;
}

export interface ClientInitMessage extends CommandMessage
{
	type: CommandType.SV_CLIENT_INIT;
	data: {
		clients: ClientBodyInitState[];
		client: ClientBodyInitState;
	};
}
