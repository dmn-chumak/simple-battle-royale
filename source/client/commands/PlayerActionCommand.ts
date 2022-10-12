import { ActionType } from "../../common/data_types/ActionType";
import { PlayerActionMessage } from "../../common/server_messages/PlayerActionMessage";
import { PlayerView } from "../battle/PlayerView";
import { ClientCommand } from "../ClientCommand";

export class PlayerActionCommand extends ClientCommand<PlayerActionMessage>
{
	public execute(): void
	{
		const { playerIndex, action } = this._message.data;
		const player = this._scene.playersMap[playerIndex];

		this.handleAction(player, action);

	}

	protected handleAction(player: PlayerView, action: ActionType): void
	{
		switch (action)
		{
			case ActionType.ATTACK:
			{
				if (player !== this._scene.player)
				{
					player.punch();
				}
				break;
			}
			case ActionType.HIT:
			{
				player.receiveDamage();
				break;
			}
			case ActionType.DEATH:
			{
				player.death();
				break;
			}
		}
	}
}