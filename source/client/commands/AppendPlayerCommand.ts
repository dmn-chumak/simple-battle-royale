import { AppendPlayerMessage } from "../../common/server_messages/AppendPlayerMessage";
import { PlayerView } from "../battle/PlayerView";
import { ClientCommand } from "../ClientCommand";

export class AppendPlayerCommand extends ClientCommand<AppendPlayerMessage>
{
	public override execute(): void
	{
		const { index, state } = this._message.data;

		this._scene.appendPlayer(
			new PlayerView(state.type),
			index, state
		);
	}
}
