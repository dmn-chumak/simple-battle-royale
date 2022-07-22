import { RemovePlayerMessage } from "../../common/server_messages/RemovePlayerMessage";
import { ClientCommand } from "../ClientCommand";

export class RemovePlayerCommand extends ClientCommand<RemovePlayerMessage>
{
	public override execute(): void
	{
		const { index } = this._message.data;

		this._scene.removePlayer(
			this._scene.playersMap[index],
			index
		);
	}
}
