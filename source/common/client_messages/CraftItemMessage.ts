import { CommandMessage } from "../CommandMessage";
import { CommandType } from "../CommandType";

export interface CraftItemMessage extends CommandMessage
{
	type: CommandType.CL_CRAFT_ITEM,
	data: {
		recipeId: number;
	};
}
