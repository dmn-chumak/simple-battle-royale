import { CommandMessage } from "../CommandMessage";
import { CommandType } from "../CommandType";
import { IItemData } from "../data_types/IItemData";

export interface AddItemsMessage extends CommandMessage
{
	type: CommandType.SV_ADD_ITEMS;
	data: {
		items: IItemData[];
	};
}
