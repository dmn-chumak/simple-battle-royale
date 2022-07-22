import { CommandMessage } from "../CommandMessage";
import { CommandType } from "../CommandType";
import { PlayerStateMap } from "../data_types/PlayerStateMap";

export interface UpdateWorldMessage extends CommandMessage
{
	type: CommandType.SV_UPDATE_WORLD;
	data: {
		playersMap: PlayerStateMap;
	};
}
