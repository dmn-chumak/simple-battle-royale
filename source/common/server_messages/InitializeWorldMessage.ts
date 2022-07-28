import { CommandMessage } from "../CommandMessage";
import { CommandType } from "../CommandType";
import { PlayerState } from "../data_types/PlayerState";
import { PlayerStateMap } from "../data_types/PlayerStateMap";
import { Recipe } from "../data_types/Recipe";

export interface InitializeWorldMessage extends CommandMessage
{
	type: CommandType.SV_INITIALIZE_WORLD;
	data: {
		state: PlayerState;
		playersMap: PlayerStateMap;
		recipes: Recipe[];
		index: number;
	};
}
