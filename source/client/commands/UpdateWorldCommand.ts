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

			this.checkDeath(playerState, player);
			player.isAlive = playerState.isAlive;

			player.position.x = playerState.x;
			player.position.y = playerState.y;
			player.position.z = playerState.z;

			player.weaponInfo = playerState.currWeapon;

			this.updateHpState(playerState, player);
		}

		this._scene.updateHealthValue();
		this._scene.updateCamera();

		if (!this._scene.player.isAlive)
		{
			this._scene.updateDeathText();
		}
	}

	private updateHpState(playerState: PlayerState, player: PlayerView): void
	{
		player.maxHp = playerState.maxHP;
		player.currHp = playerState.currHP;
	}

	private checkDeath(playerState: PlayerState, player: PlayerView): void
	{
		if (player.isAlive !== playerState.isAlive)
		{
			player.death();
		}
	}
}
