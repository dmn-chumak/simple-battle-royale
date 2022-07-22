import { UpdateWorldMessage } from "../../common/server_messages/UpdateWorldMessage";
import { ClientCommand } from "../ClientCommand";

export class UpdateWorldCommand extends ClientCommand<UpdateWorldMessage>
{
	public override execute(): void
	{
		const { playersMap } = this._message.data;

		for (const playerIndex in playersMap)
		{
			const player = this._scene.playersMap[playerIndex];
			const playerState = playersMap[playerIndex];
			player.x = playerState.x;
			player.y = playerState.y;
		}
	}
}
