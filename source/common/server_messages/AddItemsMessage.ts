import { CommandMessage } from "../CommandMessage";
import { CommandType } from "../CommandType";
import { ItemToAdd } from "../data_types/ItemToAdd";

export interface AddItemsMessage extends CommandMessage
{
	type: CommandType.SV_ADD_ITEMS;
	data: {
		items: ItemToAdd[];
	};
}
