import { ChangeDirectionMessage } from "../../common/client_messages/ChangeDirectionMessage";
import { PLAYER_SPEED } from "../../common/GameConfig";
import { ServerCommand } from "../ServerCommand";

export class ChangeDirectionCommand extends ServerCommand<ChangeDirectionMessage>
{
	public override execute(): void
	{
		const { deltaX, deltaY } = this._message.data;

		if (this._client.player.isAlive)
		{
			this._client.player.body.velocity.x += deltaX * PLAYER_SPEED;
			this._client.player.body.velocity.z += deltaY * PLAYER_SPEED;
		}
	}
}
