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
			player.position.x = playerState.x;
			player.position.y = playerState.y;
			player.position.z = playerState.z;
		}
	}
}
