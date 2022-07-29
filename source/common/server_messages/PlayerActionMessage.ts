import { CommandMessage } from "../CommandMessage";
import { CommandType } from "../CommandType";
import { ActionType } from "../data_types/ActionType";

export interface PlayerActionMessage extends CommandMessage
{
	type: CommandType.SV_PLAYER_ACTION;
	data: {
		playerIndex: number,
		action: ActionType
	};
}