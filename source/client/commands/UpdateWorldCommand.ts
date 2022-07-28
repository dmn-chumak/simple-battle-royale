import { PlayerState } from "../../common/data_types/PlayerState";
import { UpdateWorldMessage } from "../../common/server_messages/UpdateWorldMessage";
import { PlayerView } from "../battle/PlayerView";
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
			player.position.z = playerState.y;
			this.updateHpState(playerState, player);
		}

		this._scene.updateHealthValue();
	}

	private updateHpState(playerState: PlayerState, player: PlayerView): void
	{
		player.maxHp = playerState.maxHP;
		player.currHp = playerState.currHP;
	}
}
