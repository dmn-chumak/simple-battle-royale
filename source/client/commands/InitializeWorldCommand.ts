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
				new PlayerView(playerState.type),
				parseInt(playerIndex),
				playerState
			);
		}

		this._scene.player = new MovablePlayerView(
			application, state.type
		);

		this._scene.appendPlayer(
			this._scene.player,
			index, state
		);
	}
}
