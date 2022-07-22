import { CommandMessage } from "../CommandMessage";
import { CommandType } from "../CommandType";
import { PlayerState } from "../data_types/PlayerState";

export interface AppendPlayerMessage extends CommandMessage
{
	type: CommandType.SV_APPEND_PLAYER;
	data: {
		state: PlayerState;
		index: number;
	};
}
