import { CommandMessage } from "../CommandMessage";
import { CommandType } from "../CommandType";

export interface ClientBodyState
{
	id: number;
	x: number;
	y: number;
}

export interface WorldUpdatedMessage extends CommandMessage
{
	type: CommandType.SV_WORLD_UPDATED;
	data: ClientBodyState[];
}
