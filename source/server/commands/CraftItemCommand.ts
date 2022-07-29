import { CraftItemMessage } from "../../common/client_messages/CraftItemMessage";
import { CommandType } from "../../common/CommandType";
import { IItemData } from "../../common/data_types/IItemData";
import { ServerCommand } from "../ServerCommand";
import { AVAILABLE_RECIPES } from "../types/AvailableResipes";

export class CraftItemCommand extends ServerCommand<CraftItemMessage>
{
	public override execute(): void
	{
		const { recipeId } = this._message.data;
		console.log(`Crafring recipe: ${ recipeId }`);

		// TODO: move to craft manager with proper error validation
		const recipe = AVAILABLE_RECIPES.find((recipe) => recipe.id === recipeId);
		if (recipe)
		{
			this._client.sendMessage({
				type: CommandType.SV_ADD_ITEMS,
				data: {
					items: [
						{
							type: recipe.result,
							quantity: 1
						}
					] as IItemData[]
				}
			});
		}
	}
}
