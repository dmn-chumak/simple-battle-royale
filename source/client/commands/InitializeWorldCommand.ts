import { InitializeWorldMessage } from "../../common/server_messages/InitializeWorldMessage";
import { MovablePlayerView } from "../battle/MovablePlayerView";
import { PlayerView } from "../battle/PlayerView";
import { ClientCommand } from "../ClientCommand";

export class InitializeWorldCommand extends ClientCommand<InitializeWorldMessage>
{
	public override execute(): void
	{
		const { index, playersMap, state } = this._message.data;
		const { application } = this._scene.manager;

		for (const playerIndex in playersMap)
		{
			const playerState = playersMap[playerIndex];

			this._scene.appendPlayer(
				new PlayerView(playerState.color),
				parseInt(playerIndex),
				playerState
			);
		}

		this._scene.player = new MovablePlayerView(
			application, state.color
		);

		this._scene.appendPlayer(
			this._scene.player,
			index, state
		);
	}
}
