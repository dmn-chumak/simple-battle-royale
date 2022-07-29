import { AddItemsMessage } from "../../common/server_messages/AddItemsMessage";
import { ClientCommand } from "../ClientCommand";

export class AddItemsCommand extends ClientCommand<AddItemsMessage>
{
	public override execute(): void
	{
		const { items } = this._message.data;

		this._scene.addItemsToInventory(items);
	}
}
