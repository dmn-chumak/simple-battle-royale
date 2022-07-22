import { CommandMessage } from "../CommandMessage";
import { CommandType } from "../CommandType";

export interface RemovePlayerMessage extends CommandMessage
{
	type: CommandType.SV_REMOVE_PLAYER;
	data: {
		index: number;
	};
}
